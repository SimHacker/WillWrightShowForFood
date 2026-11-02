// A game the Apple can play, and the bridge that carries its people off the disk and back.
//
// Play inserts a game's disks into a running microM8 and boots. Export and import run the
// same bridge the world directories use, on the bytes the guest just wrote (MicroM8.disk
// flushes first). The guest sees an import on its next read of that disk.
//
// The wasm build has paddles and the annunciators (FORK.yml, patch 0004), the Videx card
// (0005) and Don's Forth's serial card (0006), the last two on the apple2-plus-videx profile.

import type { WorldFiles } from "@wwsff/bridge";
import { Dos33Volume } from "./dos33.js";
import { exportDisk, importDisk } from "./mind-mirror.js";
import { PascalVolume } from "./pascal.js";
import { Scenario } from "./wizardry.js";
import { exportWorld, importWorld } from "./wizardry-world.js";

export interface Devices {
	/** Videoterm in slot 3. False on the wasm build until VIDEX.md lands. */
	videx: boolean;
	/** Game-port paddles. True on the wasm build: paddle() and button(). */
	paddles: boolean;
}

/** What this wasm build can offer a game. */
export const WASM_DEVICES: Devices = { videx: true, paddles: true };

export function missingDevices(need: Devices, have: Devices): string[] {
	const missing: string[] = [];
	if (need.videx && !have.videx) missing.push("videx");
	if (need.paddles && !have.paddles) missing.push("paddles");
	return missing;
}

export interface Disk {
	/** The name insertDisk stored it under. disk() reads it back by this name. */
	name: string;
	drive: number;
	boot?: boolean;
}

/** Reads the people off one disk image and writes them back over a base image. */
export interface CharacterBridge {
	export(image: Uint8Array): WorldFiles;
	import(files: WorldFiles, image: Uint8Array): Uint8Array;
}

export interface AppleGame {
	id: string;
	title: string;
	devices: Devices;
	disks: Disk[];
	/** The disk whose bytes the bridge reads. Absent when the game has no saved people. */
	people?: string;
	bridge?: CharacterBridge;
}

const wizardryBridge: CharacterBridge = {
	export: (image) => exportWorld(new Scenario(new PascalVolume(image))),
	import(files, image) {
		const volume = new PascalVolume(image);
		importWorld(files, new Scenario(volume));
		return volume.image();
	},
};

const mindMirrorBridge: CharacterBridge = {
	export: (image) => exportDisk(new Dos33Volume(image)),
	import(files, image) {
		const volume = new Dos33Volume(image.slice());
		importDisk(files, volume);
		return volume.image;
	},
};

export const WIZARDRY_I: AppleGame = {
	id: "wizardry-i",
	title: "Wizardry: Proving Grounds of the Mad Overlord",
	devices: { videx: false, paddles: false },
	disks: [
		{ name: "wizardry-i-proving-grounds-disk-1.dsk", drive: 0, boot: true },
		{ name: "wizardry-i-proving-grounds-disk-2.dsk", drive: 1 },
	],
	people: "wizardry-i-proving-grounds-disk-2.dsk",
	bridge: wizardryBridge,
};

export const MIND_MIRROR: AppleGame = {
	id: "mind-mirror",
	title: "Mind Mirror",
	devices: { videx: false, paddles: false },
	disks: [{ name: "mind-mirror.dsk", drive: 0, boot: true }],
	people: "mind-mirror.dsk",
	bridge: mindMirrorBridge,
};

/** The wasm build has the Videx card. The image is ProDOS block order, forth.po. */
export const HOPKINS_FORTH: AppleGame = {
	id: "hopkins-forth",
	title: "Don Hopkins ProDOS Forth",
	devices: { videx: true, paddles: false },
	disks: [{ name: "forth.po", drive: 0, boot: true }],
};

export const APPLE_GAMES: AppleGame[] = [WIZARDRY_I, MIND_MIRROR, HOPKINS_FORTH];

/** The slice of microM8 Play drives. The class itself satisfies it. */
export interface AppleMachine {
	insertDisk(name: string, bytes: Uint8Array, drive?: number): void;
	boot(name: string, bytes: Uint8Array): void;
	disk(name: string): Uint8Array | null;
}

export class Play {
	constructor(
		readonly machine: AppleMachine,
		readonly game: AppleGame,
		readonly have: Devices = WASM_DEVICES,
	) {}

	start(images: ReadonlyMap<string, Uint8Array>): void {
		const missing = missingDevices(this.game.devices, this.have);
		if (missing.length) throw new Error(`${this.game.id} needs ${missing.join(", ")}`);
		const image = (name: string) => {
			const bytes = images.get(name);
			if (!bytes) throw new Error(`${this.game.id}: no image for ${name}`);
			return bytes;
		};
		for (const disk of this.game.disks) if (!disk.boot) this.machine.insertDisk(disk.name, image(disk.name), disk.drive);
		const boot = this.game.disks.find((d) => d.boot);
		if (!boot) throw new Error(`${this.game.id} has no boot disk`);
		this.machine.boot(boot.name, image(boot.name));
	}

	/** The people disk, after its pending tracks are written back. */
	peopleDisk(): Uint8Array {
		const name = this.game.people;
		if (!name || !this.game.bridge) throw new Error(`${this.game.id} has no character bridge`);
		const bytes = this.machine.disk(name);
		if (!bytes) throw new Error(`${this.game.id}: ${name} is not mounted`);
		return bytes;
	}

	exportPeople(): WorldFiles {
		return this.game.bridge!.export(this.peopleDisk());
	}

	/** Remounts the people disk. A program that already has the file in memory keeps the old one. */
	importPeople(files: WorldFiles): void {
		const name = this.game.people;
		const disk = this.game.disks.find((d) => d.name === name);
		if (!name || !disk || !this.game.bridge) throw new Error(`${this.game.id} has no character bridge`);
		this.machine.insertDisk(name, this.game.bridge.import(files, this.peopleDisk()), disk.drive);
	}
}
