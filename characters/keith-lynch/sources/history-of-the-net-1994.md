# History of the Net — Keith F. Lynch (Jul 1994)

**Status:** Public primary source — republished by the author at [keithlynch.net/history.net.html](https://keithlynch.net/history.net.html).

**Date:** Thu, 14 Jul 1994 23:06:34 -0400  
**From:** [Keith F. Lynch](https://keithlynch.net/) `<kfl>`  
**To:** rqh1942@acf4.NYU.EDU (Ronda Hauben net-history inquiry)  
**Subject:** Re: History of the Net is Important  
**Cc:** claird@Starbase.NeoSoft.COM, cstacy@ai.mit.edu, devon@access.digex.net, doug@access.digex.net, [esr@snark.thyrsus.com](https://en.wikipedia.org/wiki/Eric_S._Raymond), igor@petre.odessa.ua, kfl@access.digex.net, [rms@gnu.ai.mit.edu](https://en.wikipedia.org/wiki/Richard_Stallman)

**Hub:** [../README.md](../README.md) · **Author's page:** [keithlynch.net/history.net.html](https://keithlynch.net/history.net.html)

Lynch's disclaimer: *"The following is a product of my fallible memory."*

---

I am CCing this, not just to people who've replied to you, but also to
people whom I mention in this message, so they can correct any mistakes
I may have made.  The following is a product of my fallible memory.

>  What a nice response. And if you have been on the Net 17 years that
>  means you are from pre Usenet days - so I wondered when you got onto
>  Usenet -

Well, originally it was just "The ARPAnet".  In 1977 friends introduced
me to it.  We used a TI Silent 700 terminal.  This was a printing
terminal which used thermal paper and built-in 300 baud acoustic coupled
modem.  One would dial a local "TIP".  For instance there was one at
Mitre, a nearby company.  One would then type @L 134 to connect to host
134, or whatever.  There was no TIP (later TAC) login at that time.
Host numbers were always a single number of up to three digits.  No
dots.  Host names were always short and uppercase, and also had no dots.

A TIP was a machine which did nothing except allow dialup users to
connect to other machines.  Later they were renamed TACs.  There was no
security on them.  Not only was no password needed, but you could issue
commands to other sessions on the TAC!  Everyone was expecting that TAC
login was imminent, but it wasn't installed for a long time.  Not until
1986, I think.

I've heard of guest users being asked not to use a TAC because all its
lines were busy -- who resolved the problem by paying for an extra phone
line and modem to be installed at the TAC!

TACs had some little-known features, for instance a way to link to a
user dialed into another TAC, so you can have a real-time conversation
without connecting to a computer.  This was handy during hours when
guest users weren't allowed to log in on the ITS systems at MIT.  If
you were both good typists, you could disable echo, so that when
either of you typed, only the person not typing saw it.  Which meant
you could both type at the same time without stepping on each other.

A couple times, I would dial into a TAC from a printing terminal at
work, and just leave it dialed in.  Then, from home, I would tell that
TAC port to connect to an ITS machine.  Then, I would get on ITS from
home and link to the newly appeared job, log it in, and have it list
various files, so that they would print out at work for me.

One time I dialed into a TAC from a microcomputer running CP/M at work.
(CP/M was a very simple OS for 8 bit micros, before the 16 bit IBM
PC and MS/DOS came out.  It didn't even support hard disks, or tree
structured directories.)  Then I could connect to it via the net from
home.  I told my net-friends that we had a machine on the net at work.
A machine running CP/M.  I showed them how to connect to it, and they
did so.  This was considered a great lark.  I can't easily convey how
ridiculous the idea of a small machine on the net was in those days.
I think this was in 1981 or 1982, when connection required a government
contract and a refrigerator-sized quarter million dollar IMP.

The most popular machines on the net were the ITS machines at MIT.
There was DM (77), AI (134), ML (198), and MC (236).  DM had Zork on
it.  Zork was a text-only adventure game played in woods, caverns,
dungeons, etc, which contained treasure to be brought back.  (Infocom
later marketed a modified version of Zork for various micros.)  MC had
Macsyma, a program for solving equations.  (Macsyma was later marketed
by Symbolics.)  All machines had Emacs, the screen editor written by
Richard M. Stallman et al, which gave rise to the later commercial Emacs
written and marketed by Gosling, and the GNU Emacs again written by
Richard M. Stallman, who later won a MacArthur foundation quarter
million dollar genius grant for it and for related work.  The ITS Emacs
was the original Emacs, and was written in Teco, a character-based
editing language.

ITS stood for the Incompatible Time-sharing System, an obvious take-off
on CTSS, the Compatible Time Sharing System.  (Just as Unix is a
take-off on the earlier TENEX, TWENEX, and MULTICS.)

All four ITS machines also had UNTALK, a split-screen conferencing
program similar to the later "talk" on Unix and PHONE on VMS.  I was
told it was written by a user whose ITS username was UNCOLA and who
had committed suicide.  I don't know if it was the first program of
that type, but it was the first I had seen.

ITS was a strange operating system.  Commands took effect without one's
needing to type <CR>.  There was a semi-hierarchical file system,
supposedly hacked together in one weekend by David A. Moon.  Files on
other ITS systems were transparently available through the "Chaosnet"
(a predecessor of Ethernet, and probably an inspiration for it) simply
by prefacing the filename with the name of the machine it was on.
Similar ideas later appeared in VMS/DECNET and Unix/NFS.

Eventually (1979?), ITS instituted passwords.  Fortunately for me, they
allowed guest users.  Even without an account, one could get in fairly
easily.  I'll explain how, as it helps give a flavor for the system:

Users who weren't logged in still got a prompt.  They just couldn't do
much with it.  One thing they could do was see who's logged in.  Another
was use the SEND command to send a real-time message to anyone who was
logged in at the time.  Anyhow, when one wasn't logged in, one could use
SEND to send to someone else who wasn't logged in.  The SEND command
would then automatically invoke the MAIL command.  And from within the
mailer one could do <ESC>E to invoke Emacs (just as today in the Unix
mail command, one can do ~e to do the same thing).  And from within
Emacs, one use ^X^V to load DDT (the exec) and ^X^W to write it over
SEND.  Then one aborts out, and invokes SEND a second time.  Only since
SEND had been replaced with a copy of DDT, so you'd be in the exec,
fully logged in.

Unfortunately, the machines (PDP-10s) were usually so heavily loaded
that guests were often restricted to using them after midnight.  During
slack periods, they were allowed on as early as 8 pm.  And sometimes
all day on weekends.

File space was quite restricted.  And guests didn't get personal
directories.  Also, there was no file protection.  Anyone could read
or alter any file on the system.  And anyone could spy on anyone else's
session, and even link to their exec and issue commands to it.  This is
something I really miss in Unix and VMS -- when a user needs assistance
it would be very handy to be able to look over their shoulder and to
type commands for them while they watch, remotely.

Guests were allowed to, and even encouraged to, modify the system.
If people didn't like the modifications, they were taken out again.

Jerry Pournelle, the SF author and computer columnist for Byte had a
guest account.  But he was obnoxious and didn't comport himself as a
proper guest, so his account was removed.  He later wrote a column in
Byte giving false reasons for why his account was removed (e.g. because
he publically supported SDI (Reagan's "Star Wars")).  This was in June
1984, I'm pretty sure.  Al ("Hobbit") ("VAD") Walker, then at Rutgers,
circulated a one page explanation of why POURNE was flushed, consisting
entirely of e-mail messages between POURNE and the ITS system staff, or
among the system staff.  I'm sure I have a copy somewhere.

The ITS convention was that it was ok to read other people's mail.
Eventually, this collided with the net-wide convention that this wasn't
ok, with some unfortunate results, which included at least one divorce,
that of Marty and Nancy Conner, who had married after meeting on the
Bandykin mailing list.

The Bandykin list was originally set up for the friends of Bandy (Andrew
Scott Beals) to console him for the loss of his girlfriend. I think this
was in 1984 or so.  It was alluded to, not by name, in Quarterman and
Hoskins' _Notable Computer Networks_ (CACM, October 1986 -- please don't
try to write a history of the net until you've read this paper).  It
was later renamed to Kin, when Bandy wished to be dissociated from it.
Before dying, it spawned off a number of other lists, including Elbows,
Lectroids, TANSTAAFL, and Info-Frobkin.  That last list gave rise to FTP
Software, a thriving Cambridge firm with which the company I work for
has recently done business.  (FTP Software was presumably named after
the net's File Transfer Protocol, which of course greatly predated it.)

The Kin list died because Marty Conner reserved the right to add anyone
and everyone to the list.  The new lists were constituted without him,
and with strict rules about who could join.

It wasn't until 1981 that I had fairly consistent access from home,
using a borrowed 300 baud modem and H19 terminal.  Prior to that, I had
often gone months or sometimes years between access.  After 1981, I
have never been offline for more than a month.  I missed a month in
1986 due to TAC logins finally being installed.  And another month in
1993, when I was installing computers overseas.  (Ironically, as of
last month those overseas computers are now on the net!)

In 1982 I got my own Heathkit H19 terminal and assembled it.  I used it
until I got a 286 PC in 1986.  I'm still using that PC.  I'm currently
using a 2400 baud modem I borrowed from work 3 years ago.  Prior to
that, I was using my own 1200 baud modem.  Early this year I rescued
a TI Silent 700 terminal from the trash can at a hamfest, mostly just
for old times' sake.  (The TI had been marked $15, but nobody bought it.
They cost about $1000 new in the late 70s.)

In 1986, I started using a service called PC Pursuit.  It allowed one to
make off-hours long distance computer calls to about 30 cities in the
US, including Boston.  I used it not just to get onto ITS, but also onto
various BBS systems around the country.

In 1986, 1987, 1989, 1989 again, and 1990, I visited MIT in person.

In May 1990, the last ITS machine was shut down.  But I also had guest
accounts on Unix systems at MIT by then.  It was one of those on which I
first used Usenet newsgroups, perhaps in 1987 or so.  Previously, most
of my activity had been reading and posting to mailing lists, having
real-time chats, and downloading various text files.  I recall one
four-way real-time chat which included people in Virginia, Norway, the
Philippines, and Missouri.

In 1991 I switched from using a Unix system at MIT to using Digex, a
Unix system in Maryland, a local call from here.  Not long after, I
dropped PC Pursuit.  PC Pursuit was nice at first, but they changed from
allowing unlimited off-hours usage to one hour a day, while increasing
their rates from $20 a month to $30 a month.  Also, their local number
was busy most of the time, and connections were sluggish, and frequently
punctuated with the notorious "** POSSIBLE DATA LOSS 00 55 **" which
invariably meant several pagefulls had been discarded.  I probably would
have dropped it anyhow, as there were only two long distance BBSs I
called regularly, and one had shut down, while the other had moved
out of a PC Pursuitable area (and has since shut down).

Digex was founded, and is headed by, Doug Humphrey, whom I first met in
person at a convention called WATS-80 which he hosted in Washington DC
in 1980.  Oddly, instead of using his real name there, he called himself
"Aubrey Philipsz" after a character in James Hogan's 1978 novel _The
Genesis Machine_.  I may have met him online earlier.  He was DIGEX on
the ITS machines.  In those days, he had a large DEC-10 in his small
apartment.  He had bought it for scrap prices.  He used to wear the key
to it around his neck as jewelry.

In 1989 he had an ITS system in his apartment, which was only one of two
not at MIT (the other was in Scandinavia somewhere).  I don't think he
still has it.  (I wonder if there's a law against killing an endangered
operating system.)

I remember his mentioning ARPAnet, and how easy it was to get onto
it, during a talk he gave at WATS-80 in 1980.  The implication was that
we were all unauthorized users, but that nobody really minded -- yet.

I don't think Usenet was mentioned at that convention.

WATS-80 was mentioned in the Washington Post.  I'm sure I still have
the newspaper clipping somewhere.  (I always save everything forever,
but often have a hard time finding it later, since it's mixed in with
everything else I've saved.)

As you can see from my header, I'm still on Digex.  It's grown a lot
since I first logged on here.  From a SUN-3 with an "MX record" (not
directly on the net) with about 1000 newsgroups, to several large SUN-4s
linked to the Internet backbone with a T1 line, carrying about 9000
newsgroups.

I still have an account on a Unix machine at MIT, too, which I can
telnet into, but I seldom use it.

>  one of the questions I am most interested in sorting out is the one
>  you ask below "What was the degree of Usenet/Internet overlap at
>  various times"?

That's hard to answer.  I can give you my impressions.  ITS was never
part of Usenet.  The idea of a newsgroup is a fairly obvious one, given
mailing lists.  I recall commenting in 1979 or 1980, that it was silly
to mail a copy of the same thing seperately to lots of people on the
same machine, rather than mailing a pointer to it, and having one copy
in a common area.  In fact, the SF-Lovers digest was set up that way for
some users for a while in 1980 -- instead of being mailed the digest,
they had the option of being mailed a notification that there's a
new digest, so they can read it from the online archives.  This was
discontinued after a year or two, probably because it was only practical
when most readers were on ITS, which is where the list originated.
Almost all mailing lists originated from ITS, since it had the most
advanced mailer software.

Rich Zellich maintained a "list of lists" which could be FTPd from
SRI-NIC.ARPA.  For all I know, he still does.  But it was hopelessly
out of date by 1983 or so, as there was no formal procedures for
information on new lists, or on changes in old lists, to be conveyed
to him.

I gradually became aware of Usenet via references in SF-Lovers, Human-
Nets and other mailing lists.  It became clear that some people didn't
see something called the "SF-Lovers Digest," but instead read something
called "fa.sf-lovers".  I became aware of what newsgroups were, and that
they all began with "net." except the ones which were aliased to an
ARPAnet mailing list, which began with "fa.".  Nothing began with alt.
or misc. or rec. or sci. or soc. in those days.

Speaking of SF-Lovers, Brad Templeton put the first few years of
archives (starting in 1979) on a CD-rom last year, along with lots
of recent SF novels and short stories.  My brother has a copy.  It's
easy to scan these archives, unlike my personal archives which are on
thousands of five inch diskettes, mostly unlabelled, in no particular
order.  It was fun to see my own postings, older than some current net
users, now immortalized in plastic and tinfoil.

(I just checked that disc, and found that the first mention of
fa.sf-lovers in the SF-Lovers digest was in August 1982, in a message
which also mentions net.sf-lovers.  I don't know if those were two
different newsgroups.  I can forward that message to you if you like.)

Actually, SF-Lovers didn't begin in 1979.  It had an earlier
incarnation, whose archives apparently haven't been preserved anywhere.
It was shut down after Senator William Proxmire gave the ARPAnet his
golden fleece award for wasting taxpayers' money, citing SF-Lovers and
the wine lovers mailing lists as examples.  (I don't know when this was,
but it should be easy to look up.)  The wine lovers mailing list never
came back.

Usenet people also participated in mailing lists.  They always had
addresses in the form foo!bar!baz!zoo!yar!yaz where foo and yaz were
the starting and ending points, or perhaps the other way around.
ARPAnet addresses were always in the form FOO@BAR, or if they were on
some kind of subnet FOO%BAR@BAZ.  Traffic which had traversed the nets
would look like foo!bar!baz%ZOO@YAR.  It wasn't always clear which way
to parse this.

I definitely had the impression that ARPAnet (later, Internet) and
Usenet were two very different things, and that mail got from one to the
other only because one or two machines happened to be on both networks.
These gateway machines which were on both networks kept changing,
presumably because once word got out that one was acting as a gateway,
it quickly became overloaded, and soon refused to act as a gateway
anymore.

My impression (which may have been wrong) was that the Usenet mailing
lists were completely different from the ARPAnet mailing lists, although
some adventurous Usenetters were subscribed to the latter via a gateway.

There was a Usenet map file, consisting of several pages of ASCII line
drawings meant to be connected together, which showed all the systems
on the Usenet, and which ones talked (via uucp) to which other ones.
I may still have a hardcopy of this somewhere.  I recall that only one
or two machines on the map was also an Internet host.  But it was hard
to tell, since a host's Usenet name and Internet name could be (and
usually were) completely different.

Today, I have the impression that Internet and Usenet are essentially
the same thing.  And that the overwhelming majority of newsgroup traffic
flows via TCP/IP over the Internet, rather than via uucp over dialup
modems.  Trying to seperate them today seems about as productive as
distinguishing the Angles from the Saxons today.

I recall that Usenet users were considered somehow lower class.  For
instance there was a message on the Bandykin list suggesting that Usenet
people be banned from the list.  I wrote a reply, replacing "Usenet"
with "black", and "Internet" with "white," showing that "netism" (as I
then named it) is as bad as racism.  (I'm sure I still have a copy of
these messages.)

Today, on some newsgroups there's similar, but lesser, netism toward
AOL, Delphi, and/or Fidonet users.

>  And I would love to know about the 1980 Arpanet crash - that's just
>  after Usenet started (when in 1980 was the crash?)

October?  I don't recall the cause, except that it came as an enormous
surprise, as the ARPAnet was supposed to be crash-proof.  Some kind of
self-propagating host table update had a bug in it, I think.  It was
definitely an accident, not malicious, not an attempt to crash anything.

>  Have you seen any of the history work that I've done on Usenet and
>  Arpanet history?

I don't think so.  Not until the past year have I noticed lots of books
being available, describing what the net is like now, and how to do
things with it.  It makes sense that such books would appear before
books that describe how it came to be that way, and what it was like
earlier, the latter being of lesser immediate practical use.

The net's history is very small, measured in person-years.  Perhaps 50
million?  Compared to about 20 billion person-years of US history, and
a similar number of person-years for the Roman Empire, that isn't very
much.  Thus one might expect one net history book for every 400 US
history books.

>  ... and when it is often written about, the details are often wrong
>  (when it is written about by the press, etc.)

I've noticed that the press tends to be quite accurate, except when
they're writing on a subject I know something about. :-)

Concerning quoting styles, the ARPAnet style was to indent the text
being quoted, the Usenet style (which I've long since adopted) was
to quote messages with a > character at the beginning of each quoted
line, and the Fidonet style was to quote messages with the person's
initials followed by a > character at the beginning of each quoted line.
All three styles are now found on all three nets, as are various other
styles, many of them nearly unreadable.

Often, the > is replaced by some other character such as |, probably to
get around software that puts limits on quoted text.

The earliest mailing list I'm aware of is MSGGROUP, a list for
discussing e-mail and related issues.  I've recently seen some online
archives of it dating back to 1975, and I downloaded the earliest parts
of it as a souvenir.

The first digestified mailing lists were SF-Lovers and Human-Nets, which
became digestified in January 1980, because the daily volume became too
great for the ITS mailer to handle overnight.  With digestification
came de facto moderation, since there was no automatic software for
digestification.  These may have been the first mailing lists to
be moderated.

The first *automatic* digestification, at least among the lists I read
at the time, was on the Space Digest.  I remember being very surprised
by it.  This was probably around 1982.

I think I first saw smileys in 1981 or 1982.  The original one was :-).

FTP, telnet, and mail date back to the beginning of the ARPAnet, though
they changed somewhat when NCP was replaced by TCP/IP (in 1982?).  IRC,
WWW, Archie, and Gopher are quite recent.  I used something just like
IRC on the BITNET in 1987 or so, and I'm pretty sure there was no IRC
at that time, though there were MUDs.  I used something just like a
one-channel IRC on an HP-2000 (not on any net) in 1977.

I'm not sure when FAQs started, though I'm pretty sure they came from
Usenet, not Internet.

GIFs, I'm pretty sure originally came from Compuserve.

> > (I do hope newgroups have been, and are being, totally archived.)

>  They were by Henry Spencer at the university of Toronto - but he gave
>  his tapes last summer to someone who claimed they would make a cd rom
>  of them ...

Make a CD-rom of the complete archives of Usenet?  I believe the current
volume is about equal to one CD-rom per *week*.

_[ As of October 2000, about one CD-rom per five minutes! ]_

>  But also - some of the research I have done in the past is available
>  from wuarhive.wustl.edu in directory /doc/misc/acn/netbook

I'll get that file as soon as I finish writing this.  (I don't want to
bias my recollections, and feed back information already in the file
to you.)

Until 1990 or so, my perception was that the net, or at least my access
to it, was likely to go away soon.  TAC login was coming soon.  Guest
users at MIT were always becoming more numerous and weren't as well
behaved as in the "good old days," thus were likely to soon all be
flushed.  The net often became unusably slow (i.e. five or ten minutes
for what I type to echo -- sometimes I'd type ahead a whole session,
including the logout, before getting the password prompt) and it was
obvious that guests would be flushed since the capacity was now being
exceeded.

Later came the infamous FCC "modem tax" threat.  The outrageous idea
was that the net, PC Pursuit, etc, were underselling the phone company
and the post office, and that this was unacceptable.  Thus, whenever
information crosses a state line electronically, it would be charged as
much as it would cost to send via a regular modem over a regular long
distance phone line.  (This was when regular modems didn't exceed 1200
BPS.)  This threat later came back as a recurring "urban legend," but
it was quite real the first time.  Fortunately, the FCC received more
letters opposing it than they had received in all history on all other
issues combined, so they reluctantly backed down.  Packet nets such as
the Internet and PC Pursuit are inherently much cheaper than a dedicated
phone line.  It's like the difference between sharing a lane on the
road, and having a whole lane dedicated to you for the duration of your
trip.  Naturally, the latter costs much much more.  A dialup phone
line is exactly equivalent to FTPing a 64k file every second, plus
another one at the same time in the opposite direction, for the
duration of one's session.

This "modem tax" would have been an extreme and senseless distortion of
the marketplace, roughly equivalent to putting a one million percent
tax on trucks driven forwards, but not on those driven in reverse gear.

There's long been a lot of commonality between people on the net and
people at Science Fiction conventions.  Not only are SF cons discussed a
lot on the net, but SF cons have had "@ parties," or "@! parties" since
at least 1986.  There are also often parties associated with a given
mailing list or newsgroup.  I'm not sure whether in general people
discover the net at cons, or cons on the net, or whether, like me, they
discover both independently.

Also, either a disproportionate number of libertarians are on the net,
or -- just as likely -- the news media are lying to us about how many
libertarians are in the general population.

There's also a lot of overlap with ham radio types.  The net is the
exciting electronic frontier that I thought I had permanently missed
when reading amateur radio magazines from the 1910s.  I used to have
a ham radio licence, but let it lapse when I discovered the net.  I
couldn't combine the two hobbies, as ASCII wasn't allowed on the air
until 1980.  And packet ham radio came much later.  (It's interesting
to note that the American Radio Relay League was founded in 1916 by
hams to organize networks of hams to relay messages (their own and
messages from the general public) across the country, and, ten years
later, across the world, using Morse code.  It still exists, and I was
a member for a while.)

An early mailing list was Human Nets.  It was for the discussion of
"worldnet," a hypothetical future worldwide computer network.  The list
is long gone, but I hope the archives are available online somewhere.
They'd make valuable reading for you, since by reading them "backwards"
you can get a good image of what the net was like at that time, just
as the best way to see what was considered bad about a time and place
is to read a utopian novel written then and there, since a utopia is
always fairly similar to what the author is accustomed to, with the
bad features removed or reversed.

One April Fool's Day sometime in the early 80s, there was a hoax posting
from KREMVAX, which purported to be a VAX in the Kremlin in the USSR.
This was considered quite hilarious, since the ARPAnet was for US
defense, and the USSR was our enemy.  At that time, there were hosts at
US bases overseas, but nowhere else outside the US.  Much later, after
Russia was on the Internet, someone in Russia became aware of this
prank, and named their Internet host KREMVAX as a lark.

>  So thanks for writing - and let me know anyone else you think I
>  should be in contact with (feel free to show the proposal to anyone
>  who might have any comments to offer or to suggest who I should get
>  in contact with).

Eric Raymond, esr@snark.thyrsus.com (?), editor of _The New Hacker
Dictionary_.

Doug Humphrey, doug@access.digex.com, Internet/Usenet provider and
ARPAnet and ITS old-timer.

Devon Sean McCullough, devon@access.digex.com, ARPAnet and ITS
old-timer, brilliant but perpetually scruffy programmer, and writer
of SLOSTY, which made a 300 baud connection look like 600 to 1200
via real-time compression and decompression at both ends.  He's well
known for being the stereotypical computer bum.  He's usually homeless,
often living out of his backpack.  He works very little, and spends
extremely little money, but commands very high wages when he does
consult.  He's also famous for writing postings with even right margins
without stuffing extra spaces randomly between words (which is of course
much worse than just allowing ragged right margins, and which finally
seems to be on its way out on the net, thankfully).  He does this simply
by very careful word choice.  He used to (still does?) hang around MIT,
and not merely program their machines, but totally rewire them.

Chris Stacy, cstacy@ai.mit.edu ARPAnet and ITS old-timer, classic
example of a remote guest user of MIT who became an MIT employee.
And whose job it became to police the guest users, which he did so
assiduously that he became known as the "incredible flushing man".
He also moderated the INFO-MICRO mailing list, which was (is?) for
discussion of all microcomputers.  One time when I visited MIT in
person, he got real confused when he saw me, and he sat me at a
terminal, and when I logged in, he started chatting with me via a
nearby terminal.

Steve Roberts (I think that's his name), who is semi-famous for having
an Internet node on his bicycle.

James B. Van Bokkelen, founder of FTP software, which grew out of the
Bandykin list.

Lauren Weinstein, ARPAnet oldtimer, formerly very prolific on Human-nets
and other mailing lists, and who also had (has?) a column in a Unix
magazine.

Ian Mackey, ARPAnet and ITS old-timer with whom I explored things such
as TAC to TAC links when he was a high school kid.  He later got a job
helping to manage the ARPAnet.

Richard Stallman, rms@gnu.ai.mit.edu, ARPAnet and ITS old-timer, author
of ITS Emacs and GNU.  Head of the Free Software Foundation.  He
formerly went to SF conventions a lot, but has become more reclusive in
recent years.  After his house burned down, he lived in an office at MIT
for a long while.  Devon Sean McCullough taught him how to climb trees.
He won a quarter million dollar MacArthur genius grant.  He's famous for
believing that it's immoral *not* to copy software, and believes that
programmers should be supported via a universal worldwide software tax
rather than through software royalties.  I've never understood how he
reconciles this with his anarchism.  He used to play with his hair
whenever he was thinking.  He was quoted extensively in Steven Levy's
_Hackers_ (Dell, 1984).  He opposed the passwording of ITS, and made it
known that his ITS password was the null string, so anyone could log in
as him.

Possibly the addresses of the people I've listed without addresses can
be found in the _Internet White Pages_, which I don't have a copy of.

I was going to go on, and start listing famous crackpots on the net,
but this message is long enough, and has been delayed enough.

And today?  Today there are more systems on the net in our computer
room where I work, than were on the whole net in 1977.  Some of these
systems are a single circuit board that could fit in my shirt pocket.

And tomorrow?