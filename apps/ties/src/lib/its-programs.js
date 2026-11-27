/**
 * What the PDP-10 page offers on ITS, by the `runs.program` of an entry in
 * packages/cabinet/its/catalog.yml: how each program is started after logging in, how to leave
 * it, and lines to type into it, simple ones first and the long ones last. Each program's list was
 * run in order, in one session, on the cabinet's KA10 (packages/cabinet/its/README.md).
 * In `keys`, \r is Return, \x1a is Control-Z and \x1b is Altmode.
 *
 * A line with `steps` is typed a step at a time: each step waits for its `wait` text, or for
 * the output to end with its `prompt`, before the next is typed. Logo drops what is typed
 * ahead of its prompt, so a procedure goes in a line at a time.
 *
 * A game has short `words` instead, in paragraphs of buttons, and `compass` for a rose of the
 * ten directions.
 */

/** @typedef {{ keys: string, wait?: string, prompt?: string }} ItsStep */
/** @typedef {{ label: string, title: string, keys?: string, steps?: ItsStep[] }} ItsLine */
/** @typedef {{ title: string, lines: ItsLine[] }} ItsWords */
/** @typedef {{ id: string, title: string, about: string, start: ItsStep[], quit: ItsLine, lines: ItsLine[], words?: ItsWords[], compass?: boolean }} ItsProgram */

/** The compass rose's directions, as Zork takes them, in the rose's reading order. */
export const COMPASS = [
	['NW', 'nw', 'Northwest'], ['N', 'n', 'North'], ['NE', 'ne', 'Northeast'],
	['W', 'w', 'West'], ['E', 'e', 'East'],
	['SW', 'sw', 'Southwest'], ['S', 's', 'South'], ['SE', 'se', 'Southeast'],
	['UP', 'u', 'Up'], ['DOWN', 'd', 'Down']
].map(([label, word, title]) => ({ label, keys: `${word}\r`, title: `Go ${title.toLowerCase()}`, area: label.toLowerCase() }));

/** @param {string} text @param {string} title @returns {ItsLine} */
const line = (text, title) => ({ label: text, keys: `${text}\r`, title });

/**
 * A Logo procedure, typed a line at a time at Logo's > prompt.
 * @param {string[]} body @param {string} title @returns {ItsLine}
 */
const procedure = (body, title) => ({
	label: body.join('\n'),
	title,
	steps: body.map((text, i) => ({ keys: `${text}\r`, ...(i < body.length - 1 ? { prompt: '>' } : {}) }))
});

