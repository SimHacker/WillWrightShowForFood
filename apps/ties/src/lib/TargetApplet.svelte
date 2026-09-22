<script>
	/**
	 * A target: an arbitrarily-shaped live region over a picture. Three names in three
	 * namespaces — the picture, the shape, the destination — which is the syntax of the
	 * original .st0 construct.
	 *
	 * Single click shows the destination's definition. Double click navigates. That is
	 * the 1988 interaction, and the rung the web dropped.
	 */
	import { imageFile, resolve } from './corpus.js';
	import { BLINK_PATH, animationOf, chompHalfAngle, usablePath } from './animated.js';
	import { HOLE, popupOf, popSvgTransform } from './popup.js';
	import Eye from './Eye.svelte';
	import PopupChip from './PopupChip.svelte';

	let { db, spec, onpreview, onnavigate, reveal = false, browser = null } = $props();

	let hovered = $state(null); // the shape name under the pointer
	let pressed = $state(null); // popup slammed into its hole until mouseup
	let frame = $state(0);
	let pressAll = $state(false); // mouse on this picture's empty pixels
	const showingAll = $derived(reveal || pressAll);

	const destDb = $derived(spec.db ?? db);
	const picture = $derived(spec.picture ? resolve(db, spec.picture) : null);

	/** A picture carries a list of shapes, each with its own destination. */
	const regions = $derived(
		(spec.shapes ?? []).map((s) => {
			const geometry = resolve(db, s.shape);
			return {
				name: s.shape,
				geometry,
				destination: s.to ? resolve(s.db ?? destDb, s.to) : null,
				to: s.to,
				command: s.command,
				anim: animationOf(s.shape),
				popup: popupOf(s.shape, geometry)
			};
		})
	);

	const destination = $derived(spec.to ? resolve(destDb, spec.to) : null);
	const hoveredAnim = $derived(hovered ? animationOf(hovered) : null);
	const iconStage = $derived(regions.some((r) => r.anim?.kind === 'icon') && !picture?.image);
	const engaged = $derived(
		regions.filter(
			(r) =>
				r.popup &&
				pathOf(r) &&
				(showingAll || hovered === r.name || pressed === r.name)
		)
	);
	const lifted = $derived(engaged.filter((r) => pressed !== r.name));

	function chipId(name, i) {
		const pic = String(spec.picture ?? 'pic').replace(/\W/g, '_');
		const slug = String(name).replace(/\W/g, '_');
		return `pop-${pic}-${slug}-${i}`;
	}

	let canvasPress = $state(null);

	function onCanvasDown(event) {
		if (event.button !== 0) return;
		if (event.target.closest('path')) return;
		const sel = window.getSelection();
		if (sel && !sel.isCollapsed) return;
		canvasPress = { x: event.clientX, y: event.clientY };
		pressAll = true;
	}

	function onCanvasMove(event) {
		if (!canvasPress) return;
		const dx = event.clientX - canvasPress.x;
		const dy = event.clientY - canvasPress.y;
		if (dx * dx + dy * dy < 16) return;
		pressAll = false;
		canvasPress = null;
	}

	function onCanvasUp() {
		pressAll = false;
		canvasPress = null;
	}

	function onPopupDown(region, event) {
		if (!region.popup || event.button !== 0) return;
		pressed = region.name;
	}

	function onPopupUp() {
		pressed = null;
	}

	$effect(() => {
		const anim = hoveredAnim;
		if (!anim) {
			frame = 0;
			return;
		}
		const count = typeof anim.frames === 'number' ? anim.frames : anim.frames.length;
		frame = 0;
		const id = setInterval(() => {
			frame = (frame + 1) % count;
		}, anim.delayMs);
		return () => clearInterval(id);
	});

	function activate(region, event) {
		if (!region.destination) return;
		if (event.detail > 1 || browser?.isArmed(region.destination)) {
			onnavigate?.(region.destination);
			return;
		}
		onpreview?.(region.destination);
	}

	function pathOf(region) {
		return usablePath(region.geometry?.d) ? region.geometry.d : region.anim?.kind === 'icon' ? BLINK_PATH : '';
	}

	function iconName(region) {
		const frames = region.anim?.frames;
		if (!Array.isArray(frames)) return 'eye';
		return hovered === region.name ? frames[frame] : frames[0];
	}

	function globeSrc() {
		const n = hoveredAnim && hoveredAnim.kind !== 'icon' ? (frame % 30) + 1 : 1;
		return imageFile(db, `globe${n}.im1.png`) ?? picture?.image;
	}

	function chompPath() {
		const half = hoveredAnim?.kind === 'chomp' ? chompHalfAngle(frame, 30) : 0;
		const r = 0.5;
		const a1 = (half * Math.PI) / 180;
		const a2 = (-half * Math.PI) / 180;
		const x1 = 0.5 + r * Math.cos(a1);
		const y1 = 0.5 + r * Math.sin(a1);
		const x2 = 0.5 + r * Math.cos(a2);
		const y2 = 0.5 + r * Math.sin(a2);
		return `M 0.5 0.5 L ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2} Z`;
	}
