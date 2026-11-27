<script>
	// The Apple screen: its keyboard, two drives, and the menu of emulators and rungs. Click the screen to type;
	// pick a disk or drop an image on the screen to put it in the chosen drive. Swapping a disk
	// never restarts the Apple; Reboot boots drive 1. Pasted text is typed in.
	// Game port: left and right Alt (Option) are Open and Solid Apple, pushbuttons 0 and 1,
	// held while other keys type as themselves: Option-F is F with the button down (Don's
	// H19 terminal: button 0 is Meta, button 1 its commands, right Option-F enters Forth). A
	// gamepad drives the paddles whenever one is connected; Joystick puts paddles 0 and 1 under
	// the pointer, with its buttons as pushbuttons 0 and 1. The lamps are AN0-AN3.
	// Nothing heavy loads with the page: the 41 MB module comes on the first click, boot or
	// drop, and a disk only when it is picked.
	// A disk with a profile (Don's Forth: a II+ with a Videx and a serial card) needs that
	// machine. Picked while another machine runs, it reloads the page at relaunch(disk), by
	// default ?disk=<name>, and the page boots it on its own machine.
	// `boot` is a disk to boot: on the first click while the Apple is off, at once (inserted,
	// then a reboot) when it is already running, or at once after a relaunch. `begin` does an
	// app's own start on the first click instead (AppleApp.svelte), named by `beginLabel`.
	// A disk's `label` names it in the menu and the I/O panel.
	// Under the screen: a row of the commands used most, as icons whose tooltips say what they
	// do, with the speed on the right; then the outline (ApplePanels), whose Disks node holds
	// the drives' controls from here.
	import { onMount } from 'svelte';
	import { showAll } from '@wwsff/catalog';
	import { FRAME_HEIGHT, FRAME_WIDTH, VIDEX_HEIGHT, VIDEX_WIDTH } from '@wwsff/cabinet/microm8';
	import { ENGINES, apple } from './apple.svelte.js';
	import ApplePanels from './ApplePanels.svelte';
	import MachineToolbar from './MachineToolbar.svelte';
	import Pinnable from './Pinnable.svelte';
	import { toolbar } from './toolbar.svelte.js';
	import RateSlider from './RateSlider.svelte';
	import { urlSeed } from './korz-apple.svelte.js';
	import { APPLE_HZ } from '@wwsff/cabinet/angel';
	import { EMULATOR_KEYS_HELP, emulatorKey, nextTempo } from './emulator-keys.js';

	/** @typedef {{ name: string, label?: string, profile?: string, enabled?: boolean, url: () => Promise<string> }} Disk */
	/**
	 * angel, play, playTitle and appDisks go to the outline under the screen (ApplePanels): the
	 * screen angel first, then the app's own controls and its disks.
	 * @type {{ disks?: Disk[], boot?: string, relaunch?: (disk: Disk) => string, begin?: () => unknown, beginLabel?: string, defaultCpu?: string, angel?: import('svelte').Snippet, play?: import('svelte').Snippet, playTitle?: string, appDisks?: import('svelte').Snippet }}
	 */
	// Slowest first. 100 is MAX: as fast as this computer goes, a picture each game second.
	// microM8's Go core starts at 1x; the slower notches are the Korz Apple's.
	// The PDP-7's scale: trace notches, an instruction every so many ms with the views following,
	// then multiples of a real Apple.
	const TRACES = [1000, 300, 100, 30];
	const SPEEDS = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 3, 5, 10, 20, 30, 50, 100];
	const rates = $derived([
		...(apple.id === 'microm8'
			? []
			: TRACES.map((ms) => ({
					trace: ms,
					speed: 0,
					label: ms >= 1000 ? `${ms / 1000} s` : `.${String(ms / 1000).slice(2)} s`,
					title: `Trace: one instruction every ${ms >= 1000 ? `${ms / 1000} s` : `${ms} ms`}, the views following the PC`
				}))),
		...SPEEDS.filter((w) => w >= 1 || apple.id !== 'microm8').map((w) => ({
			speed: w,
			label: w === 100 ? 'MAX' : `${String(w).replace(/^0/, '')}×`,
			title:
				w === 100
					? 'As fast as this computer can go, showing a picture each Apple second'
					: w === 1
						? `1× is a real Apple ][: ${APPLE_HZ.toLocaleString('en-US')} cycles a second`
						: `${w}× an Apple ][: ${Math.round(APPLE_HZ * w).toLocaleString('en-US')} cycles a second${w > 8 ? ', and the speaker is off' : w < 0.01 ? ', and the speaker is quiet' : w < 1 ? ', and the speaker clicks as slowly' : ''}`
		}))
	]);
	const rateIndex = $derived.by(() => {
		if (apple.traceMs) return Math.max(0, rates.findIndex((r) => 'trace' in r && r.trace === apple.traceMs));
		let best = -1;
		rates.forEach((r, i) => {
			if ('trace' in r) return;
			if (best < 0 || Math.abs(Math.log(r.speed / apple.warp)) < Math.abs(Math.log(rates[best].speed / apple.warp))) best = i;
		});
		return Math.max(0, best);
	});
	// The toolbar's speed readout: how many times faster than a real Apple ][+ this one runs,
	// measured from the cycles it got through, not the slider's setting (a slow computer, or the
	// compiler warming up, falls short of it). The tooltip gives the measured clock, what the
	// slider asked for, the engine, the cycles run as Apple time, and the PC.
	const ratio = $derived(apple.mhz / (APPLE_HZ / 1e6));
	const speedText = $derived(
		apple.phase !== 'running' ? 'off' : apple.paused ? 'held' : `${ratio >= 10 ? ratio.toFixed(0) : ratio.toFixed(ratio >= 1 ? 1 : 2)}×`
	);
	const speedTip = $derived.by(() => {
		if (apple.phase !== 'running') return 'How many times faster than a real Apple ][+ this one runs, once it is switched on.';
		const s = apple.status;
		const cycles = s && 'cycles' in s ? s.cycles : null;
		return [
			`${speedText}: this Apple runs ${ratio.toFixed(2)} times as fast as a real Apple ][+, measured.`,
			`Clock: ${apple.mhz.toFixed(3)} MHz of 6502 cycles a second, against the real ${(APPLE_HZ / 1e6).toFixed(3)} MHz.`,
			`Asked for: ${apple.traceMs ? `one instruction every ${apple.traceMs} ms (trace)` : apple.warp >= 100 ? 'as fast as this computer goes (MAX)' : `${apple.warp}×`}, on the speed slider.`,
			`Engine: ${ENGINES.find((e) => e.id === apple.id)?.label ?? apple.id}.`,
			...(cycles !== null ? [`Run so far: ${cycles.toLocaleString('en-US')} cycles, ${(cycles / APPLE_HZ).toFixed(1)} s of Apple time.`] : []),
			...(apple.pace ? [`Pictures: ${apple.pace} a game second.`] : []),
			...(s && 'pc' in s ? [`PC: $${s.pc.toString(16).toUpperCase().padStart(4, '0')}.`] : [])
		].join('\n');
	});

	/** @param {number} i */
	function pickRate(i) {
		const r = rates[i];
		if (!r) return;
		if ('trace' in r && r.trace) apple.trace(r.trace);
		else apple.speed(r.speed);
	}

	let {
		disks = [],
		boot = undefined,
		relaunch = (disk) => `?disk=${encodeURIComponent(disk.name)}${all ? '&all' : ''}`,
		begin = undefined,
		beginLabel = '',
		defaultCpu = 'microm8',
		angel = undefined,
		play = undefined,
		playTitle = undefined,
		appDisks = undefined
	} = $props();

	/** ?all: the menu lists the disks of apps that are not enabled yet. A ?disk= link boots any of them. */
	let all = $state(false);
	const menu = $derived(all ? disks : disks.filter((d) => d.enabled !== false));

	const RELAUNCHED = 'microm8-relaunched';
	/** The disk `boot` names, waiting for the first click while the Apple is off. */
	/** @type {Disk | undefined} */
	let pending = $state();

	/** @type {HTMLCanvasElement | undefined} */
	let canvas;
	/** @type {HTMLDivElement | undefined} */
	let root;
	let choice = $state('');
	/** The drive picked disks go into: 0 or 1. */
	let drive = $state(0);
	let dragging = $state(false);
	// The keyboard belongs to the Apple from a click on the screen until a click elsewhere on
	// the page. Keys are caught at the window, so where the browser puts focus doesn't matter.
	let engaged = $state(false);

	/** @param {EventTarget | null} t */
	const isField = (t) =>
		t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement || (t instanceof HTMLElement && t.isContentEditable);

	function engage() {
		engaged = true;
		canvas?.focus();
		apple.listen();
		const disk = pending;
		pending = undefined;
		if (disk && apple.phase === 'idle') {
			drive = 0;
			load(disk);
		} else if (begin && apple.phase === 'idle') begin();
		else apple.start();
	}

	/** @param {HTMLCanvasElement} el */
	function mountGlass(el) {
		canvas = el;
		if (globalThis.location) apple.useDefault(defaultCpu);
		return () => {
			if (canvas === el) canvas = undefined;
		};
	}

	/** @param {HTMLCanvasElement} el */
	function videx(el) {
		// Mounts after the Apple canvas, so `canvas` is already set.
		if (!canvas) return;
		return apple.attach(canvas, el);
	}

	/** @param {string} name @param {ArrayBuffer} data @param {string} [profile] */
	async function insert(name, data, profile) {
		engaged = true;
		canvas?.focus();
		await apple.insert(name, new Uint8Array(data), drive, profile);
	}

	/** @param {Disk} disk @param {{ reboot?: boolean }} [how] */
	async function load(disk, { reboot = false } = {}) {
		const profile = disk.profile ?? '';
		if (apple.id === 'microm8' && apple.phase !== 'idle' && profile !== apple.profile) {
			globalThis.sessionStorage?.setItem(RELAUNCHED, disk.name);
			location.assign(relaunch(disk));
			return;
		}
		const running = apple.phase !== 'idle';
		const response = await fetch(await disk.url());
		await insert(disk.name, await response.arrayBuffer(), profile);
		if (reboot && running) apple.reboot();
	}

	// The menu is an action, not a setting: it resets, and the keyboard goes to the Apple at
	// once, so typing never reaches the menu's type-ahead and swaps the disk.
	function insertChoice() {
		const disk = disks.find((d) => d.name === choice);
		choice = '';
		canvas?.focus();
		if (disk) load(disk);
	}

	onMount(() => {
		const relaunched = globalThis.sessionStorage?.getItem(RELAUNCHED) ?? null;
		globalThis.sessionStorage?.removeItem(RELAUNCHED);
		all = showAll(location.search);
		if (urlSeed()) apple.followPrompts = false;
		const asked = new URLSearchParams(location.search).get('disk');
		const name = boot ?? asked;
		const disk = name ? disks.find((d) => d.name === name) : undefined;
		if (!disk) return;
		drive = 0;
		// Picked from a menu or relaunched for its machine: boot now. Opened from a link while
		// the Apple is off: wait for the click, so the module only loads when wanted.
		if (asked === name || relaunched === name || apple.phase !== 'idle') load(disk, { reboot: true });
		else pending = disk;
	});

	/** @param {File | undefined | null} file */
	async function insertFile(file) {
		if (file) insert(file.name, await file.arrayBuffer());
	}

	/** @param {import('./emulator-keys.js').EmulatorCommand} cmd */
	function command(cmd) {
		if (cmd === 'slower' || cmd === 'faster') pickRate(Math.max(0, Math.min(rates.length - 1, rateIndex + (cmd === 'faster' ? 1 : -1))));
		else if (cmd === 'normal') apple.speed(1);
		else if (cmd === 'pause') apple.pause();
		else if (cmd === 'step') apple.stepOne();
		else if (apple.dance) apple.dance.bpm = nextTempo(apple.dance.bpm, cmd === 'tempoUp' ? 1 : -1);
	}

	/** @param {KeyboardEvent} ev */
	function onkeydown(ev) {
		// In the screen angel's field the game's control keys still reach the Apple.
		const chat = !!apple.chat && document.activeElement === apple.chat;
		if (!(engaged || chat) || ev.defaultPrevented) return;
		const cmd = emulatorKey(ev);
		if (cmd && (chat || !(isField(ev.target) || isField(document.activeElement)))) {
			ev.preventDefault();
			command(cmd);
			return;
		}
		if ((isField(ev.target) || isField(document.activeElement)) && !(chat && ev.ctrlKey)) return;
		apple.listen();
		if (ev.key === 'Alt') {
			apple.button('key', ev.location === 2 ? 1 : 0, true);
			ev.preventDefault();
		} else if (apple.press(ev)) {
			ev.preventDefault();
			apple.dance?.touch({ kind: 'key', code: ev.key.length === 1 ? ev.key.charCodeAt(0) : ev.keyCode });
		}
	}

	/** @param {KeyboardEvent} ev */
	function onkeyup(ev) {
		if (ev.key === 'Alt') apple.button('key', ev.location === 2 ? 1 : 0, false);
	}

	function onblur() {
		for (const n of [0, 1, 2]) {
			apple.button('key', n, false);
			apple.button('mouse', n, false);
		}
	}

	/** Where the pointer was, in 1024ths of the screen, while a button is down: drags build the dance's tension. */
	/** @type {{ x: number, y: number } | null} */
	let grab = null;
	/** @param {PointerEvent} ev */
	const grid = (ev) => {
		const r = /** @type {HTMLCanvasElement} */ (canvas).getBoundingClientRect();
		return { x: ((ev.clientX - r.left) / r.width) * 1024, y: ((ev.clientY - r.top) / r.height) * 1024 };
	};
	/** @param {PointerEvent} ev @param {'press' | 'drag' | 'release'} kind */
	function danceTouch(ev, kind) {
		if (!canvas || !apple.dance) return;
		if (kind === 'press') {
			grab = grid(ev);
			apple.dance.touch({ kind });
		} else if (grab && kind === 'drag') {
			const g = grid(ev);
			apple.dance.touch({ kind, distance: Math.hypot(g.x - grab.x, g.y - grab.y) });
			grab = g;
		} else if (grab) {
			grab = null;
			apple.dance.touch({ kind: 'release' });
		}
	}

	/** @param {PointerEvent} ev */
	function stick(ev) {
		if (!apple.mouseStick || !canvas) return;
		const r = canvas.getBoundingClientRect();
		const at = (/** @type {number} */ v) => Math.min(255, Math.max(0, Math.round(v * 255)));
		apple.paddle(0, at((ev.clientX - r.left) / r.width));
		apple.paddle(1, at((ev.clientY - r.top) / r.height));
	}

	/** @param {PointerEvent} ev @param {boolean} down */
	function stickButton(ev, down) {
		if (!apple.mouseStick || ev.button > 2 || ev.button === 1) return;
		apple.button('mouse', ev.button === 2 ? 1 : 0, down);
	}

	/** @param {PointerEvent} ev */
	function onpointerdown(ev) {
		if (root && ev.target instanceof Node && !root.contains(ev.target)) engaged = false;
	}

	/** @param {ClipboardEvent} ev */
	function onpaste(ev) {
		if (!engaged || apple.locked || isField(ev.target)) return;
		const text = ev.clipboardData?.getData('text');
		if (text) {
			apple.type(text);
			ev.preventDefault();
		}
	}

	/** @param {DragEvent} ev */
	function ondrop(ev) {
		ev.preventDefault();
		dragging = false;
		insertFile(ev.dataTransfer?.files[0]);
	}

	function download() {
		const data = apple.saved(drive);
		if (!data) return;
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([data]));
		a.download = baseName(apple.drives[drive]);
		a.click();
		URL.revokeObjectURL(a.href);
	}

	const bar = toolbar('apple');
	/** Where these controls live in the outline (ApplePanels). */
	const CPU = ['apple-cpu'];
	const DISKS = ['apple-disks'];
	$effect(() => {
		const off = [
			bar.offer('reboot', 'Reboot', reboot, 'control', CPU),
			bar.offer('reset', 'Ctrl-Reset', reset, 'control', CPU),
			bar.offer('speed', 'the speed', speed, 'control', CPU),
			bar.offer('mute', 'Mute', mute, 'control', ['apple-sound']),
			bar.offer('caps', 'Caps Lock', caps, 'control', ['apple-io']),
			bar.offer('joystick', 'Joystick', joystick, 'control', ['apple-io']),
			bar.offer('insert-file', 'Insert file', fileInput, 'control', DISKS),
			bar.offer('save-disk', 'Save disk', saveDisk, 'control', DISKS)
		];
		// microM8 runs its own 6502: no pause or step from here.
		if (apple.id !== 'microm8') off.push(bar.offer('pause', 'Pause', pause, 'control', CPU), bar.offer('step', 'Step', step, 'control', CPU));
		if (menu.length) off.push(bar.offer('insert-disk', 'Insert a disk', insertDisk, 'control', DISKS));
		return () => off.forEach((f) => f());
	});

	const baseName = (/** @type {string} */ path) => path.slice(path.lastIndexOf('/') + 1);
	const labelOf = (/** @type {string} */ name) => disks.find((d) => d.name === name)?.label ?? baseName(name);
