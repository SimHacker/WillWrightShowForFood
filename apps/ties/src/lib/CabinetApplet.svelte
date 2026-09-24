<script>
	/**
	 * A running machine inside an article — a PDP-7 and Type 340, pointer as light pen,
	 * with a menu of programs (cabinet-programs.js). See apps/ties/CABINET-APPLET.md.
	 */
	import { onMount, untrack } from 'svelte';
	import {
		Pdp7,
		Type340,
		LightPen,
		Clock,
		Teletype,
		TinyTitan,
		Cabinet,
		DemoPlayer,
		SessionRecorder,
		replaySession,
		isSession,
		printScreen,
		disassemble,
		Trace
	} from '@wwsff/cabinet';
	import { PROGRAMS, DEFAULT_PROGRAM, programById } from './cabinet-programs.js';

	let { spec } = $props();

	// The spec picks the first program; after that the menu owns it.
	let programId = $state(untrack(() => spec.program ?? DEFAULT_PROGRAM));
	const program = $derived(programById(programId));
	let switches = $state(0);

	let canvasEl = $state(null);
	let figureEl = $state(null);
	let captionEl = $state(null);
	const SWITCH_BITS = Array.from({ length: 18 }, (_, i) => 0o400000 >>> i);
	let paused = $state(false);
	let fitSide = $state(null);
	let status = $state('loading');
	let error = $state(null);
	let running = $state(false);

	const size = $derived(Number(spec.size) || 512);
	// A size the reader dragged to wins over the fitted one, and is kept.
	const SIDE_KEY = 'cabinet-side';
	let userSide = $state(untrack(() => Number(globalThis.localStorage?.getItem(SIDE_KEY)) || null));
	const side = $derived(userSide ?? fitSide ?? size);
	// The figure's height over its width, once the bottom edge has been dragged. The tube
	// stays square; the height is a floor, so content taller than it still shows, and
	// height past the content goes to the Memory drawer or stays blank.
	const ASPECT_KEY = 'cabinet-aspect';
	let userAspect = $state(untrack(() => Number(globalThis.localStorage?.getItem(ASPECT_KEY)) || null));
	const figHeight = $derived(userAspect ? Math.round(side * userAspect) : null);

	// The tube stays square and, with the console, menu and demo rows, fits the scrolling
	// pane it sits in. The reserve is fixed, not measured, so switching programs or starting
	// a demo never resizes the tube; the demo's caption lines and the rows a program adds
	// push what is below them down.
	const TITLE_ALLOWANCE = 12;
	const CAPTION_RESERVE = 110;
	const MIN_SIDE = 200;

	function scrollParent(el) {
		for (let e = el?.parentElement; e; e = e.parentElement) {
			const oy = getComputedStyle(e).overflowY;
			if (oy === 'auto' || oy === 'scroll') return e;
		}
		return document.documentElement;
	}

	function fit(scroller) {
		if (!figureEl) return;
		const width = figureEl.parentElement?.clientWidth ?? size;
		const height = scroller.clientHeight - CAPTION_RESERVE - TITLE_ALLOWANCE;
		fitSide = Math.floor(Math.max(MIN_SIDE, Math.min(size, width, height)));
	}

	// Edge drags. A side edge scales the figure, keeping its aspect; the figure is centred,
	// so width = start ± 2·dx keeps the grabbed edge under the pointer. The bottom edge
	// keeps the width and sets the height, no shorter than the content.
	let edgeDrag = $state(null);

	/** The figure's height with the Memory drawer at its fewest lines. */
	function contentHeight() {
		if (!figureEl) return 0;
		const border = figureEl.offsetHeight - figureEl.clientHeight;
		const line = memEl?.querySelector('.mem-line')?.offsetHeight ?? 0;
		const tube = figureEl.querySelector('.tube-wrap')?.offsetHeight ?? side;
		return tube + (captionEl?.offsetHeight ?? 0) + border - (MEM_LINES - MEM_MIN_LINES) * line;
	}

	function setWidth(want) {
		const max = figureEl?.parentElement?.clientWidth ?? 4096;
		userSide = Math.round(Math.max(MIN_SIDE, Math.min(max, want)));
	}
	function setHeight(want) {
		userAspect = Math.max(want, contentHeight()) / side;
	}

	function onEdgeDown(event, edge) {
		if (event.button !== 0) return;
		event.preventDefault();
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic pointers cannot be captured; the drag still tracks while over the edge.
		}
		edgeDrag = { edge, x0: event.clientX, y0: event.clientY, side0: side, h0: figureEl?.offsetHeight ?? side };
	}
	function onEdgeMove(event) {
		if (!edgeDrag) return;
		const d = edgeDrag;
		const dx = event.clientX - d.x0;
		if (d.edge === 'bottom') setHeight(d.h0 + event.clientY - d.y0);
		else setWidth(d.edge === 'right' ? d.side0 + 2 * dx : d.side0 - 2 * dx);
	}
	function store(key, value) {
		try {
			if (value) localStorage.setItem(key, String(value));
			else localStorage.removeItem(key);
		} catch {
			// Blocked storage: the size lasts until the page is left.
		}
	}
	function onEdgeUp(event) {
		if (!edgeDrag && event.type !== 'keydown') return;
		edgeDrag = null;
		if (event.pointerId !== undefined && event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
		store(SIDE_KEY, userSide);
		store(ASPECT_KEY, userAspect);
	}
	function onEdgeKey(event, edge) {
		const step = { ArrowLeft: -16, ArrowDown: 16, ArrowRight: 16, ArrowUp: -16 }[event.key];
		if (!step) return;
		event.preventDefault();
		if (edge === 'bottom') setHeight((figureEl?.offsetHeight ?? side) + step);
		else setWidth(side + step);
		onEdgeUp(event);
	}
	/** Double-click: a side edge fits the width to the pane again, the bottom drops the height. */
	function onEdgeReset(edge) {
		if (edge === 'bottom') userAspect = null;
		else userSide = null;
		store(SIDE_KEY, userSide);
		store(ASPECT_KEY, userAspect);
	}
	const bootChunk = 100_000;

	// A PDP-7 memory cycle is 1.75 µs. Pacing is by wall clock, never by the monitor's
	// refresh rate; a stall longer than MAX_DT_MS is a hiccup, not a debt to repay.
	const CYCLES_PER_MS = 1000 / 1.75;
	const MAX_DT_MS = 250;
	const MAX_CYCLES_PER_FRAME = 100_000;
	const SPEEDS = [0.01, 0.1, 1, 10, Infinity];
	let speed = $state(1);
	let lastNow = null;
	let owed = 0;

	let box = null;
	let cpu = null;
	let t340 = null;
	let pen = null;
	let pressedId = null;
	let raf = 0;
	let player = null;
	let demoCaption = $state('');
	let demoOn = $state(false);

	// The 340 refreshes hundreds of times per browser frame. Showing only the last one
	// aliases: anything the program draws on some refreshes and not others (the ring
	// around the cross while the pen is on it) pops in and out. The eye on real glass
	// integrated every refresh, so we do too: each stroke's brightness is the fraction
	// of this batch's frames that drew it.
	const PHOSPHOR_FRAMES = 48;
	let batch = [];

	function collectFrame(f) {
		batch.push(f);
		if (batch.length > PHOSPHOR_FRAMES) batch.shift();
	}

	function integrate(frames) {
		const seen = new Map();
		for (const f of frames) {
			for (const s of f.segments) {
				if (!s.intensify) continue;
				const key = `${s.x0},${s.y0},${s.x1},${s.y1}`;
				const hit = seen.get(key);
				if (hit) hit.n += 1;
				else seen.set(key, { s, n: 1 });
			}
		}
		return seen;
	}

	function drawSegments(ctx, seen, total) {
		const stroke = '#9fe8a0';
		ctx.strokeStyle = stroke;
		ctx.fillStyle = stroke;
		ctx.lineWidth = 1.5;
		ctx.lineCap = 'round';
		for (const { s, n } of seen.values()) {
			const lit = Math.max(s.intensity ?? 7, 1) / 7;
			const alpha = lit * (0.2 + 0.8 * (n / total));
			const y0 = 1023 - s.y0;
			const y1 = 1023 - s.y1;
			if (s.x0 === s.x1 && s.y0 === s.y1) {
				// Dots (the tracking spiral) land on few refreshes; a point on glass glows longer than that.
				ctx.globalAlpha = Math.min(1, alpha * 1.8 + 0.15);
				const d = Math.max(2, s.scale || 1);
				ctx.fillRect(s.x0 - d / 2, y0 - d / 2, d, d);
			} else {
				ctx.globalAlpha = alpha;
				ctx.beginPath();
				ctx.moveTo(s.x0, y0);
				ctx.lineTo(s.x1, y1);
				ctx.stroke();
			}
		}
		ctx.globalAlpha = 1;
	}

	function drawFrame() {
		const canvas = canvasEl;
		if (!canvas || !t340) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = '#0a0f0a';
		ctx.fillRect(0, 0, 1024, 1024);
		const frames = batch.length ? batch : [{ segments: t340.lastFrame?.segments ?? t340.segments }];
		drawSegments(ctx, integrate(frames), frames.length);
		batch = [];
		if (player || pressedId !== null) drawPen(ctx);
	}

	// The pen is not on the tube; this is where it is and what it can see.
	function drawPen(ctx) {
		const x = pen.x;
		const y = 1023 - pen.y;
		ctx.globalAlpha = pen.enabled ? 0.22 : 0.1;
		ctx.fillStyle = '#ffd27a';
		ctx.beginPath();
		ctx.arc(x, y, pen.aperture, 0, 2 * Math.PI);
		ctx.fill();
		ctx.globalAlpha = pen.enabled ? 0.8 : 0.35;
		ctx.strokeStyle = '#ffd27a';
		ctx.lineWidth = 1.5;
		ctx.stroke();
		ctx.globalAlpha = pen.enabled ? 1 : 0.5;
		ctx.fillStyle = pen.enabled ? '#fff4d0' : '#ffd27a';
		ctx.beginPath();
		ctx.arc(x, y, pen.enabled ? 3.5 : 2.5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.globalAlpha = 1;
	}

	let readout = $state('');
	let readoutExtra = $state('');
	let penDown = $state(false);
	let fault = $state(null);
	let lastReadout = 0;
	let cyclesAtReadout = 0;

	function updateReadout(now) {
		if (now - lastReadout < 250) return;
		const rate = ((box.cycles - cyclesAtReadout) * 1000) / (now - lastReadout || 1);
		lastReadout = now;
		cyclesAtReadout = box.cycles;
		const extra = program?.status(cpu);
		readout = `${(rate / 1e6).toFixed(2)}M/s`;
		penDown = pen.enabled;
		readoutExtra = extra ?? '';
		refreshMem();
	}

	// Core browser, four views of MEM_LINES lines: octal (MEM_COLS words a line), code (a
	// word a line, disassembled, beside the source line that assembled it), source (the
	// listing itself), trace (the last instructions executed). Clicking a word follows its
	// low 13 bits as an address; the trail remembers where you came from.
	const MEM_VIEWS = [
		['octal', 'octal', 'Octal words'],
		['code', 'code', 'Disassembled, beside the source line'],
		['source', 'source', 'The program’s source, commented'],
		['trace', 'trace', 'Instructions as executed, newest last']
	];
	let memView = $state('octal');
	const MEM_COLS = $derived(memView === 'octal' ? (side >= 420 ? 8 : 4) : 1);
	let memOpen = $state(false);
	/** Keep the PC in view (code, source, octal) or the newest instruction (trace). */
	let memFollow = $state(false);
	let pcNow = $state(-1);
	let trace = null;
	let traceNote = $state('');
	let traceBack = $state(0);
	let traceRows = $state.raw([]);
	let sourceMap = $state.raw(null);
	let sourceFor = null;
	let sourceStatus = $state('');
	let srcTop = $state(0);
	const MEM_MIN_LINES = 8;
	let MEM_LINES = $state(MEM_MIN_LINES);
	const MEM_PAGE = $derived(MEM_COLS * MEM_LINES);
	const CORE = 8192;
	let memBase = $state(0o5640);
	let memFocus = $state(-1);
	let memWords = $state([]);
	let memChanged = $state([]);
	let memTrail = $state([]);
	let memShownBase = -1;
	let memEl = $state(null);

	const oct = (n, width) => n.toString(8).padStart(width, '0');

	// The running program's symbols, set at boot. byAddr: address -> names; byName: upper case.
	let symbols = $state([]);
	const symbolsByName = $derived([...symbols].sort((a, b) => a.name.localeCompare(b.name)));
	const byAddr = $derived.by(() => {
		const m = new Map();
		for (const s of symbols) m.set(s.addr, [...(m.get(s.addr) ?? []), s.name]);
		return m;
	});
	const byName = $derived(new Map(symbols.map((s) => [s.name.toUpperCase(), s.addr])));
	const byAddrSorted = $derived([...symbols].sort((a, b) => a.addr - b.addr));

	/** NAME+offset for an address: the nearest symbol at or below it, within 200 octal. */
	function symbolic(addr) {
		let lo = 0;
		let hi = byAddrSorted.length - 1;
		let best = null;
		while (lo <= hi) {
			const mid = (lo + hi) >> 1;
			if (byAddrSorted[mid].addr <= addr) {
				best = byAddrSorted[mid];
				lo = mid + 1;
			} else hi = mid - 1;
		}
		if (!best || addr - best.addr > 0o200) return '';
		return addr === best.addr ? best.name : `${best.name}+${oct(addr - best.addr, 1)}`;
	}

	// Symbols in the program's own case: SYMELEC's are upper case, the light pen test's lower.
	const upperCase = $derived(symbols.length > 0 && symbols[0].name === symbols[0].name.toUpperCase());
	function dis(word) {
		const text = disassemble(word, symbolic);
		return upperCase ? text.toUpperCase() : text;
	}

	/** The source line for an address, or the next one that has an address. */
	function srcLineFor(addr) {
		const exact = sourceMap?.line.get(addr);
		if (exact !== undefined) return exact;
		const lines = sourceMap?.lines ?? [];
		let best = -1;
		for (let i = 0; i < lines.length; i += 1) {
			const a = lines[i].addr;
			if (a !== null && a > addr && (best < 0 || a < lines[best].addr)) best = i;
		}
		return Math.max(best, 0);
	}

	function loadSource() {
		const id = programId;
		if (sourceFor === id) return;
		sourceFor = id;
		sourceMap = null;
		if (!program?.source) {
			sourceStatus = 'No source for this program.';
			return;
		}
		sourceStatus = 'Loading the source…';
		Promise.resolve(program.source())
			.then((s) => {
				if (sourceFor !== id) return;
				sourceMap = s ?? null;
				sourceStatus = s ? '' : 'No source for this program.';
				srcTop = Math.max(0, srcLineFor(memBase) - 2);
			})
			.catch((e) => {
				sourceStatus = `The source did not load: ${e?.message ?? e}`;
			});
	}
	$effect(() => {
		void programId;
		if (memOpen && (memView === 'code' || memView === 'source')) untrack(loadSource);
	});

	function refreshMem() {
		if (!cpu || !memOpen) return;
		pcNow = cpu.pc;
		if (memFollow) {
			if (memView === 'trace') traceBack = 0;
			else if (memView === 'source') {
				const l = srcLineFor(pcNow);
				if (l < srcTop || l >= srcTop + MEM_LINES) srcTop = Math.max(0, l - 2);
			} else if (pcNow < memBase || pcNow >= memBase + MEM_PAGE) {
				const a = memView === 'code' ? pcNow - 2 : pcNow;
				memBase = ((a - (a % MEM_COLS)) + CORE) % CORE;
			}
		}
		if (memView === 'trace') {
			traceRows = trace?.window(MEM_LINES, traceBack) ?? [];
			traceNote = trace ? `${traceBack ? `${traceBack.toLocaleString()} back; ` : ''}${trace.held.toLocaleString()} held of ${trace.count.toLocaleString()} executed` : '';
			return;
		}
		const next = Array.from({ length: MEM_PAGE }, (_, i) => cpu.read((memBase + i) % CORE));
		memChanged = memShownBase === memBase && memWords.length === next.length ? next.map((w, i) => w !== memWords[i]) : [];
		memWords = next;
		memShownBase = memBase;
	}

	function memGo(addr, remember = false) {
		const a = ((addr % CORE) + CORE) % CORE;
		if (remember) memTrail = [...memTrail.slice(-31), memBase];
		memFocus = a;
		memBase = a - (a % MEM_COLS);
		if (memView === 'source') srcTop = Math.max(0, srcLineFor(a) - 2);
		if (memView === 'trace') memView = 'code';
		refreshMem();
	}

	function pcInView() {
		if (memView === 'source') {
			const l = srcLineFor(pcNow);
			return l >= srcTop && l < srcTop + MEM_LINES;
		}
		return pcNow >= memBase && pcNow < memBase + MEM_PAGE;
	}

	/** One instruction, then stop. The PC is brought into view if the step left it. */
	function onStep() {
		if (!box || status !== 'live') return;
		paused = true;
		try {
			box.step();
			fault = null;
		} catch (e) {
			fault = e instanceof Error ? e.message : String(e);
		}
		switches = cpu.switches;
		drawFrame();
		refreshMem();
		if (memOpen && memView !== 'trace' && !pcInView()) showPc();
	}

	function showPc() {
		if (memView === 'trace') memView = 'code';
		if (memView === 'source') srcTop = Math.max(0, srcLineFor(pcNow) - 2);
		else {
			const a = (pcNow - (memView === 'code' ? 2 : 0) + CORE) % CORE;
			memBase = a - (a % MEM_COLS);
		}
		refreshMem();
	}

	// Reset is pulled, not clicked: drag the button down its track and let go at the bottom.
	// Letting go early, or leaving, puts it back.
	const RESET_PULL = 44;
	let resetPull = $state(-1);
	let resetFrom = 0;
	function onResetDown(e) {
		if (e.button !== 0) return;
		e.preventDefault();
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {
			// no live pointer to capture; moves still arrive while over the button
		}
		resetFrom = e.clientY;
		resetPull = 0;
	}
	function onResetMove(e) {
		if (resetPull >= 0) resetPull = Math.max(0, Math.min(RESET_PULL, e.clientY - resetFrom));
	}
	function onResetUp() {
		const go = resetPull >= RESET_PULL;
		resetPull = -1;
		if (go) onReset();
	}
	function onResetKey(e) {
		if (e.key === 'Escape') resetPull = -1;
		if (e.key !== 'ArrowDown') return;
		e.preventDefault();
		resetPull = Math.min(RESET_PULL, Math.max(0, resetPull) + RESET_PULL / 4);
		if (resetPull >= RESET_PULL) setTimeout(onResetUp, 150);
	}

	/** Scroll by whole lines in the current view; leaving the PC stops following it. */
	function memScroll(n) {
		if (!n) return;
		memFollow = false;
		memFocus = -1;
		if (memView === 'source') {
			const max = Math.max(0, (sourceMap?.lines.length ?? 0) - MEM_LINES);
			srcTop = Math.max(0, Math.min(max, srcTop + n));
		} else if (memView === 'trace') {
			traceBack = Math.max(0, Math.min(Math.max(0, (trace?.held ?? 0) - MEM_LINES), traceBack - n));
		} else memBase = (((memBase + n * MEM_COLS) % CORE) + CORE) % CORE;
		refreshMem();
	}

	function setView(v) {
		memView = v;
		memShownBase = -1;
		if (v === 'octal') memBase -= memBase % (side >= 420 ? 8 : 4);
		if (v === 'source') srcTop = Math.max(0, srcLineFor(memFocus >= 0 ? memFocus : memBase) - 2);
		queueMicrotask(refreshMem);
	}

	// Wheel and trackpad: pixels of travel per line, and the most lines a second, so a
	// flick never outruns the eye. Ctrl is slow, plain is reading speed, shift fast,
	// shift and ctrl together cross core in a second.
	const WHEEL = { slow: [40, 8], plain: [14, 24], fast: [5, 90], super: [1, 1500] };
	let wheelDebt = 0;
	let wheelFrac = 0;
	let wheelRate = 24;
	let wheelRaf = 0;
	let wheelLast = 0;
	function onMemWheel(e) {
		e.preventDefault();
		const speed = e.shiftKey && e.ctrlKey ? 'super' : e.shiftKey ? 'fast' : e.ctrlKey ? 'slow' : 'plain';
		const [px, rate] = WHEEL[speed];
		// macOS turns shift+wheel into horizontal travel.
		let d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
		if (e.deltaMode === 1) d *= 16;
		else if (e.deltaMode === 2) d *= 16 * MEM_LINES;
		wheelRate = rate;
		const cap = Math.max(1, rate * 0.2);
		wheelDebt = Math.max(-cap, Math.min(cap, wheelDebt + d / px));
		if (!wheelRaf) {
			wheelLast = performance.now();
			wheelRaf = requestAnimationFrame(drainWheel);
		}
	}
	function drainWheel(now) {
		const dt = Math.min(now - wheelLast, 50) / 1000;
		wheelLast = now;
		const can = wheelRate * dt;
		const step = Math.max(-can, Math.min(can, wheelDebt));
		wheelDebt -= step;
		wheelFrac += step;
		const n = Math.trunc(wheelFrac);
		wheelFrac -= n;
		memScroll(n);
		wheelRaf = Math.abs(wheelDebt) > 0.01 ? requestAnimationFrame(drainWheel) : 0;
	}

	function memBack() {
		if (!memTrail.length) return;
		memBase = memTrail[memTrail.length - 1];
		memTrail = memTrail.slice(0, -1);
		memFocus = -1;
		refreshMem();
	}

	/** An octal address, a symbol, or symbol+octal offset. */
	function memAddrInput(event) {
		const text = event.currentTarget.value.trim().toUpperCase();
		const m = text.match(/^([A-Z][A-Z0-9]*)?(?:([+-])?([0-7]+))?$/);
		const base = m?.[1] ? byName.get(m[1]) : 0;
		if (m && base !== undefined && (m[1] || m[3])) {
			const off = m[3] ? parseInt(m[3], 8) * (m[2] === '-' ? -1 : 1) : 0;
			memGo(base + off, true);
		}
		event.currentTarget.value = oct(memBase, 5);
	}

	function memSymbolPick(event) {
		const addr = Number(event.currentTarget.value);
		event.currentTarget.value = '';
		if (Number.isInteger(addr)) memGo(addr, true);
	}

	$effect(() => {
		if (!memOpen) return;
		untrack(() => {
			memShownBase = -1;
			refreshMem();
		});
	});

	// Height the figure has past its content becomes more lines. contentHeight() takes the
	// drawer's own extra lines back out, so the count settles instead of feeding itself.
	function fitMemLines() {
		const line = memEl?.querySelector('.mem-line')?.offsetHeight;
		const lines = memOpen && figHeight && line ? MEM_MIN_LINES + Math.max(0, Math.floor((figHeight - contentHeight()) / line)) : MEM_MIN_LINES;
		if (lines !== MEM_LINES) {
			MEM_LINES = lines;
			refreshMem();
		}
	}
	$effect(() => {
		void [figHeight, memOpen, memEl, MEM_COLS];
		const raf = requestAnimationFrame(() => untrack(fitMemLines));
		return () => cancelAnimationFrame(raf);
	});
	$effect(() => {
		if (!captionEl) return;
		const ro = new ResizeObserver(() => untrack(fitMemLines));
		ro.observe(captionEl);
		return () => ro.disconnect();
	});

	$effect(() => {
		const el = memEl;
		if (!el) return;
		el.addEventListener('wheel', onMemWheel, { passive: false });
		return () => el.removeEventListener('wheel', onMemWheel);
	});

	// Schedule first, then work: one bad frame must not stop the machine.
	function loop(now) {
		if (!running || !box) return;
		raf = requestAnimationFrame(loop);
		if (document.hidden) {
			lastNow = null;
			return;
		}
		const dt = lastNow === null || paused ? 0 : Math.min(now - lastNow, MAX_DT_MS);
		lastNow = now;
		if (paused) {
			owed = 0;
			drawFrame();
			updateReadout(now);
			return;
		}
		owed = speed === Infinity ? MAX_CYCLES_PER_FRAME : owed + dt * CYCLES_PER_MS * speed;
		const cycles = Math.min(Math.floor(owed), MAX_CYCLES_PER_FRAME);
		owed = Math.min(owed - cycles, MAX_CYCLES_PER_FRAME);
		try {
			if (cycles > 0) {
				if (player) {
					player.advance((n) => box.run(n), cycles);
					demoCaption = player.caption;
					switches = cpu.switches;
					if (player.done) stopDemo();
				} else {
					box.run(cycles);
				}
			}
			drawFrame();
			updateReadout(now);
			fault = null;
		} catch (e) {
			fault = e instanceof Error ? e.message : String(e);
			console.error('cabinet', e);
		}
	}

	function gridFromEvent(event) {
		const canvas = canvasEl;
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		const px = Math.min(1023, Math.max(0, ((event.clientX - rect.left) / rect.width) * 1024));
		const py = Math.min(1023, Math.max(0, ((event.clientY - rect.top) / rect.height) * 1024));
		return { x: Math.round(px), y: Math.round(1023 - py) };
	}

	function penAperture(event) {
		if (event.pointerType === 'pen') return 16;
		if (event.pointerType === 'touch') return 14;
		return 12;
	}

	// Button down = pen aimed at the glass; button up = pen lifted, sees nothing.
	function onPointerDown(event) {
		// The tube takes the keyboard when touched, for programs played from the console.
		canvasEl?.focus({ preventScroll: true });
		if (!pen || !canvasEl || event.button !== 0 || player) return;
		event.preventDefault();
		event.stopPropagation();
		try {
			canvasEl.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic or already-released pointers cannot be captured; tracking still works.
		}
		pressedId = event.pointerId;
		pen.aperture = penAperture(event);
		const { x, y } = gridFromEvent(event);
		pen.point(x, y);
		pen.enabled = true;
		recordPen();
	}

	function onPointerMove(event) {
		if (!pen || event.pointerId !== pressedId) return;
		pen.aperture = penAperture(event);
		const { x, y } = gridFromEvent(event);
		pen.point(x, y);
		recordPen();
	}

	function onPointerUp(event) {
		if (event.pointerId !== pressedId) return;
		pressedId = null;
		if (pen) pen.enabled = false;
		if (pen) recordPen();
		if (canvasEl?.hasPointerCapture(event.pointerId)) canvasEl.releasePointerCapture(event.pointerId);
	}

	function onPrintScreen() {
		if (!t340) return;
		const svg = printScreen(t340, { size: 1024 });
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${programId}-screen.svg`;
		a.click();
		URL.revokeObjectURL(url);
	}

	/** A fresh PDP-7 with the chosen program booted to its first picture. Throws if the picture never comes. */
	function bootMachine() {
		cpu = new Pdp7({ coreWords: 8192 });
		cpu.trace = trace = new Trace();
		traceBack = 0;
		pen = new LightPen({ aperture: 12, name: 'pointer', enabled: false });
		t340 = new Type340({
			fetch: (a) => cpu.read(a),
			store: (a, w) => cpu.write(a, w),
			pens: [pen],
			onFrame: collectFrame
		});
		const extra = program.peripherals?.() ?? [];
		box = new Cabinet({
			cpu,
			devices: [t340, new Teletype({ printCycles: 1000 }), new Clock({ cpu }), new TinyTitan(), ...extra]
		});
		t340.clock = () => box.cycles;
		// Inspector handle: $0.cabinet in devtools reaches the live machine.
		canvasEl.cabinet = { cpu, t340, pen, box, program: programId };
		batch = [];
		program.boot({ cpu, box, extra, patches: spec.patches ?? undefined });
		symbols = program.symbols?.() ?? [];
		switches = cpu.switches;
		for (let i = 0; i < 30 && !t340.lastFrame; i += 1) {
			box.run(bootChunk);
			if (cpu.halted) break;
		}
		if (!t340.lastFrame && t340.segments.length < 100) {
			throw new Error('boot picture did not appear');
		}
	}

	/** Reboot and run the program's scripted demo, or with replay, the recorded session. */
	function startDemo(replay = false) {
		pressedId = null;
		stopRecording();
		bootMachine();
		const script = replay
			? session && replaySession(replayHandlers(), session, 'Replaying the recording')
			: program.demo?.({ cpu, pen });
		if (!script) return;
		player = new DemoPlayer(script);
		demoCaption = '';
		demoOn = true;
	}

	// What a session can drive. Kinds without a handler are skipped.
	function replayHandlers() {
		return {
			sw: (v) => (cpu.switches = Number(v)),
			pen: (x, y, down, aperture) => {
				if (aperture) pen.aperture = Number(aperture);
				pen.point(Number(x), Number(y));
				pen.enabled = !!down;
			}
		};
	}

	function recordPen() {
		recorder?.record(box.cycles, 'pen', pen.x, pen.y, pen.enabled ? 1 : 0, pen.aperture);
	}

	function stopDemo() {
		player = null;
		demoOn = false;
		if (pen) pen.enabled = false;
	}

	// A recorded session per program, kept in this browser.
	const sessionKey = (id) => `cabinet-session-${id}`;
	function loadSession(id) {
		try {
			const s = JSON.parse(localStorage.getItem(sessionKey(id)) ?? 'null');
			return isSession(s) && s.program === id ? s : null;
		} catch {
			return null;
		}
	}
	let session = $state(null);
	let recorder = null;
	let recording = $state(false);
	const canDemo = $derived(!!program?.demo);

	async function onRecord() {
		if (recording) {
			stopRecording();
			return;
		}
		await onReset();
		if (status !== 'live') return;
		recorder = new SessionRecorder(programId, cpu.switches, box.cycles);
		recording = true;
		canvasEl?.focus({ preventScroll: true });
	}

	function stopRecording() {
		if (!recorder) return;
		const s = recorder.finish(box.cycles);
		recorder = null;
		recording = false;
		if (s.events.length === 0) return;
		session = s;
		try {
			localStorage.setItem(sessionKey(s.program), JSON.stringify(s));
		} catch {
			// Storage full or blocked: the session still replays until the page is left.
		}
	}

	let shot = $state('');

	async function onCopyScreen() {
		if (!canvasEl) return;
		try {
			const blob = await new Promise((resolve, reject) =>
				canvasEl.toBlob((b) => (b ? resolve(b) : reject(new Error('no image'))), 'image/png')
			);
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
			shot = '✅';
		} catch (e) {
			shot = '❌';
			console.error('copy screen', e);
		}
		setTimeout(() => (shot = ''), 1200);
	}

	function onDownloadSession() {
		if (!session) return;
		const blob = new Blob([JSON.stringify(session)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${session.program}-session.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	/** Load the program's tapes, boot it, and keep the machine running. */
	async function boot() {
		status = 'booting';
		error = null;
		fault = null;
		stopDemo();
		recorder = null;
		recording = false;
		pressedId = null;
		held.clear();
		await program.load?.();
		bootMachine();
		cyclesAtReadout = 0;
		status = 'live';
	}

	async function onProgram(event) {
		const next = programById(event.currentTarget.value);
		if (!next) return;
		stopRecording();
		programId = next.id;
		session = loadSession(next.id);
		await onReset();
	}

	async function onReset() {
		paused = false;
		try {
			await boot();
			drawFrame();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			status = 'error';
		}
	}

	let copied = $state(false);

	/** The error with enough context to paste into a bug report. */
	async function copyError() {
		const report = [
			`cabinet: ${program?.label ?? programId} (${programId})`,
			`page: ${location.href}`,
			`when: ${new Date().toISOString()}`,
			`browser: ${navigator.userAgent}`,
			'',
			error
		].join('\n');
		try {
			await navigator.clipboard.writeText(report);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// No clipboard permission: the text is selectable, so select it for the reader.
			const pre = canvasEl?.parentElement?.querySelector('.err');
			if (pre) getSelection()?.selectAllChildren(pre);
		}
	}

	function onSwitch(bit) {
		if (!cpu) return;
		switches ^= bit;
		cpu.switches = switches;
		recorder?.record(box.cycles, 'sw', switches);
	}

	// Keys held right now, by KeyboardEvent.code. Two keys may share a switch.
	const held = new Set();

	function onKey(event, down) {
		const key = program?.keys?.[event.code];
		if (!key || !cpu || player) return;
		event.preventDefault();
		if (down === held.has(event.code)) return;
		if (down) held.add(event.code);
		else held.delete(event.code);
		const holding = [...held].some((c) => program.keys[c].bit === key.bit);
		const set = program.keysActiveLow ? !holding : holding;
		switches = set ? switches | key.bit : switches & ~key.bit;
		cpu.switches = switches;
		recorder?.record(box.cycles, 'sw', switches);
	}

	function releaseKeys() {
		for (const code of [...held]) onKey({ code, preventDefault() {} }, false);
	}

	function onDemo(replay = false) {
		if (player) {
			stopDemo();
			return;
		}
		if (replay ? !session : !canDemo) return;
		try {
			startDemo(replay);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			status = 'error';
		}
	}

	function onVisibility() {
		if (!document.hidden && running) drawFrame();
	}

	onMount(() => {
		let cancelled = false;

		(async () => {
			try {
				if (!program) {
					throw new Error(`unknown program: ${spec.program}`);
				}
				if (spec.machine && spec.machine !== 'pdp7') {
					throw new Error(`unknown machine: ${spec.machine}`);
				}

				session = loadSession(programId);
				await boot();
				if (cancelled) return;

				if (spec.demo && canDemo) startDemo();
				running = true;
				drawFrame();
				raf = requestAnimationFrame(loop);
			} catch (e) {
				error = e instanceof Error ? e.message : String(e);
				status = 'error';
			}
		})();

		document.addEventListener('visibilitychange', onVisibility);

		const scroller = scrollParent(figureEl);
		const ro = new ResizeObserver(() => fit(scroller));
		ro.observe(scroller);
		if (figureEl?.parentElement) ro.observe(figureEl.parentElement);
		fit(scroller);

		return () => {
			ro.disconnect();
			cancelled = true;
			running = false;
			if (raf) cancelAnimationFrame(raf);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});
</script>

{#if spec.title}
	<p class="headline"><strong>{spec.title}</strong></p>
{/if}
<figure class="cabinet-applet" data-applet="cabinet" bind:this={figureEl} style:width="{side}px" style:min-height={figHeight ? `${figHeight}px` : null}>
	<div class="tube-wrap" style:width="{side}px">
		<canvas
			bind:this={canvasEl}
			width="1024"
			height="1024"
			class="tube"
			class:live={status === 'live'}
			tabindex="0"
			aria-label="{program?.label ?? 'PDP-7'} display{program?.keyHelp ? `. ${program.keyHelp}` : ''}"
			onkeydown={(e) => onKey(e, true)}
			onkeyup={(e) => onKey(e, false)}
			onblur={releaseKeys}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		></canvas>
		{#if status !== 'live'}
			<div class="overlay" class:failed={!!error} aria-live="polite">
				{#if error}
					<div class="err-box">
						<div class="err-head">
							<span>{program?.label ?? 'Cabinet'} failed</span>
							<button type="button" onclick={copyError}>{copied ? 'Copied' : 'Copy'}</button>
						</div>
						<pre class="err">{error}</pre>
					</div>
				{:else}
					<p>{status === 'booting' ? `Booting ${program?.label ?? ''}…` : 'Loading…'}</p>
				{/if}
			</div>
		{/if}
	</div>
	{#each ['left', 'right', 'bottom'] as edge (edge)}
		<div
			class="edge {edge}"
			class:dragging={edgeDrag?.edge === edge}
			role="slider"
			tabindex="0"
			aria-label={edge === 'bottom' ? 'Cabinet height, bottom edge' : `Cabinet width, ${edge} edge`}
			aria-orientation={edge === 'bottom' ? 'vertical' : 'horizontal'}
			aria-valuemin={MIN_SIDE}
			aria-valuemax={4096}
			aria-valuenow={edge === 'bottom' ? (figHeight ?? side) : side}
			title={edge === 'bottom'
				? 'Drag to change the height; double-click for the content’s own height'
				: 'Drag to resize, keeping the shape; double-click to fit the pane again'}
			onpointerdown={(e) => onEdgeDown(e, edge)}
			onpointermove={onEdgeMove}
			onpointerup={onEdgeUp}
			onpointercancel={onEdgeUp}
			ondblclick={() => onEdgeReset(edge)}
			onkeydown={(e) => onEdgeKey(e, edge)}
		></div>
	{/each}
	<!-- Fixed order: front panel, menu row, then rows the program adds. Nothing above a row moves when it comes or goes. -->
	<figcaption bind:this={captionEl}>
		<div class="row panel" role="group" aria-label="PDP-7 console: AC switches, bit 0 on the left">
			{#each SWITCH_BITS as bit, i (i)}
				{@const label = program?.switchLabels?.[i] ?? ''}
				<button
					type="button"
					class="switch"
					class:on={(switches & bit) !== 0}
					class:named={label !== ''}
					class:dim={!!program?.switchLabels && label === ''}
					class:group={i % 3 === 0 && i > 0}
					aria-pressed={(switches & bit) !== 0}
					title="switch {i}{label ? `: ${label}` : ''}"
					disabled={status !== 'live'}
					onclick={() => onSwitch(bit)}>{i}</button
				>
			{/each}
			<span class="octal" title="AC switches, octal">{switches.toString(8).padStart(6, '0')}</span>
		</div>
		<div class="row menu">
			<select
				class="program"
				aria-label="Program"
				title={program?.title}
				value={programId}
				disabled={status === 'booting' || demoOn}
				onchange={onProgram}
			>
				{#each PROGRAMS as p (p.id)}
					<option value={p.id}>{p.label}</option>
				{/each}
			</select>
			{#if fault}
				<span class="fault" title={fault}>fault: {fault}</span>
			{:else}
				<span class="readout">
					{#if paused}stopped{:else}<span title="Memory cycles per second">{readout}</span><span
							class="pen"
							title={penDown ? 'Pen down' : 'Pen up'}
							><span class="hand">✍️</span><span>{penDown ? '⬇️' : '⬆️'}</span></span
						>{#if readoutExtra}<span title="Tracking cross x,y">{readoutExtra}</span>{/if}{/if}
				</span>
			{/if}
		</div>
		<div class="row app demo-row">
			{#if program?.demo}
				<button
					type="button"
					class="demo"
					disabled={status !== 'live' || (demoOn ? false : recording)}
					title={demoOn ? 'Stop' : program.demoTitle}
					onclick={() => onDemo(false)}>{demoOn ? 'STOP' : 'DEMO'}</button
				>
			{/if}
			<button
				type="button"
				class="icon"
				class:rec={recording}
				aria-label={recording ? 'Stop recording' : 'Record'}
				title={recording
					? 'Stop recording and keep it'
					: 'Record: reboot, then record switches, keys and pen until pressed again'}
				disabled={status !== 'live' || demoOn}
				onclick={onRecord}>⏺️</button
			>
			<button
				type="button"
				class="icon"
				aria-label={demoOn ? 'Stop' : 'Replay recording'}
				title={demoOn ? 'Stop' : 'Replay the recording from a fresh boot'}
				disabled={status !== 'live' || recording || (!demoOn && !session)}
				onclick={() => onDemo(true)}>{demoOn ? '⏹️' : '📼'}</button
			>
			<button
				type="button"
				class="icon"
				aria-label="Download recording"
				title="Download the recording as JSON"
				disabled={!session || recording}
				onclick={onDownloadSession}>⬇️</button
			>
			{#if demoOn || recording}
				<span class="demo-caption" aria-live="polite">{demoOn ? demoCaption : 'Recording. ⏺ again to stop.'}</span>
			{/if}
		</div>
		{#if program?.keyHelp}
			<p class="row app keys">Click the tube, then: {program.keyHelp}</p>
		{/if}
		<details class="row app mem" bind:open={memOpen}>
			<summary>
				<span class="mem-size">MEMORY {CORE / 1024}K × 18 BITS</span>
				<button
					type="button"
					class="icon"
					aria-label={paused ? 'Run' : 'Stop'}
					disabled={status !== 'live'}
					title={paused ? 'Run: continue from where the machine stopped' : 'Stop the processor'}
					onclick={() => (paused = !paused)}>{paused ? '▶️' : '⏸️'}</button
				>
				<button
					type="button"
					class="icon"
					aria-label="Step"
					disabled={status !== 'live' || demoOn}
					title="Step: stop, then execute one instruction"
					onclick={onStep}>⏭️</button
				>
				<span class="speeds" role="group" aria-label="Speed">
					{#each SPEEDS as s (s)}
						<button
							type="button"
							class="speed"
							class:on={speed === s}
							aria-pressed={speed === s}
							title={s === Infinity
								? 'As fast as this computer can go'
								: s === 1
									? '1× is a real PDP-7: 571,429 memory cycles a second'
									: `${s}× a real PDP-7`}
							onclick={() => (speed = s)}>{s === Infinity ? 'max' : String(s).replace(/^0/, '')}</button
						>
					{/each}
				</span>
				<span class="reset-pull">
					{#if resetPull >= 0}
						<span class="reset-track" style:height="{RESET_PULL}px" aria-hidden="true"
							><span class="reset-hint" class:armed={resetPull >= RESET_PULL}>RESET</span></span
						>
					{/if}
					<button
						type="button"
						class="icon"
						aria-label="Reset: pull down to confirm"
						disabled={status === 'booting' || demoOn}
						title="Reset: drag down and let go to clear core and boot {program?.label ?? 'the program'} again. Keys: arrow down."
						style:transform={resetPull > 0 ? `translateY(${resetPull}px)` : undefined}
						onpointerdown={onResetDown}
						onpointermove={onResetMove}
						onpointerup={onResetUp}
						onpointercancel={() => (resetPull = -1)}
						onkeydown={onResetKey}
						onblur={() => (resetPull = -1)}>🔄</button
					>
				</span>
				<span class="buttons">
					<button
						type="button"
						class="icon"
						aria-label="Print screen"
						title="Print screen: save the tube as SVG"
						disabled={status !== 'live'}
						onclick={onPrintScreen}>🖨️</button
					>
					<button
						type="button"
						class="icon"
						aria-label="Copy screen"
						title="Copy the tube to the clipboard as a PNG"
						disabled={status !== 'live'}
						onclick={onCopyScreen}>{shot || '📷'}</button
					>
				</span>
			</summary>
			{#if memOpen}
			<div bind:this={memEl}>
				<div class="mem-bar mem-views" role="group" aria-label="View">
					{#each MEM_VIEWS as [id, label, hint] (id)}
						<button type="button" class="mem-view" class:on={memView === id} aria-pressed={memView === id} title={hint} onclick={() => setView(id)}>{label}</button>
					{/each}
					<button
						type="button"
						class="mem-view"
						class:on={memFollow}
						aria-pressed={memFollow}
						title={memView === 'trace' ? 'Keep the newest instruction in view' : 'Keep the PC in view'}
						onclick={() => {
							memFollow = !memFollow;
							refreshMem();
						}}>{memView === 'trace' ? 'live' : 'follow PC'}</button
					>
					{#if pcNow >= 0}
						<button type="button" class="mem-view mem-pc-go" title="Show the PC" onclick={showPc}>👉 PC {oct(pcNow, 5)} {symbolic(pcNow)}</button>
					{/if}
				</div>
				<div class="mem-bar">
					<button type="button" class="icon" aria-label="Back" title="Back" disabled={!memTrail.length} onclick={memBack}>◀</button>
					<input
						class="mem-addr"
						aria-label="Address: octal, a symbol, or symbol+offset"
						title="Octal, a symbol, or symbol+offset. Enter to go."
						value={oct(memBase, 5)}
						onchange={memAddrInput}
					/>
					<button type="button" class="icon" aria-label="Page up" title="Page up" onclick={() => memScroll(-MEM_LINES)}>▲</button>
					<button type="button" class="icon" aria-label="Page down" title="Page down" onclick={() => memScroll(MEM_LINES)}>▼</button>
					{#if symbols.length}
						<select class="mem-symbols" aria-label="Go to symbol" title="{symbols.length} symbols" onchange={memSymbolPick}>
							<option value="">{symbolic(memFocus >= 0 ? memFocus : memBase) || 'symbol'} ▾</option>
							{#each symbolsByName as s, i (i)}
								<option value={s.addr}>{s.name} {oct(s.addr, 5)}</option>
							{/each}
						</select>
					{:else}
						<span class="mem-hint">no symbols</span>
					{/if}
				</div>
				{#if memView === 'code'}
					{#each { length: MEM_LINES } as _, line (line)}
						{@const at = (memBase + line) % CORE}
						{@const w = memWords[line] ?? 0}
						{@const si = sourceMap?.line.get(at)}
						{@const src = si === undefined ? null : sourceMap.lines[si]}
						{@const differs = src?.word != null && src.word !== w}
						<div class="mem-line code" class:pc={at === pcNow} class:focus={at === memFocus}>
							<span class="mem-pc" aria-label={at === pcNow ? 'PC' : undefined}>{at === pcNow ? '👉' : ''}</span>
							<span class="mem-at">{oct(at, 5)}</span>
							<span class="mem-label">{byAddr.get(at)?.[0] ?? ''}</span>
							<span class="mem-oct" class:changed={memChanged[line]}>{oct(w, 6)}</span>
							<button
								type="button"
								class="mem-word mem-op"
								title="{differs ? `The source assembled ${oct(src.word, 6)}. ` : ''}Go to {symbolic(w & 0o17777) || oct(w & 0o17777, 5)}"
								onclick={() => memGo(w & 0o17777, true)}>{dis(w)}</button
							>
							<span class="mem-src" class:differs title={differs ? `Core differs from the source, which assembled ${oct(src.word, 6)}: ${src.text}` : src?.text}
								>{differs ? '≠ ' : ''}{src?.text.trim() ?? ''}</span
							>
						</div>
					{/each}
					{#if sourceStatus}<p class="mem-hint">{sourceStatus}</p>{/if}
				{:else if memView === 'source'}
					{#if sourceMap}
						{#each { length: MEM_LINES } as _, line (line)}
							{@const l = sourceMap.lines[srcTop + line]}
							{@const isPc = l?.addr != null && l.addr === pcNow}
							<div class="mem-line source" class:pc={isPc} class:focus={l?.addr != null && l.addr === memFocus}>
								<span class="mem-pc" aria-label={isPc ? 'PC' : undefined}>{isPc ? '👉' : ''}</span>
								<span class="mem-at">{l?.addr != null ? oct(l.addr, 5) : ''}</span>
								<span class="mem-src" title={l?.text}>{l?.text ?? ''}</span>
							</div>
						{/each}
					{:else}
						<p class="mem-hint">{sourceStatus}</p>
					{/if}
				{:else if memView === 'trace'}
					{#each traceRows as e (e.n)}
						<div class="mem-line trace" class:focus={e.pc === memFocus}>
							<span class="mem-at">{oct(e.pc, 5)}</span>
							<span class="mem-label wide">{symbolic(e.pc)}</span>
							<span class="mem-oct">{oct(e.word, 6)}</span>
							<button type="button" class="mem-word mem-op" title="See it in the code view" onclick={() => memGo(e.pc, true)}>{dis(e.word)}</button>
							<span class="mem-src">AC {oct(e.ac, 6)}</span>
						</div>
					{/each}
					<p class="mem-hint">{traceNote}</p>
				{:else}
				{#each { length: MEM_LINES } as _, line (line)}
					{@const at = (memBase + line * MEM_COLS) % CORE}
					{@const hasPc = ((pcNow - at + CORE) % CORE) < MEM_COLS}
					<div class="mem-line">
						<span class="mem-pc" aria-label={hasPc ? 'PC on this line' : undefined}>{hasPc ? '👉' : ''}</span>
						<span class="mem-at">{oct(at, 5)}</span>
						{#each { length: MEM_COLS } as _, col (col)}
							{@const i = line * MEM_COLS + col}
							{@const w = memWords[i] ?? 0}
							<button
								type="button"
								class="mem-word"
								class:changed={memChanged[i]}
								class:focus={(at + col) % CORE === memFocus}
								class:pc={(at + col) % CORE === pcNow}
								class:sym={byAddr.has((at + col) % CORE)}
								title="{byAddr.get((at + col) % CORE)?.join(' ') ?? symbolic((at + col) % CORE)} {oct((at + col) % CORE, 5)}: {oct(w, 6)} → {symbolic(w & 0o17777) || oct(w & 0o17777, 5)}"
								onclick={() => memGo(w & 0o17777, true)}>{oct(w, 6)}</button
							>
						{/each}
					</div>
				{/each}
				{/if}
			</div>
			{/if}
		</details>
	</figcaption>
</figure>

<style>
	.headline {
		margin: 0 0 0.4rem;
	}
	.edge {
		position: absolute;
		z-index: 2;
		touch-action: none;
	}
	.edge.left,
	.edge.right {
		top: 0;
		bottom: 0;
		width: 8px;
		cursor: ew-resize;
	}
	.edge.left {
		left: -4px;
	}
	.edge.right {
		right: -4px;
	}
	.edge.bottom {
		left: 0;
		right: 0;
		bottom: -4px;
		height: 8px;
		cursor: ns-resize;
	}
	.edge:hover,
	.edge:focus-visible,
	.edge.dragging {
		background: rgba(159, 232, 160, 0.35);
		outline: none;
	}
	.cabinet-applet {
		position: relative;
		box-sizing: border-box;
		max-width: 100%;
		margin: 0.4rem auto;
		padding: 0;
		border: 1px solid var(--ink, #000);
		background: #000;
		color: #9fe8a0;
	}
	.tube-wrap {
		position: relative;
		max-width: 100%;
		aspect-ratio: 1;
		margin: 0 auto;
	}
	.tube {
		display: block;
		width: 100%;
		height: 100%;
		touch-action: none;
		cursor: default;
		opacity: 0.35;
		transition: opacity 0.2s;
	}
	.tube.live {
		opacity: 1;
	}
	.overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 0.85rem;
		color: #9fe8a0;
		background: rgba(0, 0, 0, 0.75);
		pointer-events: none;
	}
	.demo-caption {
		font-family: ui-monospace, monospace;
		font-size: 0.72rem;
		color: #ffd27a;
	}
	.overlay.failed {
		place-items: stretch;
		background: rgba(0, 0, 0, 0.88);
		pointer-events: auto;
	}
	.err-box {
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding: 0.5rem;
	}
	.err-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		padding-bottom: 0.35rem;
		color: #f88;
		font-weight: bold;
	}
	.overlay .err {
		flex: 1;
		min-height: 0;
		margin: 0;
		padding: 0.4rem;
		overflow: auto;
		color: #f88;
		font-size: 0.7rem;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		user-select: text;
		border: 1px solid #533;
	}
	figcaption {
		font-size: 0.75rem;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		padding: 0.3rem 0.5rem;
		min-height: 1.5rem;
		border-top: 1px solid #333;
	}
	.row.menu {
		justify-content: space-between;
	}
	.row.panel {
		gap: 2px;
		font-family: ui-monospace, monospace;
	}
	.row.app {
		display: block;
		min-height: 0;
	}
	/* One box for every icon button, whatever the emoji's own metrics. */
	.icon,
	.speed {
		box-sizing: border-box;
		height: 1.4rem;
		padding: 0;
		line-height: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.icon {
		width: 1.8rem;
		font-size: 0.8rem;
	}
	.icon.rec {
		background: #a22;
	}
	.row.demo-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
	}
	.demo-row .demo {
		height: 1.4rem;
		width: 5ch;
		padding: 0;
		flex-shrink: 0;
		font-weight: bold;
	}
	/* Its own line, two lines tall, only while a demo runs or a recording is made. */
	.demo-row .demo-caption {
		flex: 1 0 100%;
		min-height: 2.6em;
		line-height: 1.3;
		white-space: normal;
	}
	.speed {
		width: 4.2ch;
		font-size: 0.62rem;
	}
	.speed.on {
		background: #9fe8a0;
		color: #000;
	}
	.speeds {
		display: flex;
		gap: 2px;
	}
	.reset-pull {
		position: relative;
		display: inline-flex;
	}
	.reset-pull button {
		position: relative;
		z-index: 3;
		touch-action: none;
		background: #000;
	}
	/* The track hangs below the button, over whatever is under the header. */
	.reset-track {
		position: absolute;
		z-index: 2;
		top: 0;
		left: -2px;
		right: -2px;
		box-sizing: content-box;
		padding-bottom: 1.4rem;
		border: 1px dashed #9fe8a0;
		background: #000;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
	.reset-hint {
		margin-top: 1.6rem;
		font-size: 0.5rem;
		opacity: 0.6;
		padding: 0 2px;
	}
	.reset-hint.armed {
		opacity: 1;
		color: #000;
		background: #f66;
	}
	.program {
		font: inherit;
		font-size: 0.62rem;
		max-width: 14rem;
		min-width: 5rem;
		flex: 0 1 auto;
		padding: 0.1rem 0.2rem;
		border: 1px solid #9fe8a0;
		background: #000;
		color: inherit;
	}
	.switch {
		width: 1.35rem;
		padding: 0.1rem 0;
		font-size: 0.6rem;
	}
	.switch.dim {
		border-color: #3a5a3a;
		opacity: 0.55;
	}
	.switch.group {
		margin-left: 0.3rem;
	}
	.switch.on {
		background: #9fe8a0;
		color: #000;
	}
	.keys {
		font-size: 0.68rem;
		opacity: 0.8;
	}
	.tube:focus,
	.tube:focus-visible {
		outline: none;
	}
	.octal {
		margin-left: auto;
		font-size: 0.7rem;
		opacity: 0.8;
	}
	.readout,
	.fault {
		font-family: ui-monospace, monospace;
		font-size: 0.7rem;
		opacity: 0.8;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.readout {
		flex-shrink: 0;
	}
	.row.mem {
		font-family: ui-monospace, monospace;
		font-size: 0.68rem;
		line-height: 1.25;
		padding-top: 0.2rem;
		padding-bottom: 0.2rem;
	}
	/* A flex summary loses its native marker, so it draws its own. */
	.row.mem summary {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		list-style: none;
		cursor: pointer;
		padding: 0.1rem 0;
	}
	.row.mem summary::-webkit-details-marker {
		display: none;
	}
	.row.mem summary::before {
		content: '▸';
		width: 1ch;
		opacity: 0.8;
	}
	.row.mem[open] summary::before {
		content: '▾';
	}
	.mem-size {
		opacity: 0.8;
		white-space: nowrap;
	}
	.row.mem summary .buttons {
		margin-left: auto;
	}
	.row.mem[open] summary {
		margin-bottom: 0.25rem;
	}
	.mem-bar {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-bottom: 2px;
	}
	.mem-addr {
		width: 6ch;
		font: inherit;
		background: #000;
		color: inherit;
		border: 1px solid #555;
		padding: 0 0.2em;
	}
	.mem-hint {
		margin-left: 0.5em;
		opacity: 0.5;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.mem-line {
		display: flex;
		gap: 0.6ch;
	}
	.mem-at {
		opacity: 0.5;
		margin-right: 0.4ch;
	}
	/* Every line keeps the gutter, so the columns hold still as the PC moves. */
	.mem-pc {
		flex: 0 0 2.2ch;
		margin-right: -0.4ch;
		text-align: center;
		font-size: 0.9em;
	}
	.mem-views .mem-pc-go {
		margin-left: 0.5em;
		border-color: #6a6a20;
		color: #ffe680;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.mem-word {
		all: unset;
		cursor: pointer;
	}
	.mem-word:hover {
		background: #333;
	}
	.mem-word.sym {
		text-decoration: underline dotted;
		text-underline-offset: 2px;
	}
	.mem-symbols {
		font: inherit;
		max-width: 12rem;
		background: #000;
		color: inherit;
		border: 1px solid #555;
	}
	.mem-word.changed {
		color: #000;
		background: #9f9;
	}
	.mem-word.focus,
	.mem-line.focus {
		outline: 1px solid currentColor;
	}
	.mem-word.pc,
	.mem-line.pc {
		background: #3a3a10;
		color: #ffe680;
	}
	.mem-views .mem-view {
		font: inherit;
		background: #000;
		color: inherit;
		border: 1px solid #555;
		padding: 0 0.4em;
		cursor: pointer;
	}
	.mem-views .mem-view.on {
		background: #9fe8a0;
		color: #000;
	}
	.mem-line.code,
	.mem-line.source,
	.mem-line.trace {
		white-space: pre;
	}
	.mem-label {
		width: 6ch;
		flex-shrink: 0;
		overflow: hidden;
	}
	.mem-label.wide {
		width: 10ch;
	}
	.mem-oct {
		flex-shrink: 0;
		opacity: 0.6;
	}
	.mem-oct.changed {
		color: #000;
		background: #9f9;
		opacity: 1;
	}
	.mem-op {
		width: 16ch;
		flex-shrink: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.mem-src {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0.75;
	}
	.mem-src.differs {
		color: #ffb080;
		opacity: 1;
	}
	.pen {
		margin: 0 0.3em;
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
		gap: 0;
		line-height: 1;
	}
	.pen .hand {
		font-size: 1.9em;
		margin-right: -0.12em;
		position: relative;
		top: -0.12em;
	}
	.fault {
		color: #f88;
	}
	.buttons {
		display: flex;
		gap: 0.35rem;
		flex-shrink: 0;
	}
	button {
		font: inherit;
		font-size: 0.72rem;
		padding: 0.15rem 0.45rem;
		border: 1px solid #9fe8a0;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.35;
		cursor: default;
	}
</style>
