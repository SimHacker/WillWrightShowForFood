# Siegel's Sun interview + the mousee art project — Don to magi@sun.com (11 Apr 1990)

Don, just back from CHI'90 (Seattle — the **"Empowered" performance**, pie
menus + NeWS), writes to an artist friend at Sun (magi@sun.com — identity
not yet resolved in this archive) about two things that both became
history: Josh Siegel's job interview at Sun, and the motion-history
drawing project behind the "mousee" program.

## Why this matters

- **The recruitment coda to the LGATE chain.** "Josh Siegel is going to be
  out at Sun interviewing for a job in a few days. He used to work at Los
  Alamos doing all kinds of nifty NeWS hacking. He wrote an SDI simulator
  front end, a 'conventional' warfare simulator front end… **James Gosling
  set up the interview**… Please talk to him and tell him about the
  **peaceful things** he could be doing at Sun!!" — the receipt for the
  moment behind the HN retelling "Sun was lucky to steal him away from
  LANL" ([zork-troll-flag-adventure-lineage-hn.md](zork-troll-flag-adventure-lineage-hn.md)).
  Fifth document in the LGATE chain, and independent confirmation of both
  LANL front ends (SDI + conventional warfare) in Don's own 1990 words.
- **mousee ↔ Empowered, tied on paper.** "If you've seen the 'mousee'
  program that I used for the **Empowered performance** to show what I'm
  doing with the mouse…" — the demo-visualization program whose later
  misreading ("mousy") the marking-menu crew used to justify their novelty
  claim (see [kurtenbach-marking-menu-demo-video-straw-man.md](kurtenbach-marking-menu-demo-video-straw-man.md)
  and [2018-05-14-plaisant-mouse-ahead-memory.md](2018-05-14-plaisant-mouse-ahead-memory.md)).
  Here is what mousee actually was, in 1990: trail where the mouse moves,
  marks where it clicks, colored circles where menus pop up, and the
  white-outline occlusion trick so crossings show which stroke came first.
- **Provenance: Hubley's CFP + mail.** Craig Hubley's [1989 performer search](1989-05-25-hubley-chi90-interactive-performers-cfp/README.md)
  cited Don's pie-menu virtuoso act; [Aug–Sep 1989 email](1989-05-25-hubley-chi90-interactive-performers-cfp/correspondence.md)
  confirms CHI'88 demo and commissions the CHI'90 **Empowered** repeat.
- **A proto interaction-history visualization manifesto.** The art project:
  draw state changes over time as a static picture — no-op the root paint
  routine so dragged windows leave streaks of intermediate positions;
  iterate between hand drawings and implementations; drive it with
  something non-deterministic ("playing a multi-user mouse driven video
  game… while running mousee"). Paper-first, computer-second, then back.
- **Open question**: who is magi@sun.com? The photographing / xeroxing /
  colored-pencils-on-Sun-prints art practice described should identify
  them.

## The email, verbatim

```
From: don (Don Hopkins)
Subject: Hi!
Date: 11 April 1990 at 05:44:09 GMT+2
To: magi@sun.com

Hello! I made it back from CHI! That conference was a blast!! How are
things for you? 

Josh Siegel is going to be out at Sun interviewing for a job in a few
days. He used to work at Los Alamos doing all kinds of nifty NeWS
hacking. He wrote an SDI simulator front end, a "conventional" warfare
simulator front end, and a bunch of other stuff that looks really nice
and does lots of things you can only do in NeWS. Please talk to him
and tell him about the peaceful things he could be doing at Sun!!
James Gosling set up the interview and he'll be there for a couple of
days I think.

I meant to ask what sort of pictures you were making with the Sun,
that you were photographing, xeroxing, and drawing on with colored
pencils? Do you have more control over the image that gets on paper
that way (photographing and xeroxing the prints, rather than printing
a screen dump)? Or is it because you want it on high quality acid free
paper? Do you make collages, realistic or abstract images, or what?

I've got an art project (which I made up) that involves experimenting
with ways to draw things in motion, such as stuff on the screen
changing state, moving around, opening, closing, etc. If you've seen
the "mousee" program that I used for the Empowered performance to show
what I'm doing with the mouse, that's kind of the idea. It leaves a
trail wherever the mouse is moved, marks where it's clicked, and draws
colored circles where menus pop up.  The trail and the marks are black
lines and gray dots, but it draws a slightly thicker white line or dot
before drawing them, so when they cross or overlap you can see which
came first by which one breaks the other. I want to experiment with
other ways of drawing things that change state over time, on paper
first, then trying to implement them on the computer. When things
change on the screen their old images are erased. I want to come up
with ways to draw changing images that result in a static picture,
showing the history of the motion, the way "mousee" shows everywhere
you've moved the mouse, but more generally for other stuff as well.
One example would be to no-op out the root paint routine so when you
drag windows around they leave streaks of their intermediate
positions. But the goal is to make an interesting drawing by hand, and
then implement that on the computer, see how the two compare, and then
maybe iterate back and forth between a new drawing and a new
implementation. Then come up with something non-deterministic to do
that drives the state changes, and produce a drawing from that. (like
playing a multi-user mouse driven video game mouse while running
mousee, or something). The ideas are still congealing, and the goal
may change, but I'm sure I'll come up with something weird. I'll show
you when I'm done.

	-Don
```

↑ [Sources index](README.md) · [Josh Siegel's room](../../josh-siegel/README.md) · [LGATE receipt (1988)](1988-09-14-sug-southwest-lgate-sdi-news.md) · [Heinz Lemke constellation](../../../https://github.com/SimHacker/DonHopkins/blob/main/characters/don-hopkins/correspondence/attachments/heinz-lemke/lemke-constellation.yml) (CHI'90 "Empowered" note) · [Don's room](../README.md)
