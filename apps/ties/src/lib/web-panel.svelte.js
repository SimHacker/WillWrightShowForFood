/**
 * The viewer in a machine page's outline (WebPanel.svelte): a YouTube video, a file from GitHub
 * read in place, or any other page in a frame. One at a time, for the whole page: in the
 * viewer's own node, or, for a view opened with `top`, above the whole outline. A plain click on a YouTube link, a GitHub file link or a link marked
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
 * `raw` is where a GitHub file is fetched from, since GitHub will not be shown in a frame: read
 * in place as `markdown` or `text`, or a `pdf` given to the browser's own reader. A `card` is a
 * site that refuses frames: its name, `about` and the way out.
 * @typedef {'youtube' | 'markdown' | 'text' | 'pdf' | 'web' | 'card'} ViewKind
 * A `top` view pops up unasked, as the grue's video does: it shows at the top of the outline,
 * above every node, until it is closed, rather than in the viewer's own place.
 * @typedef {{ kind: ViewKind, url: string, src: string, raw: string, title: string, about: string, buttons: WebButton[], reveal: boolean, top: boolean }} WebView
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

/** What the viewer makes of a GitHub file by its extension; anything else is GitHub's to show. */
const TEXT = /\.(txt|s|asm|mac|c|cc|cpp|h|hpp|js|mjs|ts|py|rb|go|rs|lisp|lsp|el|fs|f|fth|sh|yml|yaml|json|tsv|csv|toml|ini|cfg)$/i;

/**
 * Where a GitHub link's file is, raw, and what it is: a file's blob page, a folder's tree page
 * or a repository's front page for its README, a wiki page, a profile for its README. Null for
 * anything else, and for files the viewer cannot show.
 * @param {string} url
 * @returns {{ raw: string, as: 'markdown' | 'text' | 'pdf' } | null}
 */
export function githubRaw(url) {
	let u;
	try {
		u = new URL(url, globalThis.location?.href);
	} catch {
		return null;
	}
	if (u.hostname !== 'github.com') return null;
	const at = (/** @type {string} */ path) => `https://raw.githubusercontent.com/${path}`;
	const parts = u.pathname.split('/').filter(Boolean).map(decodeURIComponent);
	const [owner, repo, how, ref, ...rest] = parts;
	if (!owner) return null;
	if (parts.length === 1) return { raw: at(`${owner}/${owner}/HEAD/README.md`), as: 'markdown' };
	if (parts.length === 2) return { raw: at(`${owner}/${repo}/HEAD/README.md`), as: 'markdown' };
	if (how === 'wiki') return { raw: at(`wiki/${owner}/${repo}/${parts[3] ?? 'Home'}.md`), as: 'markdown' };
	if ((how !== 'blob' && how !== 'tree') || !ref) return null;
	const path = rest.join('/');
	const base = `${owner}/${repo}/${ref}`;
	if (how === 'tree') return { raw: at(`${base}/${path ? `${path}/` : ''}README.md`), as: 'markdown' };
	if (/\.(md|markdown)$/i.test(path)) return { raw: at(`${base}/${path}`), as: 'markdown' };
	if (/\.pdf$/i.test(path)) return { raw: at(`${base}/${path}`), as: 'pdf' };
	if (TEXT.test(path)) return { raw: at(`${base}/${path}`), as: 'text' };
	return null;
}

/**
 * Sites that will not be shown inside another site's page (X-Frame-Options or a CSP
 * frame-ancestors), found by asking each link About makes, 27 November 2026. The viewer shows
 * a card for these, with the way out, rather than a blank frame.
 */
const REFUSES = ['github.com', 'patreon.com', 'retrocomputingforum.com', 'npmjs.com', 'destroyallsoftware.com', 'youtube.com', 'youtu.be'];

/** Whether a link's site refuses to be shown in a frame, as far as is known. @param {string} url */
export function refuses(url) {
	try {
		const host = new URL(url, globalThis.location?.href).hostname;
		return REFUSES.some((h) => host === h || host.endsWith(`.${h}`));
	} catch {
		return false;
	}
}

/** Whether the viewer shows this link, rather than leaving it to the browser. @param {string} url */
export function viewable(url) {
	return !!youtube(url) || !!githubRaw(url);
}

/**
 * Open a link in the viewer and open its row. `reveal` scrolls to it: a link clicked, or a
 * watch that opens it unasked. What is open already stays as it is, and is scrolled to again.
 * @param {string} url @param {{ title?: string, about?: string, buttons?: WebButton[], reveal?: boolean, top?: boolean }} [opts]
 */
export function openWeb(url, opts = {}) {
	webPanel.open = true;
	if (opts.reveal) webPanel.reveals++;
	if (webPanel.view?.url === url && webPanel.view.top === !!opts.top) {
		if (opts.reveal) webPanel.view.reveal = true;
		return;
	}
	const yt = youtube(url);
	const gh = githubRaw(url);
	const common = { url, buttons: opts.buttons ?? [], reveal: !!opts.reveal, about: opts.about ?? '', top: !!opts.top };
	webPanel.view = yt
		? { ...common, kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1${yt.start ? `&start=${yt.start}` : ''}`, raw: '', title: opts.title ?? 'YouTube' }
		: gh
			? { ...common, kind: gh.as, src: url, raw: gh.raw, title: opts.title ?? url }
			: { ...common, kind: refuses(url) ? 'card' : 'web', src: url, raw: '', title: opts.title ?? url };
}

export function closeWeb() {
	webPanel.view = null;
}
