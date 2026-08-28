<script lang="ts">
	import {
		cancelSpeech,
		findVoiceByName,
		listAllVoices,
		listenOnce,
		pickDefaultMaleVoice,
		recognitionSupported,
		speakAndWait,
		speechSupported,
		watchRecognition,
		type RecogPhase
	} from '$lib/speech/speech-bridge';
	import type { VoiceInfo } from '$lib/speech/types';
	import { onDestroy, onMount } from 'svelte';

	type RoomMessage = {
		id: number;
		atMs: number;
		name: string;
		text: string;
		/** Exact voice, as named on the sender's device. */
		voiceName?: string;
		voiceURI?: string;
		rate?: number;
		pitch?: number;
	};

	const speechOk = speechSupported();
	const recogOk = recognitionSupported();

	// Discrete taps, not continuous dials — a phone's orientation could drive these
	// later; detents are enough to play with now.
	const rateSteps = [
		{ label: 'slow', value: 0.7 },
		{ label: 'normal', value: 1 },
		{ label: 'fast', value: 1.5 }
	];
	const pitchSteps = [
		{ label: 'low', value: 0.6 },
		{ label: 'mid', value: 1 },
		{ label: 'high', value: 1.6 }
	];

	let room = $state('lobby');
	let name = $state('rider');
	let voices = $state<VoiceInfo[]>([]);
	let myVoiceURI = $state('');
	let rate = $state(1);
	let pitch = $state(1);
	let joined = $state(false);
	let status = $state('Pick a room and join.');
	let log = $state<RoomMessage[]>([]);
	let sendText = $state('');

	// Live state, so it's visible what the mouth and ear are doing right now.
	let phase = $state<RecogPhase>('idle');
	let phaseDetail = $state('');
	let interim = $state('');
	let lastHeard = $state('');
	let speakingNow = $state('');
	let unwatch: (() => void) | null = null;

	const myVoice = $derived(voices.find((v) => v.voiceURI === myVoiceURI));

	onMount(async () => {
		if (speechOk) {
			try {
				voices = await listAllVoices();
				const preferred = await pickDefaultMaleVoice();
				myVoiceURI = preferred?.voiceURI ?? voices[0]?.voiceURI ?? '';
			} catch {
				status = 'Could not enumerate voices.';
			}
		}
		if (recogOk) {
			unwatch = await watchRecognition({
				onPhase: (p, detail) => {
					phase = p;
					phaseDetail = detail ?? '';
					if (p === 'listening') interim = '';
				},
				onInterim: (text) => (interim = text),
				onFinal: (text) => {
					interim = '';
					lastHeard = text;
				},
				onError: (message) => (phaseDetail = message)
			});
		}
	});

	// Roles — split these across devices to beat echo suppression.
	let speakIncoming = $state(true);
	let speakOwn = $state(false);
	let earOn = $state(false);
	let halfDuplex = $state(true);

	let source: EventSource | null = null;
	let mouthBusy = $state(false);
	let speakQueue: RoomMessage[] = [];
	let earRunning = false;

	function join() {
		leave();
		const r = room.trim() || 'lobby';
		source = new EventSource(`/api/rooms/${encodeURIComponent(r)}/events`);
		source.onopen = () => {
			joined = true;
			status = `In room “${r}”.`;
		};
		source.onmessage = (ev) => {
			const msg = JSON.parse(ev.data) as RoomMessage;
			log = [...log.slice(-199), msg];
			const isMine = msg.name === name;
			if (speakIncoming && (!isMine || speakOwn)) {
				speakQueue.push(msg);
				void drainMouth();
			}
		};
		source.onerror = () => {
			status = joined ? 'Connection lost — retrying…' : 'Could not connect.';
		};
	}

	function leave() {
		source?.close();
		source = null;
		joined = false;
		speakQueue = [];
		earOn = false;
		cancelSpeech();
	}

	async function drainMouth() {
		if (mouthBusy || !speechOk) return;
		mouthBusy = true;
		while (speakQueue.length > 0) {
			const msg = speakQueue.shift()!;
			speakingNow = `${msg.name}: ${msg.text}`;
			try {
				// Voice URIs are device-local, so fall back to the voice's name,
				// then to a name-seeded pick that at least stays consistent.
				const local =
					(msg.voiceURI ? voices.find((v) => v.voiceURI === msg.voiceURI) : undefined) ??
					(msg.voiceName && findVoiceByName(msg.voiceName)
						? { voiceURI: findVoiceByName(msg.voiceName)!.voiceURI }
						: undefined);
				await speakAndWait(msg.text, {
					voiceURI: local?.voiceURI ?? null,
					seed: msg.name,
					rate: msg.rate ?? 1,
					pitch: msg.pitch ?? 1
				});
			} catch {
				// Skip unspeakable messages; keep draining.
			}
		}
		speakingNow = '';
		mouthBusy = false;
	}

	async function say(text: string) {
		const t = text.trim();
		if (!t || !joined) return;
		await fetch(`/api/rooms/${encodeURIComponent(room.trim() || 'lobby')}/say`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				text: t,
				voiceName: myVoice?.name,
				voiceURI: myVoiceURI || undefined,
				rate,
				pitch
			})
		});
	}

	async function sendNow() {
		const t = sendText;
		sendText = '';
		await say(t);
	}

	// Paste = play: pasted text goes into the room immediately, no Return needed.
	function handlePaste(e: ClipboardEvent) {
		const pasted = e.clipboardData?.getData('text') ?? '';
		if (!pasted.trim() || !joined) return;
		e.preventDefault();
		const whole = (sendText + pasted).trim();
		sendText = '';
		void say(whole);
	}

	// The ear: continuously listen and repost what it hears into the room.
	async function runEar() {
		if (earRunning) return;
		earRunning = true;
		while (earOn && joined) {
			if (halfDuplex && (mouthBusy || speakQueue.length > 0)) {
				await sleep(250);
				continue;
			}
			try {
				const heard = (await listenOnce(10000)).trim();
				if (heard && earOn) {
					await say(heard);
				}
			} catch (e) {
				status = `Ear stopped: ${e instanceof Error ? e.message : e}`;
				earOn = false;
			}
		}
		earRunning = false;
	}

	function onEarToggle() {
		if (earOn) void runEar();
	}

	function sleep(ms: number): Promise<void> {
		return new Promise((r) => window.setTimeout(r, ms));
	}

	onDestroy(() => {
		unwatch?.();
		leave();
	});
