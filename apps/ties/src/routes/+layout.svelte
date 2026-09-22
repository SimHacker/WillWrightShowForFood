<script>
	import { onMount } from 'svelte';
	import { bootUser } from '$lib/prefs.svelte.js';

	let { children } = $props();

	onMount(() => {
		bootUser();
		const blur = () => {
			const el = document.activeElement;
			if (!el || el === document.body || typeof el.blur !== 'function') return;
			const tag = el.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) return;
			el.blur();
		};
		document.addEventListener('mouseup', blur, true);
		return () => document.removeEventListener('mouseup', blur, true);
	});
</script>

<div class="shell">
	{@render children()}
</div>

<style>
	:global(:root) {
		--paper: #ffffff;
		--ink: #000000;
		--hot: #000000;
		--flash: #00f0d8;
		--panel: #ffffff;
		color-scheme: light;
	}
	:global(html),
	:global(body) {
		height: 100%;
		margin: 0;
	}
	:global(body) {
		background: var(--paper);
		color: var(--ink);
		font-family: ui-sans-serif, system-ui, sans-serif;
	}
	:global(a) {
		color: inherit;
	}
	:global(*:focus),
	:global(*:focus-visible) {
		outline: none;
		box-shadow: none;
	}
	:global(button::-moz-focus-inner) {
		border: 0;
	}
	:global(html) {
		-webkit-tap-highlight-color: transparent;
	}
	:global(button:disabled) {
		color: #888;
		-webkit-text-fill-color: currentColor;
		opacity: 1;
	}
	@keyframes armed-blink {
		0%,
		49% {
			color: #00f;
			-webkit-text-fill-color: #00f;
			border-bottom-color: #00f;
		}
		50%,
		100% {
			color: inherit;
			-webkit-text-fill-color: currentColor;
			border-bottom-color: currentColor;
		}
	}
	:global(html[data-blink-armed='true'] .armed:not(:hover)),
	:global(html[data-blink-armed='true'] .hint.on) {
		animation: armed-blink 0.55s step-end infinite;
	}
	.shell {
		height: 100%;
		margin: 0;
		padding: 0;
		max-width: none;
	}
</style>
