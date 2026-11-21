<script>
	/** The cabinet's speaking voice, for every page that speaks; kept across visits. */
	import { onMount } from 'svelte';
	import { chooseVoice, defaultVoiceName, startVoices, utterance, voice } from './voice.svelte.js';

	/** @type {{ sample?: string }} */
	let { sample = 'This is how the cabinet will sound.' } = $props();

	onMount(startVoices);

	/** @param {string} name */
	function pick(name) {
		chooseVoice(name);
		speechSynthesis.cancel();
		speechSynthesis.speak(utterance(sample));
	}
</script>

{#if voice.voices.length}
	<select
		class="voice"
		aria-label="Voice"
		title="The voice the cabinet speaks with, on every page"
		value={voice.name}
		onchange={(e) => pick(e.currentTarget.value)}
	>
		<option value="">Default ({defaultVoiceName()})</option>
		{#each voice.voices as v (v.voiceURI)}
			<option value={v.name}>{v.name}{v.localService ? '' : ' (online)'}</option>
		{/each}
	</select>
{/if}

<style>
	.voice {
		max-width: 16rem;
		font: inherit;
	}
</style>
