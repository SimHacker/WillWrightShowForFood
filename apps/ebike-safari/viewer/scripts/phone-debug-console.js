// Paste into Safari Web Inspector console attached to the iPhone tab.
// Survives a WebKit kill via localStorage. Reload after a crash and run:
//   copy(JSON.stringify(JSON.parse(localStorage.getItem('ebike-debug-log')||'[]'),null,2))
(function () {
	const KEY = 'ebike-debug-log';
	const MAX = 100;
	const prev = JSON.parse(localStorage.getItem(KEY) || '[]');
	if (prev.length) {
		console.warn('[ebike-debug] previous session last:', prev[prev.length - 1]);
	}
	const lines = [];
	function log(msg) {
		const line = { t: Date.now(), msg: String(msg) };
		lines.push(line);
		if (lines.length > MAX) lines.shift();
		localStorage.setItem(KEY, JSON.stringify(lines));
		console.log('[ebike-debug]', msg);
	}
	log(
		'boot ' +
			innerWidth +
			'x' +
			innerHeight +
			' dpr=' +
			devicePixelRatio +
			' ' +
			navigator.userAgent
	);
	if (prev.length) log('prev last: ' + prev[prev.length - 1].msg);
	addEventListener(
		'error',
		(ev) => log('error ' + ev.message + ' ' + ev.filename + ':' + ev.lineno),
		true
	);
	addEventListener('unhandledrejection', (ev) =>
		log('unhandledrejection ' + (ev.reason && ev.reason.message ? ev.reason.message : ev.reason))
	);
	addEventListener('pagehide', () => log('pagehide'));
	document.addEventListener('visibilitychange', () => log('visibility ' + document.visibilityState));
	document.addEventListener('freeze', () => log('freeze'));
	const orig = fetch;
	window.fetch = async function (input, init) {
		const url =
			typeof input === 'string'
				? input
				: input && input.url
					? input.url
					: String(input);
		const t0 = performance.now();
		log('fetch start ' + url);
		try {
			const res = await orig(input, init);
			log(
				'fetch ' +
					res.status +
					' ' +
					url +
					' ' +
					(res.headers.get('content-length') || '?') +
					'B ' +
					Math.round(performance.now() - t0) +
					'ms'
			);
			return res;
		} catch (e) {
			log('fetch FAIL ' + url + ' ' + e);
			throw e;
		}
	};
	log('trap installed — reload the page now so fetches are wrapped from the start');
})();
