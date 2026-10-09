<script>
	// The PIXIE ring structure in 3D: live from the running PDP-7's core, or loaded from a
	// file (YAML, JSON, or the binary transfer stream). PIX, YAML and JSON save what's shown;
	// LOAD puts a file into the machine's core when the program can take one, else shows it. Drag to turn, wheel to zoom, point at
	// a cell to read it, click to open it in the memory panel.
	import { onMount } from 'svelte';
	import { DEFAULT_CAMERA, changedCells, drawList, encodeTransfer, packWords, paint, pick, readRings, ringToScene } from '@wwsff/pixie';

	/**
	 * capture() photographs core: { image, roots } or { error }. implant(image) puts a ring
	 * image into core, or is null if the program can't take one. name(addr) gives a symbol.
	 * @type {{ capture: (() => any) | null, implant?: ((image: any) => any) | null, name?: (addr: number) => string, onOpen?: (addr: number) => void, height?: number }}
	 */
	let { capture, implant = null, name = () => '', onOpen, height = 260 } = $props();

	let canvas = $state(null);
	let width = $state(400);
	let source = $state('live');
	let loaded = $state.raw(null);
	let loadedName = $state('');
	let note = $state('');
	let noteHold = 0;
	let hover = $state.raw(null);
	let spin = $state(true);
	const cam = { ...DEFAULT_CAMERA };
	let scene = null;
	let last = null;
	let marks = [];
	let hot = new Set();
	let lastRoots = '';

	function frame(dt) {
		const shot = source === 'live' ? (capture?.() ?? { error: 'No machine.' }) : loaded && { image: loaded, roots: [loaded.savins] };
		const img = shot?.image;
		if (!img) {
			scene = null;
			last = null;
			note = shot?.error ?? '';
		} else {
			hot = changedCells(last, img);
			const roots = shot.roots.join(' ');
			if (!scene || hot.size || roots !== lastRoots || img.beg !== last?.beg || img.words.length !== last?.words.length) {
				lastRoots = roots;
				scene = ringToScene(img, shot.roots);
				// Turn about the root's ring, the structure's front door.
				const root = scene.chains.find((c) => c.cells.includes(scene.root));
				cam.target = root ? [...root.center] : [0, 0, 0];
				if (noteHold <= 0) note = `${scene.nodes.length} cells in ${scene.chains.length} chains, ${(img.end - img.beg).toString(8)} words at ${img.beg.toString(8)}`;
			}
			last = img;
		}
		if (noteHold > 0) noteHold -= dt;
		if (spin && !dragging) cam.yaw += dt * 0.25;
		draw();
	}

	function draw() {
		if (!canvas) return;
		const dpr = globalThis.devicePixelRatio ?? 1;
		const h = height;
		if (canvas.width !== Math.round(width * dpr)) canvas.width = Math.round(width * dpr);
		if (canvas.height !== Math.round(h * dpr)) canvas.height = Math.round(h * dpr);
		const pen = canvas.getContext('2d');
		pen.setTransform(dpr, 0, 0, dpr, 0, 0);
		pen.fillStyle = '#000';
		pen.fillRect(0, 0, width, h);
		if (!scene) return;
		marks = drawList(scene, cam, width, h, hot);
		paint(pen, marks, cam.distance * scene.radius * 2);
	}

	onMount(() => {
		let raf = 0;
		let then = performance.now();
		const loop = (now) => {
			frame(Math.min(0.1, (now - then) / 1000));
			then = now;
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	});

	let dragging = false;
	let panning = false;
	// Shift-drag: slide the picture across the screen, pixel for pixel. Turning is unchanged.
	function pan(dx, dy) {
		const [x, y] = cam.pan ?? [0, 0];
		cam.pan = [x + dx, y + dy];
	}
	function home() {
		Object.assign(cam, DEFAULT_CAMERA, { pan: [0, 0] });
	}
	let moved = false;
	let px = 0;
	let py = 0;
	function down(e) {
		// Shift-press otherwise extends the text selection and scrolls the page.
		e.preventDefault();
		dragging = true;
		panning = e.shiftKey;
		moved = false;
		px = e.clientX;
		py = e.clientY;
		canvas.setPointerCapture(e.pointerId);
	}
	function move(e) {
		const r = canvas.getBoundingClientRect();
		if (dragging) {
			const dx = e.clientX - px;
			const dy = e.clientY - py;
			if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
			if (panning) pan(dx, dy);
			else {
				cam.yaw += dx * 0.01;
				cam.pitch = Math.max(-1.5, Math.min(1.5, cam.pitch + dy * 0.01));
			}
			px = e.clientX;
			py = e.clientY;
		}
		const addr = pick(marks, e.clientX - r.left, e.clientY - r.top);
		hover = addr === null ? null : scene?.nodes.find((n) => n.addr === addr) ?? null;
	}
	function up() {
		dragging = false;
		if (!moved && hover && onOpen) onOpen(hover.addr);
	}
	function wheel(e) {
		e.preventDefault();
		cam.distance = Math.max(0.3, Math.min(8, cam.distance * Math.exp(e.deltaY * 0.001)));
	}

	// LOAD: a ring file (YAML, JSON, or the binary transfer stream) into the running
	// machine's ring area, then watch it there. A program that can't take one shows the file.
	async function choose(e) {
		const file = e.currentTarget.files?.[0];
		e.currentTarget.value = '';
		if (!file) return;
		try {
			const image = readRings(new Uint8Array(await file.arrayBuffer()));
			const base = file.name.replace(/\.[^.]*$/, '');
			if (implant) {
				const placed = implant(image);
				loaded = null;
				source = 'live';
				note = `loaded ${base}: ${placed.words.length.toString(8)} words at ${placed.beg.toString(8)}`;
				noteHold = 2;
			} else {
				loaded = image;
				loadedName = base;
				source = 'file';
			}
			scene = null;
			last = null;
			hot = new Set();
		} catch (err) {
			note = `${file.name}: ${err.message}`;
			noteHold = 4;
		}
	}

	const o = (w) => (w ?? 0).toString(8).padStart(6, '0');

	// >PIX, >YAML, >JSON: save what's shown in that format. PIX is the binary transfer stream
	// (PXID, BEG, END, SAVINS, the words, three bytes a word: what the Titan link carries).
	// YAML and JSON are the ring image with octal words. LOAD reads any of the three back.
	function save(kind) {
		const shot = source === 'live' ? capture?.() : loaded && { image: loaded };
		const img = shot?.image;
		if (!img) {
			note = shot?.error ?? 'Nothing to save.';
			return;
		}
		const base = source === 'live' ? `rings-${img.beg.toString(8)}` : loadedName || 'rings';
		const [data, type, ext] =
			kind === 'yaml'
				? [yamlOf(img), 'text/yaml', 'yml']
				: kind === 'json'
					? [jsonOf(img), 'application/json', 'json']
					: [packWords(encodeTransfer(img)), 'application/octet-stream', 'pix'];
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([data], { type }));
		a.download = `${base}.${ext}`;
		a.click();
		setTimeout(() => URL.revokeObjectURL(a.href), 1000);
		note = `saved ${a.download}`;
		noteHold = 2;
	}
	const jsonOf = (img) =>
		`${JSON.stringify({ beg: img.beg.toString(8), end: img.end.toString(8), savins: img.savins.toString(8), words: img.words.map((w) => o(w)) })}\n`;
	const yamlOf = (img) =>
		[
			`beg: '${img.beg.toString(8)}'`,
			`end: '${img.end.toString(8)}'`,
			`savins: '${img.savins.toString(8)}'`,
			'words:',
			...img.words.map((w, i) => `  - '${o(w)}'  # ${(img.beg + i).toString(8)}`),
			''
		].join('\n');

