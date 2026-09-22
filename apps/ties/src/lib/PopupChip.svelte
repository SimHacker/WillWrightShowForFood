<script>
	/**
	 * The popped canvas: the applied picture, clipped to ItemPath, translated
	 * and scaled. Not a cached raster. Drop-shadow is the 1991 pop-out, not
	 * the NeWS .cc file. `down` slams it into the hole; release lifts it.
	 */
	import { pathCentroid } from './popup.js';

	let { d, src, dx, dy, scale, id, down = false } = $props();

	const c = $derived(pathCentroid(d));
	const origin = $derived(`${c.x * 100}% ${c.y * 100}%`);
	const transform = $derived(
		down ? 'translate(0%, 0%) scale(1)' : `translate(${dx * 100}%, ${-dy * 100}%) scale(${scale})`
	);
</script>

<svg
	class="pop"
	class:down
	viewBox="0 0 1 1"
	preserveAspectRatio="none"
	aria-hidden="true"
	style:transform-origin={origin}
	style:transform
>
	<defs>
		<clipPath id={id} clipPathUnits="userSpaceOnUse">
			<path {d} />
		</clipPath>
	</defs>
	<image
		href={src}
		width="1"
		height="1"
		preserveAspectRatio="none"
		clip-path="url(#{id})"
	/>
</svg>

<style>
	.pop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: visible;
		filter: drop-shadow(2px 3px 2px rgb(0 0 0 / 0.45));
		z-index: 2;
	}
	.pop.down {
		filter: none;
	}
</style>
