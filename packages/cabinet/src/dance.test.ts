import assert from "node:assert/strict";
import { test } from "node:test";
import { BLUES, Dance, Deltas, PDP7_VOICES, PENTATONIC, SWING, Tally, groove, period, pitch, score, swing } from "./dance.js";

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
	assert.deepEqual(notes.map((n) => n.voice), ["cpu"]);
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
	assert.equal(bar(0).length, 0);
	assert.ok(bar(0.5).some((n) => n.voice === "drums"));
});

test("jazz: the ride's spang-a-lang, the blues scale, and the second eighth of each beat late", () => {
	const ride = Array.from({ length: 16 }, (_, s) => s).filter((s) => swing(s, 0.5, 0).includes("ride"));
	assert.deepEqual(ride, [0, 4, 6, 8, 12, 14]);
	const d = new Dance(PDP7_VOICES);
	d.style = "jazz";
	const hits = { cpu: [{ key: 0o100, weight: 9 }] };
	const beats = Array.from({ length: 4 }, () => d.beat(hits, 0.5));
	assert.ok(beats.every((b, s) => b.every((n) => (n.late ?? 0) === (s === 2 ? SWING : 0))));
	const cpu = beats[0]!.find((n) => n.voice === "cpu")!;
	assert.ok(BLUES.includes((cpu.midi - PDP7_VOICES[0]!.root) % 12));
});
