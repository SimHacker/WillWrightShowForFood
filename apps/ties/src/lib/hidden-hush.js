// Silence while the page's tab is out of sight. Frames stop in a hidden tab, but an audio
// context does not: a drone keeps droning. Suspended there, it picks up again on return.

/** @param {AudioContext} ctx */
export function hushWhenHidden(ctx) {
	if (typeof document === 'undefined') return;
	const sync = () => {
		if (ctx.state === 'closed') document.removeEventListener('visibilitychange', sync);
		else if (document.hidden) ctx.suspend();
		else if (ctx.state === 'suspended') ctx.resume();
	};
	document.addEventListener('visibilitychange', sync);
	if (document.hidden) ctx.suspend();
}
