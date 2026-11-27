/**
 * What the PDP-10 page offers on ITS, by the `runs.program` of an entry in
 * packages/cabinet/its/catalog.yml: how each program is started after logging in, and lines
 * to type into it. Every line here was run on the cabinet's KA10 (packages/cabinet/its/README.md).
 * In `keys`, \r is Return, \x1a is Control-Z and \x1b is Altmode.
 */

/** @typedef {{ label: string, keys: string, title: string }} ItsLine */
/** @typedef {{ keys: string, wait?: string }} ItsStep */
/** @typedef {{ id: string, title: string, about: string, start: ItsStep[], lines: ItsLine[] }} ItsProgram */

/** @type {ItsProgram[]} */
export const PROGRAMS = [
	{
		id: 'ddt',
		title: 'DDT',
		about: "ITS's command line is DDT, the debugger, at its * prompt. A colon runs a program; Control-Z stops it and comes back here.",
		start: [],
		lines: [
			{ label: ':listf sys;', keys: ':listf sys;\r', title: 'List the SYS directory: the system programs' },
			{ label: ':macsym', keys: ':macsym\r', title: 'Start MACSYMA' },
			{ label: ':lisp', keys: ':lisp\r', title: 'Start MacLisp; it asks Alloc?, answer n' },
			{ label: ':clogo', keys: ':clogo\r', title: 'Start Logo' },
			{ label: ':kill', keys: ':kill\r', title: 'Kill the program Control-Z stopped' },
			{ label: ':logout', keys: ':logout\r', title: 'Log out of ITS' }
		]
	},
	{
		id: 'macsyma',
		title: 'MACSYMA',
		about: 'MACSYMA numbers what you type (C1), (C2)… and its answers (D1), (D2)…. A line ends with a semicolon.',
		start: [{ keys: ':macsym\r', wait: '(C1)' }],
		lines: [
			{ label: 'diff(x^3,x);', keys: 'diff(x^3,x);\r', title: 'Differentiate x cubed' },
			{ label: 'factor(2^64-1);', keys: 'factor(2^64-1);\r', title: 'Factor 2^64 - 1' },
			{ label: 'integrate(1/(1+x^2),x);', keys: 'integrate(1/(1+x^2),x);\r', title: 'Integrate 1/(1+x^2): ATAN(X)' },
			{ label: 'quit();', keys: 'quit();\r', title: 'Leave MACSYMA for DDT' }
		]
	},
	{
		id: 'lisp',
		title: 'MacLisp',
		about: "MacLisp counts in octal until told otherwise, and its * and + are for fixnums: times and plus make bignums. Here it is set to decimal.",
		start: [
			{ keys: ':lisp\r', wait: 'Alloc?' },
			{ keys: 'n\r', wait: '*' },
			{ keys: '(setq base 10. ibase 10. *nopoint t)\r', wait: 'T' }
		],
		lines: [
			{ label: '(defun f (n) …)', keys: '(defun f (n) (cond ((zerop n) 1) (t (times n (f (sub1 n))))))\r', title: 'Define factorial with times, so it makes bignums' },
			{ label: '(f 30)', keys: '(f 30)\r', title: '30 factorial' },
			{ label: '(quit)', keys: '(quit)\r', title: 'Leave Lisp for DDT' }
		]
	},
	{
		id: 'logo',
		title: 'Logo',
		about: 'CLOGO prompts with ?. A quoted word ends with a quote too: MAKE "X" 7.',
		start: [{ keys: ':clogo\r', wait: '?' }],
		lines: [
			{ label: 'MAKE "X" 7', keys: 'MAKE "X" 7\r', title: 'Give X the value 7' },
			{ label: 'PRINT PRODUCT :X :X', keys: 'PRINT PRODUCT :X :X\r', title: 'Print X times X' },
			{ label: 'GOODBYE', keys: 'GOODBYE\r', title: 'Leave Logo; this logs out' }
		]
	}
];

/** @param {string} id */
export const programFor = (id) => PROGRAMS.find((p) => p.id === id);
