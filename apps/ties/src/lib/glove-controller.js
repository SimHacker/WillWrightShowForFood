import { DataGlove, GESTURES, syntheticHand, wavingHand } from '@wwsff/cabinet';

const openCamera = async (feed, options) => {
	const { startHandCamera } = await import('./hand-camera.js');
	return startHandCamera(feed, options);
};

const HAND_TIMEOUT = 1000;

/** One controller per cabinet, never shared between applets or machine resets. */
export function createGloveController({ startCamera = openCamera, now = () => performance.now() } = {}) {
	let glove = null;
	let camera = null;
	let mode = 'demo';
	let generation = 0;
	let active = false;
	let pending = null;
	let abort = null;
	let cameraState = 'idle';
	let cameraError = '';
	let started = now();
	let lastHand = null;
	let lastSeen = -Infinity;
	const sliders = { curls: [0, 0, 0, 0, 0], heading: 0 };
	const manual = () => syntheticHand({ ...sliders, x: 0.5, y: 0.82, size: 0.32 });
	const demoSeconds = () => Math.max(0, now() - Math.max(started, lastSeen + HAND_TIMEOUT)) / 1000;
	const demo = () => wavingHand(demoSeconds());
	const handMode = () => mode === 'auto' ? (lastHand && now() - lastSeen < HAND_TIMEOUT ? 'camera' : 'demo') : mode;
	const sample = () => handMode() === 'camera' ? lastHand : mode === 'manual' ? manual() : demo();

	function setMode(next) {
		generation += 1;
		abort?.abort();
		abort = null;
		pending = null;
		camera?.stop();
		camera = null;
		cameraState = 'idle';
		cameraError = '';
		lastHand = null;
		lastSeen = -Infinity;
		started = now();
		mode = next;
		if (glove) {
			glove.source = sample;
			glove.feed(sample());
		}
	}

	function useCamera(on) {
		if (!on) {
			setMode('demo');
			return Promise.resolve(false);
		}
		if (mode === 'auto' && pending) return pending;
		if (mode === 'auto' && camera) return Promise.resolve(true);
		setMode('auto');
		cameraState = 'pending';
		abort = new AbortController();
		const request = generation;
		pending = (async () => {
			try {
				const session = await startCamera((frame) => {
					if (generation !== request || mode !== 'auto' || !frame) return;
					lastHand = frame;
					lastSeen = now();
					glove?.feed(frame);
				}, { signal: abort.signal });
				if (generation !== request) {
					session.stop();
					return false;
				}
				camera = session;
				cameraState = 'ready';
				return true;
			} catch (error) {
				if (generation !== request) return false;
				cameraState = 'error';
				cameraError = `${error?.name ?? 'Camera error'}: ${error?.message ?? error}`;
				return false;
			} finally {
				if (generation === request) pending = null;
			}
		})();
		return pending;
	}

	function instructions() {
		if (mode === 'manual') return { title: 'MANUAL HAND', detail: 'Sliders control this hand. Select AUTO / CAMERA to play with your own.' };
		if (mode === 'demo') return { title: 'SYNTHETIC DEMO — CAMERA OFF', detail: 'Select AUTO / CAMERA to join in. No video is being captured.' };
		if (cameraState === 'error') {
			return {
				title: 'SYNTHETIC DEMO — PLEASE ENABLE THE CAMERA',
				detail: `Camera unavailable (${cameraError}). Allow camera access in your browser, then select RETRY CAMERA. The show goes on!`
			};
		}
		if (cameraState === 'pending') return {
			title: 'SYNTHETIC DEMO — PLEASE ENABLE THE CAMERA',
			detail: 'Wave hello! Choose Allow in your browser’s camera prompt. Loading the tracker; video stays in your browser.'
		};
		if (camera?.stats?.error) return { title: 'TRACKER ERROR — SYNTHETIC STANDBY', detail: `${camera.stats.error}. Select RETRY CAMERA to restart the tracker.` };
		if (handMode() === 'camera') return {
			title: 'LIVE — YOUR HAND IS DRIVING THE PDP-7',
			detail: 'Try waving, a fist, a peace sign… or the bird. Hide your hand for a second and I’ll wave you back in.'
		};
		const gesture = GESTURES[Math.floor(demoSeconds() / 6) % GESTURES.length].name;
		return {
			title: 'SYNTHETIC ATTRACT MODE — SHOW YOUR HAND',
			detail: gesture === 'bird'
				? 'Yes, that’s the bird. Your move! Hold YOUR hand up to the camera to take over.'
				: `Can you copy me? ${gesture.toUpperCase()}! Hold YOUR hand up to the camera — you take over instantly.`
		};
	}

	return {
		snapshot: () => ({ glove, handCamera: camera, handMode: handMode(), instructions: instructions() }),
		activate() {
			if (active) return;
			active = true;
			void useCamera(true);
		},
		peripherals() {
			// Keep the selected input on reset, but route it to the replacement device.
			glove = new DataGlove({ source: sample });
			glove.feed(sample());
			return [glove];
		},
		dispose() {
			active = false;
			setMode('demo');
			glove = null;
		},
		toggles: [
			{
				id: 'demo',
				label: '👋 DEMO',
				title: 'Synthetic demo only. Stops the camera. Sliders select manual control.',
				on: () => mode === 'demo',
				async set(on) {
					setMode(on ? 'demo' : 'manual');
					return mode === 'demo';
				}
			},
			{
				id: 'camera',
				label: '🖐️ AUTO / CAMERA',
				title: 'Automatic live hand tracking with synthetic attract mode. Click again to turn the camera off.',
				on: () => mode === 'auto',
				set(on) {
					return useCamera(cameraState === 'error' || camera?.stats?.error ? true : on);
				}
			},
			{
				id: 'retry-camera',
				label: 'RETRY CAMERA',
				title: 'Retry camera permission or restart a failed hand tracker.',
				on: () => false,
				async set() {
					setMode('demo');
					await useCamera(true);
					return false;
				}
			}
		],
		sliders: [
			...['THUMB', 'INDEX', 'MIDDLE', 'RING', 'PINKY'].map((name, i) => ({
				id: `curl${i}`,
				label: name[0],
				title: `${name}: drag to curl it (0 straight, 100 curled). Selects manual control.`,
				min: 0,
				max: 100,
				get: () => Math.round(sliders.curls[i] * 100),
				set(value) {
					sliders.curls[i] = value / 100;
					setMode('manual');
				}
			})),
			{
				id: 'turn',
				label: '↻',
				title: 'Turn the manual hand, degrees: left negative, right positive.',
				min: -60,
				max: 60,
				get: () => sliders.heading,
				set(value) {
					sliders.heading = value;
					setMode('manual');
				}
			}
		]
	};
}