</script>

<svelte:window {onkeydown} {onkeyup} {onblur} {onpaste} {onpointerdown} />

<div class="microm8" {@attach (el) => void (root = el)}>
	<div class={['glass', { dragging, engaged }]}>
		<canvas
			{@attach mountGlass}
			width={FRAME_WIDTH}
			height={FRAME_HEIGHT}
			tabindex={apple.chat ? -1 : 0}
			onfocus={() => apple.chat?.focus()}
			class={{ covered: apple.videxShowing }}
			aria-label="Apple II screen"
			onpointerdown={(ev) => (engage(), stick(ev), stickButton(ev, true), danceTouch(ev, 'press'))}
			onpointermove={(ev) => (stick(ev), danceTouch(ev, 'drag'))}
			onpointerup={(ev) => (stickButton(ev, false), danceTouch(ev, 'release'))}
			oncontextmenu={(ev) => apple.mouseStick && ev.preventDefault()}
			ondragover={(ev) => {
				ev.preventDefault();
				dragging = true;
			}}
			ondragleave={() => (dragging = false)}
			{ondrop}
		></canvas>
		<canvas
			{@attach videx}
			class={['videx', { off: !apple.videxShowing }]}
			width={VIDEX_WIDTH}
			height={VIDEX_HEIGHT}
			aria-label="Videx 80-column screen"
		></canvas>
		{#if apple.locked && engaged}<p class="locked" role="status">{apple.locked}</p>{/if}
	</div>

	<!-- As wide as the screen, so the speed at its end sits under the screen's corner. -->
	<div class="under">
		<MachineToolbar {bar} label="The Apple's toolbar" end={speedReadout} />
	</div>
	{#if apple.phase !== 'running'}
		<p class={['state', { failed: apple.phase === 'error' }]}>
			{#if apple.phase === 'idle' && (pending || beginLabel)}
				click the screen to start {pending ? (pending.label ?? pending.name) : beginLabel}{apple.id === 'microm8' ? ' (loads 41 MB, 10 MB compressed)' : ''}
			{:else if apple.phase === 'idle'}
				click the screen to switch on{apple.id === 'microm8' ? ' (loads 41 MB, 10 MB compressed)' : ''}
			{:else if apple.phase === 'loading'}
				{apple.id === 'microm8' ? 'loading microM8…' : 'reading the Apple ][+ ROM…'}
			{:else if apple.phase === 'error'}
				{apple.error}
			{/if}
		</p>
	{/if}
	<ApplePanels {labelOf} {angel} {play} {playTitle} {appDisks} disks={driveControls} />
</div>

{#snippet speedReadout()}
	<!-- A button, not only a tooltip: a touch screen has no hover, so a tap opens the same
	     numbers as a card. Not a live region; it changes every second. -->
	<button class="speed" popovertarget="apple-speed" aria-label={apple.phase === 'running' ? `Speed: ${speedText} a real Apple ][+; more numbers` : 'Speed: the Apple is off'} title={speedTip}>{speedText}</button>
	<div id="apple-speed" class="card" popover="auto">{speedTip}</div>
{/snippet}

{#snippet driveControls()}
	<div class="drives-bar">
		<span class="speeds" role="group" aria-label="Drive">
			{#each [0, 1] as d (d)}
				<button
					class={{ on: drive === d }}
					aria-pressed={drive === d}
					title="Put disks and files in drive {d + 1}, and save from it: {apple.drives[d] || 'empty'}"
					onclick={() => (drive = d)}>drive {d + 1}</button
				>
			{/each}
		</span>
		<Pinnable {bar} id="insert-disk" />
		<Pinnable {bar} id="insert-file" />
		<Pinnable {bar} id="save-disk" />
	</div>
{/snippet}

<!-- The controls this component owns, offered to the toolbar and placed at home in the
     outline: compact is the toolbar's look, an icon whose tooltip says what it does. Each
     gives the keyboard back to the Apple. -->
{#snippet reboot(compact = false)}
	<button class="icon" aria-label="Reboot" title="Reboot: power cycle and boot drive 1" onclick={() => (apple.reboot(), canvas?.focus())}>🔄{compact ? '' : ' Reboot'}</button>
{/snippet}

{#snippet reset(compact = false)}
	<button class="icon" aria-label="Ctrl-Reset" title="Ctrl-Reset: stop the program and keep memory" onclick={() => (apple.reset(), canvas?.focus())}>⛔{compact ? '' : ' Ctrl-Reset'}</button>
{/snippet}

{#snippet pause(compact = false)}
	<button
		class="icon"
		aria-label={apple.paused ? 'Go on' : 'Pause'}
		aria-pressed={apple.paused}
		aria-keyshortcuts="\\"
		title={apple.paused ? 'Go on (key \\)' : 'Pause: hold the 6502 still (key \\)'}
		onclick={() => (apple.pause(), canvas?.focus())}>{apple.paused ? '▶️' : '⏸️'}{compact ? '' : apple.paused ? ' Go on' : ' Pause'}</button
	>
{/snippet}

{#snippet step(compact = false)}
	<button class="icon" aria-label="Step" aria-keyshortcuts="[" title="Step: one instruction, then hold (key [)" onclick={() => (apple.stepOne(), canvas?.focus())}>⏭️{compact ? '' : ' Step'}</button>
{/snippet}

{#snippet speed()}
	<RateSlider {rates} index={rateIndex} onpick={pickRate} keys={EMULATOR_KEYS_HELP} />
{/snippet}

{#snippet mute(compact = false)}
	<button
		class={['icon', { on: !apple.sound }]}
		aria-label="Mute the speaker"
		aria-pressed={!apple.sound}
		title={apple.sound ? "Mute the Apple's speaker; the dance is separate" : "Unmute the Apple's speaker"}
		onclick={() => ((apple.sound = !apple.sound), apple.listen(), canvas?.focus())}>{apple.sound ? '🔊' : '🔇'}{compact ? '' : apple.sound ? ' Mute' : ' Muted'}</button
	>
{/snippet}

{#snippet caps(compact = false)}
	<button
		class={['icon', { on: apple.caps }]}
		aria-label="Caps Lock"
		aria-pressed={apple.caps}
		title="Caps Lock: DOS 3.3 and Integer BASIC only know capitals"
		onclick={() => ((apple.caps = !apple.caps), canvas?.focus())}>⇪{compact ? '' : ' Caps Lock'}</button
	>
{/snippet}

{#snippet joystick(compact = false)}
	<button
		class={['icon', { on: apple.mouseStick }]}
		aria-label="Joystick"
		aria-pressed={apple.mouseStick}
		title="Joystick: paddles 0 and 1 follow the pointer over the screen; left and right buttons are pushbuttons 0 and 1"
		onclick={() => ((apple.mouseStick = !apple.mouseStick), canvas?.focus())}>🕹️{compact ? '' : ' Joystick'}</button
	>
{/snippet}

{#snippet insertDisk(compact = false)}
	<select bind:value={choice} onchange={insertChoice} aria-label="Put a cabinet disk in drive {drive + 1}" title="Put a cabinet disk in drive {drive + 1}">
		<option value="">{compact ? '💾…' : 'Insert a disk…'}</option>
		{#each menu as d (d.name)}
			<option value={d.name}>{d.label ?? d.name}{d.profile && !d.label ? ` (${d.profile})` : ''}</option>
		{/each}
	</select>
{/snippet}

{#snippet fileInput(compact = false)}
	<label class="file" title="Put a disk image from this computer in drive {drive + 1}; dropping one on the screen does the same">
		{compact ? '📂' : 'Insert file…'}
		<input type="file" accept=".dsk,.do,.po,.nib,.woz,.2mg,.hdv" onchange={(ev) => insertFile(ev.currentTarget.files?.[0])} />
	</label>
{/snippet}

{#snippet saveDisk(compact = false)}
	<button
		class="icon"
		aria-label="Save disk"
		onclick={download}
		disabled={!apple.drives[drive]}
		title="Download the disk in drive {drive + 1} as the Apple has written it">{compact ? '📥' : 'Save disk'}</button
	>
{/snippet}

<style>
	.microm8 {
		/* Short enough that the toolbar under the screen stays in the window: the window less
		   the title, the description and the toolbar, never under 320px wide. */
		--screen: max(320px, calc((100dvh - 9rem) * 560 / 384));
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 1120px;
	}
	.glass {
		--bezel: 8px;
		box-sizing: content-box;
		width: calc(100% - 2 * var(--bezel));
		max-width: var(--screen);
		padding: var(--bezel);
		aspect-ratio: 560 / 384;
		position: relative;
		background: #000;
		outline: none;
		box-shadow: 0 0 0 1px #444;
	}
	.glass canvas {
		position: absolute;
		inset: var(--bezel);
		width: calc(100% - 2 * var(--bezel));
		height: calc(100% - 2 * var(--bezel));
		image-rendering: pixelated;
	}
	.glass canvas.covered {
		opacity: 0;
	}
	.glass canvas.videx {
		z-index: 1;
		pointer-events: none;
	}
	.glass canvas.off {
		display: none;
	}
	.locked {
		position: absolute;
		left: 50%;
		bottom: calc(var(--bezel) + 6px);
		z-index: 2;
		transform: translateX(-50%);
		margin: 0;
		padding: 0.2rem 0.6rem;
		border-radius: 3px;
		background: rgb(0 0 0 / 0.8);
		color: #ffd27a;
		font: 0.8rem system-ui, sans-serif;
		pointer-events: none;
	}
	.glass.engaged {
		box-shadow: 0 0 0 2px #4a4;
	}
	.glass.dragging {
		box-shadow: 0 0 0 3px #48f;
	}
	button.on {
		background: #cfc;
		color: #000;
	}
	.under {
		max-width: calc(var(--screen) + 16px);
	}
	.icon {
		min-width: 2rem;
		padding: 0.1rem 0.3rem;
		font-size: 1rem;
		line-height: 1.2;
	}
	.icon:focus-visible,
	.speed:focus-visible {
		outline: 2px solid #48f;
		outline-offset: 1px;
	}
	/* The speed at the right end, wide enough for "0.50×" so the row never shifts. */
	.speed {
		margin-left: auto;
		min-width: 6ch;
		padding: 0.1rem 0.3rem;
		border: none;
		background: none;
		color: inherit;
		text-align: right;
		font: 600 0.95rem ui-monospace, monospace;
		font-variant-numeric: tabular-nums;
		cursor: help;
	}
	.card {
		max-width: 26rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--term-edge);
		border-radius: 4px;
		background: var(--term-bg);
		color: var(--term-ink);
		font: 0.8rem/1.45 system-ui, sans-serif;
		white-space: pre-line;
	}
	.drives-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin: 0.2rem 0;
		font: 0.85rem system-ui, sans-serif;
	}
	.speeds {
		display: inline-flex;
		gap: 2px;
	}
	.file input {
		display: none;
	}
	.file {
		cursor: pointer;
		text-decoration: underline;
	}
	.state {
		margin: 0;
		font: 0.85rem system-ui, sans-serif;
		opacity: 0.8;
	}
	.state.failed {
		color: #e8a070;
		opacity: 1;
		white-space: pre-wrap;
	}
</style>
