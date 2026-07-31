# Don Woods — conversation hooks

## 1. Adventure is the original Repo Show

The whole premise of WWSFF is walking a repository with the person who made it. Adventure is
the **founding repo of an entire genre**, its 1977 FORTRAN source survives, and Knuth's CWEB
recast ([advent.w](../donald-knuth/sources/adventure-knuth/advent.w) — copyright "Don Woods
and Don Knuth") turns it into annotated literature. Walk it on air: where the pirate spawns,
how the endgame triggers, where the last lousy point hides. No guest's repo is more
load-bearing.

## 2. The crowther@ story — provenance before open source

Woods found unattributed code and did the honorable thing at absurd scale: emailed
`crowther@` at every ARPANET host until the author answered, then asked permission before
extending. That's `git blame`, licensing etiquette, and a fork request — in 1976, by hand.
Ask him to tell it in his own words; it's the best origin story in software.

## 3. INTERCAL and the theory of executable humor

The `PLEASE` politeness check is a **censor with a calibration curve** — reject the impolite
*and* the groveling. This plugs straight into the show's running Minsky thread (AI Memo 603,
jokes as bug-detection): INTERCAL is humor theory you can compile. A segment pairing Woods on
INTERCAL with the Minsky/Drescher material practically writes itself.

## 4. Two Dons at Sun — NeWS, TNT, PostScript

Firsthand collaboration: Don Hopkins and Don Woods on The NeWS Toolkit. The NeWS motd
(*"Welcome to Adventure. Would you like instructions?"*) framed the whole machine as the well
house. War stories: PostScript as a systems language, the
[1991 ICCCM interoperability death match](../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md),
what NeWS got right that took the industry decades to reinvent.

## 5. The Hacker's Dictionary — the culture's self-portrait

Co-author of the 1983 book that canonized the Jargon File. The AI koans, the grues, "one
lousy point" — Woods is both a contributor to and a subject of the culture's own dictionary.
Good on-air thread: what it felt like to document a living culture from inside it.

## 6. Run the original on original iron

Pair with [Lars Brinkhoff](../lars-brinkhoff/): boot the 1977 Adventure on an emulated
PDP-10 live. The cave, at home, in its native habitat.

## 7. The stamp gag

Open the show by "mailing" the MOOLLM
[Spelunker Today matchbook](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/kitchen/matchbooks.yml)
and presenting Woods with his own One Lousy Point stamp. The microworld honored him before
the invitation existed — let him score the final point of the episode with it.

## 8. Knuth found a hack in INTERCAL's division routine

In 2003, Knuth wrote an INTERCAL program and discovered "a really cool hack I hadn't seen
before" in the standard library's division routine — then wrote to Woods asking whether he
or Lyon deserved credit in TAOCP volume 4. Neither could remember. The only known case of
a joke language's standard library being scouted for The Art of Computer Programming.
Pairs with the advent.w walk: Knuth engaged seriously with *both* of Woods's masterpieces.

## 9. First contact was a typo (1986)

Don mis-typed `:mail don` and the message landed at Woods.pa@Xerox.COM. Woods: *"I'll
bite: To whom did you intend to send this?"* Forty years of correspondence started by a
mail-routing accident — and Don had already mis-sent him a database once before. Open the
episode by reading it aloud. ([digest](sources/correspondence-digest.md))

## 10. The AI skeptic on an AI-produced stage

Woods (2025): AI simulations are "surprisingly (disturbingly?) good at generating
fake-but-convincing dialogues... Of course, they're still terrible at actually
understanding anything." The Repo Show's stage is maintained with an LLM coherence
engine. Don't dodge this — make it a segment: let Woods audit the microworld that issued
his stamp, and grade it. His standards (no HN account, no Facebook, on principle) make
him the perfect hostile reviewer, in the best sense.

## 11. TNT tracking service → ScriptX → OLPC

The TNT 2.0 tracking service (Woods, Densmore, Raymor et al.) — minimal objects, safe
synchronous input that never loses events — was reincarnated by Don in Kaleida's ScriptX
and offered to OLPC Sugar in 2007. A design outliving three platforms is worth an episode
segment on what made it right. ([artifacts](sources/sun-news-artifacts.md))

## 12. Two-Toll: your troll and MIT's troll were the same troll all along

The comparative troll zoology (see the Knuth encore below) now has a living exhibit:
[Two-Toll the Troll](../menagerie/troll/), a menagerie guest whose canonical soul lives in
MOOLLM with **two minds** — an adventure-mind that runs YOUR bridge toll (one treasure per
crossing, rhinoceros hide, the bear incident, the fee-fie-foe-foo eggs audit) and a
zork-mind that runs MIT's combat gate (bloody axe, blocks all passages, sinister black
fog). He fronts whichever protocol the world's currency speaks. On-air bit: introduce
Woods to the character who claims Woods was one of his two employers — and let Woods
audit the adventure-mind's canon line by line. He invented the NPC business model; he
should get to inspect the franchise. Alongside [Snorax the wumpus](../menagerie/wumpus-snorax/)
and [the grue](../menagerie/grue/), he's a foundational example of porting NPCs between
games as self-contained cartridges ([GAME-CARTRIDGES.md](../menagerie/GAME-CARTRIDGES.md)).

## Ensemble options

- **Woods solo** — Adventure repo walk ([show seed](../../repo-shows/don-woods-adventure.yml))
- **Woods + Don Hopkins** — the two-Dons NeWS/TNT episode
- **Woods + Lars Brinkhoff** — PDP-10 restoration + live original Adventure
- **Woods + Scott Adams** — the two Adventurers: the mainframe cave meets the 16K home-computer branch ([show seed](../../repo-shows/woods-and-adams-adventurers.yml)) — both already have One Lousy Point stamps in the MOOLLM kitchen
- **Woods + Knuth — THE DREAM: the literate adventure code reading** ([dream ensemble](../../repo-shows/don-woods-adventure.yml), [Knuth room](../donald-knuth/)) — the two names on the advent.w copyright line walking the sections together, author beside annotator. The channel is Woods himself: he saw Knuth at a SAIL reunion ~2025 (*"getting frail but is still plenty sharp"*), and Knuth wrote to him in 2003 about the INTERCAL division-routine hack. If Woods says yes to his solo show, ask him whether a joint reading would delight Knuth. **Encore — the border crossing**: after the literate Adventure, visit the neighboring realm while the party's assembled — the Zork MDL (GIVE TROLL TO TROLL is Zork's, not Adventure's; the crossing is the point). GIVE AXE TO TROLL, GIVE TROLL TO TROLL, and the uncleared `TROLL-FLAG!-FLAG` Don hypothesized on MIT-DM and confirmed in the source decades later. Don called the MDL "practically a form of literature" back in 2013; all three Dons close-read it, and Woods gets right of reply — Zork was MIT's answer to *his* cave. Then **comparative troll zoology**: ask Woods about his toll-taking bridge troll (pay a treasure; the bear scares him off; the bridge buckles under you-plus-bear) vs MIT's omnivorous self-devouring one — and the wider bestiary: his pirate vs their thief (who can open the jeweled egg — giving treasure to the villain as puzzle solution), his little bird vs their clockwork canary, his pit-in-the-dark vs their grue, his axe-throwing dwarves vs their ODYSSEUS-fearing cyclops, and the robot (an actor, not a vehicle — source-verified) plus GDT's teleport-anything godmode. ([harvest](../don-hopkins/sources/zork-troll-flag-adventure-lineage-hn.md))
- **Woods × Knuth room** — even without Knuth live, advent.w is a co-authored text to read from
