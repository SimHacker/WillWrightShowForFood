# Grateful tourist: Don's Hacker News posts about the MIT AI Lab

As a high school student in Maryland, Don Hopkins used the MIT AI Lab's
PDP-10s for free over the ARPANET under the lab's tourist policy, and
sometimes showed up in person. He has written about it on Hacker News for
years, usually to say thank you, and sometimes to defend the policy against
people who took it for granted. The policy itself, with the Sam Williams
excerpt that quotes Don ("I'm eternally grateful that MIT let me and many
other people use their computers for free"), is in
[MIT AI Lab Tourist Policy](mit-ai-lab-tourist-policy.md). The door he knocked
on is in [Call me an elevator](../kent-pitman/elevator-and-door.md).

The comments are copied from the Hacker News API, with links and quotes
kept as Don wrote them.

| Date | Thread | What Don says |
|---|---|---|
| 2017-08-23 | The Enduring Legacy of Zork | The step-by-step: dial the NBS TIP, connect to MIT-AI, apply for a tourist account by saying you want to learn Lisp, then log into MIT-DM as URANUS to play Zork. Thanks KMP for TEACH-LISP. Contrasts how he responded to USER-ACCOUNTS' nudge with how Jerry Pournelle did. [Read it below](#15080221) or [on Hacker News](https://news.ycombinator.com/item?id=15080221). |
| 2017-09-10 | Jerry Pournelle has died | MIT never billed the tourists for network access, computer time, or tutoring. Don signed and followed the written tourist policy; Pournelle was removed for violating it, not for his politics. [Read it below](#15212723) or [on Hacker News](https://news.ycombinator.com/item?id=15212723). |
| 2017-09-11 | Jerry Pournelle has died | Answers a commenter who called the lab "keeping a good thing to themselves": tourists used idle machines for free and lab members spent unpaid hours teaching them. Quotes Pournelle's own praise of RMS's help, and an anonymous MIT-AI Lab member on what tourist use cost the people who hosted it. [Read it below](#15221830) or [on Hacker News](https://news.ycombinator.com/item?id=15221830). |
| 2018-01-24 | Ted Nelson on What Modern Programmers Can Learn from the Past | Mostly about Xanadu; meeting the Xanadu team at the AI Lab as "a 'random turist' high school kid visiting the AI lab on a pilgrimage". [Read it on Hacker News](https://news.ycombinator.com/item?id=16224154). |
| 2018-01-29 | Extensions in Firefox 59 | How easy it was to get onto the 9th floor of 545 Tech Square: thump on the elevator lobby door until someone at a Lisp Machine pressed Terminal-D. What he did once inside, how the TIPs worked, and Steven Levy's account of the hackers' master keys. [Read it below](#16254494) or [on Hacker News](https://news.ycombinator.com/item?id=16254494). |
| 2018-11-11 | Logo Adventure for C64 Terrapin Logo | "I am grateful to the MIT AI Lab, whose Tourist Policy enabled me and other lucky people to use MIT's computers for free." Spying on Zork players with :OS, another tourist's memories, and the Knight TV door and elevator commands. [Read it below](#18424341) or [on Hacker News](https://news.ycombinator.com/item?id=18424341). |
| 2020-05-08 | Zork source code, 1977 | ITS as the original social network: WHOIS, WHOJ, SEND, UNTALK, and OS, used politely under the tourist policy. MIT-DM's file protection existed mainly to hide the Zork source, and getting a DM account took more convincing mumbo jumbo than AI or MC. [Read it below](#23115608) or [on Hacker News](https://news.ycombinator.com/item?id=23115608). |
| 2021-11-07 | Ask HN: What was it like to use BBS? | Reposts the Zork story above with Keith Lynch's net history and the Medium link. [Read it on Hacker News](https://news.ycombinator.com/item?id=29142947). |
| 2022-10-27 | Most buildings at MIT campus are remaining closed to the public | The fullest version: the free accounts, the pilgrimages to 545 Tech Square from Maryland, being buzzed in, Mary Chung's and Toscanini's, the Dover printer and Velo binder, the cappuccino machine, Norman Margolus's CAM-6, and how Pournelle lost his account. [Read it below](#33356932) or [on Hacker News](https://news.ycombinator.com/item?id=33356932). |
| 2024-06-10 | PiDP-10 – a modern replica of the PDP-10 | Reposts the 2022 comment's list of stories, from Zork to the TECO Turing machine in Minsky's directory. [Read it on Hacker News](https://news.ycombinator.com/item?id=40634911). |
| 2024-12-05 | How the Arpanet Protocols Worked (2021) | TIP tricks, and why he and jslabovitz got tourist accounts "just by asking -- or actually just trying to log in as an unknown user". [Read it on Hacker News](https://news.ycombinator.com/item?id=42326831). |

<a id="15080221"></a>
## How a kid got on the ARPANET to play Zork

2017-08-23, in [The Enduring Legacy of Zork](https://news.ycombinator.com/item?id=15073227). [Don's comment on Hacker News](https://news.ycombinator.com/item?id=15080221).

*The step-by-step: dial the NBS TIP, connect to MIT-AI, apply for a tourist account by saying you want to learn Lisp, then log into MIT-DM as URANUS to play Zork. Thanks KMP for TEACH-LISP. Contrasts how he responded to USER-ACCOUNTS' nudge with how Jerry Pournelle did.*

“The MIT machines were a nerd magnet for kids who had access to the ARPANET,”

Zork is how and why I got on the ARPANET as a nerdy kid. And I wasn't even a Russian Spy! [1]

Connecting to the ARPANET and getting an account on DM was an adventure in itself, almost like the beginning of the game itself.

At the time there were no passwords or anything but security through obscurity on the ARPANET TIPs. And the MIT-AI Lab was kind enough to hand out free after-work-hours "TURIST Accounts" [2] to anyone who asked nicely with the right magic words.

Some dude named Bruce who had a BBS (Bruce's NorthStar Horizon in Northern Virginia) told me how to do it step by step:

1) After 8PM EST, dial up the NBS TIP at (301) 948 3850 [3] at 300 baud, typed "E" to get the banner, then "@L 134" to connect to AI. (NCP host ids were only 8 bits, before TCP/IP's vast 32 bit address space!)

2) Make up an account name (I chose A2DEH).

3) Try to log in with that name, like ":LOGIN A2DEH".

4) If it asks for a password, somebody already has that account. In that case, think of another name and try again. (RMS's password was famously "RMS", after they forced everyone to use a password over his objections).

5) If it doesn't recognize your user name, it asks "Do you want to apply for an account?" Answer YES. When it asks "Why do you want to use the MIT-AI Lab's PDP-10?" answer "Learning LISP." (Which, as it turns out, is a long incremental process pursued over a lifetime, since there are so many implementations of LISP on the inside with names like MDL and JavaScript on the outside.)

6) When the account is approved, now all ITS systems know about you (ITS had network file and account sharing long before NFS and YP), and although you still can't log into DM directly, you could log into AI to learn LISP (and EMACS).

7) The MIT-AI Lab staff would kindly and patiently go out of their way to help you learn LISP and EMACS. (Many thanks to KMP for writing TEACH-LISP and answering my clueless tasteless questions like "how to you set the value of a variable?").

8) To play Zork, dial up the TIP after 8PM and connect to DM with "@L 70".

9) Log in as "URANUS" with password "RINGS".

10) So as not to look suspicious (3 kids from all over the country [4] logged in as URANUS, URANU0, URANU1 at the same time all playing Zork or watching each other play), change your user name to your own with ":CHUNAME A2DEH".

11) Only two people could play ZORK at once, so hang out chatting with other people waiting to play ZORK, or spying (in a socially acceptable manner) on whoever's playing ZORK via ":OS PDL" (for "Output Spy Paul David Lebling"), or snooping around trying to find the Zork source code [5], which was well hidden.

