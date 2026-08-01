' do-control	" Control"			menu-header Control-mh
' do-demo	" Demo PullDown Menu"		menu-header DemoPullDown-mh
' do-demo	" Demo Pie Menu"		menu-header DemoPie-mh
' do-demo	" Practice PullDown Menu"	menu-header PracticePullDown-mh
' do-demo	" Practice Pie Menu"		menu-header PracticePie-mh
4 ' do-record	" PL1"				test-menu-header PL1-mh
5 ' do-record	" PL2"				test-menu-header PL2-mh
6 ' do-record	" PL3"				test-menu-header PL3-mh
6 ' do-record	" PL4"				test-menu-header PL4-mh
7 ' do-record	" PL5"				test-menu-header PL5-mh
6 ' do-record	" PO1"				test-menu-header PO1-mh
8 ' do-record	" PO2"				test-menu-header PO2-mh
2 ' do-record	" PO3"				test-menu-header PO3-mh
1 ' do-record	" PO4"				test-menu-header PO4-mh
4 ' do-record	" PO5"				test-menu-header PO5-mh
1 ' do-record	" PP1"				test-menu-header PP1-mh
3 ' do-record	" PP2"				test-menu-header PP2-mh
5 ' do-record	" PP3"				test-menu-header PP3-mh
3 ' do-record	" PP4"				test-menu-header PP4-mh
1 ' do-record	" PP5"				test-menu-header PP5-mh
8 ' do-record	" LL1"				test-menu-header LL1-mh
7 ' do-record	" LL2"				test-menu-header LL2-mh
2 ' do-record	" LL3"				test-menu-header LL3-mh
2 ' do-record	" LL4"				test-menu-header LL4-mh
4 ' do-record	" LL5"				test-menu-header LL5-mh
2 ' do-record	" LO1"				test-menu-header LO1-mh
4 ' do-record	" LO2"				test-menu-header LO2-mh
7 ' do-record	" LO3"				test-menu-header LO3-mh
8 ' do-record	" LO4"				test-menu-header LO4-mh
8 ' do-record	" LO5"				test-menu-header LO5-mh
6 ' do-record	" LP1"				test-menu-header LP1-mh
5 ' do-record	" LP2"				test-menu-header LP2-mh
4 ' do-record	" LP3"				test-menu-header LP3-mh
5 ' do-record	" LP4"				test-menu-header LP4-mh
5 ' do-record	" LP5"				test-menu-header LP5-mh
warm
create menu-sequence
  PL1-mh , PL2-mh , PL3-mh , PL4-mh , PL5-mh ,
  LL1-mh , LL2-mh , LL3-mh , LL4-mh , LL5-mh ,

  PO1-mh , PO2-mh , PO3-mh , PO4-mh , PO5-mh ,
  LO1-mh , LO2-mh , LO3-mh , LO4-mh , LO5-mh ,

  PP1-mh , PP2-mh , PP3-mh , PP4-mh , PP5-mh ,
  LP1-mh , LP2-mh , LP3-mh , LP4-mh , LP5-mh ,

here menu-sequence - /l / constant /menu-sequence

\ 4 , 5 , 6 , 6 , 7 , 
\ 6 , 8 , 2 , 1 , 4 , 
\ 1 , 3 , 5 , 3 , 1 , 
\ 8 , 7 , 2 , 2 , 4 , 
\ 2 , 4 , 7 , 8 , 8 , 
\ 6 , 5 , 4 , 5 , 5 , 

' do-hosts	" Hosts"	menu-header Hosts-mh
' show-choice	" Pull Down"	menu-header Pull-mh
' show-choice	" Percent"	menu-header Percent-mh
' show-choice	" Push"		menu-header Push-mh

' show-choice	" brillig"	menu-header brillig-mh
' show-choice	" haigha"	menu-header haigha-mh
' show-choice	" gyre"		menu-header gyre-mh
' show-choice	" mome"		menu-header mome-mh
' show-choice	" tumtum"	menu-header tumtum-mh
' show-choice	" crayola"	menu-header crayola-mh
' show-choice	" ballast"	menu-header ballast-mh
' show-choice	" mimsy"	menu-header mimsy-mh

