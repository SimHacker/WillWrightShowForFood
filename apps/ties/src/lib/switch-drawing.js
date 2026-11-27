// Drawing on a row of console switches. Pressing a switch flips it; dragging on sets each switch
// the pointer rolls onto, up in its top half and down in its bottom half, so a square wave is one
// stroke. Each switch is a button with data-switch="its index"; the row wants touch-action: none.
// Enter or Space on a focused switch still flips just that one (a click with no pointer, detail 0).

/**
 * @param {{ on: (i: number) => boolean, set: (i: number, on: boolean) => void, live?: () => boolean }} row
 */
export function switchDrawing(row) {
	let drawing = false;
	const live = () => row.live?.() ?? true;
	return {
		/** @param {PointerEvent & { currentTarget: HTMLElement }} e @param {number} i */
		down(e, i) {
			if (e.button !== 0 || !live()) return;
			e.preventDefault();
			if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
			row.set(i, !row.on(i));
			drawing = true;
		},
		/** @param {PointerEvent} e */
		move(e) {
			if (!drawing) return;
			if (!e.buttons) return void (drawing = false);
			const el = /** @type {HTMLElement | null} */ (document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-switch]') ?? null);
			if (!el) return;
			const box = el.getBoundingClientRect();
			const up = e.clientY < box.top + box.height / 2;
			const i = Number(el.dataset.switch);
			if (row.on(i) !== up) row.set(i, up);
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
