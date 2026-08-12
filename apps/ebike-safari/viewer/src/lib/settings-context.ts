import { getContext, setContext } from 'svelte';
import type { SettingsStore } from '$lib/settings-store.svelte';

export const SETTINGS_CTX = Symbol('ebike-settings');

export function setSettingsContext(store: SettingsStore) {
	setContext(SETTINGS_CTX, store);
}

export function getSettingsContext(): SettingsStore {
	return getContext<SettingsStore>(SETTINGS_CTX);
}
