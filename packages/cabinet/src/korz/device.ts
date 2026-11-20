import type { Next, SlotSpec } from "./korz.js";

/**
 * The device kit. A device with slots installs them. Any other device gets one
 * slot per code that calls the function it already has. A patch-layer slot per
 * code answers while power is off, and leaves the device's slots for `next`
 * while power is on. Power is read when the slot runs.
 *
 * The kit does not know a bus protocol. The PDP-7 pulse helpers live in
 * `iop.ts` and are one user of this adapter. `backplaneSlots` in `pdp7.ts` is
 * that user: unclaimed codes, CAF, and the IOT reply.
 */

export type Unit<C, Bus, Req, Reply> = {
	readonly name: string;
	readonly codes: readonly number[];
	/** Absent or `undefined` means on. Read at dispatch, so a switch flipped later is seen. */
	power?: boolean | undefined;
	slots?(bus: Bus): readonly SlotSpec<C>[];
	call?(req: Req): Reply;
	off?(req: Req): Reply;
};

export type DeviceSlotsOpts<C extends object, Bus, Req, Reply> = {
	readonly selector: string;
	/** The dimension that holds the device code. */
	readonly code: keyof C & string;
	readonly bus: Bus;
	readonly units: readonly Unit<C, Bus, Req, Reply>[];
	readonly request: (c: C) => Req;
	readonly reply: (c: C, answer: Reply) => void;
	/** What an unpowered device answers when it has no `off`. */
	readonly silent: (c: C) => Reply;
	/** Slots of the bus itself: unclaimed codes, a clear-all. */
	readonly busSlots?: readonly SlotSpec<C>[];
	readonly plainBy?: (name: string) => string;
	readonly powerBy?: (name: string) => string;
};

export function deviceSlots<C extends object, Bus, Req, Reply>(opts: DeviceSlotsOpts<C, Bus, Req, Reply>): SlotSpec<C>[] {
	const plainBy = opts.plainBy ?? ((name: string) => `device ${name}`);
	const powerBy = opts.powerBy ?? ((name: string) => `power: ${name} off`);
	const out: SlotSpec<C>[] = [...(opts.busSlots ?? [])];
	for (const unit of opts.units) {
		for (const n of unit.codes) {
			out.push({
				selector: opts.selector,
				guard: { [opts.code]: n },
				layer: "patch",
				by: powerBy(unit.name),
				run: (c, next: Next) => {
					if (unit.power !== false) return next();
					opts.reply(c, unit.off ? unit.off(opts.request(c)) : opts.silent(c));
				},
			});
		}
		if (typeof unit.slots === "function") {
			for (const spec of unit.slots(opts.bus)) out.push(spec);
		} else if (typeof unit.call === "function") {
			const by = plainBy(unit.name);
			const call = unit.call;
			for (const n of unit.codes) {
				out.push({
					selector: opts.selector,
					guard: { [opts.code]: n },
					by,
					run: (c) => { opts.reply(c, call(opts.request(c))); },
				});
			}
		} else throw new Error(`${unit.name}: a device has slots or a call`);
	}
	return out;
}
