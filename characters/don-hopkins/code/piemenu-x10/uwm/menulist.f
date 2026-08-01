' do-control	" Control"			menu-header Control-mh
' do-demo	" Demo PullDown Menu"		menu-header DemoPullDown-mh
' do-demo	" Demo Pie Menu"		menu-header DemoPie-mh
' do-demo	" Practice PullDown Menu"	menu-header PracticePullDown-mh
' do-demo	" Practice Pie Menu"		menu-header PracticePie-mh
5 ' do-record	" PL1"				test-menu-header PL1-mh
6 ' do-record	" PL2"				test-menu-header PL2-mh
3 ' do-record	" PL3"				test-menu-header PL3-mh
4 ' do-record	" PL4"				test-menu-header PL4-mh
1 ' do-record	" PL5"				test-menu-header PL5-mh
7 ' do-record	" PL2"				test-menu-header PL6-mh
5 ' do-record	" PL3"				test-menu-header PL7-mh
8 ' do-record	" PL4"				test-menu-header PL8-mh
2 ' do-record	" PL5"				test-menu-header PL9-mh
4 ' do-record	" PL5"				test-menu-header PL10-mh
4 ' do-record	" PO1"				test-menu-header PO1-mh
1 ' do-record	" PO2"				test-menu-header PO2-mh
7 ' do-record	" PO3"				test-menu-header PO3-mh
5 ' do-record	" PO4"				test-menu-header PO4-mh
6 ' do-record	" PO5"				test-menu-header PO5-mh
3 ' do-record	" PO1"				test-menu-header PO6-mh
8 ' do-record	" PO2"				test-menu-header PO7-mh
2 ' do-record	" PO3"				test-menu-header PO8-mh
5 ' do-record	" PO4"				test-menu-header PO9-mh
4 ' do-record	" PO5"				test-menu-header PO10-mh
4 ' do-record	" PP1"				test-menu-header PP1-mh
1 ' do-record	" PP2"				test-menu-header PP2-mh
7 ' do-record	" PP3"				test-menu-header PP3-mh
5 ' do-record	" PP4"				test-menu-header PP4-mh
3 ' do-record	" PP5"				test-menu-header PP5-mh
6 ' do-record	" PP1"				test-menu-header PP6-mh
8 ' do-record	" PP2"				test-menu-header PP7-mh
2 ' do-record	" PP3"				test-menu-header PP8-mh
5 ' do-record	" PP4"				test-menu-header PP9-mh
4 ' do-record	" PP5"				test-menu-header PP10-mh
2 ' do-record	" LL1"				test-menu-header LL1-mh
8 ' do-record	" LL2"				test-menu-header LL2-mh
5 ' do-record	" LL3"				test-menu-header LL3-mh
1 ' do-record	" LL4"				test-menu-header LL4-mh
4 ' do-record	" LL5"				test-menu-header LL5-mh
7 ' do-record	" LL1"				test-menu-header LL6-mh
6 ' do-record	" LL2"				test-menu-header LL7-mh
3 ' do-record	" LL3"				test-menu-header LL8-mh
5 ' do-record	" LL4"				test-menu-header LL9-mh
4 ' do-record	" LL5"				test-menu-header LL10-mh
2 ' do-record	" LO1"				test-menu-header LO1-mh
4 ' do-record	" LO2"				test-menu-header LO2-mh
7 ' do-record	" LO3"				test-menu-header LO3-mh
1 ' do-record	" LO4"				test-menu-header LO4-mh
5 ' do-record	" LO5"				test-menu-header LO5-mh
8 ' do-record	" LO1"				test-menu-header LO6-mh
6 ' do-record	" LO2"				test-menu-header LO7-mh
3 ' do-record	" LO3"				test-menu-header LO8-mh
4 ' do-record	" LO4"				test-menu-header LO9-mh
5 ' do-record	" LO5"				test-menu-header LO10-mh
6 ' do-record	" LP1"				test-menu-header LP1-mh
1 ' do-record	" LP2"				test-menu-header LP2-mh
4 ' do-record	" LP3"				test-menu-header LP3-mh
5 ' do-record	" LP4"				test-menu-header LP4-mh
8 ' do-record	" LP5"				test-menu-header LP5-mh
3 ' do-record	" LP1"				test-menu-header LP6-mh
7 ' do-record	" LP2"				test-menu-header LP7-mh
2 ' do-record	" LP3"				test-menu-header LP8-mh
5 ' do-record	" LP4"				test-menu-header LP9-mh
4 ' do-record	" LP5"				test-menu-header LP10-mh

create menu-sequence
  PL1-mh , PL2-mh , PL3-mh , PL4-mh , PL5-mh ,  PL6-mh , PL7-mh , PL8-mh , PL9-mh , PL10-mh ,
  LL1-mh , LL2-mh , LL3-mh , LL4-mh , LL5-mh ,  LL6-mh , LL7-mh , LL8-mh , LL9-mh , LL10-mh ,

  PO1-mh , PO2-mh , PO3-mh , PO4-mh , PO5-mh ,  PO6-mh , PO7-mh , PO8-mh , PO9-mh , PO10-mh ,
  LO1-mh , LO2-mh , LO3-mh , LO4-mh , LO5-mh ,  LO6-mh , LO7-mh , LO8-mh , LO9-mh , LO10-mh ,

  PP1-mh , PP2-mh , PP3-mh , PP4-mh , PP5-mh ,  PP6-mh , PP7-mh , PP8-mh , PP9-mh , PP10-mh ,
  LP1-mh , LP2-mh , LP3-mh , LP4-mh , LP5-mh ,  LP6-mh , LP7-mh , LP8-mh , LP9-mh , LP10-mh ,

here menu-sequence - /l / constant /menu-sequence

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

