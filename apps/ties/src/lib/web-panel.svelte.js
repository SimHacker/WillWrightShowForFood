/**
 * The viewer at the top of a machine page's outline (WebPanel.svelte): a YouTube video, a
 * markdown file from GitHub read in place, or any other page in a frame. One at a time, for
 * the whole page. A plain click on a YouTube link, a GitHub markdown link or a link marked
 * `data-view` opens it here and scrolls to it; a click with ⌘ or Ctrl, or the middle button,
 * is the browser's, and opens a tab. A watch such as Zork's grue (pdp10.svelte.js) opens it
 * with buttons of its own.
 */

/**
 * A control the opener adds to the viewer's row: a button, or with `checked` a checkbox,
 * ticked while that says so, that `action` flips.
 * @typedef {{ label: string, title: string, action: () => void, checked?: () => boolean }} WebButton
 */
/**
 * `raw` is where a markdown file's text is fetched from; GitHub will not be shown in a frame.
 * @typedef {{ kind: 'youtube' | 'markdown' | 'web', url: string, src: string, raw: string, title: string, buttons: WebButton[], reveal: boolean }} WebView
 */

/**
 * `reveals` counts the asks to scroll to it, so a second ask for what is open scrolls again;
 * `open` is the outline row's, and any ask opens it.
 */
export const webPanel = $state({ /** @type {WebView | null} */ view: null, reveals: 0, open: true });

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
 * Where a GitHub markdown link's text is, raw: a file's blob page, or a folder's tree page for
 * its README.md. Null for anything else.
 * @param {string} url
 */
export function githubMarkdown(url) {
	let u;
	try {
		u = new URL(url, globalThis.location?.href);
	} catch {
		return null;
	}
	if (u.hostname !== 'github.com') return null;
	const m = /^\/([^/]+)\/([^/]+)\/(blob|tree)\/([^/]+)(\/.*)?$/.exec(u.pathname);
	if (!m) return null;
	const [, owner, repo, how, ref, path = ''] = m;
	const file = how === 'tree' ? `${path.replace(/\/$/, '')}/README.md` : path;
	if (!/\.(md|markdown)$/i.test(file)) return null;
	return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}${file}`;
}

/** Whether the viewer shows this link, rather than leaving it to the browser. @param {string} url */
export function viewable(url) {
	return !!youtube(url) || !!githubMarkdown(url);
}

/**
 * Open a link in the viewer and open its row. `reveal` scrolls to it: a link clicked, or a
 * watch that opens it unasked. What is open already stays as it is, and is scrolled to again.
 * @param {string} url @param {{ title?: string, buttons?: WebButton[], reveal?: boolean }} [opts]
 */
export function openWeb(url, opts = {}) {
	webPanel.open = true;
	if (opts.reveal) webPanel.reveals++;
	if (webPanel.view?.url === url) {
		if (opts.reveal) webPanel.view.reveal = true;
		return;
	}
	const yt = youtube(url);
	const md = githubMarkdown(url);
	const common = { url, buttons: opts.buttons ?? [], reveal: !!opts.reveal };
	webPanel.view = yt
		? { ...common, kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1${yt.start ? `&start=${yt.start}` : ''}`, raw: '', title: opts.title ?? 'YouTube' }
		: md
			? { ...common, kind: 'markdown', src: url, raw: md, title: opts.title ?? url }
			: { ...common, kind: 'web', src: url, raw: '', title: opts.title ?? url };
}

export function closeWeb() {
	webPanel.view = null;
}
