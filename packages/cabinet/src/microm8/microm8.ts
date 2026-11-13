// microM8, Paleotronic's Apple II emulator, built as WebAssembly from the fork (wasm/main.go):
// the machine runs headless in Go and this drives it. The same code runs in the browser and in
// Node; only fetching the module and Go's wasm_exec.js differs (see node.ts).
//
// The screen is microM8's own scan renderer: a 560x192 RGBA frame made at every vertical
// blank, covering text, lores, hires, double hires and mixed modes. A page draws it into a
// canvas at 560x384 (each row twice), the shape of an Apple monitor. A Videx Videoterm, on
// a II+ profile, draws its own 720x216 picture the same way: one character-ROM dot, one pixel.

export const FRAME_WIDTH = 560;
export const FRAME_HEIGHT = 192;
export const FRAME_BYTES = FRAME_WIDTH * FRAME_HEIGHT * 4;

/** The Videoterm's picture: 80 by 24 cells, 9 dots by 9 lines. */
export const VIDEX_WIDTH = 720;
export const VIDEX_HEIGHT = 216;
export const VIDEX_BYTES = VIDEX_WIDTH * VIDEX_HEIGHT * 4;

export interface MicroM8Status {
	/** microM8's interpreter in the VM slot; "fp" even while the 6502 runs a disk. */
	dialect: string;
	/** True while the VM slot is an Apple running 6502 code rather than microM8's own shell. */
	pureBoot: boolean;
	pc: number;
	a: number;
	x: number;
	y: number;
	sp: number;
	p: number;
	/** Active layers: HGR1, HGR2, DHR1, LOGR, TEXT, TXT2 and so on. */
	modes: string[];
	/** Boot volume of drive 1, "local:/mem/<name>" for a disk given by insertDisk. */
	disk0: string;
	/** Warp: 1 is an Apple's 1.02 MHz. microM8 goes to 8 by itself while a drive runs. */
	speed: number;
	/** 6502 cycles since the last reset; two readings over time give the real speed. */
	cycles: number;
	/** A Videx Videoterm is plugged in. */
	videx: boolean;
	/** The monitor is showing the Videx: annunciator 0 on, and not a graphics mode. */
	videxShowing: boolean;
}

/** What the Go side puts on globalThis.microM8. */
export interface MicroM8Api {
	ready(): boolean;
	/** writeProtect holds for that drive until the next insert, reboots included. */
	insertDisk(drive: number, name: string, bytes: Uint8Array, writeProtect?: boolean): boolean;
	flush(): void;
	volume(name: string): Uint8Array | null;
	reboot(): void;
	reset(): void;
	speed(warp: number): void;
	paddle(n: number, value: number): void;
	button(n: number, down: boolean): void;
	annunciators(): number;
	status(): MicroM8Status;
	key(code: number): void;
	type(text: string): void;
	readMemory(address: number, length: number): Uint8Array;
	writeMemory(address: number, bytes: Uint8Array): void;
	frame(into: Uint8Array | Uint8ClampedArray): boolean;
	/** The Videx picture, 720x216 RGBA. False when there is no card or nothing changed. */
	videx(into: Uint8Array | Uint8ClampedArray): boolean;
	/** The card's 2K of screen RAM, then R12 and R13. Null when there is no card. */
	videxRAM(): Uint8Array | null;
	/** Queues bytes for the 2651 serial card to receive. False when there is no card. */
	serialSend(bytes: Uint8Array): boolean;
	/** What the serial card sent since the last call. Null when there is no card. */
	serialTake(): Uint8Array | null;
	videxWidth: number;
	videxHeight: number;
	/** Moves waiting speaker samples into a byte view of a Float32Array; returns how many. */
	audio(into: Uint8Array): number;
	audioRate(): number;
	stop(): void;
	width: number;
	height: number;
}

