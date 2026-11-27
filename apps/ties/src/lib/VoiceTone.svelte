<script>
	/**
	 * The volume, speed and pitch every voice in the Machine Room speaks at, kept across visits
	 * (voice.svelte.js). Letting go of a slider says a few words at the new setting.
	 */
	import { onMount } from 'svelte';
	import { TONE, setTone, startVoices, utterance, voice } from './voice.svelte.js';

	onMount(startVoices);

	const names = /** @type {import('./voice.svelte.js').ToneName[]} */ (Object.keys(TONE));

	function sample() {
		speechSynthesis.cancel();
		speechSynthesis.speak(utterance('This is how the Machine Room will sound.'));
	}
</script>

<span class="tone" role="group" aria-label="Volume, speed and pitch">
	{#each names as k (k)}
		{@const t = TONE[k]}
		<label title="{t.label} of every voice, {t.min} to {t.max}; {t.normal} is normal. Double-click to set it back.">
			{t.label}
			<input
				type="range"
				min={t.min}
				max={t.max}
				step={t.step}
				value={voice[k]}
				oninput={(e) => setTone(k, Number(e.currentTarget.value))}
				onchange={sample}
				ondblclick={() => {
					setTone(k, t.normal);
					sample();
				}}
			/>
			<output>{voice[k].toFixed(2)}</output>
		</label>
	{/each}
</span>

<style>
	.tone {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.9rem;
		align-items: center;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}
	input {
		width: 6.5rem;
	}
	output {
		display: inline-block;
		width: 2.4em;
		font-variant-numeric: tabular-nums;
	}
</style>
