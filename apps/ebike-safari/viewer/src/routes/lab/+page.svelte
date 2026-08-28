<script lang="ts">
	import SpeechFeedback from '$lib/components/speech/SpeechFeedback.svelte';
	import {
		cancelSpeech,
		listenOnce,
		listVoices,
		recognitionSupported,
		speakAndWait,
		speechSupported
	} from '$lib/speech/speech-bridge';
	import { DEFAULT_FEEDBACK_SETTINGS, type SpeechFeedbackSettings, type VoiceInfo } from '$lib/speech/types';
	import { onMount } from 'svelte';

	const speechOk = speechSupported();
	const recogOk = recognitionSupported();

	let voices = $state<VoiceInfo[]>([]);
	let voiceFilter = $state('');
	let testPhrase = $state('The quick brown fox rides an electric bike.');
	let testStatus = $state('');
	let heardText = $state('');
	let busy = $state(false);
	let settings = $state<SpeechFeedbackSettings>({ ...DEFAULT_FEEDBACK_SETTINGS });

	onMount(async () => {
		if (!speechOk) return;
		try {
			voices = await listVoices();
		} catch (e) {
			testStatus = e instanceof Error ? e.message : String(e);
		}
	});

	const filteredVoices = $derived.by(() => {
		const q = voiceFilter.trim().toLowerCase();
		if (!q) return voices;
		return voices.filter(
			(v) =>
				v.name.toLowerCase().includes(q) ||
				v.lang.toLowerCase().includes(q) ||
				v.type.includes(q) ||
				v.gender.includes(q) ||
				v.age.includes(q)
		);
	});

	async function runSpeak(voiceURI?: string) {
		if (busy) cancelSpeech();
		busy = true;
		testStatus = 'Speaking…';
		try {
			await speakAndWait(testPhrase, {
				voiceURI: voiceURI ?? settings.voiceURI,
				voiceType: settings.voiceType,
				rate: settings.rate,
				pitch: settings.pitch,
				volume: settings.volume
			});
			testStatus = 'Done speaking.';
		} catch (e) {
			testStatus = `Speak failed: ${e instanceof Error ? e.message : e}`;
		} finally {
			busy = false;
		}
	}

	async function runMicCheck() {
		busy = true;
		heardText = '';
		testStatus = 'Listening… say something.';
		try {
			heardText = await listenOnce(settings.listenTimeoutMs);
			testStatus = heardText ? 'Heard you.' : 'Silence / timeout.';
		} catch (e) {
			testStatus = `Mic check failed: ${e instanceof Error ? e.message : e}`;
		} finally {
			busy = false;
		}
	}

	async function runEchoTest() {
		busy = true;
		heardText = '';
		testStatus = 'Speaking, then listening for the echo…';
		try {
			await speakAndWait(testPhrase, {
				voiceURI: settings.voiceURI,
				voiceType: settings.voiceType,
				rate: settings.rate,
				pitch: settings.pitch,
				volume: settings.volume
			});
			await new Promise((r) => window.setTimeout(r, settings.postSpeakDelayMs));
			heardText = await listenOnce(settings.listenTimeoutMs);
			testStatus = heardText
				? 'Echo captured — the loop can hear itself.'
				: 'No echo heard — raise volume, or the mic can’t hear the speakers.';
		} catch (e) {
			testStatus = `Echo test failed: ${e instanceof Error ? e.message : e}`;
		} finally {
			busy = false;
		}
	}

	function useVoice(v: VoiceInfo) {
		settings = { ...settings, voiceURI: v.voiceURI };
	}
</script>

<svelte:head>
	<title>Speech Lab — eBike Safari</title>
</svelte:head>

