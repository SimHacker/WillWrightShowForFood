# The Soul of The Sims, by Will Wright

*Submitted by Don Hopkins · Sun, 2008-02-10 21:25*
*Tags: The Sims · C · Game Design · Downloadable Software*
*Source: <http://www.donhopkins.com/drupal/node/79>*
*Also: [Medium mirror](https://medium.com/@donhopkins/the-soul-of-the-sims-by-will-wright-8afdc225c936)*

---

**Macintosh HD:XmotiveHarness:src/Motive.c**  
Tuesday, January 28, 1997 / 9:25 AM

This is the prototype for the soul of The Sims, which Will Wright wrote on January 23, 1997.

I had just started working at the Maxis Core Technology Group on "Project X" aka "Dollhouse", and Will Wright brought this code in one morning, to demonstrate his design for the motives, feedback loop and failure conditions of the simulated people. While going through old papers, I ran across this print-out that I had saved, so I scanned it and cleaned the images up, and got permission from Will to publish it.

This code is an interesting example of game design, programming and prototyping techniques. The Sims code has certainly changed a lot since Will wrote this original prototype code. For example, there is no longer any "stress" motive. And the game doesn't store motives in global variables, of course.

My hope is that this code will give you a glimpse of how Will Wright designs games, and what was going on in his head at the time!

## Scanned source code

Will's January 1997 `Motive.c` prototype was scanned from Don's saved printout. Page images live on [donhopkins.com](https://www.donhopkins.com/home/images/Sims/) (linked from the original Drupal post). **TODO:** OCR and embed those pages here as a companion `motive-c/` gallery.

## Related

- [1996 Winograd talk — Dollhouse preview](../../1996-04-26-winograd-interfacing-to-microworlds/medium-article.md)
- [Chris Trottier — "toilet game" until tuning](../../2004-02-21-chris-trottier-tuned-emergence/article.md)
- [Rock Paper Shotgun, 2008](https://www.rockpapershotgun.com/2008/02/20/the-soul-of-the-sims/) — press coverage when Don published the scan
