const ONES: Readonly<Record<string, number>> = {
	zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
	ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
	seventeen: 17, eighteen: 18, nineteen: 19,
};
const SOUNDS_LIKE: Readonly<Record<string, string>> = {
	to: "two", too: "two", for: "four", fore: "four", won: "one", ate: "eight", free: "three", tree: "three", sex: "six", nein: "nine",
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
	// "digit" after a lone digit, so "zero one two" is 12; "tens" after twenty, so "twenty one" is 21.
	let last: "digit" | "tens" | "other" | null = null;
	const flush = () => {
		if (n !== null) out.push(String(n));
		n = null;
		last = null;
	};
	const words = text.toLowerCase().split(/[\s-]+/).map((raw) => raw.replace(/[.,!?]+$/, ""));
	const isNumberWord = (w: string) => !w || w in ONES || w in TENS || w in SOUNDS_LIKE || /^\d$/.test(w) || ["hundred", "and", "a"].includes(w);
	// Recognizers hear "to" and "for" for digits; trust that only when every word is a number.
	const allNumber = words.every(isNumberWord);
	for (let w of words) {
		if (allNumber && w in SOUNDS_LIKE) w = SOUNDS_LIKE[w] as string;
		const v = /^\d$/.test(w) ? Number(w) : w in ONES ? (ONES[w] as number) : null;
		if (v !== null) {
			if (n === null) n = v;
			else if (last === "digit" && v < 10) n = n * 10 + v;
			else if (last === "tens" && v < 10) n += v;
			else if (last === "digit") n = n * 100 + v;
			else n += v;
			last = v < 10 ? "digit" : "other";
		} else if (w in TENS) {
			const t = TENS[w] as number;
			n = n === null ? t : last === "digit" ? n * 100 + t : n + t;
			last = "tens";
		} else if (w === "hundred") {
			n = (n ?? 1) * 100;
			last = "other";
		}
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
