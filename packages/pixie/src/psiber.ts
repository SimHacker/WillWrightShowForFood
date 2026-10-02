import type { Graph, GraphNode, Link, Props, Value } from "./graph.js";

/**
 * The two dictionary networks from the PSIBER paper (Figures 9 and 10),
 * read from their PostScript sources into the generic graph and written
 * back byte for byte. The PostScript is the authority; the graph keeps
 * everything the source says, and nothing it doesn't — hand additions
 * such as coordinates live in the YAML and are ignored by the writers.
 */

/**
 * Source lines are kept verbatim between their outer parens — no escapes
 * occur in either file, and some lines are deliberately not balanced on
 * their own (see ADVENT_META.quirk), so "fixing" them would change what
 * PostScript reads.
 */
function lines(text: string): string[] {
	const out = text.split("\n");
	if (out.pop() !== "") throw new Error("source does not end in a newline");
	return out;
}

function expect(ok: boolean, what: string): asserts ok {
	if (!ok) throw new Error(`psiber: ${what}`);
}

// ─── ARPAnet (arpa.map) ────────────────────────────────────────────────

const ARPA_HEAD = "systemdict begin\n\n  /ArpaMap 100 dict def\n\nend % systemdict\n\nArpaMap begin\n\n";
const ARPA_TAIL = `end % ArpaMap

ArpaMap {
  begin pop
  currentdict {
    /replaceme eq {
      ArpaMap 1 index get def
    } { pop } ifelse
  } forall
  end
} forall

ArpaMap
`;

export const ARPA_META: Props = {
	title: "ARPAnet IMP map",
	source: "characters/don-hopkins/code/psiber/cyber/arpa.map",
	figure: "PSIBER paper, Figure 9: two views of a map of the ARPAnet",
	provenance:
		"Emacs-massaged by Don from a line table brescia@bbnccv mailed him " +
		"(address, endpoints (node, modem), medium, speed); see cyber/ramble",
	links: "Each IMP lists its neighbors; PSIBER replaces every /replaceme with the neighbor's dict, closing the net into rings",
};

export function parseArpaMap(text: string): Graph {
	expect(text.startsWith(ARPA_HEAD) && text.endsWith(ARPA_TAIL), "arpa.map frame changed");
	const body = lines(text.slice(ARPA_HEAD.length, text.length - ARPA_TAIL.length));
	const nodes: GraphNode[] = [];
	let i = 0;
	while (i < body.length) {
		const open = /^ {2}\/(\S+) 20 dict def$/.exec(body[i] ?? "");
		expect(open !== null, `arpa.map line: ${body[i]}`);
		const id = open[1]!;
		expect(body[i + 1] === `  ${id} begin`, `${id}: no begin`);
		const label = new RegExp(`^ {4}/@${id.replace(/\W/g, "\\$&")}: \\((.*)\\) def$`).exec(body[i + 2] ?? "");
		expect(label !== null, `${id}: no label`);
		i += 3;
		const links: Link[] = [];
		for (let m; (m = /^ {4}\/(\S+) \/replaceme def$/.exec(body[i] ?? "")); i += 1) {
			links.push({ to: m[1]!, props: {} });
		}
		expect(body[i] === `  end % ${id}` && body[i + 1] === "", `${id}: no end`);
		i += 2;
		nodes.push({ id, props: { label: label[1]! }, links });
	}
	return { meta: { ...ARPA_META }, nodes };
}

export function writeArpaMap(graph: Graph): string {
	let out = ARPA_HEAD;
	for (const n of graph.nodes) {
		const label = typeof n.props.label === "string" ? n.props.label : `${n.id} IMP`;
		out += `  /${n.id} 20 dict def\n  ${n.id} begin\n    /@${n.id}: (${label}) def\n`;
		for (const l of n.links) if (l.to !== undefined) out += `    /${l.to} /replaceme def\n`;
		out += `  end % ${n.id}\n\n`;
	}
	return out + ARPA_TAIL;
}

