/**
 * The resize and move handles on a machine's screen show while the pointer moves over it and
 * fade after `fade` seconds of stillness, the way a video player's controls do. 0 keeps them
 * showing. One setting for the whole site, kept in this browser.
 */

const KEY = 'machine-handles-fade';
export const FADE_DEFAULT = 3;

export const handles = $state({ fade: FADE_DEFAULT });

let started = false;

export function startHandles() {
	if (started || typeof window === 'undefined') return;
	started = true;
	try {
		const kept = Number(localStorage.getItem(KEY));
		if (localStorage.getItem(KEY) !== null && Number.isFinite(kept) && kept >= 0) handles.fade = kept;
	} catch {
		/* Storage forbidden: the default. */
	}
}

/** @param {number} seconds 0 keeps the handles showing */
export function setFade(seconds) {
	handles.fade = Math.max(0, Math.min(60, seconds));
	try {
		if (handles.fade === FADE_DEFAULT) localStorage.removeItem(KEY);
		else localStorage.setItem(KEY, String(handles.fade));
	} catch {
		/* Storage forbidden: it lasts until the page is left. */
	}
}
