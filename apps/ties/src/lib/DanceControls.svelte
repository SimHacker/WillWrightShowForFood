<script>
	import RateSlider from './RateSlider.svelte';
	import { STYLES } from './bus-dance.svelte.js';
	import { TEMPOS } from './dance-player.js';

	/** @type {{ dance: import('./bus-dance.svelte.js').BusDance, chip?: boolean, listen?: boolean }} */
	let { dance, chip = false, listen = false } = $props();

	const rates = TEMPOS.map((bpm) => ({ label: String(bpm), title: `${bpm} beats a minute, sixteenths ${Math.round(15000 / bpm)} ms apart` }));
	const tempoIndex = $derived(Math.max(0, TEMPOS.indexOf(dance.bpm)));
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
<button
	type="button"
	class={{ chip, on: dance.loops }}
	aria-pressed={dance.loops}
	title="Tape loops after Brian Eno's Music for Airports: five loops of prime lengths, each sounding one tone of the chord, drifting against each other"
	onclick={() => dance.toggleLoops()}>{chip ? 'ENO' : 'Eno'}</button
>
{#if listen}
	<input
		class="listen"
		aria-label="Words to listen to"
		title="Words in core the dance listens to, by name: labels, or Forth variables and constants. Each one gets its own quiet loop that steps along as its value changes."
		placeholder="listen to…"
		size="16"
		value={dance.listen}
		onchange={(e) => (dance.listen = e.currentTarget.value)}
		onkeydown={(e) => e.stopPropagation()}
	/>
{/if}
{#if dance.twist}
	<span class="twist" title="The front panel's switches twist the music: their word is hashed, so every combination skews, phases and picks its own effects. All off is the plain dance.">{dance.twist}</span>
{/if}
<RateSlider label="Dance tempo, slowest to fastest" {rates} index={tempoIndex} onpick={(i) => (dance.bpm = TEMPOS[i] ?? 120)} />

<style>
	/* Each page scopes its own button look; these match the PDP-7's chips and the Apple's buttons. */
	button.on {
		background: #cfc;
		color: #000;
	}
	.chip,
	.listen,
	select:has(+ .chip) {
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
		font-size: 0.62rem;
		opacity: 0.75;
		white-space: nowrap;
	}
	.chip.on {
		background: #9fe8a0;
		border-color: #9fe8a0;
	}
</style>
