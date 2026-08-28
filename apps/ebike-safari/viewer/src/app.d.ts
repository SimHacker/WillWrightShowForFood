declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionUser | null;
		}
	}

	interface Window {
		SpeechRecognition?: unknown;
		webkitSpeechRecognition?: unknown;
	}
}

export {};
