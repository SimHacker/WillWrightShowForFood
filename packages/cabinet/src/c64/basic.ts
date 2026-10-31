// Commodore BASIC V2 program listing: a PRG of linked lines (next pointer, line number,
// tokens, 0). Tokens 0x80-0xCB are keywords; quoted text passes through untouched.

const KEYWORDS = (
	"END FOR NEXT DATA INPUT# INPUT DIM READ LET GOTO RUN IF RESTORE GOSUB RETURN REM STOP ON WAIT LOAD SAVE VERIFY DEF POKE PRINT# PRINT CONT LIST CLR CMD SYS OPEN CLOSE GET NEW TAB( TO FN SPC( THEN NOT STEP + - * / ^ AND OR > = < SGN INT ABS USR FRE POS SQR RND LOG EXP COS SIN TAN ATN PEEK LEN STR$ VAL ASC CHR$ LEFT$ RIGHT$ MID$ GO"
).split(" ");

/** Control and graphics characters inside strings, shown the way C64 listings print them. */
function petChar(c: number): string {
	if (c >= 0x20 && c <= 0x5f) return c === 0x5c ? "£" : String.fromCharCode(c);
	if (c >= 0xc1 && c <= 0xda) return String.fromCharCode(c - 0x80).toLowerCase();
	if (c >= 0x61 && c <= 0x7a) return String.fromCharCode(c);
	return `{${c.toString(16).padStart(2, "0")}}`;
}

export function listBasic(prg: Uint8Array): string {
	const load = (prg[0] ?? 0) | ((prg[1] ?? 0) << 8);
	const lines: string[] = [];
	let o = 2;
	while (o + 4 <= prg.length) {
		const next = (prg[o] ?? 0) | ((prg[o + 1] ?? 0) << 8);
		if (next === 0) break;
		const num = (prg[o + 2] ?? 0) | ((prg[o + 3] ?? 0) << 8);
		let s = `${num} `, quoted = false, rem = false;
		for (o += 4; o < prg.length && prg[o] !== 0; o++) {
			const c = prg[o] ?? 0;
			if (c === 0x22) quoted = !quoted;
			if (!quoted && !rem && c >= 0x80 && c <= 0xcb) {
				const k = KEYWORDS[c - 0x80] ?? "?";
				s += k;
				if (k === "REM") rem = true;
			} else s += c === 0x22 ? '"' : petChar(c);
		}
		lines.push(s);
		o++;
		if (next - load + 2 !== o) o = next - load + 2;
	}
	return lines.join("\n") + "\n";
}
