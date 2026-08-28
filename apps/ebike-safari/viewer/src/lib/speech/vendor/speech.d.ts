export class SpeechSystem {
	constructor();
	ready: Promise<SpeechSystem>;
	speak(text: string, options?: Record<string, unknown>): SpeechSynthesisUtterance | null;
	speakWithVoice(
		text: string,
		voice: SpeechSynthesisVoice,
		options?: Record<string, unknown>
	): SpeechSynthesisUtterance | null;
	findVoices(criteria?: Record<string, unknown>): Array<{
		voice: SpeechSynthesisVoice;
		type: string;
		gender: string;
		age: string;
		quality: string;
		[key: string]: unknown;
	}>;
	selectVoice(criteria?: Record<string, unknown>): SpeechSynthesisVoice | null;
	cancel(): void;
	pause(): void;
	resume(): void;
	isSpeaking(): boolean;
}

export class SpeechManager {
	constructor(voiceDB: VoiceDatabase);
}

export class VoiceDatabase {
	constructor();
}
