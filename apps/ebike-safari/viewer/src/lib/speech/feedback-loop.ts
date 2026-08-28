import { DEFAULT_FEEDBACK_SETTINGS, type LoopPass, type SpeechFeedbackSettings } from './types';
import { cancelSpeech, listenOnce, speakAndWait } from './speech-bridge';

export type LoopEvent =
	| { type: 'pass'; pass: LoopPass }
	| { type: 'status'; message: string }
	| { type: 'error'; message: string }
	| { type: 'stopped' };

export type SpeechFeedbackLoopOptions = {
	settings?: Partial<SpeechFeedbackSettings>;
	onEvent?: (event: LoopEvent) => void;
};

/**
 * Browser speechback loop: TTS → pause → STT → re-speak heard text.
 * Acoustic feedback is intentional — the mic hears the speakers.
 */
export class SpeechFeedbackLoop {
	private settings: SpeechFeedbackSettings;
	private running = false;
	private pass = 0;
	private onEvent: (event: LoopEvent) => void;

	constructor(options: SpeechFeedbackLoopOptions = {}) {
		this.settings = { ...DEFAULT_FEEDBACK_SETTINGS, ...options.settings };
		this.onEvent = options.onEvent ?? (() => {});
	}

	updateSettings(partial: Partial<SpeechFeedbackSettings>): void {
		this.settings = { ...this.settings, ...partial };
	}

	stop(): void {
		this.running = false;
		cancelSpeech();
		this.onEvent({ type: 'stopped' });
	}

	isRunning(): boolean {
		return this.running;
	}

	async start(seedText: string): Promise<void> {
		if (this.running) return;
		this.running = true;
		this.pass = 0;
		let text = seedText.trim();
		if (!text) {
			this.onEvent({ type: 'error', message: 'Empty seed text' });
			this.running = false;
			return;
		}

		while (this.running) {
			if (this.settings.maxPasses > 0 && this.pass >= this.settings.maxPasses) {
				this.onEvent({ type: 'status', message: `Max passes (${this.settings.maxPasses}) reached` });
				break;
			}

			const startedAt = Date.now();
			this.onEvent({ type: 'status', message: `Pass ${this.pass + 1}: speaking…` });

			try {
				await speakAndWait(text, {
					voiceType: this.settings.voiceType,
					voiceURI: this.settings.voiceURI,
					rate: this.settings.rate,
					pitch: this.settings.pitch,
					volume: this.settings.volume
				});
			} catch (e) {
				this.onEvent({ type: 'error', message: e instanceof Error ? e.message : String(e) });
				break;
			}

			if (!this.running) break;

			if (this.settings.postSpeakDelayMs > 0) {
				await sleep(this.settings.postSpeakDelayMs);
			}
			if (!this.running) break;

			this.onEvent({ type: 'status', message: `Pass ${this.pass + 1}: listening…` });
			let heard = '';
			try {
				heard = (await listenOnce(this.settings.listenTimeoutMs)).trim();
			} catch (e) {
				this.onEvent({
					type: 'error',
					message: `Recognition: ${e instanceof Error ? e.message : String(e)}`
				});
				break;
			}
			const endedAt = Date.now();

			this.onEvent({
				type: 'pass',
				pass: { pass: this.pass + 1, spoken: text, heard, startedAt, endedAt }
			});

			this.pass += 1;
			if (!heard) {
				this.onEvent({ type: 'status', message: 'No speech heard — loop paused' });
				break;
			}
			text = heard;
		}

		this.running = false;
		this.onEvent({ type: 'stopped' });
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((r) => window.setTimeout(r, ms));
}
