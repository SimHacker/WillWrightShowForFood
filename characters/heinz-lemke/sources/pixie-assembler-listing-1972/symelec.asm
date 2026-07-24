/ ---- scan page 002 ----
                                    /SYMELEC
         DISP
21/      HLT
22/      JMP BEGRTP
23/      JMP BERTP1
BEGRTP,  LAC (JMP INT               /INTERRUPT ENTRY
         DAC 1
         CAF
         JMS ENDDRA
BERTP1,  LAC SAVINS
         SZA
         ISZ CDOCOM
         DZM I DFB
         DZM RCATAL
         DZM RCOPY
         DZM RGROUP
         DZM RATTPO
         DZM RTFIRI
         JMS SETCL
         LAW LB
         IDLA
         ION
         WAIT
         JMP .-1
LBD,     PAR SB SC1 IN7             /LB'S AT CROSS
         DJS VE PSD
         PAR SB
         DJS SB , 2
         JMP SD
         DDS CH 3
         233700                     /S
         PAR SB
         DJS VE PAD
         PAR SB
         DJS SB , 2
         JMP AD
         DDS CH 3
         013700                     /A
         PAR SB
         DJS VE PRD
         PAR SB
         DJS SB , 2
         JMP CFST
         DDS CH 5
/ ---- scan page 003 ----
         223700                     /R
         PAR SB
         DJS VE PCD
         PAR SB
         DJS SB , 2
         JMP CSND
         DDS CH 5
         033700                     /C
         PAR SB
         DJS VE PLD
         PAR SB
         DJS SB , 2
         JMP CTRD
         DDS CH 5
         143700                     /L
         PAR SB
         DJS VE PXD
         PAR SB
         DJS SB , 2
         JMP CFOU
         DDS CH 5
         233700                     /S
         PAR SB
         DJP ERAST
AD,      LAC (JMP CFIF              /'B' SET OF LB'S
         DAC LBD 22
         LAC CLBV                   /V
         DAC LBD 24
         LAC (JMP CSIX
         DAC LBD 31
         LAC CLBI                   /I
         DAC LBD 33
         LAC (JMP CSEV
         DAC LBD 40
         LAC CLBU                   /U
         DAC LBD 42
         LAC (JMP CEIG
         DAC LBD 47
         LAC CLBO                   /O
         DAC LBD 51
         LAC (023700                /B
         DAC LBD 15
         DZM SWITCH
         JMS SETCL
         JMP PEN1
BD,      LAC (JMP CFST              /'A' SET OF LB'S
         DAC LBD 22
         LAC CLBR                   /R
         DAC LBD 24
         LAC (JMP CSND
         DAC LBD 31
         LAC CLBC                   /C
         DAC LBD 33
         LAC (JMP CTRD
         DAC LBD 40
/ ---- scan page 004 ----
         LAC CLBL                   /L
         DAC LBD 42
         LAC (JMP CFOU
         DAC LBD 47
         LAC CLBS                   /S
         DAC LBD 51
         LAC (013700                /A
         DAC LBD 15
         LAM
         DAC SWITCH
         JMS SETCL
         JMP PEN1
FSTCLB,  RES0 -3
SNDCLB,  CAP0 -3
TRDCLB,  IND0 -3
FOUCLB,  SWI0 -3
FIFCLB,  VOL0 -3
SIXCLB,  CUR0 -3
SEVCLB,  NUL0 -3
EIGCLB,  NOR0 -3
CLBR,    223700
CLBC,    033700
CLBL,    143700
CLBS,    233700
CLBV,    263700
CLBI,    113700
CLBU,    253700
CLBO,    173700
                                    /ECTRONIC SYMBOLS
         14
         14
RES0,    DDS VE 4
         VEC ON 10 0
         VEC ON 4 10
         VEC ON 10 -20
         VEC ON 10 20
         VEC ON 10 -20
         VEC ON 10 20
         VEC ON 10 -20
         VEC ON 4 10
         VEC ES ON 10 0
         PAR SB
         DJP SB 4
         12
         24
CAP0,    DDS VE 4
         VEC ON 30 0
/ ---- scan page 005 ----
         VEC 0 17
         VEC ON 0 -36
         VEC 20 0
         VEC ON 0 36
         VEC 0 -17
         VEC ES ON 30 0
         PAR SB
         DJP SB 4
         34
         34
IND0,    DDS VE 4
         VEC ON 10 0
         VEC ON 4 14
         VEC ON 4 4
         VEC ON 6 0
         VEC ON 4 -4
         VEC ON 4 -14
         VEC ON -2 -12
         VEC ON -4 0
         VEC ON -4 12
         VEC ON 10 20
         VEC ON 10 0
         VEC ON 4 -4
         VEC ON 4 -14
         VEC ON -2 -12
         VEC ON -4 0
         VEC ON -4 12
         VEC ON 10 20
         VEC ON 10 0
         VEC ON 4 -4
         VEC ON 4 -14
         VEC ON -2 -12
         VEC ON -4 0
         VEC ON -2 6
         VEC ON 2 4
         VEC ES ON 14 0
         PAR SB
         DJP SB 4
         7
         64
SWI0,    DDS VE 4
         VEC ON 22 0
         VEC ON 34 15
         VEC 0 -15
         VEC ES ON 22 0
         PAR SB
         DJP SB 4
         23
         44
VOL0,    DDS VE 4
/ ---- scan page 006 ----
         VEC ON 20 0
         VEC -14 10
         VEC ON 12 0
         VEC -5 5
         VEC ON 0 -12
         VEC 7 5
         VEC ON 10 10
         VEC ON 20 0
         VEC ON 10 -10
         VEC ON 0 -20
         VEC ON -10 -10
         VEC ON -20 0
         VEC ON -10 10
         VEC ON 0 20
         VEC 40 -10
         VEC ES ON 20 0
         PAR SB
         DJP SB 4
         35
         54
CUR0,    DDS VE 4
         VEC ON 10 0
         VEC -14 10
         VEC ON 12 0
         VEC ON -4 4
         VEC 0 -10
         VEC ON 4 4
         VEC 2 0
         VEC ON 10 10
         VEC ON 20 0
         VEC ON 10 -10
         VEC ON 0 -20
         VEC ON -10 -10
         VEC ON -20 0
         VEC ON -10 10
         VEC ON 0 20
         VEC 20 -20
         VEC ON 0 20
         VEC ON 10 10
         VEC ON 20 0
         VEC ON 10 -10
         VEC ON 0 -20
         VEC ON -10 -10
         VEC ON -20 0
         VEC ON -10 10
         VEC 40 10
         VEC ES ON 10 0
         PAR SB
         DJP SB 4
         20
         104
NUL0,    DDS VE 4
         VEC ON 17 0
/ ---- scan page 007 ----
         VEC ON 0 -14
         VEC ON 40 0
         VEC ON 0 30
         VEC ON -40 0
         VEC ON 0 -14
         VEC 13 7
         VEC ON 14 0
         VEC ON 0 -14
         VEC ON -14 0
         VEC ON 0 14
         VEC 27 -7
         VEC ES ON 17 0
         PAR SB
         DJP SB 4
         20
         74
NOR0,    DDS VE 4
         VEC ON 17 0
         VEC ON 0 -14
         VEC ON 40 0
         VEC ON 0 30
         VEC ON -40 0
         VEC ON 0 -14
         VEC 13 7
         VEC ON 0 -14
         VEC ON 14 14
         VEC ON 0 -14
         VEC ON -14 14
         VEC 27 -7
         VEC ES ON 17 0
         PAR SB
         DJP SB 4
         PAUSE
/ ---- scan page 008 ----
/ ---- scan page 009 ----
                                    /LTPIX/RELOC
         451/
SERSWI,  0
         LAC SWITCH                 /SERVES LB A AND B
         SMA
         JMP . 4
         LAC (JMP AD
         DAC LBD 13
         JMP . 3
         LAC (JMP BD
         DAC LBD 13
         JMP I SERSWI
FOBBL,   TAD (777776                /FORM BRANCH BLOCK
         DAC ELAD                   /(ELEMENT ADDRESS)-2
         LAC I ELAD
         DAC LENGTH
         ISZ ELAD
         LAC I ELAD
         DAC ETYPE
         LAC SYMB                   /SEARCH LIST FOR TYPES OF SBPI
         DAC Y
         LAC I Y                    /ADDR OF ATNAME
         SAD (100000
         JMP . 16                   /NO MATCH FOUND
         DAC TEMP
         LAW TEMP
         CDR
         CDR                        /POINTS TO TYPE E.G. 1024
         LAC I TEMP
         SAD ETYPE                  /TEST WHETHER SAME TYPE
         JMP . 4                    /FOUND SBPI WITH SAME TYPE
         LAW Y
         CDR
         JMP .-14
         ISZ FSBPI
         LAC I Y
         DAC TEMP2
         JMS FONBL
         JMS ATTPDA
         JMS UPDAXY
         LAC FSBPI
         SNA
         JMP FOCBL
/ ---- scan page 010 ----
         LAW TEMP2                  /ELEMENT ALREADY CATALOGUED
         ADDW                       /OP 1 POINTS TO SBPI ADDRESS
         LAW INST
         CDR
         INSRT
         LAW TEMP2
         JMP FOBBL1
FOCBL,   JMS FOCBL1                 /FORM CAT BL
         JMS FOCBL3
         JMS FOCBL4
         JMS FOCBL2
         JMS ATTPEL                 /FIRST ATTP WITH 100 ETC
         JMS ATTPEL                 /SND ATTP WITH ALL ZEROS
         LAW SYM                    /READY FOR NEXT ENTRY
         CDR
         JMP FOBBL1
FOBBL1,  DZM FSBPI
         ISZ COMPOS
         LAC I COMPOS               /FIRST WORD AFTER PAR SB ELEMENT
         TAD (-157777
         SNA
         JMP UPCOM1                 /NOLINE IS OK
         ISZ COMPOS
         LAC CCOM1
         SMA
         JMS TESTJN                 /TEST WHETHER LAST LINE
         JMS FONBL
         JMP FOLBL 1
ATTPDA,  0                          /ATTP DATA
         LAC ETYPE
         AND (7000
         SZA
         JMP . 4
         LAC (100
         DAC XTOT
         JMP I ATTPDA
         TAD (776000                /-2000
         SZA
         JMP . 4
         LAW 17700
         DAC XTOT
         JMP I ATTPDA
         SMA
         JMP . 4
         LAW 17700
         DAC YTOT
         JMP . 3
         LAC (100
         DAC YTOT
         JMP I ATTPDA
/ ---- scan page 011 ----
SAVTE1,  LAC POSDF                  /SAVE SYMBOL ON STACK
         DAC POSDFB
         ISZ POSDFL
         LAC (100000
         DAC I POSDFL
         LAC XBMO
         DAC I BXBMO
         ISZ BXBMO
         LAC YBMO
         DAC I BYBMO
         ISZ BYBMO
         DZM CON1
         JMP I SAVTEM
TAKE1,   LAW 17774                  /TAKE SYMBOL FROM STACK
         TAD POSDF
         DAC POSDF
         JMS INSRET
         CLC
         TAD BXBMO
         DAC BXBMO
         LAC I BXBMO
         DAC XBMO
         CLC
         TAD BYBMO
         DAC BYBMO
         LAC I BYBMO
         DAC YBMO
         LAW 17776
         TAD POSDF
         DAC POSDFL
         JMP SEGEX
LB2,     POV PO 1000
         POH SB 1730
         DJS SB , 2
         JMP INTMO
         DDS CH 3
         111637                     /IN
         PAR PO
         POV PO 700
         POH SB 1730
         DJS SB , 2
         JMP SCAMO
         DDS CH 3
         230337                     /SC
         PAR PO
         POV PO 600
         POH SB 1730
         DJS SB , 2
         JMP CATMO
         DDS CH 3
         030137                     /CA
         PAR PO
         POV PO 500
/ ---- scan page 012 ----
         POH SB 1730
         DJS SB , 2
         JMP REDUC
         DDS CH 3
         220537                     /RE
         PAR PO
         POV PO 400
         POH SB 1730
         DJS SB , 2
         JMP ROTMO
         DDS CH 3
         221737                     /RO
         PAR SB
         DJP PO LB3
INTMO,   LAC MBLINK                 /CHANGE INTENSITY
         SNA
         JMP PEN1
         LAC (160113                /SET BRIGHTNESS LOW UNTIL NEXT POINT ACTION
         DAC I BLINK
         JMP PEN1
         LAW 17760
         AND I BSBWOR
         DAC TEMP
         LAC I BSBWOR
         AND (7
         SNA
         JMP . 7                    /ZERO DEFAULT SETTING
         TAD (777777
         SNA
         LAC (7                     /PREVENT INVISIBLE PICTURE
         TAD (10
         TAD TEMP
         DAC I BSBWOR
         JMP BLIROU
         LAC (16                    /DECREASE ONE LEVEL FROM DEFAULT SETTING
         JMP .-4
SCAMO,   LAC MBLINK                 /CHANGE SCALE
         SNA
         JMP PEN1
         LAC (160117                /SET TO SCALE 2 UNTIL NEXT POINT ACTION
         DAC I BLINK
         JMP PEN1
         LAW 17617
         AND I BSBWOR
         DAC TEMP
         LAC I BSBWOR
         AND (60
         SAD (60
         JMP . 5                    /GO BACK TO SC0 FROM SC3
         TAD (120
         TAD TEMP
         DAC I BSBWOR
         JMP BLIROU
         LAC (100
         JMP .-4
/ ---- scan page 013 ----
CATMO,   JMS TESLEV                 /CATALOGUE BLINKING ITEM
CATMO1,  ISZ RCATAL
         LAC BLINK
         DAC DACO
         DZM I DFB                  /STOP PERMDF TO CHANGE LOC 4 WHILE DFCON
         JMP BLIROU
REDUC,   JMS TESLEV
         ISZ RREDUC
         JMP CATMO1
ROTMO,   JMS TESLEV                 /TOTATE BLINKING ITEM
         ISZ RROTAT
         JMP CATMO1
PIXEX,   LAC ERASE                  /EXTENDED PIXE
         DAC LBD
         LAC I DFB
         SZA
         ISZ CDOCOM
         LAC (DJP PD LB3
         DAC LB1
         LAC (PAR PD PF
         DAC LB4
         ISZ DFB
         DZM I DFB
         LAC DFB
         SAD BEG
         SKP
         JMP .-5
         LAC (12301
         DAC BEG
         LAC (60
         DAC DFB                    /STOP DISPLAY OF PERMDF
         DZM I DFB
         LAC (1600
         DAC DFE
         DAC DFENOR
         LAC (1700
         DAC DFERES
         JMS PEN3
         JMP I PEN
DFCON,   0                          /DISPLAY FILE CONVERTER
         LAC (DDS VE 4
         DAC I 10
         DZM MODE                   /PAR MODE
/ ---- scan page 014 ----
         JMS DPSIM                  /BUILT NEW DF
         LAC 10
         DAC TEMP
         LAC I TEMP
         TAD (400000                /ES BIT FOR LAST WORD
         DAC I TEMP
         LAC (160000
         DAC I 10
         LAC (DJP SB 4
         DAC I 10
         JMP I DPCON
DPSIM,   0                          /DISPLAY SIMULATOR
         LAC DACO
         SAD BLINK1                 /TEST FIN
         JMP I DPSIM
         LAC I DACO                 /SAVE DISPLAY WORD
         DAC TEMP
         LAC MODE
         SNA
         JMP PAMODE
         SAD (160000
         JMP SBMODE
         SAD (100000
         JMP VEMODE
         SAD (60000
         JMP CHMODE
         HLT                        /MODE NOT ACCOUNTED FOR
PAMODE,  ISZ DACO
         LAC TEMP                   /GET NEW MODE
         AND (160000
         DAC MODE
         JMP DPSIM1
SBMODE,  LAC TEMP
         AND (17777
         DAC JMPADR                 /ESTABLISH JMP ADDR
         LAC TEMP
         AND (600000                /TEST FOR DJS, DDS AND DJP
         SAD (600000
         JMP . + 6                  /IS DJS
         SAD (200000
         JMP . 10                   /IS DDS
         LAC JMPADR                 /IS DJP
         DAC DACO
         JMP PAMODE1
         ISZ DACO
         LAC DACO
         DAC ASR                    /SAVE RETURN ADDR
         JMP .-6
         LAC ASR
         TAD (DJP
         DAC I JMPADR               /TO JMP BACK LATER
         JMP PAMODE
/ ---- scan page 015 ----
VEMODE,  LAC RREDUC
         SZA
         JMS SHRINK
         LAC TEMP
         AND (377777                /ELIMINATE ES BIT
         DAC I 10                   /VECTOR WORD INTO NEW DF
         JMS CALDEF
         ISZ DACO
         LAC TEMP                   /TEST ES BIT
         SPA
         DZM MODE                   /PAMODE
         JMP DPSIM1
CHMODE,  ISZ DACO
         LAC TEMP                   /SHOULD BE CH WORD
         AND (37
         SAD (37                    /TEST WHETHER ESCAPE
         JMP . + 4                  /RETURN TO PAMODE
         LAC I DACO
         DAC TEMP                   /NEW CH WORD
         JMP . - 7
         DZM MODE                   /SET PARAMETER MODE
         JMP DPSIM1
CALDEF,  0
         LAC 10                     /CALCULATE DEFLECTION
         DAC COMPOS
         JMS MASKX
         LAC 10
         DAC COMPOS
         JMS MASKY
         JMP I CALDEF
CELE,    DAC 11                     /CREATE BASIC ELEMENT
         LAC CON
         SZA
         JMP . + 5
         LAC 11
         TAD (3
         DAC ELAD
         JMP INEL
         LAC SCRPAD
         CMA
         TAD (TEMPDF 240
         SPA
         JMP PEN1                   /TOO MANY SYMBOLS
         LAC SCRPAD
         DAC 10
         LAC I 11                   /LENGTH
         DAC I 10
         LAC CON
         ALSS 11
         TAD I 11
         DAC I 10                   /ELTYPE
         LAC I 11                   /DDS VR 4
/ ---- scan page 016 ----
         DAC I 10
         LAC 10
         DAC ELAD                   /START ADDRESS OF ELEMENT
         LAC CON
         CMA
         TAD (1
         DAC COUNT
         JMS TURNVE
         LAC 10
         DAC SCRPAD
         JMP INEL
SHRINK,  0
         LAC TEMP
         AND (77577                 /ELIMINATE MINUS BITS
         TAD (401                   /COMPENSATE FOR LOOSING BITS
         RAR
         AND (77577                 /ELIMINATE SHIFTED MINUS BITS
         DAC TEMP1
         LAC TEMP
         AND (700200                /PICK UP SIGN OF WORD
         TAD TEMP1
         DAC TEMP
         JMP I SHRINK
TURNVE,  0                          /TURN 90, 180 OR 270 DEG
         JMP . + 4                  /START OF NEW DF
         LAC ELAD
         DAC 10
         DAC 11
         LAC I 11
         DAC WORD
         SAD (PAR SB
         JMP . 21
         AND (600000                /SAVE ES BIT AND IN
         DAC TEMP
         LAC WORD
         XOR (200                   /CHANGE SIGN
         CLL
         ALS 10
         AND (177400                /+-X BECOMES -+Y
         TAD TEMP
         DAC TEMP
         LAC WORD
         LRS 10
         AND (377                   /Y BECOMES X
         TAD TEMP
         DAC I 10
         JMS CALDEF                 /RESULT ONLY USED IN RROTAT
         JMP TURNVE5                /TAKE NEXT WORD
         LAC (160000
         DAC I 10
         LAC (DJP SB 4
         DAC I 10
         ISZ COUNT                  /IF COUNT=777776 TURN 180
/ ---- scan page 017 ----
         JMP TURNVE2                /ANOTHER TURN OF ELEN
         JMP I TURNVE
WAIT92,  JMS ADJLEV
         JMS AMEND3
         LAC RREDUC
         TAD RROTAT
         SZA
         JMS FONBL
         DZM XTOT
         DZM YTOT
         LAC (TEMPDF 10
         DAC ELAD
         DAC 10
         JMS DFCON                  /CREATE DUMMY FILE
         LAC (TEMPDF 10             /CAL LENGTH OF BLOCK DATA
         CMA
         TAD (1
         TAD 10
         DAC LENGTH
         LAC RROTAT
         SZA
         JMP WAIT15
WAIT91,  LAC ELCOUN                 /START WITH 400
         TAD (14
         DAC ETYPE
         AND (770
         DAC ELCOUN
         JMS FOCBL1                 /FORM CAT BLOCK
         JMS FOCBL3
         JMS FOCBL4
         JMS FOCBL2                 /DEFLECTION
         JMS CATDAO                 /DISCONNECT LINES , IF ANY
         ISZ CDOCOM
         DZM RCATAL
         DZM RREDUC
         DZM SAVGSU
         DZM NODRA
         JMS DELLEV
         JMP WAIT3
WAIT15,  LAC (TEMPDF 11             /REQUEST TO ROTATE
         DAC ELAD                   /ADDR OF DDS VE 4
         DAC 10
         DAC 11
         LAM
         DAC COUNT                  /TURN ONLY 90 DEG
         DZM XTOT
         DZM YTOT
         JMS TURNVE                 /TURN DUMMY FILE IN TEMPDF SPACE
         LAC (TEMPDF 10
         DAC ELAD
         DZM RROTAT
/ ---- scan page 018 ----
         JMP WAIT91
FOCBL1,  0
         LAW SBPI
         FINDN
         LAC SBPI                   /PUT NEW BASIC SBPI ON LIST
         DAC I SYM
         LAW OP 1
         CDR
         CDR
         LAC ETYPE
         DAC I OP 1                 /TYPE , DIR AND SUBP
         LAW OP 1
         CDR
         LAC (10000
         DAC I OP 1
         JMP I FOCBL1
FOCBL3,  0
         LAC LENGTH                 /LENGTH OF BASIC ELEMENT
         BDN
         LAW PBDM
         LAW OP 1
         CDR
         LAC I PBDM
         DAC I OP 1                 /CEP POINTS TO BDM
         JMP I FOCBL3
FOCBL4,  0
         AND (17777
         DAC TEMP
         DAC 11                     /START OF BLOCK DATA
         LAC ELAD
         DAC 10                     /START OF BASIC ELEMENT
         LAM
         TAD I TEMP
         AND (17777
         SAD 11
         JMP I FOCBL4               /TEMPDF IN BLOCK DATA
         LAC I 10
         DAC I 11
         JMP .-7
FOCBL2,  0                          /DEFLECTION OF BEAM
         LAW OP 1
         CDR
         LAC XTOT
         AND (17777
         DAC I OP 1
         LAW OP 1
         CDR
         LAC YTOT
         AND (17777
         DAC I OP 1
         JMP I FOCBL2
/ ---- scan page 019 ----
INEL,    LAC TEMPEN
         CMA
         TAD (5
         TAD POSDF
         SMA
         JMP PEN1
         LAW
         TAD ELAD
         ISZ POSDFL
         ISZ POSDFL
         DAC I POSDFL
         JMS INSRET
         JMS MOVCR
         JMP PEN1
MOVCR,   0                          /MOVE CROSS AFTER INSERT ELEM
         LAM
         DAC CON1
         LAC CON
         SZA
         JMP . 7
         LAC XCROSS
         TAD (100
         DAC XCROSS
         LAC XBML
         DAC XBMO
         JMP I MOVCR
         TAD (777776
         SZA
         JMP . 7
         LAW 17700
         TAD XCROSS
         DAC XCROSS
         LAC XBML
         DAC XBMO
         JMP I MOVCR
         SMA
         JMP . 5
         LAW 17700
         TAD YCROSS
         DAC YCROSS
         JMP . 4
         LAC YCROSS
         TAD (100
         DAC YCROSS
         LAC (1
         DAC CON1
         LAC YBML
         DAC YBMO
         JMP I MOVCR
CONELE,  SMA                        /CHECK FOR POS OF ELEM
         JMP SEGEY                  /IN CURRENT LINE SEQUENCE
         JMS SXY
         LAC XBMO                   /TAKE OLD AND NEW XBM, IF
/ ---- scan page 020 ----
         CMA                        /OLD > NEW ERASE ELEM
         TAD XBM
         SMA
         JMP . 3
         DZM CON1
         JMP SEGX                   /ERASE SYMBOL
         LAC XBMO
         TAD (100
         DAC ENOEX
         TAD (4                     /PREVENT ZERO LINE
         CMA
         TAD (1
         TAD XBM
         SPA
         JMP PEN1                   /NO ACTION
         JMS SAVTEM                 /SAVE SYMBOL AND ADD LINE
         LAW 17776
         TAD CON
         SMA
         JMP . 4
         LAC ENOEX
         TAD PNTX
         JMP . 5
         LAC ENOEX
         CMA
         TAD (1
         TAD PNTX
         DAC PNTX
         JMS SXY
         JMP SEGX
SEGEY,   JMS SXY                    /TAKE OLD AND NEW YBM, IF
         LAC YBMO                   /OLD > NEW ERASE ELEM
         CMA
         TAD YBM
         SMA
         JMP . 3
         DZM CON1
         JMP SEGY
         LAC YBMO
         TAD (100
         DAC ENOEY
         TAD (4
         CMA
         TAD (1
         TAD YBM
         SPA
         JMP PEN1
         JMS SAVTEM
         LAC CON
         SAD (1
         JMP . 4                    /PREVENT ZERO LINE
         LAC ENOEY
         TAD PNTY
         JMP . 5
         LAC ENOEY
/ ---- scan page 021 ----
         CMA
         TAD (1
         TAD PNTY
         DAC PNTY
         JMS SXY
         JMP SEGY
CSEV,    LAC SEVCLB
         JMP CELE
CEIG,    LAC EIGCLB
         JMP CELE
CFST,    LAC FSTCLB
         JMP CELE
CSND,    LAC SNDCLB
         JMP CELE
CTRD,    LAC TRDCLB
         JMP CELE
CFIF,    LAC FIFCLB
         JMP CELE
CSIX,    LAC SIXCLB
         JMP CELE
CFOU,    LAC FOUCLB
         JMP CELE
STXBMO,  STSPST 0                   /BOTTOM OF STACK FOR OLD XBM OF SYMBOL
STYBMO,  STSPST 20                  / "
STSPST,  0                          /SPECIAL STACK
                                    /WATCH THE END OF THIS STACK
         NODISP
         1701/
                                    /LTPIX/RELOC
                                    / LINK TRANSFER ROUTINE FOR PIXIE (PDP7-TITAN)
LTPX,    HLT
         DZM SW                     / note first blocklet
         IOF
         LCF
TX,      LAW 4
                                    / READ 4 BLOCKLET HEADERS FROM TITAN
TH,      LKE!LLB6
/ ---- scan page 022 ----
         JMS WAITLK
         LRB18!LLAM
         DAC HDR1
         LAW 6
         LLB6
         JMS WAITLK
         LRB18!LLAM
         XOR HDR1
         DAC SAV
         JMS WAITLK
         LRB18!LLAM
         DAC BSZ
         JMS WAITLK
         LRB18!LLAM
         XOR BSZ
         ADD SAV
         CMA
         SZA!CLA
         JMP TH                     / try again if header format wrong
                                    / SET WORD COUNT FOR THIS BLOCKLET
         LAC HDR1
         AND (17777
         CMA
         DAC BSZ
         ISZ BSZ                    / end of transfer?
         JMP TS
         JMP PXOK                   / normal exit
TS,      DZM CKS
         LAC SW
         SZA                        / 1st blocklet?
         JMP TZ
                                    / TRANSFER 4-WORD STREAM HEADING (PXID,DSBEG,DSEND,SAVINS)- 1st blocklet only
         DZM I DFB                  /STOP TO DIPLAY PERMDF BEFOR TRANSFER
         LAC PXID
         JMS RW
         SAD PXID
         SKP
         JMP PXER3                  / not PIXIE file
         LAC BEG
         JMS RW
         CMA
         TAD BEG
         TAD (1
         DAC RELCON
         LAC END
         JMS RW
         JMP FRSTCH
SNDCH,   LAC CERRGB                 /CHECK WHETHER TO END TO ENDRES
         SZA
/ ---- scan page 023 ----
         JMP PXER1                  /DS TO LONG
         JMS ERRGB
         LAC END
FRSTCH,  TAD RELCON                 /TEST LENGTH OF DS
         CMA
         DAC DS
         TAD (1
         TAD END
         SPA
         JMP PXER1                  /JMP SNDCH FOR ENDRES, JMP PXER1 WITHOUT ENDRES
         LAC DS
         TAD BEG
         DAC DS                     / size of DS area for transfer
         LAC SAVINS
         JMS RW
         TAD RELCON
         DAC SAVINS                 / relocate D.S. pointer
         LAM
         TAD BEG
         DAC ADR
         DAC ADR1
         LAC BSZ
         TAD (4
         DAC BSZ
                                    / TRANSFER DATA AREA
TZ,      LAC DS                     / if data structure exhausted ...
         SNA!CLA                    / ... transfer zeros
         JMP TV
         ISZ ADR
         ISZ DS
         LAC I ADR
TV,      JMS RW
         DAC I ADR
         ISZ BSZ                    / end of data block?
         JMP TZ
         ISZ SW                     / count blocklets
         JMS WAITLK
         LRB18!LLAM                 / read TITAN checksum
         SAD CKS
         JMP TX
         LLB6 10                    / transfer failure
         JMP PXER2
PXOK,    ISZ LTPX                   / OK EXIT
/ ---- scan page 024 ----
                                    / RELOCATE DATA IF NECESSARY (Titan to PDP only)
         LAC RELCON
         SNA
         JMP RLCEND                 / any relocation necessary?
RELOC1,  ISZ ADR1
RELOC4,  LAC ADR
         CMA
         TAD ADR1
         SMA
         JMP RLCEND                 / end of data area?
         LAC I ADR1
         SAD (JMS
         JMP RELOC1                 / NIL item?
         AND (760000
         SNA
         JMP RELOC1                 / atom?
         LAC I ADR1
         TAD RELCON
         DAC I ADR1                 / ... else relocate item
         AND (760000
         SAD (20000                 / block header?
         SKP
         JMP RELOC1
         LAC I ADR1
         AND (17777
         DAC ADR1                   / yes, skip over blockdata
         JMP RELOC4
RLCEND,
PXER1,   ISZ LTPX                   / incoming file too large (Titan to PDP only)
PXER3,   ISZ LTPX                   / not PIXIE data (Titan to PDP only)
PXER2,   LSA                        / checksum failure on transfer
         JMP .-1
         LKD
         DZM I END
         LAC I DFB
         SNA
         JMP I LTPX
         IDSI
         JMP .-1
         JMP I LTPX
PXID,    767676
                                    / S.R.   AWAIT INTERRUPT AND READ/WRITE
RW,      HLT
         DAC SAV                    / save word (if writing)
         JMS WAITLK
/ ---- scan page 025 ----
         LAC HDR1
         RTL
         LAC SAV
         SZL                        / read/write according as OFLO= 1/0
         LRB18
         LLB18!LLAM
         DAC SAV
         TAD CKS
         DAC CKS
         LAC SAV                    / update checksum
         JMP I RW
WAITLK,  HLT
RW1,     KSF                        / teletype interrupt?
         JMP RW2
         KRB
         SAD CR                     / abandon transfer if CTL X
         JMP BERTP1
RW2,     IDSI
         JMP . 6
         LAC I DFB
         SNA
         JMP . 3
         LAC DFB
         IDLA                       /restart PDF  if stopcode
         LSF
         JMP RW1                    / loop until link flag
         NOP
         LCF
         JMP I WAITLK
         PAUSE
/ ---- scan page 026 ----
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
         JMP I SETUP-JMS
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
         JMP I SETUP1-JMS
ERR,     0
         HLT                        /STACKS TO SHORT OR ?
         DAC NOTE 5
         JMP ERRMEB
         0                          /RTN TO SET OP, OP 1
         DAC OP
/ ---- scan page 027 ----
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
         JMP FLST-JMS+3             /LOOP TO TRY AGAIN
         DAC OP 1
         DAC OP+6                   /SAVE LAST ADDRESS
         ISZ OP+6
         LAC I FREE
         AND (17777
         DAC FREE                   /ADVANCE FREE
         LAC (100000
         DAC I OP 1
         DAC I OP+6                 /SET NIL
         JMP I FLST-JMS             /EXIT WHEN ITEM CHAINED TO OP
/ ---- scan page 028 ----
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
         JMP I CDR-JMS
         CAR = JMS .
         0
         JMS OP-5
         LAC I OP+1
/ ---- scan page 029 ----
         CAR 7
         DAC I OP                   /MOVE NAME
         LAC OP
         JMP I CAR-JMS
         0                          /SET OP+1 WITH ADDRESS FROM AC AND MS 5 BITS 00100
         AND (17777                 / AND MOVE TO NEXT ITEM IF NONITEM
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
         DAC OP+3                   /SAVE ITEM
         FLST                       /MAKE SPACE FOR NEW ITEM
         LAC OP+2
         DAC I OP+1
         LAC OP+1
         DAC I OP
         ISZ OP+1
         FLST                       /MAKE MORE SPACE
         LAC OP+2
         DAC I OP+1                 /COPY ITEM
         LAC EL1
         XOR (500000
         DAC I OP+6                 /JOIN UP
         LAC OP
         JMP I PUSH-JMS
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
         JMP I POP-JMS
STAK-JMS, 0                          /OPERAND TO STACK
         AND (17777
         DAC OP+3
         ISZ LOP
         LAC LOP
         SAD LKBEG
/ ---- scan page 030 ----
         JMS ERR
         LAC OP+3
         DAC I LOP
         JMP I STAK-JMS
UNSTAK-JMS, 0                          /OPERAND FROM STACK
         LAC I LOP
         DAC OP+3
         LAC LOP
         SAD LPBEG
         JMS ERR
         TAD (777777
         DAC LOP
         LAC OP+3
         JMP I UNSTAK-JMS
         ENTER = JMS .
         0                          /ENTER SUBROUTINE (NAME ENTER
         DAC OP+3                   /SAVE ENTRY POINT
         ISZ LINK
         LAC LINK
         SAD LKEND
         JMS ERR
         LAC ENTER-JMS
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
/ ---- scan page 031 ----
         LAC GIND
         SAD TOP+1
         JMP GARB                   / TO LAST PHASE IF DONE ALL P NAMES
LIM1,    LAC I GIND                 /PICK UP P NAME
         DAC GBUG
         JMP GNTR
                                    /MAIN RECURSIVE ROUTINE
GBRNCH,  LAC GSTKP
         SAD TOP
         JMS ERR                    / BRANCH STACK EXPIRED
MK1,     LAC GBUG
         DAC I GSTKP
         ISZ GSTKP
GNTR,    DAC GTEMP                  / INITIAL ENTRY
         LAC I GBUG                 / "CAR"
         DAC GBUG
GR2,     LAC I GBUG                 / AND MOVE TO ITEM
         SMA
         JMP GITEM                  / JUMP IF ITEM
         AND (017777
         DAC GBUG
         LAC I GBUG
         SPA
         JMP .-4                    / REPEAT WHILE NONITEM
         LAC I GTEMP
         AND (760000                / RSP BITS
         SPA                        / JUMP IF ITEM
         TAD (200000                / MARK IF NONITEM
         TAD GBUG                   / NB GBUG MUST BE CLEAN HERE
         DAC I GTEMP                / SO SKIP REDUNDANT NONITEMS
GITEM,   LAC I GBUG
         AND (577777
         SAD (100000
         JMP GNIL                   / JMP IF NIL
         LAC I GBUG
         RTL
         SZL!CML                    / PREPARE TO MARK
         JMP GBRTN                  / EXIT IF MARKED ALREADY
         RTR                        / NOW MARK
         DAC I GBUG
         AND (560000
         SAD (020000
         JMP GBRTN                  / EXIT IF BLOCK DATA
         SZA                        / JUMP IF ATOM
         JMP GBRNCH                 / RECURSE IF LIST POINTER
GBCDR,   ISZ GBUG                   / "CDR"
         LAC GBUG
         DAC GTEMP
         JMP GR2                    / REPEAT
                                    / FOUND 1ST NIL
GNIL,    TAD (200000
         DAC I GBUG                 / MARK IT
/ ---- scan page 032 ----
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
         LAC I GSTKP                /RECOVER GBUG
         DAC GBUG
         JMP GBCDR                  /CARRY ON
                                    /GARBAGE COLLECTOR PHASE THREE
         GARB,
         LAC BEG
         DAC OP+7                   /START ADDRESS
         DZM OP+11                  /CONSECUTIVE INDICATOR ZERO
         LAC I OP+7
         AND (220000                /TO ALLOW FOR BLOCK DATA
         SAD (220000
         JMS GBD
         SAD (020000                /TO ALLOW FOR DEAD BLOCK DATA
         JMS GBD1
         RAL
         SMA
         JMP .+11                   /JUMP FIRST GARBAGE ITEM
         LAC I OP+7
         AND (577777
         DAC I OP+7                 /RESTORE LIST ITEM
         ISZ OP+7
         LAC OP+7                   /ADVANCE ADDRESS
         SAD END
         JMS ERRGB                  /EXIT NO GARBAGE TO COLLECT
GARB1,   JMP .-20                   /LOOP
         LAC OP+7
         DAC FREE                   /START NEW FREE LIST
         DAC OP+10
         LAC END
         TAD (400000
         DAC I OP+7                 /ATTACH TERMINAL WORD
         ISZ OP+7
         LAC OP+7                   /ADVANCE ADDRESS
         SAD END
         JMP .+25                   /EXIT
         LAC I OP+7
         AND (220000                /TO ALLOW FOR BLOCK DATA
         SAD (220000
         JMS GBD
         SAD (020000                /TO ALLOW FOR DEAD BLOCK DATA
/ ---- scan page 033 ----
         JMS GBD1
         RAL
         SMA
         JMP .+4                    /JUMP GOT MORE GARBAGE
         LAC I OP+7
         AND (577777
         JMP .-20                   /RESTORE LIST ITEM AND LOOP
         LAC OP+7
         TAD (400000
         DAC I OP+10                /COLLECT A WORD
         AND (17777
         ISZ OP+10
         SAD OP+10
         ISZ OP+11                  /CONSECUTIVE INDICATOR NONZERO
         JMP .-33                   /LOOP
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
         LAC OP+7
         TAD (020000
         TAD (1
         SAD I OP+7
         JMP I GBD1
         DAC OP+12
         DZM I OP+12
         JMP .-5                    /LOOP FOR FURTHUR ITEMS
                                    /BLOCK DATA PRODUCER
         BDN=JMS .
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
/ ---- scan page 034 ----
         TAD (400000
         DAC OP+11
         ISZ BCC
         LAC BCC                    /COUNT OF CONSECUTIVE WORDS FOUND
         SAD OP+2
         JMP BDO                    /CORRECT NO FOUND
         LAC I OP+11
         ISZ OP+11
         SAD OP+11
         JMP .-7                    /IF FREE LIST CONSECUTIVE
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
                                    /RING STRUCTURE PROCESSOR    MAY 1969
         FEL = JMS .
         0                          /FORM ELEMENT LENGTH ONE
         CLA
         FELN
         JMP I FEL-JMS
         FELN = JMS .
/ ---- scan page 035 ----
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
         JMP .-3                    /FORM HEADER
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
         NULLR = JMS .
         0                          /FORM NULL RING
         JMS OP-5
         TAD (40000                 /SET RINGSTART
         DAC I OP+1
         LAC OP
         JMP I NULLR-JMS
         INSRT = JMS .
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
         FINDS = JMS .
         0                          /FIND RINGSTART
         JMS OP-5
         DAC I OP                   /MOVE NAME
         LAC I OP+1
         AND (40000
         SZA
/ ---- scan page 036 ----
         JMP . 3                    /POINTER ON RINGSTART
         LAC I OP+1
         JMP OP-2                   /LOOP
         LAC OP
         JMP I FINDS-JMS            /EXIT
         FINDN = JMS .
         0                          /FIND NAME OF ELEMENT
         JMS OP-5
         LAC I OP+1
         AND (500000                /TEST IF ATOM
         SNA
         JMP . 4
         LAC OP
         CDR                        /NEXT
         JMP .-6                    /LOOP
         LAC OP
         JMP I FINDN-JMS            /EXIT
FINDP=JMS, 0                          / MOVE TO TOP OF HEAD IF ON ATNAME
         JMS OP-5
         LAC (100000
         AND I OP+1
         SNA
         JMP .+3                    / IF ATNAME
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
         JMP .+6                    / IF ON ATNAME
         LAC OP
GR1,     CDR
         LAC OP+1
         SAD OP+3
         EXIT                       / IF BACK TO STARTING-POINT
         LAC OP
         FINDP
         LAC OP+1
/ ---- scan page 037 ----
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
/ ---- scan page 038 ----
         JMP GR2
LKTEST,  0                          /TEST IF ROOM ON LINK STACK
         ISZ LINK
         LAC LINK
         SAD LKEND
         JMS ERR
LKERR,   JMP I LKTEST
                                    /RSP ROUTINES FOR USE WITHOUT QUALIFIERS
         ADDW = JMS .
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
         DSON = JMS .
         0                          /DELETE A SON RING
         DAC OP+4
         FINDS                      /IN CASE OF WRONG ENTRY
         LAW GRRB
         ENTER
         LAC OP 4
         LAW . 3
         ENTER                      /DO ALSO FOR RING-START
         AND I DSON
         LAC OP+4
         POP
         EXIT
         DELB = JMS .
         0                          /DELETE ELEMENT FROM BROTHER RING
         JMS OP-5
         DAC OP+3
         LAC I OP+1
/ ---- scan page 039 ----
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
         JMP .-5
         LAC I OP+2
         AND (40000                 /PRESERVE IF RING START
         TAD I OP+3
         DAC I OP+2                 /DELETE POINTER
         LAC OP
         POP
         JMP I DELB-JMS
         PAUSE
/ ---- scan page 040 ----
                                    /MBWAIT
MESOUT=JMS, 0                          /OUTPUT MESSAGE
         DAC OP+5
         LAC MIN
         SAD WAIT1                  /LAM
         WAIT-5                     /FINISH I/P MESSAGE
         ADD MOUT
         SZA
         JMP .-5                    /LOOP TELETYPE BUSY
         ISZ MOUT
         LAC OP+5
         DAC MSOUT
         LAC I MSOUT                /START O/P
         TLS
         AND I MESOUT
         0
         LAW 212
         TLS                        /OUTPUT LINEFEED AFTER I/P
         DAC MIN                    /SET MIN <-2
         JMP I .-4
WAIT=JMS, 0                          /WAIT FOR ACTIVATIONS
         LAC RERROR
         SNA
         JMP WAIT11
         DZM RERROR
         LAW NOTE
         MESOUT
WAIT11,  LAC RTFIRI                 /REQUEST TEST FIRST INTERRUPT?
         SNA                        /PUT CROSS ON ENDPOINT
         JMP WAIT12
         DZM CCAT
         JMS AMEND3
         DZM RTFIRI
         LAC CMODE                  /TEST WHETHER IN TRACKMODE
         SPA
         ISZ RTRACK
         LAC CCAT
         SNA
         JMP WAIT12
         LAM
         DAC CCOM1                  /NEW NODE FOR AMEND
WAIT12,  LAC RTSNDI                 /REQUEST TEST SECOND INTERRUPT?
         SNA
         JMP WAIT13
         DZM RTSNDI
         DZM CCAT
         JMS AMEND4
         ISZ CUPCOM
         LAC CCAT
         SZA
/ ---- scan page 041 ----
         JMP WAIT13
         LAC CCOM1                  /FINISHED ON NODE
         TAD (2
         DAC CCOM1
WAIT13,  LAC RCOPY                  /REQUEST TO COPY
         SNA
         JMP WAIT9
         JMS ADJLEV
         JMS AMEND3
         JMS FONBL
         LAW SUBP                   /SUBP TO INST
         ADDW
         LAW INST
         CDR
         INSRT
         LAW SUBP
         ISZ CDOCOM
         LAM
         DAC RMODE                  /TRACKMODE
         DZM RCOPY
         DZM SAVGSU
WAIT9,   LAC RCATAL                 /REQUEST TO CATALOGUE
         SNA
         JMP WAIT3
         JMP WAIT92
WAIT3,   LAC RATTPO                 /REQUEST FOR ATTPOINT
         SNA
         JMP WAIT7
         JMS ADJLEV
         JMS AMEND3                 /NO ATTPO ON LINE
         LAC XINS
         CMA                        /GET DATA FOR ATTPO
         TAD (1
         TAD TEMPY
         DAC XTOT
         LAC YINS
         CMA
         TAD (1
         TAD TEMPY
         DAC YTOT
         JMS ATTPEL
         DZM RATTPO
         DZM SAVESU
WAIT7,   LAC RGROUP                 /REQUEST TO GROUP
         SNA
         JMP WAITZ
         JMS ADJLEV
         JMS AMEND3
         LAC SAVESU
         SZA
         JMP . 12
         DZM XTOTIN
         DZM YTOTIN                 /FIRST ENTRY
/ ---- scan page 042 ----
         JMS FONBL
         LAW INST
         FINDN
         LAC INST
         DAC SAVGIN                 /SAVE GROUP INST
         LAC SBPI
         DAC SAVGSU                 /SAVE GROUP SBPI
         JMS WAITS                  /TAKE BLINKING INST
         LAC X
         SAD SAVGIN
         JMP . 15                   /TRIES TO GROUP GROUP INST
         LAW X
         FINDP
         DSON
         LAW X
         ADDW
         LAW SAVGSU
         ADDW
         INSRT
         LAW X
         JMS DELLEV
         ISZ CDOCOM
         DZM RGROUP
WAITZ,   LAC RERASE                 /ERASE REQUEST
         SNA
         JMP WAIT8
         DZM RERASE
         ISZ CDOCOM
         DZM MBLINK
         JMS WAITS
         LAW X
         FINDP                      /MUST BE RINGSTART POINTING TO UPPER SUBP
         DSON
         LAC I X                    /CHECK WHETHER LINE OR INST
         AND (100000                /IF LINE, LOGIC AND WITH ATNAME
         SNA
         JMP WAIT8                  /WAS LINE, HAS ONLY ONE RINGSTART
         LAW X
         FINDS                      /GOES TO RINGSTART OF LOWER SUBP
         DSON
         JMS DELLEV
WAIT8,   LAC RUPCOM
         SNA
         JMP . 4
         DZM RUPCOM
         JMS UPCOMP
         ISZ CDOCOM
         LAC RDOCOM
         SNA
         JMP WAITIA
         DZM RDOCOM
         LAW SAVINS
         COMPIL
         ISZ CISRTN
/ ---- scan page 043 ----
WAIT10,  LAC RMODE                  /REQUESTED MODE
         SAD CMODE                  /CURRENT MODE
         JMP WAIT4                  /NO MODE CHANGE
         DAC CMODE                  /SET NEW MODE
         SMA                        /ENTERING TRACKING MODE
         JMP WAIT1                  /SERVICE TTY
         JMS WAITS                  /ATNAME FROM SNAPSHOT LIST
         FLEAS                      /FLEA ON POINT ELEMENT
         LAC PNT1
         DAC YP                     /SAVE FOR TRACKING
         LAC I PNT1
         CMA
         TAD (1
         TAD TEMPY                  /ADD PEN COORD
         DAC TRAKY
         LAW PNT1
         EDR
         LAC PNT1
         DAC XP                     /SAVE FOR TRACKING
         LAC I PNT1
         CMA
         TAD (1
         TAD TEMPX                  /ADD PEN COORD
         DAC TRAKX
WAIT1,   LAW                        /HERE SERVICE TTY
         SAD MIN
         WAIT-5                     /FINISH INPUT WITH LF
         LAC IMC
         SNA
         AND I WAIT                 /EXIT
         DZM IMC
         LAW
         DAC MIN
         JMP MESIN                  /MESSAGE READY
WAIT4,   SNA                        /HERE NO MODE CHANGE
         JMP WAIT1                  /DRAW MODE, TEST TTY
         SMA
         JMP WAIT6                  /POINTING MODE
         LAC RTRACK                 /TRACK MODE, REQUEST?
         SNA
         JMP WAIT1                  /NO, TEST TTY
         DZM RTRACK
         LAC TRAKY
         CMA
         TAD (1
         TAD TEMPY
         AND (17777
         DAC I YP                   /UPDATE YPOINT
         LAC TRAKX
         CMA
         TAD (1
         TAD TEMPX
         AND (17777
         DAC I XP                   /UPDATE XPOINT
         ISZ CDOCOM
/ ---- scan page 044 ----
         JMP WAIT1                  /TEST TTY
WAITS,   0                          /GET ATNAME FROM SNAPSHOT LIST
         LAC I LEVEL                /INST OR LINE
         DAC X
         LAW X
         CAR
         CAR                        /PUT & ON ATNAME
         JMP I WAITS
WAIT6,   LAC RBLINK                 /POINTING MODE, REQUEST?
         SNA
         JMP WAIT1                  /NO, TEST TTY
         DZM RBLINK
         JMS WAITS
         CDR
         CDR
         CDR                        /X ON DATA WORD
         LAC I X
         AND (3777
         XOR (4000
         DAC I X                    /SET UP BLINK MARK
         LAC X
         DAC BSWOR                  /BLINK, SCALE AND INTENSITY WORD IN INST OR LINE
         LAW SAVINS
         COMPIL                     /COMPILE NEW PICTURE
         LAC (160117                /TO GET SCALE AND BRIGHTNESS RESTORED
         DAC I BLINK1               /RESTORE INTENSITY AFTER BLINK
         LAW 17767
         DAC MBLINK                 /START BLINK
         JMP WAIT1                  /TEST TTY
MESIN,   LAC MBLINK
         SNA
         JMP MESIN7                 /EXPORTING COMMAND
         JMS WAITS                  /X ON ATNAME
         LAW DP 1                   /CHECK WHETHER LINE
         CDR
         CDR
         LAC I OP 1
         SAD 13
         JMP ERR6                   /FOUND LINE, NOTE 6
         LAC I MSIN
         SAD 13
         JMP MESIN3                 /GOT A /
         SAD COLON
         JMP MESIN6                 /GOT A:
         SAD CR
         JMP . + 4                  /GOT A CR
         LAW
         COPIN                      /COPY PRINTNAME
         AND I WAIT                 /EXIT
         LAC X
         DAC Y                      /SAVE FOR USE WHEN MESSAGES DONE
         JMS MESIN6                 /PRINT PRINTNAME
         LAW
         CDR
         CDR
/ ---- scan page 045 ----
         CDR
         CDR
         CDR
         CDR                        /INTO DATA
         LAC I X
         SAD (JMS
         JMP . + 4                  /JUMP MESSAGES DONE
         JMS MESIN6                 /PRINT A MESSAGE
         LAW X
         JMP .-6                    /LOOP
         LAC Y
         DAC X                      /RESTORE OLD VALUE
         JMS MESIN9                 /MOVE X TO SUBPICTURE
         LAW COLON
         MESOUT
         JMS MESIN6                 /OUTPUT PRINTNAME OF SUBPICTURE
         AND I WAIT                 /EXIT ALL DONE
MESIN6,  0
         LAW X
         COPOUT                     /COPY MESSAGE
         LAC MESS
         MESOUT                     /PRINT MESSAGE
         LAW MESIN4+1
         MESOUT                     /PRINT CRLF
         JMP I MESIN6
MESIN7,  DZM SUMB                   /EXPECTING COMMAND
         LAC MSIN
         DAC TEMP
         JMS MESIN1
         JMS MESIN1
         JMS MESIN1                 /FIRST 3 CHARS
         DZM TEMP
         LAW MESL
         DAC TEMP1
         LAC I TEMP1
         SNA
         JMP MESIN3-3               /NOT A COMMAND
         SAD SUMB                   /COMPARE
         JMP MESIN2                 /EXECUTE
         ISZ TEMP
         ISZ TEMP1
         JMP .-7                    /LOOP
MESIN8,  JMS MESIN9                 /MOVE X TO SUBP IF :
         COPIN
         AND I WAIT
MESIN9,  0                          /MOVE X TO SUBPICTURE
         LAW X
         FINDP
         CDR
         FINDS
         FINDN
         JMP I MESIN9
MESIN1,  0                          /ADD A CHAR TO SUMB
         LAC SUMB
         ALSS 6                     /LEFT 6 SIGNED
         TAD I TEMP
         DAC SUMB
/ ---- scan page 046 ----
         ISZ TEMP
         JMP I MESIN1
MESIN2,  LAW MESSAG                 /JUMP TABLE STARTS
         TAD TEMP                   /DISPLACEMENT
         DAC TEMP
         LAC (1777                  /FOR GRID CONSTANT
         XCT I TEMP                 /ENTER COMMAND
         DAC GRID                   /SET GRID
         JMS POSCR                  /PUT ON GRID POINT
         LAC SAVINS
         SZA
         ISZ CDOCOM
         AND I WAIT
         LAW MESIN4                 /?CRLF IF WRONG COMMAND
         MESOUT
         AND I WAIT
MESIN3,  LAW X                      /MESSAGE STARTS /
         CDR
         LAC I X
         SAD (100000
         JMP . 3                    /ON NIL
         LAW X
         JMP .-5                    /LOOP TILL END OF DATA
         LAW NM
         GETSP
         LAC NM
         DAC I X                    /START SUBLIST
         LAC MSIN
         DAC MS                     /CHAR POINTER
         ISZ MS                     /MISS /
         LAC I MS
         SAD CR
         AND I WAIT                 /EXIT ALL DONE
         DAC I NM
         LAW NM
         CDR
         JMP .-7                    /LOOP TILL COPY COMPLETE
MESIN4,  277                        /?
615      /CR
212      /LF
215      /CR TERMINATION
MESL,    170402                     /LABEL
302114   /UNLABEL
271424   /TITAN
122511   /GRID
262701   /START
0        /TERMINATION
MESSAG,  ISZ RLABEL                 /LABEL
         DZM RLABEL                 /UNLABEL
         JMP MESIN5                 /TITAN
         LAC (1760                  /SET GRID ON
         JMP BEGRTP                 /INITIALIZE
MESIN5,  LAW SAVINS                 /HERE IF TITAN COMMUNICATION
         FINDN                      /IN CASE WRITING TO TITAN
         JMS LTPX
         JMP ERR3                   /CHECKSUM FAIL
/ ---- scan page 047 ----
         JMP ERR4                   /NOT PIXIE DATA
         JMP ERR5                   /DATA WONT FIT
         LAW SAVINS
         DAC I BOT                  /AWAY ALL INIT MANEW
         LAC BOT
         DAC TOP 1
         ISZ TOP 1
         LAC END
         DAC FREE
         SETUP1
         LAC SAVINS
         DAC X
         FLEAS
         LAC SUBP
         DAC SAVSUB
         ISZ CDOCOM
         JMP BERTP1
ERRMEA,  DAC NOTE 5                 /ERROR MESSAGE TYPE A
         ISZ RERROR                 /READ INSTR TO RECOVER
         JMP BERTP1
ERRMEB,  LAW NOTE                   /ERROR MESS TYPE B
         MESOUT
         JMP BEGRTP
ERR3,    LAW 263                    /CHECKSUM FAIL
         JMP ERRMEA
ERR5,    LAW 265                    /DATA WONT FIT
         DAC NOTE 5
         JMP ERRMEB
ERR6,    LAW 266                    /NO ATTP ON LINE OR CATALOGUE ETC
         JMP ERRMEA                 /ERROR IN COMMAND REFERRING TO LINE
ERR4,    LAW 264                    /NOT PIXIE DATA
         DAC NOTE 5
         JMP ERRMEB
ERRDF,   0                          /PERMDF RUNS OUT OF SPACE
         LAW 262
         DAC NOTE 5
         LAC CERRDF
         SZA
         JMP ERRMEB                 /2ND SPACE VIOLATION
         LAC DFERES
         DAC DFE
         ISZ CERRDF
         ISZ RERROR
         JMP I ERRDF
ERRGB,   0                          /GB RUNS OUT OF SPACE
         LAW 261
         DAC NOTE 5
/ ---- scan page 048 ----
         LAC CERRGB
         SZA
         JMP ERRMEB                 /2ND SPACE VIOLATION
         LAC ENDRES
         DAC END
         ISZ CERRGB
         ISZ RERROR
         LAC OP 7                   /KEEP FREE LIST CONSECUTIVE
         TAD (400001                /GET RID OF ZERO IN OLD END
         DAC I OP 7
         JMP I ERRGB
OUT-JMS, 0                          / SERVICE TELEPRINTER
         LAC MOUT
         SNA
         JMP , 12                   / IF NOT IN MESSAGE
         LAC I MSOUT
         SAD CR                     / CARRIAGE RETURN
         JMP , 7
         ISZ MSOUT
         LAC I MSOUT
         SAD CR
         JMP , 3
         TLS
         AND I OUT                  / EXIT
         TCF
         DZM MIN
         DZM MOUT
         AND I OUT                  / EXIT - NOT IN MESSAGE
INP-JMS, 0                          / SERVICE KEYBOARD
         LAC MOUT
         SZA
         JMP ,+22                   / IF IN O/P MESSAGE
         LAC MIN
         SPA
         JMP ,+17
         SZA
         JMP , 4                    / IN I/P MESSAGE
         LAC MSIN
         DAC MS
         ISZ MIN
         KRB
         SAD (277                   /?
         JMP , 6
         DAC I MS
         ISZ MS
         SAD CR                     / CARRIAGE RETURN
         ISZ IMC                    / MESSAGE COMPLETE
         AND I INP
         DZM MIN
         KRB                        / HERE IN O/P MESSAGE
         AND I INP
COPOUT-JMS, 0                          / COPY MESSAGE TO MSOUT
         JMS OP-5                   / SAVE NAME
         LAW OP+1
/ ---- scan page 049 ----
         CAR                        / INTO LIST
         LAC MESS                   /MESSAGE TO START IN MESS
         DAC OP+2
         LAC I OP 1
         SAD (JMS                   /SKIP UNLESS NIL
         LAC CR                     /CR TERMINATOR
         DAC I OP 2
         SAD CR
         AND I COPOUT               /EXIT IF END
         AND (JMS
         SNA                        /SKIP IF ADDRESS STYLE
         ISZ OP 2                   /OTHERWISE ADVANCE CHAR POINTER
         LAW OP 1
         CDR                        /NEXT IN LIST
         JMP ,-13                   /LOOP
COPIN-JMS, 0                          / COPY MSIN TO PRINTNAME
         JMS OP-5                   / SAVE NAME
         LAW OP+1
         FINDN
         CAR                        /INTO PRINTNAME
         CDR
         LAC MSIN
         DAC MS
         LAC I MS
         SAD COLON
         ISZ MS
         LAC I MS
         SAD (215
         LAC (JMS
         DAC I OP 1
         SAD (JMS
         AND I COPIN
         LAW OP 1
         CDR
         JMP ,-11
NOTE,    316
         317
         324
         305
         240
         0
         615                        /FOOL OUT TO GET CR
         212
         215                        /STOP
MESS,    MSIN 1
MS,      MSIN 1
MSOUT,   MSIN 1
MSIN,    MSIN 1
         215
         MSIN 50/
/ ---- scan page 050 ----
                                    /CONST
TEMPDF,  0
         TEMPDF 300/
POSDF,   TEMPDF 2                   /TEMPDF CONSTANTS
POSDFL,  TEMPDF 2
POSDFB,  TEMPDF 2
TEMPEN,  TEMPDF 75
TEMPX,   400                        /START POS OF CROSS
TEMPY,   400
STSTAK,  0
         STSTAK 140/
STPNTX,  STSTAK 0                   /FOR VECTORS
STPNTY,  STSTAK 20                  / "
STCON,   STSTAK 40                  / "
STPOS,   STSTAK 60
STCON1,  STSTAK 100
BFIRST,  STSTAK 120                 /STACKS FOR PERMDF INT
BSNDST,  STSTAK 130
LEVEL,   STSTAK 120
BLEVEL,  STSTAK 120
COUNT,   0                          /LONG VECTOR COUNT
CON,     777777                     /-1 NEW START POINT, 0 FOR +Y, 1 FOR
                                    /+X, ETC , 4 FOR RUBER LINE
CON1,    0                          /0 NO ELEM, -1 X-DIR ELEM, 1 Y-DIR ELEM
DRAWMO,  0                          /NOT 0 DRAWMODE, 0 NOT DRAWING
SWITCH,  777777                     /-1 SET 'A', 0 SET 'B'
CONSTX,  30                         /+HANDSHAKE
CONSTB,  777750                     /-HS
CONSTC,  0
CONSTD,  0                          /0 FOR STRAIGHT, 2 FOR RUB, 1 SAVED
CONSND,  777777                     /-1 IF NO 2ND INT, 0 IF YES
RMODE,   0                          /REQUESTED MODE
CMODE,   0                          /1 POIM, -1 TRACKM
MBLINK,  0
BLINK,   SCRABL
SCRABL,  0                          /FREE REG FOR DAC I BLINK
MIN,     0
MOUT,    0
IMC,     0                          /INPUT MESSAGE COMPLETE
WX1,     1                          /LEFT HAND SIDE OF WINDOW
WX2,     1700                       /RIGHT
WY1,     1                          /BOTTOM
WY2,     1777                       /TOP
/ ---- scan page 051 ----
SAVINS,  0
SAVSUB,  0
CCOM1,   777777
PRINT1,  260                        /FOR PRINTNAME OF INST
PRINT2,  260
         215
COLON,   272
CR,      215
                                    /MERGE WORKSPACE IN DOWNCOMPILER WITH STSTAK
         DEMP = STSTAK
         U2 = STSTAK 1
         V1 = STSTAK 2
         R1 = STSTAK 4
         YY1 = STSTAK 5
         YY2 = STSTAK 6
         DX = STSTAK 7
         COUN = STSTAK 10
         MRKY = STSTAK 11
         GAMMA = STSTAK 12
         U = STSTAK 13
         BETA = STSTAK 14
         TEM = STSTAK 15
         XBEAM = STSTAK 16
         X = STSTAK 20
         T2 = STSTAK 21
         V2 = STSTAK 22
         L = STSTAK 23
         STEST = STSTAK 25
         EX1 = STSTAK 26
         EX2 = STSTAK 27
         FIG = STSTAK 30
         YBMC = STSTAK 31
         MRKX = STSTAK 32
         MKER = STSTAK 33
         ALPHA = STSTAK 34
         DF = STSTAK 36
         LOPX = STSTAK 37
         T3 = STSTAK 40
         U1 = STSTAK 41
         R = STSTAK 42
         S1 = STSTAK 43
         SUMB = STSTAK 44
         DY = STSTAK 45
         PONT = STSTAK 46
         XBMC = STSTAK 47
         Y = STSTAK 50
         V = STSTAK 51
         TEMP2 = STSTAK 52
         YBEAM = STSTAK 53
/ ---- scan page 052 ----
         SVAD = STSTAK 54
         LOPY = STSTAK 55
                                    /MERGE WORKSPACE WITH EXEC
         SAV = STSTAK 60
         HDR1 = STSTAK 61
         DS = STSTAK 62
         ADR = STSTAK 63
         SW = STSTAK 64
         CKS = STSTAK 65
         RELCON = STSTAK 66
         ADR1 = STSTAK 67
         BSZ = STSTAK 70
                                    /MERGE WORKSPACE WIYH MBWAIT, RTP, TRCR, SYM, UPCOMP AND AMEND
         YP = STSTAK 101
         XP = STSTAK 102
         TRAKX = STSTAK 103
         TRAKY = STSTAK 104
         XTOT = STSTAK 105
         YTOT = STSTAK 106
         XINS = STSTAK 107
         YINS = STSTAK 110
         XTOTIN = STSTAK 111
         YTOTIN = STSTAK 112
         SBPI = STSTAK 115
         CCAT = STSTAK 116
         NM = STSTAK 117
         SUMB = STSTAK 71
         MODE = STSTAK 72
         DACO = STSTAK 73
         ASR = STSTAK 74
         COMPOS = STSTAK 75
         VEPART = STSTAK 76
         XINS1 = STSTAK 77
         YINS1 =STSTAK 113
         COMPOI = STSTAK 114
         SBPI1 = STSTAK 17
DFB,     12301                      /12301
DFE,     12400                      /13300
DFERES,  12440                      /13400
DFENOR,  12400                      /13300
BEG,     12441                      /13401
END,     13000                      /17200
ENDRES,  13100                      /17300
ENDNOR,  13000                      /17200
/ ---- scan page 053 ----
BOT,     13101                      /17301
TOP,     13200                      /17440
         0
LPBEG,   13201                      /17461
LKBEG,   13240                      /17560
LKEND,   13300                      /17620
XSTBEG,  13301                      /17621 /FOR DOWNCOMP
YSTBEG,  13340                      /17710
YSTEND,  13400                      /17750
STSAVE,  13401                      /17751
         PAUSE
/ ---- scan page 054 ----
                                    /RTP
         DISP
LB,      PAR PO PN SC1 IN6          /START OF LB'S
         POV PO 1700
         POH SB 1730
         DJS SB , 2
         JMP DRAMO
         DDS CH 3
         042237                     /DR
         PAR PO
         POV PO 1600
         POH SB 1730
         DJS SB , 2
         JMP STRAIG
         DDS CH 3
         102637                     /HV
         PAR PO
         POV PO 1500
         POH SB 1730
         DJS SB , 2
         JMP RUBBER
         DDS CH 3
         222537                     /RU
         PAR PO
         POV PO 1400
         POH SB 1730
         DJS SB , 2
LBSF,    JMP SD
         DDS CH 3
         230637                     /SF
         PAR PO
         POV PO 1200
         POH SB 1730
         DJS SB , 2
         JMP POIMO
         DDS CH 3
         201737                     /PO
         PAR PO
         POV PO 1100
         POH SB 1730
         DJS SB , 2
         JMP ATTMO
         DDS CH 3
         012437                     /AT
         PAR SB
LB1,     DJP PO LB2
LB3,     POV PO 300
/ ---- scan page 055 ----
         POH SB 1730
         DJS SB , 2
         JMP ENDCOM
         DDS CH 3
         051637                     /EN
LB4,     PAR PO
         POV PO 20
         POH SB 20
         DJS SB , 2
         JMP PIXEX
         DDS CH 3
*DECIMAL DIGIT IN OCTAL NUMBER
         201128                     /PIX
         110537                     /IE
WAREA,   PAR PO PF SC3 IN5          /WORKING AREA
         POV PO 0
         POH VE 0
         VEC ON 0 177
         VEC ON 170 0
         VEC ON 0 -177
         VEC ON -170
         VEC 0 10
         VEC ES ON 170 0
         PAR SB
TOTEMP,  DJP TEMPDF                 /TO TEMPORARY DISPLAY FILE
         PAR SB
         DJS SB , 2
         JMP STRCR
         DDS SB 3
         DJP TRACK                  /TO TRACKING CROSS
PSD,     VEC ES -34 14              /POS LB'S OF CROSS
PAD,     VEC ES 10 13
PRD,     VEC ES 20 0
PCD,     VEC ES 10 -13
PLD,     VEC ES -6 -36
PXD,     VEC ES -24 -11
INT,     DAC INT1                   /INTERRUPT ROUTINE
         IDSP
         SKP
         JMS PEN
         IDSI
         SKP
         JMS STPCD
         IDVE
         SKP
         JMS EDGEV
         IDHE
/ ---- scan page 056 ----
         SKP
         JMS EDGEH
         TSF
         SKP
         OUT
         KSF
         SKP
         INP
         CLSF
         SKP
         JMS CLOCK
         LAC 0
         RAL
         LAC INT1
         ION
         JMP I 0
PEN,     0                          /PEN INTERRUPT
         LAC (100177                /HIGH INTENSITY
         DAC SRAST
         LAC RTFIRI                 /PREVENT CALL TO COPFIR
         SZA
         JMP PEN1
         LAC 3
         SNA
         JMP PEN2                   /PERMDF INT
         LAC 5
         SNA
         JMP I 3                    /NO SYMBOL, BUT LB OR TRCR
         LAC DRAWMO                 /LB'S R,C,L OR V,I ETC
         SNA
         JMP PEN1
         LAC CON1                   /ONLY ONE ELEM
         SZA
         JMP PEN1
         LAC CONSTD                 /NO ELEMENT IN RB
         SZA
         JMP PEN1
         LAC CON
         SMA
         JMP I 5                    /JUMPS TO CREATE ELEM, CRES ETC
PEN1,    LAC I 3
         SAD (JMP STRCR
         JMP , 3
         IDRS
         JMP I PEN                  /LB OR PERMDF
         JMS PEN3
         JMP I PEN
/ ---- scan page 057 ----
         LAC 3                      /CONTROL INT
PEN2,    JMS TRCR                   /SERVE PERMDF INT
         LAC RCOPY                  /IN CASE OF ACCIDENTAL PERMDF HIT
         TAD RGROUP
         TAD RERASE
         SZA
         JMP PEN1
         LAC CON
         SMA
         JMP PEN4                   /STARTPOINT ALLREADY DONE
         JMS COPFIR
         ISZ RTFIRI                 /REQUEST TO TEST FIRST INT
         LAC CMODE                  /FOR BLINKING GOTO PEN5
         SAD (1                     /POIMO
         JMP PEN5
PEN4,    LAC TEMPX                  /SAVE POS OF INT IN CASE OF FD ROUT
         DAC CTEMPX
         LAC TEMPY
         DAC CTEMPY
         JMS COPSND
         JMP PEN1
PEN5,    ISZ RBLINK
         LAC (SCRABL
         DAC BLINK
         ISZ CBUSY
         JMS PEN3
         JMP I PEN
PEN3,    0                          /CHANGE CURRENT DISPLAY FILE
         LAC I DFB                  /IF 0 NO PERMDF
         SNA
         JMP , 13
         LAC CBUSY                  /IF 0 NOT BUSY
         SZA
         JMP , 10
         LAC 3                      /IF 0, NEXT DISPLAY WILL BE TEMPDF
         SNA
         JMP , 5
         DZM 3
         LAC DFB                    /START PERMDF
         IDLA
         JMP I PEN3
         LAW LB
         IDLA
         JMP I PEN3
TRCR,    0                          /TRACKING CROSS ROUTINE
/ ---- scan page 058 ----
         IDRC
         RCL
         AND (1776
         DAC TEMPY
         IDRC
         RTR
         RTR
         RTR
         RTR
         AND (1776
         DAC TEMPX
         JMS POSCR
         JMP I TRCR
STPCD,   0                          /STOPCODE INTERRUPT
         DZM 5                      /ERASE SWITCH ON BASIC SYMBOLS
         LAC CISRTN
         SNA
         JMP , 3
         DZM CISRTN
         JMS INSRTN
         LAC CUPCOM
         DZM CUPCOM
         SZA
         ISZ RUPCOM
         LAC CDOCOM
         SNA
         JMP , 4
         DZM CDOCOM
         ISZ RDOCOM
         ISZ CBUSY
         LAC 3
         SNA
         JMP , 3
         LAC (100170                /LOW INTENSITY
         DAC SRAST
         JMS PEN3
         JMP I STPCD
CLOCK,   0
         LAC I DFB
         SNA
         JMP , 12
         LAC MBLINK
         SNA                        /SKIP MBLINK = LAW 17767
         LAW 17760                  /NO BLINK, SET INTENSITY HIGH
         AND I BLINK
         XOR (17
         DAC I BLINK                /TURN ON/OFF BLINK WORD
/ ---- scan page 059 ----
         LAC (34117
         DAC I DFB                  /ENABLE PERMDF
         DAC TRACK                  /ENABLE CONTROL LB'S
         LAC DRAWMO                 /SERVES LB F AND S
         SNA
         JMP , 5
         LAC (JMP FD
         DAC LBD 4
         DAC LBSF
         JMP , 4
         LAC (JMP SD
         DAC LBD 4
         DAC LBSF
         LAC LBD
         SAD ERAST                  /NOT EXTENDED PIXIE
         SKP
         JMS SERSWI
         JMS SETCL
         JMP I CLOCK
EDGEV,   0                          /VERTICAL EDGE VIOLATION
         LAC 3
         SNA
         JMP , 6                    /START TEMPDF IF PDF HITS EDGE
         LAC TEMPY
         SZA                        /IF ZERO THEN SET HIGH VALUE
         LAW 16250                  /ELSE SET LOW VALUE
         TAD (221640
         DAC YCROSS
         LAW LB
         IDLA
         JMP I EDGEV
EDGEH,   0                          /HORIZONTOL EDGE VIOLATION
         LAC 3
         SNA
         JMP , 6
         LAC TEMPX
         SZA
         LAW 16250
         TAD (101640
         DAC XCROSS
         LAW LB
         IDLA
         JMP I EDGEH
POSCR,   0
         LAC TEMPY
         AND (1777
         TAD (220000
         DAC YCROSS
         AND GRID
/ ---- scan page 060 ----
         DAC TEMPY
         LAC TEMPX
         AND (1777
         TAD (100000
         DAC XCROSS
         AND GRID
         DAC TEMPX
         JMP I POSCR
                                    /TRCR
         DISP
TRACK,   PAR PO PN SC0 IN7          /TRACKING CROSS
YCROSS,  POV PO 400
XCROSS,  POH VE 400
         VEC 0 1
         VEC ON 0 -1
         VEC 0 1
         VEC ON 0 -1
         VEC 0 1
         VEC ON 0 -1
         VEC 0 1
         VEC ON 4 0
         VEC -4 4
         VEC ON 0 -10
         VEC -4 4
         VEC ES ON 4 0
SRAST,   PAR VE SC3 IN7             /SMALL RASTER
         VEC ON 1 0
         VEC ON 0 -1
         VEC ON -2 0
         VEC ON 2
         VEC ON 2 0
         VEC ON 1 -3
         VEC ON -4 0
         VEC ON 4
         VEC ON 4 0
         VEC ON -4
         VEC ES -2 2
         PAR SB
         DJP LBD
LBD1,    PAR SB SC1 IN7
         DJS VE PSD
         PAR SB
         DJS SB , 2
/ ---- scan page 061 ----
         JMP CD
         DDS CH 3
         033700                     /C
         PAR SB
         DJS VE PAD
         PAR SB
         DJS SB . 2
         JMP ED
         DDS CH 3
         053700                     /E
         PAR SB
         DJS VE PRD
         PAR SB
         DJS SB . 2
         JMP TD
         DDS CH 3
         243700                     /T
         PAR SB
         DJS VE PCD
         PAR SB
         DJS SB . 2
         JMP MORE
         DDS CH 3
         153700                     /M
         PAR SB
         DJS VE PLD
         PAR SB
         DJS SB . 2
         JMP LESS
         DDS CH 3
         143700                     /L
         PAR SB
         DJS VE PXD
         PAR SB
         DJS SB . 2
         JMP GD
         DDS CH 3
         073700                     /G
         PAR SB
         DJP ERAST
ERAST,   003000
SD,      LAC CBUSY                  /START DRAWING
         SZA
         JMP PEN1
         LAC DRAWMO                 /PREVENT 2ND ENTRY
         SZA
         JMP PEN1
         LAC SAVINS
         SZA
         JMS TESTIN
         LAC TEMPX
         DAC PNTX
         LAC TEMPY
         DAC PNTY
         ISZ DRAWMO
/ ---- scan page 062 ----
SD1,     DZM CON1
         DZM CCAT
         LAC STPNTX
         DAC BPNTX
         LAC STPNTY
         DAC BPNTY
         LAC STPOS
         DAC POS
         LAW TEMPDF 2
         DAC POSDF
         DAC POSDFL
         DAC POSDFB
         LAC STCON
         DAC BCON
         LAC STCON1
         DAC BCON1
         LAC STXBM0
         DAC BXBM0
         LAC STYBM0
         DAC BYBM0
         LAC BFIRST
         DAC FIRSTA
         LAC BSNDST
         DAC SNDSTA
         LAW
         DAC CON
         JMS INSRTN
         LAC (063700                /F
         DAC LBD 6
         LAC (TEMPDF 100
         DAC SCRPAD
         JMS SETCL
         JMP PEN1
FD,      LAC (233700                /S
         DAC LBD 6
         JMS SETCL
         LAC DRAWMO                 /PREVENT 2ND ENTRY
         SNA
         JMP PEN1
         DZM DRAWMO
         LAC CON
         SPA
         JMP PEN1
         JMS TESTIN
         ISZ CUPCOM
         JMP PEN1
CD,      JMS TESLEV                 /COPY BLINKING ELEMENT
         ISZ RCOPY
         JMP BLIROU
ED,      LAC MBLINK                 /ERASE
         SNA
         JMP PEN1
         LAC LEVEL
/ ---- scan page 063 ----
         SAD BLEVEL
         JMP , 3                    /FRESH START
         ISZ RERASE
         JMP BLIROU
         JMS ENDDRA
         JMP DRAMO
TD,      LAC MBLINK                 /TRACK
         SNA
         JMP PEN1
         LAM
         DAC RMODE
         JMP BLIROU
3D,      JMS TESLEV                 /GROUPING
         ISZ RGROUP
         JMP BLIROU
DRAMO,   DZM RMODE
         LAC (LBD
         TAD (400000
         DAC SRAST 15
         JMP BLIROU
STRAIG,  LAC CON                    /DRAW STRAIGHT LINE
         SMA                        /NOT HV IF IN RU MODE
         JMP PEN1
         DZM CONSTD
         JMP PEN1
RUBBER,  LAC CON                    /RUBBER BAND LINE
         SMA
         JMP PEN1
         LAC (2
         DAC CONSTD
         JMP PEN1
ENDCOM,  DZM SAVGSU                 /END OF COMMAND MODE
         JMP BLIROU
ENDDRA,  0                          /RESET ALL CONSTANTS ETC
         SETUP
         LAC (1777
         DAC GRID
         LAM                        /ERASE EVERYTHING
         DAC CCOM1
         DAC CONSND
         DAC CON
         LAC BLEVEL
         DAC LEVEL
         LAC STSAVE
         DAC SAVE
         LAC (SCRABL
         DAC BLINK
         DZM FSBPI
         DZM CERRDF
/ ---- scan page 064 ----
         DZM CERRGB
         DZM CBUSY
         DZM SAVGSU
         DZM RREDUC
         DZM CCAT
         DZM RATTMO
         DZM RROTAT
         DZM RTFIRI
         DZM RTSNDI
         DZM NODRA
         DZM CSAVE
         DZM RMODE
         DZM RUPCOM
         DZM CUPCOM
         DZM RDOCOM
         DZM CDOCOM
         DZM I DFB
         DZM DRAWMO
         DZM CONSTD
         DZM RLABEL
         DZM MBLINK
         DZM CMODE
         DZM RERASE
         DZM SAVINS
         LAC (400
         DAC ELCOUN
         LAC ENDNOR
         DAC END
         LAC DFENOR
         DAC DFE
         LAC (233700                /S
         DAC LBD 6
         LAC (LBD
         TAD (400000
         DAC SRAST 15
         DAC 10
         LAC (260
         DAC PRINT1
         DAC PRINT2
         JMS INSRTN
         JMS DELLEV
         JMP I ENDDRA
POIMO,   LAC DRAWMO
         SZA
         JMP PEN1                   /DRAWING NOT FINISHED
         DZM CONSTD
         LAC (1
         DAC RMODE
         LAC (LBD1
         TAD (400000
         DAC SRAST 15
         JMP BLIROU
ATTMO,   LAC MBLINK                 /ATT POINTS OF BLINKING INST
         SNA
/ ---- scan page 065 ----
         JMP PEN1
         ISZ RATTPO
         JMP BLIROU
MORE,    LAC (30117                 /INCREASE LEVEL MARKER OF INST
         DAC TRACK
         JMS SETCL
         LAC LEVEL
         SAD BLEVEL
         JMP BLIROU
         TAD (777777
         DAC LEVEL
         JMP BLIROU
LESS,    LAC (30117                 /DECREASE LEVEL MARKER OF INST
         DAC TRACK
         JMS SETCL
         ISZ LEVEL
         LAC I LEVEL                /FIND 0 IN INST STACK
         SZA
         JMP BLIROU
         LAW
         TAD LEVEL
         DAC LEVEL
         JMP BLIROU
STRCR,   JMS TRCR                   /IF IN TRACKMODE OR DRAWMO
         LAC CMODE
         SMA
         JMP . 3
         ISZ RTRACK
         ISZ CBUSY
         LAC DRAWMO
         SZA
         JMP . 3
         DZM NODRA
         JMP PEN1
         LAC NODRA
         SZA
         JMP PEN1
         JMP SEGEX
TESLEV,  0                          /TEST BLINKING AND TOP LEVEL
         LAC MBLINK
         SMA
         JMP PEN1
         LAC LEVEL
         SAD BLEVEL
         SKP
         JMP I TESLEV
         LAW 267                    /NO OPERATION ON MAIN INST
         DAC NOTE 5
         ISZ RERROR
         JMP BLIROU
/ ---- scan page 066 ----
BLIROU,  DZM MBLINK                 /STOP BLINKING
         LAW 17760
         AND I BLINK
         XOR (17
         DAC I BLINK
         LAC (SCRABL
         DAC BLINK
         JMP PEN1
SXY,     0                          /FIND DELTA X AND Y
         LAC PNTX
         CMA
         TAD (1
         TAD TEMPX
         DAC XB
         JMS MOD
         DAC XBM
         LAC PNTY
         CMA
         TAD (1
         TAD TEMPY
         DAC YB
         JMS MOD
         DAC YBM
         JMP I SXY
MOD,     0                          /MODULUS
         SMA
         JMP I MOD
         CMA
         TAD (1
         JMP I MOD
INSRTN,  0                          /INSERT POINT IN TEMPDF
         LAC (30117
         DAC TEMPDF
         LAC (220000
         TAD PNTY
         DAC TEMPDF 1
         LAC (100000
         TAD PNTX
         DAC TEMPDF 2
         LAC (400000                /VEC ES
         DAC TEMPDF 3
         LAC (160000
         DAC TEMPDF 4
         LAC (TOTEMP 1
         TAD (400000
         DAC TEMPDF 5
         JMP I INSRTN
SETCL,   0                          /SET CLOCK TO 1/2 SEC
/ ---- scan page 067 ----
         LAW -30
         DAC 7
         CLON
         JMP I SETCL
TESTIN,  0                          /TEST WHETHER INT NEAR END OF LINE
         LAC CTEMPX                 /WHEN POINTING AT FD
         TAD (-20
         CMA
         TAD TEMPX
         SPA
         JMP I TESTIN
         TAD (-40
         SMA
         JMP I TESTIN
         LAC CTEMPY
         TAD (-20
         CMA
         TAD TEMPY
         SPA
         JMP I TESTIN
         TAD (-40
         SMA
         JMP I TESTIN
         LAC CTEMPX
         DAC TEMPX
         LAC CTEMPY
         DAC TEMPY
         LAC CON
         SPA
         JMP . 3                    /NEAR LINE WHEN POINT AT SD
         ISZ RTSND1                 /NEAR LINE WHEN POINTING AT FD
         JMP SEGEX
         ISZ RTFIR1                 /TEST WHETHER ON CAT SUBP
         DZM CCOM1                  /START ON NODE
         JMP I TESTIN
COPFIR,  0                          /COPY SAVE INTO FIRST STACK
         LAW 17771
         DAC COUNT
         LAC BFIRST
         DAC FIRSTA
         LAC I SAVE
         DAC I FIRSTA
         ISZ SAVE
         ISZ FIRSTA
         ISZ COUNT
         JMP .-5
         LAC STSAVE
         DAC SAVE
         JMP I COPFIR
COPSND,  0
         LAW 17771
/ ---- scan page 068 ----
         DAC COUNT
         LAC BSNDST
         DAC SNDSTA
         LAC I SAVE
         DAC I SNDSTA
         ISZ SAVE
         ISZ SNDSTA
         ISZ COUNT
         JMP .-5
         LAC STSAVE
         DAC SAVE
         JMP I COPSND
DELLEV,  0                          /DELETE LEVEL STACK
         LAW 17771
         DAC COUNT
         DZM I SAVE
         ISZ SAVE
         ISZ COUNT
         JMP .-3
         LAC STSAVE
         DAC SAVE
         JMP I DELLEV
         NODISP
         PAUSE
/ ---- scan page 069 ----
                                    /VEC
         DISP
SEGX,    LAC XB                     /FORM X-DIR SEGMENT
         SPA
         TAD (777777                /CONVERT TO ONE ' S COMP
         DAC XB
         LAC TEMPX
         DAC TEMPXL
         LAC XBM
         DAC XBML
         DZM YB
         JMP SEGXY
SEGY,    LAC YB                     /FORM Y-DIR SEGMENT
         SPA
         TAD (777777                /CONVERT TO 1'S COMP
         DAC YB
         LAC TEMPY
         DAC TEMPYL
         LAC YBM
         DAC YBML
         DZM XB
SEGXY,   LAC POSDFB
         DAC POSDF
         STL
         LAC YB
         JMS VECGN
         LAC XB
         JMS TODIS
         LAM
         TAD POSDF
         DAC POSDF
         LAC I POSDF
         TAD (400000                /ESCAPE BIT SET
         DAC I POSDF
         LAC POSDF
         DAC POSDFL
         JMS INSRET
         JMP PEN1
TODIS,   0                          /INSRT IN DF
         DAC SAVVE
         LAC POSDF
         AND (17777
         SAD TEMPEN
         JMP I TODIS
         LAC SAVVE
         DAC I POSDF
         ISZ POSDF
         JMP I TODIS
INSRET,  0                          /INSERT RETURN IN TEMPDF
         ISZ POSDF
         LAC (160000
         DAC I POSDF
/ ---- scan page 070 ----
         ISZ POSDF
         LAC (TOTEMP 1
         TAD (400000
         DAC I POSDF
         JMP I INSRET
SEGRXY,  LAC XB                     /RUBBER BAND LINE
         SZA
         TAD (1
         SZA
         JMP . 6
         LAC YB
         SZA
         TAD (1
         SNA
         JMP PEN1                   /BOTH COMPONENTS ARE ZERO
         LAC CON
         SAD (4
         SKP
         JMS SAVTEM                 /SAVE INIT POS
         LAC (4
         DAC CON
         JMP SEGXY
SEGCX,   JMS SXY                    /TEST DRAW DIR
         LAC CONSTD
         SZA
         JMP SEGRXY
         LAC XB
         TAD CONSTB
         SPA
         JMP SEGCNX                 /TEST -X DIR
         LAC CON
         SNA
         JMP SEGCY1                 /TEST CHANGE FROM +X TO Y
         JMS SAVEY                  /FIRST ENTRY IN X-DIR
         DZM CON
         JMP SEGX
SEGCNX,  LAC XB
         TAD CONSTX
         SMA
         JMP SEGCY
         LAC CON
         SAD (2
         JMP SEGCY1                 /TEST CHANGE FROM -X TO Y
         JMS SAVEY
         LAC (2
         DAC CON
         JMP SEGX
SEGCY,   LAC YB
         TAD CONSTB
         SPA
/ ---- scan page 071 ----
         JMP SEGCNY
         LAC CON
         SAD (3
         JMP SEGY
         JMS SAVEX
         LAC (3
         DAC CON
         JMP SEGY
SEGCY1,  LAC YB
         TAD CONSTB
         SPA
         JMP . 5
         JMS SAVEX
         LAC (3
         DAC CON
         JMP SEGY
         LAC YB
         TAD CONSTX
         SMA
         JMP SEGX                   /CARRY ON IN X DIR
         JMS SAVEX
         LAC (1
         DAC CON
         JMP SEGY
SEGCNY,  LAC YB
         TAD CONSTX
         SMA
         JMP ERASE
         LAC CON
         SAD (1
         JMP SEGY
         JMS SAVEX
         LAC (1
         DAC CON
         JMP SEGY
ERASE,   LAC CON                    /ERASE LAST VECTOR
         SPA
         JMP PEN1
         JMS TAKE
         LAC CON
         SNA
         JMP SEGX
         SPA
         JMP SD1                    /TEMPDF IS EMPTY
         TAD (777776
         SZA
         JMP SEGY
         JMP SEGX
SAVEX,   0                          /SAVE LAST VECTOR
         JMS SAVTEM
         LAC CON
/ ---- scan page 072 ----
         SPA
         JMP I SAVEX
         LAC TEMPXL
         DAC PNTX
         JMP I SAVEX
SAVEY,   0
         JMS SAVTEM
         LAC CON
         SPA
         JMP I SAVEY
         LAC TEMPYL
         DAC PNTY
         JMP I SAVEY
SAVTEM,  0
         LAC BCON1
         SAD (STSTAK 120
         JMP PEN1
         LAC CON1
         DAC I BCON1
         ISZ BCON1
         LAC CON
         DAC I BCON
         ISZ BCON
         LAC PNTX
         DAC I BPNTX
         ISZ BPNTX
         LAC PNTY
         DAC I BPNTY
         ISZ BPNTY
         LAC POSDFB
         DAC I POS
         ISZ POS
         LAC CON1
         SZA
         JMP SAVTE1
         LAC POSDFL
         DAC POSDFB
         ISZ POSDFB
         LAC I POSDFL               /ERASE ESCAPE BIT
         AND (377777
         DAC I POSDFL
         JMP I SAVTEM
TAKE,    0                          /TAKE LAST VECTOR TO ERASE
         CLC
         TAD BCON
         DAC BCON
         LAC I BCON
         DAC CON
         LAM
         TAD BPNTX
/ ---- scan page 073 ----
         DAC BPNTX
         LAC I BPNTX
         DAC PNTX
         LAM
         TAD BPNTY
         DAC BPNTY
         LAC I BPNTY
         DAC PNTY
         JMS SXY
         LAM
         TAD POS
         DAC POS
         LAC I POS
         DAC POSDFB
         CLC
         TAD BCON1
         DAC BCON1
         LAC I BCON1
         DAC CON1
         SNA
         JMP I TAKE
         JMP TAKE1
SEGEX,   LAC CON1                   /ENTER DRAWING ROUTINE
         SNA
         JMP SEGCX                  /WHEN NO ELEM INSERTED
         JMP CONELE                 /CHECK FOR POS OF ELEM
         NODISP
         PAUSE
/ ---- scan page 074 ----
/ ---- scan page 075 ----
                                    /UPCOMP
UPCOMP,  0                          /BEGIN COMPILER
         LAC NODRA
         SZA
         JMP UPCOM1
         ISZ CBUSY
         DZM SBPI
         DZM XTOTIN
         DZM YTOTIN
         DZM XTOTUP
         DZM YTOTUP
         DZM XINS
         DZM YINS
         DZM ELAD
         LAC (TEMPDF 3
         DAC COMPOS
         JMS ABSXY
         LAC SAVINS
         SZA
         JMP AMEND
         JMS FOHBL                  /HEAD BLOCK FOR DRAWING
         LAC SBPI                   /SAVE POINTER TO SUBP OF DRAWING
         DAC SAVSUB
         LAC INST                   /SAVE POINTER TO INST OF DRAWING
         DAC SAVINS                 /FOR DOWNCOMPILER
         LAC INST
         JMS POIDAT
         LAC SYMB                   /TO ENTER BASIC SYMBOLS
         DAC SYM
UPCOM2,  JMS FONBL                  /HEAD BLOCK FOR NODE OR BRANCH
         JMS FOLBL                  /LINE BLOCK
UPCOM1,  LAM
         DAC CCOM1
         DAC CON
         DZM XTOTUP
         DZM YTOTUP
         JMP I UPCOMP
FOHBL,   0                          /FORM HEAD BLOCKS
         FEL
         DAC SBPI
         LAC (1
         FELN
         DAC INST
         LAC RCOPY
         TAD FSBPI
         SZA
         JMP . 13
/ ---- scan page 076 ----
         LAW INST
         CDR
         INSRT
         LAW SBPI
         FINDN
         LAW OP 1
         CDR
         CDR
         LAC (4
         DAC I OP 1
         LAW INST                   /DATA FOR INST
         FINDN
         LAW OP 1
         CDR
         CDR
         LAC (2
         DAC I OP 1
         LAW OP 1
         CDR
         DZM I OP 1
         LAC PRINT1
         DAC MSIN 1                 /GIVE INST A NAME
         LAC PRINT2
         DAC MSIN 2
         LAC PRINT2 1
         DAC MSIN 3
         LAW INST
         COPIN
         ISZ PRINT2
         LAC PRINT2
         SAD (272
         SKP
         JMP I FOHBL                /NOT 10 YET
         LAC (260
         DAC PRINT2
         ISZ PRINT1
         LAC PRINT1
         SAD (272
         JMP I FOHBL
         LAC (260                   /AFTER 99 RESTART WITH 00
         DAC PRINT1
         JMP I FOHBL
FONBL,   0                          /FORM NODE OR BRANCH BLOCK
         JMS FOHBL                  /FORM OTHER HEADS
         JMS UPDAIN
         LAC INST
         JMS POIDAT
         LAW INST                   /NODE INST BLOCK TO SUBP BLOCK
         FINDP
         LAW SAVSUB
         ADDW
/ ---- scan page 077 ----
         INSRT
         LAW INST
         JMP I FONBL
ABSXY,   0                          /FIND ABSOLUTE X AND Y
         LAC TEMPDF 1
         AND (1777
         DAC YTOT
         LAC TEMPDF 2
         AND (1777
         DAC XTOT
         JMP I ABSXY
FOLBL,   0                          /FORM LINE AND POINT BL
         LAC I COMPOS
         TAD (-157777
         SZA
         JMP . 7                    /FORM LINE BL
         ISZ COMPOS
         LAC I COMPOS
         TAD (-757777
         SMA
         JMP FOBBL                  /FORM BRANCH BL
         JMP I FOLBL
         FEL
         DAC LINE
         LAW SBPI
         ADDW
         INSRT
         LAW LINE
         FINDN
         LAW OP 1
         CDR
         CDR
         LAC (3
         DAC I OP 1
         LAW OP 1
         CDR
         DZM I OP 1
         LAC XTOTUP                 /TEST WETHER FIRST P DATA
         TAD YTOTUP
         SNA
         JMS UPDAXY
         LAC LINE
         JMS POIDAT                 /INSRT 1ST LINE P DATA XTOT AND/OR YTOT
         LAC CONSTD                 /TEST RUBBER B L
         SNA
         JMP . 5
         JMS MASKX
         LAC (TEMPDF 3
         DAC COMPOS
         JMP . 4
         JMS MASKX
         LAC XTOT
/ ---- scan page 078 ----
         SNA
         JMS MASKY
         JMS UPDAXY
         LAC LINE
         JMS POIDAT                 /INSRT 2ND LINE P DATA XTOT AND/OR YTOT
         JMP FOLBL 1
FOPBL,   0                          /POINT BL
         FEL
         DAC POINT
         LAW POINT
         FINDN
         LAW OP 1
         CDR
         CDR
         LAC (1
         DAC I OP 1
         LAW OP 1
         CDR
         DZM I OP 1
         JMP I FOPBL
MASKX,   0                          /MASK TEMPDF FOR X
         LAC I COMPOS
         AND (377
         SNA
         JMP I MASKX
         DAC VEPART
         AND (200
         SZA
         JMP . 11                   /NEG VALUE
         LAC XTOT
         TAD VEPART
         DAC XTOT
         ISZ COMPOS
         LAC RCATAL                 /MASK ONLY ONE WORD IN THIS MODE
         SNA
         JMP MASKX 1
         JMP I MASKX
         LAC VEPART                 /SUBTRACT NEG BIT
         CMA
         TAD (201
         DAC VEPART
         TAD XTOT
         AND (17777
         DAC XTOT
         JMP .-14
MASKY,   0                          /MASK TEMPDF FOR Y
         LAC I COMPOS
         TAD (-157777
         SNA
         JMP I MASKY
/ ---- scan page 079 ----
         LAC I COMPOS
         AND (177400
         SNA
         JMP MASKY1
         CLL
         LRS 10
         DAC VEPART
         AND (200
         SZA
         JMP . 11
         LAC YTOT
         TAD VEPART
         DAC YTOT
         ISZ COMPOS
         LAC RCATAL                 /MASK ONLY ONE WORD IN THIS MODE
         SNA
         JMP MASKY 1
         JMP I MASKY
         LAC VEPART
         CMA
         TAD (201                   /ELIMINATE -BIT AND 1ST COMPLIM
         DAC VEPART
         TAD YTOT
         AND (17777
         DAC YTOT
         JMP .-14
MASKY1,  LAC CONSTD                 /TEST FOR RB
         SNA
         JMP I MASKY                /HV
         ISZ COMPOS
         JMP MASKY 1                /RB
POIDAT,  0                          /INSRT POINT DATA INTO INST OR LINE
         DAC Y
         JMS POSIT
         LAC I Y
         SAD (100000
         JMP . 6
         LAW Y
         CDR
         CDR
         JMS PODAT1
         JMP I POIDAT
         JMS PODAT1
         DZM XTOT
         DZM YTOT
         JMP I POIDAT
PODAT1,  0
         LAC YTOT
         AND (17777
         DAC I Y
         LAW Y
         CDR
/ ---- scan page 080 ----
         LAC XTOT
         AND (17777
         DAC I Y
         JMP I PODAT1
UPDAXY,  0                          /UPDATE X AND Y OF
         LAC XTOT                   /CURRENT LINE SEQUENCE
         TAD XTOTUP
         DAC XTOTUP
         DAC XTOT
         LAC YTOT
         TAD YTOTUP
         DAC YTOTUP
         DAC YTOT
         JMP I UPDAXY
UPDAIN,  0                          /UPDATE X AND Y OF
         LAC XTOTIN                 /CURRENT INST SEQUENCE
         TAD XTOTUP
         DAC XTOTIN
         DAC XTOT
         LAC YTOTIN
         TAD YTOTUP
         DAC YTOTIN
         DAC YTOT
         DZM XTOTUP
         DZM YTOTUP
         JMP I UPDAIN
LINDAT,  LAC RATTPO                 /FLEA FOUND LINE
         TAD RCATAL
         TAD RGROUP
         TAD RCOPY
         SZA
         JMP ERR6                   /NO ATTP ON LINE, ETC
         LAC CBUSY
         SZA
         JMP I AMEND3
         LAC PNT1
         JMS ENDPOI
         LAC PNT2
         JMS ENDPOI
         JMP I AMEND3               /CROSS IN MIDDLE OF LINE
ADJLEV,  0                          /ADJUST LEVEL OF COPIED STACK
         LAC LEVEL                  /TERMINATE STACK
         DAC TEMP
         ISZ TEMP
         DZM I TEMP
         JMP I ADJLEV
/ ---- scan page 081 ----
CATDAT,  ISZ CCAT
         LAC RCOPY
         TAD RGROUP
         TAD RCATAL
         SZA
         JMP I AMEND3               /CATALOGUED SUBP IN FIRSTA
         JMS CATDA0
         JMP I AMEND3
CATDA0,  0                          /DETERMINE ATTP FOR CROSS
         ISZ NODRA                  /PROHIBIT DRAWING IN CASE TEST FAILS
         LAW GRNA
         ENTER
         LAW SBPI
         LAW CATDA1
         LAW CATDA2
         JMP I CATDA0               /CROSS NOT NEAR ATTPO
CATDA1,  LAC SBPI                   /POINTS TO INST OR ATTP
         DAC Y
         LAW Y
         CAR
         FINDN
         LAW OP 1
         CDR
         CDR
         LAC I OP 1
         SAD (1
         SKP                        /IS ATTP
         EXIT                       /IS INST
         JMS POSIT
         LAC Y
         JMS ENDPOI
         EXIT
CATDA2,  LAC RCATAL                 /LINE OR INST
         SNA
         EXIT
         LAC SBPI
         DAC Y
         LAW Y
         NULLR
         EXIT
ENDPOI,  0                          /PUT CROSS ON ENDPOINT OF LINE
         DAC Y
         LAC I Y
         TAD YINS
         AND (17777
         DAC YTOTIN                 /ABS POS OF ATTP OR LINE POINT
         LAW Y
         CDR
         LAC I Y
         TAD XINS
         AND (17777
         DAC XTOTIN
/ ---- scan page 082 ----
         LAC TEMPX
         CMA
         TAD XTOTIN
         TAD (10                    /LESS THAN 10 FROM ENDPOINT
         AND (777760
         SZA
         JMP I ENDPOI               /WRONG POINT
         LAC TEMPY
         CMA
         TAD YTOTIN
         TAD (10                    /LESS THAN 10 FROM ENDPOINT
         AND (777760
         SZA
         JMP I ENDPOI               /WRONG POINT
         LAC YTOTIN                 /RIGHT POINT
         DAC TEMPY
         DAC CTEMPY                 /SAVE FOR TESTIN AT SD
         LAC XTOTIN
         DAC TEMPX
         DAC CTEMPX
         JMS POSCR
         DZM NODRA                  /IF TEST PASSES
         JMP I ENDPOI               /OK RETURN
ATTPEL,  0
         JMS FOPBL                  /CREATE ATTP
         LAC POINT
         JMS POIDAT
         LAW SBPI
         ADDW
         LAW POINT
         FINDP
         INSRT
         LAW SBPI
         JMP I ATTPEL
AMEND,   DZM STSTAK 122
         DZM STSTAK 132
         LAC CCOM1                  /TEST WHERE POINT STARTS
         SNA
         JMP AMEND0
         SAD (1
         JMP AMEND1
         SAD (2
         JMP AMEND2
         JMS AMEND9                 /NO INTERRUPT ON PERMDF
         JMP UPCOM2                 /SEPERATE PICTURE
AMEND0,  JMS AMEND3                 /GET NODE INST POS XINS
         JMS AMEND5                 /AND WHERE LINE IS TO START WITH RESP TO NODE INST
         JMS FOLBL
         JMP UPCOM1
AMEND1,  JMS TESTJN                 /INT AT END POINT OF TEMPDF
         JMS AMEND9
         JMP UPCOM2
/ ---- scan page 083 ----
AMEND9,  0                          /GET DX FOR START OF TEMPDF WITH RESP TO MAIN INST
         LAC I SAVE
         JMS VAIN                   /GET POS OF MAIN INST
         JMS AMEND5                 /GET DX AND DY
         LAC XTOT
         DAC XTOTIN                 /POS FOR FUTURE INSTANCES
         LAC YTOT
         DAC YTOTIN
         JMP I AMEND9
AMEND2,  JMS TESTJN                 /INT AT START AND END POINT OF TEMPDF
         JMS AMEND3
         JMS AMEND5
         JMS FOLBL                  /LEAVES FOBBL W, NO E, F,
AMEND6,  JMS UPDAIN                 /LAST LINE CONNECTED TO NODE
         LAC XTOTIN                 /CURRENT POS OF BEAM WITH RESP TO MAIN INST
         DAC XTOT
         LAC YTOTIN
         DAC YTOT
         JMS AMEND4                 /GIVES POS OF INST WHERE LINE IS TO BE JOINED
         LAC XTOTIN
         DAC XINS
         LAC YTOTIN
         DAC YINS
         JMS AMEND5
         JMS FOLBL
         JMP UPCOM1
AMEND7,  JMS AMEND3                 /2 NODES := 1NODE
         JMS AMEND5
         JMS FOLBL                  /LINE CONNECTED TO 1ST NODE
         LAC STSTAK 121             /TEST IF SAME NODE
         SAD STSTAK 131
         JMP UPCOM1
         LAC XINS                   /SAVE 1ST NODE INFORMATION
         CMA
         TAD (1
         DAC XINS1
         LAC YINS
         CMA
         TAD (1
         DAC YINS1
         LAC SBPI
         DAC SBPI1
         JMS AMEND4
         LAC XINS1                  /SIGN CHANGED X OF 1ST INST
         TAD XINS                   /X OF 2ND INST
         DAC XTOT                   /DIFFERENCE TO INSRT IN P BL'S OF 2ND INST
         LAC YINS1
         TAD YINS
         DAC YTOT
         LAW X                      /DELETES INST FROM MAIN SBPI
/ ---- scan page 084 ----
         FINDP
         DSON
         JMS DISCON                 /DISCONNECT LINES FROM 2ND INST
         JMP UPCOM1
AMEND3,  0                          /FIND P BL OF ALL INST
         DZM XINS
         DZM YINS
         LAC BFIRST
         DAC FIRSTA
         JMP . 3
         JMS VAIN
         ISZ FIRSTA
         LAC I FIRSTA
         SZA
         JMP .-4
         JMP I AMEND3
AMEND4,  0                          /SAME AS AMEND3 , ONLY PHOTO STACK
         LAC BFIRST
         DAC TEMP
         LAC BSNDST
         DAC BFIRST
         JMS AMEND3
         LAC TEMP
         DAC BFIRST
         JMP I AMEND4
AMEND5,  0                          /FIND DELTA OF INSTANCE AND START POINT
         LAC XINS
         CMA
         TAD (1
         TAD XTOT
         AND (17777
         DAC XTOT                   /DX OF INST AND START POINT
         LAC YINS
         CMA
         TAD (1
         TAD YTOT
         AND (17777
         DAC YTOT
         JMP I AMEND5
TESTJN,  0                          /TEST WHETHER ELEMENTS IN LINE
         LAC COMPOS
         DAC COMPOI
         ISZ COMPOI
         LAC I COMPOI
         TAD (-157777
         SZA
         JMP .-4
         ISZ COMPOI
         LAC I COMPOI
         TAD (-757777
/ ---- scan page 085 ----
         SMA
         JMP I TESTJN               /FOUND ELEMENT, OK
         LAC CCOM1
         SAD (2
         JMP . 13                   /TWO INT'S
         LAC CCOM1
         SNA
         JMP I TESTJN
         LAC ELAD                   /INT AT END OF PERMDF
         SZA                        /AMEND WITHOUT ELEMENTS
         JMP AMEND6
         JMS AMEND4
         JMS AMEND5
         JMS FOLBL
         JMP UPCOM1
         LAC ELAD
         SZA
         JMP AMEND6                 /ELEMENT WAS IN TEMPDF
         JMP AMEND7                 /2 NODES := 1 NODE
VAIN,    0                          /FIND POINTS OF INSTANCES
         DAC VAIN1
         LAC I VAIN1
         DAC VAIN1                  /ADDRESS OF ATNAME OF INST
         LAC I VAIN1
         DAC X
         DZM PNT2                   /TO DETECT LINES
         FLEAS
         LAC PNT2
         SZA
         JMP LINDAT
         LAC PNT1
         JMS VAIN2                  /ACCUMULATE INST POINT DATA
         LAC SUBP
         DAC SBPI
         DAC OP 1
         LAW OP 1
         CDR
         CDR
         CDR
         LAC I OP 1
         SAD (10000
         JMP CATDAT
         JMP I VAIN
VAIN2,   0
         DAC Y
         LAC I Y
         DAC YTOTIN                 /LATEST DY BETWEEN TWO INST OF DIFF LEVEL
         TAD YINS
         DAC YINS
/ ---- scan page 086 ----
         LAW Y
         CDR
         LAC I Y
         DAC XTOTIN
         TAD XINS
         DAC XINS
         JMP I VAIN2
DISCON,  0                          /DISCONNECT LINES
         LAW GRHA
         ENTER
         LAW SBPI
         LAW DISCO2
         LAW DISCO1
         JMP I DISCON
DISCO1,  LAW SBPI                   /FOUND LINE
         DAC Y
         LAW Y
         FINDS
         NULLR
         LAW SBPI1
         ADDW
         INSRT                      /LINE INTO NEW SUBPICTURE
         LAW Y
         JMS POSIT
         JMS DISCO3                 /UPDATE P DATA OF LINE
         LAW Y
         CDR
         JMS DISCO3
DISCO2,  EXIT
DISCO3,  0                          /UPDATE P DATA OF LINE
         LAC I Y
         TAD YTOT
         AND (17777
         DAC I Y
         LAW Y
         CDR
         LAC I Y
         TAD XTOT
         AND (17777
         DAC I Y
         JMP I DISCO3
POSIT,   0                          /POSITION POINTER INTO DATA EREA
         LAW Y
         FINDN
         CDR
         CDR
         CDR
/ ---- scan page 087 ----
         CDR
         JMP I POSIT
         PAUSE
/ ---- scan page 088 ----
COMPIL=JMS, 0                          /CALL IS LAW <NAME>, COMPIL, WITH
         ISZ CBUSY                  /<NAME>ON HEAD OF INSTANCE ELEMENT
         FINDN
         LAC XSTBEG
         DAC LOPX
         LAC YSTBEG                 /INITIALISE STACKS
         DAC LOPY
         LAC OP+1
         DAC X                      /MOUSE
         LAC DFB
         DAC DF                     /START OF DF
         LAC SYMB
         DAC SYM
         LAC SAVE
         DAC SVAD                   /SAVE ADDRESS
         FLEAS                      /SET P AND S FLEAS
         LAC (34117
         WRDF                       /WRITE PARAMETER
         LAC I PNT1
         STAKY                      /SAVE Y
         LAW PNT1
         CDR
         LAC I PNT1
         STAKX                      /SAVE X
         LAC WY2
         DAC YBEAM
         TAD (220000
         WRDF
         LAC WX1
         DAC XBEAM
         TAD (160000
         WRDF                       /BEAM TO TOP LEFT CORNER
         LAC DF
         TAD (760002
         WRDF                       /WRITE DJS .+2 TO INSTANCE
         LAC (3000
         WRDF                       /WRITE STOPCODE
         LAW COMP
         ENTER                      /X IS MOUSE ON ENTRY (ON ATNAME)
         DZM CBUSY                  /RESET BUSY
         JMP I COMPIL=JMS           /EXIT
COMP,    LAC DF
         DAC ALPHA                  /SAVE ADDRESS ALPHA
         WRDF                       /WRITE JUNK TO STEP DF
         JMS COMP12
         WRLTO                      /WRITE A LINE AND SET BEAM CO-ORDS
         LAC RLABEL
/ ---- scan page 089 ----
         SNA                        /SKIP LABELLING REQUESTED
         JMP COMP9
         LAC X
         DAC FLEA3
         LAW FLEA3
         CAR
         CDR
         LAC I FLEA3
         SAD (100000
         JMP COMP9
         LAC (100000
         WRDF
         LAC (512005                /OFFSET BEAM
         WRDF
         LAC (60120
         WRDF
         LAC XBEAM
         TAD (5
         DAC XBEAM
         LAC YBEAM
         ADD (-24
         DAC YBEAM
         DZM MKER
         DZM TEM
         JMS COMP11
         JMS COMP11
         JMS COMP11
         WRDF
         LAC MKER
         SNA
         JMP .-7
COMP10,  WRLTD
COMP9,   ISZ SVAD
         JMS COMP13
         AND (3777                  /REMOVE BLINK BIT
         SAD I FLEA3
         JMP .+6
         DAC I FLEA3                /CLEAN UP STRUCTURE
         LAC DF
         DAC BLINK                  /SAVE BLINK ADDRESS
         TAD (2
         DAC BLINK1
         LAC I FLEA3                /ACC HAS SCALE AND C
         TAD (160000
         WRDF                       /SET SUB
         LAC DF
         DAC BETA                   /SAVE ADDRESS BETA
         WRDF                       /WRITE JUNK TO STEP DF
         LAC (160000
         WRDF                       /SET SUBMODE
         LAC DF
         TAD (360000
         DAC I ALPHA                /DDS ENDINST
         WRDF                       /WRITE JUNK TO STEP DF
         LAC SUBP
         DAC X                      /COPY MOUSE
         LAW SUBP                   /LOAD SUBPICTURE FLEA
/ ---- scan page 090 ----
         CDR
         CDR
         LAC I SUBP
         AND (370                   /TEST IF BASIC
         SNA
         JMP .+6
         LAC X                      /ATNAME OF BASIC SUBP
         AND (17777
         DAC I SYM                  /TO SYM
         LAW SYM
         CDR
         LAW SUBP
         CDR                        /FLEA INTO DATA
         LAC I SUBP
         SAD (10000
         SKP                        /SKIP CATALOGUED
         JMP COMP1
         LAC TEMP2
         SNA                        /REMOVE INST IF STARTS OFFSCREEN
         JMP .+7
COMP14,  LAC ALPHA                  /REMOVE INST IF STARTS OFFSCREEN
         DAC DF
         TAD (360001
         WRDF                       /DDS .*1 FOR NULL INSTANCE
         ISZ DF
         EXIT
         LAW SUBP
         CDR
         LAC (660001                /ADDRESS IN BLOCK DATA
         TAD I SUBP
         DAC I BETA                 /DJS ALPHA IN BETA
         LAW SUBP
         CDR
         LAC I SUBP
         JMS NEG
         FAD XBEAM
         DAC U
         LAW SUBP
         CDR
         LAC I SUBP
         JMS NEG
         FAD YBEAM
         DAC V
         LOCATE
         SZA
         JMP COMP14                 /REMOVE INST IF GOES OFFSCREEN
         LAC U
         DAC XBEAM
         LAC V
         DAC YBEAM
         EXIT
COMP1,   LAW GRNA
         ENTER
         LAW X
         LAW COMP2
/ ---- scan page 091 ----
         LAW COMP3
         LAC DF
         DAC GAMMA                  /SAVE ADDRESS GAMMA
         WRDF                       /WRITE JUNK TO STEP DF
         LAC X
         DAC Y
         DZM MRKX
         DZM MRKY
         LAC XBEAM
         DAC XBMC
         LAC YBEAM
         DAC YBMC
         LAW GRNA                   /GOROUND TO FIND INSTANCES AND LINES
         ENTER
         LAW Y
         LAW COMP4
         LAW COMP5
         LAC MRKX
         SNA
         JMP .+13                   /WRITE WORDS TO POSITION TO
         LAC (160000                /1ST POINTS OF INSTANCE
         WRDF
         LAW
         TAD I LOPX
         WRDF
         UNSTKX
         LAM
         TAD MRKX
         DAC MRKX
         JMP .-13
         LAC MRKY
         SNA
         JMP .+15
         CMA                        /TRANSFER LINES FROM STACKY TO
         TAD (1                     /STAK - WITHOUT REVERSAL OF ORDER
         DAC COUN
         TAD LOPY
         DAC LOPY
         TAD (1
         DAC PONT
         LAC I PONT
         STAK
         ISZ PONT
         ISZ COUN
         JMP .-4
         LAC MRKY
         SNA
         JMP .+27
         UNSTAK                     /WRITE LINES TO DISPLAY FILE
         DAC X
         FLEAS
         LAC (160000
         WRDF
         JMS COMP12
         JMS COMP13
         AND (3777
         SAD I FLEA3
         JMP .+10
/ ---- scan page 092 ----
         DAC I FLEA3
         LAC DF
         DAC BLINK
         WRLB
         LAC DF
         DAC BLINK1
         SKP
         WRLB
         LAM
         TAD MRKY
         DAC MRKY
         JMP .-27
         LAC (160000
         WRDF                       /SET SUBROUTINE MODE
         WRDF                       /WRITE JUNK TO STEP DF
         TAD (200000
         DAC I GAMMA                /DDS DELTA TO GAMMA
         LAW
         TAD GAMMA
         DAC I BETA                 /DJS GAMMA TO BETA
         EXIT
COMP3,   LAW X                      /FIRST GO ROUND
         GETD
         SAD (2
         SKP
COMP2,   EXIT
         LAC DF                     /HERE IF INSTANCE
         STAK
         LAC SUBP
         STAK
         LAC X
         STAK                       /STAK MOUSE AND FLEAS
         LAC GETDI
         DAC X
         STAK
         FLEAS                      /NEW FLEAS
         LAC PNT1
         DAC TEMP
         JMS WRLB3                  /STACK POINT
         UNSTAK
         DAC X
         LAC BETA
         STAK                       /STAK BETA
         LAW COMP
         ENTER                      /RECURSE
         UNSTAK
         DAC BETA                   /UNSTAK BETA
         UNSTKX
         UNSTKY                     /UNSTAK CO-ORDINATES
         UNSTAK
         DAC X                      /UNSTAK MOUSE
         UNSTAK
         DAC SUBP                   /UNSTAK SUBPICTURE FLEA
         LAM
         TAD SVAD
         DAC SVAD                   /DAC SAVE ADDRESS
         EXIT
COMP5,   LAW Y                      /SECOND GOROUND
/ ---- scan page 093 ----
         GETD
         SAD (2
         JMP RINST
         SAD (3
         JMP RLINE
COMP4,   EXIT
RINST,   UNSTAK
         STAKX                      /STACK INSTANCES
         ISZ MRKX
         EXIT
RLINE,   LAC GETDI
         STAKY                      /STACK LINES
         ISZ MRKY
         EXIT
COMP11,  0
         LAC I FLEA3
         SAD (100000
         JMP .+12
         AND (77                    /FORM CHAR GEN ENTRY
         DAC TEMP
         LAC XBEAM
         TAD (14
         DAC XBEAM
         LAW FLEA3
         CDR
         LAC TEMP
         JMP .+3
         ISZ MKER
         LAC (37
         DAC FIG
         LAC TEM
         ALSS 6
         TAD FIG
         DAC TEM
         JMP I COMP11
COMP12,  0
         LAW 2
         TAD DF
         WRDF                       /DJS .+2
         LAC I X
         WRDF                       /ATNAME
         LAC SVAD
         TAD (200000
         WRDF                       /DDS SVAD
         JMP I COMP12
COMP13,  0                          /FLEA ONTO BLINK WORD
         LAC X
         DAC FLEA3
         LAW FLEA3
         CDR
         CDR
         CDR
         LAC I FLEA3                /BLINK WORD
         JMP I COMP13
/ ---- scan page 094 ----
GETD-JMS, 0                          /GET DATA FROM DAD
         JMS OP+5                   /SET OP+1 SO ENTRY NAME STAYS PUT
         LAW OP+1
         FINDS                      /GO TO DADD
         FINDN
         LAC OP+1
         DAC GETD1                  /SAVE ATNAME
         LAW OP+1
         CDR
         CDR
         LAC I OP+1                 /LOAD DATA
         AND (7                     /REMOVE SURPLUS BITS
         JMP I GETD-JMS
GETD1,   0
FLEAS-JMS, 0                          /SET FLEAS (I OR L) ON (S,P OR P,P)
         LAC X
         DAC OP+1
         JMS FLEA2
         DAC FLEA3
         JMS FLEA2
         DAC PNT1
         LAC I FLEA3
         SAD (2
         JMP FLEA1
         JMS FLEA2
         DAC PNT2
         JMP I FLEAS-JMS
FLEA1,   LAC X
         DAC SUBP
         LAW SUBP
         FINDP
         CDR
         FINDS
         FINDN
         JMP I FLEAS-JMS
FLEA2,   0
         LAW OP+1
         CDR
         CDR
         LAC OP+1
         JMP I FLEA2
FLEA3,   0                          /FLEA COUNTER
SUBP,    0
PNT1,    0
PNT2,    0
WRDF-JMS, 0                          /WRITE A WORD TO DF
         DAC I DF
         LAC DF
         SAD DFE
         JMS ERRDF                  /ERROR IF SPACE JAM
/ ---- scan page 095 ----
         ISZ DF
         JMP I WRDF-JMS
STAKX-JMS, 0                          /X TO STAK
         AND (177777
         DAC OP+3
         ISZ LOPX
         LAC LOPX
         SAD YSTBEG
         JMS ERR
         LAC OP+3
         DAC I LOPX
         JMP I STAKX-JMS
STAKY-JMS, 0                          /Y TO STAK
         AND (177777
         DAC OP+3
         ISZ LOPY
         LAC LOPY
         SAD YSTEND
         JMS ERR
         LAC OP+3
         DAC I LOPY
         JMP I STAKY-JMS
UNSTKX-JMS, 0                          /UNSTAK X
         LAC I LOPX
         DAC OP+3
         LAC LOPX
         SAD XSTBEG
         JMS ERR
         TAD (777777
         DAC LOPX
         LAC OP+3
         JMP I UNSTKX-JMS
UNSTKY-JMS, 0                          /UNSTAK Y
         LAC I LOPY
         DAC OP+3
         LAC LOPY
         SAD YSTBEG
         JMS ERR
         TAD (777777
         DAC LOPY
         LAC OP+3
         JMP I UNSTKY-JMS
/ ---- scan page 096 ----
DRLTD-JMS, 0                          /POSITION BEAM
         LAC I LOPX
         CMAICLL
         ADD XBEAM
         SZA
         CMA
         DAC DX                     /DELTA X
         LAC I LOPY
         CMAICLL
         ADD YBEAM
         SZA
         CMA
         DAC DY                     /DELTA Y
         SZA
         JMP .+3
         SAD DX
         JMP I DRLTD-JMS            /JUMP BOTH ZERO
         LAC (100100
         WRDF
         XCT I DRLTD-JMS            /SET VIS/INVIS
         LAC DY
         JMS VECGN                  /DRAW LINE
         LAC DX
         WRDF
         LAW
         TAD DF
         DAC TEMP
         LAC I TEMP
         XOR (400000
         DAC I TEMP                 /ESCAPE BIT
         LAC I LOPX
         DAC XBEAM
         LAC I LOPY
         DAC YBEAM
         JMP I DRLTD-JMS
WRLTD-JMS, 0                          /POSITION BEAM
         LAC I LOPX
         JMS NEG
         DAC EX2                    /USED TO POSITION TO 1ST POINTS
         DAC U                      /OF INSTANCES AND FOR REPOSITIONING
         LAC I LOPY                 /AFTER LABELLING
         JMS NEG
         DAC YY2
         DAC V
         DZM TEST
         LOCATE
         DAC TEMP2                  /OMIT INSTANCE IF STARTS OFFSCREEN
         SZA
         JMP COMP9                  /OMIT LABEL TOO
         LAC XBEAM
         DAC EX1
         LAC YBEAM
/ ---- scan page 097 ----
         DAC YY1
         WINDOW                     /WINDOW
         LAC EX2
         STAKX
         LAC YY2
         STAKY
         DRLTO
         CLL
         UNSTKX
         UNSTKY
         AND I WRLTO
WRLB-JMS, 0                          /WRITE LINE BETWEEN
         LAC XBEAM
         TAD YBEAM
         DAC SUMB
         LAC PNT2
         DAC TEMP
         JMS WRLB3
         UNSTKX
         JMS NEG
         DAC EX2                    /SAVE 2ND POINT
         UNSTKY
         JMS NEG
         DAC YY2
         LAC PNT1
         DAC TEMP
         JMS WRLB3
         UNSTKX
         JMS NEG
         DAC EX1                    /SAVE 1ST POINT
         UNSTKY
         JMS NEG
         DAC YY1
         WINDOW                     /WINDOW
         LAC YY1
         TAD EX1
         SAD SUMB
         JMP WRLB1                  /SUM MATCHES ON 1ST POINT
         LAC EX2
         STAKX
         LAC YY2
         STAKY
         DRLTO                      /POSITION TO 2ND POINT
         CLL
         UNSTKX
         UNSTKY
         LAC EX1
         STAKX
         LAC YY1
         STAKY
WRLB2,   DRLTO                      /DRAW LINE
         STL
         UNSTKX
         UNSTKY
         JMP I WRLB-JMS
WRLB1,   LAC EX1
         STAKY
/ ---- scan page 098 ----
         LAC YY1
         STAKY
         DRLTO
         CLL
         UNSTKX
         UNSTKY
         LAC EX2
         STAKX
         LAC YY2
         STAKY
         JMP WRLB2
WRLB3,   0                          /PICK UP & STACK POINT
         LAC I TEMP
         TAD I LOPY
         STAKY                      /STACK Y COORD
         LAW TEMP
         CDR
         LAC I TEMP
         TAD I LOPX
         STAKX                      /STACK Y COORD
         JMP I WRLB3
                                    /STRAIGHT LINE VECTOR GENERATOR
                                    /P. CROSS  24 4 67
                                    /LINK=1 ON ENTRY FOR INTENSIFY
VECGN,   XX
         GSM
         DAC VECGN 116
         LAC VECGN
         SPA1CLA
         LAC (LAC
         SZL
         XOR (JMS
         DAC VECGN 121
         XCT I VECGN
         ISZ VECGN
         GSM
         DAC VECGN 115
         SZL1CLA
         LAC (200
         XOR VECGN 121
         DAC VECGN 121
         LAC VECGN 115
         CMA
         ADD VECGN 116
         DAC VECGN 122
         RAL
         LAC VECGN 115
         SZL
         LAC VECGN 116
         DAC VECGN 117
         LAC VECGN 115
         SNL1CLL
/ ---- scan page 099 ----
         LAC VECGN 116
         DAC VECGN 46
         IDIV
         177
         DAC VECGN 120
         LACQ
         CMA1CLL
         DAC VECGN 125
         LAC VECGN 117
         FRDIV
         XX
         SZL1CLL
         JMP VECGN 62
         MUL-12000
         177
         DAC VECGN 46
         LACQ
         DAC VECGN 123
         DZM VECGN 124
         LAC VECGN 37
         DAC VECGN 116
         JMP VECGN 101
         LAC VECGN 37
         DAC VECGN 46
         DZM VECGN 123
         JMP VECGN 56
         LAC VECGN 124
         TAD VECGN 123
         DAC VECGN 124
         GLK
         TAD VECGN 46
         DAC VECGN 115
         CMA
         TAD (1
         TAD VECGN 117
         DAC VECGN 117
         JMS VECGN 126
         ISZ VECGN 125
         JMP VECGN 66
         LAC VECGN 117
         DAC VECGN 115
         ADD VECGN 120
         SNA
         JMP VECGN 113
         LAC VECGN 120
         DAC VECGN 116
         JMS VECGN 126
         ISZ VECGN
         JMP I VECGN
         0
         0
         0
         0
         0
         0
/ ---- scan page 100 ----
         0
         0
         0
         XX
         LAC VECGN 122
         RAL
         LAC VECGN 116
         SZL
         LAC VECGN 115
         CLQ1LLS 10
         SZL
         XOR VECGN 116
         SNL1CLL
         XOR VECGN 115
         XOR VECGN 121
         XCT I VECGN
         JMP I VECGN 126
                                    /WINDOWING MARK 3
WINDOW=JMS, 0
         LAC EX1
         DAC U
         LAC YY1
         DAC V
         DZM TEST                   /ZERO TEST
         LOCATE                     /FIND POSITION OF FIRST POINT
         CLQ
         LLS 4
         DAC TEST                   /SHIFT TEST
         LAC EX2
         DAC U
         LAC YY2
         DAC V
         LOCATE                     /FIND POSITION OF 2ND POINT
         SNA
         AND I WINDOW               /JMP IF BOTH POINTS INSIDE
         AND (360
         LRS 4
         XOR TEST
         DAC STEST                  /SETS RELATIVE POSITIONS
         LAC TEST
         AND (360
         SNA
         JMP ONEIN                  /JMP IF 1ST IN AND 2ND OUT
         LRS 4
         AND TEST
         SZA
         JMP ESCAPE                 /JMP IF BOTH OUT AND NO LINE
         LAC TEST
         AND (17
         SNA
         JMP TWOIN                  /JMP IF 2ND IN AND 1ST OUT
         LAC STEST                  /HERE IF BOTH OUT AND LINE
         INTERG
         0
         LAC U
         DAC R1
/ ---- scan page 101 ----
         LAC V
         DAC S1
         LAC (.+3
         DAC INTERG=JMS
         JMP I .-7
         0
         LAC U
         DAC EX1
         LAC V
         DAC YY1
         LAC R1
         DAC EX2
         LAC S1
         DAC YY2
         AND I WINDOW
ONEIN,   LAC STEST                  /HERE IF 1ST IN 2ND OUT
         INTERG
         0
         LAC U
         DAC EX2
         LAC V
         DAC YY2
         AND I WINDOW
TWOIN,   LAC STEST                  /HERE IF 1ST OUT 2ND IN
         INTERG
         0
         LAC U
         DAC EX1
         LAC V
         DAC YY1
         AND I WINDOW
LOCATE=JMS, 0                          /SETS LOWER 4 BITS OF TEST
         LAC WY1                    /TO LOCATE A POINT
         CMA
         TAD (1
         TAD V
         SMA
         JMP . 4
         LAC TEST
         XOR (10                    /SET 4TH BIT
         DAC TEST
         LAC V
         CMA
         TAD (1
         TAD WY2
         SMA
         JMP . 4
         LAC TEST
         XOR (4                     /SET 3RD BIT
         DAC TEST
         LAC WX1
/ ---- scan page 102 ----
         CMA
         TAD (1
         TAD U
         SMA
         JMP . 4
         LAC TEST
         XOR (2                     /SET 2ND BIT
         DAC TEST
         LAC U
         CMA
         TAD (1
         TAD WX2
         SMA
         JMP . 4
         LAC TEST
         XOR (1                     /SET 1ST BIT
         DAC TEST
         LAC TEST
         AND I LOCATE
INTERG=JMS, 0                          /FINDS EDGE POINTS
         AND (1
         SNA
         JMP . 6
         JMS SET2
         LAC WX2
         SOLVCD
         SNA
         JMS I INTERG=JMS
         LAC STEST
         AND (2
         SNA
         JMP . 6
         JMS SET2
         LAC WX1
         SOLVCD
         SNA
         JMS I INTERG=JMS
         LAC STEST
         AND (4
         SNA
         JMP . 6
         JMS SET1
         LAC WY2
         SOLVAB
         SNA
         JMS I INTERG=JMS
         LAC STEST
         AND (10
         SNA
         JMP . 6
         JMS SET1
         LAC WY1
         SOLVAB
         SNA
         JMS I INTERG=JMS
/ ---- scan page 103 ----
         JMP ESCAPE                 /NO LINE
SOLVAB-JMS, 0                          /FINDS POINT OF INTERSECTION
         SOLVE                      /WITH 'A' AND 'B' LINE
         LAC R
         DAC U
         LAC L
         DAC V
         DZM TEST
         LOCATE                     /LOCATE NEW POINT
         AND I SOLVAB
SET1,    0                          /DEFINES POINTS
         LAC EX1
         DAC V1
         LAC YY1
         DAC U1
         LAC EX2
         DAC V2
         LAC YY2
         DAC U2
         JMP I SET1
SOLVCD-JMS, 0                          /FINDS POINT OF INTERSECTION
         SOLVE                      /WITH 'C' AND 'D' LINE
         LAC L
         DAC U
         LAC R
         DAC V
         DZM TEST
         LOCATE                     /LOCATE NEW POINT
         AND I SOLVCD
SET2,    0                          /DEFINES POINTS
         LAC EX1
         DAC U1
         LAC YY1
         DAC V1
         LAC EX2
         DAC U2
         LAC YY2
         DAC V2
         JMP I SET2
SOLVE-JMS, 0                          /GENERAL INTERSECTION ROUTINE
         DAC L
         LAC U2
         CMA
         ADD U1
         DAC T3
         LAC U1
         CMA
         ADD L
/ ---- scan page 104 ----
         DAC T2
         LAC V2
         CMA
         ADD V1
         GSM
         DAC . 3
         LAC T2
         MULS
         0
         DAC DEMP
         LAC T3
         GSM
         DAC . 3
         LAC DEMP
         DIVS
         0
         LLS 22
         ADD V1
         DAC R
         AND I SOLVE
ESCAPE,  LAC DF                     /REMOVES ATNAMES OF HIDDEN LINES
         TAD (777774
         DAC DF
         AND I WRLB
NEG,     0                          /CONVERT 13 BIT TO 16 BIT
         DAC TEMP
         AND (10000
         SZA
         LAW                        /NEGATIVE
         XOR TEMP
         JMP I NEG
         PAUSE
/11742/      0  CDOCON
/11743/      0  RCATAL
/11744/      0  RCOPY
/11745/      0  RGROUP
/11746/      0  RATTPD
/11747/      0  RTFIRI
/11750/      0  ELAD
/11751/      0  LENGTH
/11752/      0  ETYPE
/11753/      0  SYMB
/11754/      0  TEMP
/11755/      0  FSBPI
/11756/      0  INST
/11757/      0  SYM
/11760/      0  XBMO
/11761/      0  BXBMO
/11762/      0  YBMO
/11763/      0  BYBMO
/ ---- scan page 105 ----
/11764/      0  RSBWOR
/11765/      0  RREDUC
/11766/      0  RROTAT
/11767/      0  BLINK1
/11770/      0  JMPADR
/11771/      0  SCRPAD
/11772/      0  TEMP1
/11773/      0  WORD
/11774/      0  ELCOUN
/11775/      0  SAVGSU
/11776/      0  NODRA
/11777/      0  PBDM
/12000/      0  XBML
/12001/      0  YBML
/12002/      0  XBM
/12003/      0  ENDEX
/12004/      0  PNTX
/12005/      0  YBM
/12006/      0  ENDEY
/12007/      0  PNTY
/12010/      0  CERRGB
/12011/      0  FREE
/12012/      0  LDP
/12013/      0  LINK
/12014/      0  EL
/12015/      0  EL1
/12016/      0  POINT
/12017/      0  LINE
/12020/      0  3DM
/12021/      0  BCC
/12022/      0  RERROR
/12023/      0  RTRACK
/12024/      0  RTSNDI
/12025/      0  CUPCOM
/12026/      0  SAVGIN
/12027/      0  RERASE
/12030/      0  RUPCOM
/12031/      0  RDOCON
/12032/      0  CISRTN
/12033/      0  RBLINK
/12034/      0  3RID
/12035/      0  RLABEL
/12036/      0  CERRDF
/12037/      0  INT1
/12040/      0  CTEMPX
/12041/      0  CTEMPY
/12042/      0  CBUSY
/12043/      0  BPNTX
/12044/      0  BPNTY
/12045/      0  POS
/12046/      0  BCON
/12047/      0  BCON1
/12050/      0  FIRSTA
/12051/      0  SNDSTA
/12052/      0  SAVE
/12053/      0  RAYTNO
/12054/      0  CSAVE
/12055/      0  XB
/ ---- scan page 106 ----
/12056/      0  YB
/12057/      0  TEMPXL
/12060/      0  TEMPYL
/12061/      0  SAVVE
/12062/      0  XTOTUP
/12063/      0  YTOTUP
/12064/      0  VAIN1
/12065/      0  TEST
/12066/ 777774
/12067/ 11456
/12070/ 360
/12071/ 100100
/12072/ 77
/12073/ 660001
/12074/ 350001
/12075/ 370
/12076/ 360000
/12077/ 777753
/12100/ 60120
/12101/ 512005
/12102/ 3000
/12103/ 760002
/12104/ 777760
/12105/ 201
/12106/ 272
/12107/ 4444
/12110/ 5067
/12111/ 777737
/12112/ 777757
/12113/ 5305
/12114/ 30117
/12115/ 5674
/12116/ 260
/12117/ 400
/12120/ 47
/12121/ 233700
/12122/ 4541
/12123/ 63700
/12124/ 101640
/12125/ 221640
/12126/ 605751
/12127/ 606030
/12130/ 34117
/12131/ 17
/12132/ 100170
/12133/ 1776
/12134/ 5136
/12135/ 606252
/12136/ 100177
/12137/ 215
/12140/ 277
/12141/ 1760
/12142/ 1777
/12143/ 257
/12144/ 4000
/12145/ 3777
/12146/ 2
/12147/ 117777
/ ---- scan page 107 ----
/12150/ 40000
/12151/ 140000
/12152/ 420001
/12153/ 777773
/12154/ 220000
/12155/ 560000
/12156/ 577777
/12157/ 500000
/12160/ 77777
/12161/ 400001
/12162/ 20000
/12163/ 760000
/12164/ 4
/12165/ 5
/12166/ 10000
/12167/ 4451
/12170/ 4452
/12171/ 770
/12172/ 14
/12173/ 4451
/12174/ 4451
/12175/ 377
/12176/ 177400
/12177/ 200
/12200/ 700200
/12201/ 401
/12202/ 77577
/12203/ 1
/12204/ 4701
/12205/ 3
/12206/ 37
/12207/ 377777
/12210/ 200000
/12211/ 600000
/12212/ 17777
/12213/ 60000
/12214/ 560004
/12215/ 160000
/12216/ 400000
/12217/ 300004
/12220/ 1700
/12221/ 1600
/12222/ 12301
/12223/ 30000
/12224/ 425254
/12225/ 120
/12226/ 60
/12227/ 160117
/12230/ 16
/12231/ 10
/12232/ 777777
/12233/ 7
/12234/ 160113
/12235/ 776000
/12236/ 100
/12237/ 7000
/12240/ 620000
/12241/ 100000
/ ---- scan page 108 ----
/12242/ 777776
/12243/ 600150
/12244/ 600123
/12245/  13700
/12246/ 601636
/12247/ 601630
/12250/ 601626
/12251/ 601624
/12252/  23700
/12253/ 601622
/12254/ 601620
/12255/ 601634
/12256/ 601632
/12257/ 605320
/ ---- scan page 109 ----
/ABSXY  =  7205        AD     =   123        ADDN   =*103266        ADJLEV =  7504
/ADR    =  5032        ADR1   =  5036        ALPHA  =  5003        AMEND  =  7640
/AMEND0 =  7653        AMEND1 =  7657        AMEND2 =  7673        AMEND3 =  7750
/AMEND4 =  7764        AMEND5 =  7775        AMEND6 =  7777        AMEND7 =  7714
/AMEND9 =  7662        ASR    =  5043        ATTMU  =  6221        ATTPDA =   556
/ATTPEL =  7625        BCC    = 12021        BCON   = 12046        BCON1  = 12047
/BD     =   150        BDC    =  2755        BDD    =  3001        BDN    =*102743
/BD0    =  3010        BDR    =  3024        BEG    =  5162        BEGRTP =    24
/BERTP1 =    30        BETA   =  4763        BFIRST =  5114        BLEVEL =  5117
/BLINK  =  5135        BLINK1 = 11767        BLIROU =  6305        BOT    =  5166
/BPNTX  = 12063        BPNTY  = 12044        BSBWOR = 11764        BSNDST =  5115
/BSZ    =  5037        BXBMO  = 11761        BYBMO  = 11763        CALDEF =  1145
/CAP0   =   236        CAR    =*102367       CATDAT =  7512        CATDA0 =  7522
/CATDA1 =  7532        CATDA2 =  7552        CATMO  =   760        CATMO1 =   761
/CBUSY  = 12042        CCAT   =  5065        CCOM1  =  5150        CD     =  6045
/CDOCOM = 11742        CDR    =*102347       CEIG   =  1622        CELE   =  1155
/CERRDF = 12036        CERRGB = 12010        CFIF   =  1632        CFOU   =  1636
/CFST   =  1624        CHMODE =  1133        CISRTN = 12032        CKS    =  5034
/CLBC   =   207        CLB1   =   213        CLBL   =   210        CLB0   =   215
/CLBR   =   206        CLBS   =   211        CLBU   =   214        CLBV   =   212
/CLOCK  =  5534        CHODE  =  5133        COLON  =  5154        COMP   = 10241
/COMPIL =*110170       COMPOI =  5063        COMPOS =  5044        COMP1  = 10423
/COMP10 = 10366        COMP11 = 10631        COMP12 = 10656        COMP13 = 10670
/COMP14 = 10364        COMP2  = 10552        COMP3  = 10546        COMP4  = 10620
/COMP5  = 10612        COMP9  = 10307        CON    =  5121        CONELE =  1517
/CONSND =  5131        CONSTB =  5126        CONSTC =  5127        CONSTD =  5130
/CONSTX =  5125        CON1   =  5122        COP FIR=  6430        COPIN  =*104331
/COPOUT =*104307       COPSND =  6446        COUN   =  4757        COUNT  =  5120
/CR     =  5155        CSAVE  = 12054        CSEV   =  1620        CSIX   =  1634
/CSMD   =  1626        CTEMPX = 12040        CTEMPY = 12041        CTRD   =  1630
/CUPCOM = 12025        CUR0   =   346        DEMP   =  4747        DELB   =*103324
/DELLEV =  6464        DFE    =  5157        DFENOR =  5161        DFB    =  5156
/DFCON  =  1027        DISCO1 = 10125        DISCO2 = 10143        DISCO3 = 10144
/DISCON = 10116        DRAMD  =  6073        DRAWHG =  5123        DRLTD  =*111035
/DPSIM  =  1046        DSON   =*103310       DX     =  4756        DY     =  5014
/DS     =  5031        EDGEN  =  5605        EDGEV  =  5571        EIGCLB =   205
/ED     =  6050        ELAD   = 11750        EL1    = 12015        ENDEY  = 12006
/EL     = 12014        ELCOUN = 11774        ENDEX  = 12003        ERR    =  2221
/END    =  5163        ENDCON =  6113        ENDDRA =  6115        ENDNOR =  5165
/ENDPOI =  7562        ENDRES =  5164        ERASE  =  6705        ERRMEB =  4171
/ENTER  =*102472       ERAST  =  5750        ERRMEA =  4166        ERR6   =  4201
/ERRDF  =  4206        ERRGB  =  4221        ERR5   =  4176        EX1    =  4775
/ERR3   =  4174        ERR4   =  4203        EXIT   =*602504       FEL    =*103035
/ESCAPE = 11727        ETYPE  = 11752        FINDN  =*103126       FINDP  =*103141
/EX2    =  4776        FD     =  6030        FLEAS  =*110717       FLEA1  = 10734
/FSTCLB =   202        FIG    =  4777        FLST   =*102253       FELN   =*103041
/FINDS  =*103113       FIRSTA = 12050        FOCBL1 =  1354        FOBBL  =   463
/FLEA2  = 10744        FLEA3  = 10752        FOHBL  =  7105        FOCBL2 =  1422
/FOBBL1 =   542        FOCBL  =   531        FOUCLB =   201        FOLBL  =  7215
/FOCBL3 =  1373        FOCBL4 =  1404        FSTCLB =   176        FREE   = 12011
/FOHBL  =  7171        FOPBL  =  7274        GARR2  =  2714        GAMMA  =  4761
/FRSTCH =  1771        FSBPI  = 11755        GD     =  6070        GBCDR  =  2601
/GARR   =  2627        GARR1  =  2652        GETSP  =*102312       GBRTN  =  2617
/GBD    =  2716        GBD1   =  2732        GNTR   =  2541        GIND   =  2241
/GBUG   =  2242        GB2    =  2544        GR1    =  3165        GDM    = 12020
/GETD   =*110701       GETD1  = 10716        GBRNCH =  2533        GRHA   =  3155
/GITEM  =  2562        GNIL   =  2605        GR1    =  3165        GR2    =  3225
/GRID   = 12034        GRRB   =  3221
/ ---- scan page 110 ----
/GSTKP  =  2243        GTEMP  =  2244        HDR1   =  5030        IMC    =  5141
/IND0   =   252        INEL   =  1436        INIT   =102335        INP    =104260
/INSRET =  6554        INSRT  =103076        INSRTN =  6343        INST   = 11756
/INT    =  5320        INTERG =111557        INTMO  =   707        INT1   = 12037
/JMPADR = 11770        L      =  4772        LB     =  5200        LBD    =    47
/LBD1   =  5674        LBSF   =  5231        LB1    =  5253        LB2    =   643
/LB3    =  5254        LB4    =  5262        LENGTH = 11751        LESS   =  6237
/LEVEL  =  5116        LIM    =  2516        LIM1   =  2530        LIM2   =  2524
/LINDAT =  7466        LINE   = 12017        LINK   = 12013        LKBEG  =  5172
/LKEND  =  5173        LKERR  =  3265        LKTEST =  3260        LOCATE =111510
/LOP    = 12012        LOPX   =  5006        LOPY   =  5024        LPBEG  =  5171
/LTPX   =  1701        MASKX  =  7312        MASKY  =  7343        MASKY1 =  7402
/MBLINK =  5134        MESIN  =  3732        MESIN1 =  4050        MESIN2 =  4657
/MESIN3 =  4075        MESIN4 =  4122        MESIN5 =  4141        MESIN6 =  4005
/MESIN7 =  4015        MESIN8 =  4036        MESIN9 =  4041        MESL   =  4126
/MESOUT =103352        MESS   =  4366        MESSAG =  4134        MIN    =  5137
/MKER   =  5002        MK1    =  2536        MOD    =  6335        MODE   =  5041
/MORE   =  6226        MOUT   =  5140        MOVCR  =  1454        MRKX   =  5001
/MRKY   =  4760        MS     =  4367        MSIN   =  4371        MSOUT  =  4370
/NEG    = 11733        NM     =  5066        NODRA  = 11776        NOR0   =   427
/NOTE   =  4355        NULLR  =103070        NUL0   =   405        ONEIN  = 11470
/OP     =  2232        OUT    =104237        PAD    =  5313        PAMODE =  1066
/PBDM   = 11777        PCD    =  5315        PEN    =  5353        PEN1   =  5403
/PEN2   =  5413        PEN3   =  5445        PEN4   =  5431        PEN5   =  5437
/PIXEX  =   774        PLD    =  5316        PNTX   = 12004        PNTY   = 12007
/PNT1   = 10754        PNT2   = 10755        PODAT1 =  7426        POIDAT =  7407
/POIMO  =  6207        POINT  = 12016        PONT   =  5015        POP    =102433
/POS    = 12045        POSCR  =  5621        POSDF  =  4741        POSDFB =  4743
/POSDFL =  4742        POSIT  = 10160        PRD    =  5314        PRINT1 =  5151
/PRINT2 =  5152        PSD    =  5312        PUSH   =102407        PXD    =  5317
/PXER1  =  2072        PXER2  =  2074        PXER3  =  2073        PXID   =  2106
/PXOK   =  2037        R      =  5011        RATTMO = 12053        RATTPO = 11746
/RBLINK = 12033        RCATAL = 11743        RCOPY  = 11744        RDOCOM = 12031
/REDUC  =   766        RELCON =  5035        RELOC1 =  2043        RELOC4 =  2044
/RERASE = 12027        RERROR = 12022        RES0   =   220        RGROUP = 11745
/RINST  = 10621        RLABEL = 12035        RLCEND =  2072        RLINE  = 10625
/RMODE  =  5132        ROTMO  =   771        RREDUC = 11765        RROTAT = 11766
/RTFIRI = 11747        RTRACK = 12023        RTSNDI = 12024        RUBBER =  6105
/RUPCOM = 12030        RW     =  2107        RW1    =  2126        RW2    =  2133
/R1     =  4753        SAV    =  5027        SAVE   = 12052        SAVEX  =  6722
/SAVEY  =  6732        SAVGIN = 12026        SAVGSU = 11775        SAVINS =  5146
/SAVSUB =  5147        SAVTEM =  6742        SAVTE1 =   604        SAVVE  = 12061
/SBMODE =  1073        SBPI   =  5064        SBPI1  =  4766        SCAMO  =   735
/SCRABL =  5136        SCRPAD = 11771        SD     =  5751        SD1    =  5767
/SEGCNX =  6624        SEGCNY =  6672        SEGCX  =  6606        SEGCY  =  6637
/SEGCY1 =  6652        SEGEX  =  7035        SEGEY  =  1561        SEGRXY =  6565
/SEGX   =  6476        SEGXY  =  6521        SEGY   =  6510        SERSWI =   451
/SETCL  =  6364        SETUP  =102147        SETUP1 =102167        SET1   = 11635
/SET2   = 11660        SEVCLB =   204        SHRINK =  1216        SIXCLB =   203
/SNDCH  =  1764        SNDCLB =   177        SNDSTA = 12051        SOLVAB =111624
/SOLVCD =111647        SOLVE  =111672        SRAST  =  5656        STAK   =102446
/STAKX  =110765        STAKY  =110777        STCON  =  5111        STCON1 =  5113
/STEST  =  4774        STPCD  =  5504        STPNTX =  5107        STPNTY =  5110
/STPOS  =  5112        STRAIG =  6100        STRCR  =  6252        STSAVE =  5177
/STSPST =  1642        STSTAK =  4747        STXBMO =  1640        STYBMO =  1641
/SUBP   = 10753        SUMB   =  5013        SUMB   =  5040        SVAD   =  5023
/SW     =  5033        SWITCH =  5124        SWI0   =   310        SXY    =  6315
/SYM    = 11757        SYMB   = 11753        S1     =  5012        TAKE   =  6777
/ ---- scan page 111 ----
/TAKE1  =   621        TD     =  6062        TEM    =  4764        TEMP   = 11754
/TEMPDF =  4441        TEMPEN =  4744        TEMPX  =  4745        TEMPXL = 12057
/TEMPY  =  4746        TEMPYL = 12060        TEMP1  = 11772        TEMP2  =  5021
/TESLEV =  6271        TEST   = 12065        TESTIN =  6371        TESTJN = 10013
/TH     =  1706        TDDIS  =  6542        TOP    =  5167        TOTEMP =  5304
/TRACK  =  5637        TRAKX  =  5052        TRAKY  =  5053        TRCR   =  5466
/TRDCLB =   200        TS     =  1741        TURNVE =  1232        TV     =  2024
/TWOIN  = 11500        TX     =  1705        TZ     =  2016        T2     =  4770
/T3     =  5007        U      =  4762        UNSTAK =*102400       UNSTKX =*111011
/UNSTKY =*11023        UPCOMP =  7041        UPCOM1 =  7077        UPCOM2 =  7075
/UPDAIN =  7452        UPDAXY =  7440        U1     =  5010        U2     =  4750
/V      =  5020        VAIN   = 10051        VAIN1  = 12064        VAIN2  = 10101
/VECON  = 11237        VEMODE =  1117        VEPART =  5045        VOL0   =   321
/V1     =  4751        V2     =  4771        WAIT   =*103375       WAITLX =  2125
/WAIT1  =  3636        WAIT10 =  3606        WAIT11 =  3404        WAIT12 =  3422
/WAIT13 =  3437        WAIT15 =  1337        WAIT2  =  3547        WAIT3  =  3464
/WAIT4  =  3650        WAIT5  =  3676        WAIT6  =  3705        WAIT7  =  3506
/WAIT8  =  3571        WAIT9  =  3460        WAIT91 =  1316        WAIT92 =  1272
/WAREA  =  5272        WINDOW =*111403       WORD   = 11773        WRDF   =*110756
/WRLB   =*110134       WRLB1  = 11210        WRLB2  = 11203        WRLB3  = 11225
/WRLTO  =*110100       WX1    =  5142        WX2    =  5143        WY1    =  5144
/WY2    =  5145        X      =  4767        XB     = 12055        XBEAM  =  4765
/XBM    = 12002        XBMC   =  5016        XBML   = 12000        XBMO   = 11760
/XCROSS =  5641        XINS   =  5056        XINS1  =  5046        XP     =  5051
/XSTBEG =  5174        XTOT   =  5054        XTOTIN =  5060        XTOTUP = 12062
/Y      =  5017        YB     = 12056        YBEAM  =  5022        YBM    = 12005
/YBMC   =  5000        YBML   = 12001        YBMO   = 11762        YCROSS =  5640
/YINS   =  5057        YINS1  =  5062        YP     =  5050        YSTBEG =  5175
/YSTEND =  5176        YTOT   =  5055        YTOTIN =  5061        YTOTUP = 12063
/YY1    =  4754        YY2    =  4755
