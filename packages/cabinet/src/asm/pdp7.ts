import type { Machine } from "./core.js";

/** The PDP-7 as the assemblers see it: 18-bit words, 13-bit addresses, printed in octal. */
export const PDP7: Machine = { name: "PDP-7", wordBits: 18, addrBits: 13, radix: 8 };

export const PDP7_SYMBOLS: Readonly<Record<string, number>> = {
	cal: 0o000000, dac: 0o040000, jms: 0o100000, dzm: 0o140000,
	lac: 0o200000, xor: 0o240000, add: 0o300000, tad: 0o340000,
	xct: 0o400000, isz: 0o440000, and: 0o500000, sad: 0o540000,
	jmp: 0o600000, i: 0o020000, law: 0o760000, iot: 0o700000,
	opr: 0o740000, nop: 0o740000, cma: 0o740001, cml: 0o740002,
	oas: 0o740004, ral: 0o740010, rar: 0o740020, hlt: 0o740040,
	sma: 0o740100, sza: 0o740200, snl: 0o740400, skp: 0o741000,
	spa: 0o741100, sna: 0o741200, szl: 0o741400, rtl: 0o742010,
	rtr: 0o742020, cll: 0o744000, stl: 0o744002, rcl: 0o744010,
	rcr: 0o744020, cla: 0o750000, clc: 0o750001, las: 0o750004,
	glk: 0o750010, lam: 0o777777,
	// Program interrupt, clock, console.
	ion: 0o700042, iof: 0o700002, caf: 0o703302,
	clsf: 0o700001, clof: 0o700004, clon: 0o700044,
	rsf: 0o700101, rrb: 0o700112, rsa: 0o700104,
	psf: 0o700201, pcf: 0o700202, psa: 0o700204,
	ksf: 0o700301, krb: 0o700312, krs: 0o700322,
	tsf: 0o700401, tcf: 0o700402, tls: 0o700406,
	// Type 340 display.
	idsi: 0o700601, idla: 0o700606, idrs: 0o700504, idve: 0o700501,
	idsp: 0o700701, idrc: 0o700712, idhe: 0o701001,
	// Type 177 extended arithmetic element.
	osc: 0o640001, omq: 0o640002, cmq: 0o640004, lacs: 0o641001,
	lacq: 0o641002, abs: 0o644000, gsm: 0o664000, clq: 0o650000,
	lmq: 0o652000, mul: 0o653122, muls: 0o657122, div: 0o640323,
	divs: 0o644323, idiv: 0o653323, idivs: 0o657323, frdiv: 0o650323,
	frdivs: 0o654323, norm: 0o640444, norms: 0o660444, lrs: 0o640500,
	lrss: 0o660500, lls: 0o640600, llss: 0o660600, als: 0o640700,
	alss: 0o660700,
};

/**
 * The Cambridge link to Titan, devices 22 and 23 (see plugins/tiny-titan.ts).
 * LLAM, LLB18 and LKE appear in the listing only OR'd with another name
 * (LRB18!LLAM 702276, LLB18!LLAM 702264, LKE!LLB6 702364); their own values
 * are the smallest that give those words.
 */
export const CAMBRIDGE_SYMBOLS: Readonly<Record<string, number>> = {
	lsf: 0o702201, lcf: 0o702222, llam: 0o702224, llb18: 0o702240,
	lrb18: 0o702252, lsa: 0o702301, lke: 0o702320, lkd: 0o702322,
	llb6: 0o702344,
};

/**
 * Type 340 display words after DISP, as the 1972 listing assembles them.
 * Word types: PAR (parameter) and POH are 0, POV and DDS 200000, DJP
 * 400000, DJS 600000; VEC is 0 and takes dx dy. The next-mode fields:
 * PA parameter, PO point, VE vector, CH character, SB subroutine (mode 7).
 * PN/PF light pen on/off, SCn scale n, INn intensity n, ES escape.
 */
export const DISPLAY_SYMBOLS: Readonly<Record<string, number>> = {
	par: 0o000000, poh: 0o000000, pov: 0o200000, dds: 0o200000,
	djp: 0o400000, djs: 0o600000, vec: 0o000000,
	pa: 0o000000, po: 0o020000, ve: 0o100000, ch: 0o060000, sb: 0o160000,
	pn: 0o014000, pf: 0o010000, es: 0o400000,
	sc0: 0o100, sc1: 0o120, sc2: 0o140, sc3: 0o160,
	in0: 0o10, in1: 0o11, in2: 0o12, in3: 0o13, in4: 0o14, in5: 0o15, in6: 0o16, in7: 0o17,
};
