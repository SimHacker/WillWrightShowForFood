<script>
	/**
	 * The bus dance as a node of the machine's outline. Its heading row has the play/stop button,
	 * so the dance starts and stops with the node closed; closing it never stops the dance. Inside:
	 * play/stop again, the volume, style, Eno tracks, tempo and listened words, `extra` (the
	 * Apple's Prompts switch), and the music seed: the machine's switches, jiggled, copied as a
	 * line for a cartridge's definition or as a link, pasted back, and kept as named favorites.
	 */
	import Outline from './Outline.svelte';
	import Pinnable from './Pinnable.svelte';
	import { toolbar } from './toolbar.svelte.js';
	import RateSlider from './RateSlider.svelte';
	import { STYLES } from './bus-dance.svelte.js';
	import { TEMPOS } from './dance-player.js';
	import { seedFavorites } from './seed-favorites.svelte.js';

	/**
	 * A machine's switches as a music seed. `text` is the line for a cartridge's definition,
	 * `digits` the seed alone (for ?seed=), `paste` sets the switches from text that names a seed
	 * and is false when it names none, `where` says where the line goes, and `machine` keys the
	 * favorites.
	 * @typedef {{ machine: string, text: () => string, digits: () => string, paste: (text: string) => boolean, where: string }} Seed
	 */
	/** @type {{ id: string, title?: string, dance: import('./bus-dance.svelte.js').BusDance, chip?: boolean, listen?: boolean, twist?: boolean, jiggle?: () => void, seed?: Seed, extra?: import('svelte').Snippet, move?: (id: string, to: string | number) => void, opened?: boolean }} */
	let { id, title = 'Dance', dance, chip = false, listen = false, twist = false, jiggle, seed, extra, move, opened = false } = $props();

	const rates = TEMPOS.map((bpm) => ({ label: String(bpm), title: `${bpm} beats a minute, sixteenths ${Math.round(15000 / bpm)} ms apart` }));
	const tempoIndex = $derived(Math.max(0, TEMPOS.indexOf(dance.bpm)));
	const styleLabel = $derived(STYLES.find((s) => s.id === dance.style)?.label ?? dance.style);
	const summary = $derived(dance.on ? `${dance.muted ? 'muted' : 'playing'} · ${styleLabel} · ${dance.bpm} bpm${twist && dance.twist ? ` · ${dance.twist}` : ''}` : 'stopped');

	// The dance's controls, offered to the machine's toolbar and placed at home here.
	const bar = $derived(toolbar(id));
	$effect(() => {
		const here = [`${id}-dance`];
		const inSeed = [`${id}-dance`, `${id}-dance-seed`];
		const off = [
			bar.offer('dance-play', 'Play the dance', play, 'control', here),
			bar.offer('dance-mute', 'Mute the dance', mute, 'control', here),
			bar.offer('dance-volume', "the dance's volume", volume, 'control', here),
			bar.offer('dance-style', "the dance's style", style, 'control', here),
			bar.offer('dance-tempo', "the dance's tempo", tempo, 'control', here),
			bar.offer('eno', 'the Eno tracks', eno, 'control', here)
		];
		if (seed || jiggle || twist) off.push(bar.offer('music-seed', 'Music seed', seedPanel, 'panel', inSeed));
		if (jiggle) off.push(bar.offer('jiggle', 'Jiggle', jiggler, 'control', inSeed));
		if (seed) off.push(bar.offer('seed-copy', 'Copy seed', copier, 'control', inSeed), bar.offer('seed-paste', 'Paste seed', paster, 'control', inSeed));
		return () => off.forEach((f) => f());
	});

	const favorites = $derived(seed ? seedFavorites(seed.machine) : null);
	/** The favorite last picked, added or renamed; -1 for none. */
	let picked = $state(-1);
	/** The seed's digits as last read, for the seed node's summary. */
	const digits = $derived(seed ? seed.digits() : '');

	/** What the last copy, paste or favorite did, for a moment. */
	let said = $state('');
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let saidTimer;
	/** @param {string} what */
	function say(what) {
		said = what;
		clearTimeout(saidTimer);
		saidTimer = setTimeout(() => (said = ''), 2500);
	}

	/** This page's address with the seed in it. @param {Seed} s */
	function seedLink(s) {
		const url = new URL(location.href);
		url.searchParams.set('seed', s.digits());
		return url.href;
	}

	/** @param {Seed} s @param {boolean} [link] */
	async function copySeed(s, link = false) {
		const text = link ? seedLink(s) : s.text();
		try {
			await navigator.clipboard.writeText(text);
			say(`copied ${text}`);
		} catch {
			window.prompt('Copy this music seed:', text);
		}
	}

	/** The clipboard's text, or what the person types when the browser won't hand it over. @param {Seed} s */
	async function pasteSeed(s) {
		let text = null;
		try {
			text = await navigator.clipboard.readText();
		} catch {
			text = window.prompt('Paste a music seed:', '');
		}
		if (text === null) return;
		say(s.paste(text) ? `pasted ${text.trim()}` : 'no seed on the clipboard');
	}

	/** @param {Seed} s */
	function addFavorite(s) {
		if (!favorites) return;
		const name = window.prompt('Name this music seed:', `${document.title.replace(/ — .*$/, '')} ${favorites.list.length + 1}`);
		if (!name?.trim()) return;
		picked = favorites.add(name.trim(), s.digits());
		say(`kept ${name.trim()}`);
	}

	/** @param {Seed} s @param {number} i */
	function useFavorite(s, i) {
		const f = favorites?.list[i];
		if (!f) return;
		picked = i;
		say(s.paste(f.seed) ? `${f.name}: ${f.seed}` : `${f.name} is not a seed for this machine`);
	}

	function renameFavorite() {
		const f = favorites?.list[picked];
		if (!favorites || !f) return;
		const name = window.prompt(`Rename ${f.name}:`, f.name);
		if (name?.trim()) favorites.rename(picked, name.trim());
	}

	function deleteFavorite() {
		const f = favorites?.list[picked];
		if (!favorites || !f || !window.confirm(`Delete the favorite ${f.name}?`)) return;
		favorites.remove(picked);
		picked = -1;
	}
