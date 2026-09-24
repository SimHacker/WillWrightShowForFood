/ LANDER, a lunar landing game for the PDP-7 teletype. Written in 2026
/ for the cabinet, not a period program. Start at 100.
/
/ 500 feet up, falling at 50 feet a second, 60 units of fuel. Each
/ second the operator types a burn, 0 to 30; a unit gives 2 ft/s of
/ thrust against the moon's 5, so the acceleration is 2 burn - 5.
/
/ The integration is exact for constant acceleration over the second:
/   h = h + v + a/2,  v = v + a
/ Altitude is kept in half feet (h2) so that is h2 = h2 + 2v + a, all
/ integers. The touchdown speed is not the speed at the end of the
/ second but at the instant of contact, from v^2 = v0^2 - 2 a h0 =
/ v0^2 - a h2(old), and an integer square root. The same formula
/ catches a lander that touches and lifts off again inside one second.
/ With the tank empty the fall is computed the same way with a = -5.
/
/ Arithmetic is two's complement (TAD); the multiply is shift and add,
/ so no EAE is needed. The largest intermediate is under 70000.
/ Half duplex and polled, like HILO: no echo, a line feed after Return.

100/
begin,	lac (hello
	jms puts
	jms getc
	jms crlf
fly,	lac (1750		/ 500 feet, as 1000 half feet
	dac h2
	lac (777716		/ -50 ft/s
	dac v
	lac (74			/ 60 units
	dac fuel
	dzm secs
turn,	jms status
	lac fuel
	sna
	jmp empty
	lac (burnq
	jms puts
	jms getnum
	spa
	cla			/ Return alone burns nothing
	dac burn
	tad (777741		/ minus 31
	sma
	jmp toobig
	lac fuel		/ burn at most what is left
	cma
	tad (1
	tad burn
	spa
	jmp tn1
	lac fuel
	dac burn
tn1,	lac burn		/ fuel = fuel - burn
	cma
	tad (1
	tad fuel
	dac fuel
	lac burn		/ a = 2 burn - 5
	cll
	ral
	tad (777773
	dac acc
	lac v
	dac v0
	lac h2
	dac h0
	lac v			/ h2 = h2 + 2v + a
	cll
	ral
	tad acc
	tad h2
	dac h2
	lac v			/ v = v + a
	tad acc
	dac v
	isz secs
	lac h2
	spa
	jmp down		/ below the surface
	sna
	jmp down		/ on it
	lac v0			/ still up: did it touch and lift inside the second?
	sma
	jmp turn		/ was rising
	lac v
	spa
	jmp turn		/ still falling
	jms disc
	spa
	jmp turn		/ turned around above the surface
	jmp land
down,	jms disc
	jmp land

toobig,	lac (most
	jms puts
	jmp turn

empty,	lac (nofuel
	jms puts
	lac (777773		/ free fall from here: a = -5
	dac acc
	lac v
	dac v0
	lac h2
	dac h0
	jms disc

land,	jms isqrt
	dac vi
	lac (touch
	jms puts
	lac vi
	jms putdec
	lac (ftps
	jms puts
	lac fuel
	jms putdec
	lac (left
	jms puts
	lac vi
	tad (777775		/ minus 3
	spa
	jmp perf
	lac vi
	tad (777766		/ minus 10
	spa
	jmp good
	lac vi
	tad (777742		/ minus 30
	spa
	jmp hard
	lac (crash
	jmp rate
perf,	lac (perfm
	jmp rate
good,	lac (goodm
	jmp rate
hard,	lac (hardm
rate,	jms puts
	lac (again
	jms puts
	jms getc
	jms crlf
	jmp fly

/ v0^2 - a h0 in AC, the square of the speed at contact.
disc,	0
	lac v0
	sma
	jmp ds1
	cma
	tad (1
ds1,	dac mb
	jms mpy
	dac dd
	lac h0
	dac mb
	lac acc
	sma
	jmp ds2
	cma			/ a < 0: v0^2 + |a| h0
	tad (1
	jms mpy
	tad dd
	jmp i disc
ds2,	jms mpy			/ a >= 0: v0^2 - a h0
	cma
	tad (1
	tad dd
	jmp i disc

/ AC times mb, both not negative, product in AC. Shift and add; mb is used up.
mpy,	0
	dac ma
	dzm pr
mp1,	lac mb
	sna
	jmp mp3
	cll
	rar
	dac mb
	snl
	jmp mp2
	lac pr
	tad ma
	dac pr
mp2,	lac ma
	cll
	ral
	dac ma
	jmp mp1
mp3,	lac pr
	jmp i mpy

/ The integer square root of AC, not negative: subtract 1, 3, 5, ...
isqrt,	0
	dac sq
	dzm root
	lac (1
	dac odd
is1,	lac odd
	cma
	tad (1
	tad sq
	spa
	jmp is2
	dac sq
	isz root
	lac odd
	tad (2
	dac odd
	jmp is1
is2,	lac root
	jmp i isqrt

/ T secs  ALT feet  VEL ft/s  FUEL units
status,	0
	lac (tm
	jms puts
	lac secs
	jms putdec
	lac (altm
	jms puts
	lac h2
	cll
	rar
	jms putdec
	lac h2
	and (1
	sna
	jmp st1
	lac (halfm
	jms puts
st1,	lac (velm
	jms puts
	lac v
	jms putsgn
	lac (fuelm
	jms puts
	lac fuel
	jms putdec
	jmp i status

/ A key, 7-bit, in AC.
getc,	0
	ksf
	jmp .-1
	krb
	and (177
	jmp i getc

/ A decimal number typed and ended by Return, in AC; -1 if the line had
/ no digits. Anything but a digit or Return is ignored; digits after the
/ number passes 1000 are dropped, so it cannot overflow.
getnum,	0
	dzm num
	dzm ndig
gn1,	jms getc
	sad (15
	jmp gn2
	tad (777720		/ minus 60
	spa
	jmp gn1			/ below 0
	dac dig
	tad (777766		/ minus 10
	sma
	jmp gn1			/ above 9
	isz ndig
	lac num
	tad (776030		/ minus 1000
	sma
	jmp gn1
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

/ Print AC in decimal with a minus sign if negative.
putsgn,	0
	sma
	jmp ps1
	cma
	tad (1
	dac t2
	lac (255
	jms putc
	lac t2
ps1,	jms putdec
	jmp i putsgn

/ Print AC, 0 to 131071, in decimal, no leading zeros.
putdec,	0
	dac t
	dzm nz
	lac (pow
	dac pp
pd1,	lac i pp
	sna
	jmp pd4
	cma
	tad (1
	dac np
	dzm d
pd2,	lac t
	tad np
	spa
	jmp pd3
	dac t
	isz d
	jmp pd2
pd3,	lac d
	sza
	jmp pd5
	lac nz
	sna
	jmp pd6
pd5,	isz nz
	lac d
	jms digit
pd6,	isz pp
	jmp pd1
pd4,	lac t
	jms digit
	jmp i putdec
pow,	303240			/ 100000
	23420			/ 10000
	1750			/ 1000
	144			/ 100
	12			/ 10
	0

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

hello,	text "LANDER, FOR THE PDP-7 TELETYPE."
	215
	212
	text "YOU ARE 500 FEET UP, FALLING AT 50 FT/S, WITH 60 UNITS OF FUEL."
	215
	212
	text "EACH SECOND TYPE A BURN, 0 TO 30, AND RETURN. A UNIT GIVES"
	215
	212
	text "2 FT/S OF THRUST; THE MOON PULLS 5. RETURN ALONE BURNS NOTHING."
	215
	212
	text "PRESS RETURN TO START."
	0
tm,	text "T "
	0
altm,	text "  ALT "
	0
halfm,	text ".5"
	0
velm,	text "  VEL "
	0
fuelm,	text "  FUEL "
	0
burnq,	text "  BURN? "
	0
most,	text "30 AT MOST."
	215
	212
	0
nofuel,	215
	212
	text "OUT OF FUEL."
	215
	212
	0
touch,	text "CONTACT AT "
	0
ftps,	text " FT/S, "
	0
left,	text " UNITS LEFT."
	215
	212
	0
perfm,	text "PERFECT LANDING."
	215
	212
	0
goodm,	text "GOOD LANDING."
	215
	212
	0
hardm,	text "HARD LANDING. THE LEGS ARE BENT."
	215
	212
	0
crash,	text "CRASHED."
	215
	212
	0
again,	text "RETURN TO FLY AGAIN."
	0
start begin
