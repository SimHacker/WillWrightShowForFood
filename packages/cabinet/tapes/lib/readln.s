/ READLN, a line reader for a glass teletype. Shared by HILO and LANDER.
/ Written in 2026 for the cabinet, not a period program.
/
/ Full duplex: it echoes what it keeps, folded to upper case, so the
/ cartridge turns the teletype's local copy off. RUBOUT or backspace
/ erases one character, printing backspace, space, backspace; ^U erases
/ the whole line; Return ends it with CR LF. It never erases past the
/ start of the line: there it rings the bell, ^G, as it does when the
/ line is full. ^G typed rings back, to ask "are you listening?". Other
/ control characters are ignored.
/
/ The program supplies getc (one key, 7-bit, in AC) and putc (print AC).
/ Every label here starts with ln, so the program may use any other name.
/ Assemble it after the program's own tape: labels are shared.
/
/ jms lnread	a line into lnbuf, lnlen characters, one a word
/ jms lnnum	a line's decimal number in AC; -1 if it has no digits.
/		Digits after the number passes 1000 are dropped.

lnread,	0
	dzm lnlen
	lac (lnbuf
	dac lnptr
ln1,	jms getc
	sad (15			/ Return
	jmp ln9
	sad (177		/ RUBOUT
	jmp ln5
	sad (10			/ backspace
	jmp ln5
	sad (25			/ ^U
	jmp ln7
	sad (7			/ ^G: ring back
	jmp ln8
	dac lnch
	tad (777740		/ minus 40: a control character?
	spa
	jmp ln1
	lac lnch		/ a to z, fold to upper case
	tad (777637		/ minus 141
	spa
	jmp ln2
	tad (777746		/ minus 32 more, minus 173 in all
	sma
	jmp ln2
	lac lnch
	tad (777740		/ minus 40
	dac lnch
ln2,	lac lnlen
	sad (110		/ 72 characters: the line is full
	jmp ln8
	lac lnch
	dac i lnptr
	isz lnptr
	isz lnlen
	jms putc		/ echo it
	jmp ln1
ln5,	lac lnlen		/ erase one
	sna
	jmp ln8			/ nothing left to erase
	jms lnrub
	jmp ln1
ln7,	lac lnlen		/ ^U: erase them all
	sna
	jmp ln1
	jms lnrub
	jmp ln7
ln8,	lac (7			/ the bell
	jms putc
	jmp ln1
ln9,	lac (15			/ Return: CR LF
	jms putc
	lac (12
	jms putc
	jmp i lnread

/ Take back the last character: forget it, and rub it off the screen.
lnrub,	0
	lac lnlen
	tad (777777
	dac lnlen
	lac lnptr
	tad (777777
	dac lnptr
	lac (10
	jms putc
	lac (40
	jms putc
	lac (10
	jms putc
	jmp i lnrub

lnnum,	0
	jms lnread
	dzm lnval
	dzm lnnd
	lac (lnbuf
	dac lnptr
	lac lnlen
	sna
	jmp lnn9
	cma
	tad (1
	dac lnk			/ minus the count
lnn2,	lac i lnptr
	isz lnptr
	tad (777720		/ minus 60
	spa
	jmp lnn3		/ below 0
	dac lndig
	tad (777766		/ minus 10
	sma
	jmp lnn3		/ above 9
	isz lnnd
	lac lnval
	tad (776030		/ minus 1000
	sma
	jmp lnn3
	lac lnval		/ lnval = 10 lnval + lndig
	cll
	ral
	dac lnt
	cll
	ral
	cll
	ral
	tad lnt
	tad lndig
	dac lnval
lnn3,	isz lnk
	jmp lnn2
lnn9,	lac lnnd
	sna
	jmp lnn8
	lac lnval
	jmp i lnnum
lnn8,	lam
	jmp i lnnum

lnlen,	0
lnptr,	0
lnch,	0
lnval,	0
lnnd,	0
lndig,	0
lnt,	0
lnk,	0
lnbuf,	0
lnbuf+110/
