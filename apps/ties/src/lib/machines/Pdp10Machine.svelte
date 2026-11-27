<script>
	/**
	 * The PDP-10 running an entry of packages/cabinet/its/catalog.yml: ITS on the cabinet's KA10,
	 * logged in and at the entry's program, or a RIM tape on the bare machine. The console
	 * teletype is the screen; under it the toolbar, then the outline: the programs and what to
	 * type into them, the console (paper or a glass screen, its baud rate, speaking and its bell),
	 * how it runs (and the data switches), the bus dance, the packs, the tests, preferences and
	 * About. Anything with a 📌 goes in the toolbar.
	 */
	import { onMount, tick } from 'svelte';
	import { launchUrl } from '@wwsff/catalog';
	import { dataSwitchesSeedText, dataSwitchesSeedWord } from '@wwsff/cabinet/dance';
	import AboutPanel from '../AboutPanel.svelte';
	import DancePanel from '../DancePanel.svelte';
	import MachineToolbar from '../MachineToolbar.svelte';
	import Outline from '../Outline.svelte';
	import PagePrefs from '../PagePrefs.svelte';
	import Pinnable from '../Pinnable.svelte';
	import VoicePicker from '../VoicePicker.svelte';
	import { toolbar } from '../toolbar.svelte.js';
	import { CATALOG_BASE, catalog } from '../catalog.js';
	import { PROGRAMS } from '../its-programs.js';
	import { BAUDS, SPEEDS, VIEWS, pdp10 } from '../pdp10.svelte.js';

	/** @type {{ entry: import('@wwsff/catalog').Entry, values: Record<string, unknown> }} */
	let { entry, values } = $props();

	const tape = $derived(entry.runs?.boot === 'tape');
	const mine = $derived(String(entry.runs?.program ?? 'ddt'));
	const programs = $derived([...PROGRAMS].sort((a, b) => Number(b.id === mine) - Number(a.id === mine)));
	const hhtest = catalog.entry('hhtest');
	const its = catalog.entry('its');

	const ORDER = ['pdp10-programs', 'pdp10-console', 'pdp10-run', 'pdp10-dance', 'pdp10-disks', 'pdp10-tests', 'pdp10-prefs', 'pdp10-about'];
	const ORDER_KEY = 'pdp10-outline-order';
	/** @type {string[]} */
	let order = $state(keptOrder());
	function keptOrder() {
		try {
			const kept = JSON.parse(globalThis.localStorage?.getItem(ORDER_KEY) ?? '[]');
			const known = Array.isArray(kept) ? kept.filter((k) => ORDER.includes(k)) : [];
			// A node added since the order was kept goes after the one it follows in ORDER.
			for (const [i, k] of ORDER.entries()) if (!known.includes(k)) known.splice(i ? known.indexOf(ORDER[i - 1]) + 1 : 0, 0, k);
			return known;
		} catch {
			return [...ORDER];
		}
	}
	/** Move node `id` before node `to`, or one place up (-1) or down (1). @param {string} id @param {string | number} to */
	function moveNode(id, to) {
		const from = order.indexOf(id);
		if (from < 0) return;
		const rest = order.filter((k) => k !== id);
		const at = typeof to === 'number' ? Math.max(0, Math.min(rest.length, from + to)) : rest.indexOf(to);
		if (at < 0) return;
		rest.splice(at, 0, id);
		order = rest;
		try {
			globalThis.localStorage?.setItem(ORDER_KEY, JSON.stringify(order));
		} catch {
			/* Storage forbidden: the order lasts until the page goes. */
		}
	}

	const PREF_KEYS = [/^toolbar-pdp10$/, /^pdp10-/, /^outline:pdp10-/];
	const PACK_NAMES = ['rp03.2', 'rp03.3', 'rp03.0', 'rp03.1'];

	/** @type {HTMLElement | undefined} */
	let paper = $state();
	let copied = $state(false);
	let focused = $state(false);

	/** The paper's height in pixels, the person's, kept; null is the default. */
	const HEIGHT_KEY = 'pdp10-paper-height';
	const MIN_HEIGHT = 100;
	/** @type {number | null} */
	let height = $state(readHeight());
	/** @type {{ y: number, from: number } | null} */
	let sizing = $state(null);

	function readHeight() {
		const n = Number(globalThis.localStorage?.getItem(HEIGHT_KEY));
		return Number.isFinite(n) && n >= MIN_HEIGHT ? n : null;
	}
	/** Set the height, keeping the newest line in sight if it was. @param {number | null} to */
	function resize(to) {
		const el = paper;
		const bottom = !!el && el.scrollHeight - el.scrollTop - el.clientHeight < 4;
		height = to === null ? null : Math.round(Math.max(MIN_HEIGHT, to));
		if (bottom) tick().then(() => el && (el.scrollTop = el.scrollHeight));
	}
	function keepHeight() {
		try {
			if (height === null) globalThis.localStorage?.removeItem(HEIGHT_KEY);
			else globalThis.localStorage?.setItem(HEIGHT_KEY, String(height));
		} catch {
			/* Storage forbidden: the height lasts until the page goes. */
		}
	}
	/** @param {PointerEvent} e */
	function gripdown(e) {
		if (e.button !== 0 || !paper) return;
		e.preventDefault();
		/** @type {HTMLElement} */ (e.currentTarget).setPointerCapture(e.pointerId);
		sizing = { y: e.clientY, from: paper.offsetHeight };
	}
	/** @param {PointerEvent} e */
	function gripmove(e) {
		if (sizing) resize(sizing.from + e.clientY - sizing.y);
	}
	function gripup() {
		if (!sizing) return;
		sizing = null;
		keepHeight();
	}
	/** A line at a time, five with Shift. @param {KeyboardEvent} e */
	function gripkey(e) {
		if (!paper || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
		e.preventDefault();
		const line = 1.25 * parseFloat(getComputedStyle(paper).fontSize);
		resize(paper.offsetHeight + (e.key === 'ArrowDown' ? 1 : -1) * line * (e.shiftKey ? 5 : 1));
		keepHeight();
	}

	/** A click on the paper is for typing, unless it was to select text to copy. */
	function onpointerup() {
		if (!globalThis.getSelection?.()?.toString()) paper?.focus({ preventScroll: true });
	}

	/** Keys typed with nothing else taking them go to the console too. @param {KeyboardEvent} e */
	function onwindowkey(e) {
		if (e.target === document.body || e.target === document.documentElement) onkeydown(e);
	}

	const restart = () => pdp10.start(entry, values);

	/** @param {KeyboardEvent} e */
	function onkeydown(e) {
		if (e.metaKey) return;
		let s = '';
		if (e.key === 'Enter') s = '\r';
		else if (e.key === 'Escape') s = '\x1b';
		else if (e.key === 'Backspace' || e.key === 'Delete') s = '\x7f';
		else if (e.key === 'Tab') s = '\t';
		else if (e.ctrlKey && e.key.length === 1) {
			const c = e.key.toUpperCase().charCodeAt(0);
			if (c >= 64 && c < 96) s = String.fromCharCode(c - 64);
		} else if (e.key.length === 1 && !e.altKey) s = e.key;
		if (!s) return;
		e.preventDefault();
		pdp10.type(s);
	}

	/** @param {ClipboardEvent} e */
	function onpaste(e) {
		const text = e.clipboardData?.getData('text/plain');
		if (!text) return;
		e.preventDefault();
		pdp10.type(text.replace(/\r?\n/g, '\r'));
	}

	/** @param {string} keys */
	function send(keys) {
		pdp10.type(keys);
		paper?.focus();
	}

	async function copyPaper() {
		await navigator.clipboard.writeText(pdp10.text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	// The paper follows what is printed, unless the person has scrolled back to read.
	let following = true;
	$effect.pre(() => {
		void pdp10.lines;
		if (paper) following = paper.scrollHeight - paper.scrollTop - paper.clientHeight < 40;
		tick().then(() => {
			if (paper && following) paper.scrollTop = paper.scrollHeight;
		});
	});

	const bar = toolbar('pdp10');
	$effect(() => {
		/** @type {Record<string, import('svelte').Snippet<[boolean]>>} */
		const panels = { ddt: ddtPanel, macsyma: macsymaPanel, lisp: lispPanel, logo: logoPanel };
		const off = [
			bar.offer('restart', 'Start again', restartButton, 'control', ['pdp10-run']),
			bar.offer('speed', 'Speed', speedMenu, 'control', ['pdp10-run']),
			bar.offer('baud', "the console's baud rate", baudMenu, 'control', ['pdp10-console']),
			bar.offer('tty-view', 'Paper or glass', viewSwitch, 'control', ['pdp10-console']),
			bar.offer('tty-speak', 'Speak', speakToggle, 'control', ['pdp10-console']),
			bar.offer('tty-bell', 'The bell', bellToggle, 'control', ['pdp10-console']),
			bar.offer('pdp10-switches', 'Data switches', switchesPanel, 'panel', ['pdp10-run']),
			bar.offer('altmode', 'Altmode', altmodeKey, 'control', ['pdp10-programs', 'pdp10-prog-ddt']),
			bar.offer('ctrl-z', 'Control-Z', ctrlZKey, 'control', ['pdp10-programs', 'pdp10-prog-ddt']),
			bar.offer('ctrl-g', 'Control-G', ctrlGKey, 'control', ['pdp10-programs', 'pdp10-prog-ddt']),
			bar.offer('copy-paper', 'Copy the paper', copyButton, 'control', ['pdp10-run']),
			bar.offer('readout', 'the speed readout', readout, 'control', ['pdp10-run']),
			bar.offer('pdp10-stats', 'Running', statsPanel, 'panel', ['pdp10-run']),
			bar.offer('pdp10-packs', 'The packs', packsPanel, 'panel', ['pdp10-disks']),
			...PROGRAMS.map((p) => bar.offer(`prog-${p.id}`, p.title, panels[p.id], 'panel', ['pdp10-programs', `pdp10-prog-${p.id}`]))
		];
		return () => off.forEach((f) => f());
	});

	const mb = (/** @type {number} */ n) => `${(n / 1e6).toFixed(1)} MB`;
	const s = $derived(pdp10.stats);
	const runSummary = $derived(
		pdp10.error ? pdp10.error : pdp10.phase || (s ? `${s.mips.toFixed(1)} MIPS · ${Math.floor(s.seconds)} s simulated · ${s.fast ? 'flat out' : 'real time'}` : 'not running yet')
	);
	const disksSummary = $derived(
		tape ? 'no packs: a tape on the bare machine' : s ? `${mb(s.packs.reduce((n, p) => n + p.bytes, 0))} fetched · ${s.packs.reduce((n, p) => n + p.dirty, 0)} blocks changed` : 'not read yet'
	);

	/** The data switches as a music seed, an entry's `switches:` in its/catalog.yml. */
	const seed = {
		machine: 'pdp10',
		where: "an entry's runs in packages/cabinet/its/catalog.yml",
		text: () => `switches: "${dataSwitchesSeedText(pdp10.switches)}"`,
		digits: () => dataSwitchesSeedText(pdp10.switches),
		/** @param {string} text */
		paste: (text) => {
			const word = dataSwitchesSeedWord(text);
			if (word === null) return false;
			pdp10.setSwitches(word);
			return true;
		}
	};
	const jiggle = () => pdp10.flip(Math.floor(Math.random() * 36));

	onMount(() => {
		pdp10.start(entry, values);
		paper?.focus();
		return () => pdp10.stop();
	});
</script>

{#snippet restartButton(compact = false)}
	<button title="Start {pdp10.title || entry.title} again from the tape: everything ITS wrote is gone" onclick={restart}>{compact ? '⏻' : '⏻ Start again'}</button>
{/snippet}

{#snippet speedMenu(compact = false)}
	<label title={SPEEDS.find((x) => x.id === pdp10.speed)?.title}>
		{compact ? '⏱' : 'Speed'}
		<select value={pdp10.speed} onchange={(e) => pdp10.setSpeed(/** @type {any} */ (e.currentTarget.value))}>
			{#each SPEEDS as sp (sp.id)}<option value={sp.id} title={sp.title}>{sp.label}</option>{/each}
		</select>
	</label>
{/snippet}

{#snippet baudMenu(compact = false)}
	<label title="How fast the console prints, on this page's clock, whatever speed the KA10 runs at. {BAUDS.find((b) => b.baud === pdp10.baud)?.title}.">
		{compact ? '⌨' : 'Console'}
		<select value={pdp10.baud} onchange={(e) => pdp10.setBaud(Number(e.currentTarget.value))}>
			{#each BAUDS as b (b.baud)}<option value={b.baud} title={b.title}>{b.label}</option>{/each}
		</select>
	</label>
	{#if pdp10.waiting}
		<button title="{pdp10.waiting.toLocaleString()} characters ITS has sent are waiting to print: print them all now" onclick={() => pdp10.flush()}
			>⏩ {pdp10.waiting.toLocaleString()}</button
		>
	{/if}
{/snippet}

{#snippet viewSwitch(compact = false)}
	<span class="views" role="group" aria-label="The console: paper or glass">
		{#each VIEWS as v (v.id)}
			<button aria-pressed={pdp10.view === v.id} class={{ on: pdp10.view === v.id }} title={v.title} onclick={() => pdp10.setView(v.id)}
				>{v.id === 'paper' ? '📜' : '🖥'}{compact ? '' : ` ${v.label}`}</button
			>
		{/each}
	</span>
{/snippet}

{#snippet speakToggle(compact = false)}
	<button
		aria-pressed={pdp10.voice.speak}
		class={{ on: pdp10.voice.speak }}
		title={pdp10.voice.speak
			? 'Speaking: what ITS prints is read aloud when it pauses, not the echo of what you type. Click to stop.'
			: 'Speak: read aloud what ITS prints, when it pauses. Screen readers hear it either way.'}
		onclick={() => pdp10.voice.setSpeak(!pdp10.voice.speak)}>{pdp10.voice.speak ? '🗣' : '🤐'}{compact ? '' : ' Speak'}</button
	>
{/snippet}

{#snippet bellToggle(compact = false)}
	<button
		aria-pressed={!pdp10.bellMuted}
		class={{ ringing: pdp10.ringing }}
		title={pdp10.bellMuted ? 'The bell is muted: Control-G only flashes. Click to hear it.' : "The bell: Control-G rings a Model 33's bell. Click to mute it."}
		onclick={() => pdp10.muteBell(!pdp10.bellMuted)}>{pdp10.bellMuted ? '🔕' : '🔔'}{compact ? '' : ' Bell'}</button
	>
{/snippet}

{#snippet switchesPanel()}
	<div class="switches" role="group" aria-label="The 36 data switches, bit 0 at the left">
		{#each Array.from({ length: 12 }, (_, g) => g) as g (g)}
			<span class="triad">
				{#each [0, 1, 2] as k (k)}
					{@const bit = g * 3 + k}
					{@const on = pdp10.switchOn(bit)}
					<button
						class={['switch', { on }]}
						aria-pressed={on}
						aria-label="Data switch {bit}"
						title="Data switch {bit}: {on ? 'up' : 'down'}. A program reads the switches with .RDSW; the bus dance's music turns on them."
						onclick={() => pdp10.flip(bit)}
					></button>
				{/each}
			</span>
		{/each}
		<code class="octal" title="The switches in octal, bit 0 first">{dataSwitchesSeedText(pdp10.switches).slice(2)}</code>
	</div>
{/snippet}

{#snippet altmodeKey(compact = false)}
	<button title="Altmode, the Escape key: DDT's command character" onclick={() => send('\x1b')}>{compact ? 'Alt' : 'Altmode'}</button>
{/snippet}

{#snippet ctrlZKey(compact = false)}
	<button title="Control-Z: stop the program and go back to DDT" onclick={() => send('\x1a')}>{compact ? '^Z' : '^Z Back to DDT'}</button>
{/snippet}

{#snippet ctrlGKey(compact = false)}
	<button title="Control-G: quit what Lisp or MACSYMA is doing, back to its prompt" onclick={() => send('\x07')}>{compact ? '^G' : '^G Quit'}</button>
{/snippet}

{#snippet copyButton(compact = false)}
	<button title="Copy everything on the paper as text" onclick={copyPaper}>{copied ? '✓' : compact ? '📋' : '📋 Copy the paper'}</button>
{/snippet}

{#snippet readout()}
	<span class="readout" title="Millions of instructions a second, and whether it is running flat out or at a KA10's own pace">
		{#if s}{s.mips.toFixed(1)} MIPS {s.fast ? '⏩' : '▶'}{:else}–{/if}
	</span>
{/snippet}

{#snippet statsPanel()}
	<dl class="facts">
		<dt>Doing</dt>
		<dd>{pdp10.phase || (pdp10.running ? 'Running' : pdp10.halt ? 'Halted' : 'Stopped')}</dd>
		{#if s}
			<dt>PC</dt>
			<dd>{s.pc.toString(8).padStart(6, '0')}</dd>
			<dt>Instructions</dt>
			<dd>{s.instructions.toLocaleString()}</dd>
			<dt>Simulated</dt>
			<dd>{s.seconds.toFixed(1)} s</dd>
			<dt>Speed</dt>
			<dd>{s.mips.toFixed(2)} MIPS, {s.fast ? 'flat out' : 'real time'}</dd>
		{/if}
	</dl>
{/snippet}

{#snippet packsPanel()}
	{#if tape}
		<p class="note">This entry runs a paper tape on the bare machine; the packs are not attached.</p>
	{:else}
		<table class="packs">
			<thead><tr><th>Unit</th><th>Pack</th><th>Chunks</th><th>Fetched</th><th>Changed</th></tr></thead>
			<tbody>
				{#each PACK_NAMES as name, u (name)}
					{@const p = s?.packs[u]}
					<tr><td>{u}</td><td>{name}</td><td>{p?.chunks ?? 0}</td><td>{mb(p?.bytes ?? 0)}</td><td>{p?.dirty ?? 0} blocks</td></tr>
				{/each}
			</tbody>
		</table>
		{#if s}<p class="note">The RP10 has read {s.reads.toLocaleString()} times and written {s.writes.toLocaleString()}.</p>{/if}
	{/if}
{/snippet}

{#snippet programPanel(/** @type {import('../its-programs.js').ItsProgram} */ p)}
	<div class="program">
		<p class="note">{p.about}</p>
		<div class="row">
			{#each p.lines as line (line.label)}
				<button class="line" title="Type {line.title.toLowerCase()}" onclick={() => send(line.keys)}>{line.label}</button>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet ddtPanel()}{@render programPanel(PROGRAMS[0])}{/snippet}
{#snippet macsymaPanel()}{@render programPanel(PROGRAMS[1])}{/snippet}
{#snippet lispPanel()}{@render programPanel(PROGRAMS[2])}{/snippet}
{#snippet logoPanel()}{@render programPanel(PROGRAMS[3])}{/snippet}

{#snippet programsNode()}
	<Outline id="pdp10-programs" move={moveNode} title="ITS Commands and Programs: what to type" hint="ITS's commands, its programs and lines to type into them; a button types its line on the console" summary={PROGRAMS.find((p) => p.id === mine)?.title} opened={!tape}>
		<div class="row keys"><Pinnable {bar} id="altmode" /><Pinnable {bar} id="ctrl-z" /><Pinnable {bar} id="ctrl-g" /></div>
		{#each programs as p (p.id)}
			<Outline id="pdp10-prog-{p.id}" title={p.title} hint={p.about} opened={p.id === mine} pin={{ bar, id: `prog-${p.id}` }}>
				{@render bar.controls.get(`prog-${p.id}`)?.render(false)}
			</Outline>
		{/each}
	</Outline>
{/snippet}

{#snippet runNode()}
	<Outline id="pdp10-run" move={moveNode} title="Run: the KA10" hint="Starting again, how fast it runs, and what it has done" summary={runSummary} pin={{ bar, id: 'pdp10-stats' }}>
		<div class="row"><Pinnable {bar} id="restart" /><Pinnable {bar} id="speed" /><Pinnable {bar} id="copy-paper" /><Pinnable {bar} id="readout" /></div>
		{@render statsPanel()}
		<Outline id="pdp10-switches-node" title="Data switches" hint="The console's 36 data switches: a program reads them with .RDSW, and the bus dance's music turns on them" summary={dataSwitchesSeedText(pdp10.switches)} pin={{ bar, id: 'pdp10-switches' }}>
			{@render switchesPanel()}
		</Outline>
		<p class="note">
			The cabinet's KA10 runs many times faster than a real one, and ITS spends most of a boot waiting out its own timeouts, so Auto runs flat out while the
			console is busy and at a KA10's pace once it has been quiet, so an idle ITS doesn't keep a core busy.
		</p>

	</Outline>
{/snippet}

{#snippet consoleNode()}
	<Outline
		id="pdp10-console"
		move={moveNode}
		title="Console"
		hint="The console teletype: paper or a glass screen, how fast it prints, speaking, the bell"
		summary="{VIEWS.find((v) => v.id === pdp10.view)?.label} · {BAUDS.find((b) => b.baud === pdp10.baud)?.label}{pdp10.voice.speak ? ' · speaking' : ''}"
	>
		<div class="row"><Pinnable {bar} id="tty-view" /><Pinnable {bar} id="baud" /><Pinnable {bar} id="tty-speak" /><Pinnable {bar} id="tty-bell" /></div>
		{#if pdp10.voice.speak}<div class="row"><VoicePicker /></div>{/if}
		{#if pdp10.running && pdp10.told && pdp10.told !== pdp10.view}
			<p class="note">
				ITS still thinks the console is {pdp10.told === 'glass' ? 'glass' : 'paper'}.
				<button title="Type :tctyp {pdp10.view === 'glass' ? 'glass' : 'printing'} at DDT, to tell ITS" onclick={() => pdp10.tell()}
					>Tell ITS: :tctyp {pdp10.view === 'glass' ? 'glass' : 'printing'}</button
				>
				Type it at DDT's star, not inside a program.
			</p>
		{/if}
		<p class="note">
			ITS knows its console as a printing terminal. On glass the page tells it <code>:tctyp glass</code>, so rubouts erase and a long listing stops at
			--More-- for each screenful of 24 lines: Space for more, Rubout to stop. The baud rate is the console's own, on this page's clock: ITS sends at the
			KA10's speed and what it sent ahead waits to print. What prints is announced to screen readers, and with Speak on it is read aloud.
		</p>
	</Outline>
{/snippet}

{#snippet danceNode()}
	<DancePanel id="pdp10" move={moveNode} dance={pdp10.dance} twist {jiggle} {seed} />
{/snippet}

{#snippet disksNode()}
	<Outline id="pdp10-disks" move={moveNode} title="Disks: the four RP03 packs" hint="The packs ITS boots from, fetched a chunk at a time as ITS reads them" summary={disksSummary} pin={{ bar, id: 'pdp10-packs' }}>
		{@render packsPanel()}
		<p class="note">
			The packs are the PDP-10/its project's build, 82.5 MB each. The page fetches the chunks a boot needs first, then any other chunk when ITS reads it. What
			ITS writes stays in this tab: starting again or reloading goes back to the packs as built.
		</p>
	</Outline>
{/snippet}

{#snippet testsNode()}
	<Outline id="pdp10-tests" move={moveNode} title="Tests" hint="Programs that test the KA10 on the bare machine" summary={pdp10.halt ? `halted at ${pdp10.halt.pc}${pdp10.halt.pass === true ? ': pass' : pdp10.halt.pass === false ? ': fail' : ''}` : tape ? 'running' : 'HHTEST'} opened={tape}>
		{#if tape && pdp10.halt}
			<p class={['verdict', pdp10.halt.pass ? 'pass' : 'fail']}>
				Halted at {pdp10.halt.pc}: {pdp10.halt.pass ? 'pass' : `fail, it passes by halting at ${entry.runs?.pass}`}.
			</p>
		{/if}
		<p class="note">
			HHTEST is the ITS build's test of the "hack hack" for 340 display interrupts, punched on paper tape. It runs on the bare KA10 and passes by halting at
			201.
			{#if hhtest && !tape}<a href={launchUrl(hhtest, {}, { base: CATALOG_BASE })}>Run HHTEST</a>{/if}
			{#if its && tape}<a href={launchUrl(its, {}, { base: CATALOG_BASE })}>Boot ITS</a>{/if}
		</p>
	</Outline>
{/snippet}

{#snippet prefsNode()}
	<Outline id="pdp10-prefs" move={moveNode} title="Preferences" hint="Back to how this page first came: the toolbar, or everything the page keeps in this browser">
		<PagePrefs {bar} keys={PREF_KEYS} />
	</Outline>
{/snippet}

{#snippet aboutNode()}
	<AboutPanel {bar} machine="pdp10" move={moveNode} />
{/snippet}

<svelte:window onkeydown={onwindowkey} />

<section class="pdp10" aria-label="The PDP-10">
	<div class="console">
		{#if pdp10.view === 'glass'}
			<div
				class={['glass', { ringing: pdp10.ringing }]}
				bind:this={paper}
				tabindex="0"
				role="textbox"
				aria-multiline="true"
				data-keep-focus
				aria-label="The console as a glass teletype: click here and type"
				title="The console as a glass teletype, 24 lines. Click and type: Return ends a line, Escape is Altmode, Backspace is Rubout, Control and a letter sends that control character, and a paste is typed in. At --More--, Space shows more."
				{onkeydown}
				{onpaste}
				{onpointerup}
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
			>
				{#each pdp10.glass.lines as line, r (r)}
					{@const col = pdp10.glass.col}
					<div class="line">
						{#if r === pdp10.glass.row}{line.slice(0, col).padEnd(col)}<span class="cursor">{line[col] ?? ' '}</span>{line.slice(col + 1)}{:else}{line}{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div
				class={['paper', { ringing: pdp10.ringing }]}
				style:height={height === null ? null : `${height}px`}
				bind:this={paper}
				tabindex="0"
				role="textbox"
				aria-multiline="true"
				data-keep-focus
				aria-label="The console teletype: click here and type"
				title="The console teletype, which ITS treats as a printing terminal. Click and type: Return ends a line, Escape is Altmode, Backspace is Rubout, Control and a letter sends that control character, and a paste is typed in. Select text to copy it."
				{onkeydown}
				{onpaste}
				{onpointerup}
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
			>
				{#each pdp10.lines as line, i (i)}<div class="line">{line}{#if i === pdp10.lines.length - 1}<span class="cursor"></span>{/if}</div>{/each}
			</div>
			<button
				type="button"
				class={['grip', { sizing }]}
				aria-label="The paper's height: drag, or the up and down arrow keys"
				title="Drag to make the paper taller or shorter. Arrow keys: a line at a time, Shift for five. Double-click: back to the usual height."
				onpointerdown={gripdown}
				onpointermove={gripmove}
				onpointerup={gripup}
				onpointercancel={gripup}
				onkeydown={gripkey}
				ondblclick={() => {
					resize(null);
					keepHeight();
				}}
			></button>
		{/if}
	</div>
	<p class="sr" aria-live="polite">{pdp10.voice.announce}</p>
	<p class="status">
		{#if pdp10.phase}{pdp10.phase}…{:else if focused}Typing to ITS{:else}Click the {pdp10.view === 'glass' ? 'screen' : 'paper'}, or just type, to type to ITS{/if}
	</p>
	{#if pdp10.error}<p class="status failed">{pdp10.error}</p>{/if}
	<MachineToolbar {bar} label="The PDP-10's toolbar" />
	<div class="outline" aria-label="The PDP-10's outline">
		{#each order as key (key)}
			{#if key === 'pdp10-programs'}{@render programsNode()}
			{:else if key === 'pdp10-console'}{@render consoleNode()}
			{:else if key === 'pdp10-run'}{@render runNode()}
			{:else if key === 'pdp10-dance'}{@render danceNode()}
			{:else if key === 'pdp10-disks'}{@render disksNode()}
			{:else if key === 'pdp10-tests'}{@render testsNode()}
			{:else if key === 'pdp10-prefs'}{@render prefsNode()}
			{:else if key === 'pdp10-about'}{@render aboutNode()}{/if}
		{/each}
	</div>
</section>

<style>
	.pdp10 {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.paper {
		box-sizing: border-box;
		height: 28em;
		overflow: auto;
		padding: 0.5em 0.7em;
		background: #f4f0e2;
		color: #222;
		font: 0.85rem/1.25 ui-monospace, 'SF Mono', Menlo, monospace;
		white-space: pre;
		border-radius: 4px;
		cursor: text;
	}
	.paper:focus {
		outline: 2px solid #c90;
	}
	/* Touching the paper's bottom edge, the width of it, so it reads as the paper's own. */
	.grip {
		display: grid;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		place-items: center;
		height: 0.75rem;
		cursor: ns-resize;
		touch-action: none;
		border-radius: 0 0 4px 4px;
	}
	.grip::before {
		content: '';
		width: 3rem;
		height: 3px;
		border-radius: 2px;
		background: currentColor;
		opacity: 0.3;
	}
	.grip:hover::before,
	.grip:focus-visible::before,
	.grip.sizing::before {
		opacity: 0.8;
	}
	.line {
		min-height: 1.25em;
	}
	.cursor {
		display: inline-block;
		width: 0.6em;
		height: 1em;
		vertical-align: text-bottom;
		background: currentColor;
		opacity: 0.25;
	}
	.paper:focus .cursor {
		opacity: 0.8;
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.status {
		margin: 0;
		font: 0.85rem system-ui, sans-serif;
		opacity: 0.8;
	}
	.failed {
		color: #e8a070;
		opacity: 1;
	}
	.outline {
		display: flex;
		flex-direction: column;
		font: 0.8rem ui-monospace, monospace;
		border-bottom: 1px solid color-mix(in srgb, currentColor 18%, transparent);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem;
		margin: 0.2rem 0;
	}
	.note {
		margin: 0.3rem 0;
		opacity: 0.8;
		font-family: system-ui, sans-serif;
	}
	/* A glass teletype: green on black, 24 lines, the type sized to fit 80 columns in the width. */
	.glass {
		container-type: inline-size;
		box-sizing: border-box;
		padding: 0.6em 0.8em;
		background: #050805;
		color: #9fe8a0;
		border-radius: 6px;
		cursor: text;
		white-space: pre;
		overflow: hidden;
		text-shadow: 0 0 3px rgb(159 232 160 / 0.45);
	}
	.glass .line {
		min-height: 1.2em;
		font: calc(100cqw / 49.5) / 1.2 ui-monospace, 'SF Mono', Menlo, monospace;
	}
	.glass:focus {
		outline: 2px solid #3a8a3a;
	}
	.glass .cursor {
		display: inline;
		width: auto;
		height: auto;
		background: none;
		opacity: 1;
	}
	.glass:focus .cursor {
		background: #9fe8a0;
		color: #050805;
		text-shadow: none;
	}
	.ringing {
		filter: brightness(1.6);
	}
	.views {
		display: inline-flex;
	}
	.views .on,
	.on {
		background: #cfc;
		color: #000;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
	/* A KA10's console: the switches in threes, as its octal digits are. */
	.switches {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
	}
	.triad {
		display: inline-flex;
		gap: 1px;
	}
	.switch {
		width: 0.9rem;
		height: 1.3rem;
		padding: 0;
		border: 1px solid #777;
		border-radius: 2px;
		background: linear-gradient(#ddd 50%, #888 50%);
		cursor: pointer;
	}
	.switch.on {
		background: linear-gradient(#c90 50%, #ddd 50%);
	}
	.octal {
		margin-left: 0.4rem;
		font-size: 0.85rem;
	}
	.facts {
		display: grid;
		grid-template-columns: max-content auto;
		gap: 0.1rem 0.8rem;
		margin: 0.3rem 0;
	}
	.facts dt {
		opacity: 0.7;
	}
	.facts dd {
		margin: 0;
	}
	.packs {
		border-collapse: collapse;
	}
	.packs th,
	.packs td {
		padding: 0.1rem 0.8rem 0.1rem 0;
		text-align: left;
	}
	.readout {
		font-variant-numeric: tabular-nums;
	}
	.verdict {
		font-weight: 600;
	}
	.pass {
		color: #6c6;
	}
	.fail {
		color: #e8a070;
	}
</style>
