<script>
	// The Apple's outline under the screen: the game (Play), the drives, the speaker and the
	// cassette, the bus dance, then what is under the lid, closed until asked for: the 6502 with
	// the cabinet's panel (CPU), memory, the soft switches, annunciators, drives and game port
	// (I/O), and Korz, with the emulator menu.
	import { APPLE_HZ } from '@wwsff/cabinet/angel';
	import { panelSeedBytes, panelSeedText } from '@wwsff/cabinet/dance';
	import { ENGINES, apple } from './apple.svelte.js';
	import KorzBrowser from './KorzBrowser.svelte';
	import AppleMemory from './AppleMemory.svelte';
	import DancePanel from './DancePanel.svelte';
	import Outline from './Outline.svelte';
	import PagePrefs from './PagePrefs.svelte';
	import Pinnable from './Pinnable.svelte';
	import { toolbar } from './toolbar.svelte.js';

	/**
	 * angel: the screen angel (AppleApp), the first node, open.
	 * play: the app's own controls (AppleApp: starts, moves, characters), first and open.
	 * appDisks: the app's disks by what they are for. disks: the drives' controls from the screen
	 * (MicroM8): pick a drive, put in a disk or a file, save one.
	 * @type {{ labelOf?: (file: string) => string, angel?: import('svelte').Snippet, play?: import('svelte').Snippet, playTitle?: string, appDisks?: import('svelte').Snippet, disks?: import('svelte').Snippet }}
	 */
	let { labelOf = (file) => file.slice(file.lastIndexOf('/') + 1), angel, play, playTitle = 'Play', appDisks, disks } = $props();

	/**
	 * The top-level nodes in the order a new player wants them: the screen angel, who says what
	 * the game wants, the game, its disks and sound,
	 * the dance, then what is under the lid. A person can drag them into another order, kept here.
	 */
	const ORDER = ['apple-angel', 'apple-play', 'apple-disks', 'apple-sound', 'apple-dance', 'apple-cpu', 'apple-mem', 'apple-io', 'apple-korz', 'apple-prefs'];
	const ORDER_KEY = 'apple-outline-order';
	/** @type {string[]} */
	let order = $state(keptOrder());
	function keptOrder() {
		try {
			const kept = JSON.parse(globalThis.localStorage?.getItem(ORDER_KEY) ?? '[]');
			const known = Array.isArray(kept) ? kept.filter((k) => ORDER.includes(k)) : [];
			return [...known, ...ORDER.filter((k) => !known.includes(k))];
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

	const hex = (/** @type {number} */ n, /** @type {number} */ w) => (n ?? 0).toString(16).toUpperCase().padStart(w, '0');
	const FLAGS = [
		['N', 'negative'],
		['V', 'overflow'],
		['-', 'unused, always 1'],
		['B', 'break'],
		['D', 'decimal'],
		['I', 'interrupts off'],
		['Z', 'zero'],
		['C', 'carry']
	];
	const s = $derived(apple.status);
	const BITS = [7, 6, 5, 4, 3, 2, 1, 0];
	const switches = $derived(s && 'switches' in s ? s.switches : null);
	const engine = $derived(ENGINES.find((e) => e.id === apple.id)?.label ?? apple.id);
	const running = $derived(apple.phase === 'running' && !!s);

	/** The panel's 15 bytes as a music seed, the `panel:` line of an app in APPS.yml. */
	const panelSeed = {
		machine: 'apple2',
		where: "an app's entry in packages/cabinet/disks/apple2/APPS.yml",
		text: () => `panel: "${panelSeedText(apple.panel ?? [])}"`,
		digits: () => panelSeedText(apple.panel ?? []),
		/** @param {string} text */
		paste: (text) => {
			const bytes = panelSeedBytes(text);
			if (bytes) apple.seedPanel(bytes);
			return !!bytes;
		}
	};

	// The controls this outline owns, offered to the toolbar; MicroM8 offers the screen's.
	const bar = toolbar('apple');
	$effect(() => {
		const off = [bar.offer('volume', "the speaker's volume", volume, 'control', ['apple-sound']), bar.offer('engine', 'the emulator', engineMenu, 'control', ['apple-korz'])];
		if (apple.korz) off.push(bar.offer('tape', 'Hear the tape', tape, 'control', ['apple-sound']));
		off.push(bar.offer('cpu-regs', 'Registers', regsPanel, 'panel', ['apple-cpu', 'apple-regs']), bar.offer('io-lamps', 'I/O', ioPanel, 'panel', ['apple-io']));
		if (apple.panel)
			off.push(
				bar.offer('prompts', 'Follow the prompts', prompts, 'control', ['apple-dance']),
				bar.offer('panel-bits', 'Panel $C041–$C04F', bitsPanel, 'panel', ['apple-cpu', 'apple-panel'])
			);
		return () => off.forEach((f) => f());
	});

	/** What this page keeps in this browser; the dance's on/off (dance-on) is every machine's, and stays. */
	const PREF_KEYS = [/^toolbar-apple$/, /^apple-/, /^outline:apple-/, /^korz-browser-/, /^dance-diesel$/, /^screen-angel/];

	const notRunning = 'not running yet';
	const cpuSummary = $derived(running && s ? `PC $${hex(s.pc, 4)} · ${apple.mhz.toFixed(2)} MHz · ${engine}` : notRunning);
	const ioSummary = $derived(
		running && s ? [s.modes.join(' '), ...apple.drives.map((name, d) => `${d + 1}: ${name ? labelOf(name) : 'empty'}`)].join(' · ') : notRunning
	);
	const soundSummary = $derived(
		`${apple.sound ? 'speaker' : 'speaker muted'} ${Math.round(apple.speakerVolume * 100)}%${apple.hearTape ? ' · hearing the tape' : ''}`
	);
	const disksSummary = $derived(apple.drives.map((name, d) => `${d + 1}: ${name ? labelOf(name) : 'empty'}`).join(' · '));
	const memSummary = $derived(!apple.korz ? 'inside microM8' : running ? 'hex, the 6502 code, the trace' : notRunning);
	/** @type {Record<string, () => ReturnType<import('svelte').Snippet>>} */
	const NODES = $derived({ 'apple-angel': angelNode, 'apple-play': playNode, 'apple-disks': disksNode, 'apple-sound': soundNode, 'apple-dance': danceNode, 'apple-cpu': cpuNode, 'apple-mem': memNode, 'apple-io': ioNode, 'apple-korz': korzNode, 'apple-prefs': prefsNode });
</script>

{#snippet prompts(compact = false)}
	<button
		class={{ on: apple.followPrompts }}
		aria-pressed={apple.followPrompts}
		aria-label="Follow the prompts"
		title="Follow the prompts: Applesoft, a running BASIC program, Integer BASIC and the Monitor each set the dance's style and their own panel seed. A game with its own seed starts with this off, so they leave its music alone."
		onclick={() => (apple.followPrompts = !apple.followPrompts)}>{compact ? '🧭' : apple.followPrompts ? '🧭 Following the prompts' : '🧭 Not following the prompts'}</button
	>
{/snippet}

{#snippet volume(compact = false)}
	<label class="volume" title="The speaker's volume, {Math.round(apple.speakerVolume * 100)}%. Faster than 4x it is turned down further, and off past 8x.">
		{compact ? '🔉' : 'Volume'}
		<input
			class={{ short: compact }}
			type="range"
			min="0"
			max="1"
			step="0.05"
			aria-label="The speaker's volume"
			value={apple.speakerVolume}
			oninput={(e) => (apple.speakerVolume = Number(e.currentTarget.value))}
		/>
		{#if !compact}<span class="num">{Math.round(apple.speakerVolume * 100)}%</span>{/if}
	</label>
{/snippet}

{#snippet tape(compact = false)}
	<button
		class={{ on: apple.hearTape }}
		aria-pressed={apple.hearTape}
		aria-label="Hear the tape"
		title="Hear the cassette output ($C020, what SAVE writes) mixed with the speaker, as a tape recorder's monitor plays it"
		onclick={() => ((apple.hearTape = !apple.hearTape), apple.listen())}>📼{compact ? '' : apple.hearTape ? ' Hearing the tape' : ' Hear the tape'}</button
	>
{/snippet}

{#snippet engineMenu(compact = false)}
	<label title={ENGINES.find((e) => e.id === apple.id)?.title}>
		{compact ? '' : 'Emulator'}
		<select aria-label="Emulator" value={apple.id} onchange={(e) => apple.choose(e.currentTarget.value)}>
			{#each ENGINES as e (e.id)}
				<option value={e.id} title={e.title}>{e.label}</option>
			{/each}
		</select>
	</label>
{/snippet}

{#snippet promptsHome()}
	<Pinnable {bar} id="prompts" />
{/snippet}

<!-- The panels this outline offers the toolbar, as they are at home and there. -->
{#snippet regsPanel(compact = false)}
	{#if !running || !s}
		<p class="off">The Apple is not running yet.</p>
	{:else}
		<dl>
			<dt>registers</dt>
			<dd class="regs">
				<span title="Program counter">PC <b>${hex(s.pc, 4)}</b></span>
				<span title="Accumulator">A <b>${hex(s.a, 2)}</b></span>
				<span title="X index">X <b>${hex(s.x, 2)}</b></span>
				<span title="Y index">Y <b>${hex(s.y, 2)}</b></span>
				<span title="Stack pointer, in page 1">S <b>${hex(s.sp, 2)}</b></span>
				<span title="Processor status">P <b>${hex(s.p, 2)}</b></span>
			</dd>
			<dt>flags</dt>
			<dd class="lamps">
				{#each FLAGS as [letter, name], i (i)}
					<span class={['lamp', { lit: !!(s.p & (0x80 >> i)) }]} title={name}>{letter}</span>
				{/each}
			</dd>
			<dt>cycles</dt>
			<dd><b>{s.cycles.toLocaleString('en-US')}</b>, {(s.cycles / APPLE_HZ).toFixed(1)} s of Apple time</dd>
			<dt>speed</dt>
			<dd>
				<b>{apple.mhz.toFixed(2)} MHz</b>, {(apple.mhz / (APPLE_HZ / 1e6)).toFixed(1)}× an Apple
				{#if apple.pace}· {apple.pace} picture{apple.pace === 1 ? '' : 's'} a game second{/if}
			</dd>
			<dt>engine</dt>
			<dd>{engine}</dd>
		</dl>
	{/if}
{/snippet}

{#snippet bitsPanel(compact = false)}
	{#if apple.panel?.length}
	<div class="panel-bits">
		{#each apple.panel as byte, i (i)}
			{@const addr = 0xc041 + i}
			<span class="byte" title="${hex(addr, 4)}: PEEK({addr - 65536}), POKE {addr - 65536},n">
				<span class="addr">{hex(addr, 4)}</span>
				{#each BITS as b (b)}
					<button
						type="button"
						class={['lamp', 'bit', { lit: !!(byte & (1 << b)) }]}
						aria-pressed={!!(byte & (1 << b))}
						aria-label="${hex(addr, 4)} bit {b}"
						onpointerdown={(e) => e.preventDefault()}
						onclick={() => apple.flip(i * 8 + b)}>{b}</button
					>
				{/each}
				<b>{hex(byte, 2)}</b>
			</span>
		{/each}
	</div>
	{/if}
{/snippet}

{#snippet ioPanel(compact = false)}
	{#if !running || !s}
		<p class="off">The Apple is not running yet.</p>
	{:else}
		<dl>
			<dt>video</dt>
			<dd>
				{#if switches}
					<span class="lamps">
						<span class={['lamp', 'word', { lit: switches.graphics }]} title="$C050 graphics, $C051 text">{switches.graphics ? 'GRAPHICS' : 'TEXT'}</span>
						<span class={['lamp', 'word', { lit: switches.mixed }]} title="$C053 mixed: four lines of text under the graphics; $C052 full screen">{switches.mixed ? 'MIXED' : 'FULL'}</span>
						<span class={['lamp', 'word', { lit: switches.page2 }]} title="$C055 page 2, $C054 page 1">{switches.page2 ? 'PAGE 2' : 'PAGE 1'}</span>
						<span class={['lamp', 'word', { lit: switches.hires }]} title="$C057 hi-res, $C056 lo-res">{switches.hires ? 'HI-RES' : 'LO-RES'}</span>
					</span>
				{/if}
				<span class="shows" title="What the screen shows">{s.modes.join(' ')}</span>
			</dd>
			<dt>annunciators</dt>
			<dd class="lamps">
				{#each [0, 1, 2, 3] as n (n)}
					<span class={['lamp', { lit: !!(apple.annunciators & (1 << n)) }]} title="AN{n}: $C0{hex(0x58 + 2 * n, 2)} off, $C0{hex(0x59 + 2 * n, 2)} on">AN{n}</span>
				{/each}
			</dd>
			<dt>drives</dt>
			<dd class="drives">
				{#each apple.drives as name, d (d)}
					<span title={name || 'empty'}>{d + 1}: {name ? labelOf(name) : 'empty'}</span>
				{/each}
			</dd>
			<dt>game port</dt>
			<dd>{apple.gamepad ? `gamepad: ${apple.gamepad}` : apple.mouseStick ? 'joystick: the pointer' : 'nothing plugged in'}</dd>
		</dl>
	{/if}
{/snippet}

{#snippet angelNode()}
	{#if angel}
		<Outline id="apple-angel" move={moveNode} title="Screen angel: what the game wants" hint="The screen angel watches the screen, says what the game is asking for, and does the moves for you" opened>
			{@render angel()}
		</Outline>
	{/if}
{/snippet}

{#snippet playNode()}
	{#if play}
		<Outline id="apple-play" move={moveNode} title={playTitle} hint="What the game is played with: its starts, its moves and its characters" opened>
			{@render play()}
		</Outline>
	{/if}
{/snippet}

{#snippet disksNode()}
	<Outline id="apple-disks" move={moveNode} title="Disks: the two drives" hint="What is in each drive; put in another disk or a file, or save one as the Apple has written it" summary={disksSummary} opened={!play}>
		{#if appDisks}{@render appDisks()}{/if}
		{#if disks}{@render disks()}{/if}
	</Outline>
{/snippet}

{#snippet soundNode()}
	<Outline id="apple-sound" move={moveNode} title="Sound: the speaker and the cassette" hint="The Apple's own sound, apart from the dance" summary={soundSummary}>
		<div class="row">
			<Pinnable {bar} id="mute" />
			<Pinnable {bar} id="volume" />
		</div>
		{#if apple.korz}
			<div class="row"><Pinnable {bar} id="tape" /></div>
			<p class="off">
				Cassette in ($C060) has its wire on the board. Recording to and playing from the microphone, the speaker and audio files, in step with Apple time, is still to come.
			</p>
		{:else}
			<p class="off">microM8's cassette port is not wired to the page; pick a Korz level under Korz to hear the tape.</p>
		{/if}
	</Outline>
{/snippet}

{#snippet danceNode()}
	{#if apple.dance}
		<DancePanel
			id="apple"
			move={moveNode}
			dance={apple.dance}
			twist={!!apple.panel}
			jiggle={apple.panel ? () => apple.flip(Math.floor(Math.random() * 120)) : undefined}
			seed={apple.panel ? panelSeed : undefined}
			extra={apple.panel ? promptsHome : undefined}
		/>
	{/if}
{/snippet}

{#snippet cpuNode()}
	<Outline id="apple-cpu" move={moveNode} title="CPU: the 6502" hint="The 6502: running it, its registers and flags, the panel's bits, the cycles it has run, and how fast it is going" summary={cpuSummary}>
		<div class="row">
			{#each ['reboot', 'reset', 'pause', 'step', 'speed', 'readout'] as id (id)}<Pinnable {bar} {id} />{/each}
		</div>
		<Outline id="apple-regs" title="Registers, flags, cycles" hint="The 6502's registers and flags, the cycles it has run, and how fast" opened pin={{ bar, id: 'cpu-regs' }}>
			{@render regsPanel(false)}
		</Outline>
		{#if apple.panel?.length}
			<Outline
				id="apple-panel"
				title="Panel $C041–$C04F"
				hint="A panel no Apple had: 120 bits that the program sets with STA or POKE and reads with LDA or PEEK, and that a click here flips. The dance hears them as the PDP-7 hears its switches."
				summary={panelSeedText(apple.panel).toUpperCase()}
				pin={{ bar, id: 'panel-bits' }}
			>
				{@render bitsPanel(false)}
			</Outline>
		{/if}
	</Outline>
{/snippet}

{#snippet memNode()}
	<Outline id="apple-mem" move={moveNode} title="Memory" hint="Memory as the PDP-7's panel shows core: hex, the 6502 code disassembled, and the trace of instructions run" summary={memSummary} resize>
		{#if apple.korz && running}
			<AppleMemory korz={apple.korz} />
		{:else if !apple.korz}
			<p class="off">microM8 keeps its memory inside its Go core; pick a Korz level in the menu to see it.</p>
		{:else}
			<p class="off">The Apple is not running yet.</p>
		{/if}
	</Outline>
{/snippet}

{#snippet ioNode()}
	<Outline id="apple-io" move={moveNode} title="I/O: video, annunciators, drives, game port" hint="The keyboard's Caps Lock, the joystick, the video soft switches, the annunciators, the drives and the game port" summary={ioSummary} pin={{ bar, id: 'io-lamps' }}>
		<div class="row">
			<Pinnable {bar} id="caps" />
			<Pinnable {bar} id="joystick" />
		</div>
		{@render ioPanel(false)}
	</Outline>
{/snippet}

{#snippet korzNode()}
	<Outline id="apple-korz" move={moveNode} title="Korz: the emulator, the 6502's sea and the compiled code" hint="Which emulator runs the Apple, and the Korz structures: the 6502's sea, its slots, and the JavaScript the compiler made from the Apple's code. Read-only." summary={engine}>
		<div class="row"><Pinnable {bar} id="engine" /></div>
		<KorzBrowser roots={() => apple.korzRoots()} follow={() => apple.korzFollow()} />
	</Outline>
{/snippet}

{#snippet prefsNode()}
	<Outline id="apple-prefs" move={moveNode} title="Preferences" hint="Back to how this page first came: the toolbar, or everything the page keeps in this browser">
		<PagePrefs {bar} keys={PREF_KEYS} kept="your saved music seeds" />
	</Outline>
{/snippet}

<section class="panels" aria-label="The Apple's outline">
	{#each order as key (key)}
		{@render NODES[key]()}
	{/each}
</section>


<style>
	.panels {
		display: flex;
		flex-direction: column;
		margin-top: 0.6rem;
		font: 0.8rem ui-monospace, monospace;
		border-bottom: 1px solid color-mix(in srgb, currentColor 18%, transparent);
	}
	button.on {
		background: #cfc;
		color: #000;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		margin: 0.2rem 0;
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
	.off {
		margin: 0;
		opacity: 0.7;
	}
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.25rem 1rem;
		align-items: baseline;
		margin: 0;
	}
	dt {
		opacity: 0.65;
	}
	dd {
		margin: 0;
		min-width: 0;
		font-variant-numeric: tabular-nums;
	}
	dd b {
		font-weight: 600;
	}
	.regs,
	.drives {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.4ch;
	}
	.lamps {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 3px;
	}
	.lamp {
		min-width: 1.4em;
		padding: 0 0.25em;
		text-align: center;
		border-radius: 3px;
		background: #333;
		color: #999;
	}
	.panel-bits {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 1.6ch;
	}
	.byte {
		display: inline-flex;
		align-items: center;
		gap: 2px;
	}
	.byte .addr {
		opacity: 0.65;
		margin-right: 0.4ch;
	}
	.byte b {
		margin-left: 0.4ch;
	}
	.lamp.bit {
		font: inherit;
		min-width: 1.5em;
		border: 0;
		cursor: pointer;
	}
	.lamp.word {
		min-width: 9ch;
	}
	.lamp.lit {
		background: #f80;
		color: #000;
	}
	.shows {
		margin-left: 1ch;
		opacity: 0.75;
	}
</style>
