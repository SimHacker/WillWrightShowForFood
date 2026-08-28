export class SpeechRecognitionSystem {
	constructor(options?: { language?: string; [key: string]: unknown });
	listen(): Promise<string>;
	manager: RecognitionManager;
}

export class RecognitionManager {
	constructor(options?: Record<string, unknown>);
	start(): void;
	stop(): void;
	abort(): void;
	setLanguage(lang: string): void;
}

export const RecognitionPlatform: Record<string, unknown>;
export const RecognitionEvents: Record<string, unknown>;
