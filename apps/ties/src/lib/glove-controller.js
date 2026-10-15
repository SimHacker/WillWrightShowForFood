import { DataGlove, syntheticHand, wavingHand } from '@wwsff/cabinet';

const openCamera = async (feed) => {
	const { startHandCamera } = await import('./hand-camera.js');
	return startHandCamera(feed);
};

/** One controller per cabinet, never shared between applets or machine resets. */
export function createGloveController({ startCamera = openCamera, now = () => performance.now() } = {}) {
	let glove = null;
	let camera = null;
	let mode = 'demo';
	let generation = 0;
	const started = now();
	const sliders = { curls: [0, 0, 0, 0, 0], heading: 0 };
	const manual = () => syntheticHand({ ...sliders, x: 0.5, y: 0.82, size: 0.32 });
	const demo = () => wavingHand((now() - started) / 1000);

	function setMode(next) {
		generation += 1;
		camera?.stop();
		camera = null;
		mode = next;
		if (glove) {
			glove.source = mode === 'demo' ? demo : mode === 'manual' ? manual : null;
			glove.feed(mode === 'demo' ? demo() : mode === 'manual' ? manual() : null);
		}
	}

	async function useCamera(on) {
		if (!on) {
			setMode('manual');
			return false;
		}
		if (mode === 'camera' && camera) return true;
		// Stop synthetic input before waiting for the camera or its permission prompt.
		setMode('camera');
		const request = generation;
		try {
			const session = await startCamera((frame) => {
				if (generation === request && mode === 'camera') glove?.feed(frame);
			});
			if (generation !== request) {
				session.stop();
				return false;
			}
			camera = session;
			return true;
		} catch (error) {
			if (generation === request) setMode('manual');
			throw error;
		}
	}

	return {
		snapshot: () => ({ glove, handCamera: camera, handMode: mode }),
		peripherals() {
			// Keep the selected input on reset, but route it to the replacement device.
			glove = new DataGlove({ source: mode === 'demo' ? demo : mode === 'manual' ? manual : undefined });
			if (mode === 'camera') glove.feed(null);
			return [glove];
		},
		dispose() {
			setMode('manual');
			glove = null;
		},
		toggles: [
			{
				id: 'demo',
				label: '👋',
				title: 'Demo hand. Selecting it stops the camera; off selects manual sliders.',
				on: () => mode === 'demo',
				async set(on) {
					setMode(on ? 'demo' : 'manual');
					return mode === 'demo';
				}
			},
			{
				id: 'camera',
				label: '🖐️',
				title: 'Camera hand. Selecting it stops the demo immediately; off selects manual sliders.',
				starting: '🖐️ Loading the hand tracker and asking for the camera…',
				on: () => mode === 'camera',
				set: useCamera
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
