/**
 * What the cabinet applet can boot. Each entry loads its own tapes, adds any
 * peripherals it needs, deposits itself and sets the console. Sources are
 * inlined by vite (?raw for text, ?url&inline for binary tape) so the offline
 * bundle carries them too.
 */
import {
	PaperTape,
	bootDuel,
	duelResult,
	DUEL_START,
	DUEL_SWITCHES,
	assembleLp370,
	bootLp370,
	lp370Demo,
	assembleHilo,
	bootHilo,
	hiloDemo,
	assembleLander,
	bootLander,
	landerDemo,
	houseDemo,
	LP370_SWITCHES,
	sourceFromAsm,
	symelecSources,
	Rb09,
	parseRbImage,
	readInAndGo,
	unixKey,
	unixEcho,
	unixDemo,
	UNIXV0_BOOT_ORIGIN,
	compileForth,
	assembleForthKernel,
	bootForth,
	setForthColumns,
	forthDemo,
	spokenNumbers
} from '@wwsff/cabinet';
import { loadSymelec } from './symelec-boot.js';
import { symelecHint } from './symelec-hints.js';
import page6 from '../../../../packages/cabinet/tapes/lp370/page6.s?raw';
import lp370 from '../../../../packages/cabinet/tapes/lp370/lp370.s?raw';
import outnox from '../../../../packages/cabinet/tapes/lp370/outnox.s?raw';
import hiloSource from '../../../../packages/cabinet/tapes/hilo/hilo.s?raw';
import landerSource from '../../../../packages/cabinet/tapes/lander/lander.s?raw';
import readlnSource from '../../../../packages/cabinet/tapes/lib/readln.s?raw';
import symelecSymbols from '../../../../packages/cabinet/tapes/symelec/symelec-symbols.tsv?raw';
import rimUrl from '../../../../packages/cabinet/tapes/duel/rim.pt?url&inline';
import duelUrl from '../../../../packages/cabinet/tapes/duel/duel.pt?url&inline';

async function bytes(url) {
	const r = await fetch(url);
	if (!r.ok) throw new Error(`${url}: ${r.status}`);
	return new Uint8Array(await r.arrayBuffer());
}