</script>

<svelte:window onmouseup={onPopupUp} onmousemove={onCanvasMove} />

{#if spec.error}
	<pre class="target-error">{spec.error}</pre>
{:else if picture?.image || regions.length}
	<figure class="picture">
		<!-- The overlay is anchored to the IMAGE, not the figure: normalized 0..1 geometry
		     stretched over the caption too would shift every shape downward. -->
		<div
			class="canvas"
			class:icon-stage={iconStage}
			role="presentation"
			onmousedown={onCanvasDown}
			onmouseup={onCanvasUp}
			onmouseleave={onCanvasUp}
		>
			{#if iconStage}
				{#each regions as region, i (i)}
					{#if region.anim?.kind === 'icon'}
						<div class="eye">
							<Eye name={iconName(region)} />
							<svg
								class="shape"
								class:hot={showingAll || hovered === region.name}
								viewBox="0 0 1 1"
								preserveAspectRatio="none"
								role="presentation"
								onmouseenter={() => (hovered = region.name)}
								onmouseleave={() => (hovered = null)}
								onclick={(e) => activate(region, e)}
								ondblclick={() => region.destination && onnavigate?.(region.destination)}
							>
								<path d={pathOf(region)} vector-effect="non-scaling-stroke" />
							</svg>
						</div>
					{/if}
				{/each}
			{:else}
				{#if picture?.image || hoveredAnim?.kind === 'globe' || hoveredAnim?.kind === 'chomp'}
					{#if hoveredAnim?.kind === 'chomp'}
						<svg class="chomp-defs" viewBox="0 0 1 1" aria-hidden="true">
							<clipPath id={`chomp-${spec.picture ?? 'earth'}`} clipPathUnits="objectBoundingBox">
								<path d={chompPath()} />
							</clipPath>
						</svg>
					{/if}
					<img
						class:sized={picture.width && picture.height}
						class:chomp={hoveredAnim?.kind === 'chomp'}
						style:--pic-w={picture.width}
						style:--pic-h={picture.height}
						style:clip-path={hoveredAnim?.kind === 'chomp'
							? `url(#chomp-${spec.picture ?? 'earth'})`
							: undefined}
						src={hoveredAnim && hoveredAnim.kind !== 'icon' ? globeSrc() : picture?.image}
						alt={picture.name ?? spec.picture}
						width={picture.width ?? undefined}
						height={picture.height ?? undefined}
					/>
				{/if}
				{#if engaged.length && picture?.image}
					<svg class="holes" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
						{#each lifted as region, i (i)}
							<path d={pathOf(region)} fill={HOLE} />
						{/each}
					</svg>
					{#each engaged as region, i (i)}
						<PopupChip
							id={chipId(region.name, i)}
							d={pathOf(region)}
							src={picture.image}
							dx={region.popup.dx}
							dy={region.popup.dy}
							scale={region.popup.scale}
							down={pressed === region.name}
						/>
					{/each}
				{/if}
				<!-- Keyed by position, not name: spacetel.st0 lists the HSP shape twice. -->
				{#each regions as region, i (i)}
				{#if pathOf(region)}
					<!-- Normalized 0..1, stretched to the picture, which is why one geometry
					     served 450x337, 507x598 and 533x509 renderings in 1988. -->
					<svg
						class="shape"
						class:hot={(showingAll || hovered === region.name) && !region.anim && !region.popup}
						class:popup={Boolean(region.popup)}
						viewBox="0 0 1 1"
						preserveAspectRatio="none"
						role="presentation"
						onmouseenter={() => (hovered = region.name)}
						onmouseleave={() => (hovered = null)}
						onmousedown={(e) => onPopupDown(region, e)}
						onclick={(e) => activate(region, e)}
						ondblclick={() => region.destination && onnavigate?.(region.destination)}
					>
						<path d={pathOf(region)} vector-effect="non-scaling-stroke" />
						{#if region.popup && (showingAll || hovered === region.name || pressed === region.name)}
							<!-- The promise: once it has popped, the target is the hole plus the chip. -->
							<g transform={popSvgTransform(pathOf(region), region.popup.dx, region.popup.dy, region.popup.scale)}>
								<path class="ghost" d={pathOf(region)} vector-effect="non-scaling-stroke" />
							</g>
						{/if}
					</svg>
				{/if}
				{/each}
			{/if}
		</div>
		<figcaption>
			{spec.picture ?? ''}
			{#if regions.length}
				<span class="arrow">
					{regions.length} target{regions.length > 1 ? 's' : ''}:
					{regions.map((r) => r.to ?? r.name).join(', ')}
				</span>
			{/if}
		</figcaption>
	</figure>
{:else}
	<!-- A text button: geometry came from the text it wrapped, so the label is the text. -->
	<span class="button-target">
		{#if spec.command}
			<span class="verb" title="a browser command, not an article">{spec.label ?? spec.command}</span>
		{:else if destination}
			<button
				type="button"
				class:revealed={reveal}
				class:armed={browser?.isArmed(destination)}
				onclick={(e) => {
					if (e.detail > 1 || browser?.isArmed(destination)) {
						onnavigate?.(destination);
						return;
					}
					onpreview?.(destination);
				}}
				ondblclick={() => onnavigate?.(destination)}
			>
				{spec.label || spec.to}
			</button>
		{:else if spec.to}
			<span class="dangling" title="resolves nowhere in this database">{spec.label || spec.to}</span>
		{/if}
	</span>
{/if}

<style>
	.picture {
		margin: 1.5rem 0;
		max-width: 100%;
	}
	.canvas {
		position: relative;
		display: inline-block;
		line-height: 0;
		max-width: 100%;
		user-select: none;
		-webkit-user-select: none;
	}
	.canvas.icon-stage {
		display: inline-flex;
		gap: 0.4rem;
		align-items: center;
	}
	.eye {
		position: relative;
		width: 4rem;
		height: 2rem;
	}
	.chomp-defs {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
	}
	.picture img {
		display: block;
		max-width: 100%;
		height: auto;
		image-rendering: pixelated;
	}
	.picture img.sized {
		width: calc(var(--pic-w) * 1px);
		max-width: 100%;
		height: auto;
		aspect-ratio: var(--pic-w) / var(--pic-h);
	}
	.shape {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		/* Each overlay spans the whole picture, so they stack. Only the PATH may take
		   the pointer, or the topmost rectangle would swallow every click. The hit
		   region follows the drawn shape, which is what made these targets
		   arbitrarily-shaped rather than rectangular. */
		pointer-events: none;
	}
	.shape path {
		pointer-events: fill;
		cursor: pointer;
		fill: transparent;
		stroke: transparent;
		stroke-width: 2;
	}
	.holes {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}
	.shape.hot path,
	.shape:hover:not(.popup) path {
		fill: color-mix(in oklab, var(--hot, #c8102e) 30%, transparent);
		stroke: var(--hot, #c8102e);
	}
	figcaption {
		font-size: 0.8rem;
		padding-top: 0.35rem;
	}
	.button-target {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0.2rem 0.4rem 0.2rem 0;
		vertical-align: baseline;
	}
	.button-target button {
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		border: 0;
		border-bottom: 1px solid #000;
		border-radius: 0;
		padding: 0;
		background: none;
		color: inherit;
	}
	.button-target button:hover,
	.button-target button.revealed {
		background: #000;
		color: var(--flash, #00f0d8);
		-webkit-text-fill-color: var(--flash, #00f0d8);
	}
	.button-target button.armed {
		color: #00f;
	}
	.verb {
		font-family: ui-monospace, monospace;
		font-size: 0.85rem;
		border-bottom: 1px dotted currentColor;
	}
	.dangling {
		text-decoration: underline wavy;
	}
	.target-error {
		font-size: 0.8rem;
		border-left: 3px solid crimson;
		padding-left: 0.6rem;
	}
</style>
