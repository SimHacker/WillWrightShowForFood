import assert from "node:assert/strict";
import { test } from "node:test";
import { APPLE2_REGIONS, Regions, pages, LOOPS, BP13, BP_CADENCE, BP_I, BP_MAJOR, BP_V, midiAt, thirteen, DOMINANT, DOMINANT_B9, Dance, Deltas, PDP7_VOICES, PENTATONIC, POP, SWING, TURNAROUND, Tally, groove, period, pitch, score, swing } from "./dance.js";

const cpu = PDP7_VOICES[0]!;

test("a key always plays the same note, in the scale and the voice's range", () => {
	for (let key = 0; key < 0o100000; key += 37) {
		const m = pitch(cpu, key);
		assert.equal(m, pitch(cpu, key));
		assert.ok(m >= cpu.root && m < cpu.root + 12 * cpu.octaves, `key ${key} gave ${m}`);
		assert.ok(PENTATONIC.includes((m - cpu.root) % 12));
	}
});

test("neighbouring addresses spread over the degrees", () => {
	const notes = new Set(Array.from({ length: 16 }, (_, i) => pitch(cpu, 0o1000 + i)));
	assert.ok(notes.size >= 6, `16 neighbours gave ${notes.size} notes`);
});

test("score plays the heaviest hits, loudest first, no note twice", () => {
	const v = { ...cpu, most: 2 };
	const notes = score(v, [
		{ key: 1, weight: 1 },
		{ key: 2, weight: 100 },
		{ key: 3, weight: 25 },
		{ key: 4, weight: 0 },
	]);
	assert.equal(notes.length, 2);
	assert.equal(notes[0]!.midi, pitch(v, 2));
	assert.ok(notes[0]!.velocity > notes[1]!.velocity);
	assert.deepEqual(notes.map((n) => n.order), [0, 1]);
	assert.deepEqual(score(v, []), []);
});

test("Deltas reports what grew, and a rebuilt block's whole count", () => {
	const d = new Deltas();
	assert.deepEqual(d.step([[1, 10], [2, 5]]), [{ key: 1, weight: 10 }, { key: 2, weight: 5 }]);
	assert.deepEqual(d.step([[1, 10], [2, 9]]), [{ key: 2, weight: 4 }]);
	assert.deepEqual(d.step([[1, 3]]), [{ key: 1, weight: 3 }]);
});

test("Tally sums events by key and starts again", () => {
	const t = new Tally();
	t.add(5);
	t.add(5, 2);
	t.add(6);
	assert.deepEqual(t.take(), [{ key: 5, weight: 3 }, { key: 6, weight: 1 }]);
	assert.deepEqual(t.take(), []);
});

test("a quiet voice plays nothing; the others still do", () => {
	const notes = new Dance(PDP7_VOICES).beat({ cpu: [{ key: 0o100, weight: 7 }] });
	assert.deepEqual(notes.filter((n) => n.voice !== "harmony").map((n) => n.voice), ["cpu"]);
});

test("the rim's period is the ratio of the two heaviest hits", () => {
	assert.equal(period([{ key: 1, weight: 300 }, { key: 2, weight: 100 }]), 3);
	assert.equal(period([{ key: 1, weight: 100 }, { key: 2, weight: 99 }]), 2);
	assert.equal(period([{ key: 1, weight: 1000 }, { key: 2, weight: 1 }]), 9);
	assert.equal(period([{ key: 1, weight: 5 }]), 0);
});

test("the groove: kick on the beat, snare on the backbeat, hats thicken with load", () => {
	const bar = (load: number, every: number, d: string) => Array.from({ length: 16 }, (_, s) => groove(s, load, every).includes(d as never)).filter(Boolean).length;
	assert.equal(bar(0.5, 0, "kick"), 4);
	assert.equal(bar(0.5, 0, "snare"), 2);
	assert.equal(bar(0.05, 0, "hat"), 0);
	assert.equal(bar(0.2, 0, "hat"), 4);
	assert.equal(bar(0.5, 0, "hat"), 8);
	assert.equal(bar(0.9, 0, "hat"), 16);
	assert.equal(bar(0.5, 3, "rim"), 6);
});

test("an idle machine plays no drums; a busy one does", () => {
	const d = new Dance(PDP7_VOICES);
	const bar = (load: number) => Array.from({ length: 16 }, () => d.beat({}, load)).flat();
	assert.equal(bar(0).filter((n) => n.voice === "drums").length, 0);
	assert.ok(bar(0.5).some((n) => n.voice === "drums"));
});