/** @type {ItsProgram[]} */
export const PROGRAMS = [
	{
		id: 'ddt',
		title: 'DDT',
		about: "ITS's command line is DDT, the debugger, at its * prompt. A colon runs a program from SYS; Control-Z stops it and comes back here.",
		start: [],
		quit: line(':logout', 'Log out of ITS'),
		lines: [
			line(':listf sys;', 'List the SYS directory: the system programs'),
			line(':who', "Who's logged in, and on which terminal"),
			line(':finger', "Who's logged in, with their names and where they sit"),
			line(':users', 'The users logged in'),
			line(':time', 'The time, and how long ITS has been up'),
			line(':date', 'The date and time'),
			line(':sstatus', 'How busy the system is, and your fair share'),
			line(':tctyp', 'What ITS thinks this terminal is'),
			line(':listf .info.;', 'List .INFO., the documentation'),
			line(':help', "DDT's help"),
			line(':kill', 'Kill the program Control-Z stopped')
		]
	},
	{
		id: 'macsyma',
		title: 'MACSYMA',
		about: 'MACSYMA numbers what you type (C1), (C2)… and its answers (D1), (D2)…. A line ends with a semicolon. Many commands load a package off the disk the first time.',
		start: [{ keys: ':macsym\r', wait: '(C1)' }],
		quit: line('quit();', 'Leave MACSYMA for DDT'),
		lines: [
			line('diff(x^3,x);', 'Differentiate x cubed'),
			line('expand((x+y)^5);', 'Multiply out (x+y) to the fifth'),
			line('factor(2^64-1);', 'Factor 2^64 - 1'),
			line('ratsimp((x^2-1)/(x-1));', 'Simplify (x²-1)/(x-1) to x+1'),
			line('determinant(matrix([a,b],[c,d]));', 'The determinant of a 2 by 2 matrix: AD - BC'),
			line('100!;', '100 factorial, all 158 digits'),
			line('integrate(1/(1+x^2),x);', 'Integrate 1/(1+x²): ATAN(X)'),
			line('integrate(x*exp(x),x);', 'Integrate x eˣ, by Risch'),
			line('taylor(sin(x),x,0,7);', 'The Taylor series of sin(x) to x⁷'),
			line('laplace(sin(t),t,s);', 'The Laplace transform of sin(t)')
		]
	},
	{
		id: 'lisp',
		title: 'MacLisp',
		about: 'MacLisp counts in octal until told otherwise, and its * and + are for fixnums: times and plus make bignums. Its start sets it to decimal.',
		start: [
			{ keys: ':lisp\r', wait: 'Alloc?' },
			{ keys: 'n\r', wait: '*' },
			{ keys: '(setq base 10. ibase 10. *nopoint t)\r', wait: 'T' }
		],
		quit: line('(quit)', 'Leave Lisp for DDT'),
		lines: [
			line("(reverse '(1 2 3 4 5))", 'Reverse a list'),
			line("(append '(a b) '(c d))", 'Join two lists'),
			line("(length '(a b c d))", 'Count a list'),
			line("(assq 'b '((a . 1) (b . 2)))", 'Look up B in an association list'),
			line("(explode 'hello)", 'Take a symbol apart into characters'),
			line("(implode '(h i))", 'Put characters together into a symbol'),
			line('((lambda (x) (times x x)) 12345)', 'Call a lambda: 12345 squared'),
			line('(expt 2 100)', '2 to the 100th, a bignum'),
			line('(gcd 1071 462)', "Euclid's greatest common divisor"),
			line("(sort (list 3 1 4 1 5 9 2 6) 'lessp)", 'Sort, loading SORT the first time'),
			line('(status date)', 'The date, as Lisp sees it'),
			line('(defun f (n) (cond ((zerop n) 1) (t (times n (f (sub1 n))))))', 'Define factorial with times, so it makes bignums'),
			line('(f 30)', '30 factorial'),
			line('(defun fib (n) (cond ((lessp n 2) n) (t (plus (fib (sub1 n)) (fib (difference n 2))))))', 'Define Fibonacci, the slow way'),
			line("(mapcar 'fib '(1 2 3 4 5 6 7 8 9 10 11 12))", 'Map it over a list'),
			line("(apply 'plus (mapcar (function (lambda (x) (times x x))) '(1 2 3 4 5 6 7 8 9 10)))", 'The sum of the first ten squares'),
			line("(defun hanoi (n a b c) (cond ((zerop n) nil) (t (hanoi (sub1 n) a c b) (print (list 'move n 'from a 'to c)) (hanoi (sub1 n) b a c))))", 'Define the towers of Hanoi'),
			line("(hanoi 3 'a 'b 'c)", 'Move three discs from A to C'),
			line('(defun perms (l) (cond ((null l) (list nil)) (t (mapcan (function (lambda (x) (mapcar (function (lambda (p) (cons x p))) (perms (delete x (append l nil)))))) l))))', 'Define permutations'),
			line("(perms '(a b c))", 'Every order of A, B and C'),
			line("(defun deriv (e x) (cond ((atom e) (cond ((eq e x) 1) (t 0))) ((eq (car e) 'plus) (list 'plus (deriv (cadr e) x) (deriv (caddr e) x))) ((eq (car e) 'times) (list 'plus (list 'times (cadr e) (deriv (caddr e) x)) (list 'times (deriv (cadr e) x) (caddr e)))) (t 'unknown)))", 'Define symbolic differentiation, the first thing Lisp was for'),
			line("(deriv '(plus (times x x) (times 3 x)) 'x)", 'Differentiate x² + 3x, unsimplified')
		]
	},
	{
		id: 'logo',
		title: 'Logo',
		about: 'CLOGO prompts with ?, and with > inside a procedure, whose lines are numbered. A quoted word ends with a quote too: MAKE "X" 7. Logo drops what is typed ahead, so a procedure goes in a line at a time.',
		start: [{ keys: ':clogo\r', wait: '?' }],
		quit: line('GOODBYE', 'Leave Logo; this logs out'),
		lines: [
			line('PRINT SUM 3 4', 'Add'),
			line('MAKE "X" 7', 'Give X the value 7'),
			line('PRINT PRODUCT :X :X', 'Print X times X'),
			line('PRINT FIRST "HELLO"', 'The first letter of a word'),
			line('PRINT BUTFIRST "HELLO"', 'All but the first letter'),
			line('PRINT LAST "HELLO"', 'The last letter'),
			line('PRINT SENTENCE "HELLO" "WORLD"', 'Two words into a sentence'),
			line('PRINT WORD "SUN" "SHINE"', 'Two words into one'),
			procedure(['TO SQUARE :N', '10 OUTPUT PRODUCT :N :N', 'END'], 'Define SQUARE'),
			line('PRINT SQUARE 12', 'Square 12'),
			procedure(['TO FACT :N', '10 IF :N = 0 OUTPUT 1', '20 OUTPUT PRODUCT :N FACT DIFFERENCE :N 1', 'END'], 'Define factorial, recursively'),
			line('PRINT FACT 10', '10 factorial'),
			procedure(['TO COUNTDOWN :N', '10 PRINT :N', '20 IF :N = 0 STOP', '30 COUNTDOWN DIFFERENCE :N 1', 'END'], 'Define a countdown'),
			line('COUNTDOWN 5', 'Count down from 5'),
			procedure(['TO REV :W', '10 IF EMPTYP :W OUTPUT :W', '20 OUTPUT WORD REV BUTFIRST :W FIRST :W', 'END'], 'Define reversing a word'),
			line('PRINT REV "LOGO"', 'Reverse LOGO'),
			procedure(['TO FIB :N', '10 IF :N < 2 OUTPUT :N', '20 OUTPUT SUM FIB DIFFERENCE :N 1 FIB DIFFERENCE :N 2', 'END'], 'Define Fibonacci'),
			line('PRINT FIB 15', 'The 15th Fibonacci number'),
			procedure(['TO PIG :W', '10 OUTPUT WORD BUTFIRST :W WORD FIRST :W "AY"', 'END'], 'Define Pig Latin for a word'),
			procedure(['TO PIGS :S', '10 IF EMPTYP :S OUTPUT :S', '20 OUTPUT SENTENCE PIG FIRST :S PIGS BUTFIRST :S', 'END'], 'Define Pig Latin for a sentence'),
			line('PRINT PIGS "THE QUICK BROWN FOX"', 'Pig Latin'),
			line('LIST ALL', 'List every procedure defined')
		]
	},
	{
		id: 'zork',
		title: 'Zork',
		about: "Zork as MIT's Dynamic Modelling group wrote it in MDL from 1977, the whole game that Infocom later cut into Zork I, II and III. Start at West of House; the way in is round the back. A sentence ends with Return; only the first five letters of a word count.",
		start: [{ keys: ':zork\r', wait: '\n>' }],
		quit: { label: 'quit', title: 'Leave Zork for DDT, answering y when it asks', steps: [{ keys: 'quit\r', wait: 'affirmative):' }, { keys: 'y\r' }] },
		lines: [],
		compass: true,
		words: [
			{
				title: 'Around the house',
				lines: [
					line('look', 'Look around again'),
					line('examine mailbox', 'Look at the mailbox'),
					line('open mailbox', 'Open the mailbox'),
					line('read leaflet', 'Read the leaflet inside'),
					line('inventory', 'What you carry'),
					line('open window', 'Open the window behind the house'),
					line('in', 'Climb in'),
					line('take all', 'Take everything here'),
					line('take lamp', 'Take the brass lantern'),
					line('turn on lamp', 'Light the lantern; it is dark below'),
					line('take sword', 'Take the elvish sword'),
					line('open case', 'Open the trophy case'),
					line('move rug', 'Move the rug in the living room'),
					line('open trap door', 'Open what is under the rug')
				]
			},
			{
				title: 'Magic words',
				lines: [
					line('hello sailor', 'An old password'),
					line('xyzzy', "Adventure's magic word"),
					line('plugh', "Adventure's other one"),
					line('zork', 'Its own name'),
					line('ulysses', 'Who blinded the cyclops')
				]
			},
			{
				title: 'The game',
				lines: [
					line('score', 'Your score and rank'),
					line('diagnose', 'How healthy you are'),
					line('wait', 'Let time pass'),
					line('again', 'Do the last thing again'),
					line('brief', 'Describe a room in full only the first time'),
					line('verbose', 'Describe every room in full'),
					line('superbrief', 'Only the names of rooms'),
					line('info', 'What Zork is about'),
					line('help', 'How to talk to it')
				]
			}
		]
	}
];

/** @param {string} id */
export const programFor = (id) => PROGRAMS.find((p) => p.id === id);

/**
 * The line that starts a program from DDT: its start, typed step by step.
 * @param {ItsProgram} p @returns {ItsLine | undefined}
 */
export const runLine = (p) =>
	p.start.length ? { label: p.start.map((s) => s.keys.replace(/\r$/, '')).join('\n'), title: `Start ${p.title}`, steps: p.start } : undefined;
