/** Phone crash breadcrumbs. `?debug=1` persists in localStorage; `?debug=0` off; `?noheat=1` skips the 17MB heatmap. */

export type DebugLine = { t: number; msg: string };

const FLAG = 'ebike-debug';
const LOG_KEY = 'ebike-debug-log';
const MAX = 100;

let lines: DebugLine[] = [];
let previous: DebugLine[] = [];
let installed = false;
const listeners = new Set<() => void>();

function notify() {
	for (const fn of listeners) fn();
}

export function debugEnabled(): boolean {
	if (typeof window === 'undefined') return false;
	const q = new URLSearchParams(window.location.search);
	if (q.get('debug') === '0') {
		try {
			localStorage.removeItem(FLAG);
		} catch {
			/* ignore */
		}
		return false;
	}
	if (q.get('debug') === '1' || q.get('debug') === 'true') {
		try {
			localStorage.setItem(FLAG, '1');
		} catch {
			/* ignore */
		}
		return true;
	}
	try {
		return localStorage.getItem(FLAG) === '1';
	} catch {
		return false;
	}
}

export function skipHeatmap(): boolean {
	if (typeof window === 'undefined') return false;
	return new URLSearchParams(window.location.search).get('noheat') === '1';
}

export function getDebugLines(): DebugLine[] {
	return lines;
}

export function getPreviousDebugLines(): DebugLine[] {
	return previous;
}

export function subscribeDebug(fn: () => void): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

function persistNow() {
	try {
		localStorage.setItem(LOG_KEY, JSON.stringify(lines.slice(-MAX)));
	} catch {
		/* quota / private mode */
	}
}

let persistTimer = 0;
function persist() {
	if (typeof window === 'undefined') return;
	window.clearTimeout(persistTimer);
	persistTimer = window.setTimeout(persistNow, 400);
}

function flushDebugLog() {
	if (typeof window === 'undefined') return;
	window.clearTimeout(persistTimer);
	persistNow();
}

function isMapTileUrl(url: string) {
	return url.includes('tile.openstreetmap.org') || /\.png(\?|$)/i.test(url);
}

export function debugLog(msg: string) {
	if (typeof window === 'undefined') return;
	if (!debugEnabled() && !installed) return;
	const line = { t: Date.now(), msg };
	lines = [...lines.slice(-(MAX - 1)), line];
	persist();
	console.log(`[ebike-debug] ${msg}`);
	notify();
}

export function installDebugTrap() {
	if (typeof window === 'undefined' || installed) return;
	if (!debugEnabled()) return;
	installed = true;

	try {
		const raw = localStorage.getItem(LOG_KEY);
		previous = raw ? (JSON.parse(raw) as DebugLine[]) : [];
	} catch {
		previous = [];
	}
	lines = [];
	persist();

	const ua = navigator.userAgent.replace(/\s+/g, ' ').slice(0, 160);
	debugLog(`boot ${window.innerWidth}x${window.innerHeight} dpr=${window.devicePixelRatio} ${ua}`);
	if (previous.length) {
		debugLog(`prev-session ${previous.length} lines, last: ${previous[previous.length - 1]?.msg}`);
	}

	window.addEventListener(
		'error',
		(ev) => {
			debugLog(`error ${ev.message} ${ev.filename}:${ev.lineno}:${ev.colno}`);
			flushDebugLog();
		},
		true
	);
	window.addEventListener('unhandledrejection', (ev) => {
		const r = ev.reason;
		debugLog(`unhandledrejection ${r instanceof Error ? r.message : String(r)}`);
	});
	window.addEventListener('pagehide', () => {
		debugLog('pagehide');
		flushDebugLog();
	});
	document.addEventListener('visibilitychange', () =>
		debugLog(`visibility ${document.visibilityState}`)
	);
	document.addEventListener('freeze', () => {
		debugLog('freeze');
		flushDebugLog();
	});

	const origFetch = window.fetch.bind(window);
	window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
		const url =
			typeof input === 'string'
				? input
				: input instanceof URL
					? input.href
					: input instanceof Request
						? input.url
						: String(input);
		if (isMapTileUrl(url)) return origFetch(input, init);
		const t0 = performance.now();
		debugLog(`fetch start ${url}`);
		try {
			const res = await origFetch(input, init);
			const len = res.headers.get('content-length') ?? '?';
			debugLog(
				`fetch ${res.status} ${url} ${len}B ${Math.round(performance.now() - t0)}ms`
			);
			return res;
		} catch (e) {
			debugLog(`fetch FAIL ${url} ${e instanceof Error ? e.message : e}`);
			throw e;
		}
	};
}