<main>
	<header>
		<h1>Speech Lab</h1>
		<a class="back" href="/">← back to the map</a>
	</header>

	<section class="panel">
		<h2>Support</h2>
		<p>
			Synthesis: <strong class={speechOk ? 'ok' : 'bad'}>{speechOk ? 'available' : 'missing'}</strong>
			· Recognition:
			<strong class={recogOk ? 'ok' : 'bad'}>{recogOk ? 'available' : 'missing'}</strong>
			· Voices: <strong>{voices.length}</strong>
		</p>
		{#if !recogOk}
			<p class="warn">Recognition needs Chrome (or Firefox with the about:config flag). Synthesis-only tests still work.</p>
		{/if}
	</section>

	<section class="panel">
		<h2>Quick tests</h2>
		<label class="phrase">
			Test phrase
			<input type="text" bind:value={testPhrase} />
		</label>
		<div class="row">
			<button type="button" disabled={!speechOk || busy} onclick={() => runSpeak()}>Speak</button>
			<button type="button" disabled={!recogOk || busy} onclick={runMicCheck}>Mic check</button>
			<button type="button" disabled={!speechOk || !recogOk || busy} onclick={runEchoTest}>
				Echo test (speak → listen)
			</button>
			<button type="button" onclick={cancelSpeech}>Cancel speech</button>
		</div>
		<p class="status">{testStatus}</p>
		{#if heardText}
			<p class="heard">Heard: “{heardText}”</p>
		{/if}
	</section>

	<section class="panel">
		<h2>Feedback mode</h2>
		<p class="hint">
			The mic listens to the speakers on purpose: speak → pause → hear → re-speak. Stop any time.
		</p>
		<SpeechFeedback bind:settings {voices} />
	</section>

	<section class="panel">
		<h2>Voices ({filteredVoices.length})</h2>
		<label class="phrase">
			Filter
			<input type="text" bind:value={voiceFilter} placeholder="name, lang, robot, female, child…" />
		</label>
		<ul class="voices">
			{#each filteredVoices as v (v.voiceURI)}
				<li class:active={settings.voiceURI === v.voiceURI}>
					<button type="button" class="voice-name" disabled={busy} onclick={() => runSpeak(v.voiceURI)}>
						{v.name}
					</button>
					<span class="meta">{v.lang} · {v.type}/{v.gender}/{v.age}{v.localService ? '' : ' · remote'}</span>
					<button type="button" class="use" onclick={() => useVoice(v)}>
						{settings.voiceURI === v.voiceURI ? 'selected' : 'use'}
					</button>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		max-width: 52rem;
		margin: 0 auto;
		/* body is overflow:hidden for the map, so this page owns its own scroll */
		height: 100dvh;
		overflow-y: auto;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		padding: calc(1rem + env(safe-area-inset-top)) calc(1.25rem + env(safe-area-inset-right))
			calc(3rem + env(safe-area-inset-bottom)) calc(1.25rem + env(safe-area-inset-left));
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: #f8f9fa;
	}

	:global(body) {
		background: #1a1a2e;
	}

	header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	h1 {
		margin: 0;
		font-size: 1.4rem;
	}

	.back {
		color: #8cf;
		font-size: 0.85rem;
	}

	.panel {
		border: 1px solid #33415e;
		border-radius: 10px;
		background: #16213e;
		padding: 1rem;
	}

	h2 {
		margin: 0 0 0.6rem;
		font-size: 1rem;
	}

	.ok {
		color: #9ef01a;
	}

	.bad {
		color: #ffb4a2;
	}

	.warn {
		color: #ffb4a2;
		font-size: 0.85rem;
	}

	.hint {
		margin: 0 0 0.75rem;
		font-size: 0.82rem;
		opacity: 0.75;
	}

	.phrase {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
		margin-bottom: 0.6rem;
	}

	.phrase input {
		background: #0f1626;
		color: #f8f9fa;
		border: 1px solid #33415e;
		border-radius: 6px;
		padding: 0.45rem 0.55rem;
		font: inherit;
	}

	.row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	button {
		padding: 0.45rem 0.9rem;
		border: 1px solid #33415e;
		border-radius: 6px;
		background: #1c2942;
		color: #f8f9fa;
		font: inherit;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.status {
		margin: 0.6rem 0 0;
		font-family: ui-monospace, monospace;
		font-size: 0.82rem;
		min-height: 1.2em;
	}

	.heard {
		margin: 0.35rem 0 0;
		color: #9ef01a;
	}

	.voices {
		list-style: none;
		margin: 0;
		padding: 0;
		max-height: 24rem;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}

	.voices li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.3rem 0.4rem;
		border-radius: 6px;
	}

	.voices li.active {
		background: #1c2942;
	}

	.voice-name {
		border: none;
		background: none;
		padding: 0.15rem 0;
		color: #8cf;
		text-align: left;
		cursor: pointer;
		flex: 0 0 auto;
	}

	.meta {
		flex: 1;
		font-size: 0.75rem;
		opacity: 0.7;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.use {
		flex: 0 0 auto;
		font-size: 0.75rem;
		padding: 0.2rem 0.55rem;
	}
</style>
