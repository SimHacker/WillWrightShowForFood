<script>
	/**
	 * The Machine Room's speaking voice, for every page that speaks; kept across visits. With
	 * `yours`, your voice instead: what you type, when a machine reads aloud.
	 */
	import { onMount } from 'svelte';
	import {
		chooseVoice,
		chooseYourVoice,
		defaultVoiceName,
		defaultYourVoiceName,
		startVoices,
		utterance,
		voice,
		yourUtterance
	} from './voice.svelte.js';

	/** @type {{ sample?: string, yours?: boolean }} */
	let { sample = '', yours = false } = $props();

	onMount(startVoices);

	/** @param {string} name */
	function pick(name) {
		if (yours) chooseYourVoice(name);
		else chooseVoice(name);
		speechSynthesis.cancel();
		const text = sample || (yours ? 'This is how you will sound.' : 'This is how the Machine Room will sound.');
		speechSynthesis.speak(yours ? yourUtterance(text) : utterance(text));
	}
</script>

{#if voice.voices.length}
	<select
		class="voice"
		aria-label={yours ? 'Your voice' : 'Voice'}
		title={yours ? 'The voice that says what you type, when the machine reads aloud' : 'The voice the Machine Room speaks with, on every page'}
		value={yours ? voice.you : voice.name}
		onchange={(e) => pick(e.currentTarget.value)}
	>
		<option value="">Default ({yours ? defaultYourVoiceName() : defaultVoiceName()})</option>
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
