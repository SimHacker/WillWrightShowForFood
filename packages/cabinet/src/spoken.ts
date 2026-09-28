const ONES: Readonly<Record<string, number>> = {
	zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
	ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
	seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Readonly<Record<string, number>> = {
	twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

/**
 * What a number game wants from speech or dictation: "ninety nine", "ninety-nine" and "99." all
 * become 99. Other words pass through, so "guess forty two" is "guess 42".
 */
export function spokenNumbers(text: string): string {
	const out: string[] = [];
	let n: number | null = null;
	const flush = () => {
		if (n !== null) out.push(String(n));
		n = null;
	};
	for (const raw of text.toLowerCase().split(/[\s-]+/)) {
		const w = raw.replace(/[.,!?]+$/, "");
		if (w in ONES) n = (n ?? 0) + (ONES[w] as number);
		else if (w in TENS) n = (n ?? 0) + (TENS[w] as number);
		else if (w === "hundred") n = (n ?? 1) * 100;
		else if (w === "a" && n === null) continue; // "a hundred"
		else if (w === "and" && n !== null) continue; // "a hundred and five"
		else {
			flush();
			if (w) out.push(w);
		}
	}
	flush();
	return out.join(" ");
}
