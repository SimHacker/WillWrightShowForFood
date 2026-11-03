import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { parseLaunch } from "@wwsff/catalog";
import { loadCatalog } from "@wwsff/catalog/node";
import { appEntries } from "./apple2/disk-catalog.js";

const cabinet = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(cabinet, "../..");
const disksDir = join(cabinet, "disks/apple2");
const read = (p: string) => parse(readFileSync(p, "utf8"));

function cabinetCatalog() {
	const catalog = loadCatalog([cabinet], { base: repo });
	const { apps, entries, problems } = appEntries(read(join(disksDir, "APPS.yml")), read(join(disksDir, "DISKS.yml")));
	catalog.add({ entries }, "packages/cabinet/disks/apple2/APPS.yml");
	return { catalog, apps, problems };
}

test("the cabinet's catalog loads with no problems", () => {
	const { catalog, problems } = cabinetCatalog();
	assert.deepEqual(catalog.problems, []);
	assert.deepEqual(problems, [], "every app's disks are listed");
});

test("every PDP-7 program has an entry that runs it", () => {
	const source = readFileSync(join(repo, "apps/ties/src/lib/cabinet-programs.js"), "utf8");
	const ids = [...source.matchAll(/^\t{1,2}(?:forthProgram\(\{ )?id: '([a-z0-9-]+)'/gm)].map((m) => m[1]);
	assert.ok(ids.length >= 11, `found ${ids.length} programs`);
	const { catalog } = cabinetCatalog();
	const running = new Set(catalog.entries.filter((e) => e.runs?.machine === "pdp7").map((e) => e.runs?.program));
	assert.deepEqual(ids.filter((id) => !running.has(id)), []);
});

test("every Apple app has an entry, and every disk it names is there", () => {
	const { catalog, apps } = cabinetCatalog();
	assert.ok(apps.length >= 8);
	for (const app of apps) {
		assert.equal(catalog.entry(`apple2:${app.id}`)?.runs?.app, app.id);
		for (const d of Object.values(app.disks)) assert.ok(existsSync(join(disksDir, d.file)), `${d.file} is missing`);
	}
	const files = apps.flatMap((a) => Object.values(a.disks).map((d) => d.file));
	assert.equal(new Set(files).size, files.length, "no disk belongs to two apps");
});

test("the tree and the URLs work on the real catalog", () => {
	const { catalog } = cabinetCatalog();
	const root = catalog.tree()!;
	assert.deepEqual(root.children.map((n) => n.slug), ["games", "languages", "applications", "devices", "systems", "machines"]);
	assert.ok(catalog.tree("games")!.children.every((n) => n.entry), "games is one flat list");
	assert.ok(catalog.tree("languages")!.children.every((n) => n.entry), "languages is one flat list");
	assert.equal(catalog.tree("machines/pdp-7")!.children.length, catalog.find({ tags: { machine: "pdp7" } }).length);

	const duel = parseLaunch(catalog, "/cabinet/games/duel/", "size=768&with=anything")!;
	assert.equal(duel.entry?.runs?.program, "duel");
	assert.deepEqual(duel.values, { size: 768 });
	assert.equal(duel.ignored[0]?.reason, "not a mixin duel accepts");
	const forth = parseLaunch(catalog, "/cabinet/languages/don-hopkins-prodos-forth/")!;
	assert.deepEqual(forth.entry?.runs, { machine: "apple2", app: "hopkins-forth", profile: "apple2-plus-videx" });
});
