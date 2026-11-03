// microM8's WebAssembly module and Go's wasm_exec.js, in microm8/dist/ (Node tests) and
// apps/ties/static/microm8/ (served at /microm8/). Both are gitignored; a release is fetched by key.
//
//   node scripts/microm8-wasm.mjs              build from the working fork (MICROM8_DIR, default ../microm8)
//   node scripts/microm8-wasm.mjs --names      the same, keeping Go's function names, for profiling:
//                                              writes microm8/dist/microm8-names.wasm only
//   node scripts/microm8-wasm.mjs --key        print the release key: base commit, Go, flags, patches
//   node scripts/microm8-wasm.mjs --patches    build the release: upstream at base_commit plus patches/
//   node scripts/microm8-wasm.mjs --publish    upload that build under its key (needs gcloud and write access)
//   node scripts/microm8-wasm.mjs --fetch [--wait SECONDS]
//                                              download the release for the current key, waiting for CI
//                                              to publish it if it is new; no-op if already in place
//
// Each copy carries a KEY file: the key it was built or fetched for, or "checkout" for a working build.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const cabinet = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(cabinet, "../..");
const forkDoc = join(cabinet, "microm8/FORK.yml");
const patchDir = join(cabinet, "microm8/patches");
const dist = join(cabinet, "microm8/dist");
const web = join(repo, "apps/ties/static/microm8");
const FILES = ["microm8.wasm", "wasm_exec.js"];
const BUILD = ["build", "-tags", "nox", "-trimpath"];
const STRIP = "-ldflags=-s -w";

const fork = parse(readFileSync(forkDoc, "utf8"));
const { base_commit: base, repo: upstream, module_root: moduleRoot } = fork.upstream;
const { go, bucket, prefix } = fork.build;
const releaseUrl = (key) => `https://storage.googleapis.com/${bucket}/${prefix}/${key}`;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : fallback;
};

function sha256(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}

function patches() {
	return readdirSync(patchDir)
		.filter((f) => f.endsWith(".patch"))
		.sort();
}

function releaseKey() {
	const parts = [`base ${base}`, `go ${go}`, `flags ${[...BUILD, STRIP].join(" ")}`];
	for (const p of patches()) parts.push(`patch ${p} ${sha256(readFileSync(join(patchDir, p)))}`);
	return sha256(parts.join("\n")).slice(0, 16);
}

function sums(dir) {
	return FILES.map((f) => `${sha256(readFileSync(join(dir, f)))}  ${f}\n`).join("");
}

function stamp(dir) {
	const f = join(dir, "KEY");
	return existsSync(f) ? readFileSync(f, "utf8").trim() : null;
}

function place(from, key) {
	writeFileSync(join(from, "SHA256SUMS"), sums(from));
	writeFileSync(join(from, "KEY"), `${key}\n`);
	if (from === web) return;
	mkdirSync(web, { recursive: true });
	for (const f of [...FILES, "SHA256SUMS", "KEY"]) copyFileSync(join(from, f), join(web, f));
}

function goBuild(module, out, strip) {
	const goroot = execFileSync("go", ["env", "GOROOT"], { encoding: "utf8" }).trim();
	const wasmExec = [join(goroot, "lib/wasm/wasm_exec.js"), join(goroot, "misc/wasm/wasm_exec.js")].find(existsSync);
	if (!wasmExec) throw new Error(`wasm_exec.js not found under ${goroot}`);
	mkdirSync(dirname(out), { recursive: true });
	execFileSync("go", [...BUILD, ...(strip ? [STRIP] : []), "-o", out, "./wasm/"], {
		cwd: module,
		env: { ...process.env, GOOS: "js", GOARCH: "wasm", GOFLAGS: "-mod=mod" },
		stdio: "inherit",
	});
	copyFileSync(wasmExec, join(dirname(out), "wasm_exec.js"));
	console.error(`${out} ${(statSync(out).size / 1e6).toFixed(1)} MB`);
}

