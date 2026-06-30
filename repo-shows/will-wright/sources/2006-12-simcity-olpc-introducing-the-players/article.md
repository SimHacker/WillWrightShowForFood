# SimCity for OLPC — introducing the players

*Email thread, December 2006. John Gilmore introduces the cast; Don lays out the Sugar integration roadmap. Harvest: [simcity-for-olpc----introducing-the-players.txt](../../../../DonHopkins/temp/old-email/simcity-for-olpc----introducing-the-players.txt).*

---

## Cast (John Gilmore, 19 Dec 2006)

| Person | Role |
|--------|------|
| **Walter Bender** | OLPC President, Software & Content — "would be very happy to see SimCity ship" (from Dubai) |
| **Jim Gettys** | VP Software Engineering, laptop.org — forwards to Walter; Cairo/Pango guidance |
| **Don Hopkins** | SimCity Unix author; unearthed source + DUX/Maxis contracts; FC6 port |
| **Charles "Chuck" Normann** | EA point man — GPL relicensing through bureaucracy |
| **Doreen Nelson** | Cal Poly Pomona — wrote Maxis **SimCity curriculum guides**; wants them freed |
| **John Gilmore** | EFF co-founder; willing to subsidize Don's OLPC work once EA frees code |
| **Mitch Bradley** | OLPC; ex-Sun colleague of Don |

Walter later offers **Eben Moglen** (FSF counsel, OLPC adviser) to help Chuck with GPL relicensing.

---

## Walter Bender (first response)

> This somehow slipped through the cracks. It would of course be great to have Sim City on the laptop. (I actually always preferred the earlier versions myself…)

On Don's roadmap: *"This all sounds great. Let me mull over your trivial to blue sky list on the flight home tomorrow. Shall we plan to talk between Christmas and New Years?"*

---

## Don's integration roadmap (21 Dec 2006)

**Near term:** playable on FC6 soon; integrate incrementally.

**Task list — trivial → blue sky:**

1. fonts, sounds, screen formats, configuration/build, i18n  
2. help, documentation, **courseware** (Doreen Nelson guides)  
3. **multi player collaboration**  
4. code refactoring, SWIG, **Python scripting** (rip out TCL)  
5. **Sugar integration** — UI components, customization  
6. **mesh networking**, chatting, **journaling and storytelling**  
7. import/export, printing, custom graphics  
8. user scripting, custom zones/sprites/disasters/tools/scenarios  
9. visual programming — *SimCity meets Robot Odyssey / Click and Play / KidSim / SimAntics / EToys / AgentSheets / LabView / Max / Body Electric*  
10. **cellular automata laboratory** (John Gilmore PS: the beautiful CA screen Don liked)

> SimCity will be a wonderful **driving force and proving application for Sugar**… showcase grid networking and journaling… opening up SimCity to scripting will be a great way to make kids interested in pressing the **"View Source"** key.

Games stress UI toolkits harder than desktop apps — SimCity drove pie menus, sound mixer, shared-memory animation, multi-display TCL/Tk on Unix; same logic for Sugar on XO.

---

## Jim Gettys — stack advice (21 Dec 2006)

Sugar = **GTK+ / Pango / ATK / Cairo / X**, **Python**, **Avahi** (presence).

- **Pango** for serious i18n text layout (minimal GTK required)  
- **Cairo** — PostScript-like API, Porter-Duff alpha, quality 2D; backends for PDF/X/GL  
- Performance work actively underway (Nokia 770, OLPC as drivers)  
- Offer: call with **Chris Blizzard** to walk the stack

Multiplayer note from Gilmore: hook SimCity chat/overlay into OLPC **proximity and friendship** systems; may need mesh test with second laptop.

---

## Chuck ↔ Don — rights clearance (27–28 Dec 2006)

Don confirms:

- **DUX** published Unix SimCity; DUX–Maxis contract **expired July 2001**  
- NeWS/HyperLook port (Sun exclusive briefly), then **X11/TCL/Tk multiplayer**  
- Only proprietary bit removed: Elan license manager; node-lock easy to strip  
- **"All the rest of the code is stuff I wrote, and would be happy to publish as open source."**  
- Offered EA a **zip of source** or multi-GB **VMware FC6 image** with SimCity preinstalled

---

## Doreen Nelson

Curriculum guide still relevant; Design-Based Learning program at Cal Poly; charter high school won California Golden Bell — SimCity would be "very useful to everyone."

---

## Show hooks → [`walter-bender-olpc`](../../../../repo-shows/walter-bender-olpc/SHOW.yml)

1. Walter + Eben Moglen GPL path  
2. Jim Gettys Cairo/Pango — Micropolis rendering lineage  
3. Doreen curriculum + Constructionist courseware  
4. "View Source" + Robot Odyssey vision → Micropolis Home today

---

*Part of [simcity-open-source-saga](../simcity-open-source-saga/).*
