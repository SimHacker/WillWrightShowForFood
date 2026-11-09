<script>
	/**
	 * An Embedded Constraint Graphics playground, from an ```ecg fence:
	 *
	 *     examples:                       each example is the whole drawing, as points
	 *       - { id: A, points: [[0, 0]] }
	 *       - { id: B, points: [[10, 0]] }
	 *       - { id: C, points: [[0, 10]] }
	 *     strokes: [[0, 1, 2]]            optional polylines through point indices
	 *     start: A                        optional, default the first example
	 *     damping: 0                      optional, the solver's d
	 *
	 * Drag any point of the drawing and the engine solves for the blend weights that put it
	 * under the cursor (@wwsff/ecg tug). Every number the solver uses is on screen: the
	 * weights, the state in the simplex, the Jacobian's shape, and which examples are
	 * pinned at zero by the walls. Several fingers drag several points at once. Shift-click
	 * pins a point where it is; arrow keys nudge a focused point.
	 */
	import { SvelteMap } from 'svelte/reactivity';
	import { drive, mix, pointTargets, tug, vertexWeights } from '@wwsff/ecg';

	let { spec } = $props();

	const examples = $derived(Array.isArray(spec?.examples) ? spec.examples : []);
	const configs = $derived(examples.map((e) => e.points.flat()));
	const n = $derived(examples.length);
	const pointCount = $derived(examples[0]?.points?.length ?? 0);
	const yUp = $derived(spec?.yUp ?? true);
	const strokes = $derived(
		(spec?.strokes ?? []).map((s) => (Array.isArray(s) ? { path: s, closed: false } : s))
	);
	const problem = $derived.by(() => {
		if (spec?.error) return 'The ecg block is not valid YAML.';
		if (n < 2) return 'An ecg block needs at least two examples.';
		const bad = examples.find((e) => e.points?.length !== pointCount);
		return bad ? `Example ${bad.id} has ${bad.points?.length} points, not ${pointCount}.` : null;
	});

	function startIndex() {
		const i = examples.findIndex((e) => e.id === spec?.start);
		return i < 0 ? 0 : i;
	}

	const specDamping = () => Number(spec?.damping ?? 0);

	// Writable derived: starts at the start example whenever the spec changes, and the
	// handlers overwrite it as you drag.
	let weights = $derived(vertexWeights(n, startIndex()));
	let damping = $state(specDamping());
	let walls = $state([]);
	let jacobian = $state(null);
	let pins = $state([]);
	let marks = $state([]);

	const config = $derived(n >= 2 && !problem ? drive(configs, weights) : []);

	function pos(c, p) {
		return [c[2 * p], c[2 * p + 1]];
	}
	const sx = (x) => x;
	const sy = (y) => (yUp ? -y : y);

	const bounds = $derived.by(() => {
		const xs = configs.flatMap((c) => c.filter((_, i) => i % 2 === 0));
		const ys = configs.flatMap((c) => c.filter((_, i) => i % 2 === 1).map(sy));
		if (!xs.length) return { x: 0, y: 0, w: 1, h: 1, span: 1 };
		const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
		const span = Math.max(x1 - x0, y1 - y0, 1e-6);
		const pad = span * 0.18;
		return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad, span };
	});
	const r = $derived(bounds.span * 0.035);

	function pathOf(c, stroke) {
		const pts = stroke.path.map((p) => `${sx(c[2 * p])},${sy(c[2 * p + 1])}`);
		return `M${pts.join(' L')}${stroke.closed ? ' Z' : ''}`;
	}

	/** Each point's positions across the examples: the handle's own simplex, out in the drawing. */
	const handleEdges = $derived.by(() => {
		if (pointCount > 3 || n > 6) return [];
		const edges = [];
		for (let p = 0; p < pointCount; p++)
			for (let a = 0; a < n; a++)
				for (let b = a + 1; b < n; b++) edges.push([pos(configs[a], p), pos(configs[b], p)]);
		return edges;
	});

	let svg = $state(null);
	const grabs = new SvelteMap(); // pointerId -> { point, offset: [dx, dy], cursor: [x, y] }
	let startWeights = null;
	let pinTargets = [];
	let animation = 0;

	function toData(event) {
		const m = svg.getScreenCTM();
		if (!m) return [0, 0];
		const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
		return [p.x, yUp ? -p.y : p.y];
	}

	function rebase() {
		startWeights = [...weights];
		pinTargets = pins.map((p) => ({ point: p, at: pos(config, p) }));
	}

	function solve(extra = []) {
		const targets = [];
		const want = [];
		for (const g of grabs.values()) {
			const at = [g.cursor[0] + g.offset[0], g.cursor[1] + g.offset[1]];
			targets.push(...pointTargets(g.point, at[0], at[1]));
			want.push(at);
		}
		for (const e of extra) {
			targets.push(...pointTargets(e.point, e.at[0], e.at[1]));
			want.push(e.at);
		}
		const held = new Set([...grabs.values()].map((g) => g.point).concat(extra.map((e) => e.point)));
		for (const pin of pinTargets) {
			if (!held.has(pin.point)) targets.push(...pointTargets(pin.point, pin.at[0], pin.at[1]));
		}
		const result = tug(configs, startWeights, targets, damping);
		weights = result.weights;
		walls = result.walls;
		jacobian = { rows: targets.length, cols: n - 1 - result.walls.length };
		marks = want;
	}

	function onPointDown(event, p) {
		if (event.button !== 0) return;
		event.preventDefault();
		cancelAnimationFrame(animation);
		if (event.shiftKey) {
			pins = pins.includes(p) ? pins.filter((q) => q !== p) : [...pins, p];
			return;
		}
		svg.setPointerCapture(event.pointerId);
		const cursor = toData(event);
		const at = pos(config, p);
		grabs.set(event.pointerId, { point: p, offset: [at[0] - cursor[0], at[1] - cursor[1]], cursor });
		rebase();
	}

	function onMove(event) {
		const g = grabs.get(event.pointerId);
		if (!g) return;
		g.cursor = toData(event);
		solve();
	}

	function onUp(event) {
		if (!grabs.delete(event.pointerId)) return;
		if (grabs.size) rebase();
		else marks = [];
	}

	function onPointKey(event, p) {
		const step = bounds.span * (event.shiftKey ? 0.1 : 0.02);
		const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[event.key];
		if (!delta) return;
		event.preventDefault();
		const at = pos(config, p);
		rebase();
		solve([{ point: p, at: [at[0] + delta[0], at[1] + (yUp ? delta[1] : -delta[1])] }]);
		marks = [];
	}

	/** Driving, not tugging: ease the weights to one example. Mixing weights stays in the simplex. */
	function goTo(k) {
		cancelAnimationFrame(animation);
		const from = [...weights];
		const to = vertexWeights(n, k);
		const t0 = performance.now();
		walls = [];
		jacobian = null;
		const step = (now) => {
			const t = Math.min(1, (now - t0) / 350);
			weights = mix(from, to, t * t * (3 - 2 * t));
			if (t < 1) animation = requestAnimationFrame(step);
		};
		animation = requestAnimationFrame(step);
	}

	function reset() {
		cancelAnimationFrame(animation);
		weights = vertexWeights(n, startIndex());
		pins = [];
		walls = [];
		jacobian = null;
		marks = [];
	}

	$effect(() => () => cancelAnimationFrame(animation));

	const S = 160;
	const corners = $derived(
		Array.from({ length: n }, (_, k) => {
			const a = -Math.PI / 2 + (2 * Math.PI * k) / n;
			return [S / 2 + (S / 2 - 22) * Math.cos(a), S / 2 + (S / 2 - 22) * Math.sin(a)];
		})
	);
	const stateDot = $derived(
		corners.reduce((acc, c, k) => [acc[0] + weights[k] * c[0], acc[1] + weights[k] * c[1]], [0, 0])
	);
	const simplexName = $derived(
		{ 2: 'a line segment', 3: 'a triangle', 4: 'a tetrahedron' }[n] ?? `a ${n - 1}-simplex`
	);
	const jShape = $derived(
		!jacobian
			? null
			: jacobian.cols === 0
				? 'nothing left to solve: the state is at a corner'
				: jacobian.rows === jacobian.cols
					? 'square: one exact answer'
					: jacobian.rows < jacobian.cols
						? 'wide: many answers, the smallest change wins'
						: 'tall: no exact answer, least squares gets closest'
	);
	const label = (k) => examples[k]?.label ?? examples[k]?.id ?? String(k);
