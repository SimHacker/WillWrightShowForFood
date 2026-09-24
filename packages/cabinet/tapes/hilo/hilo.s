/ HILO, a number guessing game for the PDP-7 teletype. Written in 2026
/ for the cabinet, not a period program; it is here to exercise the
/ KSR-33 the way a 1960s program would. Start at 100.
/
/ Polled, no interrupts: KSF/KRB read a key, TLS/TSF print one. Half
/ duplex, like SYMELEC: the teletype prints what is typed, so the
/ program never echoes, and after the operator's Return it prints only
/ the line feed. The number is 0 to 99, taken from a counter that runs
/ while the program waits for a key, so the operator's timing is the
/ random number generator.
/
/ text "..." is a cabinet assembler extension (src/asm.ts).

100/
begin,	lac (hello
	jms puts
	jms getc		/ any key starts
	jms crlf
game,	lac seed
	dac secret
	dzm tries
	lac (think
	jms puts
ask,	lac (prompt
	jms puts
	jms getnum
	spa
	jmp ask			/ no digits on the line
	dac guess
	isz tries
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
right,	lac (gotit
	jms puts
	lac tries
	jms putdec
	jms crlf
	lac (again
	jms puts
	jms getc
	jms crlf
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

/ A decimal number typed and ended by Return, in AC; -1 if the line had
/ no digits. Anything but a digit or Return is ignored.
getnum,	0
	dzm num
	dzm ndig
gn1,	jms getc
	sad (15
	jmp gn2
	tad (777720		/ minus 60, two's complement
	spa
	jmp gn1			/ below 0
	dac dig
	tad (777766		/ minus 10
	sma
	jmp gn1			/ above 9
	lac num			/ num = 10 num + dig
	cll
	ral
	dac t
	cll
	ral
	cll
	ral
	tad t
	tad dig
	dac num
	isz ndig
	jmp gn1
gn2,	lac (212		/ the line feed after the operator's Return
	jms putc
	lac ndig
	sna
	jmp gn3
	lac num
	jmp i getnum
gn3,	lam
	jmp i getnum

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
	0
think,	text "I HAVE ONE."
	215
	212
	0
prompt,	text "GUESS? "
	0
higher,	text "HIGHER."
	215
	212
	0
lowerm,	text "LOWER."
	215
	212
	0
gotit,	text "RIGHT. GUESSES: "
	0
again,	text "RETURN TO PLAY AGAIN."
	0
start begin
