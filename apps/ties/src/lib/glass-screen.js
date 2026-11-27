// A glass teletype's screen: rows of characters and a cursor, fed what the line prints. It
// scrolls at the bottom and has no cursor addressing, as ITS's TCTYP type Glass expects
// (SYSENG; TCTYP: 79 wide, 24 high, can backspace, can't overprint), so a rubout arrives as
// backspace, space, backspace and erases.

export class GlassScreen {
	/** @param {number} [cols] @param {number} [rows] */
	constructor(cols = 80, rows = 24) {
		this.cols = cols;
		this.height = rows;
		/** @type {string[][]} */
		this.rows = [];
		this.row = 0;
		this.col = 0;
		this.clear();
	}

	clear() {
		this.rows = Array.from({ length: this.height }, () => []);
		this.row = 0;
		this.col = 0;
	}

	/** Print text; returns how many bells rang in it. @param {string} text */
	feed(text) {
		let bells = 0;
		for (const ch of text) {
			const c = ch.charCodeAt(0);
			if (c === 0o15) this.col = 0;
			else if (c === 0o12) this.#down();
			else if (c === 0o10) this.col = Math.max(0, this.col - 1);
			else if (c === 0o11) this.col = Math.min(this.cols - 1, (Math.floor(this.col / 8) + 1) * 8);
			else if (c === 0o7) bells++;
			else if (c >= 0o40 && c < 0o177) {
				if (this.col >= this.cols) {
					this.col = 0;
					this.#down();
				}
				const line = /** @type {string[]} */ (this.rows[this.row]);
				while (line.length < this.col) line.push(' ');
				line[this.col++] = ch;
			}
		}
		return bells;
	}

	#down() {
		if (this.row < this.height - 1) this.row++;
		else {
			this.rows.shift();
			this.rows.push([]);
		}
	}

	/** The screen as lines of text, trailing spaces trimmed. */
	lines() {
		return this.rows.map((r) => r.join('').trimEnd());
	}
}