</script>

<svelte:head>
	<title>Voice Rooms — eBike Safari</title>
</svelte:head>

<main>
	<header>
		<h1>Voice Rooms</h1>
		<a class="back" href="/lab">← speech lab</a>
	</header>

	<section class="panel">
		<div class="join-row">
			<label>
				Room
				<input type="text" bind:value={room} disabled={joined} />
			</label>
			<label>
				Name
				<input type="text" bind:value={name} disabled={joined} />
			</label>
			{#if joined}
				<button type="button" onclick={leave}>Leave</button>
			{:else}
				<button type="button" class="primary" onclick={join}>Join</button>
			{/if}
		</div>
		<label class="voice-pick">
			My voice — {voices.length} available
			<select bind:value={myVoiceURI}>
				{#each voices as v (v.voiceURI)}
					<option value={v.voiceURI}>
						{v.name} · {v.lang}{v.localService ? '' : ' · network'}
					</option>
				{/each}
			</select>
		</label>
		<div class="chips">
			<span class="chip-label">Rate</span>
			{#each rateSteps as step (step.label)}
				<button
					type="button"
					class="chip"
					class:sel={rate === step.value}
					onclick={() => (rate = step.value)}>{step.label}</button
				>
			{/each}
		</div>
		<div class="chips">
			<span class="chip-label">Pitch</span>
			{#each pitchSteps as step (step.label)}
				<button
					type="button"
					class="chip"
					class:sel={pitch === step.value}
					onclick={() => (pitch = step.value)}>{step.label}</button
				>
			{/each}
		</div>
		<div class="row">
			<button
				type="button"
				disabled={!speechOk || !myVoiceURI}
				onclick={() =>
					speakAndWait(`This is ${myVoice?.name ?? 'this voice'}.`, {
						voiceURI: myVoiceURI,
						rate,
						pitch
					}).catch(() => {})}>Test my voice</button
			>
		</div>
		<p class="status">{status}</p>
		{#if !speechOk}
			<p class="warn">No speech synthesis here — this device can still send and read text.</p>
		{/if}
	</section>

	<section class="panel live" aria-live="polite">
		<h2>Live</h2>
		<div class="meter">
			<span class="tag mouth" class:on={mouthBusy}>
				{mouthBusy ? 'SPEAKING' : 'mouth idle'}
			</span>
			<span class="said">{speakingNow || '—'}</span>
		</div>
		<div class="meter">
			<span class="tag ear phase-{phase}" class:on={phase !== 'idle'}>
				{#if !earOn}
					ear off
				{:else}
					{phase.toUpperCase()}
				{/if}
			</span>
			<span class="said">
				{#if interim}
					<em>{interim}</em>
				{:else if phaseDetail}
					{phaseDetail}
				{:else}
					—
				{/if}
			</span>
		</div>
		{#if lastHeard}
			<p class="last-heard">last final: “{lastHeard}”</p>
		{/if}
		<p class="hint">
			Recognizer phases: LISTENING (mic open) → SOUND (something audible) → SPEECH (classified
			as speech) → RECOGNIZING (transcribing). Interim text appears in italics as it
			arrives, before the final result.
		</p>
	</section>

	<section class="panel">
		<h2>Roles on this device</h2>
		<label class="check">
			<input type="checkbox" bind:checked={speakIncoming} />
			Mouth — speak incoming messages aloud
		</label>
		<label class="check indent">
			<input type="checkbox" bind:checked={speakOwn} disabled={!speakIncoming} />
			…including my own
		</label>
		<label class="check">
			<input
				type="checkbox"
				bind:checked={earOn}
				disabled={!joined || !recogOk}
				onchange={onEarToggle}
			/>
			Ear — listen to this room's air and repost what it hears
		</label>
		<label class="check indent">
			<input type="checkbox" bind:checked={halfDuplex} disabled={!earOn} />
			Half-duplex — don't listen while this device is speaking
		</label>
		{#if !recogOk}
			<p class="warn">No recognition on this device — it can be a mouth but not an ear.</p>
		{/if}
		<p class="hint">
			Two devices in one physical room: make one the mouth and the other the ear, and the loop
			travels through the air between them — no device hears itself, so echo cancellation never
			engages.
		</p>
	</section>

	<section class="panel">
		<h2>Say</h2>
		<form
			class="send-row"
			onsubmit={(e) => {
				e.preventDefault();
				void sendNow();
			}}
		>
			<input
				type="text"
				bind:value={sendText}
				placeholder="Type — or paste to send instantly"
				disabled={!joined}
				onpaste={handlePaste}
			/>
			<button type="submit" class="primary" disabled={!joined || !sendText.trim()}>Send</button>
		</form>
		<ul class="log">
			{#each log.slice().reverse() as msg (msg.id)}
				<li>
					<span class="who">{msg.name}</span>
					<span class="what">{msg.text}</span>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		max-width: 44rem;
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

	.join-row {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
		align-items: flex-end;
	}

	.join-row label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.82rem;
	}

	input[type='text'],
	select {
		background: #0f1626;
		color: #f8f9fa;
		border: 1px solid #33415e;
		border-radius: 6px;
		padding: 0.45rem 0.55rem;
		font: inherit;
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
		margin: 0.6rem 0 0;
		font-family: ui-monospace, monospace;
		font-size: 0.82rem;
		min-height: 1.2em;
	}

	.warn {
		margin: 0.4rem 0 0;
		color: #ffb4a2;
		font-size: 0.82rem;
	}

	.hint {
		margin: 0.6rem 0 0;
		font-size: 0.8rem;
		opacity: 0.75;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.4rem;
		font-size: 0.88rem;
		cursor: pointer;
	}

	.check.indent {
		margin-left: 1.6rem;
		font-size: 0.82rem;
	}

	.send-row {
		display: flex;
		gap: 0.5rem;
	}

	.send-row input {
		flex: 1;
	}

	.log {
		list-style: none;
		margin: 0.75rem 0 0;
		padding: 0;
		max-height: 20rem;
		overflow: auto;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.88rem;
	}

	.who {
		color: #8cf;
		font-weight: 600;
		margin-right: 0.45rem;
	}

	.who::after {
		content: ':';
	}

	.voice-pick {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.7rem;
		font-size: 0.82rem;
	}

	.voice-pick select {
		max-width: 100%;
	}

	.chips {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.5rem;
	}

	.chip-label {
		font-size: 0.78rem;
		opacity: 0.7;
		min-width: 3rem;
	}

	.chip {
		padding: 0.3rem 0.7rem;
		font-size: 0.8rem;
		border-radius: 999px;
	}

	.chip.sel {
		background: #33415e;
		border-color: #8cf;
		color: #fff;
	}

	.meter {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.4rem;
		min-height: 1.9rem;
	}

	.tag {
		flex: 0 0 auto;
		min-width: 7.5rem;
		text-align: center;
		padding: 0.25rem 0.5rem;
		border-radius: 999px;
		border: 1px solid #33415e;
		font-family: ui-monospace, monospace;
		font-size: 0.72rem;
		letter-spacing: 0.03em;
		opacity: 0.55;
	}

	.tag.on {
		opacity: 1;
	}

	.tag.mouth.on {
		background: #e85d04;
		border-color: #e85d04;
		color: #1a1a2e;
	}

	.tag.ear.on {
		background: #9ef01a;
		border-color: #9ef01a;
		color: #1a1a2e;
	}

	.tag.ear.phase-error.on {
		background: #ffb4a2;
		border-color: #ffb4a2;
	}

	.said {
		flex: 1;
		font-size: 0.85rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.last-heard {
		margin: 0.3rem 0 0;
		font-size: 0.82rem;
		color: #9ef01a;
	}

	/* Phones: inputs at 16px so iOS never zooms on focus; roomier taps. */
	@media (max-width: 34rem) {
		input[type='text'],
		select {
			font-size: 16px;
		}

		button {
			padding: 0.6rem 1rem;
		}

		.tag {
			min-width: 6.5rem;
		}
	}
</style>
