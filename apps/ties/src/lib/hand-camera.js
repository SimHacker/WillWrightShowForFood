/**
 * The DataGlove's webcam: MediaPipe's hand landmarker, loaded on first use.
 * About 21 MB the first time (wasm from jsDelivr, the model from Google's
 * storage), then the browser's cache. Video stays in the browser.
 *
 * startHandCamera(onFrame) asks for the camera and calls onFrame(frame) for
 * every video frame: a HandFrame ({ points, handedness, aspect }, 21 points in
 * image coordinates) or null with no hand in view. stop() lets the camera go.
 */
// Keep in step with @mediapipe/tasks-vision in package.json: the wasm must match the JS.
const MP_VERSION = '1.1.0';
const WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL =
	'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

let landmarker = null;

/** The landmarker, loaded once: also a way to fetch the model ahead of the camera. */
export async function getLandmarker() {
	if (landmarker) return landmarker;
	const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
	const files = await FilesetResolver.forVisionTasks(WASM);
	const make = (delegate) =>
		HandLandmarker.createFromOptions(files, {
			baseOptions: { modelAssetPath: MODEL, delegate },
			runningMode: 'VIDEO',
			numHands: 1
		});
	landmarker = await make('GPU').catch(() => make('CPU'));
	return landmarker;
}

export async function startHandCamera(onFrame) {
	const [hands, stream] = await Promise.all([
		getLandmarker(),
		navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false })
	]);
	const video = document.createElement('video');
	video.muted = true;
	video.playsInline = true;
	video.srcObject = stream;
	await video.play();
	let live = true;
	let lastTime = -1;
	const step = () => {
		if (!live) return;
		if (video.readyState >= 2 && video.currentTime !== lastTime) {
			lastTime = video.currentTime;
			const r = hands.detectForVideo(video, performance.now());
			const points = r.landmarks?.[0];
			// MediaPipe names hands as if the picture were mirrored; this video is not,
			// so its "Left" is the person's own right hand.
			const side = r.handedness?.[0]?.[0]?.categoryName;
			onFrame(
				points
					? {
							points: points.map(({ x, y, z }) => ({ x, y, z })),
							handedness: side === 'Left' ? 'right' : 'left',
							aspect: video.videoWidth / video.videoHeight || 4 / 3
						}
					: null
			);
		}
		requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
	return {
		stop() {
			live = false;
			stream.getTracks().forEach((t) => t.stop());
			video.srcObject = null;
		}
	};
}
