" PDP-7 Forth -- PIXIE rings, on RSPPIX
"
" Forth words over RSPPIX, the 1969 ring structure processor SYMELEC is
" built on (rsppix.s, generated from the 1972 Cambridge listing and not
" edited). This file plays SYMELEC's part: the variables and error exits
" RSPPIX expects, in SYMELEC's layout, and a Forth header for each routine.
" Assemble after kernel-names-full.s and before rsppix.s; the build
" (forth.ts, rsppixForForth) drops rsppix.s's placeholder variables, since
" they are defined here, and starts it at px.org.
"
" Core, top down: the ring area and RSPPIX's stacks, its variables, its
" code from px.org, and below that the literal pool, which now starts
" there. The dictionary grows up to it from end, as before.
"
" A ring name is a cell holding a name: a JMS-tagged address of a word in
" the ring area. Each word below takes the cell's address, as a Forth
" VARIABLE leaves it; RSPPIX's own LAW X convention is the same address.

px.org=014022		" RSPPIX's code, 014000 above where Cambridge put it: a
			" multiple of 04000, so its ORed offsets (rop 02, . 013)
			" still add. The literal pool grows down from here.
px.var=015400		" SYMELEC's variables, below
px.beg=015500		" the ring area: 01300 words, 352 two-word items
px.end=017000
px.res=017100		" ENDRES: the free list runs on past END to here
px.bot=017101		" permanent names from BOT up, and above them the
px.tp=017600		" garbage collector's branch stack, to TOP. A ring is
			" marked one item deep per element, so this is bigger
			" than SYMELEC's 077 words, which held ~50 elements.
px.lp=017601		" operand stack
px.lk=017640		" link stack
px.lke=017700

" RSETUP ( -- )  form the free list and the permanent names. Every ring is forgotten.
	0626345	" RSE
	0646560	" TUP
ph.setup:	0140000+tag.prim+ph.setup-h.dotp-1	" RSETUP
	jms rsetup
	jmp next

" RINIT ( cell -- )  give the cell a fresh item, and make it a permanent name, a root for the garbage collector.
	0625156	" RIN
	0516400	" IT
ph.init:	0120000+tag.prim+ph.init-ph.setup-1	" RINIT
	jms pcell
	jms rinit
	jmp next

" RGETSP ( cell -- )  give the cell a fresh item, NIL.
	0624745	" RGE
	0646360	" TSP
ph.getsp:	0140000+tag.prim+ph.getsp-ph.init-1	" RGETSP
	jms pcell
	jms rgetsp
	jmp next

" RCAR ( cell -- )  move the name to the item its word names.
	0624341	" RCA
	0620000	" R
ph.car:	0100000+tag.prim+ph.car-ph.getsp-1	" RCAR
	jms pcell
	jms rcar
	jmp next

" RCDR ( cell -- )  move the name on to the next item, adding one at the end of the list.
	0624344	" RCD
	0620000	" R
ph.cdr:	0100000+tag.prim+ph.cdr-ph.car-1	" RCDR
	jms pcell
	jms rcdr
	jmp next

" RPUSH ( cell -- )  push down: a new first item, a copy of the old one.
	0626065	" RPU
	0635000	" SH
ph.push:	0120000+tag.prim+ph.push-ph.cdr-1	" RPUSH
	jms pcell
	jms rpush
	jmp next

" RPOP ( cell -- )  pop up: drop the first item.
	0626057	" RPO
	0600000	" P
ph.pop:	0100000+tag.prim+ph.pop-ph.push-1	" RPOP
	jms pcell
	jms rpop
	jmp next

" RNULLR ( cell -- )  make the named item a null ring: a ringstart naming itself.
	0625665	" RNU
	0545462	" LLR
ph.nullr:	0140000+tag.prim+ph.nullr-ph.pop-1	" RNULLR
	jms pcell
	jms rnullr
	jmp next

" RINSRT ( q p -- )  insert Q's item in ring P, after P's.
	0625156	" RIN
	0636264	" SRT
ph.insrt:	0140000+tag.prim+ph.insrt-ph.nullr-1	" RINSRT
	jms pcell	" P
	xor plaw
	dac 1f
	jms pcell	" Q
	jms rinsrt
1:	0		" LAW P: RSPPIX executes it, and returns to it
	jmp next

" RFINDS ( cell -- )  go round the ring to its ringstart.
	0624651	" RFI
	0564463	" NDS
ph.finds:	0140000+tag.prim+ph.finds-ph.insrt-1	" RFINDS
	jms pcell
	jms rfinds
	jmp next

" RFINDN ( cell -- )  go round the head to the element's name.
	0624651	" RFI
	0564456	" NDN
