/**
 * The panel under a machine page's toolbar that plays a YouTube video or shows a web page
 * (WebPanel.svelte). One at a time, for the whole page: a plain click on a YouTube link opens
 * it here, as does a link marked `data-view` for any other page, and a watch such as Zork's
 * grue (pdp10.svelte.js) opens it with buttons of its own at the top right.
 */

/**
 * A control the opener adds to the panel's bar: a button, or with `checked` a checkbox, ticked
 * while that says so, that `action` flips.
 * @typedef {{ label: string, title: string, action: () => void, checked?: () => boolean }} WebButton
 */
/**
 * @typedef {{ kind: 'youtube' | 'web', url: string, src: string, title: string, buttons: WebButton[] }} WebView
 */

export const webPanel = $state({ /** @type {WebView | null} */ view: null });

/** The video a YouTube link names, and where it starts; null for any other link. @param {string} url */
export function youtube(url) {
	let u;
	try {
		u = new URL(url, globalThis.location?.href);
	} catch {
		return null;
	}
	const host = u.hostname.replace(/^(www\.|m\.)/, '');
	let id = '';
	if (host === 'youtu.be') id = u.pathname.slice(1);
	else if (host === 'youtube.com' || host === 'youtube-nocookie.com') id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? '';
	if (!/^[\w-]{11}$/.test(id)) return null;
	const t = u.searchParams.get('t') ?? u.searchParams.get('start') ?? '';
	const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(t);
	const start = m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0;
	return { id, start };
}

/**
 * Open a link in the panel: a YouTube video plays at once, anything else is shown as a page.
 * @param {string} url @param {{ title?: string, buttons?: WebButton[] }} [opts]
 */
export function openWeb(url, opts = {}) {
	const yt = youtube(url);
	webPanel.view = yt
		? { kind: 'youtube', url, src: `https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1${yt.start ? `&start=${yt.start}` : ''}`, title: opts.title ?? 'YouTube', buttons: opts.buttons ?? [] }
		: { kind: 'web', url, src: url, title: opts.title ?? url, buttons: opts.buttons ?? [] };
}

export function closeWeb() {
	webPanel.view = null;
}
