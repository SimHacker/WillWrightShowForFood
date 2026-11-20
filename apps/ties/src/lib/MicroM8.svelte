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
	// A disk's `label` names it in the menu and the drive lamps.
	import { onMount } from 'svelte';
	import { FRAME_HEIGHT, FRAME_WIDTH, VIDEX_HEIGHT, VIDEX_WIDTH } from '@wwsff/cabinet/microm8';
	import { ENGINES, apple } from './apple.svelte.js';

	/** @typedef {{ name: string, label?: string, profile?: string, url: () => Promise<string> }} Disk */
	/** @type {{ disks?: Disk[], boot?: string, relaunch?: (disk: Disk) => string, begin?: () => unknown, beginLabel?: string, defaultCpu?: string }} */
	let {
		disks = [],
		boot = undefined,
		relaunch = (disk) => `?disk=${encodeURIComponent(disk.name)}`,
		begin = undefined,
		beginLabel = '',
		defaultCpu = 'microm8'
	} = $props();

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

	/** @param {KeyboardEvent} ev */
	function onkeydown(ev) {
		if (!engaged || isField(ev.target)) return;
		apple.listen();
		if (ev.key === 'Alt') {
			apple.button('key', ev.location === 2 ? 1 : 0, true);
			ev.preventDefault();
		} else if (apple.press(ev)) ev.preventDefault();
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

	const hex = (/** @type {number} */ n, /** @type {number} */ w) => n.toString(16).toUpperCase().padStart(w, '0');
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
			tabindex="0"
			class={{ covered: apple.videxShowing }}
			aria-label="Apple II screen"
			onpointerdown={(ev) => (engage(), stick(ev), stickButton(ev, true))}
			onpointermove={stick}
			onpointerup={(ev) => stickButton(ev, false)}
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

	<div class="bar">
		<select
			aria-label="Emulator and rung"
			title={ENGINES.find((e) => e.id === apple.id)?.title}
			value={apple.id}
			onchange={(e) => (apple.choose(e.currentTarget.value), canvas?.focus())}
		>
			{#each ENGINES as e (e.id)}
				<option value={e.id} title={e.title}>{e.label}</option>
			{/each}
		</select>
		<span class="speeds" role="group" aria-label="Drive">
			{#each [0, 1] as d (d)}
				<button
					class={{ on: drive === d }}
					aria-pressed={drive === d}
					title={apple.drives[d] || 'empty'}
					onclick={() => ((drive = d), canvas?.focus())}>drive {d + 1}</button
				>
			{/each}
		</span>
		{#if disks.length}
			<select bind:value={choice} onchange={insertChoice} aria-label="Put a cabinet disk in the drive">
				<option value="">Insert a disk…</option>
				{#each disks as d (d.name)}
					<option value={d.name}>{d.label ?? d.name}{d.profile && !d.label ? ` (${d.profile})` : ''}</option>
				{/each}
			</select>
		{/if}
		<label class="file">
			Insert file…
			<input type="file" accept=".dsk,.do,.po,.nib,.woz,.2mg,.hdv" onchange={(ev) => insertFile(ev.currentTarget.files?.[0])} />
		</label>
		<button onclick={() => (apple.reboot(), canvas?.focus())} title="Power cycle and boot drive 1">Reboot</button>
		<button onclick={() => (apple.reset(), canvas?.focus())} title="Ctrl-Reset: stop the program, keep memory">Ctrl-Reset</button>
		<button
			class={{ on: apple.caps }}
			aria-pressed={apple.caps}
			title="Caps Lock: DOS 3.3 and Integer BASIC only know capitals"
			onclick={() => ((apple.caps = !apple.caps), canvas?.focus())}>Caps Lock</button
		>
		<button
			class={{ on: apple.sound }}
			aria-pressed={apple.sound}
			title="The Apple's speaker"
			onclick={() => ((apple.sound = !apple.sound), apple.listen(), canvas?.focus())}>Sound</button
		>
		<span class="speeds" role="group" aria-label="Speed">
			{#each [1, 2, 4, 100] as w (w)}
				<button class={{ on: apple.warp === w }} aria-pressed={apple.warp === w} onclick={() => (apple.speed(w), canvas?.focus())}
					>{w === 100 ? 'max' : `${w}×`}</button
				>
			{/each}
		</span>
		<button
			class={{ on: apple.mouseStick }}
			aria-pressed={apple.mouseStick}
			title="Joystick: paddles 0 and 1 follow the pointer over the screen; left and right buttons are pushbuttons 0 and 1"
			onclick={() => ((apple.mouseStick = !apple.mouseStick), canvas?.focus())}>Joystick</button
		>
		<button onclick={download} disabled={!apple.drives[drive]} title="Download the disk in the selected drive as the Apple has written it"
			>Save disk</button
		>
	</div>
	<p class="state">
		{#if apple.phase === 'idle' && (pending || beginLabel)}
			click the screen to start {pending ? (pending.label ?? pending.name) : beginLabel}{apple.id === 'microm8' ? ' (loads 41 MB, 10 MB compressed)' : ''}
		{:else if apple.phase === 'idle'}
			click the screen to switch on{apple.id === 'microm8' ? ' (loads 41 MB, 10 MB compressed)' : ''}
		{:else if apple.phase === 'loading'}
			{apple.id === 'microm8' ? 'loading microM8…' : 'reading the Apple ][+ ROM…'}
		{:else if apple.phase === 'error'}
			{apple.error}
		{:else if apple.status}
			<span class="num">PC ${hex(apple.status.pc, 4)}</span>
			<span class="num">{apple.mhz.toFixed(2)} MHz</span>
			{#if apple.pace}<span>{apple.pace}/s</span>{/if}
			<span>{apple.status.modes.join(' ')}</span>
			<span class="lamps" title="Annunciators AN0-AN3">
				{#each [0, 1, 2, 3] as n (n)}
					<span class={['lamp', { lit: !!(apple.annunciators & (1 << n)) }]}>{n}</span>
				{/each}
			</span>
			{#if apple.gamepad}<span class="drive" title={apple.gamepad}>pad</span>{/if}
			{#each apple.drives as name, d (d)}
				<span class="drive" title={name || 'empty'}>{d + 1}: {name ? labelOf(name) : 'empty'}</span>
			{/each}
		{/if}
	</p>
</div>

<style>
	.microm8 {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 1120px;
	}
	.glass {
		--bezel: 8px;
		box-sizing: content-box;
		width: calc(100% - 2 * var(--bezel));
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
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font: 0.85rem system-ui, sans-serif;
	}
	button.on {
		background: #cfc;
		color: #000;
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
		display: flex;
		gap: 1.2em;
		margin: 0;
		font: 0.8rem ui-monospace, monospace;
		opacity: 0.8;
		white-space: nowrap;
		overflow: hidden;
	}
	.state .num {
		font-variant-numeric: tabular-nums;
	}
	.lamps {
		display: inline-flex;
		gap: 3px;
	}
	.lamp {
		width: 1.2em;
		text-align: center;
		border-radius: 3px;
		background: #333;
		color: #888;
	}
	.lamp.lit {
		background: #f80;
		color: #000;
	}
	.state .drive {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
