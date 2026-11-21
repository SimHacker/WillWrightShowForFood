import type { Block65, Compiler65 } from "./compile65.js";
import { generatedAccessors, type BlockInfo, type Compiler7 } from "./compile7.js";
import { generatedDispatch, type Sea } from "./korz.js";

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

/** A function's source, or a note that it has none worth showing. */
const sourceOf = (f: unknown): string => (typeof f === "function" ? String(f) : "(none)");

/**
 * A sea: its dimensions, then a node per selector, with the table the resolver would build and
 * the shared dispatch method it generated, then a node per slot with its guard and body.
 */
export function seaNode<C extends object>(id: string, label: string, sea: Sea<C>): KorzNode {
	const selectors = sea.selectors();
	return {
		id,
		label,
		note: `${sea.slots().length} slots, ${selectors.length} selectors, generation ${sea.generation}`,
		text: `Dimensions:\n${sea.dims.map((d) => `  ${d.name}: ${d.width} bits${d.names ? ` (${d.names.join(", ")})` : ""}`).join("\n")}`,
		children: () => selectors.map((selector) => selectorNode(sea, selector)),
	};
}

function selectorNode<C extends object>(sea: Sea<C>, selector: string): KorzNode {
	const slots = sea.slots(selector);
	return {
		id: selector,
		label: selector,
		note: `${slots.length} slots`,
		children: () => {
			const shape = sea.shape(selector);
			const dims = shape.dims.map((d) => (shape.kinds[d] ? `${d} (${shape.kinds[d]} kinds)` : d)).join(" × ") || "none";
			const methods = generatedDispatch().filter((m) => m.selector === selector);
			const table: KorzNode = {
				id: "$table",
				label: shape.table ? "table" : "interpreted",
				note: shape.table ? `${shape.size.toLocaleString("en")} entries over ${dims}` : `past the table limit over ${dims}`,
				text: methods.length
					? methods.map((m) => `// index: ${m.expr}\n${m.source}`).join("\n\n")
					: shape.table
						? "Resolved on demand; no dispatch method generated yet."
						: "Every dispatch searches the slots.",
			};
			return [
				table,
				...slots.map((s, i) => ({
					id: `${i} ${s.by}`,
					label: s.by,
					note: `${s.layer}${sea.guardText(s) ? ` · ${sea.guardText(s)}` : ""}`,
					text: [
						`// ${selector}, ${s.layer} layer, installed by ${s.by}`,
						`// guard: ${sea.guardText(s) || "everywhere"}`,
						`// run:`,
						sourceOf(s.run),
						...(typeof s.emit === "function" ? ["", "// emit, the template the compiler inlines:", sourceOf(s.emit)] : []),
					].join("\n"),
				})),
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
		note: `${j.built.toLocaleString("en")} built, ${j.invalidated.toLocaleString("en")} dropped`,
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

/** The 6502 compiler's blocks, by entry address. */
export function compiler65Node(j: Compiler65): KorzNode {
	return {
		id: "compiler",
		label: "Compiler",
		note: `${j.built.toLocaleString("en")} built, ${j.invalidated.toLocaleString("en")} dropped`,
		text: "Straight-line runs of 6502 opcodes compiled to JavaScript. Each block checks its opcode bytes on entry and is dropped when one has changed. At most 1,024 are kept.",
		children: () => j.list().map(block65Node),
	};
}

/** One 6502 block. */
export function block65Node(b: Block65): KorzNode {
	return {
		id: hex(b.entry),
		label: `blk ${hex(b.entry)}`,
		note: `${b.size} ${b.size === 1 ? "opcode" : "opcodes"}`,
		addr: b.entry,
		text: b.source,
	};
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