</script>

<!-- The dance's controls; compact is the toolbar's look. -->
{#snippet play(compact = false)}
	<button
		type="button"
		class={{ chip, on: dance.on }}
		aria-pressed={dance.on}
		aria-label={dance.on ? 'Stop the dance' : 'Play the dance'}
		title={dance.on ? 'Stop the bus dance' : "Play the bus dance: hear the machine work, each part its own instrument"}
		onpointerdown={(e) => e.preventDefault()}
		onclick={() => dance.toggle()}>{dance.on ? '⏹️' : '▶️'}{compact ? '💃' : dance.on ? ' Stop' : ' Play'}</button
	>
{/snippet}

{#snippet mute(compact = false)}
	<button
		type="button"
		class={{ chip, on: dance.muted }}
		aria-pressed={dance.muted}
		aria-label="Mute the dance"
		title={dance.muted ? 'Unmute the dance' : "Mute the dance: it goes on playing, silent; the machine's own sound is separate"}
		onclick={() => (dance.muted = !dance.muted)}>{dance.muted ? '🔇' : '🎶'}{compact ? '' : dance.muted ? ' Muted' : ' Mute'}</button
	>
{/snippet}

{#snippet volume(compact = false)}
	<label class="volume" title="The dance's volume, {Math.round(dance.volume * 100)}%; the machine's own sound is separate">
		{compact ? '🎶' : 'Volume'}
		<input
			class={{ short: compact }}
			type="range"
			min="0"
			max="1"
			step="0.05"
			aria-label="The dance's volume"
			value={dance.volume}
			oninput={(e) => (dance.volume = Number(e.currentTarget.value))}
		/>
		{#if !compact}<span class="num">{Math.round(dance.volume * 100)}%</span>{/if}
	</label>
{/snippet}

{#snippet style()}
	<select
		aria-label="Dance style"
		class={{ chip }}
		title={STYLES.find((s) => s.id === dance.style)?.title}
		value={dance.style}
		onchange={(e) => dance.setStyle(/** @type {import('@wwsff/cabinet/dance').Style} */ (e.currentTarget.value))}
	>
		{#each STYLES as s (s.id)}
			<option value={s.id} title={s.title}>{s.label}</option>
		{/each}
	</select>
{/snippet}

{#snippet tempo()}
	<RateSlider label="Dance tempo, slowest to fastest" keys="Keys: ` slower, ~ faster." {rates} index={tempoIndex} onpick={(i) => (dance.bpm = TEMPOS[i] ?? 120)} />
{/snippet}

{#snippet jiggler(compact = false)}
	<button
		type="button"
		class={{ chip }}
		aria-label="Jiggle"
		title="Jiggle: flip one of the machine's switches at random, which twists the music. A program that reads them as controls feels it too."
		onpointerdown={(e) => e.preventDefault()}
		onclick={jiggle}>🎲{compact ? '' : ' Jiggle'}</button
	>
{/snippet}

{#snippet copier(compact = false)}
	{#if seed}
		<button
			type="button"
			class={{ chip }}
			aria-label="Copy seed"
			title="Copy the switches as a music seed, a line to paste into {seed.where}"
			onpointerdown={(e) => e.preventDefault()}
			onclick={() => copySeed(seed)}>📋{compact ? '' : ' Copy seed'}</button
		>
	{/if}
{/snippet}

{#snippet paster(compact = false)}
	{#if seed}
		<button
			type="button"
			class={{ chip }}
			aria-label="Paste seed"
			title="Set the switches from a music seed on the clipboard: the line Copy seed gives, or just its digits"
			onpointerdown={(e) => e.preventDefault()}
			onclick={() => pasteSeed(seed)}>📥{compact ? '' : ' Paste seed'}</button
		>
	{/if}
{/snippet}

{#snippet eno()}
	<span class="eno" role="group" aria-label="Eno tracks, each on or off">
		{#each dance.tracks as track, i (track.id)}
			{@const on = (dance.loops & (1 << i)) !== 0}
			<button
				type="button"
				aria-pressed={on}
				class={{ chip, on }}
				title={[`EN${i} ${track.name}`, ...(track.card?.length ? ['', ...track.card] : []), '', `${track.description}.`, `${on ? 'On: click to turn it off' : 'Off: click to turn it on'}; each track is on or off by itself.`].join('\n')}
				onclick={() => dance.toggleLayer(1 << i)}>EN{i}</button
			>
		{/each}
	</span>
{/snippet}

<!-- The music seed: jiggle, copy and paste, favorites. -->
{#snippet seedPanel(compact = false)}
		<div class="row">
			<Pinnable {bar} id="jiggle" />
			<Pinnable {bar} id="seed-copy" />
			{#if seed}
				<button
					type="button"
					class={{ chip }}
					title="Copy this page's address with ?seed= and the switches in it: whoever opens it starts with this music"
					onpointerdown={(e) => e.preventDefault()}
					onclick={() => copySeed(seed, true)}>🔗 Copy link</button
				>
			{/if}
			<Pinnable {bar} id="seed-paste" />
		</div>
		{#if seed && favorites}
			<div class="row">
				<select
					aria-label="Favorite music seeds"
					class={{ chip }}
					title="Seeds kept in this browser. Pick one to set the switches."
					value={String(picked)}
					onchange={(e) => useFavorite(seed, Number(e.currentTarget.value))}
				>
					<option value="-1">{favorites.list.length ? 'Favorites…' : 'No favorites yet'}</option>
					{#each favorites.list as f, i (i)}
						<option value={String(i)}>{f.name}</option>
					{/each}
				</select>
				<button type="button" class={{ chip }} title="Keep the switches as a favorite, under a name" onclick={() => addFavorite(seed)}>⭐ Add</button>
				<button type="button" class={{ chip }} disabled={picked < 0} title="Rename the picked favorite" onclick={renameFavorite}>Rename</button>
				<button type="button" class={{ chip }} disabled={picked < 0} title="Delete the picked favorite" onclick={deleteFavorite}>Delete</button>
			</div>
		{/if}
		{#if said}<p class="said" role="status">{said}</p>{/if}
{/snippet}

<Outline id="{id}-dance" {title} hint="The bus dance: the machine's work as music" {summary} actions={play} {move} {opened}>
	<div class="row">
		<Pinnable {bar} id="dance-play" />
		<Pinnable {bar} id="dance-mute" />
		<Pinnable {bar} id="dance-volume" />
	</div>
	<div class="row">
		<Pinnable {bar} id="dance-style" />
		<Pinnable {bar} id="eno" />
		<Pinnable {bar} id="dance-tempo" />
	</div>
	{#if listen || extra}
		<div class="row">
			{#if listen}
				<input
					class={['listen', { chip }]}
					aria-label="Words to listen to"
					title="Words in core the dance listens to, by name: labels, or Forth variables and constants. Each one gets its own quiet loop that steps along as its value changes. name!0-99 sings its value as a pitch instead, at once when it changes; name~0-99 whistles it now and then."
					placeholder="listen to…"
					size="16"
					value={dance.listen}
					onchange={(e) => (dance.listen = e.currentTarget.value)}
					onkeydown={(e) => e.stopPropagation()}
				/>
			{/if}
			{#if extra}{@render extra()}{/if}
		</div>
	{/if}
	{#if seed || jiggle || twist}
		<Outline id="{id}-dance-seed" title="Music seed" hint="The switches twist the music: their word is hashed, so every combination skews, phases and picks its own effects. All off is the plain dance." summary={[digits, twist ? dance.twist || 'all off, plain' : ''].filter(Boolean).join(' · ')} pin={{ bar, id: 'music-seed' }}>
			{@render seedPanel(false)}
		</Outline>
	{/if}
</Outline>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		margin: 0.2rem 0;
	}
	button.on {
		background: #cfc;
		color: #000;
	}
	.chip {
		font: inherit;
		font-size: 0.62rem;
		height: 1.4rem;
		padding: 0 0.4em;
		border: 1px solid #555;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}
	.chip:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.chip.on {
		background: #9fe8a0;
		border-color: #9fe8a0;
		color: #000;
	}
	.volume {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}
	.short {
		width: 4.5rem;
	}
	.num {
		min-width: 4ch;
		font-variant-numeric: tabular-nums;
	}
	.said {
		margin: 0.2rem 0;
		font-size: 0.85em;
		opacity: 0.75;
		overflow-wrap: anywhere;
	}
	/* One row of joined buttons, a layer each. */
	.eno {
		display: inline-flex;
	}
	/* A fixed size, lit or not, so a row of them never shifts as they toggle: one border
	   between neighbors (each overlaps the one before by its width), the same grey lit or
	   not, and the lit one drawn over its neighbors so its edge shows whole. */
	.eno button {
		position: relative;
		box-sizing: border-box;
		width: 3.2em;
		margin: 0;
		padding: 0;
		border: 1px solid #777;
		font-weight: normal;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
	.eno button.on {
		z-index: 1;
		border-color: #777;
	}
	.eno button:focus-visible {
		z-index: 2;
	}
	.eno button + button,
	.eno button.on + button,
	.eno button + button.on {
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
</style>
