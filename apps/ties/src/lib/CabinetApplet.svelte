<script>
	/**
	 * A running machine inside an article — a PDP-7 and Type 340, pointer as light pen,
	 * with a menu of programs (cabinet-programs.js). See apps/ties/CABINET-APPLET.md.
	 */
	import { onMount, tick, untrack } from 'svelte';
	import {
		Pdp7,
		Type340,
		LightPen,
		PEN_COLORS,
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
		explain,
		explainDisplay,
		Trace,
		Monitor,
		hoverAt,
		cornerAt,
		placesIn,
		cornerLimits,
		clampCorner,
		moveCorner,
		preview340,
		dist2,
		MODE,
		ST340_STOPPED,
		ST340_LPHIT,
		ST340_HEDGE,
		ST340_VEDGE
	} from '@wwsff/cabinet';
	import { PROGRAMS, DEFAULT_PROGRAM, programById } from './cabinet-programs.js';
	import { useApplets } from './applets.svelte.js';
	import RingView from './RingView.svelte';

	let { spec, embedded = false } = $props();

	// The spec picks the first program; after that the menu owns it.
	let programId = $state(untrack(() => spec.program ?? DEFAULT_PROGRAM));
	const program = $derived(programById(programId));

	// A `follows:` transclusion on the page shows the article for the program running.
	// monitor() reaches the running machine's core and symbols from the page, out of band.
	const board = useApplets();
	$effect(() => {
		if (!board) return;
		board[spec.id ?? 'cabinet'] = { program: programId, label: program?.label ?? '', help: program?.help ?? null, monitor: () => monitor };
	});
	// Each program opens the 340 or not (display: false); the reader can open or close it any time.
	let displayOpen = $state(untrack(() => programById(programId)?.display !== false));
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

	const size = $derived(Number(spec.size) || 1024);
	// The tube's side: a size the reader dragged to wins over the fitted one, and is kept.
	// The tube is square and centred, black letterbox left and right, never above or below.
	const SIDE_KEY = 'cabinet-display-side';
	let userSide = $state(untrack(() => Number(globalThis.localStorage?.getItem(SIDE_KEY)) || null));
	// The figure always fills the pane's width; the panels span it, whatever the tube.
	let figW = $state(0);
	const side = $derived(Math.min(userSide ?? fitSide ?? size, figW || Infinity));
	// The figure's height once the bottom edge has been dragged: a floor, so content taller
	// than it still shows, and height past the content goes to the growing panel.
	const HEIGHT_KEY = 'cabinet-height';
	let figHeight = $state(untrack(() => Number(globalThis.localStorage?.getItem(HEIGHT_KEY)) || null));

	// The tube stays square and, with the console, menu and demo rows, fits the scrolling
	// pane it sits in. The reserve is fixed, not measured, so switching programs or starting
	// a demo never resizes the tube; the demo's caption lines and the rows a program adds
	// push what is below them down.
	const TITLE_ALLOWANCE = 12;
	const CAPTION_RESERVE = 130;
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

	// Edge drags. The figure's bottom edge sets its height, no shorter than the content. The
	// tube's edges scale the tube; it is centred, so start ± 2·dx keeps the edge under the pointer.
	let edgeDrag = $state(null);

	/** The figure's height with the growing panel at its own size, none of the spare. */
	function contentHeight() {
		if (!figureEl) return 0;
		const cs = getComputedStyle(figureEl);
		const below = parseFloat(cs.paddingBottom) + parseFloat(cs.borderBottomWidth);
		const line = memEl?.querySelector('.mem-line')?.offsetHeight ?? 0;
		const bottom = captionEl?.getBoundingClientRect().bottom ?? figureEl.getBoundingClientRect().bottom;
		return bottom - figureEl.getBoundingClientRect().top + below - (memOpen ? (MEM_LINES - MEM_MIN_LINES) * line : 0) - (ringsOpen && hasRings ? ringsExtra : 0) - (ttyOpen ? ttyExtra : 0);
	}

	function setHeight(want) {
		figHeight = Math.round(Math.max(want, contentHeight()));
	}
	function setSide(want) {
		userSide = Math.round(Math.max(MIN_SIDE / 2, Math.min(figW || 4096, want)));
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
		const dy = event.clientY - d.y0;
		if (d.edge === 'bottom') setHeight(d.h0 + dy);
		else if (d.edge === 'tube-bottom') setSide(d.side0 + dy);
		else setSide(d.edge === 'tube-right' ? d.side0 + 2 * dx : d.side0 - 2 * dx);
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
		store(HEIGHT_KEY, figHeight);
	}
	function onEdgeKey(event, edge) {
		const step = { ArrowLeft: -16, ArrowDown: 16, ArrowRight: 16, ArrowUp: -16 }[event.key];
		if (!step) return;
		event.preventDefault();
		if (edge === 'bottom') setHeight((figureEl?.offsetHeight ?? side) + step);
		else setSide(side + step);
		onEdgeUp(event);
	}
	/** Double-click: the height drops to the content, the tube fits the pane. */
	function onEdgeReset(edge) {
		if (edge === 'bottom') figHeight = null;
		else userSide = null;
		store(SIDE_KEY, userSide);
		store(HEIGHT_KEY, figHeight);
	}
	// Keys from before the figure and the tube were sized apart.
	for (const k of ['cabinet-side', 'cabinet-aspect', 'cabinet-width']) store(k, null);
	const EDGE_LABEL = {
		bottom: 'Cabinet height, bottom edge',
		'tube-left': 'Display size, left edge',
		'tube-right': 'Display size, right edge',
		'tube-bottom': 'Display size, bottom edge'
	};
	const EDGE_TITLE = {
		bottom: 'Drag to change the height; double-click for the content’s own height',
		'tube-left': 'Drag to resize the display; double-click to fit the pane',
		'tube-right': 'Drag to resize the display; double-click to fit the pane',
		'tube-bottom': 'Drag to resize the display; double-click to fit the pane'
	};
	const bootChunk = 100_000;

	// A PDP-7 memory cycle is 1.75 µs. Pacing is by wall clock, never by the monitor's
	// refresh rate; a stall longer than MAX_DT_MS is a hiccup, not a debt to repay.
	const CYCLES_PER_MS = 1000 / 1.75;
	const MAX_DT_MS = 250;
	const MAX_CYCLES_PER_FRAME = 100_000;
	const SPEEDS = [0.001, 0.01, 0.1, 1, 10, Infinity];
	let speed = $state(1);
	// An instruction is one cycle (operate, IOT) or two (memory reference), three when
	// indirect: 1× is 190,000 to 570,000 instructions a second, and even .001× is a blur.
	// Trace paces by instructions instead, this many ms apart, with the views following.
	const TRACES = [1000, 300, 100, 30];
	let traceMs = $state(0);
	let traceOwed = 0;
	const traceLabel = (ms) => (ms >= 1000 ? `${ms / 1000} s` : `.${String(ms / 1000).slice(2)} s`);
	/** One scale, slowest first: trace intervals, then multiples of a real PDP-7. */
	const RATES = [
		...TRACES.map((ms) => ({
			trace: ms,
			label: traceLabel(ms),
			title: `Trace: one instruction every ${ms >= 1000 ? `${ms / 1000} s` : `${ms} ms`}, the views following the PC`
		})),
		...SPEEDS.map((s) => ({
			speed: s,
			label: s === Infinity ? 'MAX' : `${String(s).replace(/^0/, '')}×`,
			title:
				s === Infinity
					? 'As fast as this computer can go'
					: s === 1
						? '1× is a real PDP-7: 571,429 memory cycles a second, 1.75 µs each'
						: `${s}× a real PDP-7: ${Math.round(571_429 * s).toLocaleString()} cycles a second`
		}))
	];
	const RATE_NOTCH = 14;
	const RATE_PUCK = 40;
	const rateIndex = $derived(
		traceMs ? RATES.findIndex((r) => r.trace === traceMs) : RATES.findIndex((r) => r.speed === speed)
	);
	let rateDrag = $state(false);

	function setRate(i) {
		const r = RATES[Math.max(0, Math.min(RATES.length - 1, i))];
		if (r.trace) setTrace(r.trace);
		else setSpeed(r.speed);
	}

	function rateAt(e) {
		const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
		return Math.round((x - RATE_PUCK / 2) / RATE_NOTCH);
	}

	function onRateDown(e) {
		if (e.button !== 0) return;
		rateDrag = true;
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
		setRate(rateAt(e));
	}

	function onRateMove(e) {
		if (rateDrag) setRate(rateAt(e));
	}

	function onRateKey(e) {
		const to = { ArrowLeft: rateIndex - 1, ArrowDown: rateIndex - 1, ArrowRight: rateIndex + 1, ArrowUp: rateIndex + 1, Home: 0, End: RATES.length - 1 }[e.key];
		if (to === undefined) return;
		e.preventDefault();
		setRate(to);
	}
	let lastNow = null;
	let owed = 0;

	let box = null;
	let cpu = null;
	let t340 = null;
	let pen = null;
	let pressedId = null;
	let monitor = null;
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

	// Display knobs, burned in for now. They are the uniforms the WebGPU phosphor shader
	// will take later. floor and gamma lift the 340's low intensities (SRAST draws at 0)
	// so they read on a modern screen; contrast scales, brightness offsets.
	const PHOSPHOR = { brightness: 0.06, contrast: 1.0, gamma: 0.6, floor: 0.3 };

	// 340 intensity (0..7) and coverage (fraction of integrated refreshes that drew it) to alpha.
	function phosphor(intensity, coverage) {
		const { brightness, contrast, gamma, floor } = PHOSPHOR;
		const i = Math.min(Math.max(intensity ?? 7, 0), 7) / 7;
		const level = floor + (1 - floor) * i ** gamma;
		const energy = level * (0.2 + 0.8 * coverage);
		return Math.min(1, Math.max(0, brightness + contrast * energy));
	}

	function drawSegments(ctx, seen, total) {
		const stroke = '#9fe8a0';
		ctx.strokeStyle = stroke;
		ctx.fillStyle = stroke;
		ctx.lineWidth = 1.5;
		ctx.lineCap = 'round';
		for (const { s, n } of seen.values()) {
			const alpha = phosphor(s.intensity, n / total);
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
		ttyFlush();
		if (tty && ttyWaiting !== tty.waiting) ttyWaiting = tty.waiting;
		const canvas = canvasEl;
		if (!canvas || !t340) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = '#0a0f0a';
		ctx.fillRect(0, 0, 1024, 1024);
		// Edit mode, and the steady display below 1x, draw core as it is now through a shadow 340,
		// so the picture holds still however slowly the CPU runs.
		const steady = editOn || steadyScreen;
		const edited = steady ? editPicture() : null;
		const frames = edited ? [{ segments: edited }] : batch.length ? batch : [{ segments: t340.lastFrame?.segments ?? t340.segments }];
		const seen = integrate(frames);
		drawSegments(ctx, seen, frames.length);
		batch = [];
		const showPen = !editOn && (player || pressedId !== null);
		if (showPen) sensePen(seen, frames.length);
		const hovered = editOn ? null : hoverTip();
		if (hovered && outlineOn) drawHover(ctx, hovered);
		if (showPen) drawPen(ctx);
		if (editOn) drawHandles(ctx, edited);
	}

	// The pointer is one tool at a time: a light pen in one of eight colours, or the editor.
	const TOOL_KEY = 'cabinet-tool';
	let tool = $state(untrack(() => {
		const t = globalThis.localStorage?.getItem(TOOL_KEY);
		return t === 'edit' ? 'edit' : Math.min(7, Math.max(0, Number(t) || 0));
	}));
	const editOn = $derived(tool === 'edit');
	let toolMenuOpen = $state(false);
	let toolMenuEl = $state(null);
	$effect(() => {
		if (!toolMenuOpen) return;
		const close = (e) => {
			if (!toolMenuEl?.contains(e.target)) toolMenuOpen = false;
		};
		const esc = (e) => e.key === 'Escape' && (toolMenuOpen = false);
		document.addEventListener('pointerdown', close, true);
		document.addEventListener('keydown', esc);
		return () => {
			document.removeEventListener('pointerdown', close, true);
			document.removeEventListener('keydown', esc);
		};
	});
	function setTool(t) {
		tool = t;
		store(TOOL_KEY, String(t));
		editGrab = null;
		editNote = t === 'edit' ? 'Drag the end of a line.' : '';
		if (!pen) return;
		if (t === 'edit') pen.enabled = false;
		else pen.color = PEN_COLORS[t];
	}

	// How the tube is drawn. 'machine': the 340's own refreshes, which flicker when the CPU is slow,
	// as the real one would. 'steady': core as it is now, redrawn every frame, whatever the CPU does.
	const SCREEN_KEY = 'cabinet-screen';
	let screenMode = $state(untrack(() => globalThis.localStorage?.getItem(SCREEN_KEY) ?? 'auto'));
	const steadyScreen = $derived(screenMode === 'steady' || (screenMode === 'auto' && (paused || traceMs > 0 || speed < 1)));
	function setScreenMode(m) {
		screenMode = m;
		store(SCREEN_KEY, m);
	}

	// Edit mode: drag a corner of what the 340 draws by rewriting its two vector words in core.
	// The program's own structures don't change, so PIXIE's next recompile puts its picture back.
	let editGrab = null;
	let editAt = null;
	let editNote = $state('Drag the end of a line.');
	// Off unless asked for: the memory panel follows the words being edited.
	const EDIT_SHOW_KEY = 'cabinet-edit-show-memory';
	let editShow = $state(untrack(() => globalThis.localStorage?.getItem(EDIT_SHOW_KEY) === 'on'));
	let editWords = $state([]);
	function toggleEditShow() {
		editShow = !editShow;
		store(EDIT_SHOW_KEY, editShow ? 'on' : '');
		if (editShow) showEditWords();
	}
	function showEditWords() {
		if (!editShow || !editWords.length) return;
		const first = Math.min(...editWords);
		// Code view shows each word disassembled beside its source line, which is what a poke changes.
		openMemAt(first, memView === 'octal' || memView === 'trace' ? 'code' : undefined);
	}
	// Generous, so the nearest corner is picked without precise pointing.
	const EDIT_RADIUS = 40;

	function editPicture() {
		const start = t340.startAddr;
		return start >= 0 ? preview340((a) => cpu.read(a), start) : (t340.lastFrame?.segments ?? t340.segments);
	}

	let editHover = $state(false);
	let editDragging = $state(false);

	function drawHandles(ctx, segs) {
		const read = (a) => cpu.read(a);
		const near = editGrab ? null : editAt && cornerAt(segs, editAt.x, editAt.y, EDIT_RADIUS, read);
		if (editHover !== !!near) editHover = !!near;
		ctx.save();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255, 210, 122, 0.45)';
		for (const s of segs) if (s.kind === 'vector' && s.intensify) ctx.strokeRect(s.x1 - 3, 1023 - s.y1 - 3, 6, 6);
		// Places set by POINT words: diamonds, since they move whatever is drawn from them.
		for (const p of placesIn(segs, read)) {
			ctx.beginPath();
			ctx.moveTo(p.x, 1023 - p.y - 5);
			ctx.lineTo(p.x + 5, 1023 - p.y);
			ctx.lineTo(p.x, 1023 - p.y + 5);
			ctx.lineTo(p.x - 5, 1023 - p.y);
			ctx.closePath();
			ctx.stroke();
		}
		// The words meeting at the corner hold at most 127 each way: the corner can't leave this box.
		const box = editGrab?.box;
		if (box) {
			ctx.fillStyle = 'rgba(255, 210, 122, 0.05)';
			ctx.strokeStyle = editGrab.pinned ? 'rgba(255, 140, 90, 0.7)' : 'rgba(255, 210, 122, 0.3)';
			ctx.setLineDash([6, 6]);
			ctx.fillRect(box.x0, 1023 - box.y1, box.x1 - box.x0, box.y1 - box.y0);
			ctx.strokeRect(box.x0, 1023 - box.y1, box.x1 - box.x0, box.y1 - box.y0);
			ctx.setLineDash([]);
		}
		const pick = editGrab ? { x: editGrab.x, y: editGrab.y } : near;
		if (pick) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = editGrab?.refused ? '#ff6b6b' : '#ffd27a';
			ctx.strokeRect(pick.x - 8, 1023 - pick.y - 8, 16, 16);
		}
		ctx.restore();
	}

	function editDown(event) {
		const { x, y } = gridFromEvent(event);
		const corner = cornerAt(editPicture(), x, y, EDIT_RADIUS, (a) => cpu.read(a));
		if (!corner) {
			editNote = 'Nothing to grab here: point at the end of a line, or a diamond where text or a line starts.';
			return;
		}
		const box = cornerLimits((a) => cpu.read(a), corner);
		if (!box) {
			editNote = 'That line is cut short by the edge of the screen, so its word does not say where it ends.';
			return;
		}
		editGrab = { corner, box, x: corner.x, y: corner.y, refused: false, pinned: false };
		editDragging = true;
		const words = [corner.place?.xAt, corner.place?.yAt, corner.into?.addr, corner.outOf?.addr].filter((a) => a !== undefined);
		editWords = words;
		showEditWords();
		editNote = `${corner.place ? 'Placed by POINT words' : 'Corner'} ${corner.x},${corner.y}: words ${words.map((a) => oct(a, 5)).join(', ')}`;
		try {
			canvasEl.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic pointers can't be captured; the drag still works while inside.
		}
		pressedId = event.pointerId;
	}

	function editMove(event) {
		const { x, y } = gridFromEvent(event);
		editAt = { x, y };
		if (!editGrab || event.pointerId !== pressedId) return drawFrame();
		// Outside the box, follow as far as the words allow, along whichever axis still can.
		const to = clampCorner(editGrab.corner, editGrab.box, x, y);
		editGrab.pinned = to.x !== x || to.y !== y;
		const c = editGrab.corner;
		if (to.x !== c.x || to.y !== c.y) {
			const pokes = moveCorner((a) => cpu.read(a), c, to.x, to.y);
			editGrab.refused = !pokes;
			if (pokes) {
				for (const [a, w] of pokes) monitor.poke(a, w);
				if (editShow && memOpen) refreshMem();
				const dx = to.x - c.x;
				const dy = to.y - c.y;
				editGrab.corner = {
					x: to.x,
					y: to.y,
					into: c.into && { ...c.into, x1: c.into.x1 + dx, y1: c.into.y1 + dy },
					outOf: c.outOf && { ...c.outOf, x0: c.outOf.x0 + dx, y0: c.outOf.y0 + dy },
					place: c.place
				};
				editGrab.x = to.x;
				editGrab.y = to.y;
			}
		}
		editNote = editGrab.pinned
			? 'At the edge: a vector word moves at most 127 each way, so the corner stops at the dashed box.'
			: `Corner ${editGrab.x},${editGrab.y}`;
		drawFrame();
	}

	function editUp(event) {
		if (event.pointerId !== pressedId) return;
		pressedId = null;
		editGrab = null;
		editDragging = false;
		if (canvasEl?.hasPointerCapture(event.pointerId)) canvasEl.releasePointerCapture(event.pointerId);
	}

	// penGlow: how much phosphor light the photocell sees, 0..1, eased so it swells and fades.
	// penFlash: 1 when the 340 latched a hit for this pen, decaying; the program saw it.
	let penGlow = 0;
	let penFlash = 0;
	let hitSeen = null;

	function sensePen(seen, total) {
		const r = pen.aperture;
		let light = 0;
		for (const { s, n } of seen.values()) {
			if (dist2(pen.x, pen.y, s.x0, s.y0, s.x1, s.y1) > r * r) continue;
			const a = phosphor(s.intensity, n / total);
			const dx = s.x1 - s.x0;
			const dy = s.y1 - s.y0;
			const len2 = dx * dx + dy * dy;
			if (len2 === 0) {
				light += a * Math.max(2, s.scale || 1);
				continue;
			}
			// Length of the stroke inside the aperture circle.
			const fx = s.x0 - pen.x;
			const fy = s.y0 - pen.y;
			const b = (fx * dx + fy * dy) / len2;
			const c = (fx * fx + fy * fy - r * r) / len2;
			const disc = Math.sqrt(Math.max(0, b * b - c));
			const t0 = Math.max(0, -b - disc);
			const t1 = Math.min(1, -b + disc);
			light += a * Math.max(0, t1 - t0) * Math.sqrt(len2);
		}
		// A full-bright line across the diameter reads 0.63; dense text saturates toward 1.
		const target = pen.enabled ? 1 - Math.exp(-light / (2 * r)) : 0;
		penGlow += (target - penGlow) * (target > penGlow ? 0.6 : 0.2);
		if (t340.lastHit !== hitSeen) {
			hitSeen = t340.lastHit;
			if (t340.lastHitPen === pen) penFlash = 1;
		} else penFlash *= 0.8;
	}

	// The pen is not on the tube; this is where it is and what it can see. On the glass the
	// ring fills with light in proportion to what the photocell reads, additively, so the
	// strokes under it stay visible.
	function drawPen(ctx) {
		const x = pen.x;
		const y = 1023 - pen.y;
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, pen.aperture, 0, 2 * Math.PI);
		if (pen.enabled) {
			ctx.globalCompositeOperation = 'lighter';
			ctx.globalAlpha = Math.min(0.75, 0.08 + 0.45 * penGlow + 0.25 * penFlash);
			ctx.fillStyle = pen.color;
			ctx.fill();
			ctx.globalCompositeOperation = 'source-over';
		}
		ctx.globalAlpha = pen.enabled ? 0.8 + 0.2 * penFlash : 0.35;
		ctx.strokeStyle = pen.color;
		ctx.lineWidth = 1.5 + 1.5 * penFlash;
		ctx.stroke();
		if (penFlash > 0.05) {
			ctx.globalAlpha = 0.6 * penFlash;
			ctx.strokeStyle = '#ffffff';
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		ctx.restore();
	}

	// Hovering is the pen held off the glass: the program can't see it, the page can.
	// After a rest, read the display list under the pointer and say what drew it.
	const HOVER_MS = 400;
	// The tip snaps in, survives a few frames of missed hits, then fades fast.
	const TIP_HOLD_MS = 300;
	const TIP_FADE_MS = 150;
	let rest = null;
	let penAt = null;
	let tip = $state.raw(null);
	let tipEl = $state(null);
	let tipLost = 0;
	// Embedded in a HyperTIES page the definition window is the place for this, so it starts off there.
	const TIPS_KEY = untrack(() => (embedded ? 'cabinet-tips-embedded' : 'cabinet-tips'));
	let tipsOn = $state(untrack(() => (globalThis.localStorage?.getItem(TIPS_KEY) ?? (embedded ? 'off' : 'on')) === 'on'));
	function setTips(on) {
		tipsOn = on;
		store(TIPS_KEY, on ? 'on' : 'off');
		if (!on) tip = null;
	}
	let outlineOn = $state(untrack(() => globalThis.localStorage?.getItem('cabinet-outline') !== 'off'));
	function setOutline(on) {
		outlineOn = on;
		store('cabinet-outline', on ? 'on' : 'off');
	}
	const TAIL = 44;

	// Measure the tip and keep it inside what is visible of the pane; the tail slides to the anchor.
	$effect(() => {
		const t = tip;
		const el = tipEl;
		if (!t || !el?.parentElement) return;
		const wrap = el.parentElement.getBoundingClientRect();
		const sp = scrollParent(figureEl);
		const vw = document.documentElement.clientWidth;
		const vh = document.documentElement.clientHeight;
		const pane = sp === document.documentElement ? { left: 0, top: 0, right: vw, bottom: vh } : sp.getBoundingClientRect();
		const M = 6;
		const minX = Math.max(pane.left, 0) + M - wrap.left;
		const maxX = Math.min(pane.right, vw) - M - wrap.left;
		const minY = Math.max(pane.top, 0) + M - wrap.top;
		const maxY = Math.min(pane.bottom, vh) - M - wrap.top;
		el.style.maxWidth = `${Math.max(120, Math.min(380, maxX - minX))}px`;
		const w = el.offsetWidth;
		const h = el.offsetHeight;
		const left = Math.max(minX, Math.min(t.px - 14, maxX - w));
		// Clear the hovered item's outline; a box too tall for either side falls back to the pointer.
		const fits = (y) => y >= minY && y + h <= maxY;
		let below = (t.bottom ?? t.py) + TAIL;
		let above = (t.top ?? t.py) - TAIL - h;
		if (!fits(below) && !fits(above)) {
			below = t.py + TAIL;
			above = t.py - TAIL - h;
		}
		const up = !fits(below) && (fits(above) || t.py - minY > maxY - t.py);
		const arrow = Math.max(10, Math.min(w - 10, t.px - left));
		el.style.left = `${wrap.left + left}px`;
		el.style.top = `${wrap.top + (up ? above : below)}px`;
		el.style.setProperty('--arrow', `${arrow}px`);
		el.style.transformOrigin = `${arrow}px ${up ? '100%' : '0'}`;
		el.classList.toggle('up', up);
	});
	let penHeld = $state(false);

	function showTip(t) {
		if (t && !tipsOn) return;
		if (t) {
			tipLost = 0;
			tip = t;
			return;
		}
		if (!tip || tip.gone) return;
		const now = performance.now();
		if (!tipLost) tipLost = now;
		if (now - tipLost >= TIP_HOLD_MS) fadeTip();
	}

	function fadeTip() {
		if (!tip || tip.gone) return;
		const t = { ...tip, gone: true };
		tip = t;
		tipLost = 0;
		setTimeout(() => {
			if (tip === t) tip = null;
		}, TIP_FADE_MS + 20);
	}

	function notePenAt(event) {
		const rect = canvasEl.getBoundingClientRect();
		penAt = { px: event.clientX - rect.left, py: event.clientY - rect.top, w: rect.width, h: rect.height };
	}

	function onHoverMove(event) {
		if (pressedId !== null || event.pointerType === 'touch' || !canvasEl) return;
		const rect = canvasEl.getBoundingClientRect();
		const px = event.clientX - rect.left;
		const py = event.clientY - rect.top;
		if (rest && Math.hypot(px - rest.px, py - rest.py) < 3) return;
		const { x, y } = gridFromEvent(event);
		rest = { gx: x, gy: y, px, py, w: rect.width, h: rect.height, since: performance.now() };
		fadeTip();
	}

	function onHoverLeave() {
		rest = null;
		if (pressedId === null) fadeTip();
	}

	const where = (a) => {
		const name = monitor?.label(a) ?? oct(a, 1);
		return name === oct(a, 1) ? oct(a, 1) : `${name} (${oct(a, 1)})`;
	};

	/** The generic machine view: what the 340 knows about the stroke, shown for every hover. */
	function machineLines(h) {
		const s = h.hit;
		const inside =
			h.keyKind === 'block'
				? `in the block entered at ${where(h.key)}`
				: s.ret >= 0
					? `in subroutine ${where(h.key)}, returning to ${where(s.ret)}`
					: `in the DDS block linked at ${where(h.key)}`;
		const lines = [`${s.kind} from display word ${where(s.addr)}`, inside];
		if (h.text) lines.push(`spells “${h.text}”`);
		lines.push(
			`${h.group.length} strokes · pen ${s.pen ? 'can hit it' : 'blind'} · intensity ${s.intensity} · scale ${s.scale}`
		);
		lines.push(`drawn at cycle ${s.cycle.toLocaleString('en')} · frame ${s.frame.toLocaleString('en')}`);
		return lines;
	}

	/**
	 * Refresh the tooltip from the latest frame; returns the hover to outline, or null.
	 * Hovering waits for a rest; a pen on the glass captions what it is over at once.
	 */
	function hoverTip() {
		const held = pressedId !== null && pen && penAt;
		const at = held ? { ...penAt, gx: pen.x, gy: pen.y } : rest;
		if (!t340 || !at || (!held && performance.now() - rest.since < HOVER_MS)) {
			showTip(null);
			return null;
		}
		const segs = t340.lastFrame?.segments ?? t340.segments;
		const h = hoverAt(segs, at.gx, at.gy, held ? pen.aperture : Math.max(6, (10 * 1024) / at.w));
		if (!h) {
			showTip(null);
			return null;
		}
		let hint = null;
		try {
			hint = program?.hint?.(h, segs) ?? null;
		} catch (e) {
			console.error('cabinet hint', e);
		}
		const pad = (8 * at.h) / 1024;
		showTip({
			px: at.px,
			py: at.py,
			top: ((1023 - h.box.y1) * at.h) / 1024 - pad,
			bottom: ((1023 - h.box.y0) * at.h) / 1024 + pad,
			hint,
			machine: machineLines(h),
			sensor: held ? penGlow : null,
			color: held ? pen.color : null,
			hit: held && penFlash > 0.5
		});
		return h;
	}

	function drawHover(ctx, h) {
		const pad = 8;
		ctx.save();
		ctx.globalAlpha = 0.55;
		ctx.strokeStyle = '#ffd27a';
		ctx.lineWidth = 2;
		ctx.setLineDash([6, 6]);
		ctx.strokeRect(
			h.box.x0 - pad,
			1023 - h.box.y1 - pad,
			h.box.x1 - h.box.x0 + 2 * pad,
			h.box.y1 - h.box.y0 + 2 * pad
		);
		ctx.restore();
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
		halted = cpu.halted;
		refreshMem();
		refreshRegs();
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
	const memViewFor = (p) => (p?.source ? 'source' : 'code');
	let memView = $state(untrack(() => memViewFor(programById(programId))));
	const MEM_COLS = $derived(memView === 'octal' ? (figW >= 420 ? 8 : 4) : 1);
	// Panels under the controls, toggled by the chips: any set of them open at once, stacked
	// in one order. Shift-click shows one alone.
	const PANELS_KEY = 'cabinet-panels';
	const panelsRaw = untrack(() => globalThis.localStorage?.getItem(PANELS_KEY) ?? null);
	const panelsStored = (panelsRaw ?? 'play').split(' ');
	let playOpen = $state(panelsStored.includes('play'));
	let memOpen = $state(panelsStored.includes('mem'));
	let regsOpen = $state(panelsStored.includes('regs'));
	// A teletype program opens the teletype, whether chosen from the menu or linked to directly.
	let ttyOpen = $state(panelsStored.includes('tty') || !!untrack(() => programById(programId)?.tty));
	let configOpen = $state(panelsStored.includes('config'));
	let ringsOpen = $state(panelsStored.includes('rings'));
	function storePanels() {
		const open = { play: playOpen, tty: ttyOpen, regs: regsOpen, mem: memOpen, rings: ringsOpen, config: configOpen };
		store(PANELS_KEY, Object.keys(open).filter((k) => open[k]).join(' '));
	}
	// The last opened of these takes the figure's spare height; the others keep their size.
	const HUNGRY = ['mem', 'rings', 'tty'];
	let panelOrder = $state([]);
	// Panels a program opts into; RINGS needs to know where the ring structure lives.
	const hasRings = $derived(!!program?.rings);
	const growId = $derived.by(() => {
		const open = { mem: memOpen, rings: ringsOpen && hasRings, tty: ttyOpen };
		return [...panelOrder].reverse().find((k) => open[k]) ?? ['rings', 'mem', 'tty'].find((k) => open[k]) ?? null;
	});
	let ringsExtra = $state(0);
	let ttyExtra = $state(0);
	function opened(id) {
		if (HUNGRY.includes(id)) panelOrder = [...panelOrder.filter((k) => k !== id), id];
	}
	function togglePanel(id, e) {
		const open = { play: playOpen, tty: ttyOpen, regs: regsOpen, mem: memOpen, rings: ringsOpen, config: configOpen };
		if (e.shiftKey) for (const k in open) open[k] = k === id;
		else open[id] = !open[id];
		if (open[id]) opened(id);
		playOpen = open.play;
		ttyOpen = open.tty;
		regsOpen = open.regs;
		memOpen = open.mem;
		ringsOpen = open.rings;
		configOpen = open.config;
		storePanels();
		refreshRegs();
	}
	function openMemAt(addr, view) {
		if (!memOpen) {
			memOpen = true;
			opened('mem');
			storePanels();
		}
		if (view && memView !== view) setView(view);
		// Following the PC would pull the view straight back off the address.
		memFollow = !!cpu && addr === cpu.pc;
		memGo(addr, true);
	}

	const MODE_NAME = Object.fromEntries(Object.entries(MODE).map(([name, n]) => [n, name.toLowerCase()]));
	let clock = null;
	let halted = $state(false);

	// A HLT is read, not patched: the program's halt spec explains it from core and says where to start again.
	let haltInfo = $state(null);
	let haltTimer = null;
	const HALT_AUTO_MS = 3000;
	const scoresKey = (id) => `cabinet-scores-${id}`;
	function loadScores(id) {
		try {
			return JSON.parse(localStorage.getItem(scoresKey(id)) ?? '{}') ?? {};
		} catch {
			return {};
		}
	}
	let scores = $state(untrack(() => loadScores(programId)));
	let haltAuto = $state(untrack(() => globalThis.localStorage?.getItem(`cabinet-halt-auto-${programId}`) === 'on'));
	function setHaltAuto(on) {
		haltAuto = on;
		store(`cabinet-halt-auto-${programId}`, on ? 'on' : '');
		if (on && haltInfo?.restart !== undefined) armHaltAuto();
		else clearTimeout(haltTimer);
	}
	function armHaltAuto() {
		clearTimeout(haltTimer);
		haltTimer = setTimeout(() => haltInfo && onHaltGo(haltInfo.restart), HALT_AUTO_MS);
	}

	function noteHalt() {
		if (haltInfo || !cpu?.halted) return;
		const spec = program?.halt;
		const said = spec?.explain?.(cpu) ?? null;
		const at = oct(cpu.pc, 4);
		haltInfo = {
			title: said?.title ?? `Halted at ${at}`,
			text: said?.text ?? (said ? '' : 'The program stopped itself. Continue runs on from here.'),
			restart: said ? spec.restart : undefined,
			at
		};
		if (said?.score && !player) {
			scores = { ...scores, [said.score]: (scores[said.score] ?? 0) + 1 };
			try {
				localStorage.setItem(scoresKey(programId), JSON.stringify(scores));
			} catch {
				// Blocked storage: the tally lasts until the page is left.
			}
		}
		if (haltAuto && haltInfo.restart !== undefined) armHaltAuto();
	}

	function clearHalt() {
		clearTimeout(haltTimer);
		haltInfo = null;
	}

	/** Lift HLT and run from pc, or on from where it stopped; recorded so a replay does the same. */
	function onHaltGo(pc) {
		if (!cpu) return;
		cpu.halted = false;
		if (pc !== undefined) cpu.pc = pc;
		recorder?.record(box.cycles, 'go', cpu.pc);
		clearHalt();
		halted = false;
		paused = false;
		canvasEl?.focus({ preventScroll: true });
	}

	function onClearScores() {
		scores = {};
		store(scoresKey(programId), '');
	}
	let regs = $state.raw(null);
	function refreshRegs() {
		if (!regsOpen || !cpu || !t340 || !box) return;
		regs = {
			pc: cpu.pc,
			ac: cpu.ac,
			link: cpu.link,
			mq: cpu.mq,
			sc: cpu.sc,
			ion: cpu.ion,
			irq: cpu.irqLine,
			halted: cpu.halted,
			cycles: box.cycles,
			dac: t340.dac,
			mode: MODE_NAME[t340.mode] ?? String(t340.mode),
			x: t340.x,
			y: t340.y,
			scale: t340.scale,
			intensity: t340.intensity,
			lp: t340.lpEna,
			running: !(t340.status & ST340_STOPPED),
			hit: !!(t340.status & ST340_LPHIT),
			edge: !!(t340.status & (ST340_HEDGE | ST340_VEDGE)),
			frame: t340.frame,
			kbd: !!tty?.kbdFlag,
			tto: !!tty?.ttoFlag,
			clkOn: !!clock?.on,
			clkFlag: !!clock?.flag
		};
	}
	/** Keep the PC in view (code, source, octal) or the newest instruction (trace). */
	let memFollow = $state(true);
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

	// On unless turned off: a plain-English line beside each word in the code view.
	const EXPLAIN_KEY = 'cabinet-explain';
	let explainOn = $state(untrack(() => globalThis.localStorage?.getItem(EXPLAIN_KEY) !== 'off'));
	function toggleExplain() {
		explainOn = !explainOn;
		store(EXPLAIN_KEY, explainOn ? '' : 'off');
		refreshMem();
	}
	// Display words the shadow 340 fetched, and the mode each was read in; refreshed with the view.
	let displayModes = $state.raw(new Map());
	function says(at, w) {
		const mode = displayModes.get(at);
		return mode === undefined ? explain(w, symbolic) : `340: ${explainDisplay(w, mode, symbolic)}`;
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
		if (memView === 'code' && explainOn && t340?.startAddr >= 0) {
			const modes = new Map();
			preview340((a) => cpu.read(a), t340.startAddr, 20_000, modes);
			displayModes = modes;
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
		halted = cpu.halted;
		noteHalt();
		drawFrame();
		refreshMem();
		refreshRegs();
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

	// The KSR-33 on devices 03/04. Paper is a list of lines and a carriage column: CR returns
	// the carriage, LF feeds the paper, so CR LF, LF CR and a lone CR over a line all print
	// the way the machine drove them. The keyboard sends upper case with the eighth bit
	// set, as a KSR-33 does; Return is CR, Backspace and Delete are RUBOUT.
	const TTY_KEEP = 2000;
	const TTY_FONT_KEY = 'cabinet-tty-font';
	const TTY_HEIGHT_KEY = 'cabinet-tty-height';
	const TTY_FONTS = { xs: 0.55, s: 0.65, m: 0.8, l: 1, xl: 1.3 };
	let tty = null;
	let ttyPaper = $state.raw(['']);
	let ttyCaret = $state(0);
	/**
	 * The teletype driver lives here, on the host's side, not in the program. Each program sets
	 * these when chosen (program.ttyConfig); the settings panel changes them until the next one.
	 * duplex half: the paper prints keys as typed (a KSR-33's local copy); full: the program echoes.
	 * input raw: every key goes straight to the machine; line: the line is edited here, sent on Return.
	 * wrap false: long lines scroll sideways; true: they wrap at the right edge.
	 * upcase true: typed, pasted and spoken text goes in upper case, as on a KSR-33.
	 * bindings: { 'Ctrl-S': 'stop' | 'go' | { send: code } }.
	 */
	const TTY_DEFAULTS = { duplex: 'half', input: 'raw', wrap: false, upcase: true, bindings: { 'Ctrl-S': 'stop', 'Ctrl-Q': 'go' } };
	// TODO ^T, as on TOPS-20: print the machine's status (program, PC, cycles, speed, what it waits
	// on) on the paper without the program's help. The first job of a teletype driver that lives in
	// the emulator, not in the machine: a binding whose action reads the cabinet, not the CPU.
	let ttyCfg = $state(untrack(() => ttyConfigFor(programById(programId))));
	let ttyFont = $state(untrack(() => globalThis.localStorage?.getItem(TTY_FONT_KEY) || 'm'));
	let ttyHeight = $state(untrack(() => Number(globalThis.localStorage?.getItem(TTY_HEIGHT_KEY)) || 0));
	let ttyLine = $state('');
	let ttyCols = $state(0);
	const ttyLocal = $derived(ttyCfg.duplex === 'half');

	// RINGS: labels or octal addresses of the cells holding the bounds and the root names.
	let ringsCfg = $state(untrack(() => ringsConfigFor(programById(programId))));
	function ringsConfigFor(p) {
		return { beg: '', end: '', roots: '', ...(p?.rings ?? {}) };
	}
	function ringAddr(text) {
		const t = text.trim();
		if (/^[0-7]+$/.test(t)) return Number.parseInt(t, 8);
		return byName.get(t.toUpperCase()) ?? null;
	}
	function captureRings() {
		if (!cpu) return { error: 'No machine.' };
		const begAt = ringAddr(ringsCfg.beg);
		const endAt = ringAddr(ringsCfg.end);
		if (begAt === null || endAt === null) return { error: 'Name the BEG and END cells in CONFIG.' };
		const beg = cpu.read(begAt) & 0o17777;
		const end = cpu.read(endAt) & 0o17777;
		if (end <= beg || end - beg > 0o20000) return { error: `No structure yet (${oct(beg, 5)} to ${oct(end, 5)}).` };
		const words = [];
		for (let a = beg; a < end; a += 1) words.push(cpu.read(a) & 0o777777);
		const roots = [];
		for (const r of ringsCfg.roots.split(/[\s,]+/).filter(Boolean)) {
			const at = ringAddr(r);
			if (at === null) return { error: `Unknown root ${r}.` };
			roots.push(cpu.read(at) & 0o777777);
		}
		return { image: { beg, end, savins: roots[0] ?? 0o100000, words }, roots };
	}

	function ttyConfigFor(p) {
		const c = p?.ttyConfig ?? {};
		return { ...TTY_DEFAULTS, upcase: !p?.lowerCase, ...c, bindings: { ...TTY_DEFAULTS.bindings, ...(c.bindings ?? {}) } };
	}
	/** Keys the program has not read. */
	let ttyWaiting = $state(0);
	let ttyUnread = $state(0);
	let ttyBell = $state(false);
	let ttyEl = $state(null);
	let ttyLines = [''];
	let ttyCol = 0;
	let ttyDirty = false;
	let ttyRecAt = -1;
	let ttyRecCodes = [];

	function ttyReset() {
		ttyLines = [''];
		ttyCol = 0;
		ttyPaper = ttyLines;
		ttyCaret = 0;
		ttyUnread = 0;
		ttyDirty = false;
	}

	function ttyPrint(code) {
		const c = code & 0o177;
		if (c === 0o15) ttyCol = 0;
		else if (c === 0o10) ttyCol = Math.max(0, ttyCol - 1);
		else if (c === 0o12) {
			ttyLines.push('');
			if (ttyLines.length > TTY_KEEP) ttyLines.splice(0, ttyLines.length - TTY_KEEP);
		} else if (c === 0o07) {
			ttyBell = true;
			setTimeout(() => (ttyBell = false), 200);
			beep();
		} else if (c >= 0o40 && c < 0o177) {
			const i = ttyLines.length - 1;
			const line = ttyLines[i].padEnd(ttyCol);
			ttyLines[i] = line.slice(0, ttyCol) + String.fromCharCode(c) + line.slice(ttyCol + 1);
			ttyCol += 1;
		} else return;
		ttyDirty = true;
		if (!ttyOpen) ttyUnread += 1;
	}

	/** The bell, ^G: a short tone until there is a recording of a real Model 33's. */
	let audio = null;
	function beep() {
		const Ctx = globalThis.AudioContext ?? globalThis.webkitAudioContext;
		if (!Ctx) return;
		audio ??= new Ctx();
		const t = audio.currentTime;
		const osc = audio.createOscillator();
		const gain = audio.createGain();
		osc.frequency.value = 880;
		gain.gain.setValueAtTime(0.15, t);
		gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
		osc.connect(gain).connect(audio.destination);
		osc.start(t);
		osc.stop(t + 0.25);
	}

	/**
	 * For screen readers: what the machine prints, spoken once it pauses, partial lines and
	 * prompts included. The echo of a line just typed is skipped, since the reader heard it typed.
	 */
	let ttyAnnounce = $state('');
	// Speak: the same words aloud through speech.js, for anyone without a screen reader on.
	const TTY_SPEAK_KEY = 'cabinet-tty-speak';
	let ttySpeak = $state(untrack(() => globalThis.localStorage?.getItem(TTY_SPEAK_KEY) === '1'));
	let speech = null;
	let speechVoice = null;
	async function speechReady() {
		if (!globalThis.speechSynthesis) return null;
		if (!speech) {
			const { SpeechSystem } = await import('./speech.js');
			speech = new SpeechSystem();
			await speech.ready;
			const rank = (v) => (/\((Enhanced|Premium)\)/i.test(v.name) ? 0 : 1);
			const en = [...speech.getEnglishVoices(true), ...speech.getEnglishVoices(false)].map((m) => m.voice);
			speechVoice = en.sort((a, b) => rank(a) - rank(b))[0] ?? null;
		}
		return speech;
	}
	async function sayAloud(text) {
		const s = await speechReady();
		if (!s || !ttySpeak) return;
		// The newest output matters most: cut off whatever is still being read.
		s.cancel();
		// Fingers in ears: the microphone would hear the machine and type its words back in.
		if (listening && !earsShut) {
			earsShut = true;
			recognizer?.abort();
		}
		const done = () => setTimeout(openEars, 300);
		const opts = { rate: 1.1, onEnd: done, onError: done };
		if (speechVoice) s.speakWithVoice(text, speechVoice, opts);
		else s.speak(text, { voiceType: 'male', language: 'en', ...opts });
	}
	let earsShut = false;
	function openEars() {
		if (!earsShut || speechSynthesis.speaking || speechSynthesis.pending) return;
		earsShut = false;
		if (!listening) return;
		try {
			recognizer.start();
		} catch {
			listening = false;
		}
	}
	function setSpeak(on) {
		ttySpeak = on;
		store(TTY_SPEAK_KEY, on ? '1' : '');
		if (on) sayAloud('Speaking.');
		else speech?.cancel();
	}
	let ttySaid = '';
	let ttySayTimer = null;
	let ttyEchoSkip = '';
	let ttyHeardTyped = false;
	function ttyHear(code, typed = false) {
		const c = code & 0o177;
		const ch = c === 0o15 || c === 0o12 ? ' ' : c >= 0o40 && c < 0o177 ? String.fromCharCode(c) : '';
		if (!ch) return;
		if (typed !== ttyHeardTyped) ttySaid += ' ';
		ttyHeardTyped = typed;
		if (ttyEchoSkip && ch === ttyEchoSkip[0]) {
			ttyEchoSkip = ttyEchoSkip.slice(1);
			return;
		}
		ttyEchoSkip = '';
		ttySaid += ch;
		clearTimeout(ttySayTimer);
		ttySayTimer = setTimeout(() => {
			const text = ttySaid.replace(/\s+/g, ' ').trim();
			ttySaid = '';
			if (!text) return;
			// Same words twice still get read: clear the region, then fill it.
			ttyAnnounce = '';
			requestAnimationFrame(() => (ttyAnnounce = text.slice(-600)));
			if (ttySpeak) sayAloud(text.slice(-600));
		}, 350);
	}

	/** A whole line to the machine, as if typed and Return pressed: the command line and voice use it. */
	function sendLine(text) {
		const codes = [];
		for (const ch of text) {
			const c = charCode(ch);
			if (c >= 0 && c !== 0o15) codes.push(c);
		}
		ttyEchoSkip = String.fromCharCode(...codes);
		ttyType([...codes, 0o15]);
	}

	/** The command line under the paper: dictation, phone keyboards and IMEs all type here. */
	let cliKeyAt = 0;
	let cliTimer = null;
	function onCliKey(e) {
		cliKeyAt = Date.now();
		clearTimeout(cliTimer);
		if (e.key === 'Enter') {
			e.preventDefault();
			const text = ttyLine;
			ttyLine = '';
			sendLine(text);
		}
	}
	/** A line that arrived without keystrokes, from dictation or paste, as the program wants it spoken. */
	function sendSpoken(text) {
		ttyLine = '';
		if (!program?.spoken) return sendLine(text);
		// Number games: the number goes in, "return" or "enter" is Return, and anything else is just talk.
		const said = program.spoken(text);
		const n = said.match(/\d+/)?.[0];
		if (n) sendLine(n);
		else if (/\b(return|enter)\b/i.test(said)) sendLine('');
		else voiceNote = `ignored “${text}”`;
	}
	function onCliInput(e) {
		if (ttyCfg.upcase && ttyLine !== ttyLine.toUpperCase()) {
			const at = cliEl?.selectionStart;
			ttyLine = cliEl.value = ttyLine.toUpperCase();
			cliEl.setSelectionRange(at, at);
		}
		// Raw input: typed characters go straight through; dictation waits so spelled numbers become digits.
		const keyed = Date.now() - cliKeyAt <= 150 && e?.inputType !== 'insertFromPaste';
		if (ttyCfg.input === 'raw' && (keyed || !program?.spoken)) {
			if (!ttyLine) return;
			const codes = [...ttyLine].map((ch) => charCode(ch)).filter((c) => c >= 0);
			ttyLine = '';
			ttyType(codes);
			return;
		}
		if (!ttyCfg.autoEnter || !ttyLine.trim()) return;
		// No keydown just before this input: dictation, paste or voice typed it. Send after a pause.
		clearTimeout(cliTimer);
		if (e?.inputType === 'insertFromPaste') sendSpoken(ttyLine);
		else if (Date.now() - cliKeyAt > 150) cliTimer = setTimeout(() => ttyLine.trim() && sendSpoken(ttyLine), ttyCfg.autoEnter);
	}

	let SpeechRecognition = $state(null);
	$effect(() => {
		SpeechRecognition = globalThis.SpeechRecognition ?? globalThis.webkitSpeechRecognition ?? null;
	});
	let listening = $state(false);
	let voiceNote = $state('');
	let recognizer = null;
	let cliEl = $state(null);
	const VOICE_ERRORS = {
		'not-allowed': 'the microphone is blocked for this page',
		'service-not-allowed': 'this browser has no speech service here; try Chrome or Safari',
		network: "this browser's speech service can't be reached; try Chrome or Safari",
		'no-speech': 'no speech heard',
		'audio-capture': 'no microphone found',
		aborted: ''
	};
	function toggleVoice() {
		cliEl?.focus({ preventScroll: true });
		earsShut = false;
		if (listening) {
			listening = false;
			recognizer?.stop();
			return;
		}
		recognizer = new SpeechRecognition();
		recognizer.lang = navigator.language || 'en-US';
		// Interim results show in the command line as you speak, so you can see it hearing you.
		recognizer.interimResults = true;
		recognizer.continuous = true;
		recognizer.onresult = (e) => {
			if (earsShut) return;
			for (let i = e.resultIndex; i < e.results.length; i++) {
				const r = e.results[i];
				const said = r?.[0]?.transcript?.trim() ?? '';
				if (!r?.isFinal) {
					ttyLine = said;
					continue;
				}
				ttyLine = '';
				voiceNote = said ? `heard “${said}”` : 'listening…';
				if (said) sendSpoken(said);
			}
		};
		// Browsers end a session after silence; keep listening until the mic is pressed again.
		recognizer.onend = () => {
			if (!listening || earsShut) return;
			try {
				recognizer.start();
			} catch {
				listening = false;
			}
		};
		recognizer.onerror = (e) => {
			if (e.error === 'no-speech' || e.error === 'aborted') return;
			listening = false;
			voiceNote = VOICE_ERRORS[e.error] ?? `speech recognition failed: ${e.error}`;
			console.warn('cabinet: speech recognition', e.error, e.message);
		};
		voiceNote = 'listening…';
		listening = true;
		try {
			recognizer.start();
		} catch (err) {
			listening = false;
			voiceNote = `speech recognition failed: ${err instanceof Error ? err.message : err}`;
		}
	}

	/** Once a frame at most: printing is fast, rendering the paper is not. */
	function ttyFlush() {
		if (!ttyDirty) return;
		ttyDirty = false;
		// Follow the output only if the reader has not scrolled up to read something.
		const atBottom = !ttyEl || ttyEl.scrollHeight - ttyEl.scrollTop - ttyEl.clientHeight < 24;
		ttyPaper = [...ttyLines];
		ttyCaret = ttyCol;
		if (ttyEl && atBottom) requestAnimationFrame(() => ttyEl && (ttyEl.scrollTop = ttyEl.scrollHeight));
	}

	function ttyCode(e) {
		if (e.metaKey || e.altKey) return -1;
		if (e.key === 'Enter') return 0o15;
		if (e.key === 'Backspace' || e.key === 'Delete') return 0o177;
		if (e.key === 'Escape') return 0o33;
		if (e.ctrlKey) return /^[a-z@[\\\]^_]$/i.test(e.key) ? e.key.toUpperCase().charCodeAt(0) & 0o37 : -1;
		if (e.key.length !== 1) return -1;
		return charCode(e.key);
	}

	/** A printable character as this program's keyboard sends it: upper case on a KSR-33, lower for UNIX. */
	function charCode(ch) {
		if (ch === '\n') return 0o15;
		const c = (ttyCfg.upcase ? ch.toUpperCase() : ch).charCodeAt(0);
		return c >= 0o40 && c < (ttyCfg.upcase ? 0o140 : 0o177) ? c : -1;
	}

	/** One key to the machine. The program may map what is sent and what the paper shows. */
	function ttySend(c) {
		const k = program?.ttyKey?.(c) ?? { send: c | 0o200, echo: c };
		tty.type(k.send);
		// A bare CR, as the KSR-33 prints it: SYMELEC sends the LF after a line.
		if (ttyLocal && k.echo !== null) {
			ttyPrint(k.echo);
			ttyHear(k.echo, true);
		}
	}

	function ttyType(codes) {
		if (!tty || player || !codes.length) return;
		for (const c of codes) ttySend(c);
		ttyFlush();
		ttyWaiting = tty.waiting;
		if (!recorder) return;
		ttyRecCodes = ttyRecAt === box.cycles ? [...ttyRecCodes, ...codes] : codes;
		ttyRecAt = box.cycles;
		recorder.record(box.cycles, 'tty', ...ttyRecCodes);
	}

	/** A demo's operator at the keyboard: the paper shows what it types, as it shows yours. */
	function demoType(text) {
		for (const ch of text) {
			const c = charCode(ch);
			if (c >= 0) ttySend(c);
		}
	}

	function onTtyKey(e) {
		// Copy wins over ^C when something on the paper is selected; ^V is always paste.
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && String(globalThis.getSelection?.() ?? '')) return;
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') return;
		const name = e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1 ? `Ctrl-${e.key.toUpperCase()}` : e.key;
		const bound = ttyCfg.bindings[name];
		if (bound) {
			e.preventDefault();
			e.stopPropagation();
			if (bound === 'stop') paused = true;
			else if (bound === 'go') paused = false;
			else if (typeof bound.send === 'number') ttyType([bound.send]);
			return;
		}
		const c = ttyCode(e);
		if (c < 0) return;
		e.preventDefault();
		e.stopPropagation();
		if (ttyCfg.input === 'line') lineKey(c);
		else ttyType([c]);
	}

	/** Line input: edit here, with Backspace and ^U, and send the whole line on Return. */
	function lineKey(c) {
		if (c === 0o15) {
			const codes = [...ttyLine].map((ch) => charCode(ch)).filter((k) => k >= 0);
			ttyLine = '';
			ttyType([...codes, 0o15]);
		} else if (c === 0o177 || c === 0o10) ttyLine = ttyLine.slice(0, -1);
		else if (c === 0o25) ttyLine = '';
		else if (c >= 0o40) ttyLine += String.fromCharCode(c);
		else ttyType([c]);
	}

	function onTtyPaste(e) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text') ?? '';
		const codes = [];
		for (const ch of text.replace(/\r\n?/g, '\n')) {
			const c = charCode(ch);
			if (c >= 0) codes.push(c);
		}
		if (ttyCfg.input === 'line') {
			for (const c of codes) lineKey(c);
			// A pasted number in a number game goes in at once, as if Return followed it.
			if (ttyCfg.autoEnter && ttyLine.trim()) sendSpoken(ttyLine);
		} else ttyType(codes);
	}

	/** How many characters fit across the paper, for programs that want to know (a SIGWINCH). */
	function measureTty() {
		if (!ttyEl) return;
		const probe = document.createElement('span');
		probe.textContent = '0'.repeat(100);
		probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
		ttyEl.appendChild(probe);
		const ch = probe.getBoundingClientRect().width / 100;
		probe.remove();
		const style = getComputedStyle(ttyEl);
		const inner = ttyEl.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
		const cols = ch > 0 ? Math.floor(inner / ch) : 0;
		if (cols > 0 && cols !== ttyCols) {
			ttyCols = cols;
			if (cpu) program?.onTtyResize?.({ cpu, cols });
		}
	}

	$effect(() => {
		if (!ttyEl) return;
		const ro = new ResizeObserver(() => measureTty());
		ro.observe(ttyEl);
		return () => ro.disconnect();
	});
	$effect(() => {
		void ttyFont;
		void ttyCfg.wrap;
		untrack(() => requestAnimationFrame(() => measureTty()));
	});

	/** The bar under the paper: drag it to set the height, down to one line. Arrows move a line. */
	function ttyLinePx() {
		return TTY_FONTS[ttyFont] * 16 * 1.3;
	}
	function setTtyHeight(px) {
		const pad = 8;
		ttyHeight = Math.round(Math.max(ttyLinePx() + pad, Math.min(2000, px)));
		store(TTY_HEIGHT_KEY, ttyHeight);
	}
	function onTtyGrip(e) {
		e.preventDefault();
		const start = e.clientY;
		const from = (ttyEl?.getBoundingClientRect().height ?? 0) - ttyExtra;
		const grip = e.currentTarget;
		grip.setPointerCapture(e.pointerId);
		const move = (m) => setTtyHeight(from + m.clientY - start);
		const up = () => {
			grip.removeEventListener('pointermove', move);
			grip.removeEventListener('pointerup', up);
			grip.removeEventListener('pointercancel', up);
		};
		grip.addEventListener('pointermove', move);
		grip.addEventListener('pointerup', up);
		grip.addEventListener('pointercancel', up);
	}
	function onTtyGripKey(e) {
		const h = (ttyEl?.getBoundingClientRect().height ?? 0) - ttyExtra;
		if (e.key === 'ArrowUp') setTtyHeight(h - ttyLinePx());
		else if (e.key === 'ArrowDown') setTtyHeight(h + ttyLinePx());
		else return;
		e.preventDefault();
	}

	$effect(() => {
		if (ttyOpen) untrack(() => {
			ttyUnread = 0;
			ttyDirty = true;
			ttyFlush();
		});
	});

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
		if (v === 'octal') memBase -= memBase % MEM_COLS;
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

	// Height the figure has past its content goes to the growing panel. contentHeight() takes
	// its extra back out, so the size settles instead of feeding itself.
	function fitGrow() {
		const spare = figHeight ? Math.max(0, Math.floor(figHeight - contentHeight())) : 0;
		const line = memEl?.querySelector('.mem-line')?.offsetHeight;
		const lines = growId === 'mem' && line ? MEM_MIN_LINES + Math.floor(spare / line) : MEM_MIN_LINES;
		const rings = growId === 'rings' ? spare : 0;
		const tty = growId === 'tty' ? spare : 0;
		if (rings !== ringsExtra) ringsExtra = rings;
		if (tty !== ttyExtra) ttyExtra = tty;
		if (lines !== MEM_LINES) {
			MEM_LINES = lines;
			refreshMem();
		}
	}
	$effect(() => {
		void [figHeight, memOpen, memEl, MEM_COLS, growId];
		untrack(fitGrow);
		tick().then(() => untrack(fitGrow));
	});
	$effect(() => {
		if (!captionEl) return;
		const ro = new ResizeObserver(() => untrack(fitGrow));
		ro.observe(captionEl);
		return () => ro.disconnect();
	});

	$effect(() => {
		const el = memEl;
		if (!el) return;
		el.addEventListener('wheel', onMemWheel, { passive: false });
		return () => el.removeEventListener('wheel', onMemWheel);
	});

	// A mouse is not a light pen. SYMELEC takes a lightbutton left under the pen for
	// about 250 ms as a second tap: S opens an element, then the F now under the pen
	// closes it. So a press that has not moved sees for PEN_TAP_CYCLES of machine time
	// and then goes blind until it moves, and a click shorter than PEN_MIN_CYCLES is
	// held that long, so it cannot fall between frames or be lost at a slow speed.
	const PEN_MIN_CYCLES = 20_000;
	const PEN_TAP_CYCLES = 100_000;
	const PEN_MOVE_PX = 4;
	let press = null;

	function penDeadline() {
		if (!press || !pen) return Infinity;
		if (press.lifted) return press.at + PEN_MIN_CYCLES;
		if (!press.moved && pen.enabled) return press.at + PEN_TAP_CYCLES;
		return Infinity;
	}

	function penRules() {
		if (!press || !pen) return;
		const held = box.cycles - press.at;
		if (press.lifted) {
			if (held < PEN_MIN_CYCLES) return;
			pen.enabled = false;
			press = null;
			recordPen();
		} else if (!press.moved && pen.enabled && held >= PEN_TAP_CYCLES) {
			pen.enabled = false;
			recordPen();
		}
	}

	/** Run the machine, stopping at each pen deadline so a tap is the same length at every speed. */
	function runMachine(cycles) {
		let left = cycles;
		while (left > 0) {
			const n = Math.max(1, Math.min(left, penDeadline() - box.cycles));
			box.run(n);
			left -= n;
			penRules();
		}
	}

	/** One instruction; a demo or replay still gets its events at their cycles. */
	function traceStep() {
		if (!player) {
			box.step();
			penRules();
			return;
		}
		player.advance((n) => box.run(n), 1);
		demoCaption = player.caption;
		switches = cpu.switches;
		if (player.done) stopDemo();
	}

	function setSpeed(s) {
		speed = s;
		traceMs = 0;
	}

	function setTrace(ms) {
		if (traceMs === ms) return;
		traceMs = ms;
		traceOwed = ms;
	}

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
		if (traceMs) {
			try {
				traceOwed = Math.min(traceOwed + dt, 4 * traceMs);
				let stepped = false;
				while (traceOwed >= traceMs) {
					traceOwed -= traceMs;
					traceStep();
					stepped = true;
				}
				if (stepped) {
					halted = cpu.halted;
					noteHalt();
					refreshMem();
					refreshRegs();
					if (memOpen && memView !== 'trace' && !pcInView()) showPc();
				}
				drawFrame();
				updateReadout(now);
				fault = null;
			} catch (e) {
				fault = e instanceof Error ? e.message : String(e);
				console.error('cabinet', e);
			}
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
					runMachine(cycles);
				}
				noteHalt();
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
		if (editOn) return editDown(event);
		rest = null;
		notePenAt(event);
		penHeld = true;
		try {
			canvasEl.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic or already-released pointers cannot be captured; tracking still works.
		}
		pressedId = event.pointerId;
		press = { at: box.cycles, x: event.clientX, y: event.clientY, moved: false, lifted: false };
		pen.aperture = penAperture(event);
		const { x, y } = gridFromEvent(event);
		pen.point(x, y);
		pen.enabled = true;
		recordPen();
	}

	function onPointerMove(event) {
		if (editOn && t340) return editMove(event);
		onHoverMove(event);
		if (!pen || event.pointerId !== pressedId) return;
		notePenAt(event);
		pen.aperture = penAperture(event);
		const { x, y } = gridFromEvent(event);
		pen.point(x, y);
		if (press && !press.moved && Math.hypot(event.clientX - press.x, event.clientY - press.y) > PEN_MOVE_PX) {
			press.moved = true;
			pen.enabled = true;
		}
		recordPen();
	}

	function onPointerUp(event) {
		if (editOn) return editUp(event);
		if (event.pointerId !== pressedId) return;
		pressedId = null;
		penHeld = false;
		if (pen && press && box.cycles - press.at < PEN_MIN_CYCLES) press.lifted = true;
		else if (pen) {
			press = null;
			pen.enabled = false;
			recordPen();
		}
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
		cpu = new Pdp7({ coreWords: program.coreWords ?? 8192 });
		cpu.trace = trace = new Trace();
		traceBack = 0;
		pen = new LightPen({ aperture: 12, name: 'pointer', index: tool === 'edit' ? 0 : tool, enabled: false });
		press = null;
		t340 = new Type340({
			fetch: (a) => cpu.read(a),
			store: (a, w) => cpu.write(a, w),
			pens: [pen],
			onFrame: collectFrame
		});
		const extra = program.peripherals?.({ cpu }) ?? [];
		ttyReset();
		ttyRecAt = -1;
		tty = new Teletype({
			printCycles: 1000,
			onPrint: (c) => {
				ttyPrint(c);
				ttyHear(c);
			}
		});
		clock = new Clock({ cpu });
		box = new Cabinet({
			cpu,
			devices: [t340, tty, clock, new TinyTitan(), ...extra]
		});
		t340.clock = () => box.cycles;
		batch = [];
		program.boot({ cpu, box, extra, patches: spec.patches ?? undefined });
		if (ttyCols) program.onTtyResize?.({ cpu, cols: ttyCols });
		symbols = program.symbols?.() ?? [];
		monitor = new Monitor({
			memory: cpu,
			symbols,
			size: 8192,
			onPoke: (addr, words) => recorder?.record(box.cycles, 'poke', addr, ...words)
		});
		// Inspector handle: $0.cabinet in devtools reaches the live machine; .monitor.poke('fuel', 777).
		canvasEl.cabinet = { cpu, t340, pen, box, monitor, program: programId };
		switches = cpu.switches;
		// An assembled program has no source until its first boot has assembled it.
		if (sourceFor === programId && !sourceMap) {
			sourceFor = null;
			if (memOpen && (memView === 'code' || memView === 'source')) loadSource();
		}
		// A teletype-only program has no picture to wait for.
		for (let i = 0; program.display !== false && i < 30 && !t340.lastFrame; i += 1) {
			box.run(bootChunk);
			if (cpu.halted) break;
		}
		if (program.display !== false && !t340.lastFrame && t340.segments.length < 100) {
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
			: program.demo?.({ cpu, pen, type: demoType });
		if (!script) return;
		player = new DemoPlayer(script);
		demoCaption = '';
		demoOn = true;
		playOpen = true;
	}

	// What a session can drive. Kinds without a handler are skipped.
	function replayHandlers() {
		return {
			sw: (v) => (cpu.switches = Number(v)),
			tty: (...codes) => {
				for (const c of codes) ttySend(Number(c));
			},
			pen: (x, y, down, aperture) => {
				if (aperture) pen.aperture = Number(aperture);
				pen.point(Number(x), Number(y));
				pen.enabled = !!down;
			},
			poke: (addr, ...words) => monitor?.poke(Number(addr), words.map(Number)),
			go: (pc) => {
				cpu.halted = false;
				cpu.pc = Number(pc);
				clearHalt();
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
		clearHalt();
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
		ttyCfg = ttyConfigFor(next);
		ringsCfg = ringsConfigFor(next);
		memView = memViewFor(next);
		memFollow = true;
		memShownBase = -1;
		ttyLine = '';
		session = loadSession(next.id);
		scores = loadScores(next.id);
		haltAuto = localStorage.getItem(`cabinet-halt-auto-${next.id}`) === 'on';
		displayOpen = next.display !== false;
		if (next.tty && !ttyOpen) togglePanel('tty', {});
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
			const pre = figureEl?.querySelector('.err');
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
{#snippet overlay(inline)}
	<div class="overlay" class:inline class:failed={!!error} aria-live="polite">
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
{/snippet}
{#snippet toolMenu()}
	{@const color = editOn ? '#ffd27a' : PEN_COLORS[tool]}
	<span class="tool-menu" bind:this={toolMenuEl}>
		<button
			type="button"
			class="tool-button"
			style:--pen={color}
			aria-haspopup="menu"
			aria-expanded={toolMenuOpen}
			aria-label={editOn ? 'Tool: edit 340 instructions' : `Tool: light pen ${tool + 1}, ${penDown ? 'down' : 'up'}`}
			title={editOn
				? 'Editing 340 instructions in core. Click to choose a light pen or the display.'
				: `Light pen ${tool + 1}, ${penDown ? 'on the glass' : 'lifted'}. Click to choose a pen, the editor, or the display.`}
			onclick={() => (toolMenuOpen = !toolMenuOpen)}
		>
			{#if editOn}<span class="tool-arrow" aria-hidden="true">↖</span>{:else}<span class="hand">✍️</span><span>{penDown ? '⬇️' : '⬆️'}</span>{/if}
		</button>
		{#if toolMenuOpen}
			<span class="tool-pop" role="menu" aria-label="Pointer tool and display">
				<span class="tool-head">Light pen</span>
				<span class="tool-pens">
					{#each PEN_COLORS as c, i (i)}
						<button
							type="button"
							role="menuitemradio"
							class="pen-swatch"
							class:on={tool === i}
							aria-checked={tool === i}
							aria-label="Light pen {i + 1}"
							title="Light pen {i + 1}: the pointer is the program's light pen, in this colour"
							style:--pen={c}
							onclick={() => ((toolMenuOpen = false), setTool(i))}
						></button>
					{/each}
				</span>
				<button
					type="button"
					role="menuitemradio"
					class="tool-item"
					class:on={editOn}
					aria-checked={editOn}
					title="Low-level 340 instruction editor: drag the end of a line and its vector words in core change, live, only as far as those words can reach. The light pen is put away and the program hears nothing. The program may redraw over your edit (PIXIE does when it next recompiles)."
					onclick={() => ((toolMenuOpen = false), setTool('edit'))}><span class="tool-arrow" aria-hidden="true">↖</span> Edit 340 instructions</button
				>
				<span class="tool-head">Display</span>
				{#each [['auto', 'Auto: steady below 1× or stopped'], ['steady', "Steady: core as it is now, every frame"], ['machine', "Machine: the 340's own refreshes, flicker and all"]] as [m, label] (m)}
					<button
						type="button"
						role="menuitemradio"
						class="tool-item"
						class:on={screenMode === m}
						aria-checked={screenMode === m}
						onclick={() => ((toolMenuOpen = false), setScreenMode(m))}>{label}</button
					>
				{/each}
			</span>
		{/if}
	</span>
{/snippet}

{#snippet haltPanel(inline)}
	<div class="halt" class:inline role="status" aria-live="polite">
		<div class="halt-box">
			<div class="halt-title">{haltInfo.title}</div>
			{#if haltInfo.text}<div class="halt-text">{haltInfo.text}</div>{/if}
			<div class="halt-machine">HLT at {haltInfo.at}{haltInfo.restart !== undefined ? `, read from core; the program is unchanged` : ''}</div>
			{#if program?.halt?.scores && Object.keys(scores).length}
				<div class="halt-score">
					{#each Object.entries(program.halt.scores) as [key, name] (key)}<span>{name} {scores[key] ?? 0}</span>{/each}
					<button type="button" class="link" title="Forget the tally kept in this browser" onclick={onClearScores}>clear</button>
				</div>
			{/if}
			<div class="halt-buttons">
				{#if haltInfo.restart !== undefined}
					<button type="button" title="Start at {oct(haltInfo.restart, 4)}, as the operator did" onclick={() => onHaltGo(haltInfo.restart)}>Play again</button>
				{/if}
				<button type="button" title="Lift the halt and run on from {haltInfo.at}" onclick={() => onHaltGo()}>Continue</button>
				<button type="button" title="Reload the program from scratch" onclick={onReset}>Reset</button>
			</div>
			{#if haltInfo.restart !== undefined}
				<label class="halt-auto"><input type="checkbox" checked={haltAuto} onchange={(e) => setHaltAuto(e.currentTarget.checked)} /> Play again by itself</label>
			{/if}
		</div>
	</div>
{/snippet}
{#snippet edgeGrip(edge)}
	<div
		class="edge {edge}"
		class:dragging={edgeDrag?.edge === edge}
		role="slider"
		tabindex="0"
		aria-label={EDGE_LABEL[edge]}
		aria-orientation={edge.endsWith('bottom') ? 'vertical' : 'horizontal'}
		aria-valuemin={MIN_SIDE}
		aria-valuemax={4096}
		aria-valuenow={edge === 'bottom' ? (figHeight ?? side) : edge.startsWith('tube') ? side : figW}
		title={EDGE_TITLE[edge]}
		onpointerdown={(e) => onEdgeDown(e, edge)}
		onpointermove={onEdgeMove}
		onpointerup={onEdgeUp}
		onpointercancel={onEdgeUp}
		ondblclick={() => onEdgeReset(edge)}
		onkeydown={(e) => onEdgeKey(e, edge)}
	></div>
{/snippet}
<figure class="cabinet-applet" data-applet="cabinet" bind:this={figureEl} bind:clientWidth={figW} style:min-height={figHeight ? `${figHeight}px` : null}>
	<!-- The program comes first, so opening or closing the display never moves the menu. -->
	<div class="row menu top">
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
				{#if paused}stopped{:else}<span title="Memory cycles per second">{readout}</span>{/if}{#if !paused && readoutExtra}<span title="Read from the program's variables in core">{readoutExtra}</span>{/if}
			</span>
			{#if displayOpen}{@render toolMenu()}{/if}
		{/if}
	</div>
	<button
		type="button"
		class="row display-bar"
		aria-expanded={displayOpen}
		aria-controls="cabinet-tube"
		title={displayOpen ? 'Close the display' : 'Open the display'}
		data-keep-focus
		onclick={() => (displayOpen = !displayOpen)}
		><span class="caret" aria-hidden="true">{displayOpen ? '▾' : '▸'}</span>PDP-7 / 340 DISPLAY</button
	>
	{#if !displayOpen && status !== 'live'}
		{@render overlay(true)}
	{/if}
	{#if !displayOpen && haltInfo && status === 'live'}
		{@render haltPanel(true)}
	{/if}
	<div class="tube-wrap" id="cabinet-tube" style:width="{side}px" hidden={!displayOpen}>
		<canvas
			bind:this={canvasEl}
			width="1024"
			height="1024"
			class="tube"
			class:live={status === 'live'}
			class:held={penHeld}
			class:editing={editOn}
			class:can-grab={editOn && editHover}
			class:grabbing={editOn && editDragging}
			tabindex="0"
			aria-label="{program?.label ?? 'PDP-7'} display{program?.keyHelp ? `. ${program.keyHelp}` : ''}"
			onkeydown={(e) => onKey(e, true)}
			onkeyup={(e) => onKey(e, false)}
			onblur={releaseKeys}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
			onpointerleave={onHoverLeave}
		></canvas>
		{#if tip}
			<div
				class="tip"
				bind:this={tipEl}
				class:gone={tip.gone}
				role="tooltip"
			>
				{#if tip.hint}
					<div class="tip-title">{tip.hint.title}</div>
					{#if tip.hint.text}<div class="tip-text">{tip.hint.text}</div>{/if}
				{/if}
				<div class="tip-machine">
					{#each tip.machine as line, i (i)}<div>{line}</div>{/each}
				</div>
				{#if tip.sensor !== null}
					<div class="tip-sensor" class:hit={tip.hit} style:--pen={tip.color}>
						<span class="tip-meter"><span style:width="{Math.round(tip.sensor * 100)}%"></span></span>
						{tip.hit ? 'pen hit' : 'pen sees'}
					</div>
				{/if}
			</div>
		{/if}
		{#if displayOpen && haltInfo && status === 'live'}
			{@render haltPanel(false)}
		{/if}
		{#if displayOpen && status !== 'live'}
			{@render overlay(false)}
		{/if}
		{#each ['tube-left', 'tube-right', 'tube-bottom'] as edge (edge)}
			{@render edgeGrip(edge)}
		{/each}
	</div>
	{@render edgeGrip('bottom')}
	<!-- Fixed order: key help, the strip of tabs, then compartments in tab order. -->
	<figcaption bind:this={captionEl}>
		{#if editOn}
			<div class="row app keys edit-row">
				<p aria-live="polite">↖ {editNote}</p>
				<button
					type="button"
					class="mem-view"
					class:on={editShow}
					aria-pressed={editShow}
					title="Show the words you grab in the memory panel, disassembled beside their source, and watch them change as you drag"
					onclick={toggleEditShow}>show in memory</button
				>
			</div>
		{:else if program?.keyHelp}
			<p class="row app keys">Click the tube, then: {program.keyHelp}</p>
		{/if}
		{#snippet frontPanel()}
		<div class="row panel" role="group" aria-label="PDP-7 console: AC switches, bit 0 on the left">
			{#each { length: 6 } as _, g (g)}
				<span class="sw-group">
					{#each SWITCH_BITS.slice(g * 3, g * 3 + 3) as bit, j (j)}
						{@const i = g * 3 + j}
						{@const label = program?.switchLabels?.[i] ?? ''}
						<button
							type="button"
							class="switch"
							class:on={(switches & bit) !== 0}
							class:named={label !== ''}
							class:dim={!!program?.switchLabels && label === ''}
							aria-pressed={(switches & bit) !== 0}
							title="switch {i}{label ? `: ${label}` : ''}"
							disabled={status !== 'live'}
							onclick={() => onSwitch(bit)}>{i}</button
						>
					{/each}
				</span>
			{/each}
			<span class="octal" title="AC switches, octal">{switches.toString(8).padStart(6, '0')}</span>
		</div>
		{/snippet}
		{#snippet playRow()}
		<div class="row app demo-row" role="group" aria-label="Play">
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
		{/snippet}
		<div class="row ctl">
				<span class="chips" role="group" aria-label="Panels. Shift-click shows one alone.">
					<button
						type="button"
						class="chip"
						class:on={playOpen}
						aria-pressed={playOpen}
						title="Play: demos, record and replay. Shift-click: this panel alone."
						onclick={(e) => togglePanel('play', e)}>PLAY{#if demoOn || recording}<span class="chip-lamp" class:hlt={recording} title={recording ? 'Recording' : 'Playing'}>●</span>{/if}</button
					>
					<button
						type="button"
						class="chip"
						class:on={ttyOpen}
						class:bell={ttyBell}
						aria-pressed={ttyOpen}
						title="Teletype: what the program prints, and a keyboard. Shift-click: this panel alone."
						onclick={(e) => togglePanel('tty', e)}>TTY{#if ttyUnread}<span class="chip-count" title="{ttyUnread} new characters">{ttyUnread > 999 ? '999+' : ttyUnread}</span>{/if}</button
					>
					<button
						type="button"
						class="chip"
						class:on={regsOpen}
						aria-pressed={regsOpen}
						title="Registers: the front panel switches, processor, display, device flags. Shift-click: this panel alone."
						onclick={(e) => togglePanel('regs', e)}>REGS{#if halted}<span class="chip-lamp hlt" title="Halted">●</span>{/if}</button
					>
					<button
						type="button"
						class="chip"
						class:on={memOpen}
						aria-pressed={memOpen}
						title="Memory: {CORE / 1024}K × 18-bit words. Shift-click: this panel alone."
						onclick={(e) => togglePanel('mem', e)}>MEMORY</button
					>
					{#if hasRings}
					<button
						type="button"
						class="chip"
						class:on={ringsOpen}
						aria-pressed={ringsOpen}
						title="PIXIE rings in 3D: the live ring structure in core, or a file. Shift-click: this panel alone."
						onclick={(e) => togglePanel('rings', e)}>RINGS</button
					>
					{/if}
					<button
						type="button"
						class="chip"
						class:on={configOpen}
						aria-pressed={configOpen}
						title="Settings for the teletype and more. Each program sets them for you when you choose it. Shift-click: this panel alone."
						onclick={(e) => togglePanel('config', e)}>CONFIG</button
					>
				</span>
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
				<span
					class="rate"
					class:dragging={rateDrag}
					role="slider"
					tabindex="0"
					data-keep-focus
					aria-label="Speed, slowest to fastest"
					aria-valuemin="0"
					aria-valuemax={RATES.length - 1}
					aria-valuenow={rateIndex}
					aria-valuetext={RATES[rateIndex]?.title}
					title="{RATES[rateIndex]?.title}. Drag, or use the arrow keys."
					style:width="{(RATES.length - 1) * RATE_NOTCH + RATE_PUCK}px"
					onpointerdown={onRateDown}
					onpointermove={onRateMove}
					onpointerup={() => (rateDrag = false)}
					onpointercancel={() => (rateDrag = false)}
					onkeydown={onRateKey}
				>
					{#each RATES as r, i (i)}
						<span
							class="rate-notch"
							class:trace={r.trace}
							style:left="{i * RATE_NOTCH + RATE_PUCK / 2}px"
						></span>
					{/each}
					<span
						class="rate-puck"
						class:trace={traceMs}
						style:left="{rateIndex * RATE_NOTCH}px"
						style:width="{RATE_PUCK}px">{RATES[rateIndex]?.label}</span
					>
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
		</div>
		{#if playOpen}
			{@render playRow()}
		{/if}
		{#if ttyOpen}
			{@render ttyRow()}
		{/if}
		{#if regsOpen}
			{@render frontPanel()}
		{/if}
		{#if regsOpen && regs}
			<div class="row app regs" role="group" aria-label="Registers">
				<div class="reg-line">
					<span class="reg-dev">CPU</span>
					<button type="button" class="reg" title="Program counter. Show it in memory." onclick={() => openMemAt(regs.pc)}
						>PC <b>{oct(regs.pc, 5)}</b> <span class="reg-sym">{symbolic(regs.pc)}</span></button
					>
					<button type="button" class="reg" title="Accumulator. Go to the address in its low 13 bits." onclick={() => openMemAt(regs.ac & 0o17777)}
						>AC <b>{oct(regs.ac, 6)}</b></button
					>
					<span class="reg" title="Link">L <b>{regs.link}</b></span>
					<span class="reg" title="EAE multiplier-quotient">MQ <b>{oct(regs.mq, 6)}</b></span>
					<span class="reg" title="EAE step counter">SC <b>{oct(regs.sc, 2)}</b></span>
					<span class="lamp" class:on={regs.ion} title="Interrupts enabled">ION</span>
					<span class="lamp" class:on={regs.irq} title="A device is asking for an interrupt">IRQ</span>
					<span class="lamp red" class:on={regs.halted} title="Halted">HLT</span>
					<span class="reg dim reg-count" title="Memory cycles since boot">{regs.cycles.toLocaleString()}</span>
				</div>
				<div class="reg-line">
					<span class="reg-dev">340</span>
					<button type="button" class="reg" title="Display address counter: the display's own PC. Show it in memory, as octal." onclick={() => openMemAt(regs.dac, 'octal')}
						>DAC <b>{oct(regs.dac, 5)}</b> <span class="reg-sym">{symbolic(regs.dac)}</span></button
					>
					<span class="reg reg-mode" title="Display mode: how the next word is decoded"><b>{regs.mode}</b></span>
					<span class="reg" title="Beam position">X <b>{oct(regs.x, 4)}</b> Y <b>{oct(regs.y, 4)}</b></span>
					<span class="reg" title="Scale and intensity">S <b>{regs.scale}</b> I <b>{regs.intensity}</b></span>
					<span class="lamp" class:on={regs.running} title="The display is cycling through its file">RUN</span>
					<span class="lamp" class:on={regs.lp} title="Light pen enabled">LP</span>
					<span class="lamp" class:on={regs.hit} title="Light pen hit">HIT</span>
					<span class="lamp" class:on={regs.edge} title="The beam ran off the grid">EDGE</span>
					<span class="reg dim" title="Refresh frames drawn">frame <span class="reg-count short">{regs.frame.toLocaleString()}</span></span>
				</div>
				<div class="reg-line">
					<span class="reg-dev">TTY</span>
					<span class="lamp" class:on={regs.kbd} title="A key is waiting for the program">KBD</span>
					<span class="lamp" class:on={regs.tto} title="The printer is done and ready">TTO</span>
					<span class="reg-dev">CLK</span>
					<span class="lamp" class:on={regs.clkOn} title="Clock on">ON</span>
					<span class="lamp" class:on={regs.clkFlag} title="Clock tick waiting">FLAG</span>
				</div>
			</div>
		{/if}
		{#snippet ttyRow()}
			{@const last = ttyPaper[ttyPaper.length - 1] ?? ''}
			<div class="row app tty">
				{#if program?.help}
					<p class="tty-help">
						{program.help.text}
						{#each program.help.links ?? [] as link (link.href)}
							<a href={link.href} target="_blank" rel="noopener">{link.label} ↗</a>
						{/each}
					</p>
				{/if}
				<div
					class="tty-paper"
					class:wrap={ttyCfg.wrap}
					style:font-size="{TTY_FONTS[ttyFont]}rem"
					style:height={ttyHeight || ttyExtra ? `calc(${ttyHeight ? `${ttyHeight}px` : '12em'} + ${ttyExtra}px)` : null}
					bind:this={ttyEl}
					tabindex="0"
					spellcheck="false"
					autocorrect="off"
					autocapitalize="off"
					writingsuggestions="false"
					translate="no"
					data-keep-focus
					role="textbox"
					aria-multiline="true"
					aria-label="Teletype. Click, then type. Return is CR, Backspace is RUBOUT. Select text to copy; paste types it."
					onkeydown={onTtyKey}
					onpaste={onTtyPaste}
				><pre>{ttyPaper.slice(0, -1).map((l) => l + '\n').join('')}{last.slice(0, ttyCaret)}<span class="tty-line-edit">{ttyLine}</span><span class="tty-caret" aria-hidden="true">{ttyLine ? ' ' : (last[ttyCaret] ?? ' ')}</span>{ttyLine ? '' : last.slice(ttyCaret + 1)}</pre></div>
				<button
					type="button"
					class="tty-grip"
					aria-label="Teletype height: drag, or arrow keys a line at a time"
					title="Drag to make the teletype taller or shorter"
					onpointerdown={onTtyGrip}
					onkeydown={onTtyGripKey}
				></button>
				<div class="sr-only" aria-live="polite" aria-atomic="true">{ttyAnnounce}</div>
				<div class="tty-cli-row">
					<input
						class="tty-cli"
						type="text"
						bind:value={ttyLine}
						bind:this={cliEl}
						onkeydown={onCliKey}
						oninput={onCliInput}
						autocomplete="off"
						autocapitalize="off"
						autocorrect="off"
						spellcheck="false"
						writingsuggestions="false"
						translate="no"
						data-keep-focus
						aria-label="Command line: type or dictate, then Return to send it to the {program?.label ?? 'machine'}"
						placeholder={ttyCfg.input === 'line' ? 'Type or dictate a line, then Return' : 'Keys go straight to the machine'}
					/>
					{#if SpeechRecognition}
						<button
							type="button"
							class="chip"
							class:on={listening}
							aria-pressed={listening}
							aria-label={listening ? 'Listening. Speak a line; press to stop' : 'Speak a line to the machine'}
							title="Speak lines until pressed again; each is sent as if typed, with Return"
							onpointerdown={(e) => e.preventDefault()}
							onclick={toggleVoice}>🎤</button
						>
					{/if}
					{#if globalThis.speechSynthesis}
						<button
							type="button"
							class="chip"
							class:on={ttySpeak}
							aria-pressed={ttySpeak}
							aria-label="Read what the machine prints aloud"
							title="Read what the machine prints aloud, for when no screen reader is on"
							onpointerdown={(e) => e.preventDefault()}
							onclick={() => setSpeak(!ttySpeak)}>🔊</button
						>
					{/if}
				</div>
				{#if voiceNote}<p class="mem-hint" role="status">🎤 {voiceNote}</p>{/if}
				<div class="tty-bar">
					<span class="mem-hint"
						>{#if ttyWaiting}{ttyWaiting} {ttyWaiting === 1 ? 'key' : 'keys'} not read yet{paused ? ': the machine is stopped' : traceMs || speed < 0.1 ? ': the machine is running slowly' : ''}.{:else if ttyPaper.length === 1 && !last}Click the paper and type.{/if}</span
					>
				</div>
			</div>
		{/snippet}
		{#if memOpen}
		<div class="row app mem">
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
						}}>{memView === 'trace' ? 'live' : 'follow\u00a0PC'}</button
					>
					{#if memView === 'code'}
						<button
							type="button"
							class="mem-view"
							class:on={explainOn}
							aria-pressed={explainOn}
							title="Say what each word does in plain English; display words are read as the 340 reads them"
							onclick={toggleExplain}>explain</button
						>
					{/if}
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
						<div class="mem-line code" class:pc={at === pcNow} class:focus={at === memFocus} class:edited={editOn && editWords.includes(at)}>
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
								>{differs ? '≠ ' : ''}{src?.text.trim() ?? ''}{#if explainOn}<span class="mem-says">{src?.text.trim() ? ' / ' : '/ '}{says(at, w)}</span>{/if}</span
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
								class:edited={editOn && editWords.includes((at + col) % CORE)}
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
		</div>
		{/if}
		{#if ringsOpen && hasRings}
			<div class="row app">
				<RingView capture={captureRings} name={symbolic} height={260 + ringsExtra} onOpen={(a) => openMemAt(a)} />
			</div>
		{/if}
		{#if configOpen}
			<div class="row app config" role="group" aria-label="Configuration">
				<h4 class="config-head">Display</h4>
				<label class="mem-hint" title="Hover or hold the pen still over something on the tube to see what drew it"
					><input type="checkbox" checked={tipsOn} onchange={(e) => setTips(e.currentTarget.checked)} /> Tooltips on the tube</label
				>
				<label class="mem-hint" title="Draw a dashed box around whatever the pen or pointer is over"
					><input type="checkbox" checked={outlineOn} onchange={(e) => setOutline(e.currentTarget.checked)} /> Outline what the pen is over</label
				>
				<p class="mem-hint">Each program sets the rest for you when you choose it.</p>
				<h4 class="config-head">Teletype</h4>
				<div class="tty-cfg">
					{#each [['duplex', 'Duplex', [['half', 'HALF'], ['full', 'FULL']], 'Half: the paper prints each key as typed. Full: only what the program echoes.'], ['input', 'Input', [['raw', 'RAW'], ['line', 'LINE']], 'Line: edit here with Backspace and ^U, Return sends the line.'], ['wrap', 'Long lines', [[false, 'SCROLL'], [true, 'WRAP']], ''], ['upcase', 'Case', [[true, 'UPPER'], [false, 'AS TYPED']], 'Upper: typed, pasted and spoken text goes in upper case, as on a KSR-33.']] as [key, label, choices, hint]}
						<span class="tty-cfg-label">{label}</span>
						<span class="tty-cfg-row">
							{#each choices as [value, text]}
								<button type="button" class="chip" class:on={ttyCfg[key] === value} aria-pressed={ttyCfg[key] === value} title={hint} onclick={() => (ttyCfg[key] = value)}>{text}</button>
							{/each}
						</span>
					{/each}
					<span class="tty-cfg-label">Speak</span>
					<span class="tty-cfg-row">
						{#each [[false, 'OFF'], [true, 'ON']] as [value, text]}
							<button type="button" class="chip" class:on={ttySpeak === value} aria-pressed={ttySpeak === value} title="Read what the machine prints aloud, for when no screen reader is on" onclick={() => setSpeak(value)}>{text}</button>
						{/each}
					</span>
					<span class="tty-cfg-label">Type</span>
					<span class="tty-cfg-row">
						{#each Object.keys(TTY_FONTS) as f}
							<button
								type="button"
								class="chip"
								class:on={ttyFont === f}
								aria-pressed={ttyFont === f}
								onclick={() => {
									ttyFont = f;
									store(TTY_FONT_KEY, f);
								}}>{f.toUpperCase()}</button
							>
						{/each}
						<span class="mem-hint">{ttyCols ? `${ttyCols} columns` : ''}{ttyCols && program?.onTtyResize ? `, told to ${program.label}` : ''}</span>
					</span>
					<span class="tty-cfg-label">Keys</span>
					<span class="tty-cfg-row mem-hint"
						>{Object.entries(ttyCfg.bindings)
							.map(([k, v]) => `${k.replace('Ctrl-', '^')} ${typeof v === 'string' ? v : `sends ${v.label ?? oct(v.send, 3)}`}`)
							.join(' · ')}</span
					>
				</div>
				<h4 class="config-head">Rings</h4>
				<div class="tty-cfg">
					{#each [['beg', 'Start', 'The cell holding the first word of the ring area'], ['end', 'End', 'The cell holding the word after the last'], ['roots', 'Roots', 'Cells holding ring names to start from, separated by spaces']] as [key, label, hint]}
						<span class="tty-cfg-label">{label}</span>
						<span class="tty-cfg-row"><input type="text" class="rings-cfg" title={hint} placeholder="label or octal" spellcheck="false" bind:value={ringsCfg[key]} /></span>
					{/each}
				</div>
			</div>
		{/if}
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
	.edge.tube-left,
	.edge.tube-right {
		top: 0;
		bottom: 0;
		width: 6px;
		cursor: ew-resize;
		z-index: 3;
	}
	.edge.tube-left {
		left: -3px;
	}
	.edge.tube-right {
		right: -3px;
	}
	.edge.tube-bottom {
		left: 0;
		right: 0;
		bottom: -3px;
		height: 6px;
		cursor: ns-resize;
		z-index: 3;
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
		width: 100%;
		margin: 0.4rem 0;
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
	.tube-wrap[hidden] {
		display: none;
	}
	.row.menu.top {
		border-top: none;
		font-size: 0.75rem;
	}
	.row.display-bar {
		box-sizing: border-box;
		width: 100%;
		min-height: 0;
		padding: 0.1rem 0.5rem;
		gap: 0.35rem;
		font: inherit;
		font-family: ui-monospace, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.08em;
		color: #6fae70;
		background: #0a120a;
		border: none;
		border-top: 1px solid #333;
		border-bottom: 1px solid #333;
		border-radius: 0;
		cursor: pointer;
		text-align: left;
	}
	.row.display-bar:hover,
	.row.display-bar:focus-visible {
		color: #9fe8a0;
		outline: none;
	}
	.display-bar .caret {
		width: 0.8em;
	}
	.overlay.inline {
		position: static;
		padding: 0.4rem 0.5rem;
		place-items: start;
		background: none;
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
		/* Pen off the glass: a ring the size of its view. On the glass: a dot, out of the way. */
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='7' fill='none' stroke='%23000' stroke-width='3' opacity='.5'/%3E%3Ccircle cx='12' cy='12' r='7' fill='none' stroke='%23ffd27a' stroke-width='1.3'/%3E%3C/svg%3E")
				12 12,
			crosshair;
	}
	/* On the glass the canvas draws the pen: a ring lit by what it sees. */
	.tube.live.held {
		cursor: none;
	}
	/* Sharp, never a hand: the tip is the point, and nothing covers what it points at. */
	.tube.live.editing {
		cursor: crosshair;
	}
	.tube.live.editing.can-grab,
	.tube.live.editing.grabbing {
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='M1 1 L1 12 L4 9 L7 15 L9 14 L6 8 L11 8 Z' fill='%23ffd27a' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")
				1 1,
			default;
	}
	/* Fixed, so a tip past the page's edge never adds a scrollbar that resizes the tube. */
	.tip {
		position: fixed;
		z-index: 3;
		width: max-content;
		max-width: 380px;
		padding: 0.35rem 0.5rem;
		pointer-events: none;
		font: 0.7rem/1.35 ui-monospace, monospace;
		/* The cursor ring's amber, not phosphor green: this is the modern overlay, not PIXIE. */
		color: #ffd27a;
		background: rgb(22 14 2 / 0.94);
		border: 1px solid #8a6424;
		border-radius: 6px;
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.5);
		animation: tip-pop 70ms ease-out;
	}
	.tip.gone {
		opacity: 0;
		transition: opacity 150ms ease-out;
	}
	@keyframes tip-pop {
		from {
			scale: 0.9;
		}
	}
	/* The caption's tail, long enough to reach past the item's outline back to the pen. */
	.tip::before {
		content: '';
		position: absolute;
		left: calc(var(--arrow, 14px) - 6px);
		top: -44px;
		width: 12px;
		height: 44px;
		background: #8a6424;
		clip-path: polygon(50% 0, 100% 100%, 0 100%);
	}
	.tip.up::before {
		top: auto;
		bottom: -44px;
		clip-path: polygon(0 0, 100% 0, 50% 100%);
	}
	.tip-sensor {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.25rem;
		color: #c9a15a;
	}
	.tip-sensor.hit {
		color: #fff4d0;
	}
	.tip-meter {
		width: 5rem;
		height: 0.4rem;
		border: 1px solid var(--pen, #8a6424);
		border-radius: 2px;
		overflow: hidden;
	}
	.tip-meter > span {
		display: block;
		height: 100%;
		background: var(--pen, #ffd27a);
	}
	.tip-title {
		color: #ffd27a;
		font-weight: 600;
	}
	.tip-text {
		margin: 0.1rem 0 0.3rem;
		color: #fff0cc;
		font-family: system-ui, sans-serif;
		font-size: 0.75rem;
	}
	.tip-machine {
		color: #c9a15a;
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
	.halt {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 12%;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}
	.halt.inline {
		position: static;
		padding: 0.4rem 0;
	}
	.halt-box {
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		padding: 0.6rem 1rem;
		max-width: 80%;
		background: rgba(0, 0, 0, 0.82);
		border: 1px solid #c9a15a;
		border-radius: 6px;
		color: #9fe8a0;
		font-size: 0.8rem;
		text-align: center;
	}
	.halt-title {
		color: #ffd27a;
		font-size: 1.1rem;
		font-weight: bold;
	}
	.halt-machine {
		color: #c9a15a;
		font-family: ui-monospace, monospace;
		font-size: 0.7rem;
	}
	.halt-score {
		display: flex;
		gap: 0.8rem;
		font-family: ui-monospace, monospace;
	}
	.halt-buttons {
		display: flex;
		gap: 0.4rem;
	}
	.halt-auto {
		font-size: 0.7rem;
	}
	.halt .link {
		background: none;
		border: none;
		padding: 0;
		color: #c9a15a;
		text-decoration: underline;
		cursor: pointer;
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
	/* Wraps between octal digits, never inside one. */
	.row.panel {
		flex-wrap: wrap;
		gap: 2px 0.3rem;
		font-family: ui-monospace, monospace;
	}
	.sw-group {
		display: flex;
		gap: 2px;
	}
	.row.menu {
		flex-wrap: wrap;
	}
	.row.app {
		display: block;
		min-height: 0;
	}
	/* One box for every icon button, whatever the emoji's own metrics. */
	.icon {
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
	.icon.on {
		background: #6b5420;
		outline: 1px solid #ffd27a;
	}
	.tool-menu {
		position: relative;
		display: inline-flex;
		margin-left: 0.4rem;
	}
	.tool-button {
		display: inline-flex;
		align-items: center;
		padding: 0 0.2rem;
		line-height: 1;
		background: none;
		border: 2px solid var(--pen);
		border-radius: 6px;
		cursor: pointer;
	}
	.tool-button .hand {
		font-size: 1.6em;
		margin-right: -0.12em;
	}
	.tool-arrow {
		color: #ffd27a;
		font-size: 1.3em;
		font-weight: bold;
	}
	.tool-pop {
		position: absolute;
		right: 0;
		top: calc(100% + 4px);
		z-index: 4;
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 15rem;
		padding: 0.4rem;
		background: rgb(22 14 2 / 0.96);
		border: 1px solid #8a6424;
		border-radius: 6px;
	}
	.tool-head {
		color: #c9a15a;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.tool-pens {
		display: flex;
		gap: 4px;
	}
	.tool-item {
		text-align: left;
		font-size: 0.75rem;
	}
	.tool-item.on {
		outline: 1px solid #ffd27a;
	}
	.pen-swatch {
		width: 1.3rem;
		height: 1.3rem;
		padding: 0;
		border: 1px solid #000;
		border-radius: 2px;
		background: var(--pen);
		opacity: 0.45;
		cursor: pointer;
	}
	.pen-swatch.on {
		opacity: 1;
		outline: 2px solid #fff;
		outline-offset: 1px;
	}
	.row.demo-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
	}
	.demo-row .demo {
		height: 1.4rem;
		padding: 0 0.4em;
		flex-shrink: 0;
	}
	/* Its own line, two lines tall, only while a demo runs or a recording is made. */
	.demo-row .demo-caption {
		flex: 1 0 100%;
		min-height: 2.6em;
		line-height: 1.3;
		white-space: normal;
	}
	/* A notched slot; the puck snaps from notch to notch and shows only its own label. */
	.rate {
		position: relative;
		flex-shrink: 0;
		height: 1.4rem;
		cursor: ew-resize;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}
	/* The pointer would sit on the label it is choosing: shrink it to a dot. */
	.rate.dragging {
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23f33'/%3E%3C/svg%3E") 2 2,
			none;
	}
	.rate::before {
		content: '';
		position: absolute;
		left: 20px;
		right: 20px;
		top: 50%;
		border-top: 1px solid #555;
	}
	.rate-notch {
		position: absolute;
		top: 30%;
		height: 40%;
		border-left: 1px solid #9fe8a0;
	}
	.rate-notch.trace {
		border-left-color: #e8c89f;
	}
	.rate-puck {
		position: absolute;
		top: 0;
		bottom: 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: ui-monospace, monospace;
		font-size: 0.62rem;
		background: #9fe8a0;
		color: #000;
		border-radius: 2px;
	}
	.rate-puck.trace {
		background: #e8c89f;
	}
	.rate:focus-visible {
		outline: 1px solid #9fe8a0;
		outline-offset: 2px;
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
	}
	.switch.dim {
		border-color: #3a5a3a;
		opacity: 0.55;
	}
	.switch.on {
		background: #9fe8a0;
		color: #000;
	}
	.keys {
		font-size: 0.68rem;
		opacity: 0.8;
	}
	.edit-row {
		display: flex;
		align-items: center;
		gap: 0.6em;
	}
	.edit-row p {
		margin: 0;
		flex: 1;
	}
	.edit-row .mem-view {
		font: inherit;
		background: #000;
		color: inherit;
		border: 1px solid #555;
		padding: 0 0.4em;
		white-space: nowrap;
		cursor: pointer;
	}
	.edit-row .mem-view.on {
		background: #ffd27a;
		color: #000;
	}
	.mem-says {
		opacity: 0.65;
		font-style: italic;
	}
	.mem-line.edited,
	.mem-word.edited {
		box-shadow: inset 3px 0 0 #ffd27a;
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
		display: inline-flex;
		align-items: center;
		gap: 0.6em;
	}
	.row.mem {
		font-family: ui-monospace, monospace;
		font-size: 0.68rem;
		line-height: 1.25;
		padding-top: 0.2rem;
		padding-bottom: 0.2rem;
	}
	.row.ctl {
		flex-wrap: wrap;
		gap: 0.35rem;
		font-family: ui-monospace, monospace;
	}
	.row.ctl .buttons {
		margin-left: auto;
	}
	.chips {
		display: flex;
		flex-shrink: 0;
		gap: 2px;
	}
	.chip {
		height: 1.4rem;
		padding: 0 0.4em;
		white-space: nowrap;
		border-color: #555;
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
	}
	.chip.on {
		background: #9fe8a0;
		color: #000;
		border-color: #9fe8a0;
	}
	.chip.bell {
		background: #ffe680;
		color: #000;
	}
	.chip-lamp.hlt {
		color: #f55;
	}
	.chip-count {
		font-size: 0.85em;
		padding: 0 0.3em;
		border-radius: 0.6em;
		background: #ffe680;
		color: #000;
	}
	.row.regs {
		font-family: ui-monospace, monospace;
		font-size: 0.66rem;
		line-height: 1.5;
	}
	.reg-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 0.9ch;
	}
	.reg-dev {
		width: 3ch;
		opacity: 0.45;
	}
	.reg-dev:not(:first-child) {
		margin-left: 1ch;
	}
	.reg {
		white-space: nowrap;
		opacity: 0.85;
	}
	.reg b {
		font-weight: normal;
		color: #d8ffd8;
	}
	.reg.dim {
		opacity: 0.45;
	}
	/* Fixed widths for every field whose text changes, so a line always wraps in the same place. */
	.reg-sym,
	.reg-mode,
	.reg-count {
		display: inline-block;
		vertical-align: bottom;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.reg-sym {
		width: 10ch;
	}
	.reg-mode {
		width: 6ch;
	}
	.reg-count {
		width: 13ch;
		text-align: right;
	}
	.reg-count.short {
		width: 9ch;
		text-align: left;
	}
	button.reg {
		all: unset;
		cursor: pointer;
		white-space: nowrap;
		opacity: 0.85;
		text-decoration: underline dotted;
		text-underline-offset: 2px;
	}
	.lamp {
		padding: 0 0.35ch;
		border: 1px solid #3a5a3a;
		opacity: 0.4;
	}
	.lamp.on {
		opacity: 1;
		background: #9fe8a0;
		color: #000;
		border-color: #9fe8a0;
	}
	.lamp.red.on {
		background: #f55;
		border-color: #f55;
	}
	.tty-paper {
		margin: 0;
		height: 12em;
		overflow: auto;
		box-sizing: border-box;
		padding: 0.2rem 0.4rem;
		font-family: ui-monospace, monospace;
		font-size: 0.8rem;
		line-height: 1.3;
		user-select: text;
		background: #0c0c08;
		color: #e8e0c0;
		border: 1px solid #333;
		cursor: text;
	}
	.tty-paper pre {
		margin: 0;
		font: inherit;
		white-space: pre;
	}
	.tty-paper.wrap pre {
		white-space: pre-wrap;
		overflow-wrap: break-word;
	}
	.tty-line-edit {
		text-decoration: underline dotted #9fe8a0;
	}
	.tty-grip {
		display: block;
		width: 100%;
		height: 9px;
		padding: 0;
		cursor: ns-resize;
		touch-action: none;
		background: repeating-linear-gradient(90deg, #444 0 6px, transparent 6px 10px) center / 40px 3px no-repeat, #1a1a14;
		border: 1px solid #333;
		border-top: 0;
	}
	.tty-grip:focus-visible {
		outline: 1px solid #9fe8a0;
	}
	.tty-cli-row {
		display: flex;
		gap: 2px;
		margin-top: 2px;
	}
	.tty-cli {
		flex: 1;
		min-width: 0;
		font-family: ui-monospace, monospace;
		font-size: 0.8rem;
		padding: 0.15rem 0.4rem;
		background: #0c0c08;
		color: #e8e0c0;
		border: 1px solid #333;
	}
	.tty-cli:focus {
		outline: 1px solid #9fe8a0;
	}
	.tty-help {
		margin: 0 0 3px;
		font-size: 0.72rem;
		line-height: 1.35;
	}
	.tty-help a {
		margin-left: 0.4em;
		white-space: nowrap;
	}
	.config-head {
		margin: 0.3rem 0 0.2rem;
		font-size: 0.75rem;
	}
	.tty-cfg {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 3px 8px;
		align-items: center;
		margin-top: 4px;
		font-size: 0.7rem;
	}
	.rings-cfg {
		font: inherit;
		font-family: ui-monospace, monospace;
		width: 14em;
	}
	.tty-cfg-row {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		align-items: center;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.tty-bar {
		display: flex;
		align-items: center;
		margin-top: 2px;
	}
	.tty-paper:focus {
		outline: 1px solid #9fe8a0;
	}
	.tty-caret {
		background: #555;
	}
	.tty-paper:focus .tty-caret {
		background: #e8e0c0;
		color: #0c0c08;
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
	/* A blank source line is still a line; without the floor it collapses and the view shrinks. */
	.mem-line {
		display: flex;
		gap: 0.6ch;
		min-height: 1.25em;
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
		white-space: nowrap;
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
	/* One size for every text button; .icon sizes emoji, which is not text. */
	button {
		font: inherit;
		font-size: 0.62rem;
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
