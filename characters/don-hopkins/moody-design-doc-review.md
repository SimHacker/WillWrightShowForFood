# Moody in the margins — the design document review

*Primary source. Before the February 1999 SimRadio email, Don wrote
the moody idea into his review of **The Sims Design Document Draft
3** — undated, late 1990s, from the era when he still confused
"effect" and "affect" (his words). The review text survived because
Don quoted it in full in a July 2019 email to Sims composer [Jerry
Martin](https://www.jerrymartinmusic.com/), planning the game's 20th
anniversary. Don's own 2019 framing: the SimRadio email was written
"applying that idea to an online internet radio" — so this is the
seed, and the [1999 email](simradio-moody-1999-maxis-email.md) is
its first application.*

*The design both documents seed is written up as
[MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md).*

## The review text, in full

From Don's review of The Sims Design Document Draft 3, as quoted in
his email to Jerry Martin, July 12–13, 2019:

> I have some ideas about how the music could effect the game, that I
> will write up more completely later.
>
> In a nutshell, the people in the house could have a cd or record
> collection to choose from, each record an object that has the sound
> (audio wave and/or midi) and a "moody" track synchronized with the
> music.
>
> Playing the music also plays the moods into the environment that
> the people pick up on.
>
> Music can subtly effect how people react to the environment,
> objects, and each other.
>
> It can effect their motives and even their skills temporarily.
>
> For example, you might be able to clean the house better and faster
> if you put on some up temp bouncy music.
>
> The player should be able to assume the role of disc jocky on the
> radio, and play from another larger library of music and
> commercials, that effect the peoples moods and buying habits.
>
> The TV of course is another source of mood altering temporal media,
> with commercials and shows that should effect different people
> differently. But the most important part of this idea is instead of
> the game effecting the music that's played, the music effects how
> the game plays!
>
> The ultimate way for the user to effect the game via music, is to
> insert one of their own CD's into their real computer's CDROM
> drive, and the game would recognize it, and start playing it (maybe
> with a simple cd player interface to select the song).
>
> There could be a database associating the unique ID number of the
> CD with a table of contents and "moody" tracks that tell how the
> song effects the peoples emotions over time, with "percussion"
> events at dramatic moments of the music that can trigger arbitrary
> events in the game (like provoking a fight that was brewing, or
> triggering an orgasm at just the right place in the song).
>
> We hire monkeys to listen to well known CD's, and enter time
> synchronized tracks with semantic meanings in Max (like note
> tracks, and user defined numeric tracks) or some other timeline
> editing tool).
>
> Put the database up on the web for instant retrieval, so when
> somebody sticks in a new CD, it downloads our "moody" tracks that
> go with it, and it starts playing and effecting their game!
>
> Streaming emotions over the net!
>
> Eventually there should be an end-user tool so people can record
> their own responses to music as moody tracks they can use in our
> games.
>
> This mechanism could be used in all kinds of games, to varying
> degrees of effect.
>
> I'm not saying that music should be the only way to control the
> game – it's more like a subtle background effect, but there
> certainly could be a scenario where you try to accomplish some task
> (like taming a wild beast) by using only your musical taste and
> timing. The real bottom line benefit is that you get to listen to
> your OWN cd collection of music you want to hear, instead of being
> driven crazy by the repetitive music bundled with the game.

## What the review has that the 1999 email doesn't

The SimRadio email put moody on a broadcast; the review had already
put it on the player's own shelf. Ideas unique to this text:

- **Your own CD collection as the content library.** Insert a real
  CD into the real CD-ROM drive; the game recognizes the disc ID and
  starts playing it. The moody tracks come from **a web database
  keyed by the CD's unique ID** — exactly the CDDB/Gracenote
  mechanism, shipping *meaning* instead of track titles. "Streaming
  emotions over the net!" is a content-delivery network for feelings,
  proposed when CDDB itself was only a couple of years old.
- **Percussion events.** Beyond the continuous envelopes: discrete
  marks at dramatic moments that can **trigger arbitrary game
  events** — provoke the fight that was brewing, time the orgasm to
  the crescendo. This is the spike channel and the event channel of
  [MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md)
  in one sentence, decades early.
