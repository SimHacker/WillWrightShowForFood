<script>
	import RateSlider from './RateSlider.svelte';
	import { STYLES } from './bus-dance.svelte.js';
	import { TEMPOS } from './dance-player.js';

	/** twist: show what the front panel's switches are doing, on a line of its own. */
	/** jiggle: flip one of the machine's switches at random, beside what the switches are doing. */
	/** @type {{ dance: import('./bus-dance.svelte.js').BusDance, chip?: boolean, listen?: boolean, twist?: boolean, jiggle?: () => void }} */
	let { dance, chip = false, listen = false, twist = false, jiggle } = $props();

	const rates = TEMPOS.map((bpm) => ({ label: String(bpm), title: `${bpm} beats a minute, sixteenths ${Math.round(15000 / bpm)} ms apart` }));
	const tempoIndex = $derived(Math.max(0, TEMPOS.indexOf(dance.bpm)));
	// Four layers after Brian Eno, each on or off by itself, all in the chord in force.
	const ENO = [
		{ bit: 1, title: "EN0: tape loops after Music for Airports, five of prime lengths, each sounding one tone of the chord, drifting against each other" },
		{ bit: 2, title: "EN1: a drone, two long loops an octave below, after Discreet Music's slow tape delay" },
		{ bit: 4, title: 'EN2: a sparkle, three sparse chimes two octaves up' },
		{ bit: 8, title: 'EN3: voices, three singing a tone each, after Music for Airports 2/1' }
	];
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
<span class="eno" role="group" aria-label="Eno layers, each on or off">
	{#each ENO as e, i (e.bit)}
		<button
			type="button"
			aria-pressed={(dance.loops & e.bit) !== 0}
			class={{ chip, on: (dance.loops & e.bit) !== 0 }}
			title={e.title}
			onclick={() => dance.toggleLayer(e.bit)}>EN{i}</button
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
	.chip.on {
		background: #9fe8a0;
		border-color: #9fe8a0;
	}
	/* One row of joined buttons, a layer each. */
	.eno {
		display: inline-flex;
	}
	.eno button,
	.eno button.on {
		margin: 0;
		border: 1px solid #777;
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
