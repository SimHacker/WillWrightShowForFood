/**
 * KA10 floating point as a pluggable unit: the dimension a Korz rung dispatches the floating
 * instructions on. A unit does the arithmetic on the processor's registers; the processor
 * fetches the operand before and stores the result after, as the returned `FloatStore` says.
 *
 * `exact` is SIMH's integer algorithm in plain numbers, bit for bit: the KA10 never had a
 * hardware sine or square root, only add, multiply, divide and scale, and those it did in a
 * 27-bit two's complement fraction with its own truncation and rounding. Other units (native
 * doubles, a shadow that runs two and logs where they differ) plug in beside it, and
 * `listening` wraps any unit so every floating instruction can be heard.
 */

/** The registers a unit works on: the processor's own fields. */
export interface FloatCpu {
	AR: number;
	BR: number;
	MQ: number;
	MB: number;
	SC: number;
	FLAGS: number;
	readonly IR: number;
	readonly pi_cycle: number;
	checkAprIrq(): void;
}

/** What the processor stores afterwards: the mode's result (`store`), AC alone, AC+1 alone, or AR in AC and MQ in AC+1. */
export type FloatStore = "none" | "store" | "ac" | "ac1" | "pair";

export interface FloatUnit {
	readonly name: string;
	/** FAD, FADR and UFA: AR is the operand, BR the accumulator. */
	fad(c: FloatCpu): FloatStore;
	fsb(c: FloatCpu): FloatStore;
	fmp(c: FloatCpu): FloatStore;
	fdv(c: FloatCpu): FloatStore;
	/** FDVL: BR is AC, MQ is AC+1, AR the divisor. */
	fdvl(c: FloatCpu): FloatStore;
	/** FSC: AR is the accumulator, `ab` the scale in the effective address. */
	fsc(c: FloatCpu, ab: number): FloatStore;
}

const OVR = 0o010000;
const FLTOVR = 0o001000;
const FLTUND = 0o000002;
const NODIV = 0o000001;

const T27 = 134217728;
const T32 = 4294967296;
const SMASK = 34359738368;
const FMASK = 68719476735;
const MMASK = T27 - 1;
const BIT7 = 0o2000000000;
const BIT8 = 0o1000000000;
const BIT9 = 0o400000000;
const EXPO = 0o377 * T27;

/* The 64-bit working field, SIMH's AR << 34, as two unsigned 32-bit halves. */
const H = 0x80000000; // FPHBIT
const S = 0x40000000; // FPSBIT
const N = 0x20000000; // FPNBIT
const O = 0x10000000; // FP1BIT
const ROUND2 = 2; // FPRBIT2, bit 33
const ROUND1 = 4; // FPRBIT1, bit 34

const neg = (x: number): boolean => x >= SMASK;
const field9 = (x: number): number => Math.floor(x / T27) & 0o777;
const CM = (x: number): number => FMASK - x;
const or36 = (a: number, b: number): number => {
	const ah = Math.floor(a / 262144);
	const bh = Math.floor(b / 262144);
	return (ah | bh) * 262144 + (((a % 262144) | (b % 262144)) >>> 0);
};
const smear = (x: number): number => (neg(x) ? SMASK + EXPO + (x % T27) : x % T27);
const getExpo = (x: number): number => (neg(x) ? 0o377 : 0) ^ (field9(x) & 0o377);
/** The signed exponent field as SIMH reads it before multiply and divide. */
const expo9 = (x: number): number => ((neg(x) ? 0o777 : 0) ^ field9(x)) & 0o777;

let ah = 0;
let al = 0;
let bh = 0;
let bl = 0;

/** A smeared word shifted left 34 into the field: its low 30 bits land in bits 34 to 63. */
const toField = (s: number): number => (s % 1073741824) * 4;

function shrB(n: number): void {
	if (n === 0) return;
	if (n < 32) {
		bl = ((bl >>> n) | (bh << (32 - n))) >>> 0;
		bh = bh >>> n;
	} else {
		bl = n === 32 ? bh : bh >>> (n - 32);
		bh = 0;
	}
}

/** All ones shifted left by n, ORed into B. */
function orOnesShl(n: number): void {
	if (n < 32) {
		bh = 0xffffffff;
		bl = (bl | (0xffffffff << n)) >>> 0;
	} else bh = (bh | (0xffffffff << (n - 32))) >>> 0;
}

function addB(): void {
	const lo = al + bl;
	al = lo >>> 0;
	ah = (ah + bh + (lo >= T32 ? 1 : 0)) >>> 0;
}

function shl1(): void {
	ah = ((ah << 1) | (al >>> 31)) >>> 0;
	al = (al << 1) >>> 0;
}

