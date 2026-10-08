// FTP.127, the Food Transfer Protocol (Kent Pitman, MIT-MC, 1982–85), rebuilt from the TS FTP dump.
// Every message below is a string recovered from the binary (see ../pnames.txt) unless marked "guessed".
"use strict";

const VERSION = "127";
const HOST = "MIT-MC";
const GRIPES = "KMP@MIT-MC";
const SITES = window.FTPDAT;
const BITES = ["SMALL", "MEDIUM", "LARGE"];
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ORDINALS = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth", "thirty-first"];

const outEl = document.getElementById("out");
const screenEl = document.getElementById("screen");
const kbd = document.getElementById("kbd");
const baudEl = document.getElementById("baud");
const crtEl = document.getElementById("crt");

// ---- The terminal: everything printed goes through one queue drained at the line's baud rate.

const textNode = document.createTextNode("");
const cursor = document.createElement("span");
cursor.className = "cursor";
cursor.textContent = "\u00a0";
outEl.append(textNode, cursor);

let queue = [];
let baud = Number(localStorage.getItem("ftp-baud") ?? 9600);
baudEl.value = String(baud);
let lastTick = 0;
let credit = 0;

function emit(s) {
	for (const ch of s) queue.push(ch);
}
function bell() {
	screenEl.animate([{ filter: "brightness(2)" }, { filter: "none" }], { duration: 120 });
}
function drain(now) {
	if (queue.length) {
		let n;
		if (!baud) n = queue.length;
		else {
			credit += ((now - lastTick) / 1000) * (baud / 10); // 10 bits a character: start, 8 data, stop
			n = Math.floor(credit);
			credit -= n;
		}
		let text = textNode.data;
		for (let i = 0; i < n && queue.length; i++) {
			const ch = queue.shift();
			if (ch === "\b") text = text.slice(0, -1);
			else if (ch === "\f") text = "";
			else text += ch;
		}
		textNode.data = text.length > 200000 ? text.slice(-150000) : text;
		screenEl.scrollTop = screenEl.scrollHeight;
	} else credit = 0;
	lastTick = now;
	requestAnimationFrame(drain);
}
requestAnimationFrame((t) => {
	lastTick = t;
	drain(t);
});

const fresh = () => (lastQueued().endsWith("\n") || lastQueued() === "" ? "" : "\n"); // FORMAT's ~&
function lastQueued() {
	return queue.length ? queue[queue.length - 1] : textNode.data.slice(-1);
}
function say(s) {
	emit(fresh() + s + "\n");
}

baudEl.addEventListener("change", () => {
	baud = Number(baudEl.value);
	localStorage.setItem("ftp-baud", String(baud));
	screenEl.focus();
});
crtEl.addEventListener("change", () => screenEl.classList.toggle("crt", crtEl.checked));
screenEl.classList.toggle("crt", crtEl.checked);
screenEl.addEventListener("click", () => kbd.focus());
kbd.focus();

// ---- The completing reader (after Kent's LIBDOC;COMRD): Tab, Altmode (Esc) or Space completes,
// ? lists the choices, Rubout, ^W and ^U edit, ^G aborts, ^L clears the screen.

let reader = null;

function readLine(prompt, complete) {
	return new Promise((resolve, reject) => {
		emit(prompt);
		reader = { prompt, line: "", complete, resolve, reject };
	});
}
function retype() {
	emit("\n" + reader.prompt + reader.line);
}
function typeText(s) {
	reader.line += s;
	emit(s);
}
function rubout(n) {
	n = Math.min(n, reader.line.length);
	reader.line = reader.line.slice(0, reader.line.length - n);
	emit("\b".repeat(n));
}