async function gunzip(data) {
	// Servers that send .gz with Content-Encoding: gzip hand it over already unzipped.
	if (data[0] !== 0x1f || data[1] !== 0x8b) return data;
	const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

// One platter per page: files written in UNIX survive a reboot, until the page reloads.
let unixPlatter = null;
let unixBootTape = null;

const octal = (w, n = 4) => (w & 0o777777).toString(8).padStart(n, '0');

const REPO = 'https://github.com/SimHacker/WillWrightShowForFood/blob/main';
const CABINET = `${REPO}/packages/cabinet`;

const LP = LP370_SWITCHES;
let lp370Program = null;
let hiloProgram = null;
let landerProgram = null;

/** symelec-symbols.tsv: name, octal address, source, flags; # lines are comments. */
function parseSymbolTsv(text) {
	return text
		.split('\n')
		.filter((l) => l && !l.startsWith('#'))
		.map((l) => {
			const [name, addr] = l.split('\t');
			return { name, addr: parseInt(addr, 8) };
		});
}

/** Forth kernels by file (tapes/pdp7forth/VARIANTS.yml): the menu runs the full-names copy; Mitch's kernel.s stays for tests. */
const FORTH_KERNELS = {
	'kernel.s': () => import('../../../../packages/cabinet/tapes/pdp7forth/kernel.s?raw'),
	'kernel-names-full.s': () => import('../../../../packages/cabinet/tapes/pdp7forth/kernel-names-full.s?raw')
};

function forthProgram({ id, label, kernelFile }) {
	const built = { kernel: null, image: null };
	return {
		id,
		label,
		listing: { user: 'wmb,claude' },
		title: "Mitch Bradley's PDP-7 Forth, with turtle graphics on the 340. Type at the teletype: 4 0 DO 200 FD 90 RT LOOP",
		help: {
			text: 'Type a line and press Return: 2 3 + .  Draw: CS 4 0 DO 200 FD 90 RT LOOP.  WORDS lists every word. DEMO shows more.',
			links: [
				{ label: "Mitch's README", href: 'https://github.com/MitchBradley/pdp7forth#readme' },
				{ label: 'turtle words', href: 'https://github.com/MitchBradley/pdp7forth#the-turtle-words' }
			]
		},
		pen: false,
		tty: true,
		// 8K is all of core the PDP-7 addresses without the memory extension, which the cabinet lacks.
		coreWords: 8192,
		demo: (h) => forthDemo(h),
		demoTitle: 'Reboot and type the pdp7forth README: arithmetic, a square, a flower, a star',
		switches: 0,
		switchLabels: null,
		// Forth echoes what it reads, and reads a line at a time; the width goes into WORDS.
		ttyConfig: { duplex: 'full', input: 'line' },
		onTtyResize: ({ cpu, cols }) => built.image && setForthColumns(cpu, built.image, cols),
		symbols: () => [...(built.image?.labels ?? [])].map(([name, addr]) => ({ name, addr })),
		source: async () => (built.kernel ? sourceFromAsm(built.kernel, { id: 'as7', label: kernelFile, kind: 'source', dialect: 'as7' }) : null),
		async load() {
			if (built.image) return;
			const [sop, kernel, end, prelude, turtle] = await Promise.all([
				import('../../../../packages/cabinet/tapes/pdp7unix/sop.s?raw'),
				FORTH_KERNELS[kernelFile](),
				import('../../../../packages/cabinet/tapes/pdp7forth/end.s?raw'),
				import('../../../../packages/cabinet/tapes/pdp7forth/prelude.fs?raw'),
				import('../../../../packages/cabinet/tapes/pdp7forth/turtle.fs?raw')
			]);
			// Mitch's build, in the page: as7 sop.s kernel.s end.s, then the prelude compiled on the machine.
			built.kernel = assembleForthKernel({ sop: sop.default, kernel: kernel.default, end: end.default, kernelName: kernelFile });
			built.image = compileForth({ kernel: built.kernel, sources: [prelude.default, turtle.default] });
		},
		boot({ cpu }) {
			bootForth(cpu, built.image);
		},
		status() {
			return '';
		}
	};
}

/**
 * boot({ cpu, box, extra, patches }) runs after the cabinet is built;
 * peripherals() are added to it. status(cpu) is the caption readout.
 * switchLabels names the console switches the program reads, bit 0 first.
 * keys maps KeyboardEvent.code to a switch the key holds while pressed.
 * tty: true opens the teletype panel when the program is chosen; display:
 * false boots without waiting for a picture on the tube.
 * demo(host) returns a scripted demo, run from a fresh boot; null if none.
 * symbols() lists { name, addr } for the Memory drawer, after boot.
 * source() resolves to a SourceMap (source.ts) for the code and source views;
 * sources() instead resolves to several, each with meta { id, label, kind,
 * dialect }, and the memory panel offers a choice between them.
 * hint(hover, segments) names what the pointer rests on, { title, text } or
 * null; the applet shows the machine's own view of the stroke either way.
 * halt says what a HLT means without touching the program: restart is where
 * play-again starts, explain(cpu) reads core into { title, text, score },
 * score a key of scores, the tally kept per program. Any other program gets
 * a plain "Halted at" with Continue.
 * Any program can be recorded and replayed by the applet (session.ts).
 */
export const PROGRAMS = [
	{
		id: 'symelec',
		label: 'PIXIE SYMELEC (1972)',
		// As the 1972 listing heads every page: ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470.
		listing: { user: 'HL1470', title: 'SYMELEC' },
		title: 'PIXIE / SYMELEC, 1972: Heinz Lemke’s circuit editor, from the listing',
		pen: true,
		demo: (h) => houseDemo(h),
		demoTitle: 'Reboot and let a scripted pen draw a picture, the 1972 way',
		switches: 0,
		switchLabels: null,
		symbols: () => parseSymbolTsv(symelecSymbols),
		// RINGS panel: the cells holding the structure's bounds, and the cells holding its roots.
		rings: { beg: 'BEG', end: 'END', roots: 'SAVINS' },
		hint: symelecHint,
		// The listing, its Cambridge source, the as7 translation and the scan map (each line's rectangles
		// on the scanned pages), ~1 MB together; fetched only when a view needs them.
		async sources() {
			const [listing, cambridge, as7, scan] = await Promise.all([
				import('../../../../packages/cabinet/tapes/symelec/symelec-listing.txt?raw'),
				import('../../../../packages/cabinet/tapes/symelec/symelec.asm?raw'),
				import('../../../../packages/cabinet/tapes/symelec/symelec.s?raw'),
				import('../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/scanmap/symelec-lines.json')
			]);
			return symelecSources({ listing: listing.default, cambridge: cambridge.default, as7: as7.default, scan: scan.default });
		},
		boot({ cpu, patches }) {
			loadSymelec(cpu, patches);
			cpu.pc = 0o22;
		},
		status(cpu) {
			return `${cpu.read(0o5641) & 0o1777},${cpu.read(0o5640) & 0o1777}`;
		}
	},
	{
		id: 'lp370',
		label: 'LIGHT PEN TEST (1964)',
		// No user ID survives; a 1964 PDP-4 had no logins. Named for the author, C. Stein.
		listing: { user: 'CSTEIN' },
		title: 'Type 370 light pen test, DEC-4-45-M, C. Stein, 1964: sensitivity, follow and field of view. Page 6 is reconstructed.',
		pen: true,
		demo: (h) => lp370Demo(h, lp370Program),
		demoTitle: 'Reboot and walk through the three tests: switches set, pen placed',
		switches: LP.sensitivity | LP.intensity(7),
		switchLabels: ['readout', 'sensitivity', '', 'follow', '', 'field of view', '', 'box x 4', 'box x 2', 'box x 1', '', 'box y 4', 'box y 2', 'box y 1', '', 'intensity 4', 'intensity 2', 'intensity 1'],
		symbols: () =>
			[...(lp370Program?.symbols ?? [])]
				.filter(([, addr]) => addr < 0o20000)
				.map(([name, addr]) => ({ name, addr })),
		source: async () => (lp370Program ? sourceFromAsm(lp370Program) : null),
		boot({ cpu }) {
			lp370Program ??= assembleLp370({ 'page6.s': page6, 'lp370.s': lp370, 'outnox.s': outnox });
			bootLp370(cpu, lp370Program, this.switches);
		},
		status(cpu) {
			const v = (n) => cpu.read(lp370Program.symbols.get(n));
			return `${octal(v('xpt'))},${octal(v('ypt'))} seen ${v('lpct')}`;
		}
	},
	{
		id: 'duel',
		label: 'DUEL (1968)',
		// Both authors; their first names aren't known here.
		listing: { user: 'PETERSON,VINER' },
		title: 'DUEL, spacewar for two on a PDP-7, DECUS 7-40. From paper tape via the RIM loader. A control is active with its switch down.',
		pen: false,
		demo: null,
		switches: 0o777777,
		// Two players, one keyboard. A held key holds its switch down (0).
		keys: {
			KeyA: { bit: DUEL_SWITCHES.left.turnLeft, label: 'A' },
			KeyD: { bit: DUEL_SWITCHES.left.turnRight, label: 'D' },
			KeyS: { bit: DUEL_SWITCHES.left.back, label: 'S' },
			KeyW: { bit: DUEL_SWITCHES.left.forward, label: 'W' },
			KeyQ: { bit: DUEL_SWITCHES.left.fire, label: 'Q' },
			ArrowLeft: { bit: DUEL_SWITCHES.right.turnLeft, label: '←' },
			ArrowRight: { bit: DUEL_SWITCHES.right.turnRight, label: '→' },
			ArrowDown: { bit: DUEL_SWITCHES.right.back, label: '↓' },
			ArrowUp: { bit: DUEL_SWITCHES.right.forward, label: '↑' },
			Slash: { bit: DUEL_SWITCHES.right.fire, label: '/' },
			Enter: { bit: DUEL_SWITCHES.right.fire, label: 'Enter' }
		},
		keysActiveLow: true,
		keyHelp: 'Left ship: A D turn, W thrust, S back, Q fire. Right ship: ← → turn, ↑ thrust, ↓ back, / or Enter fire.',
		switchLabels: [
			'left turn left', 'left turn right', 'left back', 'left forward', 'left fire',
			'', '', '', '', '', '', '', '',
			'right turn left', 'right turn right', 'right back', 'right forward', 'right fire'
		],
		tapes: null,
		async load() {
			this.tapes ??= { rim: await bytes(rimUrl), duel: await bytes(duelUrl) };
		},
		peripherals() {
			return [new PaperTape()];
		},
		boot({ cpu, box, extra }) {
			if (!bootDuel(box, cpu, extra[0], this.tapes.rim, this.tapes.duel)) throw new Error('DUEL did not load to 646');
			cpu.switches = this.switches;
		},
		// DUEL halts at 721 when a round ends and leaves the outcome in 1157 (tapes/duel/README.md).
		halt: {
			restart: DUEL_START,
			scores: { left: 'Left', right: 'Right', draw: 'Draws' },
			explain(cpu) {
				const r = duelResult(cpu);
				if (r === 'left') return { title: 'Left wins', text: 'A torpedo hit the right ship.', score: r };
				if (r === 'right') return { title: 'Right wins', text: 'A torpedo hit the left ship.', score: r };
				if (r === 'draw') return { title: 'Draw', text: 'The ships collided.', score: r };
				return null;
			}
		},
		status() {
			return '';
		}
	},
	{
		id: 'hilo',
		label: 'HILO (2026)',
		listing: { user: 'A2DEH,CLAUDE' },
		title: 'HILO, a number guessing game on the teletype. Written for this cabinet in 2026, not a period program.',
		help: {
			text: 'Press Return, then guess a number from 0 to 99. Type it and press Return, or just say it: it goes in by itself. Say “return” for Return; other talk is ignored.',
			links: [{ label: 'hilo.s', href: `${CABINET}/tapes/hilo/hilo.s` }]
		},
		pen: false,
		tty: true,
		display: false,
		// READLN echoes and erases, so full duplex and raw keys; spoken and pasted numbers go in after a pause.
		ttyConfig: { duplex: 'full', input: 'raw', wrap: true, autoEnter: 900 },
		spoken: spokenNumbers,
		demo: (h) => hiloDemo(h, hiloProgram),
		demoTitle: 'Reboot and let a scripted operator play one game by halving',
		switches: 0,
		switchLabels: null,
		symbols: () => [...(hiloProgram?.symbols ?? [])].map(([name, addr]) => ({ name, addr })),
		source: async () => (hiloProgram ? sourceFromAsm(hiloProgram) : null),
		boot({ cpu }) {
			hiloProgram ??= assembleHilo(hiloSource, readlnSource);
			bootHilo(cpu, hiloProgram);
		},
		status(cpu) {
			return `guesses ${cpu.read(hiloProgram.symbols.get('tries'))}`;
		}
	},
	{
		id: 'lander',
		label: 'LANDER (2026)',
		listing: { user: 'A2DEH,CLAUDE' },
		title: 'LANDER, a lunar landing game on the teletype: type the fuel to burn each second. Written for this cabinet in 2026, not a period program.',
		help: {
			text: 'Each second, give the fuel to burn: type it and press Return, or just say it. Say “return” for Return; other talk is ignored. Land at low speed.',
			links: [{ label: 'lander.s', href: `${CABINET}/tapes/lander/lander.s` }]
		},
		pen: false,
		tty: true,
		display: false,
		ttyConfig: { duplex: 'full', input: 'raw', wrap: true, autoEnter: 900 },
		spoken: spokenNumbers,
		demo: (h) => landerDemo(h, landerProgram),
		demoTitle: 'Reboot and let a scripted pilot fly one descent',
		switches: 0,
		switchLabels: null,
		symbols: () => [...(landerProgram?.symbols ?? [])].map(([name, addr]) => ({ name, addr })),
		source: async () => (landerProgram ? sourceFromAsm(landerProgram) : null),
		boot({ cpu }) {
			landerProgram ??= assembleLander(landerSource, readlnSource);
			bootLander(cpu, landerProgram);
		},
		status(cpu) {
			const v = (n) => {
				const w = cpu.read(landerProgram.symbols.get(n)) & 0o777777;
				return w & 0o400000 ? w - 0o1000000 : w;
			};
			return `alt ${v('h2') / 2} vel ${v('v')} fuel ${v('fuel')}`;
		}
	},
	forthProgram({ id: 'forth', label: 'FORTH + TURTLE (2026)', kernelFile: 'kernel-names-full.s' }),
	{
		id: 'unix',
		label: 'UNIX v0 (1969)',
		listing: { user: 'ken' },
		title: 'PDP-7 UNIX, Thompson and Ritchie, from the pdp7-unix restoration: booted off an emulated RB09 disk. Log in as ken, password ken.',
		help: {
			text: 'Log in as ken, password ken, in lower case. Then try ls, ls system, date, cat sys.rc. ^C interrupts.',
			links: [
				{ label: 'more', href: `${CABINET}/UNIX-V0.md` },
				{ label: 'pdp7-unix', href: 'https://github.com/DoctorWkt/pdp7-unix#readme' }
			]
		},
		pen: false,
		tty: true,
		display: false,
		lowerCase: true,
		demo: (h) => unixDemo(h),
		demoTitle: 'Reboot, log in as ken, and look around',
		switches: 0,
		switchLabels: null,
		ttyKey: (c) => ({ send: unixKey(c), echo: unixEcho(c) }),
		// ALT MODE is UNIX v0's interrupt; ^C is where a hand expects it.
		ttyConfig: { duplex: 'half', bindings: { 'Ctrl-C': { send: 0o33, label: 'ALT MODE, interrupt' } } },
		async load() {
			if (unixPlatter) return;
			const [{ default: imageUrl }, { default: rimUrl }] = await Promise.all([
				import('../../../../packages/cabinet/tapes/unixv0/image.fs.gz?url'),
				import('../../../../packages/cabinet/tapes/unixv0/boot.rim?url&inline')
			]);
			unixPlatter = parseRbImage(await gunzip(await bytes(imageUrl)));
			unixBootTape = await bytes(rimUrl);
		},
		peripherals({ cpu }) {
			return [new PaperTape(), new Rb09({ cpu, image: unixPlatter })];
		},
		boot({ cpu }) {
			const start = readInAndGo(cpu, unixBootTape, UNIXV0_BOOT_ORIGIN);
			if (start === null) throw new Error('boot.rim ended in HLT');
			cpu.pc = start;
		},
		status() {
			return '';
		}
	}
];

export const DEFAULT_PROGRAM = 'symelec';

export function programById(id) {
	return PROGRAMS.find((p) => p.id === id) ?? null;
}