import { type Dim, type Dispatchers, Sea, type SlotSpec } from "./korz.js";

/**
 * The CPU kit. The sea in `korz.ts` does not know an instruction set. The cross-processor
 * note is `KORZ-CPU.md`. This host
 * owns what every CPU repeats: one sea, the rung, and one reused context per
 * nesting. A CPU file supplies the dimensions, the selectors, the slots, how a
 * fetched word becomes coordinates, and the poll (a PDP-7 program interrupt, a
 * 6502 IRQ or NMI or `ready`).
 *
 * `compile` binds the resolver, the same as `resolve`. The CPU file replaces
 * its step with its own compiler. Templates stay with the instruction set.
 *
 * A write watch saves the coordinates a nested read would clobber and puts
 * them back. The hot path spells those fields out, so the watch allocates
 * nothing. `KorzPdp7.watchWrites` is that pattern.
 */

export type Rung = "interpret" | "resolve" | "compile";

export type CpuHostOpts<C extends object, S extends string, N extends string> = {
	readonly dims: readonly Dim[];
	readonly selectors: readonly S[];
	readonly slots: readonly SlotSpec<C>[];
	/** One context. Called once per nesting, and the results are reused. */
	readonly context: () => C;
	/** Instructions, memory and I/O nest, so each gets its own context. */
	readonly nests: readonly N[];
	/** Default `resolve`. `undefined` is that default. */
	readonly rung?: Rung | undefined;
};

export class CpuHost<C extends object, S extends string, N extends string = string> {
	readonly sea: Sea<C>;
	readonly go: Dispatchers<C, S>;
	readonly rung: Rung;
	readonly nest: Readonly<Record<N, C>>;

	constructor(opts: CpuHostOpts<C, S, N>) {
		this.rung = opts.rung ?? "resolve";
		this.sea = new Sea<C>(opts.dims);
		this.sea.install(opts.slots);
		const nest = {} as Record<N, C>;
		for (const name of opts.nests) nest[name] = opts.context();
		this.nest = nest;
		this.go = {} as Dispatchers<C, S>;
		if (this.rung === "interpret") {
			for (const s of opts.selectors) this.go[s] = (c) => this.sea.dispatch(s, c);
		} else this.sea.bind(this.go, opts.selectors);
	}
}
