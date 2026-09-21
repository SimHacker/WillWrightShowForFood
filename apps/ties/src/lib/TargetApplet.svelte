<script>
	/**
	 * A target: an arbitrarily-shaped live region over a picture. Three names in three
	 * namespaces — the picture, the shape, the destination — which is the syntax of the
	 * original .st0 construct.
	 *
	 * Single click shows the destination's definition. Double click navigates. That is
	 * the 1988 interaction, and the rung the web dropped.
	 */
	import { resolve } from './corpus.js';

	let { db, spec, onpreview, onnavigate } = $props();

	let hovered = $state(null); // the shape name under the pointer

	const picture = $derived(spec.picture ? resolve(db, spec.picture) : null);

	/** A picture carries a list of shapes, each with its own destination. */
	const regions = $derived(
		(spec.shapes ?? []).map((s) => ({
			name: s.shape,
			geometry: resolve(db, s.shape),
			destination: s.to ? resolve(db, s.to) : null,
			to: s.to,
			command: s.command
		}))
	);

	const destination = $derived(spec.to ? resolve(db, spec.to) : null);

	function activate(region, event) {
		if (event.detail > 1) return; // the dblclick handler owns that
		if (region.destination) onpreview?.(region.destination);
	}
</script>

{#if spec.error}
	<pre class="target-error">{spec.error}</pre>
{:else if picture?.image || regions.length}
	<figure class="picture">
		<!-- The overlay is anchored to the IMAGE, not the figure: normalized 0..1 geometry
		     stretched over the caption too would shift every shape downward. -->
		<div class="canvas">
			{#if picture?.image}
				<img src={picture.image} alt={picture.name ?? spec.picture} />
			{/if}
			<!-- Keyed by position, not name: spacetel.st0 lists the HSP shape twice. -->
			{#each regions as region, i (i)}
			{#if region.geometry?.d}
				<!-- Normalized 0..1, stretched to the picture, which is why one geometry
				     served 450x337, 507x598 and 533x509 renderings in 1988. -->
				<svg
					class="shape"
					class:hot={hovered === region.name}
					viewBox="0 0 1 1"
					preserveAspectRatio="none"
					role="link"
					tabindex="0"
					aria-label={region.to ?? region.name}
					onmouseenter={() => (hovered = region.name)}
					onmouseleave={() => (hovered = null)}
					onfocus={() => (hovered = region.name)}
					onblur={() => (hovered = null)}
					onclick={(e) => activate(region, e)}
					ondblclick={() => region.destination && onnavigate?.(region.destination)}
					onkeydown={(e) =>
						e.key === 'Enter' && region.destination && onnavigate?.(region.destination)}
				>
					<path d={region.geometry.d} vector-effect="non-scaling-stroke" />
				</svg>
			{/if}
			{/each}
		</div>
		<figcaption>
			{spec.picture ?? ''}
			{#if regions.length}
				<span class="arrow">
					{regions.length} target{regions.length > 1 ? 's' : ''}:
					{regions.map((r) => r.to ?? r.name).join(', ')}
				</span>
			{/if}
		</figcaption>
	</figure>
{:else}
	<!-- A text button: geometry came from the text it wrapped, so the label is the text. -->
	<span class="button-target">
		{#if spec.command}
			<span class="verb" title="a browser command, not an article">{spec.label ?? spec.command}</span>
		{:else if destination}
			<button type="button" onclick={() => onnavigate?.(destination)}>
				{spec.label || spec.to}
			</button>
		{:else if spec.to}
			<span class="dangling" title="resolves nowhere in this database">{spec.label || spec.to}</span>
		{/if}
	</span>
{/if}

<style>
	.picture {
		margin: 1.5rem 0;
		max-width: 100%;
	}
	.canvas {
		position: relative;
		display: inline-block;
		line-height: 0;
		max-width: 100%;
	}
	.picture img {
		display: block;
		max-width: 100%;
		height: auto;
		image-rendering: pixelated;
	}
	.shape {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		/* Each overlay spans the whole picture, so they stack. Only the PATH may take
		   the pointer, or the topmost rectangle would swallow every click. The hit
		   region follows the drawn shape, which is what made these targets
		   arbitrarily-shaped rather than rectangular. */
		pointer-events: none;
	}
	.shape path {
		pointer-events: fill;
		cursor: pointer;
		fill: transparent;
		stroke: transparent;
		stroke-width: 2;
		transition: fill 120ms, stroke 120ms;
	}
	.shape.hot path,
	.shape:focus-visible path,
	.shape:hover path {
		fill: color-mix(in oklab, var(--hot, #c8102e) 30%, transparent);
		stroke: var(--hot, #c8102e);
	}
	figcaption {
		font-size: 0.8rem;
		opacity: 0.7;
		padding-top: 0.35rem;
	}
	.arrow {
		opacity: 0.6;
	}
	.button-target {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0.2rem 0.4rem 0.2rem 0;
		vertical-align: baseline;
	}
	.button-target button {
		font: inherit;
		cursor: pointer;
		border: 0;
		border-bottom: 1px solid #000;
		border-radius: 0;
		padding: 0;
		background: none;
		color: inherit;
	}
	.button-target button:hover {
		background: #000;
		color: #fff;
	}
	.verb {
		font-family: ui-monospace, monospace;
		font-size: 0.85rem;
		border-bottom: 1px dotted currentColor;
	}
	.dangling {
		text-decoration: underline wavy;
		opacity: 0.7;
	}
	.target-error {
		font-size: 0.8rem;
		border-left: 3px solid crimson;
		padding-left: 0.6rem;
	}
</style>
