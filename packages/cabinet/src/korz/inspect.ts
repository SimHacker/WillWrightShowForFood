import type { Block65, Compiler65 } from "./compile65.js";
import { generatedAccessors, type BlockInfo, type Compiler7 } from "./compile7.js";
import { generatedDispatch, type Sea, type Slot, type WhyLine } from "./korz.js";
import { fields, opcode65, type K65, type Korz6502 } from "./m6502.js";

/**
 * The emulator's Korz structures as one tree, for a browser that only looks. Every level is a
 * node with the same shape: a sea, its selectors, their slots, the dispatch methods the resolver
 * generated, and the blocks the compilers generated, each with the JavaScript it became.
 * Children are computed when asked for, so a closed branch costs nothing.
 */
export type KorzNode = {
	/** Unique among its siblings; a path of ids names a node. */
	readonly id: string;
	readonly label: string;
	/** One line beside the label. */
	readonly note?: string;
	/** What the browser shows for it: generated source, or a description. */
	readonly text?: string;
	/** A core address the page can open in its memory panel. */
	readonly addr?: number;
	readonly children?: () => KorzNode[];
};

const oct = (n: number, w = 5): string => n.toString(8).padStart(w, "0");
const hex = (n: number): string => `$${n.toString(16).toUpperCase().padStart(4, "0")}`;
const hex2 = (n: number): string => n.toString(16).toUpperCase().padStart(2, "0");
const count = (n: number): string => n.toLocaleString("en");

/** A function's source, or a note that it has none worth showing. */
const sourceOf = (f: unknown): string => (typeof f === "function" ? String(f) : "(none)");

/** Past this many table entries a selector's slots are listed without who wins where. */
const ENUMERATE = 4096;

export type SeaNodeOpts<C> = {
	/** A table entry's name, for "wins": an opcode, a device. Default is its coordinates. */
	readonly pointName?: (c: C) => string;
	/** More nodes after the selectors. */
	readonly extra?: () => KorzNode[];
};

/**
 * A sea: its dimensions, then a node per selector, with the table the resolver would build and
 * the shared dispatch method it generated, then a node per slot with its guard and body.
 */
export function seaNode<C extends object>(id: string, label: string, sea: Sea<C>, opts: SeaNodeOpts<C> = {}): KorzNode {
	const selectors = sea.selectors();
	return {
		id,
		label,
		note: `${sea.slots().length} slots, ${selectors.length} selectors, generation ${sea.generation}`,
		text: `Dimensions:\n${sea.dims.map((d) => `  ${d.name}: ${d.width} bits${d.names ? ` (${d.names.join(", ")})` : ""}`).join("\n")}`,
		children: () => [...selectors.map((selector) => selectorNode(sea, selector, opts)), ...(opts.extra?.() ?? [])],
	};
}

type Standing<C> = { wins: string[]; shadows: Set<Slot<C>>; shadowedBy: Set<Slot<C>> };

/** Every point of the selector's table: which slot runs first, and what each slot stands over and under. */
function standings<C extends object>(sea: Sea<C>, selector: string, pointName?: (c: C) => string): Map<Slot<C>, Standing<C>> | null {
	const shape = sea.shape(selector);
	if (!shape.table) return null;
	const dims = shape.dims.map((name) => sea.dims.find((d) => d.name === name)!);
	const size = dims.reduce((n, d) => n * (1 << d.width), 1);
	if (size > ENUMERATE) return null;
	const out = new Map<Slot<C>, Standing<C>>();
	const get = (s: Slot<C>): Standing<C> => {
		let v = out.get(s);
		if (!v) out.set(s, (v = { wins: [], shadows: new Set(), shadowedBy: new Set() }));
		return v;
	};
	for (let i = 0; i < size; i++) {
		const c: Record<string, number> = {};
		let rest = i;
		for (let d = dims.length - 1; d >= 0; d--) {
			const w = 1 << dims[d]!.width;
			c[dims[d]!.name] = rest % w;
			rest = Math.floor(rest / w);
		}
		let chain: Slot<C>[];
		try {
			chain = sea.chain(selector, c as C);
		} catch {
			continue;
		}
		if (chain.length === 0) continue;
		const top = chain[0]!;
		get(top).wins.push(pointName ? pointName(c as C) : dims.map((d) => `${d.name}=${sea.coordName(c as C, sea.dims.indexOf(d))}`).join(" "));
		for (const s of chain.slice(1)) {
			get(top).shadows.add(s);
			get(s).shadowedBy.add(top);
		}
	}
	return out;
}

