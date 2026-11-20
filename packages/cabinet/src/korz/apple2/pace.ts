import type { M6502 } from "../../m6502/m6502.js";
import { Korz6502 } from "../m6502.js";
import type { Apple2Plus } from "./plus.js";
import { CYCLES_PER_FRAME, picture } from "./scan.js";

/** One painted field, and the bus cycle it was taken on. */
export type WatchFrame = { cycle: number; picture: Uint8Array };

/**
 * Run until `board.cycles` has advanced `cycles`. Call `onFrame` every `every`
 * cycles, and once more at the end when the stretch stops between pictures.
 * Near a picture the compiler steps one instruction, so a block cannot skip
 * the mark. The speaker is left as a phase and a click count. This watch
 * makes no samples.
 */
export function runWatch(
	board: Apple2Plus,
	cpu: M6502,
	cycles: number,
	every: number,
	onFrame: (frame: WatchFrame) => void,
): { frames: number; clicks: number } {
	const span = every < 1 ? cycles : every;
	const start = board.cycles;
	const end = start + cycles;
	const clicks = board.speakerClicks;
	const korz = cpu instanceof Korz6502 ? cpu : null;
	let mark = start + span;
	let frames = 0;
	let paintedAt = start;
	const paint = () => {
		onFrame({ cycle: board.cycles, picture: picture(board.ram, board.mode()) });
		paintedAt = board.cycles;
		frames += 1;
	};
	while (board.cycles < end) {
		const room = Math.min(mark, end) - board.cycles;
		if (korz?.compiler && room <= CYCLES_PER_FRAME) korz.one();
		else cpu.step();
		if (board.cycles >= mark) {
			paint();
			while (mark <= board.cycles) mark += span;
		}
	}
	if (board.cycles > paintedAt) paint();
	return { frames, clicks: board.speakerClicks - clicks };
}