/** Go's runtime from wasm_exec.js: `new Go()`, then `run(instance)`. */
export interface GoRuntime {
	importObject: object;
	run(instance: object): Promise<void>;
	/** wasm_exec.js's pending wakeups; they throw if they fire after the program ends. */
	_scheduledTimeouts?: Map<number, unknown>;
}
export type GoRuntimeClass = new () => GoRuntime;

interface Wasm {
	instantiate(bytes: ArrayBuffer | Uint8Array, imports: object): Promise<{ instance: object }>;
	instantiateStreaming?(source: unknown, imports: object): Promise<{ instance: object }>;
}

interface Host {
	WebAssembly: Wasm;
	microM8?: MicroM8Api;
	microM8Exited?: Promise<void>;
	microM8Verbose?: boolean;
	/** Profile name without ".yaml", empty for the //e. Read once, at boot. */
	microM8Profile?: string;
	onMicroM8Ready?: (ok: boolean) => void;
}

export interface StartOptions {
	/** Print microM8's own logging to the console. */
	verbose?: boolean;
	/** Machine profile, without ".yaml": "apple2-plus-videx" is a II+ with a Videoterm. */
	profile?: string;
}

/**
 * Start the module. `wasm` is its bytes, or a fetch Response (streamed when the server sends
 * application/wasm). One machine per JavaScript realm: the Go side owns globalThis.microM8,
 * and a second start (a page module reloaded while developing) gets the running machine back.
 */
export async function startMicroM8(
	Go: GoRuntimeClass,
	wasm: ArrayBuffer | Uint8Array | { arrayBuffer(): Promise<ArrayBuffer> },
	options: StartOptions = {},
): Promise<MicroM8> {
	const host = globalThis as unknown as Host;
	if (host.microM8 && host.microM8Exited) return new MicroM8(host.microM8, host.microM8Exited);
	host.microM8Verbose = options.verbose ?? false;
	host.microM8Profile = options.profile ?? "";
	const ready = new Promise<boolean>((resolve) => {
		host.onMicroM8Ready = resolve;
	});
	const go = new Go();
	let instance: object;
	if (wasm instanceof ArrayBuffer || wasm instanceof Uint8Array) {
		({ instance } = await host.WebAssembly.instantiate(wasm, go.importObject));
	} else {
		const streamed = host.WebAssembly.instantiateStreaming
			? await host.WebAssembly.instantiateStreaming(wasm, go.importObject).catch(() => null)
			: null;
		({ instance } = streamed ?? (await host.WebAssembly.instantiate(await wasm.arrayBuffer(), go.importObject)));
	}
	const exited = go.run(instance).then(() => {
		const clear = (globalThis as unknown as { clearTimeout(t: unknown): void }).clearTimeout;
		for (const t of go._scheduledTimeouts?.values() ?? []) clear(t);
		go._scheduledTimeouts?.clear();
	});
	if (!(await ready) || !host.microM8) throw new Error("microM8 did not start");
	host.microM8Exited = exited;
	return new MicroM8(host.microM8, exited);
}

/** A key as a DOM KeyboardEvent describes it; only these fields are read. */
export interface KeyLike {
	key: string;
	/** The key's place on the keyboard (KeyF, Digit1); read when Alt changes what `key` says. */
	code?: string;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
}

// US layout, unshifted and shifted, for the keys that are not letters or digits.
const CODE_CHARS: Record<string, [string, string]> = {
	Backquote: ["`", "~"],
	Minus: ["-", "_"],
	Equal: ["=", "+"],
	BracketLeft: ["[", "{"],
	BracketRight: ["]", "}"],
	Backslash: ["\\", "|"],
	Semicolon: [";", ":"],
	Quote: ["'", '"'],
	Comma: [",", "<"],
	Period: [".", ">"],
	Slash: ["/", "?"],
	Space: [" ", " "],
};
const SHIFTED_DIGITS = ")!@#$%^&*(";