- **The inversion, stated as the thesis.** "Instead of the game
  effecting the music that's played, the music effects how the game
  plays!" Adaptive game scores were already a known art; music as an
  *input device* was the new direction.
- **Player as DJ.** A larger library of music **and commercials**
  affecting "moods and buying habits" — the player takes the
  broadcast seat that the 1999 email later gave to a live SimDJ.
- **Skills, not just moods.** Up-tempo bouncy music makes you clean
  the house better and faster — a moody tag wired to a *skill*
  parameter, the ancestor of the constraints-and-buffs section of
  MOODY.md.
- **The end-user authoring tool.** "People can record their own
  responses to music as moody tracks they can use in our games" —
  the write path. Personal overlays, proposed as a product feature.
- **Annotation labor, priced honestly.** "We hire monkeys to listen
  to well known CD's" and mark them up in Max. That army is the cost
  that kept moody unshipped for two decades; the universal decoder
  that finally replaces it (an LLM that listens to the lyrics and
  reads the scene) is what makes the design current.
- **Gameplay by playlist.** Taming a wild beast using only your
  musical taste and timing — a whole game genre in a parenthesis.

## The 2019 thread: MIDI with a MOOD track

The email carrying the review was part of a thread with Jerry Martin
about doing something fun for The Sims' 20th anniversary — Twitch
streams with the people who built the game, and a **custom jukebox**
programmed in SimAntics so Jerry could play any piece on demand
in-game ("so we would not be at the mercy of the game's opinion of
what to play when"). That jukebox plan is now sketched seriously in
MOODY.md's SimAntics jukebox section. Two passages from Don's side
of the thread earn quotation:

> One of the crazy ideas I had while we were developing the game,
> that we never implemented, but we could actually kinda fake with a
> little Sims object programming, would be "MOODIE" music, like
> **MIDI music with a MOOD track!**

The show seed
[Moody: MIDI for Mood](../../repo-shows/moody-midi-for-mood/moody-midi-for-mood.yml)
takes its name from that sentence — the pun was already in the
primary source, waiting.

> When certain songs were playing, and during certain parts and
> events, it could broadcast emotional feelings to everyone in the
> room, increase or ruin your relationships with other sims, make you
> feel happy or sad, energetic or sleepy, social or lonely, or even
> suddenly make everyone need to shit at the same time, like the
> brown note!

The brown note, canonical. (In The Sims it renders as
[the blue note](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md) —
Sims pee blue.)

And the retrospective connection Don drew in the same email:

> In retrospect, it reminds me of the music analysis stuff that
> [Paul Lamere](../paul-lamere/) and his colleagues at
> ["The Echo Nest"](https://en.wikipedia.org/wiki/The_Echo_Nest) was
> working on. (Spotify bought their company eventually.)

The Echo Nest built the industrial version of the monkey army:
machine listening that extracts tempo, energy, danceability,
acousticness, valence — a per-song parameter database serving
meaning over the net to anyone's player. What it never had was the
consumer: a world of simulated people who could *feel* the data.

## Links

- The application: [`simradio-moody-1999-maxis-email.md`](simradio-moody-1999-maxis-email.md)
- The context: [`simradio-radio-on-internet.md`](simradio-radio-on-internet.md)
- The design: [MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md)
- The show seed: [`moody-midi-for-mood.yml`](../../repo-shows/moody-midi-for-mood/moody-midi-for-mood.yml)
- The Echo Nest side: [Paul Lamere](../paul-lamere/)
- Jerry Martin: [jerrymartinmusic.com](https://www.jerrymartinmusic.com/)
- The wedding playset practice sessions the thread mentions:
  [Transmogrify Self](https://www.youtube.com/watch?v=dsTbs7IL5EI) ·
  [Speed Dating With Cupid](https://www.youtube.com/watch?v=YVUP9OXmHTM) ·
  [Simprov Wedding Play Set](https://www.youtube.com/watch?v=Mwt5LJlrMe8)