function tokens(line) {
	return line.split(/\s+/).filter(Boolean);
}
function choicesFor(line) {
	const done = tokens(line);
	const partial = /\s$/.test(line) || line === "" ? "" : done.pop() ?? "";
	const options = reader.complete ? reader.complete(done) : null;
	if (!options) return { partial, matches: null };
	const up = partial.toUpperCase();
	return { partial, matches: options.filter((o) => o.startsWith(up)) };
}
function commonPrefix(list) {
	let p = list[0] ?? "";
	for (const s of list) while (!s.startsWith(p)) p = p.slice(0, -1);
	return p;
}
function complete(addSpace) {
	const { partial, matches } = choicesFor(reader.line);
	if (!matches) {
		if (addSpace) typeText(" ");
		return;
	}
	if (!matches.length) return bell();
	const p = commonPrefix(matches);
	const rest = p.slice(partial.length);
	if (rest) typeText(matches.length === 1 ? rest.toLowerCase() : rest.toLowerCase());
	if (matches.length === 1) {
		if (addSpace || !rest) typeText(" ");
	} else if (!rest) bell();
}
function showChoices() {
	const { matches } = choicesFor(reader.line);
	if (!matches) return bell();
	// *COMPLETING-READ-DISPLAY-OPTIONS in LIBDOC;COMRD
	if (!matches.length) emit("\nNo options match.");
	else if (matches.length === 1) emit("\nUnambiguous match: " + matches[0]);
	else {
		let line = "\nOptions are: " + matches[0];
		let col = line.length - 1;
		for (const m of matches.slice(1)) {
			line += ", ";
			col += 2;
			if (m.length + col > 67) {
				line += "\n        ";
				col = 8;
			}
			line += m;
			col += m.length;
		}
		emit(line);
	}
	retype();
}
function wrapList(items) {
	let out = "";
	let col = 0;
	for (const [i, s] of items.entries()) {
		const piece = s + (i < items.length - 1 ? ", " : "");
		if (col + piece.length > 76) {
			out += "\n ";
			col = 1;
		}
		out += piece;
		col += piece.length;
	}
	return out;
}

function onKey(e) {
	if (!reader) return;
	const k = e.key;
	if (e.ctrlKey && !e.metaKey) {
		const c = k.toLowerCase();
		if (c === "g") {
			const r = reader;
			reader = null;
			emit(" ^G");
			r.reject(new Abort());
		} else if (c === "l") {
			emit("\f" + reader.prompt + reader.line);
		} else if (c === "u") rubout(reader.line.length);
		else if (c === "w") rubout(reader.line.length - reader.line.replace(/\S+\s*$/, "").length);
		else if (c === "r") retype();
		else return;
		e.preventDefault();
		return;
	}
	if (e.metaKey || e.altKey) return;
	if (k === "Enter") {
		e.preventDefault();
		const r = reader;
		reader = null;
		emit("\n");
		r.resolve(r.line);
	} else if (k === "Backspace" || k === "Delete") {
		e.preventDefault();
		rubout(1);
	} else if (k === "Tab" || k === "Escape") {
		e.preventDefault();
		complete(false);
	} else if (k === "?") {
		e.preventDefault();
		showChoices();
	} else if (k === " ") {
		e.preventDefault();
		if (reader.complete && !/\s$/.test(reader.line) && reader.line) complete(true);
		else if (reader.line && !/\s$/.test(reader.line)) typeText(" ");
	} else if (k.length === 1) {
		e.preventDefault();
		typeText(k);
	}
}
document.addEventListener("keydown", onKey);
kbd.addEventListener("input", () => {
	// Phones type into the hidden textarea; feed what arrives through the same path.
	for (const ch of kbd.value) onKey({ key: ch, preventDefault() {}, ctrlKey: false, metaKey: false, altKey: false });
	kbd.value = "";
});
document.addEventListener("paste", (e) => {
	if (!reader) return;
	e.preventDefault();
	typeText((e.clipboardData?.getData("text") ?? "").replace(/\s+/g, " "));
});

class Abort extends Error {}
class CommandError extends Error {}

// Resolve what was typed against the choices: exact, or a unique prefix.
function resolve(word, options, what) {
	const up = word.toUpperCase();
	if (options.includes(up)) return up;
	const m = options.filter((o) => o.startsWith(up));
	if (m.length === 1) return m[0];
	throw new CommandError(m.length ? `Ambiguous ${what}: ${word}` : `Unknown ${what}: ${word}`); // guessed wording
}
async function arg(rest, prompt, options, what) {
	let word = rest.shift();
	if (!word) word = tokens(await readLine(prompt, () => options))[0];
	if (!word) throw new Abort();
	return resolve(word, options, what);
}

// ---- The data, formatted the way the format strings in the dump say.

const pretty = (sym) => sym.toLowerCase().replace(/(^|-)([a-z])/g, (_, d, c) => (d ? " " : "") + c.toUpperCase());
const list = (xs) => xs.map(pretty).join(", ");
const plural = (n) => (n === 1 ? "" : "s");

