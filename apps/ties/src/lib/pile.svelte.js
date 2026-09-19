/**
 * Piles: window scopes. The word and the model are HyperTIES's own, from fmt.f:
 *
 *     32 constant /piles          128 constant /path
 *     create piles /piles /n* allot
 *     variable this-pile
 *
 *     : .pile-pos  \ x y          _win_y ! _win_x !
 *     : .pile-size \ width height _win_height ! _win_width !
 *     : .new-pile  \ class        _new_pile
 *     : .pile      \ n            _use_pile this-pile !
 *
 * A pile is a window holding a STACK OF PAGES. `.page` pushes one and _zap_pages empties
 * the stack when a new article arrives, which is what FIRST / BACK PAGE / NEXT PAGE / LAST
 * move through. The visit history is the other thing, and the original kept it separately
 * at /path, 128 deep; RETURN pops that. Two axes, two stacks, both here.
 *
 * Three piles are standard, and the formatter ran the same storyboard once per pile,
 * appending a letter to the filename to say which pass it was in -- `a` for the article,
 * `d` for the definition, `c` for the controls:
 *
 *     : use-contents-pile    c~ ContentsPileID~   use-linked-pile
 *     : use-definition-pile  c~ DefinitionPileID~ use-linked-pile
 *     : use-controls-pile    c~ ControlsPileID~   use-linked-pile
 *
 * They are LINKED, which is the transclusion: the definition pile shows the definition of
 * whatever the contents pile is showing, and the controls pile commands it. Nothing about
 * the arrangement is privileged -- `.new-pile <class>` makes more, up to 32, and
 * `.pile-pos` / `.pile-size` place them, all from the storyboard.
 */
import { getArticle, homeOf, reserved, resolve } from './corpus.js';
import { paginate } from './markdown.js';

export const MAX_PILES = 32; // 32 constant /piles
export const PATH_MAX = 128; // 128 constant /path

export const CONTENTS = 'ContentsPileID';
export const DEFINITION = 'DefinitionPileID';
export const CONTROLS = 'ControlsPileID';

/** Which pass over the storyboard a pile renders, as execute-storyboard spelled it. */
export const PASS = { article: 'a', definition: 'd', controls: 'c' };

/**
 * The outermost bubble: `do_name_pile` is `cvn userdict exch PileID put`, so a named pile
 * is visible everywhere that nothing nearer shadows it. Lookup reaches here last.
 */
export const globalPiles = new Map();

let nextId = 0;

export class Pile {
	name;
	pileClass;
	pass;
	id = `pile-${nextId++}`;

	title = $state('');
	x = $state(0);
	y = $state(0);
	width = $state(0);
	height = $state(0);

	/** The visit path, newest last. Capped at PATH_MAX as the original was. */
	path = $state([]);
	/** Index into the path. Behind the end means there is somewhere to go forward to. */
	cursor = $state(-1);
	/** Which page of the current article, within this pile. */
	page = $state(0);
	/** The last database visited, so an emptied pile still knows where it was. */
	lastDb = $state(null);

	/**
	 * The bubble this bubble was made inside. `MP` sets it to whichever pile was current:
	 * "Make new pile's parent the current pile, or itsself if no current pile".
	 */
	parent = null;

	/**
	 * Names visible from inside this pile. This is the membrane: a pile is a dictionary,
	 * and linking piles together is only ever binding a name in one pile's dictionary to
	 * another pile. `.link-parent-pile` writes into the PARENT's dictionary, which is how
	 * a child announces itself to the bubble that contains it.
	 */
	scope = $state(new Map());

	/**
	 * Whether this pile's position is the leader's. The definition pile shows the
	 * definition PASS of whatever the contents pile is showing, which the 1988 browser
	 * achieved by reformatting into it; mirroring is that, declared rather than pushed.
	 * The controls pile does NOT mirror -- it holds its own article, the panel.
	 */
	mirrors = false;

	constructor({
		name = 'pile',
		pileClass = 'Pile',
		pass = PASS.article,
		title = '',
		parent = null,
		mirrors = false
	} = {}) {
		this.name = name;
		this.pileClass = pileClass;
		this.pass = pass;
		this.title = title;
		this.parent = parent;
		this.mirrors = mirrors;
	}

	// The membrane -----------------------------------------------------------------

