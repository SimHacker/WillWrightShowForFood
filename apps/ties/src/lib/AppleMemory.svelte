<script>
	// The Apple's memory, as the PDP-7's memory panel shows its core: hex (eight bytes a line),
	// code (an instruction a line, disassembled), and trace (the last instructions run, with
	// the registers each found). A click on an operand or a byte goes there; the trail
	// remembers where you came from. Reads are peeks, so no soft switch is touched.
	import { APPLE2_SYMBOLS, apple2Name, before65, disassemble65, hex2, hex4 } from '@wwsff/cabinet/korz/apple2';

	/** @type {{ korz: { peek: (a: number) => number, pc: number, tracing: (on: boolean) => void, trace: import('@wwsff/cabinet/korz/apple2').Trace65 } }} */
	let { korz } = $props();

	const LINES = 16;
	const COLS = 8;
	const KEY = 'apple-mem-view';
	const VIEWS = [
		['hex', 'hex', 'Bytes, eight a line'],
		['code', 'code', 'Disassembled, an instruction a line'],
		['trace', 'trace', 'Instructions as executed, newest last, with the registers each found']
	];
	/** @type {'hex' | 'code' | 'trace'} */
	let view = $state(/** @type {any} */ (VIEWS.some(([id]) => id === globalThis.localStorage?.getItem(KEY)) ? globalThis.localStorage?.getItem(KEY) : 'code'));
	let follow = $state(true);
	let base = $state(0);
	let focus = $state(-1);
	let back = $state(0);
	/** @type {number[]} */
	let trail = $state([]);
	let tick = $state(0);

	const peek = (/** @type {number} */ a) => korz.peek(a);
	const symbolic = (/** @type {number} */ a) => apple2Name(a);
	const byName = [...APPLE2_SYMBOLS].sort((a, b) => a.name.localeCompare(b.name));

	$effect(() => {
		globalThis.localStorage?.setItem(KEY, view);
		korz.tracing(view === 'trace');
		return () => korz.tracing(false);
	});
	$effect(() => {
		const id = setInterval(() => (tick += 1), 40);
		return () => clearInterval(id);
	});

	/** Instructions from `from`, `n` of them. @param {number} from @param {number} n */
	function walk(from, n) {
		const out = [];
		let at = from & 0xffff;
		for (let i = 0; i < n; i++) {
			const l = disassemble65(peek, at, symbolic);
			out.push(l);
			at = (at + l.bytes.length) & 0xffff;
		}
		return out;
	}
	/** `n` instructions back from `at`. @param {number} at @param {number} n */
	function backFrom(at, n) {
		let a = at;
		for (let i = 0; i < n; i++) a = before65(peek, a);
		return a;
	}

	const pc = $derived((void tick, korz.pc));
	const code = $derived.by(() => {
		void tick;
		if (view !== 'code') return [];
		let lines = walk(base, LINES);
		if (follow && pc >= 0 && !lines.some((l) => l.at === pc)) {
			lines = walk(backFrom(pc, 2), LINES);
		}
		return lines;
	});
	/** @type {number[]} */
	let shown = [];
	let shownBase = -1;
	const hexRows = $derived.by(() => {
		void tick;
		if (view !== 'hex') return [];
		let from = base;
		if (follow && pc >= 0 && (pc - from + 0x10000) % 0x10000 >= LINES * COLS) from = (pc - (pc % COLS) - COLS) & 0xffff;
		const bytes = Array.from({ length: LINES * COLS }, (_, i) => peek((from + i) & 0xffff));
		const changed = shownBase === from ? bytes.map((b, i) => b !== shown[i]) : [];
		shown = bytes;
		shownBase = from;
		return Array.from({ length: LINES }, (_, line) => ({ at: (from + line * COLS) & 0xffff, bytes: bytes.slice(line * COLS, line * COLS + COLS), changed: changed.slice(line * COLS, line * COLS + COLS) }));
	});
	const traceRows = $derived.by(() => {
		void tick;
		if (view !== 'trace') return [];
		return korz.trace.window(LINES, follow ? 0 : back).map((e) => ({ ...e, line: disassemble65((a) => e.bytes[(a - e.pc) & 0xffff] ?? 0, e.pc, symbolic) }));
	});
	const traceNote = $derived.by(() => {
		void tick;
		const t = korz.trace;
		const b = follow ? 0 : back;
		return `${b ? `${b.toLocaleString()} back; ` : ''}${t.held.toLocaleString()} held of ${t.count.toLocaleString()} executed. While this shows, the compiler runs one instruction at a time.`;
	});

	/** @param {number} a @param {boolean} [remember] */
	function go(a, remember = false) {
		a &= 0xffff;
		if (remember) trail = [...trail.slice(-31), base];
		focus = a;
		follow = false;
		if (view === 'trace') view = 'code';
		base = view === 'hex' ? a - (a % COLS) : a;
	}
	function goBack() {
		const a = trail.at(-1);
		if (a === undefined) return;
		trail = trail.slice(0, -1);
		follow = false;
		base = a;
	}
	function showPc() {
		if (pc < 0) return;
		if (view === 'trace') view = 'code';
		follow = false;
		base = view === 'hex' ? (pc - (pc % COLS)) & 0xffff : backFrom(pc, 2);
		focus = pc;
	}
	/** @param {number} dir */
	function scroll(dir) {
		follow = false;
		if (view === 'trace') {
			back = Math.max(0, Math.min(Math.max(0, korz.trace.held - LINES), back - dir * LINES));
			return;
		}
		const top = view === 'code' ? (code[0]?.at ?? base) : (hexRows[0]?.at ?? base);
		if (view === 'hex') base = (top + dir * LINES * COLS) & 0xffff;
		else if (dir > 0) {
			const last = code.at(-1);
			base = last ? (last.at + last.bytes.length) & 0xffff : top;
		} else base = backFrom(top, LINES);
	}
	/** Hex, `$`-prefixed or not, or a symbol, or symbol+hex. @param {string} text */
	function parse(text) {
		const t = text.trim().toUpperCase();
		const m = /^([A-Z][A-Z0-9]*)(?:\+\$?([0-9A-F]+))?$/.exec(t);
		const sym = m && APPLE2_SYMBOLS.find((s) => s.name === m[1]);
		if (sym) return (sym.addr + (m[2] ? parseInt(m[2], 16) : 0)) & 0xffff;
		const h = /^\$?([0-9A-F]{1,4})$/.exec(t);
		return h ? parseInt(h[1], 16) : -1;
	}
	/** @param {Event & { currentTarget: HTMLInputElement }} e */
	function addrInput(e) {
		const a = parse(e.currentTarget.value);
		if (a >= 0) go(a, true);
	}
	const top = $derived(view === 'code' ? (code[0]?.at ?? base) : view === 'hex' ? (hexRows[0]?.at ?? base) : base);
	const bytesHex = (/** @type {readonly number[]} */ b) => b.map(hex2).join(' ');
