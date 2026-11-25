# Writing the cabinet docs

Plain technical prose. Say what the thing is and what it does. A reader who has never seen the
repo should understand every sentence without knowing anything the doc doesn't tell them.

## Cut

- Slogans and taglines: "Not a simulator. Not SIMH.", "Same contract, different implementation",
  "the oracle and the acceptance test in one".
- Personifying machines or code: "the PDP-10 should not pretend…", "the 340 earns its keep",
  "the cabinet already decided…".
- Framing that announces importance instead of stating the fact: "The point is…", "The trick
  is…", "Here's the thing", "This is where X earns its keep", "the heart of", "crucially",
  "It just happens", "the other half of the point", "That is what a viewer needs".
- "Not X, but Y" and "isn't X; it's Y" contrasts when nobody claimed X.
- Sentence fragments for effect ("Not inlined. Not cached.") in running prose. Fragments are
  fine in tables and lists.
- Cute inside references the reader can't know: running jokes, nicknames for features, callbacks
  to other docs or chats.
- Loose "for free", "costs nothing", "magic", "seamless", "first-class", "delightful". Keep
  "costs nothing" only when it is a precise claim (no work is done when the feature is off).
- Em dashes. Use a comma, colon, parentheses or a new sentence.
- Invented feelings in Don's voice ("This is my favorite part"). In a doc with Don's byline,
  first person states facts and decisions, not reactions he didn't write.
- Musical and literary metaphors for technical steps ("in three movements", "a dance").

## Keep

- Every fact, number, name, date, link, code span and citation.
- Real people's words exactly as quoted, and anything Don wrote himself.
- Spoken text in transcripts. Only editor's notes around it may change.
- Headings' anchors: if a heading changes, update every link to it across the repo.
