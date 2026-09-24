/**
 * What the cabinet applet can boot. Each entry loads its own tapes, adds any
 * peripherals it needs, deposits itself and sets the console. Sources are
 * inlined by vite (?raw for text, ?url&inline for binary tape) so the offline
 * bundle carries them too.
 */
import {
	PaperTape,
	bootDuel,
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
	sourceFromListing
} from '@wwsff/cabinet';
import { loadSymelec } from './symelec-boot.js';
import page6 from '../../../../packages/cabinet/tapes/lp370/page6.s?raw';
import lp370 from '../../../../packages/cabinet/tapes/lp370/lp370.s?raw';
import outnox from '../../../../packages/cabinet/tapes/lp370/outnox.s?raw';
import hiloSource from '../../../../packages/cabinet/tapes/hilo/hilo.s?raw';
import landerSource from '../../../../packages/cabinet/tapes/lander/lander.s?raw';
import symelecSymbols from '../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-symbols.tsv?raw';
import rimUrl from '../../../../packages/cabinet/tapes/duel/rim.pt?url&inline';
import duelUrl from '../../../../packages/cabinet/tapes/duel/duel.pt?url&inline';

async function bytes(url) {
	const r = await fetch(url);
	if (!r.ok) throw new Error(`${url}: ${r.status}`);
	return new Uint8Array(await r.arrayBuffer());
}

const octal = (w, n = 4) => (w & 0o777777).toString(8).padStart(n, '0');

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

/**
 * boot({ cpu, box, extra, patches }) runs after the cabinet is built;
 * peripherals() are added to it. status(cpu) is the caption readout.
 * switchLabels names the console switches the program reads, bit 0 first.
 * keys maps KeyboardEvent.code to a switch the key holds while pressed.
 * tty: true opens the teletype panel when the program is chosen; display:
 * false boots without waiting for a picture on the tube.
 * demo(host) returns a scripted demo, run from a fresh boot; null if none.
 * symbols() lists { name, addr } for the Memory drawer, after boot.
 * source() resolves to a SourceMap (source.ts) for the code and source views.
 * Any program can be recorded and replayed by the applet (session.ts).
 */
export const PROGRAMS = [
	{
		id: 'symelec',
		label: 'PIXIE SYMELEC (1972)',
		title: 'PIXIE / SYMELEC, 1972: Heinz Lemke’s circuit editor, from the listing',
		pen: true,
		demo: (h) => houseDemo(h),
		demoTitle: 'Reboot and let a scripted pen draw a picture, the 1972 way',
		switches: 0,
		switchLabels: null,
		symbols: () => parseSymbolTsv(symelecSymbols),
		// The 1972 listing is 268 KB; fetched only when a view needs it.
		async source() {
			const { default: text } = await import(
				'../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt?raw'
			);
			return sourceFromListing(text);
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
		status() {
			return '';
		}
	},
	{
		id: 'hilo',
		label: 'HILO (2026)',
		title: 'HILO, a number guessing game on the teletype. Written for this cabinet in 2026, not a period program.',
		pen: false,
		tty: true,
		display: false,
		demo: (h) => hiloDemo(h, hiloProgram),
		demoTitle: 'Reboot and let a scripted operator play one game by halving',
		switches: 0,
		switchLabels: null,
		symbols: () => [...(hiloProgram?.symbols ?? [])].map(([name, addr]) => ({ name, addr })),
		source: async () => (hiloProgram ? sourceFromAsm(hiloProgram) : null),
		boot({ cpu }) {
			hiloProgram ??= assembleHilo(hiloSource);
			bootHilo(cpu, hiloProgram);
		},
		status(cpu) {
			return `guesses ${cpu.read(hiloProgram.symbols.get('tries'))}`;
		}
	},
	{
		id: 'lander',
		label: 'LANDER (2026)',
		title: 'LANDER, a lunar landing game on the teletype: type the fuel to burn each second. Written for this cabinet in 2026, not a period program.',
		pen: false,
		tty: true,
		display: false,
		demo: (h) => landerDemo(h, landerProgram),
		demoTitle: 'Reboot and let a scripted pilot fly one descent',
		switches: 0,
		switchLabels: null,
		symbols: () => [...(landerProgram?.symbols ?? [])].map(([name, addr]) => ({ name, addr })),
		source: async () => (landerProgram ? sourceFromAsm(landerProgram) : null),
		boot({ cpu }) {
			landerProgram ??= assembleLander(landerSource);
			bootLander(cpu, landerProgram);
		},
		status(cpu) {
			const v = (n) => {
				const w = cpu.read(landerProgram.symbols.get(n)) & 0o777777;
				return w & 0o400000 ? w - 0o1000000 : w;
			};
			return `alt ${v('h2') / 2} vel ${v('v')} fuel ${v('fuel')}`;
		}
	}
];

export const DEFAULT_PROGRAM = 'symelec';

export function programById(id) {
	return PROGRAMS.find((p) => p.id === id) ?? null;
}