</script>

<div class="mem">
	<div class="mem-bar mem-views" role="group" aria-label="View">
		{#each VIEWS as [id, label, hint] (id)}
			<button type="button" class="mem-view" class:on={view === id} aria-pressed={view === id} title={hint} onclick={() => (view = /** @type {any} */ (id))}>{label}</button>
		{/each}
		<button
			type="button"
			class="mem-view"
			class:on={follow}
			aria-pressed={follow}
			title={view === 'trace' ? 'Keep the newest instruction in view' : 'Keep the PC in view'}
			onclick={() => {
				follow = !follow;
				back = 0;
			}}>{view === 'trace' ? 'live' : 'follow\u00a0PC'}</button
		>
		{#if pc >= 0}
			<button type="button" class="mem-view mem-pc-go" title="Show the PC" onclick={showPc}>👉 PC {hex4(pc)} {symbolic(pc)}</button>
		{/if}
	</div>
	<div class="mem-bar">
		<button type="button" class="icon" aria-label="Back" title="Back" disabled={!trail.length} onclick={goBack}>◀</button>
		<input class="mem-addr" aria-label="Address: hex, a symbol, or symbol+offset" title="Hex, a symbol, or symbol+offset. Enter to go." value={hex4(top)} onchange={addrInput} />
		<button type="button" class="icon" aria-label="Page up" title="Page up" onclick={() => scroll(-1)}>▲</button>
		<button type="button" class="icon" aria-label="Page down" title="Page down" onclick={() => scroll(1)}>▼</button>
		<select class="mem-symbols" aria-label="Go to symbol" title="{APPLE2_SYMBOLS.length} symbols" onchange={(e) => e.currentTarget.value && go(Number(e.currentTarget.value), true)}>
			<option value="">{symbolic(focus >= 0 ? focus : top) || 'symbol'} ▾</option>
			{#each byName as s (s.name)}
				<option value={s.addr}>{s.name} {hex4(s.addr)}</option>
			{/each}
		</select>
	</div>
	{#if view === 'code'}
		{#each code as l, i (i)}
			<div class="mem-line code" class:pc={l.at === pc} class:focus={l.at === focus}>
				<span class="mem-pc" aria-label={l.at === pc ? 'PC' : undefined}>{l.at === pc ? '👉' : ''}</span>
				<span class="mem-at">{hex4(l.at)}</span>
				<span class="mem-label">{symbolic(l.at)}</span>
				<span class="mem-oct bytes">{bytesHex(l.bytes)}</span>
				{#if l.target === null}
					<span class="mem-op" class:undoc={l.op.undocumented}>{l.text}</span>
				{:else}
					<button type="button" class="mem-word mem-op" class:undoc={l.op.undocumented} title="Go to {symbolic(l.target) || '$' + hex4(l.target)}" onclick={() => go(/** @type {number} */ (l.target), true)}>{l.text}</button>
				{/if}
				<span class="mem-src">{l.op.undocumented ? 'undocumented' : ''}</span>
			</div>
		{/each}
	{:else if view === 'trace'}
		{#each traceRows as e (e.n)}
			<div class="mem-line trace" class:focus={e.pc === focus}>
				<span class="mem-at">{hex4(e.pc)}</span>
				<span class="mem-label">{symbolic(e.pc)}</span>
				<span class="mem-oct bytes">{bytesHex(e.line.bytes)}</span>
				<button type="button" class="mem-word mem-op" title="See it in the code view" onclick={() => go(e.pc, true)}>{e.line.text}</button>
				<span class="mem-src">A {hex2(e.a)} X {hex2(e.x)} Y {hex2(e.y)} P {hex2(e.p)} S {hex2(e.s)}</span>
			</div>
		{/each}
		<p class="mem-hint">{traceNote}</p>
	{:else}
		{#each hexRows as row (row.at)}
			{@const hasPc = ((pc - row.at + 0x10000) & 0xffff) < COLS}
			<div class="mem-line">
				<span class="mem-pc" aria-label={hasPc ? 'PC on this line' : undefined}>{hasPc ? '👉' : ''}</span>
				<span class="mem-at">{hex4(row.at)}</span>
				{#each row.bytes as b, col (col)}
					{@const at = (row.at + col) & 0xffff}
					<button
						type="button"
						class="mem-word"
						class:changed={row.changed[col]}
						class:focus={at === focus}
						class:pc={at === pc}
						class:sym={!!symbolic(at)}
						title="{symbolic(at) || '$' + hex4(at)}: ${hex2(b)}. Click to see the code from here."
						onclick={() => {
							view = 'code';
							go(at, true);
						}}>{hex2(b)}</button
					>
				{/each}
				<span class="mem-src ascii">{row.bytes.map((b) => ((b & 0x7f) >= 0x20 && (b & 0x7f) < 0x7f ? String.fromCharCode(b & 0x7f) : '.')).join('')}</span>
			</div>
		{/each}
	{/if}
</div>

<style>
	.mem {
		font: 0.8rem ui-monospace, monospace;
	}
	.mem-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2px;
		margin-bottom: 2px;
	}
	.mem-addr {
		width: 6ch;
		font: inherit;
		background: var(--term-bg);
		color: var(--term-ink);
		border: 1px solid var(--term-edge);
		padding: 0 0.2em;
	}
	.mem-hint {
		margin: 0.2em 0 0 0.5em;
		opacity: 0.5;
	}
	.mem-line {
		display: flex;
		gap: 0.6ch;
		min-height: 1.25em;
		white-space: pre;
	}
	.mem-at {
		opacity: 0.5;
		margin-right: 0.4ch;
	}
	.mem-pc {
		flex: 0 0 2.2ch;
		margin-right: -0.4ch;
		text-align: center;
		font-size: 0.9em;
	}
	.mem-views .mem-pc-go {
		margin-left: 0.5em;
		border-color: var(--term-pc-edge);
		color: var(--term-pc-ink);
	}
	.mem-word {
		all: unset;
		cursor: pointer;
	}
	.mem-word:hover {
		background: var(--term-hover);
	}
	.mem-word.sym {
		text-decoration: underline dotted;
		text-underline-offset: 2px;
	}
	.mem-symbols {
		font: inherit;
		max-width: 12rem;
		background: var(--term-bg);
		color: var(--term-ink);
		border: 1px solid var(--term-edge);
	}
	.mem-word.changed {
		color: #000;
		background: var(--term-changed);
	}
	.mem-word.focus,
	.mem-line.focus {
		outline: 1px solid currentColor;
	}
	.mem-word.pc,
	.mem-line.pc {
		background: var(--term-pc-bg);
		color: var(--term-pc-ink);
	}
	.mem-views .mem-view {
		font: inherit;
		text-transform: uppercase;
		background: var(--term-bg);
		color: var(--term-ink);
		border: 1px solid var(--term-edge);
		padding: 0 0.4em;
		white-space: nowrap;
		cursor: pointer;
	}
	.mem-views .mem-view.on {
		background: var(--term-lit);
		color: #000;
	}
	.mem-label {
		width: 9ch;
		flex-shrink: 0;
		overflow: hidden;
	}
	.mem-oct {
		flex-shrink: 0;
		opacity: 0.6;
	}
	.mem-oct.bytes {
		width: 8ch;
	}
	.mem-op {
		width: 18ch;
		flex-shrink: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.mem-op.undoc {
		color: var(--term-odd);
	}
	.mem-src {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0.75;
	}
	.mem-src.ascii {
		margin-left: 1ch;
	}
</style>