const names = <C>(set: Set<Slot<C>> | undefined): string => (set && set.size ? [...set].map((s) => s.by).join(", ") : "none");

function selectorNode<C extends object>(sea: Sea<C>, selector: string, opts: SeaNodeOpts<C>): KorzNode {
	const slots = sea.slots(selector);
	return {
		id: selector,
		label: selector,
		note: `${slots.length} slots`,
		children: () => {
			const shape = sea.shape(selector);
			const dims = shape.dims.map((d) => (shape.kinds[d] ? `${d} (${shape.kinds[d]} kinds)` : d)).join(" × ") || "none";
			const methods = generatedDispatch().filter((m) => m.selector === selector);
			const stand = standings(sea, selector, opts.pointName);
			const table: KorzNode = {
				id: "$table",
				label: shape.table ? "table" : "interpreted",
				note: shape.table ? `${count(shape.size)} entries over ${dims}` : `past the table limit over ${dims}`,
				text: methods.length
					? methods.map((m) => `// index: ${m.expr}\n${m.source}`).join("\n\n")
					: shape.table
						? "Resolved on demand; no dispatch method generated yet."
						: "Every dispatch searches the slots.",
			};
			return [
				table,
				...slots.map((s, i) => {
					const st = stand?.get(s);
					const wins = st?.wins ?? [];
					return {
						id: `${i} ${s.by}`,
						label: s.by,
						note: `${s.layer}${sea.guardText(s) ? ` · ${sea.guardText(s)}` : ""}${stand ? ` · wins ${wins.length}` : ""}`,
						text: [
							...(s.doc ? [`// ${s.doc}`, ""] : []),
							`// ${selector}, ${s.layer} layer, installed by ${s.by}`,
							`// guard: ${sea.guardText(s) || "everywhere"}`,
							...(stand
								? [
										`// runs first at ${wins.length} of ${count(shape.size)} entries${wins.length ? `: ${wins.join(", ")}` : ""}`,
										`// shadows (they run only if it calls next): ${names(st?.shadows)}`,
										`// shadowed by: ${names(st?.shadowedBy)}`,
									]
								: []),
							`// run:`,
							sourceOf(s.run),
							...(typeof s.emit === "function" ? ["", "// emit, the template the compiler inlines:", sourceOf(s.emit)] : []),
						].join("\n"),
					};
				}),
			];
		},
	};
}

/**
 * The PDP-7 compiler: its blocks by entry address, each with the PDP-7 words it was compiled from
 * (`show` turns an address into a listing line) and its JavaScript; and the generated `read` and
 * `write` every machine shares.
 */
export function compiler7Node(j: Compiler7, show: (addr: number) => string = (a) => oct(a)): KorzNode {
	return {
		id: "compiler",
		label: "Compiler",
		note: `${count(j.built)} built, ${count(j.invalidated)} dropped`,
		text: "Runs of PDP-7 instructions compiled to JavaScript functions. A store into a word a block was compiled from throws the block away; it is compiled again the next time control reaches it.",
		children: () => {
			const blocks = j.list();
			return [
				{
					id: "blocks",
					label: "Blocks",
					note: `${blocks.length} in use`,
					children: () => blocks.map((b) => block7Node(b, show)),
				},
				{
					id: "accessors",
					label: "read and write",
					note: "shared by every machine",
					children: () => generatedAccessors().map((s, i) => ({ id: String(i), label: /function (\w+)/.exec(s)?.[1] ?? `accessor ${i}`, text: s })),
				},
			];
		},
	};
}

/** One PDP-7 block. */
export function block7Node(b: BlockInfo, show: (addr: number) => string = (a) => oct(a)): KorzNode {
	return {
		id: oct(b.entry),
		label: `blk ${oct(b.entry)}`,
		note: `${b.size} ${b.size === 1 ? "instruction" : "instructions"}`,
		addr: b.entry,
		text: `${b.words.map((a) => `// ${show(a)}`).join("\n")}\n\n${b.source}`,
	};
}

