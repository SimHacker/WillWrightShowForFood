import type { Device } from "../bus.js";
import type { Run, SlotSpec } from "./korz.js";

/**
 * Devices on the PDP-7's IOT bus as Korz slots. An IOT names a device (IR<6:11>) and pulse bits
 * (IR & 067). The PDP-7 fires IOP1, IOP2 and IOP4 in that order for the bits set; a device gate
 * answers one of them, so most devices are one slot per gate: `iop` selector, guarded on `device`,
 * `iop` (1, 2 or 4) and, for devices that split their pulses into groups, `sub` (pulse bits 060).
 * A device that decodes the whole pulse instead, in its own order, installs `iot` slots guarded on
 * `device` and `pulse` or `sub`; they are more specific than its `timed` slot and win.
 *
 * Gates read and write `ac` and set `skip`, as the IOT's reply to the CPU.
 */
export type Iop = {
	device: number;
	pulse: number;
	/** Pulse bits 060, the group some devices split their codes into. */
	sub: number;
	/** The pulse being fired: 1, 2 or 4. */
	iop: number;
	ac: number;
	/** Set to 1 to skip the next instruction. */
	skip: number;
};

/** What a device's slots can ask of the CPU they are installed in. */
export interface IopBus {
	/** Fire IOP1, IOP2 and IOP4, in order, for the bits of `c.pulse`. */
	pulses(c: Iop): void;
}

export interface KorzDevice extends Device {
	/** The device's IOTs as slots: `iot()` stays as the oracle they are tested against. */
	korzSlots(bus: IopBus): SlotSpec<Iop>[];
}

export const isKorzDevice = (d: Device): d is KorzDevice => typeof (d as Partial<KorzDevice>).korzSlots === "function";

/** The device answers its code with timed pulses. */
export const timed = (bus: IopBus, device: number, by: string): SlotSpec<Iop> =>
	({ selector: "iot", guard: { device }, by: `${by}: IOP1, IOP2, IOP4`, run: (c) => bus.pulses(c) });

/** One gate: what the device does on one pulse of one code, optionally in one group. */
export const gate = (device: number, iop: 1 | 2 | 4, by: string, run: Run<Iop>, sub?: number | readonly number[]): SlotSpec<Iop> =>
	({ selector: "iop", guard: sub === undefined ? { device, iop } : { device, iop, sub }, by, run });

/** A skip gate: IOP1 with a condition. */
export const skipIf = (device: number, by: string, cond: () => boolean, sub?: number): SlotSpec<Iop> =>
	gate(device, 1, by, (c) => { if (cond()) c.skip = 1; }, sub);

/** A whole-pulse decoder for one code: exact pulse values, or every pulse when `pulse` is omitted. */
export const decode = (device: number, by: string, run: Run<Iop>, pulse?: number | readonly number[]): SlotSpec<Iop> =>
	({ selector: "iot", guard: pulse === undefined ? { device } : { device, pulse }, by, run });
