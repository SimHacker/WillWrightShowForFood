<script>
	// The microM8 Apple: its screen, its keyboard, and two drives. Click the screen to type;
	// pick a disk or drop an image on the screen to put it in the chosen drive. Swapping a disk
	// never restarts the Apple; Reboot boots drive 1. Pasted text is typed in.
	// Nothing heavy loads with the page: the 41 MB module comes on the first click, boot or
	// drop, and a disk only when it is picked.
	import { FRAME_HEIGHT, FRAME_WIDTH } from '@wwsff/cabinet/microm8';
	import { microM8 } from './microm8.svelte.js';

	/** @type {{ disks?: { name: string, url: () => Promise<string> }[] }} */
	let { disks = [] } = $props();

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
		microM8.start();
	}

	/** @param {HTMLCanvasElement} c */
	function screen(c) {
		canvas = c;
		return microM8.attach(c);
	}

	/** @param {string} name @param {ArrayBuffer} data */
	function insert(name, data) {
		microM8.insert(name, new Uint8Array(data), drive);
		engaged = true;
		canvas?.focus();
	}

	// The menu is an action, not a setting: it resets, and the keyboard goes to the Apple at
	// once, so typing never reaches the menu's type-ahead and swaps the disk.
	async function insertChoice() {
		const disk = disks.find((d) => d.name === choice);
		choice = '';
		canvas?.focus();
		if (!disk) return;
		const response = await fetch(await disk.url());
		insert(disk.name, await response.arrayBuffer());
	}

	/** @param {File | undefined | null} file */
	async function insertFile(file) {
		if (file) insert(file.name, await file.arrayBuffer());
	}

	/** @param {KeyboardEvent} ev */
	function onkeydown(ev) {
		if (!engaged || isField(ev.target)) return;
		microM8.listen();
		if (microM8.press(ev)) ev.preventDefault();
	}

	/** @param {PointerEvent} ev */
	function onpointerdown(ev) {
		if (root && ev.target instanceof Node && !root.contains(ev.target)) engaged = false;
	}

	/** @param {ClipboardEvent} ev */
	function onpaste(ev) {
		if (!engaged || isField(ev.target)) return;
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
		a.download = microM8.drives[drive];
		a.click();
		URL.revokeObjectURL(a.href);
	}

	const hex = (/** @type {number} */ n, /** @type {number} */ w) => n.toString(16).toUpperCase().padStart(w, '0');
	const baseName = (/** @type {string} */ path) => path.slice(path.lastIndexOf('/') + 1);
</script>

<svelte:window {onkeydown} {onpaste} {onpointerdown} />

<div class="microm8" {@attach (el) => void (root = el)}>
	<canvas
		{@attach screen}
		width={FRAME_WIDTH}
		height={FRAME_HEIGHT}
		tabindex="0"
		class:dragging
		class:engaged
		aria-label="Apple II screen"
		onpointerdown={engage}
		ondragover={(ev) => {
			ev.preventDefault();
			dragging = true;
		}}
		ondragleave={() => (dragging = false)}
		{ondrop}
	></canvas>

	<div class="bar">
		<span class="speeds" role="group" aria-label="Drive">
			{#each [0, 1] as d (d)}
				<button
					class:on={drive === d}
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
					<option value={d.name}>{d.name}</option>
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
			class:on={microM8.caps}
			aria-pressed={microM8.caps}
			title="Caps Lock: DOS 3.3 and Integer BASIC only know capitals"
			onclick={() => ((microM8.caps = !microM8.caps), canvas?.focus())}>Caps Lock</button
		>
		<button
			class:on={microM8.sound}
			aria-pressed={microM8.sound}
			title="The Apple's speaker"
			onclick={() => ((microM8.sound = !microM8.sound), microM8.listen(), canvas?.focus())}>Sound</button
		>
		<span class="speeds" role="group" aria-label="Speed">
			{#each [1, 2, 4, 100] as w (w)}
				<button class:on={microM8.warp === w} aria-pressed={microM8.warp === w} onclick={() => (microM8.speed(w), canvas?.focus())}
					>{w === 100 ? 'max' : `${w}×`}</button
				>
			{/each}
		</span>
		<button onclick={download} disabled={!microM8.drives[drive]} title="Download the disk in the selected drive as the Apple has written it"
			>Save disk</button
		>
	</div>
	<p class="state">
		{#if microM8.phase === 'idle'}
			click the screen to switch on (loads 41 MB, 10 MB compressed)
		{:else if microM8.phase === 'loading'}
			loading microM8…
		{:else if microM8.phase === 'error'}
			{microM8.error}
		{:else if microM8.status}
			<span class="num">PC ${hex(microM8.status.pc, 4)}</span>
			<span class="num">{microM8.mhz.toFixed(2)} MHz</span>
			<span>{microM8.status.modes.join(' ')}</span>
			{#each microM8.drives as name, d (d)}
				<span class="drive" title={name || 'empty'}>{d + 1}: {name ? baseName(name) : 'empty'}</span>
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
	canvas {
		width: 100%;
		aspect-ratio: 560 / 384;
		image-rendering: pixelated;
		background: #000;
		outline: none;
	}
	canvas.engaged {
		box-shadow: 0 0 0 2px #4a4;
	}
	canvas.dragging {
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
	.state .drive {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
