// Build microM8's WebAssembly module from the fork and put it, with Go's wasm_exec.js, in
// microm8/dist/ (Node tests) and apps/ties/static/microm8/ (served at /microm8/).
//
//   node scripts/microm8-wasm.mjs            MICROM8_DIR defaults to ../microm8 beside this repo
//   node scripts/microm8-wasm.mjs --names    keep Go's function names, for profiling: writes
//                                            microm8/dist/microm8-names.wasm only
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const cabinet = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(cabinet, "../..");
const fork = resolve(process.env.MICROM8_DIR ?? join(repo, "../microm8"));
const module = join(fork, "GoPath/src/paleotronic.com");
if (!existsSync(join(module, "wasm/main.go"))) {
	console.error(`no wasm/main.go under ${module}; set MICROM8_DIR to the microM8 fork`);
	process.exit(1);
}

const goroot = execFileSync("go", ["env", "GOROOT"], { encoding: "utf8" }).trim();
const wasmExec = [join(goroot, "lib/wasm/wasm_exec.js"), join(goroot, "misc/wasm/wasm_exec.js")].find(existsSync);
if (!wasmExec) {
	console.error(`wasm_exec.js not found under ${goroot}`);
	process.exit(1);
}

const dist = join(cabinet, "microm8/dist");
mkdirSync(dist, { recursive: true });
const names = process.argv.includes("--names");
const out = join(dist, names ? "microm8-names.wasm" : "microm8.wasm");
execFileSync("go", ["build", "-tags", "nox", "-trimpath", ...(names ? [] : ["-ldflags=-s -w"]), "-o", out, "./wasm/"], {
	cwd: module,
	env: { ...process.env, GOOS: "js", GOARCH: "wasm" },
	stdio: "inherit",
});
copyFileSync(wasmExec, join(dist, "wasm_exec.js"));
if (names) {
	console.error(`${out} ${(statSync(out).size / 1e6).toFixed(1)} MB`);
	process.exit(0);
}

const web = join(repo, "apps/ties/static/microm8");
mkdirSync(web, { recursive: true });
for (const f of ["microm8.wasm", "wasm_exec.js"]) copyFileSync(join(dist, f), join(web, f));

console.error(`${out} ${(statSync(out).size / 1e6).toFixed(1)} MB, copied to ${web}`);
