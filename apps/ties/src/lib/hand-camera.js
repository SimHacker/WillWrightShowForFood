/**
 * The DataGlove's webcam: MediaPipe's hand landmarker, loaded on first use.
 * About 21 MB the first time (wasm from jsDelivr, the model from Google's
 * storage), then the browser's cache. Video stays in the browser.
 *
 * startHandCamera(onFrame) asks for the camera and calls onFrame(frame) for
 * every video frame: a HandFrame ({ points, handedness, aspect }, 21 points in
 * image coordinates) or null with no hand in view. It returns { video, stats,
 * stop() }: the video and what the tracker last saw, for the GLOVE panel.
 */

// Keep in step with @mediapipe/tasks-vision in package.json: the wasm must match the JS.
const MP_VERSION = '1.1.0';
const WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL =
	'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

let landmarker = null;
let delegate = '';

/** The landmarker, loaded once: also a way to fetch the model ahead of the camera. */
export async function getLandmarker() {
	if (landmarker) return landmarker;
	const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
	const files = await FilesetResolver.forVisionTasks(WASM);
	const make = (d) =>
		HandLandmarker.createFromOptions(files, {
			baseOptions: { modelAssetPath: MODEL, delegate: d },
			runningMode: 'VIDEO',
			numHands: 1,
			minHandDetectionConfidence: 0.3,
			minHandPresenceConfidence: 0.3,
			minTrackingConfidence: 0.3
		}).then((h) => ((delegate = d), h));
	landmarker = await make('GPU').catch(() => make('CPU'));
	return landmarker;
}

export async function startHandCamera(onFrame, { signal } = {}) {
	signal?.throwIfAborted();
	const stream = await navigator.mediaDevices.getUserMedia({
		video: { width: 640, height: 480, facingMode: 'user' }, audio: false
	});
	let video = null;
	let live = true;
	const stop = () => {
		live = false;
		stream.getTracks().forEach((t) => t.stop());
		if (video) video.srcObject = null;
		signal?.removeEventListener('abort', stop);
	};
	signal?.addEventListener('abort', stop, { once: true });
	let hands;
	try {
		// A permission prompt cannot be cancelled; release a late grant before loading anything.
		signal?.throwIfAborted();
		hands = await getLandmarker();
		signal?.throwIfAborted();
		video = document.createElement('video');
		video.muted = true;
		video.playsInline = true;
		video.srcObject = stream;
		await video.play();
		signal?.throwIfAborted();
	} catch (error) {
		stop();
		throw error;
	}
	const track = stream.getVideoTracks()[0];
	/** What the tracker is doing, for the GLOVE panel. */
	const stats = {
		camera: track?.label ?? '',
		delegate,
		frames: 0,
		hands: 0,
		fps: 0,
		detectMs: 0,
		side: '',
		score: 0,
		result: null,
		error: ''
	};
	let lastTime = -1;
	let ts = 0;
	let fpsFrames = 0;
	let fpsAt = performance.now();
	const step = () => {
		if (!live) return;
		if (video.readyState >= 2 && video.currentTime !== lastTime) {
			lastTime = video.currentTime;
			// Timestamps must only go up, even when two frames land in one millisecond.
			ts = Math.max(ts + 1, performance.now());
			const t0 = performance.now();
			let r = null;
			try {
				r = hands.detectForVideo(video, ts);
				stats.error = '';
			} catch (e) {
				stats.error = String(e?.message ?? e);
			}
			stats.detectMs = performance.now() - t0;
			stats.result = r;
			stats.frames += 1;
			fpsFrames += 1;
			if (t0 - fpsAt >= 1000) {
				stats.fps = (fpsFrames * 1000) / (t0 - fpsAt);
				fpsFrames = 0;
				fpsAt = t0;
			}
			const points = r?.landmarks?.[0];
			const cat = r?.handedness?.[0]?.[0];
			stats.side = cat?.categoryName ?? '';
			stats.score = cat?.score ?? 0;
			if (points) stats.hands += 1;
			// MediaPipe names hands as if the picture were mirrored; this video is not,
			// so its "Left" is the person's own right hand.
			onFrame(
				points
					? {
							points: points.map(({ x, y, z }) => ({ x, y, z })),
							handedness: stats.side === 'Left' ? 'right' : 'left',
							aspect: video.videoWidth / video.videoHeight || 4 / 3
						}
					: null
			);
		}
		requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
	return {
		video,
		stats,
		stop
	};
}
