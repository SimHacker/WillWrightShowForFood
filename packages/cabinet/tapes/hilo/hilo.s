/ HILO, a number guessing game for the PDP-7 teletype. Written in 2026
/ for the cabinet, not a period program; it is here to exercise the
/ KSR-33 the way a 1960s program would. Start at 100.
/
/ Polled, no interrupts: KSF/KRB read a key, TLS/TSF print one. Numbers
/ come in through READLN (../lib/readln.s, assembled after this tape),
/ which echoes, so the teletype runs full duplex, and erases with
/ backspace. The number is 0 to 99, taken from a counter that runs
/ while the program waits for a key, so the operator's timing is the
/ random number generator. getc is where that counter runs, and READLN
/ calls it.
/
/ text "..." is a cabinet assembler extension (src/asm.ts).

100/
begin,	lac (hello
	jms puts
	jms waitcr
game,	lac seed
	dac secret
	dzm tries
	lac (think
	jms puts
ask,	lac (prompt
	jms puts
	jms lnnum
	spa
	jmp ask			/ no digits on the line
	dac guess
	lac lnneg
	sna
	jmp ask1
	lac guess
	sza			/ minus zero is zero
	jmp under
ask1,	lac guess
	tad (777634		/ minus 100
	sma
	jmp over
	isz tries
	lac guess
	cma
	tad secret
	tad (1			/ secret - guess
	sna
	jmp right
	spa
	jmp lower
	lac (higher
	jms puts
	jmp ask
lower,	lac (lowerm
	jms puts
	jmp ask
under,	lac (underm
	jms puts
	jmp ask
over,	lac (overm
	jms puts
	jmp ask
right,	lac (gotit
	jms puts
	lac tries
	jms putdec
	lac (dotnl
	jms puts
	lac (again
	jms puts
	jms waitcr
	jmp game

/ A key, 7-bit, in AC. Counts seed 0 to 99 while it waits.
getc,	0
getc1,	lac seed
	tad (1
	sad (144		/ 100 decimal
	cla
	dac seed
	ksf
	jmp getc1
	krb
	and (177
	jmp i getc

/ Wait for Return; anything else typed is ignored, not echoed.
waitcr,	0
	jms getc
	sad (15
	jmp i waitcr
	jmp waitcr+1

/ Print AC, 0 to 99, in decimal.
putdec,	0
	dac t
	dzm tens
pd1,	lac t
	tad (777766		/ minus 10
	spa
	jmp pd2
	dac t
	isz tens
	jmp pd1
pd2,	lac tens
	sza
	jms digit
	lac t
	jms digit
	jmp i putdec

digit,	0
	tad (260
	jms putc
	jmp i digit

crlf,	0
	lac (215
	jms putc
	lac (212
	jms putc
	jmp i crlf

/ Print the string at AC, one character a word, ended by 0.
puts,	0
	dac ptr
puts1,	lac i ptr
	sna
	jmp i puts
	jms putc
	isz ptr
	jmp puts1

putc,	0
	tls
	tsf
	jmp .-1
	jmp i putc

hello,	text "HILO, FOR THE PDP-7 TELETYPE."
	215
	212
	text "I THINK OF A NUMBER FROM 0 TO 99. YOU GUESS IT."
	215
	212
	text "PRESS RETURN TO START."
	215
	212
	0
think,	text "I AM THINKING OF A NUMBER."
	215
	212
	0
prompt,	text "YOUR GUESS?"
	215
	212
	0
higher,	text "HIGHER."
	215
	212
	0
lowerm,	text "LOWER."
	215
	212
	0
underm,	text "IT'S GREATER THAN OR EQUAL TO ZERO."
	215
	212
	0
overm,	text "IT'S LESS THAN OR EQUAL TO 99."
	215
	212
	0
gotit,	text "RIGHT. GUESSES: "
	0
dotnl,	text "."
	215
	212
	0
again,	text "RETURN TO PLAY AGAIN."
	215
	212
	0
start begin
