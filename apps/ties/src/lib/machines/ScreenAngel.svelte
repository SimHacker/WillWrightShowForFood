<script>
	/**
	 * A screen angel beside the Apple: it watches the machine's own 560x192 pixels, keeps the
	 * game's state from what it sees, says what the game wants, makes the moves it can make
	 * alone and asks for typed answers in a page field while the machine's keyboard is off.
	 * Turned off, the player has the machine and every move to themselves.
	 */
	import { onMount, tick } from 'svelte';
	import { askKeys, fillNow, fillReply, placeOf } from '@wwsff/cabinet/angel';
	import { apple } from '../apple.svelte.js';
	import { loadAngel } from '../angels.js';
	import AdventurePad from './AdventurePad.svelte';
	import VoicePicker from '../VoicePicker.svelte';
	import VoiceTone from '../VoiceTone.svelte';
	import { utterance } from '../voice.svelte.js';

	/** @typedef {import('@wwsff/cabinet/angel').StateSpec} StateSpec */

	/**
	 * @type {{
	 *   path: string,
	 *   move: (label: string) => void,
	 *   moves?: string[] | null,
	 *   controls?: import('svelte').Snippet,
	 *   guide?: import('svelte').Snippet,
	 * }}
	 */
	let { path, move, moves = $bindable(null), controls, guide } = $props();

	const ON = 'screen-angel';
	const SPEAK = 'screen-angel-speak';
	const REQUESTS = 'screen-angel-requests';
	/** The requests under the field: open unless closed last time. */
	let requestsOpen = $state(globalThis.localStorage?.getItem(REQUESTS) !== 'closed');
	const GUIDE = 'screen-angel-guide';
	/** The game's guide, last in the angel: closed unless opened last time. */
	let guideOpen = $state(globalThis.localStorage?.getItem(GUIDE) === 'open');
	const LOCKED = 'Keys go to the field below the screen. Turn the screen angel off to type here.';

	let on = $state(true);
	let speaking = $state(true);
	/** @type {StateSpec | null} */
	let state = $state(null);
	let answered = $state(false);
	/** Machine seconds spent in the state. */
	let held = $state(0);
	let value = $state('');
	let failed = $state('');
	/** @type {HTMLInputElement | undefined} */
	let field = $state();

	/** @type {import('@wwsff/cabinet/angel').Angel | null} */
	let angel = null;
	/** The game the angel knows is running, for an angel with games. @type {import('@wwsff/cabinet/angel').GameSpec | null} */
	let game = $state.raw(null);
	/** Where that game says the player is. @type {string | undefined} */
	let place = $state();
	let last = 0;
	let autoDone = false;

	const ask = $derived(on && !answered ? state?.ask : undefined);

	$effect(() => {
		moves = on && state ? (state.moves ?? []) : null;
	});
	$effect(() => {
		apple.locked = on && state?.lock ? LOCKED : '';
	});
	$effect(() => {
		apple.chat = on && ask ? (field ?? null) : null;
		return () => (apple.chat = null);
	});

	const hush = () => {
		owed = [];
		if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
	};

	/** Lines said before the page had a click or key, which browsers keep quiet until the first. */
	/** @type {string[]} */
	let owed = [];

	/** @param {string} text */
	function say(text) {
		if (!speaking || !text || typeof speechSynthesis === 'undefined') return;
		if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
			owed.push(text);
			return;
		}
		speechSynthesis.speak(utterance(text));
	}

	function payOwed() {
		const lines = owed;
		owed = [];
		if (on) for (const text of lines) say(text);
	}

	/** The game moved to `s`: follow it, whether or not the angel is on. @param {StateSpec} s */
	function track(s) {
		state = s;
		answered = false;
		autoDone = false;
		value = s.ask?.default ? fillNow(s.ask.default) : '';
	}

	/** The game moved to `s` while the angel is on: follow it and act on it. @param {StateSpec} s */
	async function enter(s) {
		track(s);
		if (s.music) apple.dance?.mode(s.music);
		say(s.speak ?? s.ask?.speak ?? '');
		if (s.speed) apple.speed(s.speed, s.frames ?? 0);
		if (s.ask) {
			await tick();
			field?.focus({ preventScroll: true });
			field?.select();
		}
	}

	// The angel watches the screen on or off, so it always knows where the game is; off, it
	// only stops speaking, typing and making moves.
	function step() {
		if (!angel || apple.phase !== 'running') return;
		const seconds = apple.seconds();
		if (seconds + 1 < last) {
			angel.reset(seconds);
			(on ? enter : track)(angel.state);
		}
		last = seconds;
		const rows = apple.text();
		const next = angel.step(apple.picture, seconds, rows, apple.drives?.[0] ?? '');
		if (next) (on ? enter : track)(next);
		if (angel.game !== game) {
			game = angel.game;
			if (game && on) say(game.title);
		}
		const now = game ? placeOf(game, rows) : undefined;
		if (now !== place) {
			place = now;
			if (now && on) say(now);
		}
		held = seconds - angel.since;
		if (!on) return;
		if (state?.auto && !autoDone && seconds - angel.since >= 1) {
			autoDone = true;
			move(state.auto);
		}
		const keys = angel.probe(seconds);
		if (keys) apple.type(keys);
	}

	/** @param {SubmitEvent} ev */
	function answer(ev) {
		ev.preventDefault();
		const a = state?.ask;
		if (!a) return;
		const typed = value.trim();
		// Nothing said in the chat: Return flips one of the panel's 120 bits, which twists the dance.
		if (a.keep && !typed) {
			apple.flip(Math.floor(Math.random() * 120));
			return;
		}
		const v = a.upper ? typed.toUpperCase() : typed;
		if (state?.id === 'name' && !v) return;
		say(a.reply ? fillReply(a.reply, typed) : v);
		apple.type(askKeys(a, v));
		if (a.keep) {
			value = '';
			field?.focus({ preventScroll: true });
		} else answered = true;
	}

	/** Typing outside any other field goes to the angel's field while it asks. @param {KeyboardEvent} ev */
	function onkeydown(ev) {
		if (!on || !ask || !field || ev.defaultPrevented || ev.ctrlKey || ev.metaKey || ev.altKey) return;
		const t = /** @type {HTMLElement | null} */ (ev.target);
		if (t === field || (t && (t.closest('input, textarea, select, [contenteditable]') || (t.tagName === 'BUTTON' && (ev.key === 'Enter' || ev.key === ' '))))) return;
		if (ev.key.length !== 1 && ev.key !== 'Enter' && ev.key !== 'Backspace') return;
		field.focus({ preventScroll: true });
	}

	/** The last request clicked, and when: a second click on it soon after sends it. */
	let usedLast = { text: '', at: 0 };
	const AGAIN_MS = 600;

	/** One click puts the request in the field; the same one clicked again soon after sends it. @param {string} example */
	function use(example) {
		const now = performance.now();
		const again = usedLast.text === example && value === example && now - usedLast.at < AGAIN_MS;
		usedLast = { text: example, at: now };
		value = example;
		field?.focus({ preventScroll: true });
		if (again) {
			usedLast = { text: '', at: 0 };
			field?.form?.requestSubmit();
		}
	}

	/** @param {boolean} v */
	function setOn(v) {
		on = v;
		localStorage.setItem(ON, v ? 'on' : 'off');
		// On again: the state is where the game is now, followed while off; no fresh start.
		if (v && state) {
			if (state.music) apple.dance?.mode(state.music);
			if (state.speed) apple.speed(state.speed, state.frames ?? 0);
			tick().then(() => field?.focus({ preventScroll: true }));
		} else if (!v) hush();
	}

	/** @param {boolean} v */
	function setSpeaking(v) {
		speaking = v;
		localStorage.setItem(SPEAK, v ? 'on' : 'off');
		if (!v) hush();
	}

	onMount(() => {
		on = localStorage.getItem(ON) !== 'off';
		speaking = localStorage.getItem(SPEAK) !== 'off';
		let gone = false;
		loadAngel(path).then(
			(a) => {
				if (gone) return;
				angel = a;
				enter(a.state);
			},
			(e) => (failed = e instanceof Error ? e.message : String(e))
		);
		const timer = setInterval(step, 200);
		return () => {
			gone = true;
			clearInterval(timer);
			apple.locked = '';
			moves = null;
		};
	});
