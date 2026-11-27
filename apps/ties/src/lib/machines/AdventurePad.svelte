<script>
	/**
	 * A text adventure's buttons, from the screen angel's game: a compass rose of the directions
	 * the game's parser knows, its middle word (LOOK) inside, up, down, in and out beside it, and
	 * the game's words in groups. A button types its word and Return; a word the game asks more
	 * about types the word and a space, and the keyboard goes back to the Apple to finish it.
	 */
	import { COMPASS, commandKeys, commandSpec } from '@wwsff/cabinet/angel';
	import { apple } from '../apple.svelte.js';

	/** @typedef {import('@wwsff/cabinet/angel').GameSpec} GameSpec */
	/** @typedef {import('@wwsff/cabinet/angel').Command} Command */

	/** @type {{ game: GameSpec, place?: string }} */
	let { game, place } = $props();

	const OPEN = 'screen-angel-pad';
	/** The pad: open unless closed last time; closed, its line still names the game and the place. */
	let open = $state(globalThis.localStorage?.getItem(OPEN) !== 'closed');

	const ROSE = COMPASS.slice(0, 8);
	const SIDE = COMPASS.slice(8);
	/** @type {Record<string, string>} */
	const NAMES = { nw: 'northwest', n: 'north', ne: 'northeast', w: 'west', e: 'east', sw: 'southwest', s: 'south', se: 'southeast', up: 'up', down: 'down', in: 'in', out: 'out' };
	/** @type {Record<string, string>} */
	const SHORT = { nw: 'NW', n: 'N', ne: 'NE', w: 'W', e: 'E', sw: 'SW', s: 'S', se: 'SE', up: 'Up', down: 'Down', in: 'In', out: 'Out' };

	/** @param {Command} c */
	function press(c) {
		apple.type(commandKeys(c));
		apple.focusScreen();
	}

	/** @param {Command} c */
	function tip(c) {
		const s = commandSpec(c);
		const what = s.then ? `Types ${s.word} and a space: type what, on the Apple, then Return.` : `Types ${s.word} and Return.`;
		const said = s.tip && !/[.?!]$/.test(s.tip) ? `${s.tip}.` : s.tip;
		return [said, what, s.also?.length ? `The game also knows ${s.also.join(', ')}.` : ''].filter(Boolean).join(' ');
	}
</script>

<details
	class="pad"
	aria-label="{game.title}: buttons"
	bind:open
	ontoggle={(e) => globalThis.localStorage?.setItem(OPEN, e.currentTarget.open ? 'open' : 'closed')}
>
	<summary class="title">
		<strong>{game.title}</strong>
		<span class="place" aria-live="polite">{place ?? ''}</span>
	</summary>
	<div class="compass">
		<div class="rose" role="group" aria-label="Compass">
			{#each ROSE as p, i (p)}
				{@const c = game.compass?.[p]}
				{#if i === 4}
					{#if game.center}
						{@const m = game.center}
						<button class="center" title={tip(m)} onclick={() => press(m)}>{commandSpec(m).word}</button>
					{:else}
						<span class="none" aria-hidden="true"></span>
					{/if}
				{/if}
				{#if c}
					<button aria-label="Go {NAMES[p]}" title={tip(c)} onclick={() => press(c)}>{SHORT[p]}</button>
				{:else}
					<span class="none" aria-hidden="true"></span>
				{/if}
			{/each}
		</div>
		<div class="side" role="group" aria-label="Up, down, in and out">
			{#each SIDE as p (p)}
				{@const c = game.compass?.[p]}
				{#if c}
					<button aria-label="Go {NAMES[p]}" title={tip(c)} onclick={() => press(c)}>{SHORT[p]}</button>
				{:else}
					<span class="none" aria-hidden="true"></span>
				{/if}
			{/each}
		</div>
	</div>
	{#each game.groups ?? [] as g (g.label)}
		<details class="group" open={g.open}>
			<summary>{g.label} <small>({g.words.length})</small></summary>
			<div class="words" role="group" aria-label={g.label}>
				{#each g.words as w (commandSpec(w).word)}
					{@const s = commandSpec(w)}
					<button title={tip(w)} aria-label={s.then ? `${s.word}, then what` : s.word} onclick={() => press(w)}>{s.word}{s.then ? ' …' : ''}</button>
				{/each}
			</div>
		</details>
	{/each}
</details>

<style>
	.pad {
		margin-top: 0.5rem;
		font: 0.85rem system-ui, sans-serif;
	}
	.title {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 1rem;
		cursor: pointer;
		list-style: none;
	}
	.title::-webkit-details-marker {
		display: none;
	}
	.title::before {
		content: '▸';
		width: 0.8em;
	}
	.pad[open] > .title::before {
		content: '▾';
	}
	.pad[open] > .title {
		margin-bottom: 0.4rem;
	}
	.place {
		font-variant: small-caps;
		opacity: 0.85;
	}
	.compass {
		display: flex;
		gap: 0.8rem;
		align-items: center;
	}
	.rose {
		display: grid;
		grid-template-columns: repeat(3, 4.2rem);
		grid-auto-rows: 2.2rem;
		gap: 0.25rem;
	}
	.side {
		display: grid;
		grid-template-columns: repeat(2, 3.6rem);
		grid-auto-rows: 2.2rem;
		gap: 0.25rem;
	}
	.rose button,
	.side button {
		width: 100%;
		height: 100%;
		font: 600 0.85rem ui-monospace, monospace;
	}
	.center {
		border-radius: 50%;
		background: #1f3a20;
		color: #cfc;
	}
	.group {
		margin-top: 0.45rem;
	}
	.group summary {
		cursor: pointer;
		font-weight: 600;
	}
	.group small {
		font-weight: 400;
		opacity: 0.7;
	}
	.words {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-top: 0.3rem;
	}
	.words button {
		font: 0.8rem ui-monospace, monospace;
	}
</style>
