<script>
	import RateSlider from './RateSlider.svelte';
	import { STYLES } from './bus-dance.svelte.js';
	import { TEMPOS } from './dance-player.js';

	/** @type {{ dance: import('./bus-dance.svelte.js').BusDance, chip?: boolean }} */
	let { dance, chip = false } = $props();

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
<RateSlider label="Dance tempo, slowest to fastest" {rates} index={tempoIndex} onpick={(i) => (dance.bpm = TEMPOS[i] ?? 120)} />

<style>
	/* Each page scopes its own button look; these match the PDP-7's chips and the Apple's buttons. */
	button.on {
		background: #cfc;
		color: #000;
	}
	.chip,
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
	.chip.on {
		background: #9fe8a0;
		border-color: #9fe8a0;
	}
</style>
