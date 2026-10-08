<script>
	/**
	 * ```yaml page
	 * src: ftp/                 # a page served by this site (static/), or an https URL
	 * title: FTP.127 — Food Transfer Protocol
	 * height: fill              # CSS pixels, or fill: as tall as the reader's pane; always full width
	 * caption: optional line under the frame
	 * ```
	 */
	import { base } from '$app/paths';

	let { spec } = $props();

	const raw = $derived(String(spec.src ?? ''));
	// Same-site paths resolve against the app root, so they work under any deployment prefix.
	const src = $derived(/^https:\/\//.test(raw) ? raw : raw && !raw.includes('..') ? `${base}/${raw.replace(/^\/+/, '')}` : null);
	const title = $derived(spec.title ?? 'Embedded page');
	const fill = $derived(spec.height === 'fill');
	const height = $derived(fill ? null : `${Math.max(200, Math.min(2000, Number(spec.height) || 600))}px`);
</script>

<figure class="page-embed" class:fill data-applet="page">
	{#if src}
		<iframe {src} {title} style:height={height} loading="lazy" allow="clipboard-write"></iframe>
		<figcaption>
			<span>{spec.caption ?? title}</span>
			<a href={src} target="_blank" rel="noopener">Full page ↗</a>
		</figcaption>
	{:else}
		<p class="absent">page: no src</p>
	{/if}
</figure>

<style>
	.page-embed {
		margin: 0.8rem 0;
		width: 100%;
		border: 1px solid var(--ink, #000);
		background: #000;
	}
	iframe {
		display: block;
		width: 100%;
		border: 0;
	}
	/* The reader scrolls the article in a fixed pane; fill that pane less the caption. */
	.fill iframe {
		height: calc(100cqh - 2.5rem);
		min-height: 420px;
	}
	figcaption {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.35rem 0.5rem;
		background: var(--paper, #fff);
		color: var(--ink, #000);
	}
	.absent {
		padding: 0.5rem;
		color: #c00;
		background: var(--paper, #fff);
	}
</style>
