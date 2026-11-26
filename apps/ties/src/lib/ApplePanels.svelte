<script>
	// The Apple's insides under tabs, each closed until asked for: the 6502 (CPU), the soft
	// switches, annunciators, drives and game port (I/O), and the Korz structures (KORZ).
	// The page shows the screen and the game; these are for looking under the lid.
	import { APPLE_HZ } from '@wwsff/cabinet/angel';
	import { ENGINES, apple } from './apple.svelte.js';
	import KorzBrowser from './KorzBrowser.svelte';

	/** @type {{ labelOf?: (file: string) => string }} */
	let { labelOf = (file) => file.slice(file.lastIndexOf('/') + 1) } = $props();

	const KEY = 'apple-panels';
	const TABS = [
		{ id: 'cpu', label: 'CPU', title: "The 6502: its registers and flags, the panel's bits, the cycles it has run, and how fast it is going" },
		{ id: 'io', label: 'I/O', title: 'The video soft switches, the annunciators, the drives and the game port' },
		{ id: 'korz', label: 'KORZ', title: "Korz: browse the 6502's sea, its slots, and the JavaScript the compiler made from the Apple's code. Read-only." }
	];
	/** @type {string[]} */
	let shown = $state((globalThis.localStorage?.getItem(KEY) ?? '').split(' ').filter((id) => TABS.some((t) => t.id === id)));

	/** @param {string} id */
	function toggle(id) {
		shown = shown.includes(id) ? shown.filter((x) => x !== id) : [...shown, id];
		globalThis.localStorage?.setItem(KEY, shown.join(' '));
	}

	const hex = (/** @type {number} */ n, /** @type {number} */ w) => (n ?? 0).toString(16).toUpperCase().padStart(w, '0');
	const FLAGS = [
		['N', 'negative'],
		['V', 'overflow'],
		['-', 'unused, always 1'],
		['B', 'break'],
		['D', 'decimal'],
		['I', 'interrupts off'],
		['Z', 'zero'],
		['C', 'carry']
	];
	const s = $derived(apple.status);
	const BITS = [7, 6, 5, 4, 3, 2, 1, 0];
	const switches = $derived(s && 'switches' in s ? s.switches : null);
	const engine = $derived(ENGINES.find((e) => e.id === apple.id)?.label ?? apple.id);
	const running = $derived(apple.phase === 'running' && !!s);
</script>

