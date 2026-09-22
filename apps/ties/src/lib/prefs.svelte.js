/**
 * Lightweight user metadata. localStorage until a storyboard edits it.
 * Missing, corrupt, or partial records fall back to defaults. Never throw.
 */
export const USER_KEY = 'ties.user';
const LEGACY_TIMEOUT_KEY = 'ties.clickTimeoutMs';

export const USER_DEFAULTS = {
	clickTimeoutMs: 1000,
	blinkArmed: true
};

export const CLICK_TIMEOUT_DEFAULT_MS = USER_DEFAULTS.clickTimeoutMs;

function clampTimeout(ms) {
	const n = Math.round(Number(ms));
	if (!Number.isFinite(n)) return USER_DEFAULTS.clickTimeoutMs;
	return Math.min(8000, Math.max(200, n));
}

function asBool(value, fallback) {
	if (value === true || value === 'true' || value === 1 || value === '1') return true;
	if (value === false || value === 'false' || value === 0 || value === '0') return false;
	return fallback;
}

function readStorage(key) {
	try {
		if (typeof localStorage === 'undefined') return null;
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStorage(key, value) {
	try {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem(key, value);
	} catch {
		/* private mode, quota — keep going with in-memory defaults */
	}
}

/** Merge a raw record onto defaults. Extra keys are kept for later properties. */
export function normalizeUser(raw) {
	const base = { ...USER_DEFAULTS };
	if (!raw || typeof raw !== 'object') return base;
	return {
		...base,
		...raw,
		clickTimeoutMs: clampTimeout(raw.clickTimeoutMs ?? raw.click_timeout_ms),
		blinkArmed: asBool(raw.blinkArmed ?? raw.blink_armed, USER_DEFAULTS.blinkArmed)
	};
}

export function loadUser() {
	const raw = readStorage(USER_KEY);
	if (raw) {
		try {
			return normalizeUser(JSON.parse(raw));
		} catch {
			/* fall through */
		}
	}
	const legacy = readStorage(LEGACY_TIMEOUT_KEY);
	if (legacy != null) return normalizeUser({ clickTimeoutMs: legacy });
	return normalizeUser(null);
}

/** Live record. Storyboard editing later writes through saveUser. */
export const user = $state(loadUser());

export function saveUser(partial = {}) {
	const next = normalizeUser({ ...user, ...partial });
	user.clickTimeoutMs = next.clickTimeoutMs;
	user.blinkArmed = next.blinkArmed;
	for (const [k, v] of Object.entries(next)) {
		if (k === 'clickTimeoutMs' || k === 'blinkArmed') continue;
		user[k] = v;
	}
	writeStorage(USER_KEY, JSON.stringify({ ...user }));
	applyUser();
	return { ...user };
}

export function applyUser() {
	if (typeof document === 'undefined') return;
	try {
		const root = document.documentElement;
		root.style.setProperty('--click-timeout', `${user.clickTimeoutMs}ms`);
		root.dataset.blinkArmed = user.blinkArmed ? 'true' : 'false';
	} catch {
		/* SSR or detached document */
	}
}

export function getClickTimeoutMs() {
	return clampTimeout(user?.clickTimeoutMs);
}

export function setClickTimeoutMs(ms) {
	return saveUser({ clickTimeoutMs: ms }).clickTimeoutMs;
}

export function applyClickTimeoutCss(ms = getClickTimeoutMs()) {
	user.clickTimeoutMs = clampTimeout(ms);
	applyUser();
}

export function bootUser() {
	const loaded = loadUser();
	user.clickTimeoutMs = loaded.clickTimeoutMs;
	user.blinkArmed = loaded.blinkArmed;
	applyUser();
	return loaded;
}