ph.findn:	0140000+tag.prim+ph.findn-ph.finds-1	" RFINDN
	jms pcell
	jms rfindn
	jmp next

" RFINDP ( cell -- )  from an atname, to the top of the head.
	0624651	" RFI
	0564460	" NDP
ph.findp:	0140000+tag.prim+ph.findp-ph.findn-1	" RFINDP
	jms pcell
	jms rfindp
	jmp next

" RFEL ( -- )  form an element with a head of one ring: REL names it, RNM its printname.
	0624645	" RFE
	0540000	" L
ph.fel:	0100000+tag.prim+ph.fel-ph.findp-1	" RFEL
	jms rfel
	jmp next

" RFELN ( n -- )  form an element with a head of n rings, n at least 1.
	0624645	" RFE
	0545600	" LN
ph.feln:	0120000+tag.prim+ph.feln-ph.fel-1	" RFELN
	jms pop.sp
	tad m1		" RSPPIX counts from 0
	jms rfeln
	jmp next

" RADDW ( cell -- )  add a ring to the head of the element the cell is in; the cell names it.
	0624144	" RAD
	0446700	" DW
ph.addw:	0120000+tag.prim+ph.addw-ph.feln-1	" RADDW
	jms pcell
	jms raddw
	jmp next

" RDELB ( cell -- )  delete the element from its brother ring.
	0624445	" RDE
	0544200	" LB
ph.delb:	0120000+tag.prim+ph.delb-ph.addw-1	" RDELB
	jms pcell
	jms rdelb
	jmp next

" REL ( -- cell )  the element RFEL forms,
	0624554	" REL
ph.el:	0060000+tag.const+ph.el-ph.delb-1	" REL
	rel

" REL1 ( -- cell )  its head,
	0624554	" REL
	0210000	" 1
ph.el1:	0100000+tag.const+ph.el1-ph.el-1	" REL1
	rel1

" RNM ( -- cell )  and its printname: RSPPIX's own permanent names.
	0625655	" RNM
ph.nm:	0060000+tag.const+ph.nm-ph.el1-1	" RNM
	rnm

" RSAVINS ( -- cell )  the front door, as SAVINS is in SYMELEC. The RINGS panel starts here.
	0626341	" RSA
	0665156	" VIN
	0630000	" S
ph.savins:	0160000+tag.const+ph.savins-ph.nm-1	" RSAVINS
	rsavins

" RBEG ( -- addr )  the cells holding the start of the ring area,
	0624245	" RBE
	0470000	" G
ph.beg:	0100000+tag.const+ph.beg-ph.savins-1	" RBEG
	rbeg

" REND ( -- addr )  its end, where the garbage collector runs,
	0624556	" REN
	0440000	" D
ph.end:	0100000+tag.const+ph.end-ph.beg-1	" REND
	rend

" RFREE ( -- addr )  and the free list.
	0624662	" RFR
	0454500	" EE
ph.free:	0120000+tag.const+ph.free-ph.end-1	" RFREE
	rfree

" pcell: pop a cell address, as a 13-bit address (a VARIABLE leaves it
" LAW-tagged).
pcell:	0
	jms pop.sp
	and pm13
	jmp i pcell

pm13:	017777
plaw:	law
pm.ring:	1f
1:	< >r; <i>n; <g>?; 0
pm.full:	1f
1:	< >r; <i>n; <g>s; < >f; <u>l; <l>?; 0

" The kernel's chain now ends here, and its pool starts below RSPPIX.
px.at=.
.=latest
	ph.free
.=pool
	px.org
.=ptop
	px.org

" SYMELEC's names for RSPPIX, laid out as SYMELEC lays them out: TOP is
" followed by the pointer to the next free permanent name (RSPPIX's TOP 1).
.=px.var
rbeg:	px.beg
rend:	px.end
rendres:	px.res
rbot:	px.bot
rtop:	px.tp
	0
rlpbeg:	px.lp
rlkbeg:	px.lk
rlkend:	px.lke
rfree:	0
rlop:	0
rlink:	0
rsavins:	0
rel:	0
rel1:	0
rnm:	0
rsavsub:	0
rpoint:	0
rline:	0
rsbpi:	0
rinst:	0
rpbdm:	0
rsymb:	0
rgdm:	0
rbcc:	0
rnote:	0;0;0;0;0;0	" RERR leaves its AC at NOTE 5

" ERRMEB: SYMELEC types the message and restarts; here, the word that
" failed and "ring?", and Forth aborts. ERRGB: the garbage collector found
" no room. RERR halts first, as in 1972; CONTINUE comes here.
rerrmeb:	lac pm.ring
	jmp error
rerrgb:	0
	lac pm.full
	jmp error

.=px.at
