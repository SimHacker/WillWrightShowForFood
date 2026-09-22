/**
 * The browser verbs. A control panel storyboard names one as a target destination:
 *
 *     RETURN
 *     .target return-button
 *     !OptionReturn
 *
 * so the STORYBOARD decides which buttons exist, what they are called and where they sit,
 * and this file decides only what each verb means and when it applies. That split is why
 * the panel is not chrome: it is an ordinary article, and a database can ship its own,
 * clone it, cut a button, add one, reorder them, without touching the reader.
 *
 * Whether a verb applies is the browser's business rather than the storyboard's, and
 * `applies` answers it by reading the pile. Inapplicable comes out DISABLED rather than
 * hidden: the panel keeps its shape, so the buttons stay where the hand learned they are.
 *
 * Two axes, as the original had two stacks. `.page` pushes onto the pile's page stack and
 * FIRST / BACK PAGE / NEXT PAGE / LAST move through that; the visit path is separate, was
 * /path 128 deep, and RETURN pops it. The archive's panel puts BACK PAGE on the page axis.
 * A panel that would rather have browser-style history back and forward says
 * !OptionHistoryBack and !OptionHistoryForward instead, and nothing else changes.
 */
import { articleList, homeOf, reserved } from './corpus.js';
import { ROOT } from './href.js';

/** A verb: label is only a fallback, since the storyboard supplies its own. */
export const commands = {
	// The page axis: within the article showing in this pile.
	'!OptionFirst': {
		label: 'FIRST',
		title: 'first page of this article',
		applies: (pile) => pile.canPageBack,
		run: (pile) => pile.pageFirst()
	},
	'!OptionBack': {
		label: 'BACK PAGE',
		title: 'previous page of this article',
		applies: (pile) => pile.canPageBack,
		run: (pile) => pile.pageBack()
	},
	'!OptionNext': {
		label: 'NEXT PAGE',
		title: 'next page of this article',
		applies: (pile) => pile.canPageNext,
		run: (pile) => pile.pageNext()
	},
	'!OptionLast': {
		label: 'LAST',
		title: 'last page of this article',
		applies: (pile) => pile.canPageNext,
		run: (pile) => pile.pageLast()
	},

	// The path axis: where this pile has been.
	'!OptionReturn': {
		label: 'RETURN',
		title: 'back to where you came from',
		applies: (pile) => pile.canReturn,
		run: (pile) => pile.ret()
	},
	'!OptionHistoryBack': {
		label: 'BACK',
		title: 'back along the visit path',
		applies: (pile) => pile.canReturn,
		run: (pile) => pile.ret()
	},
	'!OptionHistoryForward': {
		label: 'FORWARD',
		title: 'forward along the visit path',
		applies: (pile) => pile.canForward,
		run: (pile) => pile.forward()
	},

	// Reserved articles, reached through the index like anything else.
	'!OptionTopics': {
		label: 'TOPICS',
		title: 'the table of topics',
		applies: (pile) => Boolean(reserved(pile.db, 'topics')),
		run: (pile) => pile.goNamed('!topics')
	},
	'!OptionIndex': {
		label: 'INDEX',
		title: 'the master index',
		applies: (pile) => Boolean(reserved(pile.db, 'index')),
		run: (pile) => pile.goNamed('!index')
	},
	'!OptionHome': {
		label: 'HOME',
		title: 'HyperTIES, the site',
		// Site root. The database door is the breadcrumb, not this verb.
		applies: () => Boolean(homeOf(ROOT)),
		run: (pile) => pile.goRoot()
	},

	'!Full-Entry': {
		label: 'FULL ENTRY',
		title: 'read the whole article',
		// found-contents?: no `.contents` directive, no button. The 1988 formatter settled
		// this while laying the definition out, which is why it is a property of the
		// article rather than something to discover on the click.
		applies: (pile) => pile.hasContents,
		run: (pile) => pile.goPage(0)
	},
	'!OptionShow': {
		label: 'SHOW',
		title: 'show the picture full size — not hooked up',
		// 1988: enlarge the current article's picture. Never wired here; run is a stub.
		applies: () => false,
		run: () => false
	},
	'!OptionSearch': {
		label: 'SEARCH',
		title: 'search this database — not hooked up',
		applies: () => false,
		run: () => false
	},
	'!OptionRefresh': {
		label: 'REFRESH',
		title: 'redraw',
		applies: () => true,
		run: () => true
	},
	'!OptionQuit': {
		label: 'QUIT',
		title: 'leave this database',
		// Nothing to quit once quit. HOME stays live, since the pile remembers which
		// database it left, so this is a door rather than a trapdoor.
		applies: (pile) => Boolean(pile.here),
		run: (pile) => pile.zap()
	},
	'!OptionFree': {
		label: 'FREE',
		title: 'free the current article',
		// Commented out of the 1988 panel with `.rem FREE`, and kept here so that a panel
		// which uncomments it gets a button that is honestly disabled rather than missing.
		applies: () => false,
		run: () => false
	}
};

/** Does this destination name a verb, or an article? */
export function isCommand(name) {
	return typeof name === 'string' && name.startsWith('!Option');
}

export function lookupCommand(name) {
	return commands[name] ?? null;
}

/**
 * A verb resolved against a pile: what to draw and whether it is live. An unknown verb is
 * reported rather than dropped, because a panel naming a verb the reader has never heard
 * of is a fact worth seeing on the screen.
 */
export function bind(name, pile, label) {
	const command = commands[name];
	if (!command) {
		return {
			name,
			label: label ?? name,
			title: `no such verb: ${name}`,
			enabled: false,
			unknown: true,
			run: () => false
		};
	}
	return {
		name,
		label: label ?? command.label,
		title: command.title,
		enabled: Boolean(pile) && command.applies(pile),
		unknown: false,
		run: () => (pile ? command.run(pile) : false)
	};
}

/** The article list, for a database whose index article is missing. */
export function fallbackIndex(db) {
	return articleList(db);
}
