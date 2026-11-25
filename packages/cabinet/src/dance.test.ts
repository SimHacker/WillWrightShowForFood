import assert from "node:assert/strict";
import { test } from "node:test";
import { LOOPS, KEES13, KEES_CADENCE, KEES_I, KEES_MAJOR, KEES_V, midiAt, thirteen, DOMINANT, DOMINANT_B9, Dance, Deltas, PDP7_VOICES, PENTATONIC, POP, SWING, TURNAROUND, Tally, groove, period, pitch, score, swing } from "./dance.js";

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
	assert.deepEqual(ratios.map((r) => Math.round((13 * Math.log(r)) / Math.log(3))), [...KEES_MAJOR]);
	assert.ok(Math.abs(midiAt(60, 13, KEES13) - (60 + 12 * Math.log2(3))) < 1e-9, "13 steps is a tritave");
	for (const c of KEES_CADENCE) for (const tone of c.tones) assert.ok(KEES_MAJOR.includes(tone), `${c.name} ${tone}`);
});

test("kees: bars of 13, the cadence a bar each, odd harmonics, tension to his dominant and home", () => {
	const d = new Dance(PDP7_VOICES);
	d.style = "kees";
	const pads = Array.from({ length: 52 }, () => d.beat({}, 0).filter((n) => n.timbre === "pad"));
	assert.deepEqual(pads.map((p, s) => [s, p.length] as const).filter(([, n]) => n).map(([s]) => s), [0, 13, 26, 39]);
	assert.ok(pads[0]!.every((n) => n.odd));
	d.touch({ kind: "press" });
	d.touch({ kind: "drag", distance: 3000 });
	assert.equal(d.chord, KEES_V);
	d.touch({ kind: "release" });
	d.beat({}, 0);
	assert.equal(d.chord, KEES_I);
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
