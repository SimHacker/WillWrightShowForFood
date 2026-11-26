// Keys for the emulator itself, on the PDP-7's page and the Apple's. They are characters an
// Apple ][+ keyboard cannot type ([ \ { } | ` ~), so no ][+ program ever waits for one, and
// unmodified, so Alt stays the Apple's buttons, Ctrl its control codes, Cmd the browser's.
// A PDP-7 teletype can type them, so its paper keeps them.

import { TEMPOS } from './dance-player.js';

/** @typedef {'slower' | 'faster' | 'normal' | 'pause' | 'step' | 'tempoDown' | 'tempoUp'} EmulatorCommand */

/** @type {Record<string, EmulatorCommand>} */
const KEYS = {
	'{': 'slower',
	'}': 'faster',
	'|': 'normal',
	'\\': 'pause',
	'[': 'step',
	'`': 'tempoDown',
	'~': 'tempoUp'
};

/** Each key and what it does, for help. */
export const EMULATOR_KEYS_LIST = [
	['{', 'slower, a notch down the speed scale'],
	['}', 'faster, a notch up'],
	['|', 'back to 1×'],
	['\\', 'stop or run'],
	['[', 'one instruction'],
	['`', 'dance tempo down'],
	['~', 'dance tempo up']
];

export const EMULATOR_KEYS_HELP =
	'Keys: { slower, } faster, | 1×, \\ pause, [ one instruction, ` dance tempo down, ~ up';

/**
 * The same commands by physical key (event.code), unshifted and easy to reach, for the key after
 * the PDP-7 teletype's ^\\ prefix and for Alt chords on the PDP-7's page. By code, so a Mac's
 * Option characters (Option-[ is “) don't matter. Alt+Left and Alt+Right are left alone: on
 * Windows they are the browser's Back and Forward.
 * @type {Record<string, EmulatorCommand>}
 */
const CODES = {
	BracketLeft: 'slower',
	BracketRight: 'faster',
	ArrowDown: 'slower',
	ArrowUp: 'faster',
	Backslash: 'normal',
	Digit1: 'normal',
	Space: 'pause',
	KeyP: 'pause',
	Period: 'step',
	Minus: 'tempoDown',
	Equal: 'tempoUp'
};

/** Each key after the prefix, or with Alt, and what it does, for help. */
export const CHORD_KEYS_LIST = [
	['[ or ↓', 'slower, a notch down the speed scale'],
	['] or ↑', 'faster, a notch up'],
	['\\ or 1', 'back to 1×'],
	['Space or P', 'stop or run (Alt-P, not Alt-Space)'],
	['.', 'one instruction'],
	['-', 'dance tempo down'],
	['=', 'dance tempo up']
];

/** The command for the key after a prefix, by its place on the keyboard. @param {KeyboardEvent} ev */
export function prefixedKey(ev) {
	return CODES[ev.code] ?? null;
}

/** An Alt chord's command on the PDP-7's page, or null. @param {KeyboardEvent} ev */
export function altKey(ev) {
	if (!ev.altKey || ev.ctrlKey || ev.metaKey || ev.code === 'Space') return null;
	return CODES[ev.code] ?? null;
}

/** The emulator command a key stands for, or null. @param {KeyboardEvent} ev */
export function emulatorKey(ev) {
	if (ev.ctrlKey || ev.metaKey || ev.altKey || (ev.repeat && (ev.key === '\\' || ev.key === '|'))) return null;
	return KEYS[ev.key] ?? null;
}

/** The next dance tempo up or down from `bpm`. @param {number} bpm @param {number} dir */
export function nextTempo(bpm, dir) {
	const i = TEMPOS.indexOf(bpm);
	const at = i < 0 ? TEMPOS.indexOf(120) : i;
	return TEMPOS[Math.max(0, Math.min(TEMPOS.length - 1, at + dir))] ?? bpm;
}