</script>

<figure class="ecg">
	{#if spec?.title}<figcaption>{spec.title}</figcaption>{/if}
	{#if problem}
		<p class="problem">{problem}</p>
	{:else}
		<div class="stage">
			<svg
				bind:this={svg}
				class="drawing"
				viewBox="{bounds.x} {bounds.y} {bounds.w} {bounds.h}"
				onpointermove={onMove}
				onpointerup={onUp}
				onpointercancel={onUp}
				role="application"
				aria-label="Drawing: drag a point"
			>
				{#each handleEdges as [a, b], i (i)}
					<line class="handle-edge" x1={sx(a[0])} y1={sy(a[1])} x2={sx(b[0])} y2={sy(b[1])} />
				{/each}
				{#each configs as c, k (k)}
					<g class="ghost">
						{#each strokes as stroke, s (s)}<path d={pathOf(c, stroke)} />{/each}
						{#each { length: pointCount } as _, p (p)}
							<circle cx={sx(c[2 * p])} cy={sy(c[2 * p + 1])} r={r * 0.45} />
						{/each}
						<text x={sx(c[0]) + r * 1.2} y={sy(c[1]) - r * 1.2} font-size={r * 2.2}>{label(k)}</text>
					</g>
				{/each}
				{#each strokes as stroke, s (s)}<path class="live" d={pathOf(config, stroke)} />{/each}
				{#each marks as m, i (i)}
					<g class="mark">
						<line x1={sx(m[0]) - r} y1={sy(m[1])} x2={sx(m[0]) + r} y2={sy(m[1])} />
						<line x1={sx(m[0])} y1={sy(m[1]) - r} x2={sx(m[0])} y2={sy(m[1]) + r} />
					</g>
				{/each}
				{#each { length: pointCount } as _, p (p)}
					<circle
						class={['point', { pinned: pins.includes(p) }]}
						cx={sx(config[2 * p])}
						cy={sy(config[2 * p + 1])}
						{r}
						role="button"
						tabindex="0"
						aria-label="Point {p} at {config[2 * p].toFixed(2)}, {config[2 * p + 1].toFixed(2)}: drag, or use the arrow keys"
						onpointerdown={(e) => onPointDown(e, p)}
						onkeydown={(e) => onPointKey(e, p)}
					/>
				{/each}
			</svg>

			<div class="panel">
				<svg class="simplex" viewBox="0 0 {S} {S}" aria-label="The state in {simplexName}">
					{#each corners as a, i (i)}
						{#each corners.slice(i + 1) as b, j (j)}
							<line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
						{/each}
					{/each}
					{#each corners as c, k (k)}
						<circle class={['corner', { wall: walls.includes(k) }]} cx={c[0]} cy={c[1]} r="4" />
						<text
							x={S / 2 + (c[0] - S / 2) * 1.2}
							y={S / 2 + (c[1] - S / 2) * 1.2 + 4}
							text-anchor="middle">{label(k)}</text
						>
					{/each}
					<circle class="state" cx={stateDot[0]} cy={stateDot[1]} r="6" />
				</svg>
				<p class="note">The state in {simplexName}{n > 3 ? ', flattened' : ''}.</p>

				<table class="weights">
					<tbody>
						{#each weights as w, k (k)}
							<tr class={{ wall: walls.includes(k) }}>
								<td><button type="button" onclick={() => goTo(k)} title="Drive to {label(k)}">{label(k)}</button></td>
								<td class="bar"><span style:width="{Math.max(0, w) * 100}%"></span></td>
								<td class="num">{w.toFixed(3)}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<label class="damping">
					damping d <input type="range" min="0" max={bounds.span * 0.5} step={bounds.span / 200} bind:value={damping} />
					<span class="num">{Number(damping).toFixed(2)}</span>
				</label>

				<p class="readout">
					{#if jacobian}
						J is {jacobian.rows}×{jacobian.cols}, {jShape}.
						{#if walls.length}Walls: {walls.map(label).join(', ')} pinned at zero.{/if}
					{:else}
						Drag a point. Shift-click pins one. The buttons drive to an example.
					{/if}
				</p>
				<button type="button" class="reset" onclick={reset}>Reset</button>
			</div>
		</div>
	{/if}
</figure>

<style>
	.ecg {
		margin: 1.5em 0;
		border: 1px solid var(--ink);
		background: var(--panel);
		padding: 0.75em;
	}
	figcaption {
		font-weight: bold;
		margin-bottom: 0.5em;
	}
	.problem {
		color: var(--ink);
		font-style: italic;
	}
	.stage {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		align-items: flex-start;
	}
	.drawing {
		flex: 1 1 320px;
		max-width: 520px;
		aspect-ratio: 1;
		border: 1px solid var(--ink);
		touch-action: none;
		user-select: none;
	}
	.handle-edge {
		stroke: var(--ink);
		stroke-opacity: 0.18;
		stroke-dasharray: 4 4;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.ghost path {
		fill: none;
		stroke: var(--ink);
		stroke-opacity: 0.22;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.ghost circle {
		fill: var(--ink);
		fill-opacity: 0.25;
	}
	.ghost text {
		fill: var(--ink);
		fill-opacity: 0.55;
		font-family: ui-monospace, monospace;
	}
	.live {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2.5;
		vector-effect: non-scaling-stroke;
		stroke-linejoin: round;
	}
	.mark line {
		stroke: var(--flash);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}
	.point {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
		cursor: grab;
	}
	.point:focus-visible {
		outline: none;
		fill: var(--flash);
	}
	.point.pinned {
		fill: var(--ink);
	}
	.panel {
		flex: 0 1 240px;
		font-size: 0.9em;
	}
	.simplex {
		width: 160px;
		height: 160px;
		display: block;
	}
	.simplex line {
		stroke: var(--ink);
		stroke-opacity: 0.35;
	}
	.simplex text {
		font-family: ui-monospace, monospace;
		font-size: 11px;
	}
	.corner {
		fill: var(--ink);
	}
	.corner.wall {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-dasharray: 2 2;
	}
	.state {
		fill: var(--flash);
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.note {
		margin: 0.2em 0 0.6em;
		font-style: italic;
	}
	.weights {
		border-collapse: collapse;
		width: 100%;
	}
	.weights td {
		padding: 1px 4px 1px 0;
	}
	.weights tr.wall .num {
		text-decoration: line-through;
	}
	.weights button {
		font-family: ui-monospace, monospace;
		min-width: 2.5em;
		background: var(--paper);
		border: 1px solid var(--ink);
		cursor: pointer;
	}
	.bar {
		width: 100%;
	}
	.bar span {
		display: block;
		height: 0.8em;
		background: var(--ink);
	}
	.num {
		font-family: ui-monospace, monospace;
		text-align: right;
	}
	.damping {
		display: flex;
		align-items: center;
		gap: 0.4em;
		margin: 0.6em 0;
	}
	.damping input {
		flex: 1;
	}
	.readout {
		min-height: 3em;
	}
	.reset {
		background: var(--paper);
		border: 1px solid var(--ink);
		cursor: pointer;
	}
</style>
