\ Tags: a display list that says what it draws. Needs turtle.fs (DL,).
\
\ The 340's SUBR word has a two-bit jump type, and DEC never defined
\ 00. The cabinet makes it DTG, display tag: bits 2-4 the next mode,
\ bits 5-17 an address. Everything drawn after it carries that address
\ until the next DTG (0 = untagged); IDLA clears it, and a DJS saves it
\ for its return. The 340 never reads what is there. The cabinet's UI
\ does: hovering a tagged stroke captions it with the tag's title.
\ TAGS-AND-PIES.md has the design, and src/tags.ts the reader.
\
\ What the address points at is a convention between the program and
\ the UI. Here it is a Forth counted string, the count then a character
\ per word, which is just what S" compiles into a definition, so a tag
\ costs nothing but its three display words:
\
\   : door  TAG" Front door"  ( draw the door... )  NOTAG ;
\
\ Use TAG" inside a definition: interpreted, S" leaves its string in a
\ buffer the next S" reuses. TAGGED ( c-addr u -- ) tags with a string
\ from anywhere that stays put, and TAG-AT ( addr -- ) with any address,
\ such as a full tag record (title, link, 36-bit id).

decimal

\ From vector mode: escape to parameters, SUBR mode for one word, the
\ DTG (vector mode next, so 32768), and on with the vectors.
: tag-at ( addr -- ) 131072 dl,  57344 dl,  8191 and 32768 + dl, ;
: notag ( -- ) 0 tag-at ;
: tagged ( c-addr u -- ) drop 1- tag-at ;
: tag" ( "ccc<quote>" -- ) [ ' s" compile, ] ['] tagged compile, ; immediate