/** How a 6502 listing names an opcode, and reads the bytes after it. */
export type Lister65 = { name: (op: number) => string; bytes: (op: number) => number; peek: (addr: number) => number };

/** A lister from a Korz 6502: names from its sea, bytes through its bus without a cycle. */
export function lister65(cpu: Korz6502): Lister65 {
	const cache = new Map<number, ReturnType<typeof opcode65>>();
	const info = (op: number) => {
		let v = cache.get(op);
		if (!v) cache.set(op, (v = opcode65(cpu.sea, op)));
		return v;
	};
	return { name: (op) => info(op).name, bytes: (op) => info(op).bytes, peek: (a) => cpu.bus.peek?.(a & 0xffff) ?? 0 };
}

/** `$0800  A2 0A     LDX #imm`. */
function line65(at: number, op: number, l: Lister65): string {
	const n = l.bytes(op);
	const bytes = [op, ...Array.from({ length: n - 1 }, (_, i) => l.peek(at + 1 + i))].map(hex2).join(" ");
	return `${hex(at)}  ${bytes.padEnd(9)} ${l.name(op)}`;
}

/** The 6502 compiler's blocks, by entry address, and the blocks it has thrown away. */
export function compiler65Node(j: Compiler65, l?: Lister65): KorzNode {
	return {
		id: "compiler",
		label: "Compiler",
		note: `${count(j.built)} built, ${count(j.invalidated)} dropped`,
		text: "Straight-line runs of 6502 opcodes compiled to JavaScript. Each block checks its opcode bytes on entry and is dropped when one has changed; operand bytes are read as the block runs, so they are not checked. At most 1,024 are kept.",
		children: () => {
			const blocks = j.list();
			const hot = [...blocks].sort((a, b) => b.retired - a.retired);
			return [
				{ id: "blocks", label: "Blocks", note: `${blocks.length} in use, by address`, children: () => blocks.map((b) => block65Node(b, l)) },
				{ id: "hot", label: "Hottest", note: "by instructions retired", children: () => hot.slice(0, 32).map((b) => block65Node(b, l)) },
				{
					id: "dropped",
					label: "Dropped",
					note: `last ${j.dropped.length}`,
					children: () =>
						j.dropped
							.slice()
							.reverse()
							.map((d, i) => ({
								id: String(i),
								label: `blk ${hex(d.entry)}`,
								note: `${hex(d.at)} was ${hex2(d.was)}${l ? ` ${l.name(d.was)}` : ""}, now ${d.now < 0 ? "?" : `${hex2(d.now)}${l ? ` ${l.name(d.now)}` : ""}`}`,
								addr: d.at,
								text: `Block ${hex(d.entry)}, ${d.size} opcodes, ran ${count(d.runs)} times, dropped at cycle ${count(d.cycles)}: the opcode at ${hex(d.at)} changed. Self-modifying code, a loader, or a bank switch puts a different byte under a compiled block.`,
							})),
				},
			];
		},
	};
}

/** One 6502 block: its opcodes as a listing beside the JavaScript they became. */
export function block65Node(b: Block65, l?: Lister65): KorzNode {
	const listing = l
		? b.ops.map((o) => `// ${line65(o.at, o.op, l)}${o.inlined ? "" : "   (not inlined: one call to the switch)"}`).join("\n")
		: b.ops.map((o) => `// ${hex(o.at)}  ${hex2(o.op)}${o.inlined ? "" : "   (switch)"}`).join("\n");
	const name = `korz65/blk-${b.entry.toString(16).padStart(4, "0")}.js`;
	return {
		id: hex(b.entry),
		label: `blk ${hex(b.entry)}`,
		note: `${b.size} ${b.size === 1 ? "opcode" : "opcodes"} · ran ${count(b.runs)} · retired ${count(b.retired)}`,
		addr: b.entry,
		text: [
			listing,
			"//",
			`// built at cycle ${count(b.builtAt)}; ran ${count(b.runs)} times, ${count(b.retired)} instructions${b.runs ? `, ${(b.retired / b.runs).toFixed(1)} a call` : ""}`,
			`// ${count(b.source.length)} characters of JavaScript; in DevTools, Sources lists it as ${name}`,
			"",
			b.source,
		].join("\n"),
	};
}

