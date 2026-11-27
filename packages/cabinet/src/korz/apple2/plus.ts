import type { Bus } from "../../m6502/m6502.js";
import { LanguageCard } from "./lang.js";
import { scanAddress, type ScanMode } from "./scan.js";

/**
 * The Apple ][+ motherboard, for the switch 6502 in `src/m6502`. Forty-eight kilobytes of RAM,
 * the twelve kilobytes of ROM at `$D000` (Applesoft, then the Autostart Monitor), and the `$C0`
 * page. Text and hires are that RAM. Every bus access is one cycle, and the video scanner's
 * address on that cycle is `scanAddress`. A read that nothing drives returns the byte at that
 * address: the speaker, the graphics switches, an empty slot, an empty `$C800`. The keyboard
 * drives the whole byte. The paddle and button inputs drive bit 7 and leave the scanner's
 * byte in the other bits.
 *
 * A cartridge plugs into expansion slots 1–7. Its ROM page is `$Cn00`, its switches are
 * `$C0n0`, and a read of its page selects its `$C800`–`$CFFF` ROM until `$CFFF`. The language
 * card is `installLanguageCard`: slot 0's `$C080`, banking its own RAM over `$D000`.
 *
 * The cabinet adds a panel no Apple had: `$C041`–`$C04F`, fifteen bytes of bits that both the
 * program and the person can flip, extended annunciators that need no slot. A read drives the
 * byte and changes nothing; a write latches the data bus. `$C040` stays the game port's strobe.
 *
 * The ROM is the caller's. microM8's `apple2-plus` profile is the oracle, read at `$D000`.
 */

/** A card in an expansion slot. `null` from a switch means the card does not drive the bus. */
export type Card = {
	rom?: Uint8Array;
	/** `$C800`–`$CFFF` while this slot is selected. */
	expansion?: Uint8Array;
	/** RAM in the `$C800` space, offset from `$C800`. Null leaves the byte to `expansion`. No side effects: `peek` calls it. */
	expansionRead?(offset: number): number | null;
	expansionWrite?(offset: number, value: number): void;
	readSwitch?(offset: number, cycles: number): number | null;
	writeSwitch?(offset: number, value: number, cycles: number): void;
};

export type VideoEvent = ScanMode & { cycle: number };

const ROM_BYTES = 0x3000;
/** The panel's first address and its length: `$C041`–`$C04F`, 120 bits. */
export const PANEL_BASE = 0xc041;
export const PANEL_BYTES = 15;

/**
 * A URL's `poke`: hex address, colon, hex bytes stored from there up, several separated by
 * commas, as `c041:5e008f19,0300:a9`. A `$` before the address is allowed. Pieces that are not
 * that shape are left out.
 */
export function parsePokes(text: string): { addr: number; bytes: Uint8Array }[] {
	const out: { addr: number; bytes: Uint8Array }[] = [];
	for (const piece of text.split(",")) {
		const m = /^\s*\$?([0-9a-f]{1,4})\s*:\s*((?:[0-9a-f]{2})+)\s*$/i.exec(piece);
		if (m) out.push({ addr: parseInt(m[1]!, 16), bytes: Uint8Array.from(m[2]!.match(/../g)!, (h) => parseInt(h, 16)) });
	}
	return out;
}

export class Apple2Plus implements Bus {
	readonly ram = new Uint8Array(0xc000);
	readonly rom: Uint8Array;
	/** Bit 7 set while a key is waiting. */
	key = 0;
	graphics = false;
	mixed = false;
	page2 = false;
	hires = false;
	/** The speaker's phase, flipped by every access to `$C030`. */
	speaker = 0;
	speakerClicks = 0;
	/** Cycles of those flips, drained by the page when it builds samples. */
	private speakerLog: number[] = [];
	/** The cassette output's phase, flipped by every access to `$C020`, as SAVE writes a tape. */
	tape = 0;
	/** Cycles of those flips, drained like the speaker's. */
	private tapeLog: number[] = [];
	/**
	 * The cassette input: the level on the tape at a cycle, 0 or 1, read as bit 7 of `$C060`
	 * (LOAD's input). Null, nothing is plugged in and the bit reads 0.
	 */
	tapeIn: ((cycle: number) => number) | null = null;
	/** Annunciators 0–3 in bits 0–3. */
	annunciators = 0;
	/** The panel's bytes, `$C041` first. Bit `n` is byte `n >> 3`, bit `n & 7`. */
	readonly panel = new Uint8Array(PANEL_BYTES);
	/** The last byte a device or a memory actually drove. */
	floating = 0;
	/** Bus cycles since power-on. Cycle 0 is the first blanking cycle of scan line 0. */
	cycles = 0;
	/** The slot whose `$C800` ROM is mapped, or 0 when none is. */
	expansion = 0;
	/** One entry each time text, mixed, page 2 or hires changes, including power-on. */
	readonly video: VideoEvent[] = [{ cycle: 0, graphics: false, mixed: false, page2: false, hires: false }];
	/** The language card, once `installLanguageCard` has put it in slot 0. */
	language: LanguageCard | null = null;
	private readonly cards: (Card | null)[] = [null, null, null, null, null, null, null, null];

