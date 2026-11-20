/**
 * The 16K language card, the RAM card that sits in slot 0. `$E000`–`$FFFF` is one 12K bank.
 * `$D000`–`$DFFF` is two 4K banks: bank 2 on `$C080`, bank 1 on `$C088`. `$C084`–`$C087` repeat
 * `$C080`–`$C083`, and `$C08C`–`$C08F` repeat `$C088`–`$C08B`.
 *
 * An odd switch reads the ROM when its low bits are `01` and the RAM when they are `11`. Writing
 * turns on at the second odd access and stays on until an even switch. The fetches of those two
 * instructions are not accesses to the card, so they leave the first one standing. Power-up here
 * is read the motherboard ROM, write protected, bank 2: a ][+ still boots Applesoft.
 */

export class LanguageCard {
	readonly bank1 = new Uint8Array(0x1000);
	readonly bank2 = new Uint8Array(0x1000);
	readonly high = new Uint8Array(0x2000);
	/** `$D000` is bank 1 (`$C088`). Bank 2 (`$C080`) is the one a cold start reads. */
	bank1Selected = false;
	/** Reads of `$D000`–`$FFFF` come from this card. */
	readRam = false;
	/** Writes of `$D000`–`$FFFF` store here. */
	writing = false;
	private prewrite = false;

	/** `$C080`–`$C08F`. The card does not drive the data bus. */
	touch(a: number): void {
		const o = a & 0x0b;
		const odd = (o & 1) !== 0;
		this.readRam = (o & 1) === ((o >> 1) & 1);
		this.bank1Selected = (o & 8) !== 0;
		if (odd) {
			if (this.prewrite) this.writing = true;
			this.prewrite = true;
		} else {
			this.prewrite = false;
			this.writing = false;
		}
	}

	/** The card's byte, or null when the motherboard ROM is the one being read. */
	ramAt(addr: number): number | null {
		if (!this.readRam || addr < 0xd000) return null;
		if (addr < 0xe000) return (this.bank1Selected ? this.bank1 : this.bank2)[addr - 0xd000] ?? 0;
		return this.high[addr - 0xe000] ?? 0;
	}

	/** Store `value` when writing is on. The motherboard ROM is never written. */
	store(addr: number, value: number): void {
		if (!this.writing || addr < 0xd000) return;
		value &= 0xff;
		if (addr < 0xe000) (this.bank1Selected ? this.bank1 : this.bank2)[addr - 0xd000] = value;
		else this.high[addr - 0xe000] = value;
	}
}
