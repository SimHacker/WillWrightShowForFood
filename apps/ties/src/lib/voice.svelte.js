/**
 * The Machine Room's speaking voice, one for the whole site: the teletype's read-aloud and the screen
 * angel. The choice is kept in localStorage; empty means the best voice this browser has from a
 * list of clear, natural female English voices, best first.
 */

const KEY = 'cabinet-voice';

/** Apple's female English voices, best first. */
const APPLE = ['Ava', 'Samantha', 'Zoe', 'Allison', 'Serena', 'Susan', 'Kate', 'Moira', 'Karen', 'Tessa', 'Fiona', 'Victoria'];

/**
 * Best first. Premium and Enhanced voices are downloads on Apple systems, Natural ones are Edge's,
 * and the plain Apple voices come with the system.
 */
const PREFERRED = [
	...APPLE.map((n) => new RegExp(`^${n} \\((Premium|Enhanced)\\)`)),
	...['Ava', 'Aria', 'Jenny', 'Emma', 'Sonia', 'Libby'].map((n) => new RegExp(`^Microsoft ${n} Online \\(Natural\\)`)),
	/^Google US English$/,
	/^Google UK English Female$/,
	...APPLE.map((n) => new RegExp(`^${n}\\b`)),
	/^Microsoft (Zira|Hazel|Susan)\b/,
];

/** macOS's novelty voices, never a default. */
const NOVELTY =
	/^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Jester|Junior|Organ|Pipe Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Ralph|Fred|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley)\b/;

const rank = (/** @type {SpeechSynthesisVoice} */ v) => {
	const i = PREFERRED.findIndex((p) => p.test(v.name));
	return i < 0 ? PREFERRED.length + (NOVELTY.test(v.name) ? 1 : 0) : i;
};

export const voice = $state({
	/** The chosen voice's name; empty for the default. */
	name: '',
	/** English voices, best first. @type {SpeechSynthesisVoice[]} */
	voices: [],
});

let started = false;

function refresh() {
	const all = globalThis.speechSynthesis?.getVoices() ?? [];
	voice.voices = all.filter((v) => /^en\b/i.test(v.lang)).sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

/** Read the stored choice and the browser's voices, once; voices often arrive a moment later. */
export function startVoices() {
	if (started || typeof window === 'undefined' || !globalThis.speechSynthesis) return;
	started = true;
	voice.name = localStorage.getItem(KEY) ?? '';
	refresh();
	speechSynthesis.addEventListener('voiceschanged', refresh);
}

/** @param {string} name the voice's name, or empty for the default */
export function chooseVoice(name) {
	voice.name = name;
	if (name) localStorage.setItem(KEY, name);
	else localStorage.removeItem(KEY);
}

/** The voice to speak with now: the chosen one if this browser has it, else the default. */
export function currentVoice() {
	startVoices();
	return voice.voices.find((v) => v.name === voice.name) ?? voice.voices[0] ?? null;
}

/** The default's name, for the picker's first option. */
export const defaultVoiceName = () => voice.voices[0]?.name ?? '';

/** @param {string} text */
export function utterance(text) {
	const u = new SpeechSynthesisUtterance(text);
	const v = currentVoice();
	if (v) {
		u.voice = v;
		u.lang = v.lang;
	}
	return u;
}
