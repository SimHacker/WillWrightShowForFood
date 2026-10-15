import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
	Cabinet, Pdp7, Type340, Teletype, syntheticHand,
	assembleForthKernel, compileForth, bootForth
} from '@wwsff/cabinet';
import { createGloveController } from './glove-controller.js';

function cameraHarness() {
	let feed;
	let ready;
	let stopped = 0;
	const controller = createGloveController({
		now: () => 0,
		startCamera(onFrame) {
			feed = onFrame;
			return new Promise((resolve) => {
				ready = () => resolve({ stop: () => { stopped += 1; } });
			});
		}
	});
	return {
		controller,
		feed: (frame) => feed(frame),
		ready: () => ready(),
		stopped: () => stopped
	};
}

test('camera selection immediately stops the demo and feeds only its own cabinet, including after reset', async () => {
	const a = cameraHarness();
	const b = cameraHarness();
	const [first] = a.controller.peripherals();
	const [other] = b.controller.peripherals();
	const starting = a.controller.toggles[1].set(true);
	assert.equal(first.source, null, 'no synthetic poses during camera startup');
	assert.equal(a.controller.toggles[0].on(), false);
	assert.equal(a.controller.toggles[1].on(), true);
	assert.equal(b.controller.toggles[0].on(), true);
	a.ready();
	await starting;
	const hand = syntheticHand({ curls: [1, 1, 0, 1, 1], handedness: 'left' });
	a.feed(hand);
	assert.equal(first.last, hand);
	assert.equal(other.last, null, 'the other applet cannot receive these camera poses');
	const [replacement] = a.controller.peripherals();
	a.feed(hand);
	assert.equal(replacement.last, hand);
	assert.equal(replacement.source, null);
	assert.equal(first.frames, 2, 'the previous machine receives no more frames');
	a.controller.sliders[0].set(50);
	const frames = replacement.frames;
	a.feed(hand);
	assert.equal(replacement.frames, frames, 'late camera callbacks cannot overwrite manual input');
	assert.equal(a.stopped(), 1);
	a.controller.dispose();
	b.controller.dispose();
});

test('changing input while permission is pending cannot reactivate the camera', async () => {
	const h = cameraHarness();
	const [glove] = h.controller.peripherals();
	const starting = h.controller.toggles[1].set(true);
	await h.controller.toggles[0].set(true);
	h.ready();
	assert.equal(await starting, false);
	h.feed(syntheticHand({ curls: [1, 1, 1, 1, 1] }));
	assert.equal(h.controller.snapshot().handMode, 'demo');
	assert.equal(h.controller.snapshot().handCamera, null);
	assert.equal(h.stopped(), 1);
	assert.notEqual(glove.source, null);
	h.controller.dispose();
});

test('camera poses reach Forth and change the actual 340 flex strokes, not just the debug overlay', async () => {
	const tapeRoot = new URL('../../../../packages/cabinet/tapes/', import.meta.url);
	const tape = (path) => readFileSync(new URL(path, tapeRoot), 'utf8');
	const image = compileForth({
		kernel: assembleForthKernel({
			sop: tape('pdp7unix/sop.s'),
			kernel: tape('pdp7forth/kernel-names-full.s'),
			end: tape('pdp7forth/end.s'),
			kernelName: 'kernel-names-full.s'
		}),
		sources: ['prelude.fs', 'does.fs', 'turtle.fs', 'code.fs', 'tags.fs', 'turtle3d.fs', 'glove.fs']
			.map((f) => tape(`pdp7forth/${f}`))
	});
	const h = cameraHarness();
	const [glove] = h.controller.peripherals();
	const cpu = new Pdp7({ coreWords: 8192 });
	let rendered = [];
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		onFrame: (frame) => { if (frame.segments.length > 100) rendered = frame.segments; }
	});
	const tty = new Teletype({ printCycles: 1000 });
	const box = new Cabinet({ cpu, devices: [t340, tty, glove] });
	bootForth(cpu, image);
	box.run(300_000);
	for (const ch of 'GLOVE\r') tty.type(ch.charCodeAt(0) | 0o200);
	box.run(2_000_000);
	const starting = h.controller.toggles[1].set(true);
	h.ready();
	await starting;
	for (const curls of [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1]]) {
		h.feed(syntheticHand({ curls, handedness: 'left' }));
		box.run(2_000_000);
		assert.equal(glove.registers()[0], 1, 'Forth latched the camera left hand, not the demo right hand');
		for (let finger = 0; finger < 5; finger += 1) {
			const x = 112 + 170 * finger + 12;
			const y = 60 + 140 * curls[finger];
			const strokes = rendered.filter((s) => s.intensify && s.x0 === x && s.x1 === x && s.y0 >= 60 && s.y1 <= 200);
			assert.equal(Math.max(60, ...strokes.map((s) => s.y1)), y,
				`camera ${curls}: 340 meter ${finger} endpoints ${JSON.stringify(strokes.map((s) => [s.y0, s.y1]))}`);
		}
	}
	h.controller.dispose();
});
