import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { Flavors, memorySource, OVERLAY, FlavorError, type Content } from "./flavors.js";
import { build, image, steps, unzip } from "./recipe.js";
import { merge, type Plain, type PlainMap, type Provenance } from "./merge.js";
import { json } from "./syntax.js";
import { yaml } from "./yaml.js";
import { ogdl } from "./ogdl.js";
import { glob } from "./glob.js";
import { dirSource, bake } from "./node.js";

const syntaxes = [yaml, json, { ...ogdl, extensions: [".ogdl", ".cfg"] }];

const pdp7 = {
	"pdp7/flavor.yml": "# A bare PDP-7.\nmachine:\n  cpu: pdp7\n  memory: { core_words: 8192 }\n  devices: [teletype, clock]\nlabel: PDP-7\n",
	"pdp7/forth/flavor.yml": "parents: pdp7\nlabel: Forth\nmachine:\n  devices: [teletype, clock, papertape, type340]\n",
	"pdp7/forth/flowers/flavor.yml": "parents: forth\nlabel: FLOWERS # the demo\n",
	"pdp7/forth/flowers/don/flavor.json": '{ "parents": ["flowers"], "player": "don", "machine": { "memory": { "core_words": 16384 } } }',
};

test("merge: maps merge, scalars and arrays replace, null deletes", () => {
	const out = merge({ a: 1, m: { x: 1, y: 2 }, l: [1, 2] }, { a: 2, m: { y: null, z: 3 }, l: [3] });
	assert.deepEqual(out, { a: 2, m: { x: 1, z: 3 }, l: [3] });
});

test("merge: a map patch over a scalar starts a fresh map and drops its nulls", () => {
	assert.deepEqual(merge(5, { a: null, b: 1 }), { b: 1 });
});

test("combination rules: replace, append, keyed entries with remove", () => {
	const rules = [
		{ path: "containers.*", combine: "replace" as const },
		{ path: "packages", combine: "append" as const },
		{ path: "resources", combine: { key: "path" } },
	];
	const base: Plain = {
		containers: { web: { image: "a", port: 80 } },
		packages: ["gcc", "curl"],
		resources: [{ path: "a.fs", kind: "source" }, { path: "b.fs", kind: "source", lang: "forth" }],
	};
	const patch: Plain = {
		containers: { web: { image: "b" } },
		packages: ["curl", "git"],
		resources: [{ path: "a.fs", remove: true }, { path: "b.fs", lang: "cambridge" }, { path: "c.oct", kind: "image" }],
	};
	const provenance: Provenance = new Map();
	const out = merge(base, patch, { rules, origin: "child", provenance });
	assert.deepEqual(out, {
		containers: { web: { image: "b" } },
		packages: ["gcc", "curl", "git"],
		resources: [{ path: "b.fs", kind: "source", lang: "cambridge" }, { path: "c.oct", kind: "image" }],
	});
	assert.deepEqual(provenance.get("resources[b.fs].lang"), ["child"]);
	assert.deepEqual(provenance.get("containers.web.image"), ["child"]);
});

test("merge rules: keyed entries can replace whole", () => {
	const rules = [{ path: "build", combine: { key: "id", entries: "replace" as const } }];
	const out = merge({ build: [{ id: "asm", step: "assemble", dialect: "as7" }] }, { build: [{ id: "asm", step: "assemble" }] }, { rules });
	assert.deepEqual(out, { build: [{ id: "asm", step: "assemble" }] });
});

test("single inheritance: generic PDP-7, Forth, an app, a player", () => {
	const f = new Flavors(memorySource(pdp7), { syntaxes });
	assert.deepEqual(f.ids(), ["pdp7", "pdp7/forth", "pdp7/forth/flowers", "pdp7/forth/flowers/don"]);
	assert.deepEqual(f.order("pdp7/forth/flowers/don"), ["pdp7", "pdp7/forth", "pdp7/forth/flowers", "pdp7/forth/flowers/don"]);
	const r = f.instantiate("pdp7/forth/flowers/don");
	assert.deepEqual(r.data, {
		machine: { cpu: "pdp7", memory: { core_words: 16384 }, devices: ["teletype", "clock", "papertape", "type340"] },
		label: "FLOWERS",
		player: "don",
	});
	assert.deepEqual(r.provenance.get("machine.cpu"), ["pdp7"]);
	assert.deepEqual(r.provenance.get("machine.memory.core_words"), ["pdp7/forth/flowers/don"]);
	assert.deepEqual(f.leaves(), ["pdp7/forth/flowers/don"]);
});