<section class="panels" aria-label="Under the lid">
	<div class="tabs" role="group" aria-label="Panels">
		{#each TABS as t (t.id)}
			<button class={{ on: shown.includes(t.id) }} aria-pressed={shown.includes(t.id)} title={t.title} onclick={() => toggle(t.id)}>{t.label}</button>
		{/each}
	</div>

	{#each TABS as t (t.id)}
		{#if shown.includes(t.id)}
			<div class="panel" role="group" aria-label={t.label}>
				{#if t.id === 'korz'}
					<KorzBrowser roots={() => apple.korzRoots()} follow={() => apple.korzFollow()} />
				{:else if !running || !s}
					<p class="off">The Apple is not running yet.</p>
				{:else if t.id === 'cpu'}
					<dl>
						<dt>registers</dt>
						<dd class="regs">
							<span title="Program counter">PC <b>${hex(s.pc, 4)}</b></span>
							<span title="Accumulator">A <b>${hex(s.a, 2)}</b></span>
							<span title="X index">X <b>${hex(s.x, 2)}</b></span>
							<span title="Y index">Y <b>${hex(s.y, 2)}</b></span>
							<span title="Stack pointer, in page 1">S <b>${hex(s.sp, 2)}</b></span>
							<span title="Processor status">P <b>${hex(s.p, 2)}</b></span>
						</dd>
						<dt>flags</dt>
						<dd class="lamps">
							{#each FLAGS as [letter, name], i (i)}
								<span class={['lamp', { lit: !!(s.p & (0x80 >> i)) }]} title={name}>{letter}</span>
							{/each}
						</dd>
						{#if apple.panel?.length}
							<dt title="$C041–$C04F, a panel no Apple had: 120 bits that the program sets with STA or POKE and reads with LDA or PEEK, and that a click here flips. The dance hears them as the PDP-7 hears its switches.">panel</dt>
							<dd class="panel-bits">
								{#each apple.panel as byte, i (i)}
									{@const addr = 0xc041 + i}
									<span class="byte" title="${hex(addr, 4)}: PEEK({addr - 65536}), POKE {addr - 65536},n">
										<span class="addr">{hex(addr, 4)}</span>
										{#each BITS as b (b)}
											<button
												type="button"
												class={['lamp', 'bit', { lit: !!(byte & (1 << b)) }]}
												aria-pressed={!!(byte & (1 << b))}
												aria-label="${hex(addr, 4)} bit {b}"
												onclick={() => apple.flip(i * 8 + b)}>{b}</button
											>
										{/each}
										<b>{hex(byte, 2)}</b>
									</span>
								{/each}
							</dd>
						{/if}
						<dt>cycles</dt>
						<dd><b>{s.cycles.toLocaleString('en-US')}</b>, {(s.cycles / APPLE_HZ).toFixed(1)} s of Apple time</dd>
						<dt>speed</dt>
						<dd>
							<b>{apple.mhz.toFixed(2)} MHz</b>, {(apple.mhz / (APPLE_HZ / 1e6)).toFixed(1)}× an Apple
							{#if apple.pace}· {apple.pace} picture{apple.pace === 1 ? '' : 's'} a game second{/if}
						</dd>
						<dt>engine</dt>
						<dd>{engine}</dd>
					</dl>
				{:else if t.id === 'io'}
					<dl>
						<dt>video</dt>
						<dd>
							{#if switches}
								<span class="lamps">
									<span class={['lamp', 'word', { lit: switches.graphics }]} title="$C050 graphics, $C051 text">{switches.graphics ? 'GRAPHICS' : 'TEXT'}</span>
									<span class={['lamp', 'word', { lit: switches.mixed }]} title="$C053 mixed: four lines of text under the graphics; $C052 full screen">{switches.mixed ? 'MIXED' : 'FULL'}</span>
									<span class={['lamp', 'word', { lit: switches.page2 }]} title="$C055 page 2, $C054 page 1">{switches.page2 ? 'PAGE 2' : 'PAGE 1'}</span>
									<span class={['lamp', 'word', { lit: switches.hires }]} title="$C057 hi-res, $C056 lo-res">{switches.hires ? 'HI-RES' : 'LO-RES'}</span>
								</span>
							{/if}
							<span class="shows" title="What the screen shows">{s.modes.join(' ')}</span>
						</dd>
						<dt>annunciators</dt>
						<dd class="lamps">
							{#each [0, 1, 2, 3] as n (n)}
								<span class={['lamp', { lit: !!(apple.annunciators & (1 << n)) }]} title="AN{n}: $C0{hex(0x58 + 2 * n, 2)} off, $C0{hex(0x59 + 2 * n, 2)} on">AN{n}</span>
							{/each}
						</dd>
						<dt>drives</dt>
						<dd class="drives">
							{#each apple.drives as name, d (d)}
								<span title={name || 'empty'}>{d + 1}: {name ? labelOf(name) : 'empty'}</span>
							{/each}
						</dd>
						<dt>game port</dt>
						<dd>{apple.gamepad ? `gamepad: ${apple.gamepad}` : apple.mouseStick ? 'joystick: the pointer' : 'nothing plugged in'}</dd>
					</dl>
				{/if}
			</div>
		{/if}
	{/each}
</section>

<style>
	.panels {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 0.6rem;
	}
	.tabs {
		display: flex;
		gap: 2px;
		font: 0.75rem ui-monospace, monospace;
	}
	.tabs button {
		font: inherit;
		text-transform: uppercase;
		padding: 0.1em 0.6em;
	}
	.tabs button.on {
		background: #cfc;
		color: #000;
	}
	.panel {
		padding: 0.4rem 0.6rem;
		border: 1px solid #333;
		border-radius: 4px;
		font: 0.8rem ui-monospace, monospace;
	}
	.off {
		margin: 0;
		opacity: 0.7;
	}
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.25rem 1rem;
		align-items: baseline;
		margin: 0;
	}
	dt {
		opacity: 0.65;
	}
	dd {
		margin: 0;
		min-width: 0;
		font-variant-numeric: tabular-nums;
	}
	dd b {
		font-weight: 600;
	}
	.regs,
	.drives {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.4ch;
	}
	.lamps {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 3px;
	}
	.lamp {
		min-width: 1.4em;
		padding: 0 0.25em;
		text-align: center;
		border-radius: 3px;
		background: #333;
		color: #999;
	}
	.panel-bits {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 1.6ch;
	}
	.byte {
		display: inline-flex;
		align-items: center;
		gap: 2px;
	}
	.byte .addr {
		opacity: 0.65;
		margin-right: 0.4ch;
	}
	.byte b {
		margin-left: 0.4ch;
	}
	.lamp.bit {
		font: inherit;
		min-width: 1.5em;
		border: 0;
		cursor: pointer;
	}
	.lamp.word {
		min-width: 9ch;
	}
	.lamp.lit {
		background: #f80;
		color: #000;
	}
	.shows {
		margin-left: 1ch;
		opacity: 0.75;
	}
</style>