function clock(h) {
	const hh = Math.floor(h) % 24;
	const mm = Math.round((h - Math.floor(h)) * 60);
	const ampm = hh < 12 ? "am" : "pm";
	return `${hh % 12 || 12}:${String(mm).padStart(2, "0")}${ampm}`; // ~D:~2,'0D~A
}
function intervals(spec) {
	const [start, ...times] = spec;
	const out = [];
	for (let i = 0; i + 1 < times.length; i += 2) {
		let [a, b] = [times[i], times[i + 1]];
		if (typeof a !== "number" || typeof b !== "number") continue;
		if (b < a) b += 12; // "11.5 11.0" is 11:30am-11pm
		if (a === 0 && times.length > 2) continue; // the after-midnight tail; shown as the late close below
		out.push([a, b]);
	}
	const late = times[0] === 0 && times.length > 2 ? times[1] : null;
	const range = ([a, b]) => (a === 0 && b === 24 ? "24 hours" : `${clock(a)}-${b === 24 && late !== null ? clock(late) : clock(b)}`);
	return { day: start, ranges: out.map(range) };
}
function hoursText(site) {
	if (site["pretty-hours"]) return `Open ${site["pretty-hours"]}.`;
	if (!site.hours?.length) return `Exact time info not available.`; // ~Atime with an empty ~A
	const lines = site.hours.map(intervals).filter((h) => h.ranges.length);
	if (lines.length === 1 && lines[0].day === true) return `Open ${lines[0].ranges.join(", ")}.`;
	return `Open ${lines.map((h) => `${h.day === true ? "otherwise" : pretty(h.day)} ${h.ranges.join(", ")}`).join(";\n     ")}.`;
}
function openNow(site, now = new Date()) {
	const day = DAYS[now.getDay()];
	if (site.closed?.includes(day)) return false;
	if (!site.hours?.length) return true;
	const spec = site.hours.find((h) => h[0] === day) ?? site.hours.find((h) => h[0] === true);
	if (!spec) return true;
	const h = now.getHours() + now.getMinutes() / 60;
	const t = spec.slice(1);
	for (let i = 0; i + 1 < t.length; i += 2) {
		let [a, b] = [t[i], t[i + 1]];
		if (typeof a !== "number" || typeof b !== "number") return true;
		if (b < a) b += 12;
		if (h >= a && h < b) return true;
	}
	return false;
}
function costText(cost, bite) {
	if (cost == null) return null;
	if (typeof cost === "number") return `about ${cost} dollars`;
	if (cost.range) {
		const [a, b] = cost.range;
		if (Array.isArray(a)) return costText({ range: [a[1], b] }, bite);
		return `${a}-${b} dollars`;
	}
	if (!Array.isArray(cost)) return null;
	if (cost[0] === "~") return `about ${cost[1]} dollars`;
	if (cost[0] === ">") return `more than ${cost[1]} dollars`;
	if (cost[0] === "<") return `less than ${cost[1]} dollars`;
	// Per bite size: ((SMALL ~ 3) ((MEDIUM 3) . 8) ((LARGE 8) . 15))
	const bySize = cost.find((c) => (Array.isArray(c) ? c[0] : c?.range?.[0]?.[0]) === bite) ?? cost[0];
	const inner = Array.isArray(bySize) ? bySize.slice(1) : bySize;
	return `${costText(inner, bite)}, for bite size ${bite}`;
}

// ---- Program state.

let bite = "MEDIUM";
let connected = null;
const ALL = Object.keys(SITES);
let active = new Set(ALL);
const ALL_TYPES = [...new Set(ALL.flatMap((s) => SITES[s].type ?? []))].sort();
const ALL_PLACES = [...new Set(ALL.flatMap((s) => SITES[s].location ?? []))].sort();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitOutput = async () => {
	while (queue.length) await sleep(30);
};

// ---- Network filters: a class of servers.

const FILTERS = {
	ALL: { doc: "Refers to the set of all servers.", fn: async () => new Set(ALL) },
	NONE: { doc: "Refers to the empty of servers.", fn: async () => new Set() },
	NOT: {
		doc: "Refers to the complement of some server class.",
		fn: async (rest) => {
			const c = await readClass(rest);
			return new Set(ALL.filter((s) => !c.has(s)));
		},
	},
	TYPE: {
		doc: "Refers to all servers of a specified type.",
		fn: async (rest) => {
			const t = await arg(rest, "type: ", ALL_TYPES, "type");
			return new Set(ALL.filter((s) => SITES[s].type?.includes(t)));
		},
	},
	LOCATION: {
		doc: "Refers to all servers in a given area",
		fn: async (rest) => {
			const p = await arg(rest, "location: ", ALL_PLACES, "location");
			return new Set(ALL.filter((s) => SITES[s].location?.includes(p)));
		},
	},
	QUALITY: {
		doc: "Refers to all servers at least as good as a speicified quality.",
		fn: async (rest) => {
			const q = Number(rest.shift() ?? tokens(await readLine("quality: ", null))[0]);
			if (!Number.isFinite(q)) throw new CommandError("Quality is a number of stars."); // guessed
			return new Set(ALL.filter((s) => (SITES[s].stars ?? 0) >= q));
		},
	},
	HELP: { doc: "Gives help on a given command type.", fn: async (rest) => (await helpOn("NETWORK-FILTER", FILTERS, rest), null) },
};
async function readClass(rest) {
	const name = await arg(rest, "class: ", Object.keys(FILTERS), "class");
	return FILTERS[name].fn(rest);
}

