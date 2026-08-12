import { DEFAULT_SETTINGS, type AppSettings } from '$lib/types/settings';

const STORAGE_KEY = 'ebike-safari-settings';

function load(): AppSettings {
	if (typeof localStorage === 'undefined') return { ...DEFAULT_SETTINGS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULT_SETTINGS };
		return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}

function persist(settings: AppSettings) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch {
		/* private mode / quota */
	}
}

export function createSettingsStore() {
	let settings = $state<AppSettings>(load());

	return {
		get current() {
			return settings;
		},
		update(partial: Partial<AppSettings>) {
			settings = { ...settings, ...partial };
			persist(settings);
		},
		reset() {
			settings = { ...DEFAULT_SETTINGS };
			persist(settings);
		}
	};
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;