// ─── Colossal Cave (advent.map) ────────────────────────────────────────

const ADVENT_HEAD = `/def-descr { % descr# str => -
  currentdict 2 index known not {
    1 index nullarray def
  } if
  [ exch ] 1 index load exch append def
} def

/room-descriptions dictbegin
`;
const ADVENT_VERBS = `dictend def

/def-verb { % index name => -
  currentdict 1 index known not {
    2 copy def
  } if
  exch def
} def

/verbs dictbegin
`;
const ADVENT_TRAVEL = `dictend def

/def-travel { % room# [ neighbor# verb# ... ]
  currentdict 2 index known not {
    1 index dictbegin
      /Room# 1 index def
      0 room-descriptions Room# get {
\t1 index ( %) sprintf exch def
\t1 add
      } forall
      pop
    dictend def
  } if
  exch load % [ neighbor# verb# ... ] roomdict
  begin
    0 2 getinterval aload pop % neighbor# verb#
    verbs exch get % neighbor# verb
    exch def %
  end
} def

/travel-table dictbegin
`;
const ADVENT_TAIL = `dictend def

travel-table { % room# dict
  exch pop
  begin
    currentdict { % verb neighbor#
      verbs 2 index known not { pop pop } {
\ttravel-table exch 
\tdup 999 gt {
\t  dup 1000 div floor 1000 mul sub
\t  cvi
\t} if
\t2 copy known {
\t  get % verb dict
\t  def
\t} {
\t  pop pop pop
\t} ifelse
      } ifelse
    } forall
  end
} forall

systemdict begin
  /ColossalCave travel-table def
  ColossalCave
end % systemdict
`;

export const ADVENT_META: Props = {
	title: "Colossal Cave travel table",
	source: "characters/don-hopkins/code/psiber/cyber/advent.map",
	figure: "PSIBER paper, Figure 10: two views of a map of Adventure",
	provenance: "Crowther and Woods' Adventure data file, sections 1 (long descriptions), 3 (travel) and 4 (vocabulary, motion words)",
	encoding:
		"Travel destination Y = M*1000 + N. N <= 300 is a room, 300 < N <= 500 a special case (N-300), " +
		"N > 500 a message (N-500) and you stay put. M: 0 always; 1-99 that percent of the time; 100 never dwarves; " +
		"101-200 carrying object M-100; 201-300 carrying or beside object M-200; 300 + 100k + n prop(n) is not k. " +
		"PSIBER links a verb to room (Y mod 1000) when that room exists",
	quirk:
		"Rooms 109 and 115 have description lines whose parens only balance across lines, so PostScript " +
		"reads two source lines (and the def-descr between them) as one string. Kept verbatim",
};

/** What the `when` code (M) of a travel entry asks for, in words. */
export function describeCondition(m: number): string {
	if (m === 0) return "always";
	if (m < 100) return `${m}% of the time`;
	if (m === 100) return "never for dwarves";
	if (m <= 200) return `carrying object ${m - 100}`;
	if (m <= 300) return `carrying or beside object ${m - 200}`;
	return `prop(object ${m % 100}) is not ${Math.floor((m - 300) / 100)}`;
}

function verbTable(meta: Props): { names: Map<number, string>; numbers: Map<string, number> } {
	const names = new Map<number, string>();
	const numbers = new Map<string, number>();
	const verbs = meta.verbs;
	expect(typeof verbs === "object" && verbs !== null && !Array.isArray(verbs), "meta.verbs missing");
	for (const [k, v] of Object.entries(verbs)) {
		const n = Number(k);
		expect(Array.isArray(v) && v.length > 0, `verb ${k} has no names`);
		v.forEach((name, i) => {
			expect(typeof name === "string", `verb ${k} name is not a string`);
			if (i === 0) names.set(n, name);
			numbers.set(name, n);
		});
	}
	return { names, numbers };
}

