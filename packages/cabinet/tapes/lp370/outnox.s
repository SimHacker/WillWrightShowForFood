/ OUTNOX: display octal and decimal output, from DEC-4-45-M (7-78-M)
/ C. Stein, DEC, April 29, 1964.  Listing pages 16-20, assembled separately
/ (it ends with its own "start").  Transcribed by hand from the bitsavers scan.
/ "/?" marks a reading the scan leaves in doubt; the digit stroke tables
/ are the likeliest place for a misread 3/8 or 1/7.

/ page 16

outnox,	0

/ routine to convert octal numbers to decimal and generate
/ buffer for display
/ calling sequence:
/ call,	lac a		number to be converted
/	jms outnox
/	x		x coordinate of left number
/			bit 0=1 if octal rather than dec.
/	y		y coordinate of left number
/	dac buff	address of buffer
/	return		last buffer address in AC
/	leading zeros replaced by blanks.

	dac outmpx
	lac i outnox
	and (377777
	xor xwdx
	dac t1x
	lac i outnox
	and (400000
	dac t68x
	isz outnox
	lac i outnox
	xor ywdx
	dac t2x
	isz outnox
	lac 10
	dac t3x
	lac i outnox
	dac 10
	lac t68x
	sza
	jmp octout
	lac (tab-1)
	dac tabcon
bothx,	lac paramx
	xct i outnox
	lac t1x
	dac i 10
	lac t2x
	dac i 10
	lac 11
	dac t1x
	lac 12
	dac t2x
	lac tabcon
	dac 11
	dzm zerswt
	-4
	dac cvntx

/ page 17

loopx,	dzm t4x
	lac i 11
	dac t5x
	lac outmpx
	tad t5x
	spa
	jmp .+3
	isz t4x
	jmp .-4
	dac outmpx
	lac t5x
	cma
	tad outmpx
	dac outmpx
	isz outmpx
	lac t4x
	sna
	jms zerois
	law .
	dac zerswt
	lac t4x
	add (base)
	dac t69x
	xct i t69x
	jms bltx
	isz cvntx
	jmp loopx
	nop
	-0
	dac cvntx
	lac (jmp .+4
	dac .-4
	dac zerswt
	jmp loopx
	lac (nop
	dac .-10
	lac 10
	dac t4x
	lac t3x
	dac 10
	lac t1x
	dac 11
	lac t2x
	dac 12
	isz t4x
	lac t4x
	isz outnox
	jmp i outnox

/ page 18

paramx,	30177
xwdx,	20000
ywdx,	340000
tab,	-303237
	-23417
	-1747
	-143
	-11
	-0

zerox,	307042
	221250
	331463
	237400
	104200
	777777
onex,	304216
	221042
	227400
	135673
	030000
	777777
twox,	225252
	227317
	230000
	031460
	234210
	104000
	777777
threex,	225612
	167340
	225213
	237660
	135400
	777777
fourx,	124000
	226302
	325243
	231463
	236000
	104200
	777777
fivex,	225612
	221354
	370042
	224210
	135463
	031400
	777777

/ page 19

sixx,	307052
	341052
	305400
	170000
	235477
	104200
	777777
sevenx,	021042
	221210
	301777
	371460
	104210
	100000
	777777
eightx,	307052
	361250
	331773
	237400
	104200
	777777

ninex,	225612
	221042
	365363
	334000
	135660
	777777
blank,	104210
	100000
	777777

/ page 20

zerois,	0
	lac zerswt
	sza
	jmp zerxit
	lac (12)
	dac t4x
	isz zerois
zerxit,	isz zerois
	isz zerois
	jmp i zerois

bltx,	0
	dac 12
	lac i 12
	sad (-0
	jmp i bltx
	dac i 10
	jmp bltx+2

base,	law zerox-1
	law onex-1
	law twox-1
	law threex-1
	law fourx-1
	law fivex-1
	law sixx-1
	law sevenx-1
	law eightx-1
	law ninex-1
	law blank-1

octout,	lac (tabix-1)
	dac tabcon
	jmp bothx

tabix,	77777
	7777
	777
	77
	7
	-0

start
