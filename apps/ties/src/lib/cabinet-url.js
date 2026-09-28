import { programById, DEFAULT_PROGRAM } from './cabinet-programs.js';

/**
 * A cabinet spec from a URL, the same shape an article's `yaml cabinet` fence gives the applet.
 * One place for every parameter, so a link and a fence can say the same things:
 *   /cabinet/unix/                 the program in the path
 *   /cabinet/?program=forth        or in the query; the query wins
 *   &size=768                      the tube's side in CSS pixels
 */
export function cabinetSpec(query, pathProgram = null) {
	const program = query.get('program') ?? pathProgram ?? DEFAULT_PROGRAM;
	if (!programById(program)) throw new Error(`unknown program: ${program}`);
	const size = Number(query.get('size'));
	return {
		id: 'cabinet',
		machine: 'pdp7',
		program,
		boot: 'idla',
		pens: ['pointer'],
		mode: 'honest',
		size: Number.isFinite(size) && size >= 256 && size <= 2048 ? size : 640
	};
}
