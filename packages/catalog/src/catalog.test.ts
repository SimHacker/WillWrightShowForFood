import assert from "node:assert/strict";
import { test } from "node:test";
import { Catalog, slug, slugPath, normalizeTags } from "./catalog.js";
import { parseLaunch, launchUrl, effectiveValues, nest } from "./launch.js";

const sample = () =>
	new Catalog().add(
		{
			folders: [
				{ path: "games", title: "Games", order: 1 },
				{ path: "languages", title: "Languages", order: 2 },
				{ path: "forths", title: "Every Forth", query: { tags: { language: "forth" } } }
			],
			defaults: { tags: { machine: "apple2" }, runs: { machine: "apple2" }, inputs: { speed: { path: "machine.speed", type: "number", default: 1, min: 0.5, max: 16 } } },
			entries: [
				{
					id: "lcp",
					title: "Little Computer People",
					path: "Games/Simulations/Little Computer People",
					also: ["people/david-crane"],
					was: ["apple2/lcp"],
					tags: { year: 1985, by: ["david-crane"] },
					runs: { disk: "lcp.dsk" }
				},
				{
					id: "apple-forth",
					title: "ProDOS Forth",
					path: "languages/forth/apple-ii",
					tags: ["language:forth", "by:don-hopkins"],
					runs: { disk: "forth.po", profile: "apple2-plus-videx" },
					mixins: ["forth-ok", "player/*"],
					inputs: { baud: { path: "serial.baud", type: "integer", default: 9600, values: ["300", "1200", "9600", "19200"] }, term: true }
				},
				{ id: "notes", title: "Notes on Forth", path: "languages/forth/notes", tags: { language: "forth" } }
			]
		},
		"sample.yml"
	);

test("slugs", () => {
	assert.equal(slug("Little Computer People"), "little-computer-people");
	assert.equal(slug("Apple ][ Forth"), "apple-forth");
	assert.equal(slug("Don Hopkins's ProDOS Forth"), "don-hopkinss-prodos-forth");
	assert.equal(slug("Électronique"), "electronique");
	assert.equal(slugPath("/Games/ Simulations //Little Computer People/"), "games/simulations/little-computer-people");
});

test("tags from a map or from facet:value strings", () => {
	assert.deepEqual(normalizeTags({ Machine: "apple2", by: ["a", "b", "a"], year: 1985 }), { machine: ["apple2"], by: ["a", "b"], year: ["1985"] });
	assert.deepEqual(normalizeTags(["language:forth", "role::game", "fun"]), { language: ["forth"], role: ["game"], tag: ["fun"] });
});

test("entries are normalized, with the file's defaults under them", () => {
	const c = sample();
	assert.deepEqual(c.problems, []);
	const lcp = c.entry("lcp")!;
	assert.equal(lcp.path, "games/simulations/little-computer-people");
	assert.deepEqual(lcp.tags, { machine: ["apple2"], year: ["1985"], by: ["david-crane"] });
	assert.deepEqual(lcp.runs, { machine: "apple2", disk: "lcp.dsk" });
	assert.equal(lcp.inputs.speed?.default, 1);
	assert.equal(c.entry("notes")!.runs, undefined, "default runs never make a container runnable");
	assert.equal(c.entry("apple-forth")!.inputs.term?.type, "string");
});

test("the root resolves, declared or not, and features entries from anywhere", () => {
	const bare = sample();
	assert.equal(bare.resolve("")?.path, "");
	assert.equal(bare.resolve("")?.entry, undefined);
	const c = sample().add({ root: { title: "Cabinet", description: "Welcome.", featured: ["apple-forth", "games/simulations/little-computer-people", "nope"] } }, "root.yml");
	const root = c.tree()!;
	assert.equal(root.title, "Cabinet");
	assert.equal(root.folder?.description, "Welcome.");
	assert.deepEqual(
		c.featured(root.folder).map((e) => e.id),
		["apple-forth", "lcp"]
	);
	assert.equal(c.problems.length, 1, "a featured name that names nothing is a problem");
	assert.ok(!root.children.some((n) => n.path === ""), "the root is not its own child");
	assert.ok(parseLaunch(c, "/cabinet/")?.folder, "the bare address is the root folder");
});

test("the tree comes from the paths; folders are implied or declared", () => {
	const c = sample();
	const root = c.tree()!;
	assert.deepEqual(
		root.children.map((n) => n.slug),
		["games", "languages", "forths", "people"],
		"declared order first, then by title"
	);
	const games = c.tree("games")!;
	assert.equal(games.title, "Games");
	const sims = games.children[0]!;
	assert.equal(sims.title, "Simulations", "an implied folder is titled from its slug");
	assert.equal(sims.children[0]?.entry?.id, "lcp");
	const crane = c.tree("people/david-crane")!;
	assert.equal(crane.children.length, 1);
	assert.equal(crane.children[0]?.link, true);
	assert.equal(crane.children[0]?.entry?.path, "games/simulations/little-computer-people");
});

test("a query folder lists what matches, as links", () => {
	const forths = sample().tree("forths")!;
	assert.deepEqual(forths.children.map((n) => n.entry?.id).sort(), ["apple-forth", "notes"]);
	assert.ok(forths.children.every((n) => n.link));
});

test("resolve: own paths, folders, old paths and also listings", () => {
	const c = sample();
	assert.equal(c.resolve("games/simulations/little-computer-people")?.entry?.id, "lcp");
	assert.equal(c.resolve("Games")?.folder?.title, "Games");
	assert.equal(c.resolve("apple2/lcp")?.redirect, "games/simulations/little-computer-people");
	assert.equal(c.resolve("people/david-crane/little-computer-people")?.redirect, "games/simulations/little-computer-people");
	assert.equal(c.resolve("nowhere"), undefined);
});