test("multiple inheritance: later parent wins; a diamond's shared ancestor applies once, first", () => {
	const f = new Flavors(
		memorySource({
			"base/flavor.yml": "x: base\ny: base\n",
			"a/flavor.yml": "parents: [base]\nx: a\n",
			"b/flavor.yml": "parents: [base]\nz: b\n",
			"c/flavor.yml": "parents: [a, b]\n",
			"d/flavor.yml": "parents: [b, a]\nz: d\n",
		}),
	);
	assert.deepEqual(f.order("c"), ["base", "a", "b", "c"]);
	assert.deepEqual(f.instantiate("c").data, { x: "a", y: "base", z: "b" });
	assert.deepEqual(f.order("d"), ["base", "b", "a", "d"]);
	assert.deepEqual(f.instantiate("d").data, { x: "a", y: "base", z: "d" });
	assert.deepEqual(f.precedence("c"), ["c", "b", "a", "base"]);
});

test("C3: an ancestor's own order is kept, and parents that disagree are an error", () => {
	const f = new Flavors(
		memorySource({
			"o/flavor.yml": "k: o\n",
			"a/flavor.yml": "parents: [o]\n",
			"b/flavor.yml": "parents: [o]\n",
			"c/flavor.yml": "parents: [o]\n",
			"k1/flavor.yml": "parents: [c, b, a]\n",
			"k2/flavor.yml": "parents: [b, a]\n",
			"z/flavor.yml": "parents: [k2, k1]\n",
			"x/flavor.yml": "parents: [a, b]\n",
			"y/flavor.yml": "parents: [b, a]\n",
			"bad/flavor.yml": "parents: [x, y]\n",
		}),
	);
	const z = f.order("z");
	assert.ok(z.indexOf("c") < z.indexOf("b") && z.indexOf("b") < z.indexOf("a"), z.join(" "));
	assert.ok(z.indexOf("k2") < z.indexOf("k1"));
	assert.throws(() => f.order("bad"), /bad: its ancestors disagree on the order of/);
});

test("null deletes an inherited key, and an overlay's null deletes from the type", () => {
	const f = new Flavors(
		memorySource({
			"m/flavor.yml": "slots: { 1: parallel, 2: ssc, 3: videx }\n",
			"n/flavor.yml": "parents: [m]\nslots: { 1: null }\n",
			"mix/flavor.yml": "slots: { 4: serial }\n",
		}),
	);
	assert.deepEqual(f.instantiate("n").data, { slots: { 2: "ssc", 3: "videx" } });
	const r = f.instantiate("n", { overlay: { parents: ["mix"], slots: { 2: null } } });
	assert.deepEqual(r.data, { slots: { 3: "videx", 4: "serial" } });
	assert.deepEqual(r.order, ["m", "n", "mix", OVERLAY]);
	assert.deepEqual(f.instantiate("n", { overlay: "mix" }).data, { slots: { 2: "ssc", 3: "videx", 4: "serial" } });
});

test("parents: one name or a list of references, nearest match by name, errors that name the flavor", () => {
	const f = new Flavors(
		memorySource({
			"apple2/forth/flavor.yml": "cpu: 6502\n",
			"pdp7/forth/flavor.yml": "cpu: pdp7\n",
			"pdp7/forth/flowers/flavor.yml": "parents: forth\n",
			"apple2/demo/flavor.yml": "parents: [forth, nothing]\n",
			"x/flavor.yml": "parents: forth\n",
			"y/flavor.yml": "extends: forth\n",
		}),
	);
	assert.equal(f.instantiate("pdp7/forth/flowers").data.cpu, "pdp7");
	assert.deepEqual(f.parentFlavors("pdp7/forth/flowers").map((p) => p.id), ["pdp7/forth"]);
	assert.deepEqual(f.instantiate("y").data, { extends: "forth" });
	assert.throws(() => new Flavors(memorySource({ "z/flavor.yml": "parents: [{ a: 1 }]\n" })), /z\/flavor.yml: parents holds/);
	assert.throws(() => f.order("apple2/demo"), /apple2\/demo: no flavor nothing/);
	assert.throws(() => f.order("x"), /could be apple2\/forth or pdp7\/forth/);
	const loop = new Flavors(memorySource({ "a/flavor.yml": "parents: [b]\n", "b/flavor.yml": "parents: [a]\n" }));
	assert.throws(() => loop.order("a"), (e: unknown) => e instanceof FlavorError && /cycle: a > b > a/.test(e.message));
});

