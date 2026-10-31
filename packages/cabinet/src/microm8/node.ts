// Start microM8's WebAssembly module under Node, for tests and scripts. The build
// (scripts/microm8-wasm.mjs) puts microm8.wasm and Go's wasm_exec.js in microm8/dist/;
// MICROM8_WASM and MICROM8_WASM_EXEC point elsewhere.

import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startMicroM8, type GoRuntimeClass, type MicroM8, type StartOptions } from "./microm8.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../microm8/dist");

export const wasmPath = process.env.MICROM8_WASM ?? path.join(dist, "microm8.wasm");
export const wasmExecPath = process.env.MICROM8_WASM_EXEC ?? path.join(dist, "wasm_exec.js");

export const haveMicroM8 = () => existsSync(wasmPath) && existsSync(wasmExecPath);

export async function startMicroM8Node(options: StartOptions = {}): Promise<MicroM8> {
	if (!haveMicroM8()) {
		throw new Error(`microM8 module missing: ${wasmPath}\nBuild it: node scripts/microm8-wasm.mjs`);
	}
	const host = globalThis as unknown as { Go?: GoRuntimeClass };
	if (!host.Go) createRequire(import.meta.url)(wasmExecPath);
	if (!host.Go) throw new Error(`${wasmExecPath} did not define Go`);
	return startMicroM8(host.Go, readFileSync(wasmPath), options);
}
