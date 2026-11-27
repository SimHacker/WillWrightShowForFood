/**
 * KA10 constants, from SIMH's PDP10/kx10_defs.h with only the KA10 and ITS
 * paths kept. Words are bigints: the reference rung mirrors SIMH's uint64
 * arithmetic exactly, wraparound included, so traces can be diffed against it.
 */

export const LMASK = 0o777777000000n;
export const RMASK = 0o777777n;
export const FMASK = 0o777777777777n;
export const CMASK = 0o377777777777n;
export const SMASK = 0o400000000000n;
export const C1 = 0o1000000000000n;
export const RSIGN = 0o400000n;
export const PMASK = 0o7777777777n;
export const EMASK = 0o777000000000n;
export const MMASK = 0o777777777n;
export const BIT7 = 0o2000000000n;
export const BIT8 = 0o1000000000n;
export const BIT9 = 0o400000000n;
export const MANT = 0o777777777n;
export const EXPO = 0o377000000000n;
export const FPHBIT = 0o1000000000000000000000n;
export const FPSBIT = 0o400000000000000000000n;
export const FPNBIT = 0o200000000000000000000n;
export const FP1BIT = 0o100000000000000000000n;
export const FPFMASK = 0o1777777777777777777777n;
export const FPRMASK = 0o177777777777n;
export const FPRBIT2 = 0o100000000000n;
export const FPRBIT1 = 0o200000000000n;
/** Half-word masks as plain numbers, for addresses. */
export const RMASK_N = 0o777777;
export const RSIGN_N = 0o400000;
/** The quantum timer's carry bit, an 18-bit count in microseconds. */
export const BIT17_N = 0o1000000;

export const U64 = (x: bigint): bigint => BigInt.asUintN(64, x);
/** Shift counts as bigints, 0 to 63: C's shifts of a uint64 take the count mod 64 on x86 and ARM. */
export const SH: readonly bigint[] = Array.from({ length: 64 }, (_, i) => BigInt(i));
export const shl = (x: bigint, n: number): bigint => U64(x << SH[n & 63]!);
export const shr = (x: bigint, n: number): bigint => x >> SH[n & 63]!;

export const CM = (x: bigint): bigint => FMASK ^ x;
export const CCM = (x: bigint): bigint => (CMASK ^ x) & CMASK;
export const SWAP = (x: bigint): bigint => ((RMASK & x) << 18n) | ((x >> 18n) & RMASK);
export const AOB = (x: bigint): bigint => x + 0o1000001n;
export const SOB = (x: bigint): bigint => x + 0o777776777777n;

/** Processor flags, KA10 layout (the left half of a PC word, shifted right 5). */
export const NODIV = 0o000001;
export const FLTUND = 0o000002;
export const ONEP = 0o000010;
export const PURE = 0o000040;
export const USERIO = 0o000100;
export const USER = 0o000200;
export const BYTI = 0o000400;
export const FLTOVR = 0o001000;
export const CRY1 = 0o002000;
export const CRY0 = 0o004000;
export const OVR = 0o010000;
/** Flags the KA10 doesn't have, kept so the ported code reads like SIMH's. */
export const TRP1 = 0;
export const TRP2 = 0;
export const ADRFLT = 0;
export const PUBLIC = 0;
export const PCHNG = 0;

/** I/O function codes, the low two bits of a device dispatch. */
export const DATAI = 0;
export const DATAO = 1;
export const CONI = 2;
export const CONO = 3;

export const ADR_IFETCH = 0o20;
export const ADR_DFETCH = 0o10;
export const ADR_WRITE = 0o4;
export const ADR_STOP = 0o2;
export const ADR_BREAK = 0o1;

/** A device's I/O entry: SIMH's `dev_tab` functions return the data word instead of writing through a pointer. */
export type DevIo = (dev: number, data: bigint) => bigint;

/** Octal, zero-padded, as SIMH's history listing prints it. */
export const oct = (x: number | bigint, width: number): string => x.toString(8).padStart(width, "0");
