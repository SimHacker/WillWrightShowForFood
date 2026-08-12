import { getContext, setContext } from 'svelte';
import type { SettingsStore } from '$lib/settings-store.svelte';
import type { AuthUser } from '$lib/types/auth';
import type { AppSettings } from '$lib/types/settings';

export type AuthContext = {
	user: AuthUser | null;
	authAvailable: boolean;
	settings: AppSettings;
	onUserChange: (user: AuthUser | null) => void;
	onSettingsChange: (partial: Partial<AppSettings>) => void;
};

export const AUTH_CTX = Symbol('ebike-auth');

export function setAuthContext(ctx: AuthContext) {
	setContext(AUTH_CTX, ctx);
}

export function getAuthContext(): AuthContext {
	return getContext<AuthContext>(AUTH_CTX);
}