12) There was no file security, so you could snoop around Marvin Minsky's home directory and hurt your brain trying to understand what appears to be line noise, but is actually the Universal Turing Machine he implemented in TECO. [6]

13) When somebody from USER-ACCOUNTS sends you a "nice private message" telling your they know what you're up to with ZORK, and that you should really learn LISP like you said you would because it's such a great language, instead of demanding you commit "seppuku" and "dumping you off the net and be done with it", you simply start learning LISP instead of acting like an entitled dick [7] by whining about how the people who gave you a free account that you bragged about in BYTE magazine are a bunch of communists and threatening to get some Proxmire type to start inquiring into its operations by seeing if your "Pentagon friends can upset them. Or perhaps some reporter friends. Or both., Or even the House Armed Services Committee."

[1] <https://www.youtube.com/watch?v=hVth6T3gMa0>

[2] <http://www.art.net/~hopkins/Don/text/tourist-policy.html>

[3] <https://www.saildart.org/TIPS[P,DOC]3>

[4] <https://archive.org/details/getlamp-rgriffiths>

[5] <https://github.com/itafroma/zork-mdl>

[6] <https://news.ycombinator.com/item?id=13514918>

[7] <http://www.stormtiger.org/bob/humor/pournell/story.html>

<a id="15212723"></a>
## "I for one appreciated it and am grateful"

