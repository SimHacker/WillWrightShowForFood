# SimCity for OLPC — introducing the players

*20 December 2006 — John Gilmore introduces the cast; Chuck Normann replies.*

## 1 · John Gilmore → Jim Gettys (wide cc)

**Date:** 20 December 2006, 00:31 GMT+1  
**Subject:** SimCity for OLPC — introducing the players  
**To:** jg@laptop.org  
**Cc:** Mitch Bradley, Walter Bender, Don Hopkins, Charles Normann (EA), Doreen Nelson

I've cc'd all the relevant parties (and a few more).

Jim Getty \<jg@laptop.org\>, VP of Software Engineering, said:

> I forwarded your mail to Walter when I got it; Walter is traveling, and by his parsimonious mail it is clear he's not in communications much of the time.

Thanks! Walter Bender \<walter@media.mit.edu\>, OLPC President, Software and Content, responded today from Dubai to Mitch's copy of my message, and he'd be very happy to see SimCity ship on the OLPC:

> This somehow slipped through through the cracks. It would of course be great to have Sim City on the laptop. (I actually always preferred the earlier versions myself, so that should make it easier. The only challenge is getting it into shape for Linux. That will take some work from someone, but I am certain we could get someone in the community interested. I am in Dubai en route to Islamabad. Back just before Christmas. What is the best way to follow up?

**Don Hopkins** \<dhopkins@donhopkins.com\>, consultant, is the author of the SimCity Unix port, confidante of Will Wright who founded Maxis, and an old friend of mine. He's been hacking this code since the 1980s. He's pushing the SimCity for OLPC project along, both technically and otherwise. A few weeks ago he unearthed the source code from his old backup tapes. Then he ported it to FC6. Over the weekend he found the contracts (that Maxis hasn't yet found its own copies of) which provide Maxis with clear title to his port of the software that we're asking them free up. He wants to do the work to prepare it for OLPC.

**Chuck Normann** \<CNormann@ea.com\> is the point man for Electronic Arts, which owns the SimCity code (it bought Maxis many years ago). He's poking around in the EA bureacracy to find out how easy or hard it will be to relicense the code under the GNU General Public License.

**Doreen Nelson** \<doreennelson@earthlink.net\>, Professor of Education at Cal Poly Pomona, wrote the SimCity curriculum guides for Maxis, which we hope can be freed up along with the software. The NY Times called her "one of the thirty most innovative educators in the USA."

I've asked Don to sign up for the OLPC developers' program and to ask Jim for a laptop. Don last ported the user interface to 1-bit and 8-bit Unix framebuffers, using TCL/TK and multiple windows. (Before that, Don made it run on NeWS using the HyperLook toolkit; before that, it was Maxis' Macintosh version of SimCity.) Don already has the code running on FC6, under VMware on his own hardware. It will need some work to run cleanly on the OLPC screen and in Sugar, and to look good in both mono and color modes. Once that's working, he then wants to rip out the TCL scripting and install Python; he's got years of experience in doing just this sort of stuff, and he put TCL into it in the first place. This will make it integrate better with OLPC, reduce its disk and memory footprint, and make it easier for the kids to hack on.

The game today allows multiple players to interact, including text chat and shared overlay "chalk" sketching; but it will also have to get hooked in to the OLPC's chat, proximity and friendship systems.

Don has hacked a lot of great software over the years; his willingness to write & maintain great free code is only limited by his need to make a living. He's doing consulting to make ends meet. I'm willing to subsidize his work on OLPC SimCity — once Maxis decides whether to free up the code.

John Gilmore

**PS:** When I last saw SimCity on Unix, it also included a nice interactive graphical cellular automata system (just because Don liked it). This fills the screen with beautiful evolving pictures, interactively, using an invisible (pop-up) interface. I hope that can also make it into the OLPC, both for beauty and for the kids to learn from.

**PPS:** Mitch Bradley is cc'd because he's working for OLPC and he also employed Don many years ago at Sun — to plug the FORTH interpreter into a CAD package, as I recall!

---

## 2 · Charles Normann → John Gilmore

**Date:** 20 December 2006, 08:09 GMT+1  
**Subject:** RE: SimCity for OLPC — introducing the players

Thanks for this introduction, John.

To get more specifics about OLPC, who should I contact?

Also, it would be helpful to know, giving the engineering work needing to be done, when we need to have all particulars worked out so that we can make the initial shipment of laptops and/or key publicity dates.

I'm very excited to be working on this and look forward to making it work.

- Chuck
