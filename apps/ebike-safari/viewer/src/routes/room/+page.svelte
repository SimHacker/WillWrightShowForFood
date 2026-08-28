<script lang="ts">
	import {
		cancelSpeech,
		listenOnce,
		recognitionSupported,
		speakAndWait,
		speechSupported
	} from '$lib/speech/speech-bridge';
	import type { VoiceType } from '$lib/speech/types';
	import { onDestroy } from 'svelte';

	type RoomMessage = {
		id: number;
		atMs: number;
		name: string;
		text: string;
		voiceType?: string;
		rate?: number;
		pitch?: number;
	};

	const speechOk = speechSupported();
	const recogOk = recognitionSupported();
	const voiceTypes: VoiceType[] = ['robot', 'male', 'female', 'child', 'elderly', 'effect', 'any'];

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
	let voiceType = $state<VoiceType>('robot');
	let rate = $state(1);
	let pitch = $state(1);
	let joined = $state(false);
	let status = $state('Pick a room and join.');
	let log = $state<RoomMessage[]>([]);
	let sendText = $state('');

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
			try {
				await speakAndWait(msg.text, {
					voiceType: (msg.voiceType as VoiceType) ?? 'any',
					rate: msg.rate ?? 1,
					pitch: msg.pitch ?? 1
				});
			} catch {
				// Skip unspeakable messages; keep draining.
			}
		}
		mouthBusy = false;
	}

	async function say(text: string) {
		const t = text.trim();
		if (!t || !joined) return;
		await fetch(`/api/rooms/${encodeURIComponent(room.trim() || 'lobby')}/say`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, text: t, voiceType })
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

	onDestroy(leave);
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
			<label>
				My voice
				<select bind:value={voiceType}>
					{#each voiceTypes as vt (vt)}
						<option value={vt}>{vt}</option>
					{/each}
				</select>
			</label>
			{#if joined}
				<button type="button" onclick={leave}>Leave</button>
			{:else}
				<button type="button" class="primary" onclick={join}>Join</button>
			{/if}
		</div>
		<p class="status">{status}</p>
		{#if !speechOk}
			<p class="warn">No speech synthesis here — this device can still send and read text.</p>
		{/if}
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
</style>
