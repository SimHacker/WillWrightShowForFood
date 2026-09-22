/** Edit buffer. Point sits in the gap before `point`, like TECO / Emacs. */

export class EditBuffer {
	private text = "";
	point = 0;

	get size(): number {
		return this.text.length;
	}

	get contents(): string {
		return this.text;
	}

	charAt(index: number): string | undefined {
		if (index < 0 || index >= this.text.length) return undefined;
		return this.text[index];
	}

	/** Character immediately to the right of point. */
	current(): string | undefined {
		return this.charAt(this.point);
	}

	jump(n: number): void {
		this.point = Math.max(0, Math.min(this.text.length, n));
	}

	move(n: number): void {
		this.jump(this.point + n);
	}

	insert(s: string): void {
		this.text = this.text.slice(0, this.point) + s + this.text.slice(this.point);
		this.point += s.length;
	}

	/** Delete n chars to the right (n>0) or left (n<0). */
	delete(n: number): void {
		if (n > 0) {
			this.text = this.text.slice(0, this.point) + this.text.slice(this.point + n);
		} else if (n < 0) {
			const from = Math.max(0, this.point + n);
			this.text = this.text.slice(0, from) + this.text.slice(this.point);
			this.point = from;
		}
	}

	kill(): void {
		this.text = "";
		this.point = 0;
	}

	/** Line containing point, not including the terminating LF. Point stays. */
	currentLine(): string {
		const start = this.lineStart(this.point);
		const end = this.lineEnd(this.point);
		return this.text.slice(start, end);
	}

	lineStart(from: number): number {
		const i = this.text.lastIndexOf("\n", Math.max(0, from - 1));
		return i < 0 ? 0 : i + 1;
	}

	lineEnd(from: number): number {
		const i = this.text.indexOf("\n", from);
		return i < 0 ? this.text.length : i;
	}

	/** Move to the start of the next line (or end of buffer). */
	nextLine(): void {
		const end = this.lineEnd(this.point);
		this.point = end < this.text.length ? end + 1 : this.text.length;
	}
}
