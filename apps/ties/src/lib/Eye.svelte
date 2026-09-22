<script>
	/**
	 * NeWS Icon font eye, reincarnated. /eye_bld3 /eye_bld2 /eye_bld1 are bloody
	 * (bloodshot) — not lids. /eye /eye1–4 are the clear frames.
	 */
	let { name } = $props();

	const BLOOD = {
		eye_bld3: 1,
		eye_bld2: 0.66,
		eye_bld1: 0.33
	};

	const LOOK = {
		eye: [0, 0],
		eye1: [-0.06, 0],
		eye2: [0.06, 0],
		eye3: [0, -0.04],
		eye4: [0, 0.03]
	};

	const blood = $derived(BLOOD[name] ?? 0);
	const look = $derived(LOOK[name] ?? [0, 0]);
	const sclera = $derived(blood ? `oklch(0.88 0.12 ${20 + blood * 20})` : '#fff');
</script>

<svg viewBox="0 0 1 1" aria-hidden="true">
	<ellipse cx="0.5" cy="0.5" rx="0.46" ry="0.28" fill="#111" />
	<ellipse cx="0.5" cy="0.5" rx="0.4" ry="0.22" fill={sclera} />
	{#if blood > 0.2}
		<path
			d="M 0.18 0.48 Q 0.32 0.42 0.42 0.5"
			fill="none"
			stroke="#c00"
			stroke-width={0.02 * blood}
		/>
		<path
			d="M 0.82 0.5 Q 0.68 0.44 0.58 0.5"
			fill="none"
			stroke="#c00"
			stroke-width={0.02 * blood}
		/>
	{/if}
	{#if blood > 0.5}
		<path d="M 0.22 0.56 Q 0.34 0.6 0.44 0.54" fill="none" stroke="#a00" stroke-width="0.015" />
	{/if}
	<circle cx={0.5 + look[0]} cy={0.5 + look[1]} r="0.12" fill="#111" />
	<circle cx={0.47 + look[0]} cy={0.47 + look[1]} r="0.035" fill="#fff" />
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
