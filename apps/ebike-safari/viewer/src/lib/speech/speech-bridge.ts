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

/** Speak and resolve when the utterance finishes (rejects on error). */
export async function speakAndWait(text: string, options: SpeakOptions = {}): Promise<void> {
	const sys = await getSpeech();
	const common = {
		rate: options.rate ?? 1,
		pitch: options.pitch ?? 1,
		volume: options.volume ?? 1
	};

	return new Promise((resolve, reject) => {
		const callbacks = {
			onEnd: () => resolve(),
			onError: (e: SpeechSynthesisErrorEvent) => reject(new Error(e.error ?? 'speech error'))
		};

		const exact = options.voiceURI ? findVoiceByURI(options.voiceURI) : null;
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

export { SpeechSystem, SpeechRecognitionSystem };
