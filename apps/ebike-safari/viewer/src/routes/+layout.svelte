<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import AuthMenu from '$lib/components/AuthMenu.svelte';
	import type { AuthUser } from '$lib/types/auth';
	import { onMount } from 'svelte';

	let { children } = $props();

	let user = $state<AuthUser | null>(null);
	let authAvailable = $state(false);

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

<AuthMenu {user} {authAvailable} onUserChange={(u) => (user = u)} />

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: hidden;
		font-family: system-ui, sans-serif;
	}
</style>