test("find: every facet must match, any value within a facet", () => {
	const c = sample();
	assert.deepEqual(c.find({ tags: { language: "forth" } }).map((e) => e.id), ["apple-forth", "notes"]);
	assert.deepEqual(c.find({ tags: { language: "forth", by: ["don-hopkins", "nobody"] } }).map((e) => e.id), ["apple-forth"]);
	assert.deepEqual(c.find({ text: "little people" }).map((e) => e.id), ["lcp"]);
	assert.deepEqual(c.find({ tags: { language: "forth" }, runnable: true }).map((e) => e.id), ["apple-forth"]);
});

test("facets and the tree by one facet", () => {
	const c = sample();
	assert.deepEqual(c.facets().machine, { apple2: 3 });
	const byYear = c.byFacet("year");
	assert.deepEqual(byYear.children.map((n) => n.title), ["1985"]);
	assert.equal(byYear.children[0]?.children[0]?.entry?.id, "lcp");
});

test("problems are reported, not thrown", () => {
	const c = new Catalog()
		.add({ entries: [{ id: "a", path: "x/a" }, { id: "a", path: "x/b" }, { id: "c", path: "x/a" }, { title: "no path" }] }, "bad.yml")
		.add("not a map", "worse.yml");
	assert.equal(c.entries.length, 1);
	assert.equal(c.problems.length, 4);
	assert.match(c.problems[0]?.message ?? "", /duplicate id a/);
	assert.match(c.problems[1]?.message ?? "", /duplicate path x\/a/);
});

test("a URL: path, mixins the entry allows, inputs by name or path, the rest ignored", () => {
	const c = sample();
	const l = parseLaunch(c, "/cabinet/languages/forth/apple-ii/", "with=forth-ok,player/don,rootkit&baud=19200&serial.baud=1200&speed=99&term=on&evil=1")!;
	assert.equal(l.entry?.id, "apple-forth");
	assert.deepEqual(l.with, ["forth-ok", "player/don"]);
	assert.deepEqual(l.values, { "serial.baud": 1200, term: "on" });
	assert.deepEqual(
		l.ignored.map((i) => `${i.param}=${i.value}: ${i.reason}`),
		["with=rootkit: not a mixin apple-forth accepts", "speed=99: above 16", "evil=1: not an input of apple-forth"]
	);
	assert.deepEqual(nest(effectiveValues(l.entry!, l.values)), { machine: { speed: 1 }, serial: { baud: 1200 }, term: "on" });
});

test("a URL through an old path says where the entry is now", () => {
	const l = parseLaunch(sample(), "/cabinet/apple2/lcp", "speed=2")!;
	assert.equal(l.redirect, "games/simulations/little-computer-people");
	assert.deepEqual(l.values, { "machine.speed": 2 });
	assert.equal(parseLaunch(sample(), "/cabinet/games", "speed=2")!.ignored[0]?.reason, "a folder takes no parameters");
	assert.equal(parseLaunch(sample(), "/cabinet/no/such/thing"), undefined);
});

test("the canonical URL round-trips, and leaves out defaults", () => {
	const c = sample();
	const forth = c.entry("apple-forth")!;
	const url = launchUrl(forth, { with: ["player/don", "nope"], values: { "serial.baud": 19200, "machine.speed": 1 } });
	assert.equal(url, "/cabinet/languages/forth/apple-ii/?with=player/don&baud=19200");
	const u = new URL(url, "http://x");
	const back = parseLaunch(c, u.pathname, u.search)!;
	assert.deepEqual(back.with, ["player/don"]);
	assert.deepEqual(back.values, { "serial.baud": 19200 });
	assert.equal(launchUrl(forth, {}, { base: "/", slash: false }), "/languages/forth/apple-ii");
});

test("an entry's order puts it among its siblings before the ones ordered by title", () => {
	const c = new Catalog().add({
		folders: [
			{ path: "devices", title: "Devices", order: 2 },
			{ path: "languages", title: "Languages", order: 1 },
			{ path: "pdp-7", title: "PDP-7", query: { tags: { machine: "pdp7" } } }
		],
		entries: [
			{ id: "apple", title: "Apple Forth", path: "languages/apple-forth", tags: { machine: "apple2" } },
			{ id: "turing", title: "Turing Machine", path: "devices/turing-machine", order: 3, tags: { machine: "pdp7" } },
			{ id: "hand", title: "DataHand", path: "devices/datahand", order: 2, tags: { machine: "pdp7" } },
			{ id: "zork", title: "A Zork Box", path: "devices/zork-box", tags: { machine: "pdp7" } },
			{ id: "ultimate", title: "Ultimate Machine", path: "devices/ultimate-machine", order: 1, tags: { machine: "pdp7" } },
			{ id: "forth", title: "Forth + Turtle", path: "languages/forth-turtle", order: 1, tags: { machine: "pdp7" } }
		]
	});
	assert.deepEqual(c.tree("devices")!.children.map((n) => n.entry?.id), ["ultimate", "hand", "turing", "zork"]);
	assert.deepEqual(c.tree("languages")!.children.map((n) => n.entry?.id), ["forth", "apple"]);
	assert.deepEqual(
		c.tree("pdp-7")!.children.map((n) => n.entry?.id),
		["forth", "ultimate", "hand", "turing", "zork"],
		"a saved filter keeps the folders' order, and each folder's own order inside it"
	);
});
