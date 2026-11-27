<script>
	// The PDP-10's core, as the Apple's memory node shows its RAM: code (a word a line,
	// disassembled in MIDAS's syntax, ITS's system calls by name) and words (halves, SIXBIT and
	// ASCII). The KA10 runs in a worker, so the node asks for its lines four times a second while
	// it is open. Addresses are as ITS sees them (exec) or as the job running now sees them (user),
	// read through the page tables without touching the pager. Names are exec DDT's symbols.
	import { ascii10, disassemble10, explain10, halves10, sixbit10 } from '@wwsff/cabinet/ka10';
	import { untrack } from 'svelte';
	import { pdp10 } from './pdp10.svelte.js';

	const LINES = 16;
	const AT = 0o777777;
	const KEY = 'pdp10-mem-view';
	const VIEWS = [
		['code', 'code', 'A word a line, disassembled'],
		['words', 'words', 'A word a line: its halves, SIXBIT and ASCII']
	];
	/** @type {'code' | 'words'} */
	let view = $state(globalThis.localStorage?.getItem(KEY) === 'words' ? 'words' : 'code');
	let follow = $state(true);
	/** Whether the addresses are the running job's rather than ITS's. */
	let user = $state(false);
	let base = $state(0);
	let focus = $state(-1);
	/** @type {{ at: number, user: boolean }[]} */
	let trail = $state([]);

	const o6 = (/** @type {number} */ n) => n.toString(8).padStart(6, '0');
	/** A word as two six-digit octal halves. @param {number} w */
	const octal = (w) => `${o6(Math.floor(w / 0o1000000))},,${o6(w % 0o1000000)}`;

	/** The symbols that name addresses, by value: DDT's globals and locals, not half-killed, not program names. */
	const named = $derived(
		pdp10.symbols
			.filter((s) => (s.flags === 1 || s.flags === 2) && s.value >= 0o20 && s.value <= AT)
			.sort((a, b) => a.value - b.value || a.flags - b.flags || a.name.length - b.name.length)
	);
	const byName = $derived(new Map(pdp10.symbols.filter((s) => s.flags !== 0).map((s) => [s.name, s.value])));

	/** The nearest symbol at or below `a`, as DDT types it: FOO or FOO+3. Only for ITS's addresses. @param {number} a @param {boolean} [job] */
	function symbolic(a, job = mem?.user ?? false) {
		if (job || a < 0o20 || !named.length) return '';
		let lo = 0;
		let hi = named.length - 1;
		if (named[0].value > a) return '';
		while (lo < hi) {
			const mid = (lo + hi + 1) >> 1;
			if (named[mid].value <= a) lo = mid;
			else hi = mid - 1;
		}
		const s = named[lo];
		while (lo > 0 && named[lo - 1].value === s.value) lo--;
		const first = named[lo];
		const off = a - first.value;
		return off === 0 ? first.name : off < 0o100 ? `${first.name}+${off.toString(8)}` : '';
	}

	const mem = $derived(pdp10.mem);
	const pc = $derived(mem?.pc ?? -1);
	const pcUser = $derived(mem?.pcUser ?? false);
	const from = $derived(follow && pc >= 0 ? Math.max(0, pc - 3) : base);
	const space = $derived(follow && pc >= 0 ? pcUser : user);

	$effect(() => {
		globalThis.localStorage?.setItem(KEY, view);
	});
	// Asked on a timer, not tracked: each answer moves `from` while following.
	$effect(() => {
		const ask = () => pdp10.peek(from, LINES, space);
		untrack(ask);
		const id = setInterval(ask, 250);
		return () => clearInterval(id);
	});

	const lines = $derived(
		(mem?.words ?? []).map((w, i) => {
			const at = ((mem?.from ?? 0) + i) & AT;
			const line = w === null ? null : disassemble10(w, symbolic, { its: true });
			return { at, w, line, says: w === null ? '' : explain10(w, symbolic, { its: true }) };
		})
	);
	const here = (/** @type {number} */ at) => at === pc && (mem?.user ?? false) === pcUser;

	/** @param {number} a @param {boolean} [remember] */
	function go(a, remember = false) {
		if (remember) trail = [...trail.slice(-31), { at: mem?.from ?? base, user: mem?.user ?? user }];
		user = space;
		follow = false;
		base = a & AT;
		focus = a & AT;
	}
	function goBack() {
		const t = trail.at(-1);
		if (!t) return;
		trail = trail.slice(0, -1);
		follow = false;
		user = t.user;
		base = t.at;
	}
	function showPc() {
		if (pc < 0) return;
		follow = false;
		user = pcUser;
		base = Math.max(0, pc - 3);
		focus = pc;
	}
	/** @param {number} dir */
	function scroll(dir) {
		const top = mem?.from ?? base;
		follow = false;
		user = mem?.user ?? user;
		base = Math.max(0, Math.min(AT - LINES + 1, top + dir * LINES));
	}
	/** Octal, a symbol, or symbol+octal. @param {string} text */
	function parse(text) {
		const t = text.trim().toUpperCase();
		const m = /^([A-Z.$%][A-Z0-9.$%]*)(?:\+([0-7]+))?$/.exec(t);
		const v = m ? byName.get(m[1]) : undefined;
		if (v !== undefined) return (v + (m?.[2] ? parseInt(m[2], 8) : 0)) & AT;
		return /^[0-7]{1,6}$/.test(t) ? parseInt(t, 8) : -1;
	}
	/** @param {Event & { currentTarget: HTMLInputElement }} e */
	function addrInput(e) {
		const text = e.currentTarget.value.trim();
		const a = parse(text);
		if (a < 0) return;
		go(a, true);
		if (!/^[0-7]+$/.test(text)) user = false;
	}