/**
 * The character a key makes with Alt left out. Alt is the Apple's pushbuttons (Open and
 * Solid Apple on a //e, Meta on Don's keyboard), held while the key is typed, so Alt-F is F
 * with button 0 down; on a Mac, Option-F alone would type "ƒ".
 */
function baseKey(ev: KeyLike): string | null {
	const code = ev.code ?? "";
	if (/^Key[A-Z]$/.test(code)) return ev.shiftKey ? code[3]! : code[3]!.toLowerCase();
	if (/^Digit[0-9]$/.test(code)) return ev.shiftKey ? SHIFTED_DIGITS[Number(code[5])]! : code[5]!;
	const pair = CODE_CHARS[code];
	if (pair) return pair[ev.shiftKey ? 1 : 0];
	return ev.key.length === 1 ? null : ev.key;
}

const NAMED_KEYS: Record<string, number> = {
	Enter: 13,
	Backspace: 8,
	ArrowLeft: 8,
	ArrowRight: 21,
	ArrowUp: 11,
	ArrowDown: 10,
	Escape: 27,
	Tab: 9,
	Delete: 127,
};

/**
 * The Apple keyboard code for a key, or null when the Apple has no such key. With `caps`, the
 * //e's Caps Lock down, letters go in as capitals: DOS 3.3 and Integer BASIC know no others.
 */
export function appleKey(ev: KeyLike, caps = false): number | null {
	if (ev.metaKey) return null;
	const key = ev.altKey ? baseKey(ev) : ev.key;
	if (key === null) return null;
	const named = NAMED_KEYS[key];
	if (named !== undefined) return named;
	if (key.length !== 1) return null;
	const c = key.charCodeAt(0);
	if (c >= 128) return null;
	if (ev.ctrlKey) return c >= 0x40 && c < 0x80 ? c & 0x1f : null;
	return caps && c >= 0x61 && c <= 0x7a ? c - 0x20 : c;
}

/** One screen byte as the character it shows: normal, inverse and flashing all read the same. */
export function screenChar(b: number): string {
	if (b >= 0xa0) return String.fromCharCode(b - 0x80);
	if (b >= 0x80) return String.fromCharCode(b - 0x40);
	const c = b & 0x3f;
	return String.fromCharCode(c < 0x20 ? c + 0x40 : c);
}

/** The 24 rows of a 40-column text page, from its 1024 bytes. */
export function textRows(page: Uint8Array): string[] {
	const rows: string[] = [];
	for (let y = 0; y < 24; y++) {
		const at = (y & 7) * 0x80 + (y >> 3) * 0x28;
		let row = "";
		for (let x = 0; x < 40; x++) row += screenChar(page[at + x] ?? 0xa0);
		rows.push(row);
	}
	return rows;
}

export class MicroM8 {
	/** The //e's Caps Lock, down as most owners kept it. */
	caps = true;

	constructor(
		readonly api: MicroM8Api,
		/** Resolves when the Go program ends, after stop(). */
		readonly exited: Promise<void>,
	) {}

	/** Put a disk image in a drive (0 or 1); 3.5" and hard disk images go to the SmartPort. */
	insertDisk(name: string, bytes: Uint8Array, drive = 0, writeProtect = false): void {
		this.api.insertDisk(drive, name, bytes, writeProtect);
	}

	/** Insert and boot from it, as with the power switch. */
	boot(name: string, bytes: Uint8Array, writeProtect = false): void {
		this.api.insertDisk(0, name, bytes, writeProtect);
		this.api.reboot();
	}

	reboot(): void {
		this.api.reboot();
	}

	/** Ctrl-Reset. On a //e left spinning an empty drive, this lands in Applesoft. */
	reset(): void {
		this.api.reset();
	}

	/** Run at `warp` times an Apple's speed; the browser tops out near 1.7 MHz for now. */
	speed(warp: number): void {
		this.api.speed(warp);
	}