	constructor(rom: Uint8Array) {
		if (rom.length !== ROM_BYTES) throw new Error(`Apple ][+ ROM is ${rom.length} bytes; the board takes ${ROM_BYTES}`);
		this.rom = rom.slice();
	}

	/** The 16K RAM card in slot 0. Reads come from the motherboard ROM until a switch says otherwise. */
	installLanguageCard(): LanguageCard {
		return (this.language = new LanguageCard());
	}

	/** Plug a cartridge into expansion slot `slot` (1–7), or pass null to pull it. */
	plug(slot: number, card: Card | null): void {
		if (slot < 1 || slot > 7) throw new Error(`expansion slot ${slot} is not 1–7`);
		this.cards[slot] = card;
		if (!card && this.expansion === slot) this.expansion = 0;
	}

	/** The person flips panel bit `n`, 0–119. */
	flip(n: number): void {
		if (n < 0 || n >= PANEL_BYTES * 8) return;
		this.panel[n >> 3]! ^= 1 << (n & 7);
	}

	/** The speaker flips since the last call, in cycle order. */
	takeSpeaker(): number[] {
		const log = this.speakerLog;
		this.speakerLog = [];
		return log;
	}

	/** The cassette output's flips since the last call, in cycle order. */
	takeTape(): number[] {
		const log = this.tapeLog;
		this.tapeLog = [];
		return log;
	}

	mode(): ScanMode {
		return { graphics: this.graphics, mixed: this.mixed, page2: this.page2, hires: this.hires };
	}

	/** A key from the keyboard, 7 bits. The strobe sets until `$C010`. */
	press(code: number): void {
		this.key = (code & 0x7f) | 0x80;
	}

	read(addr: number): number {
		addr &= 0xffff;
		const scanned = this.tick();
		if (addr < 0xc000) return this.drive(this.ram[addr] ?? 0);
		if (addr < 0xd000) return this.readIo(addr, scanned);
		const banked = this.language?.ramAt(addr);
		if (banked !== undefined && banked !== null) return this.drive(banked);
		return this.drive(this.rom[addr - 0xd000] ?? 0);
	}

	write(addr: number, value: number): void {
		addr &= 0xffff;
		this.tick();
		this.floating = value & 0xff;
		if (addr < 0xc000) this.ram[addr] = this.floating;
		else if (addr < 0xd000) this.writeIo(addr);
		else this.language?.store(addr, this.floating);
	}

	/**
	 * Store a byte with no bus cycle, as a URL's `poke` does: main RAM below `$C000` and the
	 * panel. Anywhere else, false and nothing changes.
	 */
	poke(addr: number, value: number): boolean {
		addr &= 0xffff;
		if (addr < 0xc000) this.ram[addr] = value & 0xff;
		else if (addr >= PANEL_BASE && addr < PANEL_BASE + PANEL_BYTES) this.panel[addr - PANEL_BASE] = value & 0xff;
		else return false;
		return true;
	}

	/** The byte at `addr` with no bus cycle. The compiler reads opcodes through this. */
	peek(addr: number): number {
		addr &= 0xffff;
		if (addr < 0xc000) return this.ram[addr] ?? 0;
		if (addr >= 0xd000) {
			const banked = this.language?.ramAt(addr);
			if (banked !== undefined && banked !== null) return banked;
			return this.rom[addr - 0xd000] ?? 0;
		}
		if (addr >= PANEL_BASE && addr < PANEL_BASE + PANEL_BYTES) return this.panel[addr - PANEL_BASE]!;
		if (addr >= 0xc100 && addr <= 0xc7ff) {
			const rom = this.cards[(addr >> 8) & 7]?.rom;
			return rom ? rom[addr & 0xff] ?? 0 : 0;
		}
		if (addr >= 0xc800 && addr <= 0xcfff && this.expansion) {
			const card = this.cards[this.expansion];
			const offset = addr - 0xc800;
			const ram = card?.expansionRead?.(offset);
			if (ram !== undefined && ram !== null) return ram;
			const rom = card?.expansion;
			if (rom && offset < rom.length) return rom[offset] ?? 0;
		}
		return 0;
	}

	/** Text page 1 or 2, 1024 bytes, still in `ram`. */
	textPage(): Uint8Array {
		const base = this.page2 ? 0x800 : 0x400;
		return this.ram.subarray(base, base + 0x400);
	}