</script>

<svelte:window
	onpointerdowncapture={payOwed}
	onkeydowncapture={(ev) => {
		payOwed();
		onkeydown(ev);
	}}
/>

<section class="angel" aria-label="Screen angel">
	<div class="bar">
		<label><input type="checkbox" checked={on} onchange={(e) => setOn(e.currentTarget.checked)} /> Screen angel</label>
		<label><input type="checkbox" checked={speaking} disabled={!on} onchange={(e) => setSpeaking(e.currentTarget.checked)} /> Speak</label>
		{#if on && speaking}<VoicePicker /><VoiceTone />{/if}
		{#if on && state}<span class="where" title="The screen angel's state, and Apple time spent in it">{state.id} · {Math.floor(held / 60)}:{String(Math.floor(held % 60)).padStart(2, '0')}</span>{/if}
	</div>
	{#if on}
		<p class="say" aria-live="polite">{state?.say ?? 'Watching the screen.'}</p>
		{@render controls?.()}
		{#if game}<AdventurePad {game} {place} />{/if}
		{#if ask}
			<form onsubmit={answer}>
				<label>
					<span>{ask.label}</span>
					<input bind:this={field} bind:value maxlength={ask.maxlength} autocomplete="off" spellcheck="false" class={{ upper: ask.upper }} />
				</label>
				<button type="submit" disabled={state?.id === 'name' && !value.trim()}>OK</button>
				{#if ask.hint}<small>{ask.hint}</small>{/if}
				{#if ask.examples?.length || ask.groups?.length}
					{@const count = (ask.examples?.length ?? 0) + (ask.groups ?? []).reduce((n, g) => n + g.examples.length, 0)}
					<details
						class="requests"
						open={requestsOpen}
						ontoggle={(e) => {
							requestsOpen = e.currentTarget.open;
							globalThis.localStorage?.setItem(REQUESTS, requestsOpen ? 'open' : 'closed');
						}}
					>
						<summary>{count} {count === 1 ? 'request' : 'requests'} to pick from: click one to put it in the field, double-click to send it</summary>
						{#if ask.examples?.length}
							<p class="examples">
								{#each ask.examples as e (e)}
									<button type="button" class="example" title="Click to put this in the field; double-click to send it" onclick={() => use(e)}>{e}</button>
								{/each}
							</p>
						{/if}
						{#each ask.groups ?? [] as g (g.label)}
							<div class="group">
								<h4>{g.label}</h4>
								<p class="examples">
									{#each g.examples as e (e)}
										<button type="button" class="example" title="Click to put this in the field; double-click to send it" onclick={() => use(e)}>{e}</button>
									{/each}
								</p>
							</div>
						{/each}
					</details>
				{/if}
			</form>
		{/if}
	{:else}
		<p class="say">Off: the keyboard goes to the Apple and every move is shown.</p>
		{@render controls?.()}
		{#if game}<AdventurePad {game} {place} />{/if}
	{/if}
	{#if failed}<p class="say failed">{failed}</p>{/if}
	{#if guide}
		<details
			class="guide"
			open={guideOpen}
			ontoggle={(e) => {
				guideOpen = e.currentTarget.open;
				globalThis.localStorage?.setItem(GUIDE, guideOpen ? 'open' : 'closed');
			}}
		>
			<summary>Guide</summary>
			{@render guide()}
		</details>
	{/if}
</section>

<style>
	.guide {
		margin-top: 0.4rem;
	}
	.guide > summary {
		cursor: pointer;
		font-weight: 600;
	}
	.guide > :global(:not(summary)) {
		max-width: 52rem;
	}
	.angel {
		margin-top: 0.6rem;
		padding: 0.5rem 0.7rem;
		border: 1px solid #1f3a20;
		border-radius: 4px;
		font: 0.9rem system-ui, sans-serif;
	}
	/* Wraps rather than squeezing: each control keeps its own size, the labels stay on one line. */
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 1rem;
		font-size: 0.8rem;
		opacity: 0.85;
	}
	.bar > label {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		white-space: nowrap;
	}
	.bar > :global(*) {
		flex: none;
	}
	.where {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
		opacity: 0.7;
	}
	.say {
		margin: 0.4rem 0 0;
		line-height: 1.4;
	}
	form {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 0.5rem;
		margin-top: 0.5rem;
	}
	form label {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	form span {
		font-weight: 600;
		white-space: nowrap;
	}
	input:not([type]) {
		flex: 1;
		min-width: 12rem;
		font: 1rem ui-monospace, monospace;
	}
	.requests {
		flex-basis: 100%;
	}
	.requests summary {
		cursor: pointer;
		font-size: 0.8rem;
		opacity: 0.75;
	}
	.examples {
		flex-basis: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin: 0;
	}
	.group {
		flex-basis: 100%;
		margin-top: 0.35rem;
	}
	.group h4 {
		margin: 0 0 0.1rem;
		font-size: 0.8rem;
		font-weight: 600;
		opacity: 0.75;
	}
	.example {
		max-width: 100%;
		padding: 0;
		border: 0;
		background: none;
		color: #8fd88f;
		font: 0.85rem ui-monospace, monospace;
		line-height: 1.35;
		text-align: left;
		text-decoration: underline;
		cursor: pointer;
	}
	.upper {
		text-transform: uppercase;
	}
	small {
		flex-basis: 100%;
		opacity: 0.75;
	}
	.failed {
		color: #e8a070;
	}
</style>
