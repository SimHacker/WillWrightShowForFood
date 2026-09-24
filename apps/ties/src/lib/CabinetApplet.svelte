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
		printScreen
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
	const side = $derived(fitSide ?? size);

	// The tube stays square and, with its caption, fits the scrolling pane it sits in, so
	// the controls under it are never below the fold. The title line above may scroll away.
	const TITLE_ALLOWANCE = 12;
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
		const height = scroller.clientHeight - (captionEl?.offsetHeight ?? 56) - TITLE_ALLOWANCE;
		fitSide = Math.floor(Math.max(MIN_SIDE, Math.min(size, width, height)));
	}
	const bootChunk = 100_000;

	// A PDP-7 memory cycle is 1.75 µs. Pacing is by wall clock, never by the monitor's
	// refresh rate; a stall longer than MAX_DT_MS is a hiccup, not a debt to repay.
	const CYCLES_PER_MS = 1000 / 1.75;
	const MAX_DT_MS = 250;
	const MAX_CYCLES_PER_FRAME = 100_000;
	const SPEEDS = [1, 10, Infinity];
	let speedIndex = $state(0);
	const speed = $derived(SPEEDS[speedIndex]);
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

	// Raw core browser: MEM_LINES lines of MEM_COLS words, octal. Clicking a word follows its
	// low 13 bits as an address; the trail remembers where you came from.
	const MEM_COLS = $derived(side >= 560 ? 8 : 4);
	const MEM_LINES = 8;
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

	function refreshMem() {
		if (!cpu || !program?.memory) return;
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
		refreshMem();
	}

	function memBack() {
		if (!memTrail.length) return;
		memBase = memTrail[memTrail.length - 1];
		memTrail = memTrail.slice(0, -1);
		memFocus = -1;
		refreshMem();
	}

	function memAddrInput(event) {
		const text = event.currentTarget.value.trim();
		if (/^[0-7]+$/.test(text)) memGo(parseInt(text, 8), true);
		else event.currentTarget.value = oct(memBase, 5);
	}

	$effect(() => {
		const el = memEl;
		if (!el) return;
		const onWheel = (e) => {
			e.preventDefault();
			memGo(memBase + Math.sign(e.deltaY) * MEM_COLS * (e.shiftKey ? MEM_LINES : 1));
			memFocus = -1;
		};
		el.addEventListener('wheel', onWheel, { passive: false });
		return () => el.removeEventListener('wheel', onWheel);
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
		if (captionEl) ro.observe(captionEl);
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
<figure class="cabinet-applet" data-applet="cabinet" bind:this={figureEl} style:width="{side}px">
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
			<button
				type="button"
				class="console icon"
				aria-label={paused ? 'Run' : 'Stop'}
				disabled={status !== 'live'}
				title={paused ? 'Run: continue from where the machine stopped' : 'Stop the processor'}
				onclick={() => (paused = !paused)}>{paused ? '▶️' : '⏸️'}</button
			>
			<button
				type="button"
				class="console icon"
				aria-label="Reset"
				disabled={status === 'booting' || demoOn}
				title="Reset: clear core and boot {program?.label ?? 'the program'} again"
				onclick={onReset}>🔄</button
			>
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
			<span class="buttons">
				<button
					type="button"
					class="speed"
					title="1× is a real PDP-7: 571,429 memory cycles a second"
					onclick={() => (speedIndex = (speedIndex + 1) % SPEEDS.length)}
					>{speed === Infinity ? 'max' : `${speed}×`}</button
				>
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
		<div class="row app demo-row">
			{#if program?.demo}
				<button
					type="button"
					class="demo"
					disabled={status !== 'live' || (demoOn ? false : recording)}
					title={demoOn ? 'Stop' : program.demoTitle}
					onclick={() => onDemo(false)}>{demoOn ? 'Stop' : 'Demo'}</button
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
			<span class="demo-caption" aria-live="polite"
				>{demoOn ? demoCaption : recording ? 'Recording. ⏺ again to stop.' : ''}</span
			>
		</div>
		{#if program?.keyHelp}
			<p class="row app keys">Click the tube, then: {program.keyHelp}</p>
		{/if}
		{#if program?.memory}
			<div class="row app mem" bind:this={memEl}>
				<div class="mem-bar">
					<button type="button" class="icon" aria-label="Back" title="Back" disabled={!memTrail.length} onclick={memBack}>◀</button>
					<input
						class="mem-addr"
						aria-label="Address, octal"
						title="Address, octal. Enter to go."
						value={oct(memBase, 5)}
						onchange={memAddrInput}
					/>
					<button type="button" class="icon" aria-label="Page up" title="Page up" onclick={() => memGo(memBase - MEM_PAGE)}>▲</button>
					<button type="button" class="icon" aria-label="Page down" title="Page down" onclick={() => memGo(memBase + MEM_PAGE)}>▼</button>
					<span class="mem-hint">wheel scrolls, click follows</span>
				</div>
				{#each { length: MEM_LINES } as _, line (line)}
					{@const at = (memBase + line * MEM_COLS) % CORE}
					<div class="mem-line">
						<span class="mem-at">{oct(at, 5)}</span>
						{#each { length: MEM_COLS } as _, col (col)}
							{@const i = line * MEM_COLS + col}
							{@const w = memWords[i] ?? 0}
							<button
								type="button"
								class="mem-word"
								class:changed={memChanged[i]}
								class:focus={(at + col) % CORE === memFocus}
								title="{oct((at + col) % CORE, 5)}: {oct(w, 6)} → go to {oct(w & 0o17777, 5)}"
								onclick={() => memGo(w & 0o17777, true)}>{oct(w, 6)}</button
							>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</figcaption>
</figure>

<style>
	.headline {
		margin: 0 0 0.4rem;
	}
	.cabinet-applet {
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
	.console {
		margin-left: 0.35rem;
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
	.demo-row .demo-caption {
		margin-left: 0.3rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.speed {
		width: 4ch;
	}
	.program {
		font: inherit;
		font-size: 0.72rem;
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
	.mem-word {
		all: unset;
		cursor: pointer;
	}
	.mem-word:hover {
		background: #333;
	}
	.mem-word.changed {
		color: #000;
		background: #9f9;
	}
	.mem-word.focus {
		outline: 1px solid currentColor;
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
