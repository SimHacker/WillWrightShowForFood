/**
 * The Machine Room's speaking voice, one for the whole site: the teletype's read-aloud and the screen
 * angel. The choice is kept in localStorage; empty means the best voice this browser has from a
 * list of clear, natural female English voices, best first. Your voice, for what you type while
 * an Apple reads aloud, is kept the same way, and so are the volume, speed and pitch every
 * voice speaks at.
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

/**
 * Your voice, for what you type when a machine reads aloud: a different voice from the
 * Machine Room's, best first, so the two sound like two people.
 */
const YOURS = [
	...['Daniel', 'Alex', 'Tom', 'Aaron', 'Arthur', 'Oliver', 'Evan', 'Nathan', 'Lee', 'Rishi'].map((n) => new RegExp(`^${n} \\((Premium|Enhanced)\\)`)),
	...['Andrew', 'Guy', 'Brian', 'Ryan', 'Christopher', 'Eric'].map((n) => new RegExp(`^Microsoft ${n} Online \\(Natural\\)`)),
	/^Google UK English Male$/,
	...['Daniel', 'Alex', 'Tom', 'Aaron', 'Arthur', 'Oliver', 'Evan', 'Nathan', 'Lee', 'Rishi'].map((n) => new RegExp(`^${n}\\b`)),
	/^Microsoft (David|Mark|George)\b/,
];
const YOURS_KEY = 'cabinet-voice-you';

/** The volume, speed and pitch every utterance takes: SpeechSynthesisUtterance's own ranges, trimmed. */
export const TONE = {
	volume: { label: 'Volume', min: 0, max: 1, step: 0.05, normal: 1, key: 'cabinet-voice-volume' },
	rate: { label: 'Speed', min: 0.5, max: 3, step: 0.05, normal: 1, key: 'cabinet-voice-rate' },
	pitch: { label: 'Pitch', min: 0, max: 2, step: 0.05, normal: 1, key: 'cabinet-voice-pitch' }
};
/** @typedef {keyof typeof TONE} ToneName */

export const voice = $state({
	/** The chosen voice's name; empty for the default. */
	name: '',
	/** Your voice's name; empty for the default. */
	you: '',
	/** English voices, best first. @type {SpeechSynthesisVoice[]} */
	voices: [],
	volume: TONE.volume.normal,
	rate: TONE.rate.normal,
	pitch: TONE.pitch.normal,
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
	voice.you = localStorage.getItem(YOURS_KEY) ?? '';
	for (const [k, t] of Object.entries(TONE)) {
		const n = Number(localStorage.getItem(t.key) ?? NaN);
		voice[/** @type {ToneName} */ (k)] = Number.isFinite(n) ? Math.min(t.max, Math.max(t.min, n)) : t.normal;
	}
	refresh();
	speechSynthesis.addEventListener('voiceschanged', refresh);
}

/** Set the volume, speed or pitch every voice speaks at. @param {ToneName} k @param {number} v */
export function setTone(k, v) {
	const t = TONE[k];
	voice[k] = Math.min(t.max, Math.max(t.min, v));
	if (voice[k] === t.normal) localStorage.removeItem(t.key);
	else localStorage.setItem(t.key, String(voice[k]));
}

/** The volume, speed and pitch, as speech options. */
export function tone() {
	startVoices();
	return { volume: voice.volume, rate: voice.rate, pitch: voice.pitch };
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

/** Your default's name, for your picker's first option. */
export const defaultYourVoiceName = () => defaultYourVoice()?.name ?? '';

/** @param {string} name your voice's name, or empty for the default */
export function chooseYourVoice(name) {
	voice.you = name;
	if (name) localStorage.setItem(YOURS_KEY, name);
	else localStorage.removeItem(YOURS_KEY);
}

/** Your voice's default: the best of YOURS that is not the Machine Room's, else any other. */
export function defaultYourVoice() {
	startVoices();
	const room = currentVoice()?.name;
	const others = voice.voices.filter((v) => v.name !== room);
	const at = (/** @type {SpeechSynthesisVoice} */ v) => {
		const i = YOURS.findIndex((p) => p.test(v.name));
		return i < 0 ? YOURS.length : i;
	};
	return [...others].sort((a, b) => at(a) - at(b))[0] ?? currentVoice();
}

/** Your voice now: the chosen one if this browser has it, else the default. */
export function yourVoice() {
	startVoices();
	return voice.voices.find((v) => v.name === voice.you) ?? defaultYourVoice();
}

/** @param {string} text @param {SpeechSynthesisVoice | null} [v] */
export function utterance(text, v = currentVoice()) {
	const u = new SpeechSynthesisUtterance(text);
	if (v) {
		u.voice = v;
		u.lang = v.lang;
	}
	Object.assign(u, tone());
	return u;
}

/** @param {string} text */
export const yourUtterance = (text) => utterance(text, yourVoice());
