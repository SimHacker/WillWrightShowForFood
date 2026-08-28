/**
 * TypeScript facade over the MOOLLM speech + recognition modules
 * (vendored from moollm/skills/adventure/dist — ours now, fork freely).
 */
import { SpeechSystem } from './vendor/speech.js';
import { SpeechRecognitionSystem } from './vendor/recognition.js';
import type { VoiceInfo, VoiceType } from './types';

export type SpeakOptions = {
	voiceType?: VoiceType;
	/** Exact voice by voiceURI — wins over voiceType when set. */
	voiceURI?: string | null;
	/**
	 * Stable key (a speaker's name) used to pick one voice out of the voiceType
	 * category and keep picking that same one. Without it the vendored library
	 * re-rolls a random matching voice per utterance.
	 */
	seed?: string | null;
	rate?: number;
	pitch?: number;
	volume?: number;
	language?: string;
};

let speech: InstanceType<typeof SpeechSystem> | null = null;
let recognition: InstanceType<typeof SpeechRecognitionSystem> | null = null;

export function speechSupported(): boolean {
	return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function recognitionSupported(): boolean {
	if (typeof window === 'undefined') return false;
	return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export async function getSpeech(): Promise<InstanceType<typeof SpeechSystem>> {
	if (!speechSupported()) throw new Error('Speech synthesis not available in this browser');
	if (!speech) {
		speech = new SpeechSystem();
		await speech.ready;
	}
	return speech;
}

export async function getRecognition(): Promise<InstanceType<typeof SpeechRecognitionSystem>> {
	if (!recognitionSupported()) {
		throw new Error('Web Speech recognition not available (try Chrome; Firefox needs about:config flag)');
	}
	if (!recognition) {
		recognition = new SpeechRecognitionSystem({ language: 'en-US' });
	}
	return recognition;
}

/** All available voices, classified by the MOOLLM voice database. */
export async function listVoices(): Promise<VoiceInfo[]> {
	const sys = await getSpeech();
	const matches = sys.findVoices({});
	return matches.map(
		(m: {
			voice: SpeechSynthesisVoice;
			type: string;
			gender: string;
			age: string;
			quality: string;
		}) => ({
			name: m.voice.name,
			lang: m.voice.lang,
			voiceURI: m.voice.voiceURI,
			localService: m.voice.localService !== false,
			type: m.type ?? 'unknown',
			gender: m.gender ?? 'unknown',
			age: m.age ?? 'unknown',
			quality: m.quality ?? 'unknown'
		})
	);
}

function findVoiceByURI(voiceURI: string): SpeechSynthesisVoice | null {
	const voices = window.speechSynthesis.getVoices();
	return voices.find((v) => v.voiceURI === voiceURI) ?? null;
}

export function findVoiceByName(name: string): SpeechSynthesisVoice | null {
	const voices = window.speechSynthesis.getVoices();
	return voices.find((v) => v.name === name) ?? null;
}

/**
 * Every voice the browser offers, unfiltered and unclassified — no categories,
 * no blacklist. Sorted by language then name so the picker reads sensibly.
 */
export async function listAllVoices(): Promise<VoiceInfo[]> {
	await getSpeech(); // its ready promise waits for the async voice list
	return window.speechSynthesis
		.getVoices()
		.map((v) => ({
			name: v.name,
			lang: v.lang,
			voiceURI: v.voiceURI,
			localService: v.localService !== false,
			type: 'unknown',
			gender: 'unknown',
			age: 'unknown',
			quality: v.localService === false ? 'network' : 'local'
		}))
		.sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
}

/**
 * Preferred male voices, best first.
 *
 * The vendored voice database has no quality ranking to consult: it infers
 * gender from a list of first names and hardcodes `quality: 'natural'` for
 * everything that isn't a named sound effect. So this list is explicit.
 *
 * No single voice exists on every platform, so this walks per-platform bests
 * and falls back to classification. Apple ships "(Enhanced)" / "(Premium)"
 * variants only once downloaded, hence the preferEnhanced pass.
 */
const MALE_VOICE_PREFERENCES: { match: RegExp; note: string }[] = [
	{ match: /^Alex\b/i, note: 'macOS, best-quality Apple male' },
	{ match: /^Aaron\b/i, note: 'iOS/macOS default en-US male' },
	{ match: /^Daniel\b.*\b(en|English)/i, note: 'Apple en-GB, on both macOS and iOS' },
	{ match: /^Google UK English Male$/i, note: 'any desktop Chrome, and Android' },
	{ match: /^Microsoft (David|Mark|Guy)\b/i, note: 'Windows en-US male' },
	{ match: /^Microsoft George\b/i, note: 'Windows en-GB male' },
	{ match: /^(Rishi|Oliver|Tom|Fred|Ralph)\b/i, note: 'further Apple males' }
];

/** First preferred male voice actually present, or null. */
export async function pickDefaultMaleVoice(): Promise<SpeechSynthesisVoice | null> {
	await getSpeech();
	const all = window.speechSynthesis.getVoices();
	if (all.length === 0) return null;

	const enhancedFirst = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) => {
		const rank = (v: SpeechSynthesisVoice) =>
			/\((Enhanced|Premium)\)/i.test(v.name) ? 0 : 1;
		return rank(a) - rank(b) || a.name.localeCompare(b.name);
	};

	for (const { match } of MALE_VOICE_PREFERENCES) {
		const hits = all.filter((v) => match.test(v.name)).sort(enhancedFirst);
		if (hits.length > 0) return hits[0];
	}

	// Nothing named matched — fall back to whatever the database calls male,
	// in English, preferring local (offline, lower latency) voices.
	try {
		const sys = await getSpeech();
		const males = (
			sys.findVoices({ gender: 'male', type: 'human', language: 'en' }) as {
				voice: SpeechSynthesisVoice;
			}[]
		).map((m) => m.voice);
		const local = males.filter((v) => v.localService !== false);
		const pool = local.length > 0 ? local : males;
		if (pool.length > 0) return [...pool].sort(enhancedFirst)[0];
	} catch {
		// classification unavailable; fall through
	}

	return all.find((v) => v.lang.startsWith('en')) ?? all[0];
}

/** Criteria the vendored voice database understands, per voiceType. */
function criteriaFor(voiceType: VoiceType): Record<string, string> | null {
	switch (voiceType) {
		case 'male':
			return { gender: 'male', type: 'human' };
		case 'female':
			return { gender: 'female', type: 'human' };
		case 'child':
			return { age: 'child', type: 'human' };
		case 'elderly':
			return { age: 'elderly', type: 'human' };
		case 'robot':
			return { type: 'robot' };
		case 'effect':
			return { type: 'effect' };
		default:
			return null;
	}
}

function hash(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

/**
 * One voice out of a category, chosen by seed and stable across utterances.
 * Sorted by voiceURI so the same seed lands on the same voice every time on a
 * given device. Voice lists differ per device, so two devices may disagree on
 * which voice a name maps to — but each stays internally consistent.
 */
export async function resolveVoice(
	voiceType: VoiceType,
	seed: string
): Promise<SpeechSynthesisVoice | null> {
	const criteria = criteriaFor(voiceType);
	const all = window.speechSynthesis.getVoices();
	if (all.length === 0) return null;

	let candidates: SpeechSynthesisVoice[];
	if (!criteria) {
		candidates = [...all];
	} else {
		const sys = await getSpeech();
		const matches = sys.findVoices(criteria) as { voice: SpeechSynthesisVoice }[];
		candidates = matches.map((m) => m.voice);
		if (candidates.length === 0) candidates = [...all];
	}

	candidates.sort((a, b) => a.voiceURI.localeCompare(b.voiceURI));
	return candidates[hash(seed) % candidates.length] ?? null;
}

/** Speak and resolve when the utterance finishes (rejects on error). */
export async function speakAndWait(text: string, options: SpeakOptions = {}): Promise<void> {
	const sys = await getSpeech();
	const common = {
		rate: options.rate ?? 1,
		pitch: options.pitch ?? 1,
		volume: options.volume ?? 1
	};

	// Pin the category to one voice, so a given speaker sounds the same twice.
	const alreadyExact = options.voiceURI ? findVoiceByURI(options.voiceURI) : null;
	const resolvedBySeed =
		!alreadyExact && options.seed
			? await resolveVoice(options.voiceType ?? 'any', options.seed)
			: null;

	return new Promise((resolve, reject) => {
		const callbacks = {
			onEnd: () => resolve(),
			onError: (e: SpeechSynthesisErrorEvent) => reject(new Error(e.error ?? 'speech error'))
		};

		const exact =
			(options.voiceURI ? findVoiceByURI(options.voiceURI) : null) ?? resolvedBySeed;
		let utterance: SpeechSynthesisUtterance | null;
		if (exact) {
			// speakWithVoice doesn't manage the queue — clear it ourselves.
			window.speechSynthesis.cancel();
			utterance = sys.speakWithVoice(text, exact, { ...common, ...callbacks });
		} else {
			utterance = sys.speak(text, {
				voiceType: options.voiceType ?? 'any',
				language: options.language ?? 'en-US',
				queue: false,
				...common,
				...callbacks
			});
		}
		if (!utterance) reject(new Error('speak() returned null'));
	});
}

export function cancelSpeech(): void {
	if (typeof window !== 'undefined') window.speechSynthesis.cancel();
}

/**
 * Single-shot listen — resolves with best transcript, or '' on timeout.
 * Rejects on real recognition errors (mic denied, no network, aborted),
 * so callers can tell a quiet room from a broken pipeline.
 */
export async function listenOnce(timeoutMs: number): Promise<string> {
	const rec = await getRecognition();
	return Promise.race([
		rec.listen(),
		new Promise<string>((resolve) => window.setTimeout(() => resolve(''), timeoutMs))
	]);
}

/**
 * What the recognizer is doing right now. The Web Speech API reports more than
 * "listening": audio capture opening, sound arriving, sound classified as
 * speech, then interim and final transcripts.
 */
export type RecogPhase =
	| 'idle'
	| 'starting'
	| 'listening'
	| 'sound'
	| 'speech'
	| 'recognizing'
	| 'error';

export type RecogWatcher = {
	onPhase?: (phase: RecogPhase, detail?: string) => void;
	onInterim?: (text: string) => void;
	onFinal?: (text: string, confidence: number) => void;
	onError?: (message: string) => void;
};

/** Live feed of recognizer state. Returns an unsubscribe function. */
export async function watchRecognition(w: RecogWatcher): Promise<() => void> {
	const rec = await getRecognition();
	const offs: (() => void)[] = [];
	const sub = (event: string, cb: (e: Record<string, unknown>) => void) => {
		offs.push(rec.on(event, cb) as () => void);
	};

	sub('start', () => w.onPhase?.('listening'));
	sub('audiostart', () => w.onPhase?.('listening', 'mic open'));
	sub('soundstart', () => w.onPhase?.('sound'));
	sub('speechstart', () => w.onPhase?.('speech'));
	sub('speechend', () => w.onPhase?.('recognizing'));
	sub('soundend', () => w.onPhase?.('recognizing'));
	sub('audioend', () => w.onPhase?.('recognizing', 'mic closed'));
	sub('end', () => w.onPhase?.('idle'));
	sub('nomatch', () => w.onPhase?.('idle', 'no match'));
	sub('interim', (e) => w.onInterim?.(String(e.transcript ?? '')));
	sub('result', (e) =>
		w.onFinal?.(String(e.transcript ?? ''), Number(e.confidence ?? 0))
	);
	sub('error', (e) => {
		w.onPhase?.('error', String(e.message ?? e.error ?? 'error'));
		w.onError?.(String(e.message ?? e.error ?? 'error'));
	});

	return () => offs.forEach((off) => off());
}

export { SpeechSystem, SpeechRecognitionSystem };
