/ DEC-4-45-M (7-78-M)  370 LIGHT PEN DIAGNOSTIC PROGRAM
/ C. Stein, DEC, April 29, 1964.  Needs a 340 display.  Starts at 22.
/ Transcribed by hand from the bitsavers scan
/ DIGITAL-7-78-M_370LightPenDiag_Apr64.pdf, listing pages 7-15.
/ Page 6, the start of the listing, is missing from the scan.
/ "/?" marks a reading the scan leaves in doubt.

/ page 7

bthsid,	dac temp2		/? scan reads tamp2
	lac (jmp i outgo)
	dac stpcod
	dac corhit
	lac (jmp gotcha
	dac lphit
	dzm lpct

outpt,	jms outgo
	jms outgo
	lac noswit
	sna
	jmp .+6
	law nobfxx
	iot 606
	iof
	iot 601
	jmp .-1
	lac buf+1
	add (1)
	sad bufdon
	skp
	jmp incre
	lac temp1
	dac buf+1
	lac temp2
	dac buf 5
	lac buf 6
	add (4)
	dac buf 6
	lac buf+2
	add (1)
	sad bufd1
	jmp done
	dac buf+2
	jmp outpt

incre,	dac buf+1
	lac buf 5
	add (4)
	dac buf 5
	jmp outpt

/ page 8

done,	las
	and (400000
	sna
	jmp lftsid-6
	lac buf+5
	and (1777
	dac call+2
	lac (1300
	dac call+3
call,	lac lpct
	jms outnox
	0
	0
	dac nobfxx
	dac temp1
	lac (400000
	dac i temp1
	isz temp1
	lac (3000
	dac i temp1
	law .
	dac noswit
	las

	and (10000
	sza
	jmp hole 2
	dzm noswit
	jmp i hole

lftsid,	lac buf+5
	jmp bthsid

hobuf,	34110			/? label may be nobuf
	20000
	202000
	13000
	30137
	20000
	342000
	306310
	621462
	3000
	777777

/ page 9

gotcha,	isz lpct
	iot 704
	law buf 4
	jmp outgo 2
nobfxx,	nobfxx+300/

blt,	0
	dac 10
	law buf-1
	dac 11
	lac i 10
	sad (777777)
	jmp i blt
	dac i 11
	jmp blt+4

follow,	0
	lac fx
	dac xpt
	lac fy
	dac ypt
	las
	and (7)
	xor param
	dac buf
	lac (3000)
	dac buf+4
	lac ypt
	xor fywd
	dac buf 1

	lac (jmp gety)
	dac stpcod
	lac (jmp i outgo)
	dac lphit
	lac (hlt)
	dac corhit
	lac xpt
	add (50)
	and (2000)
	sza
	jmp backup
	lac xpt
	add (50)
	xor fxwd
	dac buf+2
	lac (600277
	dac buf+3
	jms outgo
	iot 716

/ page 10

	rtr
	rtr
	rtr
	rtr
	and (1776)
	dac x1

	lac xpt
	tad (-47)
	spa
	jmp moveup
	xor fxwd
	dac buf+2
	lac (600077
	dac buf+3
	jms outgo
	iot 716
	rtr
	rtr
	rtr
	rtr
	and (1776)
	add x1
	rar
	and (1777)
	dac xpt
gety,	lac (jmp show)		/? scan reads (jmp sho)
	dac stpcod
	lac xpt
	xor fxwd
	dac buf+2
	lac ypt
	add (50)
	and (2000)
	sza
	jmp bacyup
	lac ypt
	add (50)
	xor fywd
	dac buf+1
	lac (737400
	dac buf+3
	jms outgo

	iot 716
	ral
	and (1776)
	dac y1
	lac ypt
	tad (-47)
	spa
	jmp movyup

/ page 11

	xor fywd
	dac buf+1
	lac (637400
	dac buf+3
	jms outgo
	iot 716
	ral
	and (1776)
	add y1
	rcr
	dac ypt

show,	law buf 2
	dac 10
	lac (34114
	dac buf
	lac fy
	xor fywd
	dac buf 1
	lac fx
	xor fxwd
	dac buf 2
	lac fx
	cma
	tad (1
	tad xpt
	dzm sign
	spa
	jms absval
	dac mag
	and (777600)
	sza
	jmp modify

lastx,	lac (200000)
	xor mag
	xor sign
	dac i 10
	lac fy
	cma
	add (1)
	tad ypt
	dzm sign
	spa
	jms yabs
	dac mag
	and (777600)
	sza
	jmp modifx

/ page 12

lasty,	lac mag
	rtl
	rtl
	rtl
	rtl
	and (77400)
	xor sign
	xor (600000)
	dac i 10
	lac (3000)
	dac i 10
	lac (jmp done1)
	dac stpcod
	dac lphit
	dac corhit
	jms outgo

absval,	0
	cma
	dac temp2
	lac (200)
	dac sign
	lac temp2
	jmp i absval

yabs,	0
	cma
	dac temp2
	lac (100000)
	dac sign
	lac temp2
	jmp i yabs

done1,	las
	and (40000)
	sza
	jmp follow+5
	jmp i follow

modify,	lac mag
	tad (-176)
	dac mag
	lac (200177)
	xor sign
	dac i 10
	lac mag
	jmp lastx-3

/ page 13

modifx,	lac (277400)
	xor sign
	dac i 10
	lac mag
	tad (-176)
	dac mag
	jmp lasty-3

senst,	0
	law senbu-1
	jms blt
	lac (jmp gotlp)
	dac lphit
	lac (jmp i outgo)
	dac stpcod
outpt1,	jms outgo
	lac buf
	sad (34117)
	jmp reset
	add (1)
	dac buf
	lac buf+2
	add (100)
	dac buf+2
	jmp outpt1
reset,	lac (34110)
	dac buf
	lac (302100)
	dac buf+2
	las
	and (200000)
	sza
	jmp outpt1
	jmp i senst		/? scan may read jms i senst

gotlp,	iot 712
	and (400000
	sza
	jmp outpt1+1
	iot 504
	jmp outgo 3

backup,	lac xpt
	tad (-27
	dac xpt
	jmp gety

/ page 14

moveup,	lac xpt
	tad (30
	dac xpt
	jmp gety

bacyup,	lac ypt
	tad (-27
	dac ypt
	jmp show
movyup,	lac ypt
	add (30
	dac ypt
	jmp show
senbu,	34110
	20700
	302100
	600177
	3000
	777777

outgo,	0
	law buf
	iot 606
	ion
	jmp .

inter,	jms corrut
	skp
	jmp corhit-1
	iot 701
	skp
	jmp lphit-1
	iot 601
	skp
	jmp stpcod-1
	iot 102
	iot 202
	iot 302
	iot 402
	ion
	jmp i 0

/ page 15

dsi=iot 601
dsp=iot 701

	iot 704
stpcod,	0
	iot 704
corhit,	0
	iot 704
lphit,	0

corrut,	0
	dsx
	skp
	jmp . 3
	dsy
	jmp i corrut
	isz corrut
	jmp i corrut

buf,	0
buf 20/

dsx=iot 501
dsy=iot 1001

fy,	1000
fx,	1000
param,	34110
fxwd,	102000
fywd,	220000

start