/** SIMH's `(AR & FPHBIT) | (AR >> 1)`. */
function shr1Keep(): void {
	al = ((al >>> 1) | ((ah & 1) << 31)) >>> 0;
	ah = ((ah & H) | (ah >>> 1)) >>> 0;
}

function negateA(): void {
	al = ~al >>> 0;
	ah = ~ah >>> 0;
	const lo = al + 1;
	al = lo >>> 0;
	if (lo >= T32) ah = (ah + 1) >>> 0;
}

/** Per instruction, as SIMH clears them before each one. */
let nrf = 0;
let fxu = 0;
let flag1 = 0;

function fadd(c: FloatCpu): FloatStore {
	let AR = c.AR;
	let BR = c.BR;
	let SC = field9(BR);
	let SCAD = neg(BR) === neg(AR) ? SC + (field9(AR) ^ 0o777) + 1 : SC + field9(AR);
	SCAD &= 0o777;
	if (neg(BR) === ((SCAD & 0o400) !== 0)) {
		const t = AR;
		AR = BR;
		BR = t;
	}
	if ((SCAD & 0o400) === 0) {
		if (neg(AR) === neg(BR)) SCAD = ((SCAD ^ 0o777) + 1) & 0o777;
		else SCAD = SCAD ^ 0o777;
	} else if (neg(AR) !== neg(BR)) SCAD = (SCAD + 1) & 0o777;
	SC = getExpo(AR);
	ah = toField(smear(AR));
	al = 0;
	bh = toField(smear(BR));
	bl = 0;
	if (SCAD & 0o400) {
		SCAD = 0o1000 - SCAD;
		if (SCAD < 61) {
			const fill = (bh & S) !== 0;
			shrB(SCAD);
			if (fill) orOnesShl(61 - SCAD);
		} else if (SCAD < 65) {
			const fill = (bh & S) !== 0 ? 0xffffffff : 0;
			bh = bl = fill >>> 0;
		} else bh = bl = 0;
	}
	addB();
	flag1 = (ah & S) !== 0 ? 1 : 0;
	c.AR = AR;
	c.BR = BR;
	return fnorm(c, SC);
}

/** SIMH's `fnorm:`: normalize, round, pack, and say where the result goes. */
function fnorm(c: FloatCpu, SC: number): FloatStore {
	const IR = c.IR;
	let AR: number;
	let MQ: number;
	if (((ah & S) !== 0) !== ((ah & N) !== 0)) {
		SC += 1;
		shr1Keep();
	}
	if (ah !== 0 || al !== 0) {
		al = (al & ~0o77) >>> 0;
		if (((SC & 0o400) !== 0) !== ((SC & 0o200) !== 0)) fxu = 1;
		if (IR !== 0o130 && IR !== 0o247) {
			for (;;) {
				while ((ah !== 0 || al !== 0) && ((ah & S) !== 0) === ((ah & N) !== 0) && ((ah & N) !== 0) === ((ah & O) !== 0)) {
					SC--;
					shl1();
				}
				if ((ah & 0x7ffffffc) === (S | N)) {
					SC++;
					shr1Keep();
				}
				if (!nrf && (IR & 4) !== 0) {
					const f = (ah & O) !== 0;
					if ((ah & ROUND2) !== 0) {
						const half = (ah & 3) === ROUND2 && al === 0;
						const sgn = (ah & S) !== 0;
						if (((IR & 0o70) !== 0o70 && sgn && !half) || !sgn || !half) ah = (ah + ROUND1) >>> 0;
						nrf = 1;
						ah = (ah & ~3) >>> 0;
						al = 0;
						if (((ah & O) !== 0) !== f) {
							SC += 1;
							shr1Keep();
						}
						continue;
					}
				}
				break;
			}
		}
		MQ = (ah & 3) * T32 + al;
		AR = ah >>> 2;
		if (flag1) AR += SMASK;
	} else {
		AR = MQ = 0;
		SC = 0;
	}
	if ((SC & 0o400) !== 0 && !c.pi_cycle) {
		c.FLAGS |= OVR | FLTOVR;
		if (!fxu) {
			c.FLAGS |= FLTUND;
			MQ = 0;
		}
		c.checkAprIrq();
	}
	const SCAD = SC ^ (neg(AR) ? 0o377 : 0);
	AR = (neg(AR) ? SMASK : 0) + (AR % T27);
	AR = or36(AR, (SCAD & 0o377) * T27);
	if ((IR & 7) === 1) {
		SC = (SC + (0o777 ^ 26)) & 0o777;
		if ((SC & 0o400) !== 0) MQ = 0;
		MQ = Math.floor(MQ / 128) % T27;
		// SIMH flips SC here when `SC & SMASK`, which a nine-bit count never has.
		if (MQ !== 0) MQ = or36(MQ, (SC & 0o377) * T27);
	}
	if (AR % T27 === 0) AR = 0;
	c.AR = AR;
	c.MQ = MQ;
	c.SC = SC;
	if (IR === 0o130) return "ac1";
	if (IR === 0o127 || IR === 0o132) return "ac";
	return "store";
}

