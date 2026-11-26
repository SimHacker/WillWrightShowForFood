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