2017-09-10, in [Jerry Pournelle has died](https://news.ycombinator.com/item?id=15204772). [Don's comment on Hacker News](https://news.ycombinator.com/item?id=15212723).

*MIT never billed the tourists for network access, computer time, or tutoring. Don signed and followed the written tourist policy; Pournelle was removed for violating it, not for his politics.*

I also don't like his hypocrisy.

I certainly hope for your sake that you're not in Texas or Louisiana or Florida, up to your neck in water, waiting for the climate change deniers in the government to bail you out.

MIT never sent me or POURNE a bill for the all the networking and computer services, personal guidance, tutoring and support we received pro-bono from the MIT-AI Lab staff, so it was free to us, and I for one appreciated it and am grateful.

RMS even custom wrote POURNE some free software at his request. You can't put a price on this: "He was immensely helpful to me in those days, patiently showing me things about emacs — his full-screen editor that he wrote in TECO, and the less said about TECO the better — as well as adding some special code to take care of things I wanted to accomplish."

<https://www.jerrypournelle.com/reviews/bookmonth.html>

But they did send me an official MIT AI Lab Tourist Policy that I had to promise to abide by in order to use their machines, which I gladly signed and returned and followed. And POURNE was flushed because he clearly violated it, not because of his politics.

<http://www.art.net/~hopkins/Don/text/tourist-policy.html>

> 13. Any use of the MIT ITS machines for personal gain, profit making enterprise, or political purposes is not a legitimate use of the Laboratories' computer resources.

> 14. These specific statements of policy give a minimum of how a tourist ought to behave to be a responsible user on the MIT ITS system. They are not a complete list of all the ways tourists should or should not behave. Just because some particular anti-social behavior is not listed does not mean that it is acceptable. What a tourist should do is cultivate a good attitude: make a positive effort to anticipate and avoid actions that would interfere with other users. If you cannot tell whether a certain course of action can interfere with any one, find out from someone else before trying it.

It's so ironic you're trying to Gish Gallop with tired talking point against big government, which funded the ARPANET, and which is currently busy dealing with a series of natural disasters, while you are trying to smear the MIT-AI lab as a bunch of communists. My failure to respond to all of your posts within your expected time frame is because they're simply not worth responding to.

<https://rationalwiki.org/wiki/Gish_Gallop>

<a id="15221830"></a>
## Defending the tourist policy

2017-09-11, in [Jerry Pournelle has died](https://news.ycombinator.com/item?id=15204772). [Don's comment on Hacker News](https://news.ycombinator.com/item?id=15221830).

*Answers a commenter who called the lab "keeping a good thing to themselves": tourists used idle machines for free and lab members spent unpaid hours teaching them. Quotes Pournelle's own praise of RMS's help, and an anonymous MIT-AI Lab member on what tourist use cost the people who hosted it.*

You call letting tourists use precious, delicate, expensive computers during off hours for free, and spending many hours of unpaid free time guiding and teaching them, "keeping a good thing to themselves"?

You think the only people who built the internet were "military guys"?

You think the ARPANET and MIT AI Lab should have been opened up to all of Byte Magazine's users, instead of Byte starting their own private commercial BIX network, and that MIT AI Lab staff should have supported all of those clueless newbies as well as the drunk and belligerent POURNE himself, instead of performing the research and development that was their day job?

You're totally off base, entitled, and have absolutely no idea what you're talking about. So educate yourself with the facts:

Read the MIT AI Lab Tourist Policy [1], which POURNE clearly violated.

[1] <http://www.art.net/~hopkins/Don/text/tourist-policy.html>

Then read POURNE's own gushing flattering words about how RMS took his own time to suffer him by teaching him about TECO and EMACS, and actually wrote him free software on demand to his specifications [2].

[2] <https://www.jerrypournelle.com/reviews/bookmonth.html>

> "I first met Richard Stallman (he called himself RMS in those days) when he was a graduate student at MIT and I was just learning about the ARPANET. He was immensely helpful to me in those days, patiently showing me things about emacs — his full-screen editor that he wrote in TECO, and the less said about TECO the better — as well as adding some special code to take care of things I wanted to accomplish. I learned then that RMS and I have a common failing: We don't suffer fools gladly or indeed at all, and we are sometimes wrong about who is a fool. But that's another story for another time."

And finally, read the words [3] of an anonymous MIT-AI Lab member who spent much of their own time helping POURNE and I as well as many other tourists. Even though POURNE isn't around to defend himself, I feel obligated to post this in response to the crass misunderstandings and misstatements of the facts in your attempt to smear the MIT AI Lab and its members (your own words: "Fuck them."), and because I agree with the point that "If he didn't want to have this as his enduring legacy, he had plenty of opportunity to make amends. And the offensive acts were not private ones.", and also with the points about asymmetric audience and the responsibility to do well by one's celebrity:

[3]

> We definitely had seen a great many "tourist" users, and it seemed to me that they would come away enriched. People spent a lot of time with Niven, Fuzzy (his wife, as I recall), and Pourne, showing them around the place, including them in the social aspects. ____ and I had him use the Lisp-teaching program. He used mailing lists to engage an interested audience.

> Then later, as I recall, he wrote publicly in negative terms about the whole of society that had welcomed him in, as if these were all abuses. As if he had a secret he was compelled to share, but not really a secret since so many knew. As if any community shared was just grist for the mill if it could be turned to buy celebrity.

> But the entire justification of tourist use was that the machines would otherwise sit idle. Any time I spent, and I suspect others spent, talking to him were unpaid. They made better use of resources than if those resources were used strictly as planned. But he didn't see it that way.

> That's his right. But it's my right to see him as neither courteous to his former hosts nor visionary about how the world works and should work, at least from those experiences. (I never got to reading his books, in part because of these other experiences. It soured me to the need.)

> But our public personas, the places we take a stand, are are our enduring legacies. It is our afterlife. I am not religious, and so what I do in life is a preparation for how I will be perceived when I am not around. I hold him to a like standard.

> If he didn't want to have this as his enduring legacy, he had plenty of opportunity to make amends. And the offensive acts were not private ones. They were ones he used his stature in the community to magnify in a way that those of us who were implicated had no similar way to respond.

> This, by the way, is the underlying basis of things like libel that make them differ from slander. I'm not alleging either slander or libel here, but I am saying that the key issue in libel is not just untruth, it's about the access one has to broad audience. If you say something in print and the person who needs to respond has no similar access to print, then your words have asymmetric effect in public conversation. The core issue is not print vs non-print, not paper vs word, in case you get confused about whether the internet is print. The core issue is audience. And even on the internet there is the issue of asymmetric audience.

> Asymmetric audience is prone to variations on the Peter Principle, where a good writer can gain audience that allows them to speak on other topics. There is considerable value in that, but also considerable responsibility to do well by one's celebrity.

<a id="16254494"></a>
## Knocking on the ninth-floor door

2018-01-29, in [Extensions in Firefox 59](https://news.ycombinator.com/item?id=16242336). [Don's comment on Hacker News](https://news.ycombinator.com/item?id=16254494).

*How easy it was to get onto the 9th floor of 545 Tech Square: thump on the elevator lobby door until someone at a Lisp Machine pressed Terminal-D. What he did once inside, how the TIPs worked, and Steven Levy's account of the hackers' master keys.*

Actually, it wasn't quite as secure a physical or virtual space as you imagine.

It was quite easy for anyone to get into the 9th Floor at 545 Tech Square simply by thumping on the door in the elevator lobby, because anyone on a Lisp Machine within earshot would just press Terminal-D to buzz open the door without getting up from their chair [1]. (And they could summon an elevator by pressing Terminal-E.) And many students and non-laboratory people (referred to as "random turists") knew the series of digits to tell a locksmith to make a key to those locks, or somebody who could make them a master key in the robot machine shop. And even if you didn't have your own key, there was always the MIT Lockpicking Guide. [2]

[1] <http://dspace.mit.edu/bitstream/handle/1721.1/41180/AI_WP_235.pdf> (figure 5-1 and 5-2)

[2] <https://www.lysator.liu.se/mit-guide/MITLockGuide.pdf>

The physical locks on those doors certainly never stopped me from showing up unannounced, gaining physical access, and wrecking havoc by playing around with the Lisp Machines [3] and PDP-10's [4], spying on other people's sessions with the Knight TVs, printing out and Velobinding reams of documents on the Dover laser printer, and sleeping on the beanbag chair in the "Lounge Lizard Lispmacho" office.

[3] <http://donhopkins.com/home/catalog/images/cadr.jpg>

[4] <http://donhopkins.com/home/catalog/images/mc-console.jpg>

And then there was this thing called the ARPANET that you could use to log in without even knocking on any doors, picking any locks, or being physically present in Cambridge Massachusetts. Breaking into the ARPANET wasn't as difficult as depicted in The Americans "ARPANET" episode [5] (S02E07) where the KGB agents had to actually break into campus and murder somebody to gain access.

[5] <https://www.youtube.com/watch?v=hVth6T3gMa0>

The dial-up TIPs themselves actually had no passwords, and BBN would mail you a free copy of the "Users Guide to the Terminal IMP" [6] if you asked nicely -- including "APPENDIX A: HOST ADDRESSES". Then all you had to know was a phone number (301 948 3850 for example) and what to type (E, @O 134, :LOGIN RMS, RMS), and you were in.

[6] <http://www.walden-family.com/dave/archive/bbn-tip-man.txt>

You didn't even have to know RMS's password. If you tried to log in to MIT-AI with an unknown user name, it would ask you if you wanted to apply for an account, what your name is, and why you wanted to use the system, etc. If you answered sensibly (like "learning LISP"), you'd have your very own free off-hours "tourist" account [7] within days.

[7] <http://www.art.net/~hopkins/Don/text/tourist-policy.html>

Steven Levy wrote about the Hacker Ethic and MIT-AI Lab culture in his classic book, "Hackers: Heroes of the Computer Revolution" [8].

[8] <https://murdercube.com/files/Computers/Heroes%20of%20the%20Computer%20Revolution/Hackers%20(Stephen%20Levy)/part1/chapter5.html>

The basic acquisition of every lock hacker was a master key. The proper master key would unlock the doors of a building, or a floor of a building. Even better than a master key was a grand-master key, sort of a master master-key; one of those babies could open perhaps two thirds of the doors on campus. Just like phone hacking, lock hacking required persistence and patience. So the hackers would go on late-night excursions, unscrewing and removing locks on doors. Then they would carefully dismantle the locks. Most locks could be opened by several different key combinations; so the hackers would take apart several locks in the same hallway to ascertain which combination they accepted in common. Then they would go about trying to make a key shaped in that particular combination.

It might be that the master key had to be made from special "blanks" unavailable to the general public. (This is often the case with high-security master keys, such as those used in defense work). This did not stop the hackers, because several of them had taken correspondence courses to qualify for locksmith certification; they were officially allowed to buy those restricted blank keys. Some keys were so high-security that even licensed locksmiths could not buy blanks for them; to duplicate those, the hackers would make midnight calls to the machine shop a corner work space on the ninth floor where a skilled metal craftsman named Bill Bennett worked by day on such material as robot arms. Working from scratch, several hackers made their own blanks in the machine shop.

The master key was more than a means to an end; it was a symbol of the hacker love of free access. At one point, the TMRC hackers even considered sending an MIT master key to every incoming freshman as a recruitment enticement. The master key was a magic sword to wave away evil. Evil, of course, was a locked door. Even if no tools were behind locked doors, the locks symbolized the power of bureaucracy, a power that would eventually be used to prevent full implementation of the Hacker Ethic. Bureaucracies were always threatened by people who wanted to know how things worked. Bureaucrats knew their survival depended on keeping people in ignorance, by using artificial means like locks to keep people under control. So when an administrator upped the ante in this war by installing a new lock, or purchasing a Class Two safe (government-certified for classified material), the hackers would immediately work to crack the lock, open the safe. In the latter case, they went to a super-ultra-techno surplus yard in Taunt-on, found a similar Class Two safe, took it back to the ninth floor, and opened it up with acetylene torches to find out how the locks and tumblers worked.

With all this lock hacking, the AI lab was an administrator's nightmare. Russ Noftsker knew; he was the administrator. He had arrived at Tech Square in 1965 with an engineering degree from the University of Mexico, an interest in artificial intelligence, and a friend who worked at Project MAC. He met Minsky, whose prime grad student-administrator, Dan Edwards, had just left the lab. Minsky, notoriously uninterested in administration, needed someone to handle the paperwork of the AI lab, which was eventually to split from Project MAC into a separate entity with its own government funding. So Marvin hired Noftsker, who in turn officially hired Greenblatt, Nelson, and Gosper as full-time hackers. Somehow, Noftsker had to keep this electronic circus in line with the values and policy of the Institute.

[...]

They went wherever they wanted, entering offices by traveling in the crawl space created by the low-hanging artificial ceiling, removing a ceiling tile, and dropping into their destinations commandos with pencil-pals in their shirt pockets. One hacker hurt his back one night when the ceiling collapsed and he fell into Minsky's office. But more often, the only evidence Noftsker would find was the occasional footprint on his wall. And, of course, sometimes he would enter his locked office and discover a hacker dozing on the sofa.

<a id="18424341"></a>
## Grateful to the MIT AI Lab, and ITS as a social network

2018-11-11, in [Logo Adventure for C64 Terrapin Logo](https://news.ycombinator.com/item?id=18409959). [Don's comment on Hacker News](https://news.ycombinator.com/item?id=18424341).

*"I am grateful to the MIT AI Lab, whose Tourist Policy enabled me and other lucky people to use MIT's computers for free." Spying on Zork players with :OS, another tourist's memories, and the Knight TV door and elevator commands.*

I am grateful to the MIT AI Lab, whose Tourist Policy enabled me and other lucky people to use MIT's computers for free, and to be inspired by Zork, Logo, Lisp, and all the great people at the MIT-AI Lab and the community they attracted.

<https://medium.com/@donhopkins/mit-ai-lab-tourist-policy-f73b77075631>

With commands like :WHOIS, :WHOJ, :LUSER, :SEND, :OS, :PEEK and :UNTALK, ITS was the original social network.

In the HN "The Enduring Legacy of Zork" discussion, another tourist ZEMON told me he used the same NBS TIP as I did, to dial into the ARPANET without a password, connect to MIT-DM, :OS spy on other people playing Zork until it was your turn, then finally play Zork while the other people waiting watched.

MIT-DM was like a 300 BAUD ASCII version of Twitch!

Then he got seduced by networking and Lisp -- and he still uses Emacs too!

<https://news.ycombinator.com/item?id=15081626>

> MIT's friendly, unparanoid attitude towards people using their systems and basically just digging their technology was very formative in my career. Zork was the hook. I came to play adventure games, I stayed to learn Emacs and a bit about networking and LISP. I don't use PDP-10s anymore, but I work in the games industry, use Emacs every hour of my working day, and wish I could write more production LISP (though if you squint at Javascript just right...)

At the lab, the Knight TV displays let you watch anyone else's screen, and there was global "free display" screen saver showing all logged in users, what they were doing, where they were, free Lisp Machines, and other useful information, like the time and birthday announcements. They could also buzz open the door from the elevator lobby, and summon the elevator to your floor!

<http://dspace.mit.edu/bitstream/handle/1721.1/41180/AI_WP_235.pdf;sequence=4> (page 22)

<https://github.com/PDP-10/its/issues/279>

ROBG was interviewed in the "Get Lamp" documentary on Zork, and eloquently described the experience.

<https://archive.org/details/getlamp-rgriffiths>

> Rob is a perfect example of the benefits of not going just for "names" in a documentary about a wide-ranging subject - nothing on his resume says he was a big text adventure game player or person who was at the beginning of Zork. But there he was, a kid who had gotten into the MIT lab and seen early Zork being played and the effect it was having on the students and computer lab users. He was articulate and provided a wonderful dash of emotion into the descriptions which I used liberally in GET LAMP. He had a number of printouts which I also filmed (but didn't use). Many documentaries wouldn't count "just a player" as worth interviewing - Rob is proof that approach is short-sighted indeed.

<http://www.getlamp.com/>

<a id="23115608"></a>
## The Zork lobby

2020-05-08, in [Zork source code, 1977](https://news.ycombinator.com/item?id=23108626). [Don's comment on Hacker News](https://news.ycombinator.com/item?id=23115608).

*ITS as the original social network: WHOIS, WHOJ, SEND, UNTALK, and OS, used politely under the tourist policy. MIT-DM's file protection existed mainly to hide the Zork source, and getting a DM account took more convincing mumbo jumbo than AI or MC.*

Zork definitely has some puzzles that are practically impossible to figure out, without some help.

The ITS operating system that Zork was developed on was a extremely open, with very little security, but lots of obscurity.

ITS was like the original "social network," where users would hang out and socialize, with lots of visibility and awareness of each other and what they're doing, where everybody could see each other's files and read each other's email, with programs like "INQUIR" for telling other people about yourself, "WHOIS" and "FINGER" for finding out about other people, "WHOJ" to see who's on and what they're doing, "SEND" and "REPLY" for sending immediate messages back and forth, "UNTALK" for multi-window chatting, "MAIL" for sending email, "RMAIL" and "BABYL" for reading email, etc.

And (important to Zork) also "OS" (Output Spy) to spy on other people's sessions over their shoulders!

Only two people could play Zork at once on DM, and only after east coast business hours. Usually there were a few other people just hanging out, spying on the two lucky people playing, chit chatting with each other and the players by sending messages and email, etc.

It was considered perfectly normal and inoffensive behavior for people to spy on each other and learn about running Lisp, hacking Emacs, or playing Zork. (As long as you're not creepy or obnoxious about it, but people tended to be polite and follow the Tourist Policy, and people liked to help each other learn. And if you liked creepy obnoxious stuff, you could subscribe to REM-DIARY-READERS!)

<https://medium.com/@donhopkins/mit-ai-lab-tourist-policy-f73b77075631>

> TOURIST POLICY AND RULES FOR TOURIST USE OF ITS MACHINES

> It has been a long standing tradition at both the Laboratory for Computer Science and the Artificial Intelligence Laboratory at MIT to allow non-laboratory people to use the laboratories’ computers during off hours. During the early days of the laboratories’ existence a non-laboratory person (such people have come to be called tourists) could gain access to one of the computers by direct personal contact with a laboratory member. Furthermore, tourist access was controlled because access to the laboratories’ computers was de facto achieved through on site terminals. A tourist sponsored by a laboratory member would generally receive some guidance and tutelage concerning acceptable behavior, proper design techniques for hardware and software, proper programming techniques, etc. The expectation on the laboratories’ part was that a large percentage would become educated in the use of the advanced computing techniques developed and used in our laboratories and thereby greatly facilitate the technology transfer process. A second expectation was that some percentage would become interested and expert enough to contribute significantly to our research efforts. Tourists in this latter group would at some point in time graduate out of the tourist class and become laboratory members. In actual fact a number of former and present staff members and faculty earned their computational wings in just this fashion. [...]

MIT-DM was the Dynamic Modeling Lab's PDP-10 running a slightly different version of ITS, and it was the only ITS machine that had any form of file protection, which was primarily used to hide the Zork source code. But even that was essentially only security through obscurity, which was why the source was eventually leaked.

Zork had its own end-game, but getting an account on MIT-DM was like the pre-game, and logging into MIT-DM itself was like the Zork Lobby where you'd hang out waiting for your turn and socializing.

You could get an account on most of the ITS machines just by asking nicely and using the right magic words, like mentioning Lisp on MIT-AI, or Macsyma on MIT-MC, or SomewhatBasic on MIT-ML. But Zork was so sought after that DM was one of the harder ITS machines to get an account on -- you couldn't just say you wanted to play Zork or hack Lisp: you had to say you were interested in MDL for some plausible sounding mumbo jumbo like "algebraic applications". But they still knew you just wanted to play Zork, though.

PDP-10/its: Incompatible Timesharing System (github.com)

<https://news.ycombinator.com/item?id=13514918>

<https://github.com/PDP-10/its>

<a id="33356932"></a>
## "I deeply appreciate and am greatly privileged"

2022-10-27, in [Most buildings at MIT campus are remaining closed to the public](https://news.ycombinator.com/item?id=33351290). [Don's comment on Hacker News](https://news.ycombinator.com/item?id=33356932).

*The fullest version: the free accounts, the pilgrimages to 545 Tech Square from Maryland, being buzzed in, Mary Chung's and Toscanini's, the Dover printer and Velo binder, the cappuccino machine, Norman Margolus's CAM-6, and how Pournelle lost his account.*

I deeply appreciate and am greatly privileged to benefit from the MIT AI Lab's "Tourist Policy" and general openness, generosity, and encouragement of education, which allowed me to use the lab's PDP-10s over the ARPANET as a high school student.

I could connect remotely over the ARPANET by dialing up a local ARPANET TIP and connect to any computer without a password, then apply for a free account on each of the MIT-AI Lab's PDP-10s, by saying that I wanted to learn Lisp or MDL or Macsyma, and use the computers read email (mine and other people -- there was no file security and snooping was encouraged) and play games (like Zork, Adventure, Guess The Animal, and Doctor) after business hours.

As a high school student living in Maryland, I'd occasionally go on a pilgrimage to MIT and visit the MIT-AI Lab at 545 Tech Square, the Media Lab, and other places on campus, including exploring the steam tunnels (like the ones depicted in Real Genius).

They welcomed me to the lab, and I could easily get into the machine room and offices at the AI Lab simply by knocking on the door in the elevator lobby, and somebody using a Lisp Machine would press [Terminal]-D to automatically buzz open the door without getting up from their seat or looking who it was, just to make the knocking stop. (You could also press [Terminal]-E on a Lisp Machine to summon an elevator to your floor.) Then I could walk around the lab, and find a free Lisp Machine, Knight TV, or Ann Arbor Ambassador terminal to log in with, and even sleep on a bean bag chair or couch in an office, if it wasn't already occupied by RMS or some other random tourist or grad student.

Members of the MIT-AI Lab would take the time to help and tutor me with Emacs and Lisp, invite me to go out and eat pot stickers and Suan La Chow Show at Mary Chung's and get ice cream at Toscanini's, encourage me to pick up free papers from the publications department, use the Dover laser printer and Velu Binder to print out and bind my own copies of the online ITS manuals and other documents (long before the consumer laser printers were available), and they'd even let me use the gigantic cappuccino machine (I heard one MIT grad student claim "I had offers from Harvard and Stanford, but I came here because of LCS's cappuccino machine!").

I've written about how the MIT machines were a nerd magnet for kids who had access to the ARPANET, and how I logged in over the ARPANET to play Zork:

<https://news.ycombinator.com/item?id=15080221>

<https://news.ycombinator.com/item?id=23114927>

How ITS's open approach to security through obscurity encouraged hacking but discouraged vandalism because it really wasn't much of a challenge to break in or crash the machines:

<https://news.ycombinator.com/item?id=22840639>

In my exploration of other people's home directories, I ran across an inexplicable (even to the author) TECO implementation of a Universal Turing Machine in Marvin Minsky's home directory "AI:MINSKY;":

<https://news.ycombinator.com/item?id=13519471>

Once my friend and I were hanging out in Norman Margolus's office with the lights out playing with his CAM-6 cellular automata machine, when his wife opened the door, turned on the light, and was surprised to see us there instead of her husband. She asked if we'd seen Norman, and we answered no, then she politely turned the lights back off and closed the door, leaving us to our fun.

<https://news.ycombinator.com/item?id=14469113>

Keith F. Lynch wrote up some interesting history of the net and the MIT-AI Lab from his perspective:

<http://keithlynch.net/history.net.html>

How Jerry Pournelle got kicked off the ARPANET and MIT-AI Lab's computers for being an obnoxious antisocial unappreciative entitled drunken right-wing jackass, taking his unique precious privileges for granted while making impotent threats and accusing the same generous lab members who had welcomed, supported, and mentored him of being "communists":

<https://news.ycombinator.com/item?id=17686261>

> "One thing that is known about ARPA: you can be heaved off it for supporting the policies of the Department of Defense. Of course that was intended to anger me. If you have an ARPA account, please tell CSTACY that he was successful; now let us see if my Pentagon friends can upset him. Or perhaps some reporter friends. Or both., Or even the House Armed Services Committee." -POURNE (Jerry Pournelle)

> "The man has learned nothing from his presence on MC and sets a bad example of what people might potentially accomplish there. I'd rather recycle his account for some bright 12-yr-old...)" -KMP (Kent Pitman)

At the other end of the politeness spectrum, Rob Griffith's memories of touring the MIT-AI Lab and encountering Zork as a 15-year-old kid:

<https://archive.org/details/getlamp-rgriffiths>

> "I believe on one trip we were touring the MIT Artificial Intelligence Lab, and we saw some people gathered around this terminal. And we inquired what they were doing, and out of that came this game Zork, and my friend, since he was at MIT, had us get an account, and we were able to log in and figure out what to me looked like an extremely arcane set of commands to actually get this game running. From then on we were pretty much hooked from the first time we actually saw it. I believe we saw it when we were walking through the MIT AI Lab. I was a guest. Even back then there was some pretty amazing stuff in there. To see all these students and professors huddled around this terminal. What are the doing? They had all these incredibly cool Lisp Machines with big gorgeous displays, and a bunch of people were huddled around a machine that's got text. And we were sort of intrigued. I believe that was the first time I actually saw the game, so to speak. You know, I never got names, so I don't know. I was a petrified little 15-year-old kid walking around the MIT lab, so it was a bit of a feeling of "Am I supposed to be here?", and if I am supposed to be here, I'm pretty sure I'm not supposed to talk, so perhaps I'll just be quiet and observe." -ROBG (Rob Griffith)

<https://archive.org/details/getlamp-rgriffiths>

*The rest of this comment quotes the Medium article in full; see [MIT AI Lab Tourist Policy](mit-ai-lab-tourist-policy.md).*

---

↑ [Don Hopkins](README.md) · [MIT AI Lab Tourist Policy](mit-ai-lab-tourist-policy.md) · [Call me an elevator](../kent-pitman/elevator-and-door.md)