	/** One cycle. The scanner's byte is what an undriven read sees, from the mode before this access. */
	private tick(): number {
		const addr = scanAddress(this.cycles, this.mode());
		this.cycles += 1;
		return addr < this.ram.length ? this.ram[addr]! : 0;
	}

	private readIo(addr: number, scanned: number): number {
		const page = addr >> 8;
		if (page === 0xc0) return this.readSwitch(addr & 0xff, scanned);
		return this.readSlot(addr, scanned);
	}

	private writeIo(addr: number): void {
		const page = addr >> 8;
		if (page === 0xc0) this.writeSwitch(addr & 0xff);
		else if (addr === 0xcfff) this.expansion = 0;
		else if (addr >= 0xc800) {
			if (this.expansion) this.cards[this.expansion]?.expansionWrite?.(addr - 0xc800, this.floating);
		} else this.touchSlot(addr);
	}

	private readSwitch(a: number, scanned: number): number {
		this.touch(a);
		if (a < 0x20) return this.drive(this.key);
		if (a >= 0x41 && a <= 0x4f) return this.drive(this.panel[a - 0x41]!);
		if ((a === 0x60 || a === 0x68) && this.tapeIn) return this.drive((scanned & 0x7f) | (this.tapeIn(this.cycles) ? 0x80 : 0));
		if (a >= 0x60 && a < 0x70) return this.drive(scanned & 0x7f);
		if (a >= 0x80) {
			const slot = (a >> 4) & 7;
			const driven = slot >= 1 ? this.cards[slot]?.readSwitch?.(a & 0xf, this.cycles) : null;
			if (driven !== undefined && driven !== null) return this.drive(driven);
		}
		return this.drive(scanned);
	}

	private writeSwitch(a: number): void {
		this.touch(a);
		if (a >= 0x41 && a <= 0x4f) this.panel[a - 0x41] = this.floating;
		if (a < 0x80) return;
		const slot = (a >> 4) & 7;
		if (slot >= 1) this.cards[slot]?.writeSwitch?.(a & 0xf, this.floating, this.cycles);
	}

	private readSlot(addr: number, scanned: number): number {
		const page = addr >> 8;
		if (page >= 0xc1 && page <= 0xc7) {
			this.expansion = page & 7;
			const rom = this.cards[page & 7]?.rom;
			if (rom) return this.drive(rom[addr & 0xff] ?? 0);
			return this.drive(scanned);
		}
		if (addr === 0xcfff) {
			const byte = this.expansionByte(0x7ff, scanned);
			this.expansion = 0;
			return byte;
		}
		return this.expansionByte(addr - 0xc800, scanned);
	}

	private touchSlot(addr: number): void {
		const page = addr >> 8;
		if (page >= 0xc1 && page <= 0xc7) this.expansion = page & 7;
	}

	private expansionByte(offset: number, scanned: number): number {
		const card = this.expansion ? this.cards[this.expansion] : undefined;
		const ram = card?.expansionRead?.(offset);
		if (ram !== undefined && ram !== null) return this.drive(ram);
		const rom = card?.expansion;
		if (!rom || offset >= rom.length) return this.drive(scanned);
		return this.drive(rom[offset] ?? 0);
	}

	/** What an access does, whether or not the switch drives the bus. */
	private touch(a: number): void {
		if (a >= 0x10 && a < 0x20) this.key &= 0x7f;
		else if (a >= 0x20 && a < 0x30) {
			this.tape ^= 1;
			this.tapeLog.push(this.cycles);
		} else if (a >= 0x30 && a < 0x40) {
			this.speaker ^= 1;
			this.speakerClicks += 1;
			this.speakerLog.push(this.cycles);
		} else if (a === 0x50) this.graphics = true;
		else if (a === 0x51) this.graphics = false;
		else if (a === 0x52) this.mixed = false;
		else if (a === 0x53) this.mixed = true;
		else if (a === 0x54) this.page2 = false;
		else if (a === 0x55) this.page2 = true;
		else if (a === 0x56) this.hires = false;
		else if (a === 0x57) this.hires = true;
		else if (a >= 0x58 && a <= 0x5f) {
			const bit = 1 << ((a - 0x58) >> 1);
			this.annunciators = a & 1 ? this.annunciators | bit : this.annunciators & ~bit;
		} else if (a >= 0x80 && a <= 0x8f) this.language?.touch(a);
		this.noteVideo();
	}

	private noteVideo(): void {
		const last = this.video[this.video.length - 1]!;
		if (last.graphics === this.graphics && last.mixed === this.mixed && last.page2 === this.page2 && last.hires === this.hires) return;
		this.video.push({ cycle: this.cycles - 1, graphics: this.graphics, mixed: this.mixed, page2: this.page2, hires: this.hires });
	}

	private drive(value: number): number {
		this.floating = value & 0xff;
		return this.floating;
	}
}