</script>

<div class="mem">
	<div class="mem-bar" role="group" aria-label="View">
		{#each VIEWS as [id, label, hint] (id)}
			<button type="button" class="mem-view" class:on={view === id} aria-pressed={view === id} title={hint} onclick={() => (view = /** @type {any} */ (id))}>{label}</button>
		{/each}
		<button type="button" class="mem-view" class:on={follow} aria-pressed={follow} title="Keep the PC in view, in ITS's addresses or the job's as the PC is" onclick={() => {
				user = space;
				follow = !follow;
			}}>follow&nbsp;PC</button
		>
		<button
			type="button"
			class="mem-view"
			class:on={space}
			aria-pressed={space}
			title="Addresses as the job running now sees them, through its page map; off, as ITS sees them"
			onclick={() => {
				follow = false;
				user = !space;
			}}>job</button
		>
		{#if pc >= 0}
			<button type="button" class="mem-view mem-pc-go" title="Show the PC" onclick={showPc}>👉 PC {o6(pc)} {pcUser ? '(job)' : symbolic(pc, false) || '(ITS)'}</button>
		{/if}
	</div>
	<div class="mem-bar">
		<button type="button" class="icon" aria-label="Back" title="Back" disabled={!trail.length} onclick={goBack}>◀</button>
		<input
			class="mem-addr"
			aria-label="Address: octal, a symbol, or symbol+octal"
			title="Octal, one of ITS's {byName.size.toLocaleString()} symbols, or symbol+octal. Enter to go."
			value={o6(mem?.from ?? base)}
			onchange={addrInput}
		/>
		<button type="button" class="icon" aria-label="Page up" title="Page up" onclick={() => scroll(-1)}>▲</button>
		<button type="button" class="icon" aria-label="Page down" title="Page down" onclick={() => scroll(1)}>▼</button>
		<span class="mem-hint">{(mem?.user ?? space) ? "the job's addresses" : "ITS's addresses"}{pdp10.symbols.length ? '' : ', no symbols until ITS is up'}</span>
	</div>
	{#each lines as l (l.at)}
		<div class="mem-line" class:pc={here(l.at)} class:focus={l.at === focus}>
			<span class="mem-pc" aria-label={here(l.at) ? 'PC' : undefined}>{here(l.at) ? '👉' : ''}</span>
			<span class="mem-at">{o6(l.at)}</span>
			<span class="mem-label">{symbolic(l.at)}</span>
			{#if l.w === null}
				<span class="mem-src">no page here</span>
			{:else if view === 'code'}
				<span class="mem-oct">{octal(l.w)}</span>
				{#if l.line?.target == null}
					<span class="mem-op" title={l.says}>{l.line?.text}</span>
				{:else}
					{@const t = l.line.target}
					<button type="button" class="mem-word mem-op" title="{l.says}. Click to go to {symbolic(t) || o6(t)}." onclick={() => go(t, true)}>{l.line.text}</button>
				{/if}
				<span class="mem-src">{l.says}</span>
			{:else}
				<span class="mem-oct">{octal(l.w)}</span>
				<span class="mem-op">{halves10(l.w)}</span>
				<span class="mem-src">sixbit "{sixbit10(l.w)}" ascii "{ascii10(l.w)}"</span>
			{/if}
		</div>
	{/each}
	{#if mem}
		<div class="mem-acs" aria-label="The accumulators">
			{#each mem.acs as a, i (i)}
				<span><b>{i.toString(8)}</b> {octal(a)}</span>
			{/each}
		</div>
	{:else}
		<p class="mem-hint">Asking the KA10…</p>
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
		width: 9ch;
		font: inherit;
		background: var(--term-bg);
		color: var(--term-ink);
		border: 1px solid var(--term-edge);
		padding: 0 0.2em;
	}
	.mem-hint {
		margin: 0 0 0 0.5em;
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
	.mem-pc-go {
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
	.mem-line.focus {
		outline: 1px solid currentColor;
	}
	.mem-line.pc {
		background: var(--term-pc-bg);
		color: var(--term-pc-ink);
	}
	.mem-view {
		font: inherit;
		text-transform: uppercase;
		background: var(--term-bg);
		color: var(--term-ink);
		border: 1px solid var(--term-edge);
		padding: 0 0.4em;
		white-space: nowrap;
		cursor: pointer;
	}
	.mem-view.on {
		background: var(--term-lit);
		color: #000;
	}
	.mem-label {
		width: 10ch;
		flex-shrink: 0;
		overflow: hidden;
	}
	.mem-oct {
		flex-shrink: 0;
		opacity: 0.6;
	}
	.mem-op {
		width: 22ch;
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
	.mem-acs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(19ch, 1fr));
		gap: 0 1ch;
		margin-top: 0.4em;
		opacity: 0.85;
	}
	.mem-acs b {
		opacity: 0.6;
		font-weight: 400;
	}
</style>