test("jazz: the ride's spang-a-lang, the turnaround's chords, and the second eighth of each beat late", () => {
	const ride = Array.from({ length: 16 }, (_, s) => s).filter((s) => swing(s, 0.5, 0).includes("ride"));
	assert.deepEqual(ride, [0, 4, 6, 8, 12, 14]);
	const d = new Dance(PDP7_VOICES);
	d.style = "jazz";
	const hits = { cpu: [{ key: 0o100, weight: 9 }] };
	const beats = Array.from({ length: 4 }, () => d.beat(hits, 0.5));
	assert.ok(beats.every((b, s) => b.every((n) => (n.late ?? 0) === (s === 2 ? SWING : 0))));
	const cpu = beats[0]!.find((n) => n.voice === "cpu")!;
	assert.ok(TURNAROUND[0]!.tones.includes((cpu.midi - PDP7_VOICES[0]!.root) % 12));
});

const pcs = (notes: { midi: number }[]) => [...new Set(notes.map((n) => n.midi % 12))].sort((a, b) => a - b);

test("a chord a bar, I vi IV V, stated by the pad when it changes", () => {
	const d = new Dance(PDP7_VOICES);
	const pads = Array.from({ length: 64 }, () => d.beat({}, 0).filter((n) => n.voice === "harmony" && n.timbre === "pad"));
	const changes = pads.map((p, s) => [s, p] as const).filter(([, p]) => p.length);
	assert.deepEqual(changes.map(([s]) => s), [0, 16, 32, 48]);
	assert.deepEqual(changes.map(([, p]) => pcs(p)), POP.map((c) => [...c.tones]));
});

test("a key shifts the rim's phase and answers with three notes on the offbeats, in the chord", () => {
	const d = new Dance(PDP7_VOICES);
	d.beat({}, 0);
	d.touch({ kind: "key", code: 65 });
	assert.equal(d.phase, 1);
	const replies = Array.from({ length: 8 }, (_, i) => [i + 1, d.beat({}, 0).filter((n) => n.voice === "reply")] as const).filter(([, r]) => r.length);
	assert.deepEqual(replies.map(([s]) => s), [3, 5, 7]);
	for (const [, r] of replies) assert.ok(POP[0]!.tones.includes(r[0]!.midi % 12));
	assert.deepEqual(groove(1, 0, 3, 2), ["rim"]);
});

test("pen tension: a drag climbs to the dominant and its flat ninth; release resolves home with a kick", () => {
	const d = new Dance(PDP7_VOICES);
	d.beat({}, 0);
	d.touch({ kind: "press" });
	d.touch({ kind: "drag", distance: 1000 });
	assert.equal(d.chord, DOMINANT);
	d.touch({ kind: "drag", distance: 1000 });
	assert.equal(d.chord, DOMINANT_B9);
	const held = d.beat({}, 0);
	assert.deepEqual(pcs(held.filter((n) => n.timbre === "pad")), [...DOMINANT_B9.tones]);
	d.touch({ kind: "release" });
	const home = d.beat({}, 0);
	assert.deepEqual(pcs(home.filter((n) => n.timbre === "pad")), [...POP[0]!.tones]);
	assert.ok(home.some((n) => n.timbre === "kick" && n.velocity === 1));
	assert.equal(d.tension, 0);
	assert.equal(d.chord, POP[0]);
});

test("a light touch fades back without a resolution", () => {
	const d = new Dance(PDP7_VOICES);
	d.touch({ kind: "press" });
	d.touch({ kind: "release" });
	const notes = d.beat({}, 0);
	assert.ok(!notes.some((n) => n.timbre === "kick"));
	assert.ok(d.tension < 0.15);
});

test("Kees van Prooijen's major: his ratios land on steps 0 3 4 6 7 10 12 of 13 in the tritave", () => {
	const ratios = [1, 35 / 27, 7 / 5, 5 / 3, 9 / 5, 7 / 3, 25 / 9];
	assert.deepEqual(ratios.map((r) => Math.round((13 * Math.log(r)) / Math.log(3))), [...BP_MAJOR]);
	assert.ok(Math.abs(midiAt(60, 13, BP13) - (60 + 12 * Math.log2(3))) < 1e-9, "13 steps is a tritave");
	for (const c of BP_CADENCE) for (const tone of c.tones) assert.ok(BP_MAJOR.includes(tone), `${c.name} ${tone}`);
});

