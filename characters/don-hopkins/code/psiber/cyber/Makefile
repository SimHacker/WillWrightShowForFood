DOC= README introduction
PS= piemenu.ps pullout.ps quickwin.ps textcan.ps \
	overlay.ps pointer.ps mics.ps cyber.ps \
	distill.ps ps.ps scrap.ps cond.ps trace.ps \
        doc.ps
SCRIPT= cyber
DEMOS= arpa.map advent.map

STUFF= ${DOC} ${PS} ${SCRIPT} ${DEMOS}

all:	${STUFF}
	-rm -f cyber.shar*
	makescript -t ${STUFF} > cyber.shar
#	compress cyber.shar
#	uuencode cyber.shar.Z < cyber.shar.Z > cyber.shar.Z.uu
#	split cyber.shar.Z.uu cyber.shar.Z.uu.
#	rm cyber.shar.Z cyber.shar.Z.uu
