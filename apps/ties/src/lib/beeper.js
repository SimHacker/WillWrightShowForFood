/**
 * The cabinet's one beep: the ASR-33 bell, Hugh Pyle's recording (static/sounds/CREDITS.yml).
 * The teletype rings it on ^G; Turing machine doors that emit BEL ring it through the teletype.
 *
 * preload() fetches it; a ring before it arrives waits for it, so the first bell is the real one.
 * If it can't be loaded the bell is silent. Rings closer together than `gap` seconds are one ring:
 * a program can beep far faster than a bell can.
 */

export const BELL_SOUND = '/sounds/asr33-bell.wav';

export function createBeeper({ resolve = (p) => p, gap = 0.08 } = {}) {
	let ctx = null;
	let bytes = null;
	let decoding = null;
	let buffer = null;
	let last = -Infinity;
	let muted = false;

	function load() {
		bytes ??= fetch(resolve(BELL_SOUND)).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${BELL_SOUND}: ${r.status}`))));
		return bytes;
	}

	function play(ac) {
		const t = ac.currentTime;
		if (t - last < gap) return;
		last = t;
		const src = ac.createBufferSource();
		src.buffer = buffer;
		src.connect(ac.destination);
		src.start(t);
	}

	return {
		get muted() {
			return muted;
		},
		set muted(on) {
			muted = !!on;
		},
		preload() {
			load().catch(() => {});
		},
		ring() {
			if (muted) return;
			const Ctx = globalThis.AudioContext ?? globalThis.webkitAudioContext;
			if (!Ctx) return;
			ctx ??= new Ctx();
			if (ctx.state === 'suspended') ctx.resume().catch(() => {});
			if (buffer) return play(ctx);
			const ac = ctx;
			decoding ??= load()
				.then((b) => ac.decodeAudioData(b.slice(0)))
				.then((b) => (buffer = b));
			decoding.then(
				() => play(ac),
				() => {},
			);
		},
	};
}
