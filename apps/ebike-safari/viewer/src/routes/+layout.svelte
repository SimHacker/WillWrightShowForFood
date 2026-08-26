<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setAuthContext } from '$lib/auth-context';
	import DebugPanel from '$lib/components/DebugPanel.svelte';
	import { installDebugTrap } from '$lib/debug-trap';
	import { setSettingsContext } from '$lib/settings-context';
	import { createSettingsStore } from '$lib/settings-store.svelte';
	import type { AuthUser } from '$lib/types/auth';
	import { onMount } from 'svelte';

	if (typeof window !== 'undefined') installDebugTrap();

	let { children } = $props();

	let user = $state<AuthUser | null>(null);
	let authAvailable = $state(false);
	const settingsStore = createSettingsStore();
	setSettingsContext(settingsStore);

	setAuthContext({
		get user() {
			return user;
		},
		get authAvailable() {
			return authAvailable;
		},
		get settings() {
			return settingsStore.current;
		},
		onUserChange: (u) => {
			user = u;
		},
		onSettingsChange: (partial) => settingsStore.update(partial)
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/auth/session');
			if (!res.ok) return;
			const data = (await res.json()) as {
				user: AuthUser | null;
				authAvailable: boolean;
			};
			user = data.user;
			authAvailable = data.authAvailable;
		} catch {
			/* map works without auth */
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
</svelte:head>

{@render children()}
<DebugPanel />

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: hidden;
		font-family: system-ui, sans-serif;
	}
</style>
