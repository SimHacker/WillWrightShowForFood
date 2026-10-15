import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
	Cabinet, Pdp7, Type340, Teletype, syntheticHand,
	assembleForthKernel, compileForth, bootForth
} from '@wwsff/cabinet';
import { createHandController } from './hand-controller.js';

function cameraHarness() {
	let feed;
	let ready;
	let reject;
	let time = 0;
	let starts = 0;
	let signal;
	let stopped = 0;
	const controller = createHandController({
		now: () => time,
		startCamera(onFrame, options) {
			starts += 1;
			signal = options.signal;
			feed = onFrame;
			return new Promise((resolve, fail) => {
				reject = fail;
				ready = () => resolve({ stats: {}, stop: () => { stopped += 1; } });
			});
		}
	});
	return {
		controller,
		feed: (frame) => feed(frame),
		ready: () => ready(),
		fail: (error) => reject(error),
		advance: (ms) => { time += ms; },
		starts: () => starts,
		signal: () => signal,
		stopped: () => stopped
	};
}

test('activation starts only this cabinet camera, keeps the show running, and preserves routing after reset', async () => {
	const a = cameraHarness();
	const b = cameraHarness();
	const [first] = a.controller.peripherals();
	const [other] = b.controller.peripherals();
	const otherInitial = other.last;
	a.controller.activate();
	a.controller.activate();
	const starting = a.controller.toggles[1].set(true);
	assert.equal(a.starts(), 1, 'activation and reset must not duplicate permission prompts');
	assert.equal(b.starts(), 0, 'unselected programs never request the camera');
	assert.ok(first.source(), 'synthetic hand keeps waving during permission and loading');
	assert.equal(a.controller.toggles[0].on(), false);
	assert.equal(a.controller.toggles[1].on(), true);
	assert.equal(b.controller.toggles[0].on(), true);
	assert.match(a.controller.snapshot().instructions.title, /PLEASE ENABLE THE CAMERA/);
	a.ready();
	await starting;
	const hand = syntheticHand({ curls: [1, 1, 0, 1, 1], handedness: 'left' });
	a.feed(hand);
	assert.equal(first.last, hand);
	assert.equal(other.last, otherInitial, 'the other applet cannot receive these camera poses');
	const oldFrames = first.frames;
	const [replacement] = a.controller.peripherals();
	a.controller.activate();
	assert.equal(a.starts(), 1, 'reset retains the existing camera');
	a.feed(hand);
	assert.equal(replacement.last, hand);
	assert.equal(replacement.source(), hand);
	assert.equal(first.frames, oldFrames, 'the previous machine receives no more frames');
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
	const [datahand] = h.controller.peripherals();
	const starting = h.controller.toggles[1].set(true);
	await h.controller.toggles[0].set(true);
	assert.equal(h.signal().aborted, true);
	h.ready();
	assert.equal(await starting, false);
	h.feed(syntheticHand({ curls: [1, 1, 1, 1, 1] }));
	assert.equal(h.controller.snapshot().handMode, 'demo');
	assert.equal(h.controller.snapshot().handCamera, null);
	assert.equal(h.stopped(), 1);
	assert.notEqual(datahand.source, null);
	h.controller.dispose();
});

test('auto mode takes a real hand immediately, holds dropouts for exactly one second, and waves it back in', async () => {
	const h = cameraHarness();
	const [datahand] = h.controller.peripherals();
	h.controller.activate();
	const starting = h.controller.toggles[1].set(true);
	h.ready();
	await starting;
	assert.match(h.controller.snapshot().instructions.title, /SHOW YOUR HAND/);
	const hand = syntheticHand({ handedness: 'left', curls: [1, 1, 0, 1, 1] });
	h.feed(hand);
	assert.equal(datahand.last, hand, 'no delay before real input reaches the port');
	assert.equal(h.controller.snapshot().handMode, 'camera');
	assert.match(h.controller.snapshot().instructions.title, /YOUR HAND IS DRIVING/);
	h.feed(null);
	h.advance(999);
	datahand.tick(20_000);
	assert.equal(datahand.last, hand, 'brief dropouts hold the real pose');
	h.advance(1);
	datahand.tick(20_000);
	assert.equal(h.controller.snapshot().handMode, 'demo');
	assert.notEqual(datahand.last, hand, 'one second really returns synthetic poses to the device');
	assert.match(h.controller.snapshot().instructions.title, /SYNTHETIC ATTRACT MODE/);
	const wave = datahand.last;
	h.advance(2000);
	datahand.tick(20_000);
	assert.notDeepEqual(datahand.last.points, wave.points, 'the attract hand actually animates');
	h.advance(16_000);
	assert.match(h.controller.snapshot().instructions.detail, /bird/);
	h.feed(hand);
	assert.equal(datahand.last, hand, 'returning hand instantly interrupts even the bird');
	assert.equal(h.starts(), 1, 'attract mode keeps the camera running, not a fresh permission prompt');
	h.controller.dispose();
});

