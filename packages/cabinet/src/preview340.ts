import { type Segment, Type340 } from "./plugins/type340.js";

/**
 * One pass of a display file, drawn by a throwaway 340 over a read-only view of core: what the
 * tube would show right now, without running the CPU or touching the real 340. Stores (DDS
 * deposits) are dropped, there are no pens, and it stops at the first stop code, the first
 * return to `start`, or `maxWords`, whichever comes first. A display file that loops back on
 * itself without stopping (the turtle's, PIXIE's) still yields one picture.
 */
export function preview340(read: (addr: number) => number, start: number, maxWords = 20_000): Segment[] {
	let fetched = 0;
	let wrapped = false;
	const t = new Type340({
		fetch: (a) => {
			fetched += 1;
			if (fetched > 1 && a === start) wrapped = true;
			return read(a);
		},
		store: () => {},
		pens: [],
	});
	t.iot({ device: 0o06, pulse: 0o06, ac: start });
	// A stop code, a pen hit or an edge sets status; the picture so far is the answer.
	for (let i = 0; i < maxWords * 4 && fetched < maxWords && !wrapped && t.status === 0; i += 1) t.tick();
	return t.segments;
}
