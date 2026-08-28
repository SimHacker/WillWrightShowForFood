type RecogEventData = Record<string, unknown>;
type Unsubscribe = () => void;

export class SpeechRecognitionSystem {
	constructor(options?: { language?: string; [key: string]: unknown });
	listen(): Promise<string>;
	startListening(): boolean;
	stopListening(): void;
	on(event: string, callback: (e: RecogEventData) => void): Unsubscribe;
	off(event: string, callback: (e: RecogEventData) => void): void;
	manager: RecognitionManager;
}

export class RecognitionManager {
	constructor(options?: Record<string, unknown>);
	start(): void;
	stop(): void;
	abort(): void;
	setLanguage(lang: string): void;
	on(event: string, callback: (e: RecogEventData) => void): Unsubscribe;
	off(event: string, callback: (e: RecogEventData) => void): void;
	readonly listening: boolean;
	readonly supported: boolean;
}

export const RecognitionPlatform: Record<string, unknown>;
export const RecognitionEvents: Record<string, unknown>;