function begin(): void {
	nrf = 0;
	fxu = 0;
	flag1 = 0;
}

export const exactFloat: FloatUnit = {
	name: "exact",

	fad(c) {
		begin();
		return fadd(c);
	},

	fsb(c) {
		begin();
		const ad = (CM(c.AR) + 1) % (FMASK + 1);
		c.AR = c.BR;
		c.BR = ad;
		return fadd(c);
	},

	fmp(c) {
		begin();
		let AR = c.AR;
		let BR = c.BR;
		let SC = expo9(BR);
		const SCAD = expo9(AR);
		SC = (SC + SCAD + 0o600) & 0o777;
		flag1 = 0;
		if (neg(AR)) {
			if (AR % T27 === 0) {
				AR = BIT9;
				SC++;
			} else AR = CM(AR) + 1;
			flag1 = 1;
		}
		if (neg(BR)) {
			if (BR % T27 === 0) {
				BR = BIT9;
				SC++;
			} else BR = CM(BR) + 1;
			flag1 = flag1 ? 0 : 1;
		}
		AR %= T27;
		BR %= T27;
		// The 54-bit product, shifted left 7, built exactly from two partial products below 2^53.
		const p0 = AR * (BR % 65536) * 128;
		const p1 = AR * Math.floor(BR / 65536);
		ah = Math.floor(p0 / T32);
		al = p0 % T32;
		bh = Math.floor(p1 / 512);
		bl = ((p1 % 512) * 8388608) >>> 0;
		addB();
		if (flag1) negateA();
		c.AR = AR;
		c.BR = BR;
		return fnorm(c, SC);
	},

	fdv(c) {
		begin();
		let AR = c.AR;
		let BR = c.BR;
		flag1 = 0;
		let SC = expo9(BR);
		const SCAD = expo9(AR);
		if (BR % T27 === 0) {
			if (BR === SMASK) {
				BR = BIT9;
				SC--;
			} else {
				c.AR = BR;
				c.BR = BR;
				return "none";
			}
		}
		if (neg(BR)) {
			BR = CM(BR) + 1;
			flag1 = 1;
		}
		if (neg(AR)) {
			if (AR % T27 === 0) {
				AR = BIT9;
				SC--;
			} else AR = CM(AR) + 1;
			flag1 = flag1 ? 0 : 1;
		}
		SC = (SC + ((0o777 ^ SCAD) + 1) + 0o201) & 0o777;
		AR %= T27;
		BR %= T27;
		c.BR = BR;
		if (BR >= AR * 2) {
			c.AR = AR;
			if (!c.pi_cycle) {
				c.FLAGS |= OVR | NODIV | FLTOVR;
				c.checkAprIrq();
			}
			return "none";
		}
		// (BR << 28) / AR in two steps of 14 bits, each exact.
		c.MB = AR;
		const q1 = Math.floor((BR * 16384) / AR);
		const r1 = BR * 16384 - q1 * AR;
		AR = q1 * 16384 + Math.floor((r1 * 16384) / AR);
		if (AR !== 0) {
			if ((AR & BIT7) !== 0) AR = AR >>> 1;
			else SC--;
			if (((SC & 0o400) !== 0) !== ((SC & 0o200) !== 0) || SC === 0o600) fxu = 1;
			if (c.IR & 4) AR++;
			AR = AR >>> 1;
			while ((AR & BIT9) === 0) {
				AR *= 2;
				SC--;
			}
		} else if (flag1) {
			AR = SMASK + BIT9;
			SC++;
			flag1 = 0;
		} else {
			AR = 0;
			SC = 0;
		}
		if (!c.pi_cycle && (SC & 0o400) !== 0) {
			c.FLAGS |= OVR | FLTOVR;
			if (!fxu) c.FLAGS |= FLTUND;
			c.checkAprIrq();
		}
		if (flag1) AR = SMASK + (((AR ^ MMASK) + 1) & MMASK);
		const sc = SC ^ (neg(AR) ? 0o377 : 0);
		c.AR = or36(AR, (sc & 0o377) * T27);
		c.SC = SC;
		return "store";
	},

	fdvl(c) {
		begin();
		let AR = c.AR;
		let BR = c.BR;
		let MQ = c.MQ;
		let flag3 = 0;
		flag1 = 0;
		let SC = expo9(BR);
		SC += ((neg(AR) ? 0 : 0o777) ^ field9(AR)) & 0o777;
		SC = (SC + 0o201) & 0o777;
		let FE = expo9(BR) - 26;
		if (neg(BR)) {
			MQ = (CM(MQ) + 1) % T27;
			BR = CM(BR);
			if (MQ === 0) BR = BR + 1;
			flag1 = 1;
			flag3 = 1;
		}
		MQ %= T27;
		if (neg(AR)) {
			AR = CM(AR) + 1;
			flag1 = flag1 ? 0 : 1;
		}
		AR %= T27;
		BR %= T27;
		c.BR = BR;
		if (BR >= AR * 2) {
			c.AR = AR;
			c.MQ = MQ;
			if (!c.pi_cycle) {
				c.FLAGS |= OVR | NODIV | FLTOVR;
				c.checkAprIrq();
			}
			return "none";
		}
		// The dividend (BR << 27) + MQ as hi·2^27 + lo, against the divisor AR << 27: lo never
		// reaches 2^27, so comparing and subtracting only ever touch hi.
		let hi = BR;
		let lo = MQ;
		const shift = (): void => {
			lo *= 2;
			hi *= 2;
			if (lo >= T27) {
				lo -= T27;
				hi += 1;
			}
		};
		c.MB = AR;
		let AD = 0;
		if (hi < AR) {
			shift();
			SC--;
			FE--;
		}
		for (let i = 0; i < 27; i++) {
			AD *= 2;
			if (hi >= AR) {
				hi -= AR;
				AD += 1;
			}
			shift();
		}
		MQ = Math.floor(hi / 2);
		AR = AD;
		SC++;
		if (AR !== 0) {
			if ((AR & BIT8) !== 0) {
				SC++;
				FE++;
				AR = AR >>> 1;
			}
			while ((AR & BIT9) === 0) {
				AR *= 2;
				SC--;
			}
			if (((SC & 0o400) !== 0) !== ((SC & 0o200) !== 0)) fxu = 1;
			if (flag1) AR = SMASK + ((AR ^ MMASK) + 1);
		} else if (flag1) {
			FE = SC = 0;
		} else {
			AR = 0;
			SC = 0;
			FE = 0;
		}
		if ((SC & 0o400) !== 0 && !c.pi_cycle) {
			c.FLAGS |= OVR | FLTOVR;
			if (!fxu) c.FLAGS |= FLTUND;
			c.checkAprIrq();
		}
		const SCAD = SC ^ (neg(AR) ? 0o377 : 0);
		AR = (neg(AR) ? SMASK : 0) + (AR % T27);
		AR = or36(AR, (SCAD & 0o377) * T27);
		if (MQ !== 0) {
			MQ %= T27;
			if (flag3) MQ = SMASK + ((MQ ^ MMASK) + 1);
			if (FE < 0) {
				MQ = 0;
				FE = 0;
			} else FE ^= flag3 ? 0o377 : 0;
			MQ = or36(MQ, (FE & 0o377) * T27);
		}
		c.AR = AR;
		c.MQ = MQ;
		c.SC = SC;
		return "pair";
	},

	fsc(c, ab) {
		begin();
		const AR = c.AR;
		let SC = ((ab & 0o400000) !== 0 ? 0o400 : 0) | (ab & 0o377);
		SC = (getExpo(AR) + SC) & 0o777;
		flag1 = neg(AR) ? 1 : 0;
		ah = toField(smear(AR));
		al = 0;
		return fnorm(c, SC);
	},
};

/** Every floating instruction, as it happens: the opcode, both operands and the result. */
export type FloatEar = (op: keyof Omit<FloatUnit, "name">, ir: number, ac: number, operand: number, result: number, flags: number) => void;

/** A unit that does what `unit` does and tells `ear` about it: floats you can listen to. */
export function listening(unit: FloatUnit, ear: FloatEar): FloatUnit {
	const wrap =
		(op: keyof Omit<FloatUnit, "name">) =>
		(c: FloatCpu, ab = 0): FloatStore => {
			const ac = c.BR;
			const operand = c.AR;
			const r = op === "fsc" ? unit.fsc(c, ab) : unit[op](c);
			ear(op, c.IR, ac, operand, c.AR, c.FLAGS);
			return r;
		};
	return { name: `${unit.name}+ear`, fad: wrap("fad"), fsb: wrap("fsb"), fmp: wrap("fmp"), fdv: wrap("fdv"), fdvl: wrap("fdvl"), fsc: wrap("fsc") };
}

export const FLOAT_UNITS: Readonly<Record<string, FloatUnit>> = { exact: exactFloat };