test("abstract flavors are not instantiated or offered; requires are checked at instantiation", () => {
	const f = new Flavors(
		memorySource({
			"vanilla/flavor.yml": "abstract: true\nmachine: {}\n",
			"apple2/flavor.yml": "parents: [vanilla]\nabstract: true\nmachine: { cpu: 6502 }\nslots: {}\n",
			"serial-slot4/flavor.yml": "abstract: true\nrequires: { flavors: [apple2], keys: [machine.cpu] }\nslots: { 4: acia-c800 }\n",
			"term-needs-serial/flavor.yml": "abstract: true\nrequires: { keys: [slots.4] }\n",
			"forth/flavor.yml": "parents: [apple2, term-needs-serial]\n",
			"forth-term/flavor.yml": "parents: [apple2, serial-slot4, term-needs-serial]\n",
			"pdp7-serial/flavor.yml": "parents: [serial-slot4]\nmachine: { cpu: pdp7 }\n",
		}),
	);
	assert.deepEqual(f.leaves(), ["forth", "forth-term", "pdp7-serial"]);
	assert.throws(() => f.instantiate("apple2"), /apple2 is abstract/);
	assert.throws(() => f.instantiate("forth"), /forth: term-needs-serial requires key slots\.4/);
	assert.deepEqual(f.instantiate("forth-term").data.slots, { 4: "acia-c800" });
	assert.throws(() => f.instantiate("pdp7-serial"), /serial-slot4 requires flavor apple2/);
	assert.equal(f.get("serial-slot4").data.abstract, undefined);
	assert.equal(f.instantiate("forth-term").data.requires, undefined);
});

test("ids are stripped, not inherited", () => {
	const f = new Flavors(memorySource({ "a/flavor.yml": "id: a\nk: 1\n", "b/flavor.yml": "parents: a\n" }));
	assert.deepEqual(f.instantiate("b").data, { k: 1 });
});

