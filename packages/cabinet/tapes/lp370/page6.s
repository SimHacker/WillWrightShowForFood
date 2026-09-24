/ RECONSTRUCTION of DEC-4-45-M listing page 6, which is missing from
/ the only known scan. This is not DEC's code. It is written from the
/ test descriptions (pages 2-5) and from how pages 7-15 use the
/ symbols it must supply. Assemble it first, then lp370.s, then
/ outnox.s, as one program.
/
/ What the surviving pages fix:
/   start at 22 (cover page)
/   AC switch 1 (200000) runs senst while up (reset, page 13)
/   AC switch 3 (040000) runs follow while up (done1, page 12)
/   AC switch 5 (010000) runs the field of view test while up
/     (lftsid-6, page 8); switch 0 (400000) adds the readout (done)
/   the field of view test is entered by jms hole, repeats at hole+2
/     and returns by jmp i hole (page 8)
/   hobuf is copied into buf by blt (page 8, 9)
/   buf+1 is the box point x word, stepped to bufdon, reset from temp1;
/     buf+2 is the y word, stepped to bufd1; buf+5 and buf+6 are the
/     4x enlargement's x and y words, stepped by 4, buf+5 reset from
/     temp2 (outpt, page 7)
/   code falls into bthsid with the enlargement x word in AC, or
/     reaches it through lftsid, which loads it from buf+5 (page 8)
/
/ What is a choice, not evidence:
/   the box is 60 points on a side (description: about half an inch)
/   the enlargement sits at y 400 and x 240 or 1240, in the half of
/     the screen away from the box
/   switch 0 down clears noswit, so the readout goes away
/     (description: "to eliminate the digital readout, set AC
/     switches 0 down")
/   xcor and ycor are names introduced here

0/
	0
	jmp inter

22/
begin,	las
	and (200000
	sza
	jms senst
	las
	and (40000
	sza
	jms follow
	las
	and (10000
	sza
	jms hole
	jmp begin

hole,	0
	dzm noswit
	las
	and (400000
	sna
	dzm noswit
	law hobuf-1
	jms blt
	las
	and (7
	xor param
	dac buf
	las
	and (3400
	rcr
	dac xcor		/ switches 7-9 times 200
	xor (20000
	dac buf+1
	dac temp1
	add (60
	dac bufdon
	las
	and (160
	rcl
	rtl
	dac ycor		/ switches 11-13 times 200
	xor (202000
	dac buf+2
	add (60
	dac bufd1
	lac (342400
	dac buf+6
	lac xcor
	and (1000
	sna
	jmp lefth
	lac (20240		/ box on the right: enlargement on the left
	dac buf+5
	jmp lftsid
lefth,	lac (21240		/ box on the left: enlargement on the right
	dac buf+5
