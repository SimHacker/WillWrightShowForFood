<script>
	/**
	 * A notched speed slider: drag the puck, click a notch, or use the arrow keys.
	 * `rates` runs slowest first; a rate with `trace` set is drawn in the trace color.
	 * @type {{ rates: { label: string, title: string, trace?: unknown }[], index: number, onpick: (i: number) => void, label?: string, keys?: string }}
	 */
	let { rates, index, onpick, label = 'Speed, slowest to fastest', keys = '' } = $props();

	const NOTCH = 14;
	const PUCK = 40;
	let dragging = $state(false);

	/** @param {number} i */
	function pick(i) {
		const to = Math.max(0, Math.min(rates.length - 1, i));
		if (to !== index) onpick(to);
	}

	/** @param {PointerEvent & { currentTarget: HTMLElement }} e */
	function at(e) {
		const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
		return Math.round((x - PUCK / 2) / NOTCH);
	}

	/** @param {PointerEvent & { currentTarget: HTMLElement }} e */
	function down(e) {
		if (e.button !== 0) return;
		dragging = true;
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
		pick(at(e));
	}

	/** @param {KeyboardEvent} e */
	function key(e) {
		const to = { ArrowLeft: index - 1, ArrowDown: index - 1, ArrowRight: index + 1, ArrowUp: index + 1, Home: 0, End: rates.length - 1 }[e.key];
		if (to === undefined) return;
		e.preventDefault();
		pick(to);
	}
</script>

<span
	class="rate"
	class:dragging
	role="slider"
	tabindex="0"
	data-keep-focus
	aria-label={label}
	aria-valuemin="0"
	aria-valuemax={rates.length - 1}
	aria-valuenow={index}
	aria-valuetext={rates[index]?.title}
	title="{rates[index]?.title}. Drag, or use the arrow keys.{keys ? ` ${keys}` : ''}"
	style:width="{(rates.length - 1) * NOTCH + PUCK}px"
	onpointerdown={down}
	onpointermove={(e) => dragging && pick(at(e))}
	onpointerup={() => (dragging = false)}
	onpointercancel={() => (dragging = false)}
	onkeydown={key}
>
	{#each rates as r, i (i)}
		<span class="rate-notch" class:trace={r.trace} style:left="{i * NOTCH + PUCK / 2}px"></span>
	{/each}
	<span class="rate-puck" class:trace={rates[index]?.trace} style:left="{index * NOTCH}px" style:width="{PUCK}px"
		>{rates[index]?.label}</span
	>
</span>

<style>
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
</style>