test("comments: a key's comment is inherited; a line comment leaves with its value", () => {
	const f = new Flavors(memorySource(pdp7), { syntaxes });
	const r = f.instantiate("pdp7/forth/flowers");
	assert.equal(r.notes.get("label")?.after, " the demo");
	const out = r.render("yaml");
	assert.match(out, /^# A bare PDP-7\./);
	assert.match(out, /label: FLOWERS # the demo/);
	const g = new Flavors(
		memorySource({
			"a/flavor.yml": "# the speed\nspeed: 1 # slow\n",
			"b/flavor.yml": "parents: a\nspeed: 2\n",
		}),
	);
	const n = g.instantiate("b").notes.get("speed");
	assert.deepEqual(n, { before: " the speed" });
	assert.equal(g.instantiate("b").render("yaml"), "# the speed\nspeed: 2\n");
});

test("syntaxes mix: a YAML parent, a JSON child, written out as OGDL", () => {
	const f = new Flavors(memorySource(pdp7), { syntaxes });
	const r = f.instantiate("pdp7/forth/flowers/don");
	const text = r.render("ogdl");
	assert.match(text, /^# A bare PDP-7\.\nmachine\n  cpu\n    pdp7\n/);
	assert.match(text, /\nlabel\n  FLOWERS  # the demo\n/);
	assert.deepEqual(ogdl.parse(text).value, r.data);
});

test("ogdl: microPAK cfg round trip, chains, commas, quotes, comments", () => {
	const cfg = "init\n  video\n    scanline\n      0.7777777\n    layerpos\n      0\n      0\n      0\n  controlprograms\n   \"control,control2\"\n";
	const p = ogdl.parse(cfg);
	assert.deepEqual(p.value, { init: { video: { scanline: 0.7777777, layerpos: [0, 0, 0] }, controlprograms: "control,control2" } });
	assert.equal(ogdl.stringify(p.value, p.notes), cfg.replace("   \"", "    \""));
	assert.deepEqual(ogdl.parse("a b c\nd, e\n").value, { a: { b: "c" }, d: {}, e: {} });
	const c = ogdl.parse("# header\ninit\n  # the machine\n  profile  # line\n    apple2e-en\n");
	assert.deepEqual(c.value, { init: { profile: "apple2e-en" } });
	assert.equal(c.notes?.get("init")?.before, " header");
	assert.deepEqual(c.notes?.get("init.profile"), { before: " the machine", after: " line" });
	assert.equal(ogdl.stringify(c.value, c.notes), "# header\ninit\n  # the machine\n  profile\n    apple2e-en  # line\n");
	assert.deepEqual(ogdl.parse(ogdl.stringify({ s: "007", n: "12" })).value, { s: "007", n: "12" });
	assert.equal(ogdl.stringify({ slots: { 3: "videx" } }), "slots\n  3\n    videx\n");
});

const apple2 = {
	"apple2/flavor.yml": "machine: { cpu: 6502 }\n",
	"apple2/micropak/boot.cfg": "init\n  profile\n    apple2e-en\n",
	"apple2/micropak/video.cfg": "init\n  video\n    scanline\n      0.7777777\n    hgrmode\n      2\n",
	"apple2/plus-videx/flavor.yml": "parents: apple2\nslots: { 3: videx }\n",
	"apple2/plus-videx/micropak/boot.yml": "init:\n  profile: apple2-plus-videx # the Videx profile\n",
	"apple2/plus-videx/forth/flavor.yml": "parents: plus-videx\ndisks: [forth.po]\n",
	"apple2/plus-videx/forth/forth.po": "DISK-BYTES",
	"apple2/plus-videx/forth/micropak/video.cfg": "init\n  video\n    hgrmode\n      0\n",
};

const micropak = { match: "micropak/*", overlay: true };

test("files keep their flavor's path; overlay files merge across syntaxes at the image root", () => {
	const f = new Flavors(memorySource(apple2), { syntaxes, files: [micropak] });
	const r = f.instantiate("apple2/plus-videx/forth");
	assert.deepEqual(r.data, { machine: { cpu: 6502 }, slots: { 3: "videx" }, disks: ["forth.po"] });
	const byName = new Map(r.files.map((x) => [x.name, x]));
	assert.deepEqual([...byName.keys()].sort(), ["apple2/plus-videx/forth/forth.po", "micropak/boot", "micropak/video"]);
	const disk = byName.get("apple2/plus-videx/forth/forth.po")!;
	assert.equal(disk.path, "apple2/plus-videx/forth/forth.po");
	assert.equal(disk.placement, "own");
	assert.equal(disk.flavor, "apple2/plus-videx/forth");
	const boot = byName.get("micropak/boot")!;
	assert.equal(boot.path, "micropak/boot.yml");
	assert.deepEqual(boot.origins, ["apple2", "apple2/plus-videx"]);
	assert.equal(boot.render("ogdl"), "init\n  profile\n    apple2-plus-videx  # the Videx profile\n");
	const video = byName.get("micropak/video")!;
	assert.equal(video.path, "micropak/video.cfg");
	assert.equal(video.load(), "init\n  video\n    scanline\n      0.7777777\n    hgrmode\n      0\n");
	assert.deepEqual(video.provenance?.get("init.video.hgrmode"), ["apple2/plus-videx/forth"]);
	assert.equal(disk.load(), "DISK-BYTES");
	const own = new Flavors(memorySource(apple2), { syntaxes }).instantiate("apple2/plus-videx/forth");
	assert.deepEqual(own.files.map((x) => x.path).sort(), [
		"apple2/micropak/boot.cfg",
		"apple2/micropak/video.cfg",
		"apple2/plus-videx/forth/forth.po",
		"apple2/plus-videx/forth/micropak/video.cfg",
		"apple2/plus-videx/micropak/boot.yml",
	]);
	assert.ok(own.files.every((x) => x.bytes === "original"));
});

test("file rules: write an overlay as another syntax, or keep it opaque", () => {
	const f = new Flavors(memorySource(apple2), {
		syntaxes,
		files: [
			{ match: "micropak/boot.*", overlay: true, as: "ogdl" },
			{ match: "micropak/video.cfg", overlay: true, opaque: true },
		],
	});
	const r = f.instantiate("apple2/plus-videx/forth");
	const boot = r.files.find((x) => x.name === "micropak/boot")!;
	assert.equal(boot.path, "micropak/boot.ogdl");
	const video = r.files.find((x) => x.name === "micropak/video.cfg")!;
	assert.deepEqual(video.origins, ["apple2", "apple2/plus-videx/forth"]);
	assert.equal(video.load(), apple2["apple2/plus-videx/forth/micropak/video.cfg"]);
});

test("a file a single flavor supplies keeps its bytes", () => {
	const f = new Flavors(memorySource({ "a/flavor.yml": "k: 1\n", "a/odd.yml": "x:   1   # spaced\n" }));
	assert.equal(f.instantiate("a").files[0]!.load(), "x:   1   # spaced\n");
});

test("glob", () => {
	assert.ok(glob("micropak/*.cfg", "micropak/boot.cfg"));
	assert.ok(!glob("micropak/*.cfg", "micropak/x/boot.cfg"));
	assert.ok(glob("**/*.dsk", "a/b/c.dsk"));
	assert.ok(glob("**/*.dsk", "c.dsk"));
});

test("full form: every value's history, who set it now, its comments, and every file's sources", () => {
	const f = new Flavors(
		memorySource({
			...apple2,
			"apple2/flavor.yml": "# The machine.\nmachine: { cpu: 6502 }\nslots: { 1: parallel, 2: ssc } # stock\n",
			"apple2/plus-videx/flavor.yml": "parents: apple2\nslots: { 2: null, 3: videx }\n",
		}),
		{ syntaxes, files: [micropak] },
	);
	const r = f.instantiate("apple2/plus-videx/forth");
	const s = r.full();
	assert.equal(s.instance, "apple2/plus-videx/forth");
	assert.deepEqual(s.precedence, ["apple2/plus-videx/forth", "apple2/plus-videx", "apple2"]);
	assert.equal((s.markers as PlainMap)["apple2"], "apple2/flavor.yml");
	const values = s.values as PlainMap;
	assert.deepEqual(values["machine.cpu"], { value: 6502, set_by: ["apple2"] });
	assert.deepEqual(values["slots.2"], {
		gone: true,
		history: [
			{ by: "apple2", set: "ssc" },
			{ by: "apple2/plus-videx", deleted: true },
		],
	});
	assert.deepEqual(values["machine"], { comment: { before: " The machine.", before_by: "apple2" } });
	const files = s.files as PlainMap;
	const video = files["micropak/video.cfg"] as PlainMap;
	assert.deepEqual(video.sources, ["apple2/micropak/video.cfg", "apple2/plus-videx/forth/micropak/video.cfg"]);
	assert.equal(video.bytes, "composed");
	assert.deepEqual((video.values as PlainMap)["init.video.hgrmode"], {
		value: 0,
		set_by: ["apple2/plus-videx/forth"],
		history: [
			{ by: "apple2", set: 2 },
			{ by: "apple2/plus-videx/forth", set: 0 },
		],
	});
	const disk = files["apple2/plus-videx/forth/forth.po"] as PlainMap;
	assert.deepEqual(disk, { placement: "own", flavor: "apple2/plus-videx/forth", sources: ["apple2/plus-videx/forth/forth.po"], bytes: "original" });
	assert.deepEqual(yaml.parse(yaml.stringify(s)).value, s);
	const text = r.render("full");
	assert.match(text, /^# The full form of a flavor instance/);
	assert.match(text, /\n# Every value path: /);
	assert.deepEqual(yaml.parse(text).value, s);
});

test("templates: rendered with the instance's values, written without the engine's extension", () => {
	const f = new Flavors(
		memorySource({
			"apple2/flavor.yml": "abstract: true\nmachine: { cpu: 6502 }\nslots: {}\n",
			"apple2/serial-slot4/flavor.yml": "abstract: true\nslots: { 4: acia }\nserial: { base: CE00, baud: 9600 }\n",
			"apple2/serial-slot4/acia.fs.liquid": '\\ {{ flavor }} for {{ instance }}\nHEX {{ values.serial.base }} CONSTANT ACIA DECIMAL {{ values.serial.baud }} BAUD\n{% render "apple2/serial-slot4/irq.liquid" %}',
			"apple2/serial-slot4/irq.liquid": "{% if values.slots['4'] == 'acia' %}IRQ ON{% endif %}\n",
			"apple2/serial-slot4/README.txt": "plain\n",
			"forth/flavor.yml": "parents: [apple2, serial-slot4]\nserial: { baud: 19200 }\n",
			"bad/flavor.yml": "parents: [apple2, serial-slot4]\n",
			"bad/oops.txt.liquid": "{{ values.nope.missing }}",
		}),
	);
	const r = f.instantiate("forth");
	const acia = r.files.find((x) => x.path === "apple2/serial-slot4/acia.fs")!;
	assert.equal(acia.template, "liquid");
	assert.equal(acia.bytes, "rendered");
	assert.equal(acia.load(), "\\ apple2/serial-slot4 for forth\nHEX CE00 CONSTANT ACIA DECIMAL 19200 BAUD\nIRQ ON\n");
	assert.equal(r.files.find((x) => x.path === "apple2/serial-slot4/README.txt")!.load(), "plain\n");
	assert.throws(() => f.instantiate("bad").files.find((x) => x.path === "bad/oops.txt")!.load(), /bad\/oops\.txt\.liquid: .*nope/);
});

test("recipe: steps combine by id, daemons hang before and after, output and zip build into the image", async () => {
	const f = new Flavors(
		memorySource({
			"base/flavor.yml":
				"abstract: true\nrecipe:\n  - { id: pak, step: zip, from: base/micropak/, to: game.pak, move: true }\n  - { id: values, step: output, format: json, to: values.json }\n",
			"base/micropak/boot.cfg": "init\n  profile\n    x\n",
			"logged/flavor.yml": "abstract: true\nrecipe:\n  - { id: full, step: output, format: full, to: flavor.full.yml, after: pak }\n  - { id: first, step: output, format: yaml, to: early.yml, before: pak }\n",
			"game/flavor.yml": "parents: [base, logged]\nname: game\n",
			"plain/flavor.yml": "parents: [base]\nrecipe: [{ id: values, remove: true }]\n",
		}),
		{ syntaxes },
	);
	const game = f.instantiate("game");
	assert.deepEqual(steps(game.data.recipe).map((s) => s.id), ["first", "pak", "full", "values"]);
	const img = image(game);
	const built = await build(game, img, { syntaxes });
	assert.deepEqual(built.map((b) => [b.id, b.wrote, b.removed]), [
		["first", ["early.yml"], []],
		["pak", ["game.pak"], ["base/micropak/boot.cfg"]],
		["full", ["flavor.full.yml"], []],
		["values", ["values.json"], []],
	]);
	assert.deepEqual([...img.keys()].sort(), ["early.yml", "flavor.full.yml", "game.pak", "values.json"]);
	assert.equal(JSON.parse(String(img.get("values.json"))).name, "game");
	const back = new Map<string, Content>([["game.pak", img.get("game.pak")!]]);
	await unzip.run({ id: "u", step: "unzip", from: "game.pak", to: "micropak/" }, { image: back, values: {}, instance: game, syntaxes });
	assert.equal(new TextDecoder().decode(back.get("micropak/boot.cfg") as Uint8Array), "init\n  profile\n    x\n");

	const plain = f.instantiate("plain");
	const img2 = image(plain);
	await build(plain, img2, { syntaxes, marker: "cartridge" });
	assert.deepEqual([...img2.keys()].sort(), ["cartridge.yml", "game.pak"]);
	await assert.rejects(build(f.instantiate("plain", { overlay: { recipe: [{ id: "x", step: "nope" }] } }), image(plain), { syntaxes }), /no builder nope/);
	assert.throws(() => steps([{ id: "a", step: "zip", after: "ghost" }]), /hangs on ghost/);
});

test("node: a directory source, and bake runs the recipe and writes only what it makes", async () => {
	const root = mkdtempSync(join(tmpdir(), "flavors-"));
	for (const [p, c] of Object.entries(apple2)) {
		mkdirSync(join(root, p, ".."), { recursive: true });
		writeFileSync(join(root, p), c);
	}
	const f = new Flavors(dirSource(root), { syntaxes, files: [micropak] });
	const r = f.instantiate(f.find("forth"));
	const out = join(root, "..", `${root.split("/").pop()}-out`);
	const { written } = await bake(r, out, { syntaxes });
	assert.deepEqual(written, ["apple2/plus-videx/forth/forth.po", "flavor.yml", "micropak/boot.yml", "micropak/video.cfg"]);
	await assert.rejects(bake(r, out, { syntaxes }), /not empty/);
	const debug = f.instantiate(f.find("forth"), { overlay: { recipe: [{ id: "debug", step: "output", format: "full", to: "flavor.full.yml" }] } });
	const second = await bake(debug, out, { syntaxes, clean: true, as: "json" });
	assert.deepEqual(second.written, ["apple2/plus-videx/forth/forth.po", "flavor.full.yml", "micropak/boot.yml", "micropak/video.cfg"]);
	const s = yaml.parse(readFileSync(join(out, "flavor.full.yml"), "utf8")).value as PlainMap;
	assert.deepEqual((s.values as PlainMap)["slots.3"], { value: "videx", set_by: ["apple2/plus-videx"] });
	assert.ok(!existsSync(join(out, "flavor.yml")));
});
