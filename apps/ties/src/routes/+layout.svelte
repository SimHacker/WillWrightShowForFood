<script>
	let { children } = $props();
</script>

<div class="shell">
	{@render children()}
</div>

<style>
	:global(:root) {
		--paper: #ffffff;
		--ink: #000000;
		--hot: #000000;
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
	.shell {
		height: 100%;
		margin: 0;
		padding: 0;
		max-width: none;
	}
</style>
