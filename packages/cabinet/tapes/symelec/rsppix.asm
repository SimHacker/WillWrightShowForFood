/ ---- scan page 113 ----
                                    /RSPPIX
         SETUP=JMS .
         0                          /SETUP PACKAGE
         LAC BEG
         DAC FREE
         DAC OP                     /FORM FREELIST
         TAD (400001
         DAC I OP
         AND (17777
         SAD ENDRES
         SKP
         JMP .-6                    /LOOP
         LAC BOT
         DAC TOP 1                  /CLEAR NAME LIST
         LAW SAVINS
         INIT
         SETUP1
         JMP I SETUP=JMS
         SETUP1=JMS .
         0
         LAC LPBEG                  /INITIAL LOP AND LINK STAKS
         DAC LOP
         LAC LKBEG
         DAC LINK
         LAW EL
         INIT
         LAW EL1
         INIT
         LAW NM
         INIT
         LAW SAVSUB
         INIT
         LAW POINT
         INIT
         LAW LINE
         INIT
         LAW SBPI
         INIT
         LAW INST
         INIT
         LAW PBDM
         INIT
         LAW SYMB
         INIT
         JMP I SETUP1=JMS
ERR,     0
         HLT                        /STACKS TO SHORT OR ?
         DAC NOTE 5
         JMP ERRMEB
         0                          /RTN TO SET OP, OP 1
         DAC OP
/ ---- scan page 114 ----
         LAC I OP
         CAR 7
         JMP .+14
OP,      0                          /LAW X
         0                          /CONTENTS OF X
         0                          /)
         0                          /)
         0                          /)
         0                          /) WORKING SPACE
         0                          /USED ONLY IN FLST
         0                          /)WORKING SPACE
         0                          /)FOR
         0                          /)GARBAGE COLLECTOR
         0                          /)
         LAC I OP+1
         AND (20000
         SZA
         JMS ERR                    /ERROR IF BLOCK DATA
         LAC OP+1
         JMP I OP-5
         FLST = JMS .
         0                          /FREE AN ITEM
         LAC OP 1
         DAC OP 6
         LAC FREE
         SAD END
         JMS LIM                    /GARBAGE COLLECT
         TAD (77777
         SAD OP 1
         JMP . 16                   /IF CONSECUTIVE
         SAD OP 6
         JMP . 13
         TAD (1
         DAC OP 6
         XOR (500000
         DAC I OP+1
         LAC I FREE
         AND (17777
         DAC FREE                   /ADVANCE FREE
         LAC (100000
         DAC I OP+6                 /SET NIL
         JMP FLST=JMS+3             /LOOP TO TRY AGAIN
         DAC OP 1
         DAC OP+6                   /SAVE LAST ADDRESS
         ISZ OP+6
         LAC I FREE
         AND (17777
         DAC FREE                   /ADVANCE FREE
         LAC (100000
         DAC I OP 1
         DAC I OP+6                 /SET NIL
         JMP I FLST=JMS             /EXIT WHEN ITEM CHAINED TO OP
/ ---- scan page 115 ----
GETSP=JMS, 0
         DAC OP
         LAC EL1
         DAC I OP                   /IN CASE OF IMMEDIATE GARBAGE COLLECTION
         LAC FREE
         SAD END
         JMS LIM                    /GARBAGE COLLECT
         TAD (JMS
         DAC OP 1
         DAC I OP
         LAC I FREE
         AND (17777
         DAC FREE
         LAC (JMS
         DAC I OP 1                 /SET NIL
         FLST                       /FREE AN ITEM
         LAC OP+1
         DAC I OP                   /ATTACH NAME
         AND I GETSP
INIT=JMS, 0
         GETSP
         LAC OP
         DAC I TOP 1
         ISZ TOP 1
         LAC TOP
         SAD TOP 1
         JMS ERR                    /NO ROOM FOR MORE NAMES
         LAC OP+1
         AND I INIT
         CDR = JMS .
         0
         JMS OP-5                   /SAVE NAME
         TAD (1
         DAC OP 6                   /IN CASE NONITEM
         CAR 7                      /TRUE ADDRESS OF CDR
         LAC (JMS
         SAD I OP 1
         SKP                        /HERE IF CDR NIL
         JMP . 4
         LAC OP 6
         DAC OP 1
         FLST
         LAC OP 1
         DAC I OP                   /ATTACH NAME
         LAC OP
         JMP I CDR=JMS
         CAR = JMS .
         0
         JMS OP-5
         LAC I OP+1
/ ---- scan page 116 ----
         CAR 7
         DAC I OP                   /MOVE NAME
         LAC OP
         JMP I CAR=JMS
         0                          /SET OP+1 WITH ADDRESS FROM AC AND MS 5 BITS 00100
         AND (17777                 / AND MOVE TO NEXT ITEM IF ON NONITEM
         TAD (JMS
         DAC OP+1
         LAC I OP+1
         SPA
         JMP .-5                    /DO AGAIN IF ON NONITEM
         LAC OP+1                   /PRESERVE AC
         AND I CAR 7
         PUSH = JMS .
         0                          /PUSH DOWN (LISTNAME
         JMS OP-5
         TAD (1
         DAC EL1                    /PREVENT TAIL BEING SWEPT UP IF GARBAGE COLLECTED
         LAC I OP+1
         DAC OP+2                   /SAVE ITEM
         FLST                       /MAKE SPACE FOR NEW ITEM
         LAC OP 2
         DAC I OP 1
         LAC OP 1
         DAC I OP
         ISZ OP+1
         FLST                       /MAKE MORE SPACE
         LAC OP+2
         DAC I OP+1                 /COPY ITEM
         LAC EL1
         XOR (500000
         DAC I OP+6                 /JOIN UP
         LAC OP
         JMP I PUSH=JMS
         POP = JMS .
         0                          /POP UP (LIST NAME
         DAC OP
         LAC I OP
         DAC OP+2                   /SAVE NAME
         LAC OP
         CDR
         LAC OP+1
         XOR (500000
         DAC I OP+2                 /JOIN UP
         LAC OP
         JMP I POP=JMS
STAK=JMS, 0                          /OPERAND TO STACK
         AND (17777
         DAC OP 3
         ISZ LOP
         LAC LOP
         SAD LKBEG
/ ---- scan page 117 ----
         JMS ERR
         LAC OP+3
         DAC I LOP
         JMP I STAK=JMS
UNSTAK=JMS, 0                          /OPERAND FROM STACK
         LAC I LOP
         DAC OP+3
         LAC LOP
         SAD LPBEG
         JMS ERR
         TAD (777777
         DAC LOP
         LAC OP+3
         JMP I UNSTAK=JMS
         ENTER = JMS .
         0                          /ENTER SUBROUTINE (NAME ENTER
         DAC OP+3                   /SAVE ENTRY POINT
         ISZ LINK
         LAC LINK
         SAD LKEND
         JMS ERR
         LAC ENTER=JMS
         AND (17777
         DAC I LINK                 /SAVE LINK
         JMP I OP+3                 /ENTER SUBROUTINE
         EXIT = JMP .
         LAC I LINK                 /EXIT SUBROUTINE
         SAD (100000
         JMS ERR                    /ERROR EXIT
         DAC OP+3                   /PLANT LINK
         LAC LINK
         SAD LKBEG
         JMS ERR
         TAD (777777
         DAC LINK
         JMP I OP+3                 /EXIT
                                    /GARBAGE COLLECTOR - COMBINED PHASE 1 AND 2
         GIND = OP+7                /INDEX NAMES
         GBUG = OP+10
         GSTKP = OP+11              /BRANCH STACK POINTER
         GTEMP = OP+12
                                    /NOTE THAT THE BRANCH STACK STORES GBUG
LIM,     0                          /HERE IF FREELIST EXPIRED
         LAC TOP 1
         DAC GSTKP
         LAC BOT
         DAC GIND
         JMP LIM1
                                    /LOOP INSPECTING P. NAMES
LIM2,    ISZ GIND                   / NEXT PERM NAME
/ ---- scan page 118 ----
         LAC GIND
         SAD TOP+1
         JMP GARB                   / TO LAST PHASE IF DONE ALL P NAMES
LIM1,    LAC I GIND                 / PICK UP P NAME
         DAC GBUG
         JMP GNTR
                                    /MAIN RECURSIVE ROUTINE
GBRNCH,  LAC GSTKP
         SAD TOP
         JMS ERR                    /BRANCH STACK EXPIRED
MK1,     LAC GBUG
         DAC I GSTKP
         ISZ GSTKP
GNTR,    DAC GTEMP                  /INITIAL ENTRY
         LAC I GBUG                 /"CAR"
         DAC GBUG
GB2,     LAC I GBUG                 /AND MOVE TO ITEM
         SMA
         JMP GITEM                  /JUMP IF ITEM
         AND (017777
         DAC GBUG
         LAC I GBUG
         SPA
         JMP ,-4                    /REPEAT WHILE NONITEM
         LAC I GTEMP
         AND (760000                /RSP BITS
         SPA                        /JUMP IF ITEM
         TAD (200000                /MARK IF NONITEM
         TAD GBUG                   /NB GBUG MUST BE CLEAN HERE
         DAC I GTEMP                /SO SKIP REDUNDANT NONITEMS
GITEM,   LAC I GBUG
         AND (577777
         SAD (100000
         JMP GNIL,                  /JMP IF NIL
         LAC I GBUG
         RTL
         SZL!CML                    /PREPARE TO MARK
         JMP GBRTN                  /EXIT IF MARKED ALREADY
         RTR                        /NOW MARK
         DAC I GBUG
         AND (560000
         SAD (020000
         JMP GBRTN                  /EXIT IF BLOCK DATA
         SZA                        /JUMP IF ATOM
         JMP GBRNCH                 /RECURSE IF LIST POINTER
GBCDR,   ISZ GBUG                   /"CDR"
         LAC GBUG
         DAC GTEMP
         JMP GB2                    /REPEAT
                                    /FOUND 1ST NIL
GNIL,    TAD (200000
         DAC I GBUG                 /MARK IT
/ ---- scan page 119 ----
         ISZ GBUG
         LAC GBUG
         SAD END
         JMP GBRTN
         LAC I GBUG
         SAD (100000
         TAD (200000                /MARK SND NIL
         DAC I GBUG
                                    /EXIT RECURSIVE ROUTINE
GBRTN,   LAC GSTKP
         SAD TOP 1
         JMP LIM2                   /FINAL EXIT
         TAD (777777                /-1
         DAC GSTKP
         LAC I GSTKP
         DAC GBUG                   /RECOVER GBUG
         JMP GBCDR                  /CARRY ON
                                    /GARBAGE COLLECTOR PHASE THREE
GARB,                               /COLLECT GARBAGE & RESTORE LISTS
         LAC BEG
         DAC OP+7                   /START ADDRESS
         DZM OP+11                  /CONSECUTIVE INDICATOR ZERO
         LAC I OP+7
         AND (220000                /TO ALLOW FOR BLOCK DATA
         SAD (220000
         JMS GBD
         SAD (20000                 /TO ALLOW FOR DEAD BLOCK DATA
         JMS GBD1
         RAL
         SMA
         JMP ,+11                   /JUMP FIRST GARBAGE ITEM
         LAC I OP+7
         AND (577777
         DAC I OP+7                 /RESTORE LIST ITEM
         ISZ OP+7
         LAC OP+7                   /ADVANCE ADDRESS
         SAD END
         JMS ERRGB                  /EXIT NO GARBAGE TO COLLECT
GARB1,   JMP ,-20                   /LOOP
         LAC OP+7
         DAC FREE                   /START NEW FREE LIST
         DAC OP+10
         LAC END
         TAD (400000
         DAC I OP+7                 /ATTACH TERMINAL WORD
         ISZ OP+7
         LAC OP+7                   /ADVANCE ADDRESS
         SAD END
         JMP ,+25                   /EXIT
         LAC I OP+7
         AND (220000                /TO ALLOW FOR BLOCK DATA
         SAD (220000
         JMS GBD
         SAD (20000                 /TO ALLOW FOR DEAD BLOCK DATA
/ ---- scan page 120 ----
         JMS GBD1
         RAL
         SMA
         JMP ,+4                    /JUMP GOT MORE GARBAGE
         LAC I OP+7
         AND (577777
         JMP ,-20                   /RESTORE LIST ITEM AND LOOP
         LAC OP+7
         TAD (400000
         DAC I OP+10                /COLLECT A WORD
         AND (17777
         ISZ OP+10
         SAD OP+10
         ISZ OP+11
         JMP ,-33                   /LOOP
         LAC OP+11
         SNA
         JMS ERRGB                  /ERROR EXIT IF NONE CONSECUTIVE
GARB2,   LAC FREE
         JMP I LIM                  /OK EXIT
GBD,     0                          /FOR BLOCK DATA
         LAC I OP+7
         AND (577777
         DAC I OP+7
         AND (17777
         DAC OP+7                   /MOVE OP+7 TO END OF BLOCK DATA
         SAD END
         JMP GARB2-3
         LAC GBD
         ADD (-4                    /RESTART THIS SECTION
         DAC GBD
         JMP I GBD
GBD1,    0                          /TO ELIMINATE DEAD BLOCK DATA
         LAC OP 7
         TAD (20000
         TAD (1
         SAD I OP+7
         JMP I GBD1
         DAC OP+12
         DZM I OP+12
         JMP ,-5                    /LOOP FOR FURTHER ITEMS
                                    /BLOCK DATA PRODUCER
         BDN=JMS ,
         0
         DZM I END
         DZM #GDM                   /ZERO GARBAGE COLLECTION MARKER
         TAD (1
         DAC OP+2                   /NO OF CONSECUTIVE WORDS NEEDED
         XCT I BDN-JMS
         DAC OP+4
         LAC I OP+4
         DAC OP+4
         LAC FREE
BDC,     DAC OP+3
         DZM #BCC                   /ZERO COUNT
         SMA
/ ---- scan page 121 ----
         TAD (400000
         DAC OP+11
         ISZ BCC
         LAC BCC                    /COUNT OF CONSECUTIVE WORDS FOUND
         SAD OP+2
         JMP BDO                    /CORRECT NO FOUND
         LAC I OP+11
         ISZ OP+11
         SAD OP+11
         JMP ,-7                    /IF FREE LIST CONSECUTIVE
         SMA
         JMP BDE                    /FREE LIST EXHAUSTED
         LAC OP+11
         ADD (-1
         DAC OP+10
         LAC I OP+10
         JMP BDC                    /BEGIN SEARCH AGAIN
BDE,     LAC GDM
         SZA
         JMS ERRGB                  /CANNOT PRODUCE BLOCK DATA
         ISZ GDM
         DZM I OP+4                 /THROW AWAY OLD ITEMS
         JMS LIM                    /GARBAGE COLLECT
         JMP BDC
BDO,     LAC I OP 11
         SMA
         JMP BDE                    /TRYING TO USE I END
         LAC OP+3                   /ADDRESS OF FIRST OF CONSECUTIVE WORDS
         SPA
         JMP BDR                    /FREE LIST NOT INITIALLY CONSECUTIVE
         ADD (400000
         DAC OP+3
         LAC I OP+11
         AND (17777
         DAC FREE                   /RESET FREE LIST
         JMP BDR+2
BDR,     LAC I OP+11
         DAC I OP+10                /JOIN FREE LIST ROUND BLOCK DATA
         LAC OP+3
         XOR (500000                /CONVERT TO ADDRESS TYPE
         DAC I OP+4                 /SET POINTER TO BLOCK DATA MARKER
         LAC OP+11
         TAD (420001                /BLOCK DATA MARKER IS J02
         DAC I OP+3                 /SET BLOCK DATA MARKER
         AND I BDN
                                    /RING STRUCTURE PROCESSOR     MAY 1969
         FEL = JMS ,
         0                          /FORM ELEMENT LENGTH ONE
         CLA
         FELN
         JMP I FEL-JMS
         FELN = JMS ,
/ ---- scan page 122 ----
         0                          /FORM ELEMENT LENGTH N
         CMA
         DAC OP+2                   /SET HEAD COUNTER
         LAW NM                     /FOR PRINTNAME
         GETSP
         LAW EL                     /FOR ELEMENT
         GETSP
         DAC EL1                    /SAVE HEAD ADDRESS
         LAW EL
         NULLR
         CDR
         ISZ OP 2
         JMP ,-3                    /FORM HEADER
         LAC NM
         XOR (140000
         DAC I EL                   /ATNAME
         LAC EL
         DAC I NM                   /BACK POINTER
         LAW EL
         CDR
         LAC EL1
         DAC I EL
         JMP I FELN-JMS
         NULLR = JMS ,
         0                          /FORM NULL RING
         JMS OP-5
         TAD (40000                 /SET RINGSTART
         DAC I OP+1
         LAC OP
         JMP I NULLR-JMS
         INSRT = JMS ,
         0                          /INSERT Q IN RING P
         JMS OP-5                   /GET Q
         DAC OP 2
         XCT I INSRT-JMS
         JMS OP-5                   /GET P
         LAC I OP+1
         AND (117777                /MAY BE RINGSTART
         DAC I OP+2
         LAC I OP+1
         AND (40000                 /PRESERVE IF RINGSTART
         TAD OP+2
         DAC I OP+1                 /JOIN UP
         JMP I INSRT-JMS
         FINDS = JMS ,
         0                          /FIND RINGSTART
         JMS OP-5
         DAC I OP                   /MOVE NAME
         LAC I OP+1
         AND (40000
         SZA
/ ---- scan page 123 ----
         JMP , 3                    /POINTER ON RINGSTART
         LAC I OP+1
         JMP OP-2                   /LOOP
         LAC OP
         JMP I FINDS-JMS            /EXIT
         FINDN = JMS ,
         0                          /FIND NAME OF ELEMENT
         JMS OP-5
         LAC I OP+1
         AND (500000                /TEST IF ATOM
         SNA
         JMP , 4
         LAC OP
         CDR                        /NEXT
         JMP ,-6                    /LOOP
         LAC OP
         JMP I FINDN-JMS            /EXIT
FINDP-JMS, 0                          / MOVE TO TOP OF HEAD IF ON ATNAME
         JMS OP-5
         LAC (100000
         AND I OP+1
         SNA
         JMP ,+3                    / IF ATNAME
         LAC OP
         AND I FINDP
         LAC OP
         CDR
         CAR
         AND I FINDP
                                    / GO ROUND HEAD FINDING NEXT ADDRESS AFTER APPLYING FUNCTION.
                                    / MOVE X TO NEXT ITEM IN HEAD AND IF RS EXECUTE F1, IF RP EXECUTE F2.
                                    / CALL BY LAW GRHA; ENTER; LAW X; LAW F1; LAW F2
GRHA,    XCT I ENTER-JMS            / PICK UP X
         JMS OP-5
         DAC OP+3                   / GET CONTENTS OF X
         LAC I OP+3
         AND (100000
         SNA
         JMP ,+6                    / IF ON ATNAME
         LAC OP
GR1,     CDR
         LAC OP+1
         SAD OP+3
         EXIT                       / IF BACK TO STARTING-POINT
         LAC OP
         FINDP
         LAC OP+1
/ ---- scan page 124 ----
         SAD OP+3
         EXIT
         ISZ ENTER-JMS              / MOVE TO F1
         LAW
         AND I OP+1
         SAD (JMS
         ISZ ENTER-JMS              / MOVE TO F2 IF RINGPOINTER
         JMS LKTEST
         LAC OP+3
         DAC I LINK                 / KEEP STARTING-POINT
         XCT I ENTER-JMS            / PICK UP
         ENTER                      /   AND EXECUTE FUNCTION
         LAC I LINK
         DAC OP+3                   / PICK UP STARTING-POINT
         CLC
         TAD LINK
         DAC LINK
         LAC I LINK
         DAC ENTER-JMS
         XCT I ENTER-JMS            /AND X
         JMP GR1
                                    / GO ROUND RING FINDING NEXT ADDRESS BEFORE APPLYING FUNCTION.
                                    / STORE CAR(X), EXECUTE F, AND THEN SET X TO STORED VALUE.
                                    / CALL AS FOR GRRA.
GRRB,    XCT I ENTER-JMS            / X
         CAR                        / MISS THIS ONE
         LAC OP+1
         DAC OP+3                   / CONTENTS OF X
GR2,     LAW
         AND I OP+3
         SAD (DZM
         EXIT
         LAW OP+3
         CAR
         JMS LKTEST
         LAC OP+3
         DAC I LINK
         ISZ ENTER-JMS
         XCT I ENTER-JMS
         ENTER
         LAC I LINK
         DAC OP+3
         CLC
         TAD LINK
         DAC LINK
         LAC I OP+3
         SPA
         EXIT                       / IF HAS BEEN DELETED
         LAC I LINK
         DAC ENTER-JMS
         XCT I ENTER-JMS
         DAC OP
         LAC OP+3
         DAC I OP
/ ---- scan page 125 ----
         JMP GR2
LKTEST,  0                          /TEST IF ROOM ON LINK STACK
         ISZ LINK
         LAC LINK
         SAD LKEND
         JMS ERR
LKERR,   JMP I LKTEST
                                    /RSP ROUTINES FOR USE WITHOUT QUALIFIERS
         ADDW = JMS ,
         0                          /ADDWORD IN ELEMENT
         DAC OP+2
         FINDN
         CDR
         LAC OP+1                   /HEAD POINTER
         DAC OP+3                   /HEAD
         LAW EL
         GETSP                      /FOR NEW RING ITEM
         LAC I OP 3
         XOR (500000
         DAC I OP 6                 /CHAIN TO TOP OF HEAD
         LAC OP 1
         DAC I OP 3                 /RESET HEAD POINTER
         DAC I OP 2                 /NAME ON NEW WORD
         TAD (DAC
         DAC I EL                   /FORM NULL RING
         LAC OP+2
         JMP I ADDW-JMS
         DSON = JMS ,
         0                          /DELETE A SON RING
         DAC OP+4
         FINDS                      /IN CASE OF WRONG ENTRY
         LAW GRRB
         ENTER
         LAC OP 4
         LAW , 3
         ENTER                      /DO ALSO FOR RING-START
         AND I DSON
         LAC OP+4
         POP
         EXIT
         DELB = JMS ,
         0                          /DELETE ELEMENT FROM BROTHER RING
         JMS OP-5
         DAC OP+3
         LAC I OP+1
/ ---- scan page 126 ----
         AND (40000                 /TEST IF RINGSTART
         SZA
         JMP I DELB-JMS             /EXIT IF ILLEGAL
         LAC I OP+1
         CAR 7
         DAC OP 2                   /MOVE TO NEXT IN RING
         LAC I OP 1
         CAR 7
         SAD OP+3                   /DOES THIS POINT BACK TO THE ORIGINAL ELEMENT
         SKP
         JMP ,-5
         LAC I OP+2
         AND (40000                 /PRESERVE IF RING START
         TAD I OP+3
         DAC I OP+2                 /DELETE POINTER
         LAC OP
         POP
         JMP I DELB-JMS
         PAUSE
         BEG
         FREE
         ENDRES
         BOT
         TOP
         SAVINS
         LPBEG
         LOP
         LKBEG
         LINK
         EL
         EL1
         NM
         SAVSUB
         POINT
         LINE
         SBPI
         INST
         PBDM
         SYMB
         NOTE
         ERRMEB
         END
         LKEND
         ERRGB
         GDM
         BCC
/ ---- scan page 127 ----