	/** Game port paddle `n` (0-3) turned to `value`, 0 to 255; PDL(n) reads it back. */
	paddle(n: number, value: number): void {
		this.api.paddle(n, Math.round(value));
	}

	/** Pushbutton `n` (0-2) held or let go; on a //e, 0 and 1 are also Open and Solid Apple. */
	button(n: number, down: boolean): void {
		this.api.button(n, down);
	}

	/** The game port's four one-bit outputs, AN0-AN3, as bits 0-3. */
	annunciators(): number {
		return this.api.annunciators();
	}

	/** The image as the guest has written it, after its pending tracks are written back. */
	disk(name: string): Uint8Array | null {
		this.api.flush();
		return this.api.volume(name);
	}

	key(code: number): void {
		this.api.key(code);
	}

	/** Send a DOM key event; true when the Apple took it. */
	press(ev: KeyLike): boolean {
		const code = appleKey(ev, this.caps);
		if (code === null) return false;
		this.api.key(code);
		return true;
	}

	/** Type text through microM8's paste buffer, which feeds keys as the guest reads them. */
	type(text: string): void {
		this.api.type(text.replace(/\n/g, "\r"));
	}

	peek(address: number, length = 1): Uint8Array {
		return this.api.readMemory(address, length);
	}

	poke(address: number, bytes: Uint8Array | number[]): void {
		this.api.writeMemory(address, bytes instanceof Uint8Array ? bytes : Uint8Array.from(bytes));
	}

	/** Text page 1 as 24 strings. */
	text(): string[] {
		return textRows(this.api.readMemory(0x400, 0x400));
	}

	status(): MicroM8Status {
		return this.api.status();
	}

	/** Copy the newest frame into `into` (FRAME_BYTES long); false when it hasn't changed. */
	frame(into: Uint8Array | Uint8ClampedArray): boolean {
		return this.api.frame(into);
	}

	/** The Videx picture, VIDEX_BYTES long. False when there is no card or nothing changed. */
	videx(into: Uint8Array | Uint8ClampedArray): boolean {
		return this.api.videx(into);
	}

	/**
	 * The 24 rows of the Videx screen, 80 columns, from its RAM and the 6845 start
	 * address. Control codes are spaces. Empty when there is no card.
	 */
	videxText(): string[] {
		const raw = this.api.videxRAM();
		if (!raw) return [];
		const start = ((raw[2048]! << 8) | raw[2049]!) & 0x7ff;
		const rows: string[] = [];
		for (let y = 0; y < 24; y++) {
			let row = "";
			for (let x = 0; x < 80; x++) {
				const b = raw[(start + y * 80 + x) & 0x7ff]! & 0x7f;
				row += b < 0x20 ? " " : String.fromCharCode(b);
			}
			rows.push(row);
		}
		return rows;
	}

	/**
	 * Sends to the serial card: the Apple receives the bytes at its baud rate, a string as
	 * Latin-1. False when the machine has no card.
	 */
	serialSend(data: Uint8Array | string): boolean {
		const bytes = typeof data === "string" ? Uint8Array.from(data, (c) => c.charCodeAt(0) & 0xff) : data;
		return this.api.serialSend(bytes);
	}

	/** What the Apple sent on the serial card since the last call; empty when there is no card. */
	serialTake(): Uint8Array {
		return this.api.serialTake() ?? new Uint8Array();
	}

	/**
	 * The speaker's samples since the last call, at audioRate() a second, written from the start
	 * of `into`; returns how many. microM8 keeps half a second; older ones are dropped.
	 */
	audio(into: Float32Array): number {
		return this.api.audio(new Uint8Array(into.buffer, into.byteOffset, into.byteLength));
	}

	audioRate(): number {
		return this.api.audioRate();
	}

	async stop(): Promise<void> {
		this.api.stop();
		await this.exited;
		delete (globalThis as unknown as Host).microM8;
		delete (globalThis as unknown as Host).microM8Exited;
	}
}
