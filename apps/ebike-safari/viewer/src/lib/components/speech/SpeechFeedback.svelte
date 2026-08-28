<script lang="ts">
	import { SpeechFeedbackLoop } from '$lib/speech/feedback-loop';
	import { recognitionSupported, speechSupported } from '$lib/speech/speech-bridge';
	import {
		DEFAULT_FEEDBACK_SETTINGS,
		type LoopPass,
		type SpeechFeedbackSettings,
		type VoiceInfo,
		type VoiceType
	} from '$lib/speech/types';

	type Props = {
		/** Text spoken on the first pass; later passes speak what was heard. */
		seedText?: string;
		settings?: SpeechFeedbackSettings;
		/** Available voices for the exact-voice picker (from listVoices()). */
		voices?: VoiceInfo[];
		onPass?: (pass: LoopPass) => void;
	};

	let {
		seedText = $bindable('Hello hello, can you hear yourself think?'),
		settings = $bindable({ ...DEFAULT_FEEDBACK_SETTINGS }),
		voices = [],
		onPass
	}: Props = $props();

	const voiceTypes: VoiceType[] = ['robot', 'male', 'female', 'child', 'elderly', 'effect', 'any'];

	const speechOk = speechSupported();
	const recogOk = recognitionSupported();

	let running = $state(false);
	let status = $state('Idle.');
	let passes = $state<LoopPass[]>([]);
	let loop: SpeechFeedbackLoop | null = null;

	function start() {
		if (!seedText.trim() || running) return;
		passes = [];
		loop?.stop();
		loop = new SpeechFeedbackLoop({
			settings,
			onEvent: (ev) => {
				if (ev.type === 'status') status = ev.message;
				if (ev.type === 'error') status = `Error: ${ev.message}`;
				if (ev.type === 'pass') {
					passes = [...passes, ev.pass];
					onPass?.(ev.pass);
				}
				if (ev.type === 'stopped') running = false;
			}
		});
		running = true;
		void loop.start(seedText);
	}

	function stop() {
		loop?.stop();
		running = false;
		status = 'Stopped.';
	}

	function patch(partial: Partial<SpeechFeedbackSettings>) {
		settings = { ...settings, ...partial };
		loop?.updateSettings(partial);
	}
</script>

<div class="feedback">
	<label class="seed">
		Seed text
		<textarea bind:value={seedText} rows="3" disabled={running}></textarea>
	</label>

	<div class="row">
		<button type="button" class="primary" disabled={!speechOk || !recogOk || running} onclick={start}>
			Start feedback loop
		</button>
		<button type="button" disabled={!running} onclick={stop}>Stop</button>
	</div>

	<p class="status">{status}</p>

	{#if !speechOk}
		<p class="warn">No speech synthesis in this browser.</p>
	{/if}
	{#if !recogOk}
		<p class="warn">No speech recognition — use Chrome, or enable it in Firefox about:config.</p>
	{/if}

	<div class="controls">
		<label>
			Voice type
			<select
				value={settings.voiceType}
				onchange={(e) => patch({ voiceType: e.currentTarget.value as VoiceType, voiceURI: null })}
			>
				{#each voiceTypes as vt (vt)}
					<option value={vt}>{vt}</option>
				{/each}
			</select>
		</label>

		{#if voices.length > 0}
			<label>
				Exact voice
				<select
					value={settings.voiceURI ?? ''}
					onchange={(e) => patch({ voiceURI: e.currentTarget.value || null })}
				>
					<option value="">(pick by type)</option>
					{#each voices as v (v.voiceURI)}
						<option value={v.voiceURI}>{v.name} — {v.lang}</option>
					{/each}
				</select>
			</label>
		{/if}

		<label>
			Rate {settings.rate.toFixed(2)}
			<input
				type="range"
				min="0.5"
				max="1.5"
				step="0.05"
				value={settings.rate}
				oninput={(e) => patch({ rate: parseFloat(e.currentTarget.value) })}
			/>
		</label>

		<label>
			Pitch {settings.pitch.toFixed(2)}
			<input
				type="range"
				min="0.5"
				max="1.5"
				step="0.05"
				value={settings.pitch}
				oninput={(e) => patch({ pitch: parseFloat(e.currentTarget.value) })}
			/>
		</label>

		<label>
			Volume {settings.volume.toFixed(2)}
			<input
				type="range"
				min="0"
				max="1"
				step="0.05"
				value={settings.volume}
				oninput={(e) => patch({ volume: parseFloat(e.currentTarget.value) })}
			/>
		</label>

		<label>
			Post-speak delay (ms)
			<input
				type="number"
				min="0"
				max="30000"
				step="100"
				value={settings.postSpeakDelayMs}
				onchange={(e) => patch({ postSpeakDelayMs: parseInt(e.currentTarget.value, 10) || 0 })}
			/>
		</label>

		<label>
			Listen timeout (ms)
			<input
				type="number"
				min="1000"
				max="60000"
				step="500"
				value={settings.listenTimeoutMs}
				onchange={(e) => patch({ listenTimeoutMs: parseInt(e.currentTarget.value, 10) || 12000 })}
			/>
		</label>

		<label>
			Max passes (0 = endless)
			<input
				type="number"
				min="0"
				max="100"
				value={settings.maxPasses}
				onchange={(e) => patch({ maxPasses: parseInt(e.currentTarget.value, 10) || 0 })}
			/>
		</label>
	</div>

	{#if passes.length > 0}
		<ol class="passes">
			{#each passes as p (p.pass)}
				<li>
					<span class="spoken">{p.spoken}</span>
					<span class="arrow">→</span>
					<span class="heard">{p.heard || '(silence)'}</span>
				</li>
			{/each}
		</ol>
	{/if}
</div>

<style>
	.feedback {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.seed textarea {
		width: 100%;
		box-sizing: border-box;
		margin-top: 0.25rem;
		background: #0f1626;
		color: #f8f9fa;
		border: 1px solid #33415e;
		border-radius: 6px;
		padding: 0.5rem;
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

	button.primary {
		background: #e85d04;
		border-color: #e85d04;
		font-weight: 600;
	}

	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.status {
		margin: 0;
		font-family: ui-monospace, monospace;
		font-size: 0.82rem;
		min-height: 1.2em;
	}

	.warn {
		margin: 0;
		color: #ffb4a2;
		font-size: 0.82rem;
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 0.6rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.82rem;
	}

	select,
	input[type='number'] {
		background: #0f1626;
		color: #f8f9fa;
		border: 1px solid #33415e;
		border-radius: 6px;
		padding: 0.3rem 0.4rem;
		font: inherit;
	}

	.passes {
		margin: 0;
		padding-left: 1.4rem;
		font-size: 0.85rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.spoken {
		opacity: 0.75;
	}

	.arrow {
		opacity: 0.5;
		margin: 0 0.3rem;
	}

	.heard {
		color: #9ef01a;
	}
</style>
