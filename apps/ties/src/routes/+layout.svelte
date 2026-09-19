<script>
	let { children } = $props();
</script>

<div class="shell">
	{@render children()}
</div>

<style>
	:global(:root) {
		/* Plain white, because that is what HyperTIES was, and because the artwork is
		   1-bit line art on a white field: on white the images have no visible edge. */
		--paper: #ffffff;
		--ink: #000000;
		--hot: #c8102e;
		--panel: #ffffff;
		color-scheme: light;
	}
	:global(body) {
		margin: 0;
		background: var(--paper);
		color: var(--ink);
		font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
	}
	:global(a) {
		color: var(--hot);
	}
	.shell {
		max-width: 62rem;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 6rem;
	}
</style>