const NETWORK = {
	SHOW: { doc: "Displays the active server network.", fn: async () => showSites() },
	SET: {
		doc: "Sets the active network to a specified class",
		fn: async (rest) => {
			const c = await readClass(rest);
			if (c) active = c;
		},
	},
	ADD: {
		doc: "Adds any servers in a given class to the active network",
		fn: async (rest) => {
			const c = await readClass(rest);
			if (c) for (const s of c) active.add(s);
		},
	},
	REMOVE: {
		// The recovered doc string; whether the code kept or removed the class is not recoverable, so it keeps, as documented.
		doc: "Keeps only servers in a given class to the active network",
		fn: async (rest) => {
			const c = await readClass(rest);
			if (c) active = new Set([...active].filter((s) => c.has(s)));
		},
	},
	HELP: { doc: "Gives help on a given command type.", fn: async (rest) => helpOn("NETWORK-COMMAND", NETWORK, rest) },
};

function showSites() {
	if (!active.size) return say("No active sites.");
	emit(fresh() + "Active sites are: " + wrapList([...active].sort()) + ".\n");
}

// ---- Commands.

const COMMANDS = {
	CONNECT: {
		doc: "Connects to a given site.",
		fn: async (rest) => {
			const site = await arg(rest, "Open connection to: ", [...active].sort(), "site");
			if (connected === site) return say(`Already connected to ${site}`);
			if (connected) await disconnect();
			const s = SITES[site];
			if (Math.random() < 0.15) {
				say("Host not responding. Still trying...");
				await waitOutput();
				await sleep(1500 + Math.random() * 2500);
				if (Math.random() < 0.25) return say("Attempt to open connection to server timed out.");
			}
			if (!openNow(s)) {
				say(`Host unavailable due to scheduled down.\n${hoursText(s)}${s.closed ? `\nClosed ${list(s.closed)}.` : ""}`);
				return;
			}
			connected = site;
			if (s.notes?.some((n) => /^Experimental/.test(n))) say("Warning: Site being debugged. ");
			const extra = s.menu || s[bite.toLowerCase()] ? ["Use the MENU command to see this server's menu."] : [];
			say([`Connection open to ${site}. Bite size is ${bite}.`, ...extra].join("\n"));
		},
	},
	DISCONNECT: { doc: "Connects from the current site.", fn: async () => (connected ? disconnect() : say("No connection to close.")) },
	STATUS: { doc: "Describes the status of the current connection.", fn: async () => status() },
	MENU: {
		doc: "Lists the connected site's menu",
		fn: async () => {
			if (!connected) return say("You must connect to a site to see a menu.");
			const s = SITES[connected];
			const menu = s[bite.toLowerCase()] ?? s.menu;
			if (!menu?.length) return say("No menu available.");
			emit(fresh() + menu.join("\n") + "\n");
		},
	},
	BITE: {
		doc: "Changes the current bite-size.",
		fn: async (rest) => {
			bite = await arg(rest, "Set bite-size to: ", BITES, "bite size");
			say(`Current bite size is ${bite}`);
		},
	},
	SITES: { doc: "Display the active sites", fn: async () => showSites() },
	NETWORK: {
		doc: "Edit the active network of servers to be considered.",
		fn: async (rest) => {
			const sub = await arg(rest, "Network command: ", Object.keys(NETWORK), "network command");
			await NETWORK[sub].fn(rest);
		},
	},
	TIME: { doc: "Prints the current time", fn: async () => say(`It's now ${now()}.`) },
	HELP: { doc: "Gives help on a given command type.", fn: async (rest) => helpOn("COMMAND", COMMANDS, rest) },
	QUIT: {
		doc: "Exits the program.",
		fn: async () => {
			if (connected) await disconnect();
			emit(":KILL\n*"); // guessed: back at DDT
			await waitOutput();
			throw new Quit();
		},
	},
};
class Quit extends Error {}