test('camera failure is explicit while animation continues; retry, privacy off and reactivation work', async () => {
	const h = cameraHarness();
	const [datahand] = h.controller.peripherals();
	h.controller.activate();
	const starting = h.controller.toggles[1].set(true);
	h.fail(new DOMException('Permission denied', 'NotAllowedError'));
	assert.equal(await starting, false);
	assert.match(h.controller.snapshot().instructions.detail, /NotAllowedError: Permission denied/);
	assert.match(h.controller.snapshot().instructions.detail, /RETRY CAMERA/);
	h.advance(2000);
	assert.ok(datahand.source());
	const retry = h.controller.toggles[2].set(true);
	h.ready();
	await retry;
	assert.equal(h.starts(), 2);
	assert.match(h.controller.snapshot().instructions.title, /SHOW YOUR HAND/);
	await h.controller.toggles[1].set(false);
	assert.equal(h.stopped(), 1);
	assert.match(h.controller.snapshot().instructions.title, /CAMERA OFF/);
	h.controller.activate();
	assert.equal(h.starts(), 2, 'reset cannot override the user turning the camera off');
	h.controller.dispose();
	h.controller.peripherals();
	h.controller.activate();
	assert.equal(h.starts(), 3, 'reselecting the program starts auto mode again');
	h.controller.dispose();
	h.ready();
	await Promise.resolve();
	assert.equal(h.stopped(), 2, 'late session is released after leaving');
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
		sources: ['prelude.fs', 'does.fs', 'turtle.fs', 'code.fs', 'tags.fs', 'clip.fs', 'turtle3d.fs', 'datahand.fs']
			.map((f) => tape(`pdp7forth/${f}`))
	});
	const h = cameraHarness();
	const [datahand] = h.controller.peripherals();
	const cpu = new Pdp7({ coreWords: 8192 });
	let rendered = [];
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		onFrame: (frame) => { if (frame.segments.length > 100) rendered = frame.segments; }
	});
	const tty = new Teletype({ printCycles: 1000 });
	const box = new Cabinet({ cpu, devices: [t340, tty, datahand] });
	bootForth(cpu, image);
	box.run(300_000);
	for (const ch of 'DATAHAND\r') tty.type(ch.charCodeAt(0) | 0o200);
	box.run(2_000_000);
	h.controller.activate();
	const starting = h.controller.toggles[1].set(true);
	h.ready();
	await starting;
	for (const curls of [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1]]) {
		h.feed(syntheticHand({ curls, handedness: 'left' }));
		box.run(2_000_000);
		assert.equal(datahand.registers()[0], 1, 'Forth latched the camera left hand, not the demo right hand');
		for (let finger = 0; finger < 5; finger += 1) {
			const x = 112 + 170 * finger + 12;
			const y = 60 + 140 * curls[finger];
			const strokes = rendered.filter((s) => s.intensify && s.x0 === x && s.x1 === x && s.y0 >= 60 && s.y1 <= 200);
			assert.equal(Math.max(60, ...strokes.map((s) => s.y1)), y,
				`camera ${curls}: 340 meter ${finger} endpoints ${JSON.stringify(strokes.map((s) => [s.y0, s.y1]))}`);
		}
	}
	h.feed(null);
	h.advance(1000);
	box.run(2_000_000);
	assert.equal(datahand.registers()[0], 7, 'the actual Forth display returns to the synthetic right hand, marked synthetic');
	h.feed(syntheticHand({ curls: [0, 0, 0, 0, 0], handedness: 'left' }));
	box.run(2_000_000);
	assert.equal(datahand.registers()[0], 1, 'the camera takes back the actual display without a click');
	h.controller.dispose();
});