function buildCheckout() {
	const forkDir = resolve(process.env.MICROM8_DIR ?? join(repo, "../microm8"));
	const module = join(forkDir, moduleRoot);
	if (!existsSync(join(module, "wasm/main.go"))) {
		throw new Error(`no wasm/main.go under ${module}; set MICROM8_DIR to the microM8 fork`);
	}
	const names = flag("--names");
	goBuild(module, join(dist, names ? "microm8-names.wasm" : "microm8.wasm"), !names);
	if (!names) place(dist, "checkout");
}

function buildPatches() {
	const have = execFileSync("go", ["env", "GOVERSION"], { encoding: "utf8" }).trim();
	if (have !== `go${go}`) throw new Error(`FORK.yml builds with go${go}; this is ${have}`);
	const key = releaseKey();
	const tree = mkdtempSync(join(tmpdir(), "microm8-"));
	try {
		const git = (...a) => execFileSync("git", a, { cwd: tree, stdio: "inherit" });
		git("init", "-q");
		git("fetch", "-q", "--depth", "1", upstream, base);
		git("checkout", "-q", "FETCH_HEAD");
		git("apply", "--whitespace=nowarn", ...patches().map((p) => join(patchDir, p)));
		goBuild(join(tree, moduleRoot), join(dist, "microm8.wasm"), true);
	} finally {
		rmSync(tree, { recursive: true, force: true });
	}
	place(dist, key);
	console.error(`release ${key}`);
}

function publish() {
	const key = releaseKey();
	if (stamp(dist) !== key) throw new Error(`microm8/dist is ${stamp(dist) ?? "empty"}, not release ${key}: run --patches first`);
	const to = `gs://${bucket}/${prefix}/${key}/`;
	// SHA256SUMS goes last: its presence is what tells a waiting deploy the release is complete.
	for (const f of [...FILES, "SHA256SUMS"]) {
		execFileSync(
			"gcloud",
			["storage", "cp", "--no-clobber", "--cache-control=public, max-age=31536000, immutable", join(dist, f), to],
			{ stdio: "inherit" },
		);
	}
	console.error(`published ${releaseUrl(key)}/`);
}

async function get(url) {
	const response = await fetch(url);
	if (response.status === 404 || response.status === 403) return null;
	if (!response.ok) throw new Error(`${url}: ${response.status} ${response.statusText}`);
	return Buffer.from(await response.arrayBuffer());
}

async function fetchRelease() {
	const key = releaseKey();
	if (stamp(web) === key && existsSync(join(web, "SHA256SUMS")) && sums(web) === readFileSync(join(web, "SHA256SUMS"), "utf8")) {
		console.error(`microM8 ${key} already in place`);
		return;
	}
	const wait = Number(option("--wait", "0"));
	const until = Date.now() + wait * 1000;
	let list = await get(`${releaseUrl(key)}/SHA256SUMS`);
	while (!list && Date.now() < until) {
		console.error(`microM8 ${key} not published yet; waiting for CI (microm8 workflow)`);
		await new Promise((r) => setTimeout(r, 15000));
		list = await get(`${releaseUrl(key)}/SHA256SUMS`);
	}
	if (!list) {
		throw new Error(
			`microM8 release ${key} is not at ${releaseUrl(key)}/.\n` +
				"CI publishes it when patches/ or FORK.yml change on main; or build and upload it here:\n" +
				"  node scripts/microm8-wasm.mjs --patches && node scripts/microm8-wasm.mjs --publish",
		);
	}
	mkdirSync(dist, { recursive: true });
	for (const line of list.toString("utf8").trim().split("\n")) {
		const [want, name] = line.split(/\s+/);
		if (!FILES.includes(name)) continue;
		const bytes = await get(`${releaseUrl(key)}/${name}`);
		if (!bytes || sha256(bytes) !== want) throw new Error(`${name} from ${releaseUrl(key)} does not match SHA256SUMS`);
		writeFileSync(join(dist, name), bytes);
	}
	place(dist, key);
	console.error(`microM8 ${key} fetched into ${dist} and ${web}`);
}

try {
	if (flag("--key")) console.log(releaseKey());
	else if (flag("--patches")) buildPatches();
	else if (flag("--publish")) publish();
	else if (flag("--fetch")) await fetchRelease();
	else buildCheckout();
} catch (e) {
	console.error(e.message);
	process.exit(1);
}