async function disconnect() {
	say(`Closing connection to ${connected}...`);
	connected = null;
}
async function helpOn(kind, table, rest) {
	const word = rest.shift() ?? tokens(await readLine(`Help with ${kind}: `, () => Object.keys(table)))[0];
	if (!word) return emit(fresh() + Object.keys(table).map((k) => `${k.padEnd(11)} ${table[k].doc}`).join("\n") + "\n");
	const k = resolve(word, Object.keys(table), kind.toLowerCase());
	say(`${k} - ${table[k].doc}`); // guessed layout
}

function status() {
	if (!connected) return say("There is no open connection.");
	const s = SITES[connected];
	const lines = [`Connection open to ${connected}. Bite size is ${bite}.`];
	if (s.type) lines.push(`Connection mode${plural(s.type.length)} ${list(s.type)}.`);
	if (s.address) lines.push(`Located ${s.address}.`);
	if (s.subway) lines.push(`Near subway stop${plural(s.subway.length)} ${list(s.subway)}.`);
	lines.push(`${s["take-out"] ? "Take-out. " : ""}${s.delivery ? "Delivery. " : ""}Phone ${s.phone ?? "unknown"}`);
	const cost = costText(s.cost, bite);
	if (s.stars != null || cost) lines.push(`${s.stars != null ? `${s.stars} stars. ` : ""}${cost ? `Estimated cost: ${cost}.` : ""}`.trim());
	lines.push(hoursText(s) + (s.closed ? `\nClosed ${list(s.closed)}.` : ""));
	if (s.notes?.length) lines.push(`Notes: ${s.notes.map((n) => n.replace(/\.$/, "")).join(".\n       ")}.`);
	lines.push(`Last updated ${s["last-update"]}.`); // guessed wording; LAST-UPDATE is in every entry
	say(lines.join("\n"));
}

function now() {
	const d = new Date();
	const zone = d.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop();
	const p = (n) => String(n).padStart(2, "0");
	// ~A the ~:R of ~A, ~D; ~D:~2,'0D:~2,'0D ~A
	return `${pretty(DAYS[d.getDay()])} the ${ORDINALS[d.getDate()]} of ${MONTHS[d.getMonth()]}, ${d.getFullYear()}; ${d.getHours()}:${p(d.getMinutes())}:${p(d.getSeconds())} ${zone}`;
}

// The completer for the top-level line: a command, then that command's argument.
function topComplete(done) {
	if (!done.length) return Object.keys(COMMANDS);
	const cmd = Object.keys(COMMANDS).find((c) => c.startsWith(done[0].toUpperCase()));
	const sites = [...active].sort();
	const filterArg = (i) => {
		const f = done[i]?.toUpperCase();
		const name = f && Object.keys(FILTERS).find((k) => k.startsWith(f));
		if (done.length === i) return Object.keys(FILTERS);
		if (name === "TYPE" && done.length === i + 1) return ALL_TYPES;
		if (name === "LOCATION" && done.length === i + 1) return ALL_PLACES;
		if (name === "NOT") return filterArg(i + 1);
		return null;
	};
	if (done.length === 1) {
		if (cmd === "CONNECT") return sites;
		if (cmd === "BITE") return BITES;
		if (cmd === "NETWORK") return Object.keys(NETWORK);
		if (cmd === "HELP") return Object.keys(COMMANDS);
	}
	if (cmd === "NETWORK") {
		const sub = done[1] && Object.keys(NETWORK).find((k) => k.startsWith(done[1].toUpperCase()));
		if (["SET", "ADD", "REMOVE"].includes(sub)) return filterArg(2);
		if (sub === "HELP" && done.length === 2) return Object.keys(NETWORK);
	}
	return null;
}

// ---- Top level.

async function main() {
	emit(`FTP.${VERSION} (Food Transfer Protocol) - Type "?" for a list of commands.\n`);
	emit(`Will use ${bite} transfer mode. (BITE command can change this)\n${HOST}, Food server - FTP.${VERSION}\nBugs/Gripes to ${GRIPES}\n`);
	for (;;) {
		try {
			const line = await readLine("FTP>", topComplete); // guessed prompt
			const words = tokens(line);
			if (!words.length) continue;
			const cmd = resolve(words.shift(), Object.keys(COMMANDS), "command");
			await COMMANDS[cmd].fn(words);
		} catch (e) {
			if (e instanceof Quit) break;
			if (e instanceof Abort) say("?Command aborted.");
			else if (e instanceof CommandError) say(`?${e.message}`);
			else {
				say(`?Error: ${e.message}\n Please report bug in FTP.${VERSION} to ${GRIPES}`);
				console.error(e);
			}
		}
	}
	await readLine("", null); // any line restarts, as if you ran it again
	emit("\f");
	connected = null;
	main();
}

main();
