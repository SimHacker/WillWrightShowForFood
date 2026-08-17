# SimRadio and the Moody Track — the February 1999 Maxis email

*Primary source. On February 18, 1999 — a year before The Sims shipped
and almost four years before The Sims Online — Don proposed live
internet radio streaming into The Sims, with interactive call-in
contests Sims could enter, in-game object delivery as prizes, and
music "encoded with a moody track, marked up with events that affected
people emotionally." The email survived in the Stupid Fun Club mailing
list archive: Don forwarded it to the clublist on March 11, 2011.*

*The design it seeds is now written up as
[MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md)
in the MOOLLM designs — mood as multimedia (multimoodia), parameter
tracks of semantic heat, rooms inheriting emotional weather from
playing media, time-windowed broadcast ads as buffs with expiration
dates.*

## The email, in full

> From: Hopkins, Don [mailto:Hopkins, Don]
> Sent: Thursday, February 18, 1999 5:06 PM
> To: MAXIS CTG @ Maxis
> Subject: Live SimRadio on the net
>
> I've been thinking about how we could enhance the game with music, by
> putting a real "SimRadio" into the game that receives live audio
> broadcasts from the internet.
>
> Maxis could run several "SimRadioStation" servers that broadcast MP3
> music and SimDJ dialog, much like the simulated radio in many games,
> but run on a server and efficiently broadcast as MP3 via IP
> multicasting.  The technology is in place for us to create our own
> internet radio and tv stations, and it would be easy to integrate a
> receiver into the game.
>
> It would solve the problem of repeated music loops driving players
> insane, and it would be a wonderful advertising and distribution
> channel for plug-in objects, and other Maxis and EA products!
>
> The interesting twist, is that the radio stations could take requests,
> and have real time interactive call-in contests, just like real radio
> stations!  But the contest players would be the Sims in the game
> (acting autonomously or under control of the player), who would have
> to run to the phone and try to be the 20'th caller when they hear a
> song by the Beatles, and lots of other stuff like that!
>
> They could actually win SimPrizes like virtual money, furniture,
> personal growth, interesting visitors ("dinner with Elvis!"), or
> unique decorative items (like a Jim Morrison or Kermit the Frog
> poster).  Or even real Maxis products: "Win a trip to the big
> SimCity!" "The first person to answer this trivia question goes to
> Mars!"  Think of it like a game show, where the show is actually an
> entertaining advertisement for the prizes!  The possibilities for
> advertising and product placement are limitless so I won't even go
> into them...
>
> This would put the game "online", since you would actually be
> listening to a broadcast and competing against other people at the
> same time, just like a real radio station!  The best thing is that it
> would not require any major changes to the design of the game or the
> code.  The technology to implement it is well understood, in fact
> everybody else is jumping onto the internet radio bandwagon these
> days, but nobody's integrated it into a game like this, that I've ever
> heard of.
>
> One big advantage to going online this way is that it's a great way to
> gently enforce product registration.  (I'm pointing this out in light
> of Larry Probst's recent message about software piracy.)  You could
> only participate in the contests if your copy of The Sims was
> registered.  Perhaps the demo version would only pick up free
> broadcast radio and TV stations with lots of ads, but when you
> registered it, you get "cable TV" and "digital radio", with lots of
> good music and contests and prizes.
>
> The radio station would be a great "in-game" way to advertise and
> distribute new plug-in objects as prizes and products!  Instead of
> going out of the game and using an unwieldy FTP client to download a
> file, registered players could respond to contests and advertisements
> on live radio and TV, to seamlessly download and install new objects,
> and have them delivered to the front door.
>
> The music from the radio station could be encoded with a "moody
> track", marked up with events that affected people emotionally.  Of
> course different people would react to the musical moods in different
> ways, but you would actually be able to increase a character's
> happiness by calling up the radio station and requesting their
> favorite song.  Or turn an unruly crowd into a wild party by turning
> off the cop show on TV, and switching on the radio to a dance music
> station.

*(Forwarded by Don to the Stupid Fun Club clublist, March 11, 2011:
"Found another old email about 'SimRadio' and 'Moody'! -Don")*

## What's in there, unpacked

Eight ideas in one afternoon email, most of which later became
somebody's business model:

1. **Live streaming into a game world** (SimRadio, SimRadioStation
   servers, SimDJ dialog, MP3 over IP multicast) — the
   concert-in-Fortnite / live-ops pattern, February 1999.
2. **Kill the loop insanity** — replace repeated music loops with a
   live feed. Every player of every 1999 game knows exactly the insanity
   being solved.
3. **Time-windowed interactive contests** — "run to the phone and try
   to be the 20th caller when they hear a song by the Beatles." An
   advertisement with an expiration window that autonomous or directed
   Sims can respond to. In MOOLLM terms: a **buff with an expiration
   date** shouting into the room's advertisement auction
   ([GAME-PIECES](https://github.com/SimHacker/moollm/blob/main/designs/GAME-PIECES.md)).
4. **The show is an advertisement for the prizes** — the game-show
   frame makes advertising native content instead of interruption.
5. **In-game content delivery** — win a plug-in object on air and it's
   "delivered to the front door," seamless download instead of an
   unwieldy FTP client. Object distribution as diegetic event: DLC
   with a doorbell, before the term DLC existed.
6. **Registration as carrot, not stick** — demo copies get free
   ad-heavy broadcast; registered copies get "cable TV" and "digital
   radio" with the contests and prizes. Anti-piracy by making the
   legitimate copy *more alive*, pitched the week of a Larry Probst
   piracy memo.
7. **"This would put the game online"** — listening to the same
   broadcast and competing in the same time window as other players,
   with **no major changes to the game's design or code**. The Sims
   Online energy, four years early, at a fraction of the cost.
8. **The moody track** — music "encoded with a 'moody track', marked
   up with events that affected people emotionally," with
   **per-person reaction** ("different people would react to the
   musical moods in different ways" — heat filtered through
   personality, not applied raw). Request a Sim's favorite song to
   raise their happiness; turn off the cop show and switch on the
   dance station to turn an unruly crowd into a wild party. The DJ as
   behavior engine input.

## Where it went

Nowhere, then. The full accounting — opportunity cost, technology
timing, EA's conservatism with the flagship, and where the
live-broadcast-into-synthetic-worlds economy went instead — is in
[MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md),
which generalizes the moody track into MOOLLM's ambient-context
design: parameter tracks of `(time, tag, heat)` envelopes, rooms
inheriting emotional weather from playing media, advertisement
auctions re-weighted by the room's current tags, and the LLM as the
meaning knob that can finally infer the track by listening to the
lyrics.

## On-air hooks

- Read the 20th-caller paragraph aloud, then show a Fortnite concert.
- The Kermit poster and "dinner with Elvis!" — the prize economy as
  proto-live-ops, with 1999 licensing optimism intact.
- "Turn an unruly crowd into a wild party" — the moody track as the
  first draft of mood-as-multimedia, and the door into the MOODY
  design's two knobs: volume and meaning, separately mixable.
