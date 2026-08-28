export type VoiceType = 'robot' | 'male' | 'female' | 'child' | 'elderly' | 'effect' | 'any';

/** Classified voice entry from the MOOLLM voice database. */
export type VoiceInfo = {
	name: string;
	lang: string;
	voiceURI: string;
	localService: boolean;
	type: string; // 'human' | 'robot' | 'effect'
	gender: string; // 'male' | 'female' | 'neutral' | 'unknown'
	age: string; // 'child' | 'adult' | 'elderly' | 'unknown'
	quality: string; // 'natural' | 'synthetic' | 'effect'
};

export type SpeechFeedbackSettings = {
	/** ms after TTS ends before starting recognition */
	postSpeakDelayMs: number;
	/** ms to wait for recognition before giving up */
	listenTimeoutMs: number;
	/** max automatic loop passes (0 = unlimited until stop) */
	maxPasses: number;
	voiceType: VoiceType;
	/** exact voice override (SpeechSynthesisVoice.voiceURI); null = pick by voiceType */
	voiceURI: string | null;
	rate: number;
	pitch: number;
	volume: number;
};

export type LoopPass = {
	pass: number;
	spoken: string;
	heard: string;
	startedAt: number;
	endedAt: number;
};

export const DEFAULT_FEEDBACK_SETTINGS: SpeechFeedbackSettings = {
	postSpeakDelayMs: 400,
	listenTimeoutMs: 12000,
	maxPasses: 8,
	voiceType: 'robot',
	voiceURI: null,
	rate: 0.95,
	pitch: 0.9,
	volume: 1
};