const whyText = (lines: WhyLine[]): string =>
	lines
		.filter((w) => w.matched)
		.sort((a, b) => (a.order < 0 ? 99 : a.order) - (b.order < 0 ? 99 : b.order))
		.map((w) => `  ${w.order === 0 ? "runs " : "     "} ${w.slot.padEnd(12)} ${w.reason}`)
		.concat([`  and ${lines.filter((w) => !w.matched).length} more rule themselves out`])
		.join("\n");

/** One opcode: its name, its fields, the slots that answer it, and why the others do not. */
function opcode65Node(cpu: Korz6502, op: number, prefix = ""): KorzNode {
	const o = opcode65(cpu.sea, op);
	const f = fields(op);
	const c = { ...f, op, store: false, cpu } as K65;
	const bin = op.toString(2).padStart(8, "0");
	return {
		id: hex2(op),
		label: `${prefix}${hex2(op)} ${o.name}`,
		note: `${o.bytes} ${o.bytes === 1 ? "byte" : "bytes"}${o.undocumented ? " · undocumented" : ""}`,
		text: [
			`$${hex2(op)}  ${o.name}  ${o.bytes} ${o.bytes === 1 ? "byte" : "bytes"}${o.undocumented ? ", undocumented on the NMOS part" : ""}`,
			`fields  aaa=${bin.slice(0, 3)} bbb=${bin.slice(3, 6)} cc=${bin.slice(6)}: cc=${cpu.sea.coordName(c, 0)} aaa=${f.aaa} bbb=${f.bbb}`,
			"",
			`exec  ${o.exec}: ${o.doc}`,
			...(o.mode ? [`mode  ${o.mode}: ${o.modeDoc ?? ""}`] : []),
			"",
			"why, exec:",
			whyText(cpu.sea.why("exec", c)),
			...(o.mode ? ["", "why, mode:", whyText(cpu.sea.why("mode", c))] : []),
		].join("\n"),
	};
}

/** What the 6502 sea adds to the tree: the opcode matrix by the sea's names, and why for the next opcode. */
export function cpu65Nodes(cpu: Korz6502): KorzNode[] {
	const next = cpu.bus.peek?.(cpu.pc & 0xffff);
	const nodes: KorzNode[] = [
		{
			id: "opcodes",
			label: "Opcodes",
			note: "the 256, named by the slots that answer them",
			text: "Rows by high nibble, as the datasheet draws them. Each opcode is three coordinates: aaa (bits 7-5), bbb (bits 4-2), cc (bits 1-0). The name is the exec slot's, with the mode slot's for a column.",
			children: () =>
				Array.from({ length: 16 }, (_, r) => ({
					id: `row ${r}`,
					label: `$${r.toString(16).toUpperCase()}x`,
					note: Array.from({ length: 16 }, (_, k) => opcode65(cpu.sea, (r << 4) | k).name.split(" ")[0]).join(" "),
					children: () => Array.from({ length: 16 }, (_, k) => opcode65Node(cpu, (r << 4) | k)),
				})),
		},
	];
	if (next !== undefined) nodes.unshift({ ...opcode65Node(cpu, next, `next, at ${hex(cpu.pc)}: `), id: "next" });
	return nodes;
}

/** The 6502 sea, with its opcodes named and each slot's wins shown as opcodes. */
export function sea65Node(cpu: Korz6502): KorzNode {
	return seaNode("cpu", "6502 sea", cpu.sea, {
		pointName: (c) => {
			const op = (c.aaa << 5) | (c.bbb << 2) | c.cc;
			return `${hex2(op)} ${opcode65(cpu.sea, op).name}`;
		},
		extra: () => cpu65Nodes(cpu),
	});
}

/** Every dispatch method this page has generated, across all seas. */
export function dispatchNode(): KorzNode {
	return {
		id: "dispatch",
		label: "Dispatch methods",
		note: "shared by every sea with the same table shape",
		children: () =>
			generatedDispatch().map((m) => ({ id: `${m.selector} ${m.expr}`, label: `korz_${m.selector}`, note: m.expr, text: m.source })),
	};
}
