<script>
	/**
	 * ```yaml youtube
	 * id: jDrqR9XssJI
	 * title: Flight of the PIXIE
	 * caption: optional line under the player
	 * ```
	 */
	let { spec } = $props();

	const id = $derived(String(spec.id ?? '').match(/^[A-Za-z0-9_-]{11}$/)?.[0] ?? null);
	const title = $derived(spec.title ?? 'YouTube video');
	const src = $derived(id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null);
	const watch = $derived(id ? `https://www.youtube.com/watch?v=${id}` : null);
</script>

<figure class="youtube" data-applet="youtube">
	{#if src}
		<div class="frame">
			<iframe
				{src}
				{title}
				loading="lazy"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		</div>
		<figcaption>
			<span>{spec.caption ?? title}</span>
			<a href={watch} target="_blank" rel="noopener">YouTube</a>
		</figcaption>
	{:else}
		<p class="absent">youtube: no valid id</p>
	{/if}
</figure>

<style>
	.youtube {
		margin: 0.8rem 0;
		border: 1px solid var(--ink, #000);
		max-width: 640px;
	}
	.frame {
		position: relative;
		aspect-ratio: 16 / 9;
		background: #000;
	}
	iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	figcaption {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.35rem 0.5rem;
		font-size: 0.75rem;
		border-top: 1px solid var(--ink, #000);
	}
</style>
