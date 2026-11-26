<script>
	import RateSlider from './RateSlider.svelte';
	import { STYLES } from './bus-dance.svelte.js';
	import { TEMPOS } from './dance-player.js';

	/** twist: show what the front panel's switches are doing, on a line of its own. */
	/** @type {{ dance: import('./bus-dance.svelte.js').BusDance, chip?: boolean, listen?: boolean, twist?: boolean }} */
	let { dance, chip = false, listen = false, twist = false } = $props();

	const rates = TEMPOS.map((bpm) => ({ label: String(bpm), title: `${bpm} beats a minute, sixteenths ${Math.round(15000 / bpm)} ms apart` }));
	const tempoIndex = $derived(Math.max(0, TEMPOS.indexOf(dance.bpm)));
	/** @type {{ level: import('@wwsff/cabinet/dance').Eno, title: string }[]} */
	const ENO = [
		{ level: 0, title: 'EN0: no tape loops' },
		{ level: 1, title: "EN1: tape loops after Brian Eno's Music for Airports, five of prime lengths, each sounding one tone of the chord, drifting against each other" },
		{ level: 2, title: "EN2: and a drone under them, two long loops an octave below, after Discreet Music's slow tape delay" },
		{ level: 3, title: 'EN3: and a sparkle over them, three sparse chimes two octaves up' }
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
<span class="eno" role="radiogroup" aria-label="Eno: tape loops in layers">
	{#each ENO as e (e.level)}
		<button
			type="button"
			role="radio"
			aria-checked={dance.loops === e.level}
			class={{ chip, on: dance.loops === e.level && e.level > 0, under: e.level > 0 && e.level < dance.loops }}
			title={e.title}
			onclick={() => dance.setLoops(e.level)}>EN{e.level}</button
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
	/* One row of joined buttons, the levels under the chosen one half lit: layers. */
	.eno {
		display: inline-flex;
	}
	.eno button {
		margin: 0;
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
	button.under {
		background: #e3f5e3;
		color: #000;
	}
	.chip.under {
		background: rgba(159, 232, 160, 0.4);
		border-color: #9fe8a0;
	}
</style>
