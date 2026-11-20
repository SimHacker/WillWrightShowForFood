import { parse } from "yaml";
import { Cabinet } from "../cabinet.js";
import { coreToRaw, rawToCore } from "../core.js";
import { Clock, type ClockState } from "../plugins/clock.js";
import { DataHand, type DataHandState } from "../plugins/datahand.js";
import { PaperTape, type PaperTapeState } from "../plugins/papertape.js";
import { Pdp7 } from "../plugins/pdp7.js";
import { Rb09, type Rb09State } from "../plugins/rb09.js";
import { Teletype, type TeletypeState } from "../plugins/teletype.js";
import { TitanFiles, type TitanFilesState } from "../plugins/titan-files.js";
import { TinyTitan, type TinyTitanState } from "../plugins/tiny-titan.js";
import { TuringDevice, type TuringState } from "../plugins/turing.js";
import { Type340, type Type340State } from "../plugins/type340.js";
import { UltimateMachine, type UltimateState } from "../plugins/ultimate.js";
import { loadPdp7, savePdp7 } from "./pdp7.js";
import { MemoryStore } from "./store.js";
import { toYaml } from "./yaml.js";

const deviceYaml = (name: string) => `devices/${name}/state.yml`;

/**
 * Device directories this build did not restore. They came in with a snapshot and go out again
 * byte for byte. A live device with no saver still throws: there is nothing to keep.
 */
const opaque = new WeakMap<Cabinet, Map<string, Uint8Array>>();

/** The paused cabinet: the CPU, the clock, and the devices the next tick reads. */
export function saveCabinet(store: MemoryStore, box: Cabinet, id = "pdp7"): void {
	if (!(box.cpu instanceof Pdp7)) throw new Error("this snapshot wants a pdp7");
	savePdp7(store, box.cpu, box.cycles, id);
	for (const device of box.devices) saveDevice(store, device);
	for (const [path, bytes] of opaque.get(box) ?? []) store.put(path, bytes);
}

/** Load into a cabinet built with the same devices. The next step rebuilds the schedule. */
export function loadCabinet(store: MemoryStore, box: Cabinet): void {
	if (!(box.cpu instanceof Pdp7)) throw new Error("this snapshot wants a pdp7");
	const kept = new Map<string, Uint8Array>();
	for (const [path, bytes] of store.files) {
		const name = /^devices\/([^/]+)\//.exec(path)?.[1];
		if (name && !box.device(name)) kept.set(path, bytes.slice());
	}
	opaque.set(box, kept);
	const snap = loadPdp7(store, box.cpu);
	box.cycles = snap.cycles;
	for (const device of box.devices) loadDevice(store, device);
}

function saveDevice(store: MemoryStore, device: Cabinet["devices"][number]): void {
	if (device instanceof Clock) {
		store.put(deviceYaml("clock"), toYaml(device.capture()));
		return;
	}
	if (device instanceof Teletype) {
		store.put(deviceYaml("teletype"), toYaml(device.capture()));
		return;
	}
	if (device instanceof PaperTape) {
		const s = device.capture();
		store.put(deviceYaml("papertape"), toYaml({ ...s, tape: "tape.bin" }));
		store.put("devices/papertape/tape.bin", s.tape);
		return;
	}
	if (device instanceof Rb09) {
		const s = device.capture();
		store.put(deviceYaml("rb09"), toYaml({ ...s, image: s.image ? "image.bin" : null, encoding: "uint32-le" }));
		if (s.image) store.put("devices/rb09/image.bin", coreToRaw(s.image));
		return;
	}
	if (device instanceof Type340) {
		store.put(deviceYaml("type340"), toYaml(device.capture()));
		return;
	}
	if (device instanceof DataHand) {
		store.put(deviceYaml("datahand"), toYaml(device.capture()));
		return;
	}
	if (device instanceof UltimateMachine) {
		store.put(deviceYaml("ultimate"), toYaml(device.capture()));
		return;
	}
	if (device instanceof TinyTitan) {
		store.put(deviceYaml("tiny-titan"), toYaml(device.capture()));
		return;
	}
	if (device instanceof TitanFiles) {
		const s = device.capture();
		store.put(deviceYaml("titan-files"), toYaml({ flag: s.flag, result: s.result, encoding: "uint32-le", mounts: s.mounts }));
		for (const blob of s.blobs) store.put(`devices/titan-files/${blob.file}`, coreToRaw(blob.words));
		return;
	}
	if (device instanceof TuringDevice) {
		store.put(deviceYaml("turing"), toYaml(device.capture()));
		return;
	}
	throw new Error(`no snapshot for ${device.name}`);
}

function loadDevice(store: MemoryStore, device: Cabinet["devices"][number]): void {
	if (device instanceof Clock) {
		device.restore(readYaml<ClockState>(store, "clock"));
		return;
	}
	if (device instanceof Teletype) {
		device.restore(readYaml<TeletypeState>(store, "teletype"));
		return;
	}
	if (device instanceof PaperTape) {
		const doc = readYaml<Omit<PaperTapeState, "tape"> & { tape: string }>(store, "papertape");
		const tape = store.get("devices/papertape/tape.bin");
		if (!tape || doc.tape !== "tape.bin") throw new Error("paper tape snapshot has no tape.bin");
		device.restore({ ...doc, tape });
		return;
	}
	if (device instanceof Rb09) {
		const doc = readYaml<Omit<Rb09State, "image"> & { image: string | null; encoding: string }>(store, "rb09");
		if (doc.encoding !== "uint32-le") throw new Error("unknown rb09 image encoding");
		let image: Uint32Array | null = null;
		if (doc.image) {
			const raw = store.get("devices/rb09/image.bin");
			if (!raw) throw new Error("rb09 snapshot has no image.bin");
			image = rawToCore(raw);
		}
		device.restore({ ...doc, image });
		return;
	}
	if (device instanceof Type340) {
		device.restore(readYaml<Type340State>(store, "type340"));
		return;
	}
	if (device instanceof DataHand) {
		device.restore(readYaml<DataHandState>(store, "datahand"));
		return;
	}
	if (device instanceof UltimateMachine) {
		device.restore(readYaml<UltimateState>(store, "ultimate"));
		return;
	}
	if (device instanceof TinyTitan) {
		device.restore(readYaml<TinyTitanState>(store, "tiny-titan"));
		return;
	}
	if (device instanceof TitanFiles) {
		const doc = readYaml<Omit<TitanFilesState, "blobs"> & { encoding: string }>(store, "titan-files");
		if (doc.encoding !== "uint32-le") throw new Error("unknown titan-files encoding");
		const blobs: TitanFilesState["blobs"] = [];
		for (const mount of doc.mounts) {
			for (const file of mount.files) {
				const raw = store.get(`devices/titan-files/${file.file}`);
				if (!raw) throw new Error(`titan-files snapshot has no ${file.file}`);
				blobs.push({ file: file.file, words: rawToCore(raw) });
			}
		}
		device.restore({ flag: doc.flag, result: doc.result, mounts: doc.mounts, blobs });
		return;
	}
	if (device instanceof TuringDevice) {
		device.restore(readYaml<TuringState>(store, "turing"));
		return;
	}
	throw new Error(`no snapshot for ${device.name}`);
}

function readYaml<T>(store: MemoryStore, name: string): T {
	const path = deviceYaml(name);
	if (!store.has(path)) throw new Error(`snapshot has no ${path}`);
	return parse(store.text(path)) as T;
}
