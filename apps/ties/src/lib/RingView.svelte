<script>
	// The PIXIE ring structure in 3D: live from the running PDP-7's core, or loaded from a
	// file (YAML, JSON, or the binary transfer stream). Drag to turn, wheel to zoom, point at
	// a cell to read it, click to open it in the memory panel.
	import { onMount } from 'svelte';
	import { DEFAULT_CAMERA, changedCells, drawList, paint, photograph, pick, readRings, ringToScene } from '@wwsff/pixie';

	/** @type {{ read: ((addr: number) => number) | null, onOpen?: (addr: number) => void, height?: number }} */
	let { read, onOpen, height = 260 } = $props();

	let canvas = $state(null);
	let width = $state(400);
	let source = $state('live');
	let loaded = $state.raw(null);
	let note = $state('');
	let hover = $state.raw(null);
	let spin = $state(true);
	const cam = { ...DEFAULT_CAMERA };
	let scene = null;
	let last = null;
	let marks = [];
	let hot = new Set();

	/** BEG..END only means something once SYMELEC has set them; anything else is not a ring area. */
	function live() {
		if (!read) return null;
		const img = photograph(read);
		return img.end > img.beg && img.end - img.beg <= 8192 ? img : null;
	}

	function frame(dt) {
		const img = source === 'live' ? live() : loaded;
		if (!img) {
			scene = null;
			note = source === 'live' ? 'No ring structure in core yet: SYMELEC sets BEG and END when it starts.' : '';
		} else {
			hot = changedCells(last, img);
			if (!scene || hot.size || img.beg !== last?.beg || img.words.length !== last?.words.length) {
				scene = ringToScene(img);
				note = `${scene.nodes.length} cells in ${scene.chains.length} chains, ${(img.end - img.beg).toString(8)} words at ${img.beg.toString(8)}`;
			}
			last = img;
		}
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
	let moved = false;
	let px = 0;
	let py = 0;
	function down(e) {
		dragging = true;
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
			cam.yaw += dx * 0.01;
			cam.pitch = Math.max(-1.5, Math.min(1.5, cam.pitch + dy * 0.01));
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

	async function choose(e) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		try {
			const bytes = new Uint8Array(await file.arrayBuffer());
			loaded = readRings(bytes);
			source = 'file';
			scene = null;
			last = null;
			hot = new Set();
		} catch (err) {
			note = `${file.name}: ${err.message}`;
		}
	}

	const o = (w) => (w ?? 0).toString(8).padStart(6, '0');
</script>

<div class="rings" bind:clientWidth={width}>
	<div class="mem-bar">
		<button type="button" class="chip" class:on={source === 'live'} aria-pressed={source === 'live'} title="The ring structure in the running machine's core, BEG to END" onclick={() => ((source = 'live'), (scene = null), (last = null))}>live</button>
		<label class="chip" title="A ring image or graph as YAML or JSON, or a binary transfer stream (3 bytes a word)"
			>file<input type="file" accept=".yml,.yaml,.json,.pix,.bin" onchange={choose} hidden /></label
		>
		<button type="button" class="chip" class:on={spin} aria-pressed={spin} title="Turn slowly" onclick={() => (spin = !spin)}>spin</button>
		<span class="mem-hint">{#if hover}{o(hover.addr)} {hover.kind} {o(hover.word)}{#if hover.cdrWord !== undefined} . {o(hover.cdrWord)}{/if}{hover.label ? ` ${hover.label}` : ''}{:else}{note}{/if}</span>
	</div>
	<canvas
		bind:this={canvas}
		style:height="{height}px"
		aria-label="Ring structure in 3D. Drag to turn, wheel to zoom, click a cell to open it in memory."
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointerleave={() => (hover = null)}
		onwheel={wheel}
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
	.mem-hint {
		font-family: ui-monospace, monospace;
		font-size: 0.8em;
		opacity: 0.8;
	}
</style>
