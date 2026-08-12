<script lang="ts">
	import type { AuthUser } from '$lib/types/auth';

	interface Props {
		user: AuthUser | null;
		authAvailable: boolean;
		onUserChange: (user: AuthUser | null) => void;
	}

	let { user, authAvailable, onUserChange }: Props = $props();

	let menuOpen = $state(false);
	let loginOpen = $state(false);
	let username = $state('');
	let password = $state('');
	let busy = $state(false);
	let loginError = $state<string | null>(null);

	let rootEl = $state<HTMLDivElement | null>(null);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function openLogin() {
		loginOpen = true;
		loginError = null;
		menuOpen = false;
	}

	function closeLogin() {
		loginOpen = false;
		username = '';
		password = '';
		loginError = null;
	}

	async function submitLogin(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		loginError = null;
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				loginError = (data as { message?: string }).message ?? 'Login failed';
				return;
			}
			onUserChange((data as { user: AuthUser }).user);
			closeLogin();
		} catch {
			loginError = 'Network error';
		} finally {
			busy = false;
		}
	}

	async function logout() {
		menuOpen = false;
		await fetch('/api/auth/logout', { method: 'POST' });
		onUserChange(null);
	}

	function onWindowClick(event: MouseEvent) {
		if (!menuOpen || !rootEl) return;
		if (!rootEl.contains(event.target as Node)) {
			menuOpen = false;
		}
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			menuOpen = false;
			if (loginOpen) closeLogin();
		}
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

<div class="auth" bind:this={rootEl}>
	{#if user}
		<button type="button" class="user-btn" onclick={toggleMenu} aria-expanded={menuOpen}>
			{user.displayName}
		</button>
		{#if menuOpen}
			<div class="menu" role="menu">
				<button type="button" role="menuitem" onclick={logout}>Log out</button>
			</div>
		{/if}
	{:else if authAvailable}
		<button type="button" class="login-btn" onclick={openLogin}>Log in</button>
	{/if}
</div>

{#if loginOpen}
	<div class="backdrop" onclick={closeLogin} role="presentation"></div>
	<div class="dialog" role="dialog" aria-labelledby="login-title">
		<h2 id="login-title">Log in</h2>
		<form onsubmit={submitLogin}>
			<label>
				Username
				<input type="text" autocomplete="username" bind:value={username} required />
			</label>
			<label>
				Password
				<input type="password" autocomplete="current-password" bind:value={password} required />
			</label>
			{#if loginError}
				<p class="err">{loginError}</p>
			{/if}
			<div class="actions">
				<button type="button" class="secondary" onclick={closeLogin}>Cancel</button>
				<button type="submit" disabled={busy}>{busy ? '…' : 'Log in'}</button>
			</div>
		</form>
	</div>
{/if}

<style>
	.auth {
		position: fixed;
		top: 0.55rem;
		right: 0.65rem;
		z-index: 20;
		font-size: 0.8rem;
	}

	.login-btn,
	.user-btn {
		padding: 0.3rem 0.65rem;
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: 6px;
		background: rgba(22, 33, 62, 0.82);
		color: rgba(248, 249, 250, 0.92);
		font: inherit;
		cursor: pointer;
		backdrop-filter: blur(6px);
	}

	.login-btn:hover,
	.user-btn:hover {
		background: rgba(22, 33, 62, 0.95);
		border-color: rgba(255, 255, 255, 0.35);
	}

	.menu {
		position: absolute;
		top: calc(100% + 0.35rem);
		right: 0;
		min-width: 7rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 8px;
		background: rgba(22, 33, 62, 0.96);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
		overflow: hidden;
	}

	.menu button {
		display: block;
		width: 100%;
		padding: 0.55rem 0.85rem;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.menu button:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 30;
		background: rgba(0, 0, 0, 0.45);
	}

	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 31;
		width: min(18rem, calc(100vw - 2rem));
		padding: 1rem 1.1rem;
		border-radius: 10px;
		background: #16213e;
		color: #f8f9fa;
		transform: translate(-50%, -50%);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
	}

	.dialog h2 {
		margin: 0 0 0.85rem;
		font-size: 1rem;
		font-weight: 600;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.78rem;
		opacity: 0.9;
	}

	input {
		padding: 0.45rem 0.55rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		background: #1a1a2e;
		color: inherit;
		font: inherit;
	}

	.err {
		margin: 0;
		font-size: 0.78rem;
		color: #ffb4a2;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.actions button {
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: 6px;
		background: #e85d04;
		color: #fff;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.actions button.secondary {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.25);
		color: inherit;
		font-weight: 500;
	}

	.actions button:disabled {
		opacity: 0.6;
		cursor: wait;
	}
</style>