	/**
	 * Resolve a pile name the way the dict stack does: this pile's own bindings first,
	 * then outward through the bubbles that contain it, then the global names. So
	 * `lookup(CONTENTS)` is one expression that means different piles depending on where
	 * it is asked from, which is what let one `use-contents-pile` serve every pile.
	 *
	 * Reports WHERE it resolved, because a chain like this fails by succeeding. Miss a
	 * binding and resolution keeps walking outward until something answers, and what
	 * answers is a real pile that works -- a second workspace's contents pile driven by
	 * the first workspace's panel, every button live, no error anywhere. Ubik's regression
	 * of form is this exact algorithm: "the specific binding stops matching, and you fall
	 * UP the chain," and the horror is that the ancestor still runs
	 * (moollm designs/pkd/ubik.md). So the resolution site is part of the answer.
	 */
	resolve(name) {
		for (let pile = this; pile; pile = pile.parent) {
			const found = pile.scope.get(name);
			if (found) return { pile: found, foundIn: pile, scope: pile === this ? 'own' : 'ancestor' };
		}
		const global = globalPiles.get(name);
		if (global) return { pile: global, foundIn: null, scope: 'global' };
		return { pile: null, foundIn: null, scope: 'unbound' };
	}

	lookup(name) {
		return this.resolve(name).pile;
	}

	/**
	 * The triad is bound inside each of its own members, so for these three names anything
	 * but a local hit means the membrane leaked. Global is the dangerous one rather than
	 * the harmless one: it answers with a stranger's pile instead of nothing.
	 */
	lookupStrict(name) {
		const found = this.resolve(name);
		if (import.meta.env?.DEV && found.scope !== 'own') {
			console.warn(
				`pile ${this.name} (${this.id}) resolved ${name} from ${found.scope}` +
					`${found.foundIn ? ` pile ${found.foundIn.name}` : ''}: ` +
					'expected its own binding. A wrong pile here still works, which is why this warns.'
			);
		}
		return found.pile;
	}

	/** Bind a name inside this pile. */
	bind(name, pile) {
		this.scope.set(name, pile);
		this.scope = new Map(this.scope);
	}

	/** do_name_pile: `cvn userdict exch PileID put`. A name every bubble can see. */
	nameGlobally(name = this.name) {
		globalPiles.set(name, this);
	}

	/** do_link_parent_pile: announce this pile to its parent, under a name. */
	linkToParent(name = this.name) {
		this.parent?.bind(name, this);
	}

	/** The pile this one reads and commands: its contents pile, resolved from here. */
	get leader() {
		const found = this.lookupStrict(CONTENTS);
		return found && found !== this ? found : null;
	}

	// Where we are ---------------------------------------------------------------

	/** A mirroring pile has no position of its own: it reads its leader's. */
	get here() {
		if (this.mirrors) return this.leader?.here ?? null;
		return this.path[this.cursor] ?? null;
	}

	/**
	 * Which database this pile is in. Falls back to the last one it was in, so that a pile
	 * emptied by QUIT still knows where it has been and HOME can reopen it. Leaving a
	 * database should not be the same as forgetting which one it was.
	 */
	get db() {
		return this.here?.db ?? this.lastDb;
	}

	get article() {
		const h = this.here;
		return h ? getArticle(h.db, h.slug) : null;
	}

	get pages() {
		const body = this.article?.body;
		return body === undefined ? [''] : paginate(body);
	}

	get pageCount() {
		return this.pages.length;
	}

	/** Clamped, so a shorter article after navigation cannot leave the page out of range. */
	get pageIndex() {
		return Math.min(Math.max(this.page, 0), this.pageCount - 1);
	}

	get currentPage() {
		return this.pages[this.pageIndex] ?? '';
	}

	get depth() {
		return this.cursor;
	}

	// What the control panel reads ------------------------------------------------
	//
	// The storyboard lays the buttons out; whether each one applies is the browser's
	// business, and these are what it consults. Inapplicable means disabled, not hidden:
	// the panel keeps its shape so the buttons stay where the hand learned they are.

	get canPageBack() {
		return this.pageIndex > 0;
	}

	get canPageNext() {
		return this.pageIndex < this.pageCount - 1;
	}

	get canReturn() {
		return this.cursor > 0;
	}

	get canForward() {
		return this.cursor >= 0 && this.cursor < this.path.length - 1;
	}

	get hasContents() {
		return Boolean(this.article) && this.article.contents !== false;
	}

	// Moving ---------------------------------------------------------------------

	/**
	 * Visit an article. Going somewhere new from the middle of the path discards the
	 * forward tail, as every browser since has done.
	 */
	go(db, slug) {
		if (!db || !slug) return false;
		const path = this.path.slice(0, this.cursor + 1);
		path.push({ db, slug });
		this.path = path.length > PATH_MAX ? path.slice(path.length - PATH_MAX) : path;
		this.cursor = this.path.length - 1;
		this.page = 0;
		this.lastDb = db;
		return true;
	}

	/** Open a name through the index rather than a slug, reserved names included. */
	goNamed(name, db = this.db) {
		const hit = resolve(db, name) ?? reserved(db, name);
		return hit?.slug ? this.go(db, hit.slug) : false;
	}

