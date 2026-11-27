// Drawing on a row of console switches. Pressing a switch, and dragging on across the others,
// sets each one the pointer is on: up in its top half, down in its bottom half, so a square wave
// is one stroke. Each switch is a button with data-switch="its index"; the row wants touch-action: none.
// Enter or Space on a focused switch still flips just that one (a click with no pointer, detail 0).

/**
 * @param {{ on: (i: number) => boolean, set: (i: number, on: boolean) => void, live?: () => boolean }} row
 */
export function switchDrawing(row) {
	let drawing = false;
	const live = () => row.live?.() ?? true;
	/** @param {HTMLElement} el @param {number} i @param {number} y */
	const put = (el, i, y) => {
		const box = el.getBoundingClientRect();
		const up = y < box.top + box.height / 2;
		if (row.on(i) !== up) row.set(i, up);
	};
	return {
		/** @param {PointerEvent & { currentTarget: HTMLElement }} e @param {number} i */
		down(e, i) {
			if (e.button !== 0 || !live()) return;
			e.preventDefault();
			if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
			drawing = true;
			put(e.currentTarget, i, e.clientY);
		},
		/** @param {PointerEvent} e */
		move(e) {
			if (!drawing) return;
			if (!e.buttons) return void (drawing = false);
			const el = /** @type {HTMLElement | null} */ (document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-switch]') ?? null);
			if (el) put(el, Number(el.dataset.switch), e.clientY);
		},
		up() {
			drawing = false;
		},
		/** @param {MouseEvent} e @param {number} i */
		click(e, i) {
			if (e.detail === 0 && live()) row.set(i, !row.on(i));
		}
	};
}
