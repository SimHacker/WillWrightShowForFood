/**
 * URLs into the catalog: the path is the entry's path, the query configures it.
 *
 *   /cabinet/languages/forth/apple2?with=forth-ok,player/don&baud=19200&serial.parity=even
 *
 *   with=     mixins, added after the entry's own parents in order (later wins); repeatable
 *   name=     an input, by its name (an alias) or by its value path
 *
 * A link is something anyone can send anyone, so only what the entry declares gets through:
 * mixins it lists, inputs of the declared type and range. Everything else is kept in `ignored`
 * with the reason, for the page to show. Nothing here throws.
 */
import { type Catalog, type Entry, type Folder, type Input, slugPath } from "./catalog.js";

export interface Ignored {
	param: string;
	value: string;
	reason: string;
}

export interface Launch {
	/** The entry's own path (after any redirect). */
	path: string;
	entry?: Entry;
	folder?: Folder;
	/** Set when the URL used an old or `also` path: replace the address with this one. */
	redirect?: string;
	with: string[];
	/** Values set by the URL, by value path. */
	values: Record<string, unknown>;
	ignored: Ignored[];
}

export interface UrlOptions {
	/** The prefix the catalog is served under. */
	base?: string;
	/** End the path with a slash, as a static site serves directories. */
	slash?: boolean;
}

const RESERVED = new Set(["with"]);

/** Parameters the page around an entry reads, never the entry: `solo` shows the machine alone. */
export const PAGE_PARAMS = new Set(["solo"]);

/** Does the entry let a URL add this mixin? Names match exactly; `player/*` matches a prefix. */
export function allowsMixin(entry: Entry, name: string): boolean {
	return entry.mixins.some((m) => (m.endsWith("*") ? name.startsWith(m.slice(0, -1)) : m === name));
}

/** A URL parameter's text as the input's type, or the reason it is not one. */
export function coerce(input: Input, text: string): { value: unknown } | { reason: string } {
	const t = text.trim();
	switch (input.type) {
		case "boolean": {
			const v = t.toLowerCase();
			if (["1", "true", "yes", "on", ""].includes(v)) return { value: true };
			if (["0", "false", "no", "off"].includes(v)) return { value: false };
			return { reason: "not true or false" };
		}
		case "integer":
		case "number": {
			const n = Number(t);
			if (t === "" || !Number.isFinite(n)) return { reason: "not a number" };
			if (input.type === "integer" && !Number.isInteger(n)) return { reason: "not a whole number" };
			if (input.min !== undefined && n < input.min) return { reason: `below ${input.min}` };
			if (input.max !== undefined && n > input.max) return { reason: `above ${input.max}` };
			if (input.values && !input.values.includes(String(n))) return { reason: `not one of ${input.values.join(", ")}` };
			return { value: n };
		}
		default:
			if (input.values && !input.values.includes(t)) return { reason: `not one of ${input.values.join(", ")}` };
			return { value: t };
	}
}

/** The input a parameter names: by name first, then by value path. */
function inputFor(entry: Entry, param: string): Input | undefined {
	return entry.inputs[param] ?? Object.values(entry.inputs).find((i) => i.path === param);
}

/** Read a URL: what it opens and how it configures it. Undefined when the path names nothing. */
export function parseLaunch(
	catalog: Catalog,
	pathname: string,
	search: string | URLSearchParams = "",
	{ base = "/cabinet/" }: UrlOptions = {}
): Launch | undefined {
	let rest = pathname;
	try {
		rest = decodeURIComponent(pathname);
	} catch {
		// a stray % stays as typed
	}
	const prefix = base.replace(/\/+$/, "");
	if (prefix && (rest === prefix || rest.startsWith(prefix + "/"))) rest = rest.slice(prefix.length);
	const resolved = catalog.resolve(slugPath(rest));
	if (!resolved) return undefined;
	const launch: Launch = { path: resolved.path, with: [], values: {}, ignored: [] };
	if (resolved.entry) launch.entry = resolved.entry;
	if (resolved.folder) launch.folder = resolved.folder;
	if (resolved.redirect) launch.redirect = resolved.redirect;

	const params = typeof search === "string" ? new URLSearchParams(search) : search;
	const entry = resolved.entry;
	for (const [param, value] of params) {
		if (PAGE_PARAMS.has(param)) continue;
		if (!entry) {
			launch.ignored.push({ param, value, reason: "a folder takes no parameters" });
			continue;
		}
		if (param === "with") {
			for (const name of value.split(",").map((s) => s.trim()).filter(Boolean)) {
				if (!allowsMixin(entry, name)) launch.ignored.push({ param, value: name, reason: `not a mixin ${entry.id} accepts` });
				else if (!launch.with.includes(name)) launch.with.push(name);
			}
			continue;
		}
		const input = inputFor(entry, param);
		if (!input) {
			launch.ignored.push({ param, value, reason: `not an input of ${entry.id}` });
			continue;
		}
		const got = coerce(input, value);
		if ("reason" in got) launch.ignored.push({ param, value, reason: got.reason });
		else launch.values[input.path] = got.value;
	}
	return launch;
}

/** The inputs' defaults, then what the launch set: every value path the entry declares. */
export function effectiveValues(entry: Entry, values: Record<string, unknown> = {}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const input of Object.values(entry.inputs)) if (input.default !== undefined) out[input.path] = input.default;
	return Object.assign(out, values);
}

/** Dotted value paths as nested maps: { "serial.baud": 9600 } → { serial: { baud: 9600 } }. */
export function nest(values: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [path, value] of Object.entries(values)) {
		const keys = path.split(".");
		let at = out;
		for (const k of keys.slice(0, -1)) {
			const next = at[k];
			at = (at[k] = next && typeof next === "object" && !Array.isArray(next) ? next : {}) as Record<string, unknown>;
		}
		at[keys[keys.length - 1] ?? path] = value;
	}
	return out;
}

/** Query text with the characters a reader expects left alone: / , : * */
const encode = (s: string) => encodeURIComponent(s).replace(/%2F/gi, "/").replace(/%2C/gi, ",").replace(/%3A/gi, ":").replace(/%2A/gi, "*");

/**
 * The canonical URL for an entry and a configuration: the path, the mixins in order, then each
 * input that differs from its default, by the input's name, in the order the entry declares them.
 */
export function launchUrl(
	entry: Entry,
	{ with: mixins = [], values = {} }: { with?: readonly string[]; values?: Record<string, unknown> } = {},
	{ base = "/cabinet/", slash = true }: UrlOptions = {}
): string {
	const head = base.replace(/\/+$/, "") + "/" + entry.path + (slash ? "/" : "");
	const parts: string[] = [];
	const kept = mixins.filter((m) => allowsMixin(entry, m));
	if (kept.length) parts.push("with=" + kept.map(encode).join(","));
	for (const [name, input] of Object.entries(entry.inputs)) {
		if (!(input.path in values) || RESERVED.has(name)) continue;
		const v = values[input.path];
		if (v === input.default) continue;
		parts.push(`${encode(name)}=${encode(String(v))}`);
	}
	return parts.length ? `${head}?${parts.join("&")}` : head;
}
