<script>
	// The microM8 Apple: its screen, its keyboard, and two drives. Click the screen to type;
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
	import { microM8 } from './microm8.svelte.js';

	/** @typedef {{ name: string, label?: string, profile?: string, url: () => Promise<string> }} Disk */
	/** @type {{ disks?: Disk[], boot?: string, relaunch?: (disk: Disk) => string, begin?: () => unknown, beginLabel?: string }} */
	let {
		disks = [],
		boot = undefined,
		relaunch = (disk) => `?disk=${encodeURIComponent(disk.name)}`,
		begin = undefined,
		beginLabel = ''
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
		microM8.listen();
		const disk = pending;
		pending = undefined;
		if (disk && microM8.phase === 'idle') {
			drive = 0;
			load(disk);
		} else if (begin && microM8.phase === 'idle') begin();
		else microM8.start();
	}

	/** @param {HTMLCanvasElement} el */
	function apple(el) {
		canvas = el;
		return () => {
			if (canvas === el) canvas = undefined;
		};
	}

	/** @param {HTMLCanvasElement} el */
	function videx(el) {
		// Mounts after the Apple canvas, so `canvas` is already set.
		if (!canvas) return;
		return microM8.attach(canvas, el);
	}

	/** @param {string} name @param {ArrayBuffer} data @param {string} [profile] */
	async function insert(name, data, profile) {
		engaged = true;
		canvas?.focus();
		await microM8.insert(name, new Uint8Array(data), drive, profile);
	}

	/** @param {Disk} disk @param {{ reboot?: boolean }} [how] */
	async function load(disk, { reboot = false } = {}) {
		const profile = disk.profile ?? '';
		if (microM8.phase !== 'idle' && profile !== microM8.profile) {
			globalThis.sessionStorage?.setItem(RELAUNCHED, disk.name);
			location.assign(relaunch(disk));
			return;
		}
		const running = microM8.phase !== 'idle';
		const response = await fetch(await disk.url());
		await insert(disk.name, await response.arrayBuffer(), profile);
		if (reboot && running) microM8.reboot();
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
		if (asked === name || relaunched === name || microM8.phase !== 'idle') load(disk, { reboot: true });
		else pending = disk;
	});

	/** @param {File | undefined | null} file */
	async function insertFile(file) {
		if (file) insert(file.name, await file.arrayBuffer());
	}

	/** @param {KeyboardEvent} ev */
	function onkeydown(ev) {
		if (!engaged || isField(ev.target)) return;
		microM8.listen();
		if (ev.key === 'Alt') {
			microM8.button('key', ev.location === 2 ? 1 : 0, true);
			ev.preventDefault();
		} else if (microM8.press(ev)) ev.preventDefault();
	}

	/** @param {KeyboardEvent} ev */
	function onkeyup(ev) {
		if (ev.key === 'Alt') microM8.button('key', ev.location === 2 ? 1 : 0, false);
	}

	function onblur() {
		for (const n of [0, 1, 2]) {
			microM8.button('key', n, false);
			microM8.button('mouse', n, false);
		}
	}

	/** @param {PointerEvent} ev */
	function stick(ev) {
		if (!microM8.mouseStick || !canvas) return;
		const r = canvas.getBoundingClientRect();
		const at = (/** @type {number} */ v) => Math.min(255, Math.max(0, Math.round(v * 255)));
		microM8.paddle(0, at((ev.clientX - r.left) / r.width));
		microM8.paddle(1, at((ev.clientY - r.top) / r.height));
	}

	/** @param {PointerEvent} ev @param {boolean} down */
	function stickButton(ev, down) {
		if (!microM8.mouseStick || ev.button > 2 || ev.button === 1) return;
		microM8.button('mouse', ev.button === 2 ? 1 : 0, down);
	}

	/** @param {PointerEvent} ev */
	function onpointerdown(ev) {
		if (root && ev.target instanceof Node && !root.contains(ev.target)) engaged = false;
	}

	/** @param {ClipboardEvent} ev */
	function onpaste(ev) {
		if (!engaged || microM8.locked || isField(ev.target)) return;
		const text = ev.clipboardData?.getData('text');
		if (text) {
			microM8.type(text);
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
		const data = microM8.saved(drive);
		if (!data) return;
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([data]));
		a.download = baseName(microM8.drives[drive]);
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
			{@attach apple}
			width={FRAME_WIDTH}
			height={FRAME_HEIGHT}
			tabindex="0"
			class={{ covered: microM8.videxShowing }}
			aria-label="Apple II screen"
			onpointerdown={(ev) => (engage(), stick(ev), stickButton(ev, true))}
			onpointermove={stick}
			onpointerup={(ev) => stickButton(ev, false)}
			oncontextmenu={(ev) => microM8.mouseStick && ev.preventDefault()}
			ondragover={(ev) => {
				ev.preventDefault();
				dragging = true;
			}}
			ondragleave={() => (dragging = false)}
			{ondrop}
		></canvas>
		<canvas
			{@attach videx}
			class={['videx', { off: !microM8.videxShowing }]}
			width={VIDEX_WIDTH}
			height={VIDEX_HEIGHT}
			aria-label="Videx 80-column screen"
		></canvas>
		{#if microM8.locked && engaged}<p class="locked" role="status">{microM8.locked}</p>{/if}
	</div>

	<div class="bar">
		<span class="speeds" role="group" aria-label="Drive">
			{#each [0, 1] as d (d)}
				<button
					class={{ on: drive === d }}
					aria-pressed={drive === d}
					title={microM8.drives[d] || 'empty'}
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
		<button onclick={() => (microM8.reboot(), canvas?.focus())} title="Power cycle and boot drive 1">Reboot</button>
		<button onclick={() => (microM8.reset(), canvas?.focus())} title="Ctrl-Reset: stop the program, keep memory">Ctrl-Reset</button>
		<button
			class={{ on: microM8.caps }}
			aria-pressed={microM8.caps}
			title="Caps Lock: DOS 3.3 and Integer BASIC only know capitals"
			onclick={() => ((microM8.caps = !microM8.caps), canvas?.focus())}>Caps Lock</button
		>
		<button
			class={{ on: microM8.sound }}
			aria-pressed={microM8.sound}
			title="The Apple's speaker"
			onclick={() => ((microM8.sound = !microM8.sound), microM8.listen(), canvas?.focus())}>Sound</button
		>
		<span class="speeds" role="group" aria-label="Speed">
			{#each [1, 2, 4, 100] as w (w)}
				<button class={{ on: microM8.warp === w }} aria-pressed={microM8.warp === w} onclick={() => (microM8.speed(w), canvas?.focus())}
					>{w === 100 ? 'max' : `${w}×`}</button
				>
			{/each}
		</span>
		<button
			class={{ on: microM8.mouseStick }}
			aria-pressed={microM8.mouseStick}
			title="Joystick: paddles 0 and 1 follow the pointer over the screen; left and right buttons are pushbuttons 0 and 1"
			onclick={() => ((microM8.mouseStick = !microM8.mouseStick), canvas?.focus())}>Joystick</button
		>
		<button onclick={download} disabled={!microM8.drives[drive]} title="Download the disk in the selected drive as the Apple has written it"
			>Save disk</button
		>
	</div>
	<p class="state">
		{#if microM8.phase === 'idle' && (pending || beginLabel)}
			click the screen to start {pending ? (pending.label ?? pending.name) : beginLabel} (loads 41 MB, 10 MB compressed)
		{:else if microM8.phase === 'idle'}
			click the screen to switch on (loads 41 MB, 10 MB compressed)
		{:else if microM8.phase === 'loading'}
			loading microM8…
		{:else if microM8.phase === 'error'}
			{microM8.error}
		{:else if microM8.status}
			<span class="num">PC ${hex(microM8.status.pc, 4)}</span>
			<span class="num">{microM8.mhz.toFixed(2)} MHz</span>
			<span>{microM8.status.modes.join(' ')}</span>
			<span class="lamps" title="Annunciators AN0-AN3">
				{#each [0, 1, 2, 3] as n (n)}
					<span class={['lamp', { lit: !!(microM8.annunciators & (1 << n)) }]}>{n}</span>
				{/each}
			</span>
			{#if microM8.gamepad}<span class="drive" title={microM8.gamepad}>pad</span>{/if}
			{#each microM8.drives as name, d (d)}
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