</script>

<div class="rings" bind:clientWidth={width}>
	<div class="mem-bar">
		<button type="button" class="chip" class:on={spin} aria-pressed={spin} title="Spin: turn the structure slowly" onclick={() => (spin = !spin)}>SPIN</button>
		<label class="chip" title={implant ? "Load a ring file, PIX, YAML or JSON, into the running machine's ring area" : "Show a ring file, PIX, YAML or JSON; this program can't take one into core yet"}
			>&lt;LOAD<input type="file" onchange={choose} hidden /></label
		>
		<button type="button" class="chip" title="Save what's shown as the PIX transfer stream (.pix), what the Titan link carries" onclick={() => save('pix')}>&gt;PIX</button>
		<button type="button" class="chip" title="Save what's shown as YAML (.yml), one octal word a line with its address" onclick={() => save('yaml')}>&gt;YAML</button>
		<button type="button" class="chip" title="Save what's shown as JSON (.json), words in octal" onclick={() => save('json')}>&gt;JSON</button>
		{#if source !== 'live'}<button type="button" class="chip" title="Back to the running machine's rings" onclick={() => ((source = 'live'), (scene = null), (last = null))}>LIVE</button>{/if}
		<span class="mem-hint">{#if hover}{o(hover.addr)}{name(hover.addr) ? ` ${name(hover.addr)}` : ''} {hover.kind} {o(hover.word)}{#if hover.cdrWord !== undefined} . {o(hover.cdrWord)}{/if}{hover.label ? ` ${hover.label}` : ''}{:else}{note}{/if}</span>
	</div>
	<canvas
		bind:this={canvas}
		style:height="{height}px"
		aria-label="Ring structure in 3D. Drag to turn, shift-drag to pan, wheel to zoom, double-click to recentre, click a cell to open it in memory."
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointerleave={() => (hover = null)}
		onwheel={wheel}
		ondblclick={home}
	></canvas>
</div>

<style>
	.rings canvas {
		display: block;
		width: 100%;
		touch-action: none;
		cursor: grab;
		background: #000;
	}
	.mem-bar {
		display: flex;
		gap: 0.3em;
		align-items: center;
		flex-wrap: wrap;
	}
	/* Toggles drawn like the applet's lamps (KBD, ION): tight, monospace, lit when on. */
	.chip {
		font: inherit;
		font-family: ui-monospace, monospace;
		font-size: 0.66rem;
		line-height: 1.5;
		padding: 0 0.35ch;
		border: 1px solid #3a5a3a;
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
		color: #000;
		border-color: #9fe8a0;
	}
	.mem-hint {
		font-family: ui-monospace, monospace;
		font-size: 0.8em;
		opacity: 0.8;
	}
</style>