export function parseAdventMap(text: string): Graph {
	const verbsAt = text.indexOf(ADVENT_VERBS);
	const travelAt = text.indexOf(ADVENT_TRAVEL);
	expect(text.startsWith(ADVENT_HEAD) && text.endsWith(ADVENT_TAIL), "advent.map frame changed");
	expect(verbsAt > 0 && travelAt > verbsAt, "advent.map sections missing");

	const rooms = new Map<number, GraphNode>();
	const room = (n: number): GraphNode => {
		let r = rooms.get(n);
		if (!r) {
			r = { id: n, props: { description: [] }, links: [] };
			rooms.set(n, r);
		}
		return r;
	};

	const descr = lines(text.slice(ADVENT_HEAD.length, verbsAt));
	for (let i = 0; i < descr.length; i += 2) {
		const m = /^(\d+)\t\((.*)\)$/.exec(descr[i] ?? "");
		expect(m !== null && descr[i + 1] === "def-descr", `description line: ${descr[i]}`);
		(room(Number(m[1])).props.description as Value[]).push(m[2]!);
	}

	const verbs: { [n: string]: Value[] } = {};
	for (const line of lines(text.slice(verbsAt + ADVENT_VERBS.length, travelAt))) {
		const m = /^\t(\d+)\t\/(\S+)\tdef-verb$/.exec(line);
		expect(m !== null, `verb line: ${line}`);
		(verbs[m[1]!] ??= []).push(m[2]!);
	}
	const meta: Props = { ...ADVENT_META, verbs };
	const { names } = verbTable(meta);

	const travel = lines(text.slice(travelAt + ADVENT_TRAVEL.length, text.length - ADVENT_TAIL.length));
	for (const line of travel) {
		const m = /^\t(\d+) \[\t((?:\d+\t)+)\] def-travel$/.exec(line);
		expect(m !== null, `travel line: ${line}`);
		const [dest = 0, ...vs] = m[2]!.trim().split("\t").map(Number);
		const when = Math.floor(dest / 1000);
		const n = dest % 1000;
		const props: Props = {};
		if (n > 500) props.message = n - 500;
		else if (n > 300) props.special = n - 300;
		// A verb number the vocabulary lacks stays a number (room 113 has a 109).
		props.verbs = vs.map((v) => names.get(v) ?? v);
		if (when !== 0) props.when = when;
		room(Number(m[1])).links.push(n <= 300 ? { to: n, props } : { props });
	}
	return { meta, nodes: [...rooms.values()] };
}

export function writeAdventMap(graph: Graph): string {
	const { numbers } = verbTable(graph.meta);
	let out = ADVENT_HEAD;
	for (const n of graph.nodes) {
		const d = n.props.description;
		for (const line of Array.isArray(d) ? d : []) out += `${n.id}\t(${String(line)})\ndef-descr\n`;
	}
	out += ADVENT_VERBS;
	for (const [k, v] of Object.entries(graph.meta.verbs as Props)) {
		for (const name of v as string[]) out += `\t${k}\t/${name}\tdef-verb\n`;
	}
	out += ADVENT_TRAVEL;
	for (const n of graph.nodes) {
		for (const l of n.links) {
			const p = l.props;
			const target =
				l.to !== undefined
					? Number(l.to)
					: typeof p.special === "number"
						? p.special + 300
						: Number(p.message) + 500;
			const dest = (typeof p.when === "number" ? p.when : 0) * 1000 + target;
			const vs = (p.verbs as Value[]).map((name) => {
				if (typeof name === "number") return name;
				const v = numbers.get(String(name));
				expect(v !== undefined, `room ${n.id}: unknown verb ${name}`);
				return v;
			});
			out += `\t${n.id} [\t${[dest, ...vs].join("\t")}\t] def-travel\n`;
		}
	}
	return out + ADVENT_TAIL;
}