test("Bohlen-Pierce: bars of 13, the cadence a bar each, odd harmonics, tension to his dominant and home", () => {
	const d = new Dance(PDP7_VOICES);
	d.style = "bp";
	const pads = Array.from({ length: 52 }, () => d.beat({}, 0).filter((n) => n.timbre === "pad"));
	assert.deepEqual(pads.map((p, s) => [s, p.length] as const).filter(([, n]) => n).map(([s]) => s), [0, 13, 26, 39]);
	assert.ok(pads[0]!.every((n) => n.odd));
	d.touch({ kind: "press" });
	d.touch({ kind: "drag", distance: 3000 });
	assert.equal(d.chord, BP_V);
	d.touch({ kind: "release" });
	d.beat({}, 0);
	assert.equal(d.chord, BP_I);
	assert.deepEqual(Array.from({ length: 13 }, (_, s) => s).filter((s) => thirteen(s, 0.5, 0).includes("kick")), [0, 7]);
});

test("the tape loops: prime lengths, each on its own schedule, always in the chord", () => {
	const d = new Dance(PDP7_VOICES);
	d.loops = true;
	const heard: number[] = [];
	for (let s = 0; s < 23 * 29; s++) {
		const chord = d.chord;
		for (const n of d.beat({}, 0).filter((n) => n.voice === "loops")) {
			heard.push(s);
			assert.ok(chord.tones.includes(Math.round(n.midi) % 12), `step ${s}`);
		}
	}
	assert.equal(heard.filter((s) => s % 23 === 0).length >= 29, true);
	assert.ok(LOOPS.every((l) => [2, 3, 5, 7, 11, 13, 17, 19].every((p) => l.length === p || l.length % p !== 0)));
	assert.equal(new Dance(PDP7_VOICES).beat({}, 0).filter((n) => n.voice === "loops").length, 0);
});

test("the pen plays a rising run along each stroke, and starts low again on the next", () => {
	const d = new Dance(PDP7_VOICES);
	const along = (addr: number, a: number, down = false) => d.pen({ x: 512, y: 512, down, under: [{ addr, along: a, scan: 0 }] });
	const run = [0, 0.2, 0.4, 0.6, 0.8, 0.99].flatMap((a) => along(0o100, a).map((n) => n.midi));
	for (let i = 1; i < run.length; i += 1) assert.ok(run[i]! > run[i - 1]!, `run ${run}`);
	const next = along(0o101, 0)[0]!;
	assert.equal(next.midi, run[0], "the next stroke starts where the last one did");
	assert.deepEqual(along(0o101, 0.01), [], "a move that stays on the same note plays nothing");
	assert.ok(along(0o101, 0.01, true).some((n) => n.timbre === "chime"), "setting the pen down chimes");
	assert.equal(d.pen({ x: 0, y: 0, down: false, under: [] })[0]!.timbre, "chime", "and so does lifting it");
});

test("later strokes in the frame start their runs higher", () => {
	const d = new Dance(PDP7_VOICES);
	const early = d.pen({ x: 0, y: 0, down: false, under: [{ addr: 1, along: 0, scan: 0 }] })[0]!.midi;
	const late = d.pen({ x: 0, y: 0, down: false, under: [{ addr: 2, along: 0, scan: 0.9 }] })[0]!.midi;
	assert.ok(late > early);
});

test("a watched word's loop moves a step for each typical change, whatever its size, and quickens while it changes", () => {
	const notes = (unit: number) => {
		const d = new Dance(PDP7_VOICES);
		const out: number[] = [];
		for (let s = 0; s < 64; s += 1) {
			const value = s < 32 ? s * unit : 31 * unit;
			for (const n of d.beat({}, undefined, [{ name: "dp", value }])) if (n.voice === "watch:dp") out.push(n.midi);
		}
		return out;
	};
	const words = notes(1);
	const degrees = notes(45);
	assert.ok(words.length > 0);
	assert.equal(new Set(words).size > 1, true, "the note climbs as the word grows");
	assert.equal(words.length, degrees.length, "a change of 45 counts the same as a change of 1 when it is the typical one");
	const still = new Dance(PDP7_VOICES);
	let quiet = 0;
	for (let s = 0; s < 32; s += 1) quiet += still.beat({}, undefined, [{ name: "dp", value: 5 }]).filter((n) => n.voice === "watch:dp").length;
	assert.ok(words.slice(0, 16).length >= quiet / 2, "a moving word plays at least as often as a still one");
});

