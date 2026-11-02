// Apple II disk images from the command line: DOS 3.3, ProDOS and Pascal volumes, in DOS or
// ProDOS sector order or 2MG. The file systems are src/apple2/{dos33,prodos,pascal}.ts.
//
//   node scripts/a2disk.mjs ls DISK [DIR]
//   node scripts/a2disk.mjs get DISK NAME [OUT] [--raw]        text files decoded unless --raw
//   node scripts/a2disk.mjs put DISK NAME FILE [--type T] [--aux 0x2000] [--text]
//   node scripts/a2disk.mjs rm DISK NAME
//   node scripts/a2disk.mjs mkdir DISK DIR                     ProDOS
//   node scripts/a2disk.mjs format DISK prodos|dos33|pascal [NAME] [--blocks 280]
//   node scripts/a2disk.mjs check DISK
//
// put's --type is a ProDOS type (BIN, TXT, SYS, $C1), a DOS 3.3 type (T, I, A, B, S, R), or a
// Pascal kind (code, text, data, foto); --aux is a ProDOS aux type or a DOS 3.3 B file's address.
// --text writes FILE as text in the volume's own form. A changed disk is written back in place.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { openImage } from "../dist/apple2/disk.js";
import { Dos33Volume } from "../dist/apple2/dos33.js";
import { PascalVolume } from "../dist/apple2/pascal.js";
import { ProDOSVolume } from "../dist/apple2/prodos.js";

const flags = new Map();
const args = [];
for (let i = 2; i < process.argv.length; i++) {
	const a = process.argv[i];
	if (a === "--raw" || a === "--text") flags.set(a.slice(2), true);
	else if (a.startsWith("--")) flags.set(a.slice(2), process.argv[++i]);
	else args.push(a);
}
const [cmd, disk, ...rest] = args;
const usage = () => {
	console.error("usage: a2disk.mjs ls|get|put|rm|mkdir|format|check DISK ...");
	process.exit(2);
};
if (!cmd || !disk) usage();

const open = () => {
	const bytes = new Uint8Array(readFileSync(disk));
	const fs = openImage(bytes, disk).fs;
	if (fs === "prodos") return { fs, v: ProDOSVolume.fromImage(bytes, disk) };
	if (fs === "dos33") return { fs, v: Dos33Volume.fromImage(bytes, disk) };
	if (fs === "pascal") return { fs, v: PascalVolume.fromImage(bytes, disk) };
	throw new Error(`${disk}: no DOS 3.3, ProDOS or Pascal volume found`);
};
const save = ({ fs, v }) => writeFileSync(disk, fs === "dos33" ? v.save() : v.image());
const num = (s) => (s === undefined ? undefined : s.startsWith("$") ? parseInt(s.slice(1), 16) : Number(s));

try {
	if (cmd === "format") {
		const [kind, name = "BLANK"] = rest;
		if (existsSync(disk)) throw new Error(`${disk} exists`);
		const blocks = num(flags.get("blocks")) ?? 280;
		const order = /\.po$|\.hdv$/i.test(disk) ? "prodos" : "dos";
		if (kind === "prodos") writeFileSync(disk, ProDOSVolume.format(name, blocks, { order: blocks === 280 ? order : "prodos" }).image());
		else if (kind === "dos33") {
			const v = Dos33Volume.format(Number(name) || 254);
			v.order = order;
			writeFileSync(disk, v.save());
		} else if (kind === "pascal") writeFileSync(disk, PascalVolume.format(name, blocks, { dosOrder: order === "dos" }).image());
		else usage();
		console.log(disk);
	} else {
		const vol = open();
		const { fs, v } = vol;
		if (cmd === "ls") {
			if (fs === "prodos") {
				console.log(`/${v.name}  ${v.freeBlocks()} of ${v.totalBlocks} blocks free`);
				for (const e of rest[0] ? v.list(rest[0]) : v.walk())
					console.log(`  ${e.path.padEnd(32)} ${e.typeName} $${e.aux.toString(16).padStart(4, "0")} ${String(e.eof).padStart(8)}  ${e.blocksUsed} blocks`);
			} else if (fs === "dos33") {
				console.log(`DOS 3.3 volume ${v.volume}  ${v.freeSectors()} sectors free`);
				for (const e of v.entries.filter((x) => !x.deleted)) console.log(`  ${e.locked ? "*" : " "}${e.type} ${String(e.sectors).padStart(3, "0")} ${e.name}`);
			} else {
				console.log(`${v.name}:  ${v.freeBlocks()} of ${v.totalBlocks} blocks free`);
				for (const e of v.entries) console.log(`  ${e.name.padEnd(16)} ${e.kind.padEnd(6)} ${String(e.next - e.first).padStart(4)} blocks  ${e.date}`);
			}
		} else if (cmd === "get") {
			const [name, out = name.replace(/^.*\//, "")] = rest;
			if (!name) usage();
			const raw = flags.get("raw");
			const content =
				fs === "prodos" ? (!raw && v.find(name)?.typeName === "TXT" ? v.text(name) : v.read(name))
				: fs === "dos33" ? (!raw && v.find(name)?.type === "T" ? v.text(name) : raw ? v.raw(name) : v.file(name).bytes)
				: !raw && v.find(name).kind === "text" ? v.text(name) : v.raw(name);
			writeFileSync(out, content);
			console.log(out);
		} else if (cmd === "put") {
			const [name, from] = rest;
			if (!name || !from) usage();
			const data = new Uint8Array(readFileSync(from));
			const type = flags.get("type"), aux = num(flags.get("aux"));
			if (flags.get("text")) {
				const text = new TextDecoder().decode(data);
				if (fs === "dos33") v.writeText(name, text);
				else if (fs === "prodos") v.writeText(name, text, aux === undefined ? {} : { aux });
				else v.writeText(name, text);
			} else if (fs === "prodos") v.write(name, data, { ...(type ? { type } : {}), ...(aux === undefined ? {} : { aux }) });
			else if (fs === "dos33") v.write(name, type ?? "B", data, aux === undefined ? {} : { address: aux });
			else v.write(name, data, type ?? "data", { krunch: true });
			save(vol);
			console.log(`${name} -> ${disk}`);
		} else if (cmd === "rm") {
			if (!rest[0]) usage();
			if (fs === "prodos") v.remove(rest[0]);
			else v.delete(rest[0]);
			save(vol);
		} else if (cmd === "mkdir") {
			if (fs !== "prodos") throw new Error("directories are ProDOS's");
			v.mkdir(rest[0]);
			save(vol);
		} else if (cmd === "check") {
			const problems = v.check();
			for (const p of problems) console.log(p);
			if (fs !== "pascal" && v.unclaimed().length) console.log(`${v.unclaimed().length} ${fs === "prodos" ? "blocks" : "sectors"} marked used that no file holds`);
			if (!problems.length) console.log("ok");
			process.exitCode = problems.length ? 1 : 0;
		} else usage();
	}
} catch (e) {
	console.error(`a2disk: ${e.message}`);
	process.exitCode = 1;
}