	/** Where a database opens: its !home article. */
	goHome(db = this.db) {
		const slug = homeOf(db);
		return slug ? this.go(db, slug) : false;
	}

	/** RETURN: back along the visit path. */
	ret() {
		if (!this.canReturn) return false;
		this.cursor -= 1;
		this.page = 0;
		return true;
	}

	forward() {
		if (!this.canForward) return false;
		this.cursor += 1;
		this.page = 0;
		return true;
	}

	goPage(n) {
		const clamped = Math.min(Math.max(n, 0), this.pageCount - 1);
		if (clamped === this.pageIndex) return false;
		this.page = clamped;
		return true;
	}

	/** _zap_pages: empty the pile. */
	zap() {
		this.path = [];
		this.cursor = -1;
		this.page = 0;
	}

	/**
	 * A pile is clonable, which is the whole of HyperLook's argument about property
	 * sheets: an inspector is a stack like any other, so you can copy one and edit it.
	 * The clone carries the history, and is thereafter independent.
	 */
	clone({ name = `${this.name}-copy` } = {}) {
		const copy = new Pile({
			name,
			pileClass: this.pileClass,
			pass: this.pass,
			title: this.title,
			parent: this.parent,
			mirrors: this.mirrors
		});
		// The clone joins the same bubble under its own name, so its siblings stay
		// reachable: copying a pile should not cut it off from what it was linked to.
		copy.scope = new Map(this.scope);
		copy.path = [...this.path];
		copy.cursor = this.cursor;
		copy.page = this.page;
		copy.x = this.x;
		copy.y = this.y;
		copy.width = this.width;
		copy.height = this.height;
		return copy;
	}
}

/**
 * One browser: the three standard piles, linked. The definition and controls piles read
 * the contents pile rather than navigating on their own, so transcluding them below the
 * article is just rendering them.
 */
export class Browser {
	contents;
	definition;
	controls;

	constructor({ db = null, panel = 'control-panel' } = {}) {
		this.contents = new Pile({ name: CONTENTS, pass: PASS.article, pileClass: 'ContentsPile' });
		this.definition = new Pile({
			name: DEFINITION,
			pass: PASS.definition,
			pileClass: 'DefinitionPile',
			// init-definition sets the window title, so the pile is a titled window.
			title: 'Definition',
			parent: this.contents,
			mirrors: true
		});
		// The control panel is an ordinary article in an ordinary pile, pointed at
		// !Control Panel by default and at any article you like instead. That is how a
		// database ships its own panel without the reader knowing anything about it.
		this.controls = new Pile({
			name: CONTROLS,
			pass: PASS.controls,
			pileClass: 'ControlsPile',
			parent: this.contents
		});

		// The hookup, as SDP / SCP / SAP do it: every pile of the triad gets a name for
		// each of the others, bound inside its own membrane. After this, `lookup(CONTENTS)`
		// answers from any of the three, which is what let one `use-contents-pile` serve
		// them all.
		for (const pile of [this.contents, this.definition, this.controls]) {
			pile.bind(CONTENTS, this.contents);
			pile.bind(DEFINITION, this.definition);
			pile.bind(CONTROLS, this.controls);
		}

		this.controls.goNamed('Control Panel', panel);
		if (db) this.contents.goHome(db);
	}

	get here() {
		return this.contents.here;
	}

	get piles() {
		return [this.contents, this.definition, this.controls];
	}
}

/**
 * A workspace of browsers -- left pile, right pile, whatever you want -- which are
 * independent until synchronized, at which point navigating one navigates them all.
 */
export class Workspace {
	browsers = $state([]);
	synchronized = $state(false);

	constructor(dbs = []) {
		this.browsers = dbs.map((db) => new Browser({ db }));
	}

	open(db) {
		if (this.browsers.length >= MAX_PILES) return null;
		const browser = new Browser({ db });
		this.browsers = [...this.browsers, browser];
		return browser;
	}

	close(browser) {
		this.browsers = this.browsers.filter((b) => b !== browser);
	}

	/**
	 * Navigate, respecting the synchronize flag. Synchronized piles follow by NAME rather
	 * than by slug, so two piles showing different databases still track each other when
	 * the name resolves in both, and simply stay put when it does not.
	 */
	navigate(browser, db, slug) {
		const moved = browser.contents.go(db, slug);
		if (!moved || !this.synchronized) return moved;
		const article = getArticle(db, slug);
		for (const other of this.browsers) {
			if (other === browser) continue;
			const target = other.contents.db ?? db;
			if (target === db) other.contents.go(db, slug);
			else if (article) other.contents.goNamed(article.title, target);
		}
		return true;
	}
}