test("a muted voice is left out, and watch mutes every watched word", () => {
	const d = new Dance(PDP7_VOICES);
	d.mute = new Set(["harmony", "watch"]);
	for (let s = 0; s < 32; s += 1) for (const n of d.beat({}, undefined, [{ name: "dp", value: s }])) assert.ok(n.voice !== "harmony" && !n.voice.startsWith("watch:"), n.voice);
	d.mute = new Set();
	assert.ok(Array.from({ length: 16 }, () => d.beat({}, undefined, [{ name: "dp", value: 99 }])).flat().some((n) => n.voice === "watch:dp"));
});

test("the PC's heat map warms a region slowly, cools it slowly, and the warm one hums", () => {
	const map = new Regions(APPLE2_REGIONS);
	map.step([{ key: 0xfd1b, weight: 10 }]);
	assert.ok(map.heat[5]! > 0 && map.heat[5]! < 0.1, "one beat in the Monitor barely warms it");
	for (let i = 0; i < 200; i += 1) map.step([{ key: 0xfd1b, weight: 10 }]);
	assert.equal(map.hottest, "Monitor");
	for (let i = 0; i < 10; i += 1) map.step([{ key: 0xe000, weight: 10 }]);
	assert.equal(map.hottest, "Monitor", "a moment in Applesoft doesn't take over");
	const d = new Dance(PDP7_VOICES);
	d.regions = new Regions(pages(8192));
	const hums = Array.from({ length: 64 }, () => d.beat({ cpu: [{ key: 0o4000, weight: 5 }] })).flat().filter((n) => n.voice.startsWith("region:"));
	assert.ok(hums.length > 0 && hums.every((n) => n.voice === "region:4000"), hums.map((n) => n.voice).join());
});

test("depth doubles the pad an octave down, then two", () => {
	const pads = (depth: number) => {
		const d = new Dance(PDP7_VOICES);
		d.depth = depth;
		return d.beat({}).filter((n) => n.timbre === "pad").length;
	};
	assert.ok(pads(0) < pads(0.5) && pads(0.5) < pads(1));
});

test("a watched word that shrinks comes back down", () => {
	const d = new Dance(PDP7_VOICES);
	const heard: number[] = [];
	for (const value of [100, 101, 102, 103, 104, 103, 102, 101, 100].flatMap((v) => Array(8).fill(v) as number[]))
		for (const n of d.beat({}, undefined, [{ name: "rp", value }])) if (n.voice === "watch:rp") heard.push(n.midi);
	assert.ok(Math.max(...heard) > heard[0]!, "it climbs as the stack fills");
	assert.equal(heard.at(-1), heard[0], "and is home again when it empties");
});

test("lydian keeps the tritone over the tonic, and jazz's full tension is the tritone substitution", () => {
	const d = new Dance(PDP7_VOICES);
	d.style = "lydian";
	for (let bar = 0; bar < 4; bar += 1) {
		assert.ok(d.chord.tones.includes(6), `${d.chord.name} has the raised fourth`);
		for (let s = 0; s < 16; s += 1) d.beat({});
	}
	const j = new Dance(PDP7_VOICES);
	j.style = "jazz";
	j.touch({ kind: "press" });
	j.touch({ kind: "drag", distance: 3000 });
	assert.equal(j.chord.name, "bII7");
	assert.equal((j.chord.root + 12 - 7) % 12, 6, "a tritone from the dominant it stands for");
});

test("a hand is a harp: each finger's string starts a step above the last, and a fingertip lands a kick", () => {
	const d = new Dance(PDP7_VOICES);
	const start = (tag: string, addr: number) => d.pen({ x: 0, y: 0, down: false, under: [{ addr, along: 0, scan: 0.5, tag }] })[0]!;
	const thumb = start("Thumb", 1);
	const index = start("Index finger", 2);
	const little = start("Little finger", 3);
	assert.equal(thumb.timbre, "pluck", "hovering plucks");
	assert.ok(thumb.midi < index.midi && index.midi < little.midi);
	const tip = d.pen({ x: 0, y: 0, down: false, under: [], tip: 1 });
	assert.deepEqual(tip.map((n) => n.timbre), ["kick", "chime"]);
	assert.deepEqual(d.pen({ x: 0, y: 0, down: false, under: [], tip: 1 }), [], "staying on the tip plays it once");
	assert.equal(d.pen({ x: 0, y: 0, down: true, under: [{ addr: 9, along: 0.5, scan: 0 }] }).find((n) => n.voice === "pen" && n.timbre !== "chime")?.timbre, "beep", "the button switches instrument");
});
