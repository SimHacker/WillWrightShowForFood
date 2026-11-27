<script>
	/**
	 * What web-panel.svelte.js has open, under the toolbar: a bar with its title, the opener's
	 * buttons, a link out and a close box, over the video or page. It also catches plain clicks
	 * on YouTube links and on links marked `data-view` anywhere on the page, and opens them here;
	 * a click with a modifier key, or the middle button, still opens a new tab.
	 */
	import { closeWeb, openWeb, webPanel, youtube } from './web-panel.svelte.js';

	/** The opener's buttons already pressed, and the view they were pressed in. */
	let pressed = $state.raw({ view: /** @type {import('./web-panel.svelte.js').WebView | null} */ (null), labels: /** @type {string[]} */ ([]) });

	/** @param {MouseEvent} e */
	function caught(e) {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		const a = /** @type {Element | null} */ (e.target)?.closest?.('a[href]');
		if (!(a instanceof HTMLAnchorElement)) return;
		if (!youtube(a.href) && !a.hasAttribute('data-view')) return;
		e.preventDefault();
		openWeb(a.href, { title: a.title.split('. Opens ')[0] || a.textContent?.trim() || a.href });
	}
</script>

<svelte:document onclick={caught} />

{#if webPanel.view}
	{@const v = webPanel.view}
	<div class="web" role="region" aria-label={v.title}>
		<div class="bar">
			<span class="title">{v.title}</span>
			{#each v.buttons as b (b.label)}
				{@const done = pressed.view === v && pressed.labels.includes(b.label)}
				<button
					type="button"
					class="mine"
					title={b.title}
					disabled={done && !!b.done}
					onclick={() => {
						b.action();
						pressed = { view: v, labels: [...(pressed.view === v ? pressed.labels : []), b.label] };
					}}>{done && b.done ? b.done : b.label}</button
				>
			{/each}
			<a href={v.url} target="_blank" rel="noopener noreferrer" title="Open {v.url} in a new tab">{v.kind === 'youtube' ? 'YouTube' : 'New tab'} ↗</a>
			<button type="button" title="Close" onclick={closeWeb}>✕</button>
		</div>
		{#if v.kind === 'youtube'}
			<iframe class="video" src={v.src} title={v.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
		{:else}
			<iframe class="page" src={v.src} title={v.title} sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
			<p class="note">A site that forbids being shown inside another page stays blank here; New tab ↗ opens it.</p>
		{/if}
	</div>
{/if}

<style>
	.web {
		margin: 0.4em 0;
		border: 1px solid #555;
		border-radius: 6px;
		overflow: hidden;
		background: #000;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.6em;
		padding: 0.25em 0.5em;
		font: 0.9em system-ui, sans-serif;
	}
	.title {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mine {
		font-weight: 600;
	}
	iframe {
		display: block;
		width: 100%;
		border: 0;
	}
	.video {
		aspect-ratio: 16 / 9;
	}
	.page {
		height: 70vh;
		background: #fff;
	}
	.note {
		margin: 0;
		padding: 0.25em 0.5em;
		font: 0.8em system-ui, sans-serif;
		opacity: 0.7;
	}
</style>
