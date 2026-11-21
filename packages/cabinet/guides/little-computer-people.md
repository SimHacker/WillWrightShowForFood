# Little Computer People

[Activision](https://en.wikipedia.org/wiki/Activision), 1985. A little man moves into the
three-story house on your disk, with his dog, and lives there: he cooks, reads the paper, watches
television, plays the piano, and now and then writes you a letter about how he feels. There is
nothing to win. Every copy of the game made its own person, with his own name and temperament, so
no two houses play the same.

[Rich Gold](../../../characters/rich-gold/README.md) had the idea: a Pet Person, in the spirit of
the [Pet Rock](https://en.wikipedia.org/wiki/Pet_Rock), that you would boot and watch.
[David Crane](../../../characters/david-crane/README.md), who had made
[Pitfall!](https://en.wikipedia.org/wiki/Pitfall!), took it on at Activision and rewrote it so the
person answers you, and argued with Gold about whether he should. Both positions shipped: Little
Computer People is watched more than played, and The Sims, fifteen years later, is played.

This is the [Apple ][+](https://en.wikipedia.org/wiki/Apple_II_Plus) version, running on the
cabinet's own Apple emulator. How the page makes it easy to play, and why, is in
[Upcycling Little Computer People](../UPCYCLING-LCP.md).

## One of the roots of The Sims

[Will Wright](../../../characters/will-wright/README.md), who designed
[The Sims](https://en.wikipedia.org/wiki/The_Sims_(video_game)), has said he played Little
Computer People, and that Rich Gold gave him feedback while he was making The Sims. A person with
needs and moods, living in a house you look into from the side, getting on with life whether you
help or not: that is where The Sims starts. Crane's own view is more modest: he says he took "the
first baby steps toward the simulation genre" when he made the person interactive. Both are in
[Wikipedia's history of the game](https://en.wikipedia.org/wiki/Little_Computer_People), with
their sources.

The sequel never came. Producer Sam Nelson prototyped an apartment building of Little Computer
People, where you would watch the people meet and look after several homes at once, and it was
dropped ([the Little Computer People show](../../../repo-shows/little-computer-people/README.md)).

## Moving him to Soul City

Little Computer People is one of the first bridges for
[Soul City](../../../catalogs/soul-city/README.md), where a character from one game can move to
another and back ([soul bridges](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-BRIDGES.md)).
Each house keeps its person in 256 bytes that the disk drive rewrote as he lived. On this Apple
disk the record is on the House side. Press **Read from Disk** under the screen once he is home,
and the page shows him as a character file you can download: his name, his researcher (you), the
day he moved in, how many sessions you have spent with him, and the rest of the record as hex,
which nobody has decoded yet ([lcp.ts](../src/apple2/lcp.ts)).

Three people are already living on floppies here. Rob, Ivan and Fritz were born on Commodore 64
copies of the game ([their houses](../worlds/little-computer-people/README.md)), and the house
number each copy made gives the Apple the same name, so each has his own Apple Guestbook and
House sides. Press **Visit Rob**, **Visit Ivan** or **Visit Fritz** to boot one. The guestbook
skips the name, since you have signed it before, and he walks in the front door. Only the names
came over from the Commodore; each moved into his Apple house fresh.

His first new home outside the game is meant to be [Tiny Life](https://tinylifegame.com/), by
[Ell](../../../characters/ellpeck/README.md), where he would have neighbors for the first time.

## The screen angel

Under the screen, the **screen angel** watches what the Apple shows and tells you what the game
wants. When the game asks for something typed, it asks you in a field on the page instead, says
it aloud, and types your answer into the Apple with the Return. While it asks, the Apple's own
keyboard is off, so nothing you type goes astray. The moves under the screen are only the ones
that work at that moment. Untick **Screen angel** to do it all yourself on the Apple keyboard,
with every move shown; untick **Speak** to keep it quiet. How it sees the screen is in
[The screen angel](../UPCYCLING-LCP.md#the-screen-angel).

## Moving in

1. **Turn the disk over.** The game boots the Guestbook side and says *Please turn over
   HOUSE-ON-A-DISK and press a key*. The screen angel does it for you: it puts the House side in
   the [Disk II](https://en.wikipedia.org/wiki/Disk_II) drive and presses the key, as you would
   have done with the floppy. Without the angel, press **Turn the Disk Over** under the screen.
2. **Sign the guestbook.** It asks for the *name of the researcher*, first name then last: that
   is you. Type it in the field and press OK. Then the date, already filled in with today, as
   MM/DD/YY. Without the angel, click the screen so the keys go to the Apple, type the name and
   press Return, then the date with zeros in front (11/03/86) and Return.
3. **Wait for him.** The house is empty. He is shy: it can take several minutes before he dares
   to step inside. Then he inspects every room for five to ten minutes, leaves to fetch his
   belongings, and comes back with his suitcase and, usually, his dog.

**The keyboard does nothing until he has moved in.** That is the game, not the emulator: the
manual says keyboard commands do not work during the move-in. The screen angel runs the Apple
at max while he moves in and presses Return now and then. When the game starts listening, Return
opens its input line, a white bar across the top of the screen; then he is home, and the angel
puts the Apple back to 1×. The wait takes seconds, not minutes
([benchmarks](../BENCHMARKS.md#apple-)). Without the angel, press **max** under the
screen, and **1×** once he is home. He only has to move in once: after that he is there every
time you boot the disk.

## Being a good host

Once he is home, the screen angel shows a button for each of these. You don't need to type them,
just press the buttons. On the Apple itself you would hold **Control** while you press a letter:

| Keys | What happens |
|---|---|
| Control-F | food is delivered to his front door |
| Control-W | about a glass of water goes into his water tank |
| Control-D | dog food at the front door; he feeds the dog |
| Control-A | the alarm clock rings, to wake him |
| Control-C | the phone rings; most like a call, unless you keep interrupting them |
| Control-P | he goes to his easy chair, and you pat him |
| Control-R | a record for his stereo |
| Control-B | a book |

Keep an eye on his food and water: hungry or thirsty for too long, he turns green and lies in
bed. He would rather not sleep too much; he would rather have your attention.

**Talk to him.** Type a sentence in the screen angel's *Say something to him* field and press OK,
press one of the request buttons, or click a request under the field to fill it in. He has manners and likes yours, so say
*please*:

- PLEASE PLAY THE PIANO
- PLEASE PLAY ANOTHER SONG
- PLEASE BUILD A FIRE
- PLEASE DANCE
- PLEASE TYPE A LETTER TO ME
- PLEASE PLAY WITH ME

He will not always do it. He is busy with his own life, and his mood decides: when he is happy
he is willing, when he is sad or sick he is not. Give him what he needs first, then ask again,
and try other ways of asking. When he wants to play he knocks on the glass and shows a list of
games; type the number of the one you want.

## Keeping your house

He lives on the House side, and the game writes his life back to it as he goes. **Save disk**
under the screen downloads the disk in the selected drive as it is now, with him on it. Insert it
again with **Insert file…** to pick up where you left off.

## Going deeper

- [Upcycling Little Computer People](../UPCYCLING-LCP.md): why the page does what it does, and
  the pieces it took: the Korz Apple emulator, the screen angel, the buttons and this guide.
- [The cabinet manifesto](../MANIFESTO.md#tribute-accessibility-and-fun-beat-realism): tribute,
  accessibility and fun beat realism.
- [microM8](https://paleotronic.com/software/microm8/), April and Melody Ayres-Griffiths's Apple ][
  emulator, whose word for this is "upcycling"; it is also in the emulator menu under the screen.
- [The Little Computer People show](../../../repo-shows/little-computer-people/README.md): reading
  the first computer person off a 1985 floppy and giving him neighbors, by moving him into
  [Tiny Life](https://tinylifegame.com/).
- [What a house remembers](../worlds/little-computer-people/README.md): the house number and the
  256-byte research record on the Commodore 64 disks, and where the Apple disks keep the same
  things.
- [David Crane](../../../characters/david-crane/README.md) and
  [Rich Gold](../../../characters/rich-gold/README.md), the two people who made it.
- [The manual](https://www.lemon64.com/doc/little-computer-people/353), from the Commodore 64
  edition: the research project's letter of introduction, the moods, and the card games.
- [4am's crack and the list of 256 names](https://archive.org/details/LittleComputerPeople4amCrack),
  the disk this cabinet runs.
