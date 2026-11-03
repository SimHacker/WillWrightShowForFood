<script>
	/**
	 * A screen angel beside microM8: it watches the machine's own 560x192 pixels, keeps the
	 * game's state from what it sees, says what the game wants, makes the moves it can make
	 * alone and asks for typed answers in a page field while the machine's keyboard is off.
	 * Turned off, the player has the machine and every move to themselves.
	 */
	import { onMount, tick } from 'svelte';
	import { askKeys, fillNow } from '@wwsff/cabinet/angel';
	import { microM8 } from '../microm8.svelte.js';
	import { loadAngel } from '../angels.js';

	/** @typedef {import('@wwsff/cabinet/angel').StateSpec} StateSpec */

	/**
	 * @type {{
	 *   path: string,
	 *   move: (label: string) => void,
	 *   moves?: string[] | null,
	 * }}
	 */
	let { path, move, moves = $bindable(null) } = $props();

	const ON = 'screen-angel';
	const SPEAK = 'screen-angel-speak';
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
	let last = 0;
	let autoDone = false;

	const ask = $derived(on && !answered ? state?.ask : undefined);

	$effect(() => {
		moves = on && state ? (state.moves ?? []) : null;
	});
	$effect(() => {
		microM8.locked = on && state?.lock ? LOCKED : '';
	});

	const hush = () => typeof speechSynthesis !== 'undefined' && speechSynthesis.cancel();

	/** Said before the page had a click or key, which browsers keep quiet: said on the first. */
	let owed = '';

	/** @param {string} text */
	function say(text) {
		if (!speaking || !text || typeof speechSynthesis === 'undefined') return;
		if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
			owed = text;
			return;
		}
		speechSynthesis.cancel();
		speechSynthesis.speak(new SpeechSynthesisUtterance(text));
	}

	function payOwed() {
		const text = owed;
		owed = '';
		if (text && on) say(text);
	}

	/** @param {StateSpec} s */
	async function enter(s) {
		state = s;
		answered = false;
		autoDone = false;
		value = s.ask?.default ? fillNow(s.ask.default) : '';
		owed = '';
		say(s.speak ?? s.ask?.speak ?? '');
		if (s.speed) microM8.speed(s.speed);
		if (s.ask) {
			await tick();
			field?.focus();
			field?.select();
		}
	}

	function step() {
		if (!on || !angel || microM8.phase !== 'running') return;
		const seconds = microM8.seconds();
		if (seconds + 1 < last) {
			angel.reset(seconds);
			enter(angel.state);
		}
		last = seconds;
		const next = angel.step(microM8.picture, seconds);
		if (next) enter(next);
		held = seconds - angel.since;
		if (state?.auto && !autoDone && seconds - angel.since >= 1) {
			autoDone = true;
			move(state.auto);
		}
	}

	/** @param {SubmitEvent} ev */
	function answer(ev) {
		ev.preventDefault();
		const a = state?.ask;
		if (!a) return;
		const v = a.upper ? value.toUpperCase() : value;
		say(v);
		microM8.type(askKeys(a, v));
		if (a.keep) value = '';
		else answered = true;
	}

	/** @param {string} example */
	function use(example) {
		value = example;
		field?.focus();
	}

	/** @param {boolean} v */
	function setOn(v) {
		on = v;
		localStorage.setItem(ON, v ? 'on' : 'off');
		if (v && angel) {
			angel.reset(microM8.seconds());
			enter(angel.state);
		} else hush();
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
			microM8.locked = '';
			moves = null;
		};
	});
</script>

<svelte:window onpointerdowncapture={payOwed} onkeydowncapture={payOwed} />

<section class="angel" aria-label="Screen angel">
	<div class="bar">
		<label><input type="checkbox" checked={on} onchange={(e) => setOn(e.currentTarget.checked)} /> Screen angel</label>
		<label><input type="checkbox" checked={speaking} disabled={!on} onchange={(e) => setSpeaking(e.currentTarget.checked)} /> Speak</label>
		{#if on && state}<span class="where" title="The screen angel's state, and Apple time spent in it">{state.id} · {Math.floor(held / 60)}:{String(Math.floor(held % 60)).padStart(2, '0')}</span>{/if}
	</div>
	{#if on}
		<p class="say" aria-live="polite">{state?.say ?? 'Watching the screen.'}</p>
		{#if ask}
			<form onsubmit={answer}>
				<label>
					<span>{ask.label}</span>
					<input bind:this={field} bind:value maxlength={ask.maxlength} autocomplete="off" spellcheck="false" class={{ upper: ask.upper }} />
				</label>
				<button type="submit">OK</button>
				{#if ask.hint}<small>{ask.hint}</small>{/if}
				{#if ask.examples?.length}
					<p class="examples">
						{#each ask.examples as e (e)}
							<button type="button" class="example" title="Put this in the field" onclick={() => use(e)}>{e}</button>
						{/each}
					</p>
				{/if}
			</form>
		{/if}
	{:else}
		<p class="say">Off: the keyboard goes to the Apple and every move is shown.</p>
	{/if}
	{#if failed}<p class="say failed">{failed}</p>{/if}
</section>

<style>
	.angel {
		margin-top: 0.6rem;
		padding: 0.5rem 0.7rem;
		border: 1px solid #1f3a20;
		border-radius: 4px;
		font: 0.9rem system-ui, sans-serif;
	}
	.bar {
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
		opacity: 0.85;
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
	.examples {
		flex-basis: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 1rem;
		margin: 0;
	}
	.example {
		padding: 0;
		border: 0;
		background: none;
		color: #8fd88f;
		font: 0.85rem ui-monospace, monospace;
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
