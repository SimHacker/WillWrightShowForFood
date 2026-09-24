/**
 * What SYMELEC's lightbuttons do, from the PIXIE user manual (Lemke 1972,
 * appendix 4: characters/heinz-lemke/sources/phd-thesis-1972/annotated/
 * 07-appendix-4-pixie-user-manual.md), keyed by what the display list says
 * drew them. Each lightbutton is one DDS block, and its linkage address is
 * the identity SYMELEC itself dispatches pen hits on. The ring's six slots
 * are fixed blocks in LBD; the letters in them change with the mode and the
 * set, so a ring letter is read in the context of the whole ring.
 */
import { strokeText } from '@wwsff/cabinet';

const COMMANDS = {
	DR: 'Enter drawing mode, turn off blink.',
	HV: 'Constrain line drawing to horizontal and vertical. The default.',
	RU: 'Select “rubber band” line drawing: a straight line from the start to the cross.',
	SF: 'Start or finish segment. Same as the S/F control button in the ring.',
	PO: 'Enter pointing mode. Turn off blink.',
	AT: 'If something is blinking, make the current cross position an attachment point.',
	IN: 'Change intensity. Not yet implemented in 1972.',
	SC: 'Change scale. Not yet implemented in 1972.',
	CA: 'If something is blinking, catalogue it as a new basic symbol.',
	RE: 'If something is blinking, catalogue a copy at half size, without attachment points.',
	RO: 'If something is blinking, catalogue a copy rotated 90°, without attachment points.',
	EN: 'End current group. Turn off blink.'
};

const PIXIE =
	'Pointing at the name deletes the drawing-mode control buttons and IN, SC, CA, RE and RO, to free core for a drawing of about 50 nodes and branches. Make sure you won’t need them.';

const RING = [0o53, 0o62, 0o71, 0o100, 0o107, 0o116];
const SEGMENT_SLOT = 0o53;
const SET_SLOT = 0o62;

const CONTROL = {
	S: ['Start segment', 'Track the cross and a trail of light follows it. Point at F to finish.'],
	F: ['Finish segment', 'Freeze the segment and add it to the schematic. Same place as S.'],
	A: ['Second set', 'Show the second set of symbol buttons.'],
	B: ['First set', 'Show the first set of symbol buttons.']
};

const insert = (what, type) => [
	`Insert ${what}`,
	`Into the current segment, if HV constraints are on, turned to the drawing direction. Type no. ${type}.`
];

const SETS = [
	{ R: insert('a resistor', 1), C: insert('a capacitor', 2), L: insert('an inductor', 3), S: insert('a switch', 6) },
	{ V: insert('a voltage source', 4), I: insert('a current source', 5), U: insert('a nullator', 10), O: insert('a norator', 7) },
	{ I: insert('an arc', 11), Q: insert('a semicircle', 12), M: insert('a rule (metric)', 13) },
	{ S: insert('a rectangle', 15), C: insert('a circle', 16), T: insert('a triangle', 17), D: insert('a diamond', 20) }
];

const POINTING = {
	C: ['Copy', 'If something is blinking, copy it and enter tracking mode.'],
	E: ['Erase', 'If something is blinking, erase it.'],
	T: ['Track', 'If something is blinking, move it with the cross.'],
	M: ['More', 'Change the context marker to include more of the picture.'],
	L: ['Less', 'Change the context marker to include less of the picture.'],
	G: ['Group', 'If something is blinking, add it to the current group.']
};

const TRACK = 0o5637;
const WAREA = [0o5272, 0o5303];
const PICTURE = 0o12301;

const tip = ([title, text]) => ({ title, text });

function ringLetters(segments) {
	const bySlot = new Map(RING.map((a) => [a, []]));
	for (const s of segments) if (s.intensify && bySlot.has(s.subr)) bySlot.get(s.subr).push(s);
	return new Map([...bySlot].map(([a, g]) => [a, strokeText(g)]));
}

/** hover (packages/cabinet hover.ts) and the frame's segments → { title, text } or null. */
export function symelecHint(h, segments) {
	const s = h.hit;
	if (s.block === TRACK) {
		return {
			title: 'Tracking cross',
			text: 'Always live to the pen. Put the pen on it and move: it follows, and the ring of control buttons moves with it.'
		};
	}
	if (h.keyKind === 'subr') {
		if (h.text === 'PIXIE') return { title: 'PIXIE', text: PIXIE };
		if (COMMANDS[h.text] && h.box.x0 > 900) return { title: `${h.text}: command button`, text: COMMANDS[h.text] };
		if (RING.includes(h.key)) {
			const letters = ringLetters(segments);
			const letter = h.text;
			const drawing = /^[SF]$/.test(letters.get(SEGMENT_SLOT) ?? '');
			if (drawing && (h.key === SEGMENT_SLOT || h.key === SET_SLOT)) return CONTROL[letter] ? tip(CONTROL[letter]) : null;
			if (drawing) {
				const shown = RING.slice(2).map((a) => letters.get(a));
				const set = SETS.map((t) => ({ t, n: shown.filter((l) => l in t).length })).sort((a, b) => b.n - a.n)[0];
				return set?.t[letter] ? tip(set.t[letter]) : null;
			}
			return POINTING[letter] ? tip(POINTING[letter]) : null;
		}
		return null;
	}
	if (s.addr >= WAREA[0] && s.addr <= WAREA[1]) {
		return { title: 'Working area', text: 'A 10-inch window onto a drawing surface about 40 inches square.' };
	}
	if (s.addr >= PICTURE) {
		return { title: 'The picture', text: 'Finished segments, compiled into the permanent display file. In pointing mode a pen hit here makes it blink.' };
	}
	return null;
}
