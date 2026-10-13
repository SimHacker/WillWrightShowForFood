/ UTM DRIVER: the PDP-7 pages the tape for the Turing machine engine,
/ device 54, a co-processor in the same core (TURING-ENGINE.md).
/ Written for the cabinet in 2026; not a period program. Start at 100.
/
/ The engine runs the table at TCB on its own, as the 340 runs a
/ display file. In host mode it stops with FAULT when the head walks
/ off its window. The tape lives here in core, BSIZE words of it at
/ BACK, and the window is a WSIZE-word slice of it that the TCB points
/ at. A fault never copies a cell: the handler slides WINDOW by STEP
/ words and moves HEAD and ORIGIN the other way by three cells a word,
/ as a segment base register would, then says TMGO. When the slice
/ hits an end of BACK the tape is used up, and the driver stops the
/ way TM* stops: the head went too far. Spilling BACK itself to disk,
/ DECtape or paper tape is the next level and goes here.
/
/ The host lays out the TCB, table and BACK before starting (the
/ cabinet's layoutTm); DONE says how it ended:
/   1 halt   2 undefined   3 too far right   4 too far left

tmsf=iot 5401		/ skip on flag
tmrs=iot 5412		/ clear AC, OR in status
tmla=iot 5404		/ AC is the TCB: load and run
tmgo=iot 5424		/ reload the TCB and run
tmlm=iot 5442		/ AC is the mode word
tmst=iot 5444		/ stop, clear flags

tcb=1000		/ TCB+1 HEAD, +2 ORIGIN, +3 WINDOW
back=2000		/ 64 words of tape, 192 cells
/ WSIZE is 10 words (24 cells), STEP 4 words (12 cells): a slice
/ starts anywhere from 2000 to 2000+100-10 = 2070, and a step that
/ would leave that range means the tape is used up.

0/	0		/ the interrupt saves the PC here
	jmp int

100/
begin,	dzm done
	dzm faults
	lac (3		/ host pages, and forget any old tape
	tmlm
	lac (tcb
	tmla
	ion
wait,	lac done	/ the engine works; the CPU waits for it
	sna
	jmp wait
	hlt
	jmp begin

int,	dac sav
	tmsf
	jmp back1	/ not ours: nothing else is on the line
	tmrs
	dac st
	and (200000	/ HALT
	sza
	jmp halted
	lac st
	and (40000	/ FAULT
	sna
	jmp undef	/ UNDEF: no door for this state and symbol
	isz faults
	lac st
	and (10000	/ LEFT
	sza
	jmp left

right,	lac tcb 3	/ WINDOW
	tad (775713	/ minus 2065: past 2064 there is no room for STEP more
	sma
	jmp offr
	tad (2071	/ back to WINDOW, plus STEP words right
	dac tcb 3
	lac tcb 1	/ HEAD -= 12 cells
	tad (777764
	dac tcb 1
	lac tcb 2	/ ORIGIN += 12 cells
	tad (14
	dac tcb 2
	jmp resume

left,	lac tcb 3
	tad (775774	/ minus 2004: below it there is no room for STEP more
	spa
	jmp offl
	tad (back	/ back to WINDOW, less STEP words
	dac tcb 3
	lac tcb 1	/ HEAD += 12 cells
	tad (14
	dac tcb 1
	lac tcb 2	/ ORIGIN -= 12 cells
	tad (777764
	dac tcb 2

resume,	tmgo
back1,	lac sav
	ion
	jmp i 0

halted,	lac (1
	jmp fin
undef,	lac (2
	jmp fin
offr,	lac (3
	jmp fin
offl,	lac (4
fin,	dac done
	tmst		/ stop and drop the flag, or it interrupts forever
	jmp back1

done,	0
faults,	0
sav,	0
st,	0
	start begin
