<script>
	import RateSlider from './RateSlider.svelte';
	import { STYLES } from './bus-dance.svelte.js';
	import { TEMPOS } from './dance-player.js';

	/** twist: show what the front panel's switches are doing, on a line of its own. */
	/** jiggle: flip one of the machine's switches at random, beside what the switches are doing. */
	/**
	 * seed: the switches as a music seed, the line to paste into a cartridge's definition (`text`),
	 * and setting them from a pasted one (`paste`, false when the text names none). `where` says
	 * where the line goes.
	 */
	/** @typedef {{ text: () => string, paste: (text: string) => boolean, where: string }} Seed */
	/** @type {{ dance: import('./bus-dance.svelte.js').BusDance, chip?: boolean, listen?: boolean, twist?: boolean, jiggle?: () => void, seed?: Seed }} */
	let { dance, chip = false, listen = false, twist = false, jiggle, seed } = $props();

	const rates = TEMPOS.map((bpm) => ({ label: String(bpm), title: `${bpm} beats a minute, sixteenths ${Math.round(15000 / bpm)} ms apart` }));
	const tempoIndex = $derived(Math.max(0, TEMPOS.indexOf(dance.bpm)));

	/** What the last copy or paste did, for a moment. */
	let said = $state('');
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let saidTimer;
	/** @param {string} what */
	function say(what) {
		said = what;
		clearTimeout(saidTimer);
		saidTimer = setTimeout(() => (said = ''), 2500);
	}

	/** @param {Seed} s */
	async function copySeed(s) {
		const text = s.text();
		try {
			await navigator.clipboard.writeText(text);
			say(`copied ${text}`);
		} catch {
			window.prompt('Copy this music seed:', text);
		}
	}

	/** The clipboard's text, or what the person types when the browser won't hand it over. @param {Seed} s */
	async function pasteSeed(s) {
		let text = null;
		try {
			text = await navigator.clipboard.readText();
		} catch {
			text = window.prompt('Paste a music seed:', '');
		}
		if (text === null) return;
		say(s.paste(text) ? `pasted ${text.trim()}` : 'no seed on the clipboard');
	}
</script>

<select
	aria-label="Dance style"
	title={STYLES.find((s) => s.id === dance.style)?.title}
	value={dance.style}
	onchange={(e) => dance.setStyle(/** @type {import('@wwsff/cabinet/dance').Style} */ (e.currentTarget.value))}
>
	{#each STYLES as s (s.id)}
		<option value={s.id} title={s.title}>{s.label}</option>
	{/each}
</select>
<span class="eno" role="group" aria-label="Eno tracks, each on or off">
	{#each dance.tracks as track, i (track.id)}
		{@const on = (dance.loops & (1 << i)) !== 0}
		<button
			type="button"
			aria-pressed={on}
			class={{ chip, on }}
			title="EN{i} {track.name}: {track.description}. {on ? 'On: click to turn it off' : 'Off: click to turn it on'}; each track is on or off by itself."
			onclick={() => dance.toggleLayer(1 << i)}>EN{i}</button
		>
	{/each}
</span>
{#if listen}
	<input
		class="listen"
		aria-label="Words to listen to"
		title="Words in core the dance listens to, by name: labels, or Forth variables and constants. Each one gets its own quiet loop that steps along as its value changes. name!0-99 sings its value as a pitch instead, at once when it changes; name~0-99 whistles it now and then."
		placeholder="listen to…"
		size="16"
		value={dance.listen}
		onchange={(e) => (dance.listen = e.currentTarget.value)}
		onkeydown={(e) => e.stopPropagation()}
	/>
{/if}
<RateSlider label="Dance tempo, slowest to fastest" keys="Keys: ` slower, ~ faster." {rates} index={tempoIndex} onpick={(i) => (dance.bpm = TEMPOS[i] ?? 120)} />
{#if jiggle}
	<button
		type="button"
		class={{ chip }}
		title="Jiggle: flip one of the machine's switches at random, which twists the music. A program that reads them as controls feels it too."
		onpointerdown={(e) => e.preventDefault()}
		onclick={jiggle}>🎲 {chip ? 'JIGGLE' : 'Jiggle'}</button
	>
{/if}
{#if seed}
	<button
		type="button"
		class={{ chip }}
		title="Copy the switches as a music seed, a line to paste into {seed.where}"
		onpointerdown={(e) => e.preventDefault()}
		onclick={() => copySeed(seed)}>📋 {chip ? 'COPY' : 'Copy seed'}</button
	>
	<button
		type="button"
		class={{ chip }}
		title="Set the switches from a music seed on the clipboard: the line Copy gives, or just its digits"
		onpointerdown={(e) => e.preventDefault()}
		onclick={() => pasteSeed(seed)}>📥 {chip ? 'PASTE' : 'Paste seed'}</button
	>
	{#if said}<span class="said" role="status">{said}</span>{/if}
{/if}
{#if twist}
	<span class="twist" title="The front panel's switches twist the music: their word is hashed, so every combination skews, phases and picks its own effects. All off is the plain dance."
		>switches: {dance.twist || 'all off, plain'}</span
	>
{/if}

<style>
	/* Each page scopes its own button look; these match the PDP-7's chips and the Apple's buttons. */
	button.on {
		background: #cfc;
		color: #000;
	}
	.chip,
	.listen,
	select:has(+ .eno .chip) {
		font: inherit;
		font-size: 0.62rem;
		height: 1.4rem;
		padding: 0 0.4em;
		border: 1px solid #555;
		background: transparent;
		color: inherit;
	}
	.chip {
		cursor: pointer;
	}
	.twist {
		flex-basis: 100%;
		height: 1rem;
		line-height: 1rem;
		font-size: 0.62rem;
		opacity: 0.75;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.said {
		font-size: 0.62rem;
		opacity: 0.75;
		white-space: nowrap;
	}
	.chip.on {
		background: #9fe8a0;
		border-color: #9fe8a0;
	}
	/* One row of joined buttons, a layer each. */
	.eno {
		display: inline-flex;
	}
	/* A fixed size, lit or not, so a row of them never shifts as they toggle. */
	.eno button,
	.eno button.on {
		box-sizing: border-box;
		width: 3.2em;
		margin: 0;
		padding: 0;
		border: 1px solid #777;
		font-weight: normal;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
	.eno button + button {
		margin-left: -1px;
	}
	.eno button:first-child {
		border-radius: 4px 0 0 4px;
	}
	.eno button:last-child {
		border-radius: 0 4px 4px 0;
	}
	.eno button:not(:first-child):not(:last-child) {
		border-radius: 0;
	}

</style>
