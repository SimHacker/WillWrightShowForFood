---
type: source-transcript
title: "Why AI Is Repeating the Worst Mistakes of Social Media — Jaron Lanier on The Times Tech Podcast (2026)"
event: "The Interview, The Times Tech Podcast (The Times / The Sunday Times)"
date: 2026-11-02
source: https://www.youtube.com/watch?v=WxaRn8kX2eI
speakers: [jaron-lanier, danny-fortson, katie-prescott]
provenance: >
  Cleaned from YouTube's automatic captions: obvious caption errors fixed
  where certain ("Jiren Laneir" → Jaron Lanier, "a kneeling" → annealing,
  "Peter Teal" → Peter Thiel, "oracle at deli" → oracle at Delphi,
  "agilation" → adulation, "sephalopod" → cephalopod), fillers and false
  starts trimmed, guesses and lost passages marked ⟦like this⟧, original
  wording otherwise kept. The captions carry no speaker labels: host turns
  are given to Danny Fortson, who conducted the interview; the intro and
  outro banter between the two hosts is marked Hosts.
---

# "Addicted to addiction" — Lanier on The Times Tech Podcast (Nov 2, 2026)

Danny Fortson, who first interviewed Jaron in his Berkeley instrument room in 2018 for *Ten
Arguments for Deleting Your Social Media Accounts Right Now*, asks whether AI is repeating social
media's business model. Jaron's answer, speaking as an insider: "We became addicted to addiction as
a business model. We ourselves became addicted to the thing which was addicting others." Recorded
the week of Anthropic's 355-page IPO prospectus. 31 minutes.

His positive proposal is the part to bring to this show: **don't prompt for a result, prompt for
an editor** of results in the neighborhood of what you want, with sliders you explore, so you learn
while you make, and you are plainly the author of what you choose.

## Why this transcript matters — hooks to discuss with Jaron

- **Prompt for an editor, not a result.** Ask the model for a two-minute annealing explainer and
  you get one take, and you learn nothing. Ask it for an *editor* with six sliders (visual detail,
  historical reference, technical accuracy...) and "instead of cognitively offloading, you're
  cognitively enhancing." That is the show's whole design stance, from the other end: the toy is
  the explanation. Will Wright's toys over games ([`../../will-wright/`](../../will-wright/README.md)),
  Bret Victor's explorable explanations ([`../../bret-victor/`](../../bret-victor/README.md)), pie
  menus that show the effect in the world while you're still choosing
  ([MediaGraph](../../don-hopkins/sources/mediagraph-sfc-youtube-demo.md)), and Engelbart's
  augmentation rather than automation ([`../../douglas-engelbart/`](../../douglas-engelbart/)).
  Jaron's three gains, in his order: you develop intuition, authorship becomes clear, you get what
  you actually want.
- **"Do we want the oracle at Delphi or the library at Alexandria?"** A library "just sits there"
  without a culture of scholarship and librarians; the models are the same. The repo-as-stage is a
  library bet: every source kept, linked and attributed, not rescrambled into one voice.
- **The dehumanizer.** Gen AI filters "all of the wealth and efforts and creativity of mankind
  through this scrambler so that it seems like it's just coming from the company." The 2013 line,
  "information is people in disguise" ([Kepler's talk](2013-05-15-cspan-book-tv-who-owns-the-future-keplers.md)),
  thirteen years on, now with a subscription fee. Data dignity ↔ signed commits:
  [`../ideas.md`](../ideas.md) §6.
- **Eliza, again.** "It takes no technical knowhow to make computing into this addictive
  manipulative thing." The mid-60s chatbot that people took for an empathic therapist:
  [Joe Weizenbaum](../../joe-weizenbaum/README.md), who spent the rest of his life warning about
  exactly that reaction.
- **Agents as a ritual of adoration.** The protein-folding Nobel work predates "treating them as
  gods," so it was "an algorithm that searched a space," not an agent going off on its own. Agents
  earn their keep only in real-time control (ICUs, drones); for recipes, portfolios and office work
  they are "a ritual to support the adulation of this new golden calf." A fair question to put to
  this repo, whose guests are LLM-performed portrayals: the answer the show would give is his own
  third gain, a named human author for every move, and a header on every card that says it is not
  the person.
- **Speak without quitting.** Jaron's Microsoft arrangement lets him say all this unfiltered,
  "and Microsoft stock is fine." Why must people leave Meta, Anthropic, OpenAI and Google to
  dissent? "We are becoming a de facto government of the world. Why can't we have debates?" A
  community that won't disagree "ties itself into a little knot."
- **Anthropic, "the most religious of them all."** Many of the best people he knows work there,
  and he says the official position — teams concerned with the model's well-being, the hope that
  a model that feels good will do less harm — is the most worshipful of the new AI god.
- **The builders changed by their own machines.** "I think Elon Musk was changed by Twitter... The
  same thing happened to Donald Trump, who I used to know a little bit." The incentive structure
  "doesn't allow somebody to be a good actor in that role."
- **Data centers as human sacrifice.** Seven data centers ringing Red Oak, Texas: "people being
  dragged to the top of the pyramid in Mesoamerica." And the abundance promise as magical thinking:
  every step points away from the destination, then "at the very very last step it'll turn around."
- **The octopus.** Prime Unifying Scientist in the Office of the Chief Technology Officer:
  O-C-T-O-P-U-S, a joke from his cephalopod-cognition years. "The dismal optimist."

## Transcript (cleaned from YouTube automatic captions)

**[00:00] Cold open (clips):** We became addicted to addiction as a business model. — We, the
leaders of this company, have created a new species. — If we make a machine and we declare it God,
what's the consequence? — The people building this technology view themselves as the hero in the
story. — Future historians will look back at this and will call this the era of the stupid
engineers.

**[00:26] Hosts:** Hello and welcome to The Interview from Times Tech. I am Danny Fortson. — And
I'm Katie Prescott. — And this week I've been talking to Jaron Lanier. Jaron is a fascinating
person. He's a computer scientist and futurist ⟦a stretch of crosstalk lost in the captions⟧ He is
recognized as one of the founders of virtual reality back in the 80s. He coined the actual term
itself. — No way. I have to say, I was looking him up, and futurist isn't his only job title. Tech
has got some good job titles, but he is currently the Prime Unifying Scientist at Microsoft's
Office of the Chief Technology Officer, which, if you switch the two around, spells octopus. —
You're interviewing Microsoft's octopus. — And perhaps he'll explain what that means. Yes, indeed.
And most importantly, his most important title is friend of this very pod. He's been on this pod
back when it was Danny in the Valley, many, many moons ago. He is nicknamed the dismal optimist
because of how he contrasts his criticism of digital technology with the way it's used to protect
human creativity and agency. So with everything moving around us at such a rapid pace, I thought it
would be a great moment to catch up with him and maybe do a little bit of future gazing, in this
week where we have the big Anthropic news and all things AI. So here is my conversation with Jaron
Lanier.

**[02:15] Danny Fortson:** You may not remember this, and I see all the instruments behind you —

**Jaron Lanier:** Yeah, there are some.

**Danny Fortson:** I sat in your house, in your other room with all the instruments, back in
Berkeley in 2018. You were on this podcast when it was called Danny in the Valley. The occasion,
which is why I want to start here, was you'd published this book, *Ten Arguments for Deleting Your
Social Media Accounts Right Now*. I remember really enjoying that conversation, and it stuck with
me, because eight years later it feels like the world has caught up to that to a large degree.
You're having these bans across the world. Social media is still social media, but there does seem
to be a general awakening to: this extractive, manipulative business model is a problem for us. Is
there a through line, to your mind, to what we are seeing right now with AI, the business models at
the heart of this new industry, and how it is developing, very quickly?

**[03:30] Jaron Lanier:** Yeah. Unfortunately we're seeing much too strong of a through line, and
it's kind of a tragic one, because it's so unnecessary and there would be better decisions. In my
view — and I say this not as an outsider but as an insider, and I'm speaking of my friends and of
myself and of my community — what happened is we became addicted to addiction as a business model.
We ourselves became addicted to the thing which was addicting others.

So if you look at the stated major benefits of AI algorithms — maybe we'll find cures to major
diseases, maybe we'll transform the way we get energy, and material science and all these things,
and that could improve human life and prospects — there's all that. But the way we make money, if
you look at the very large numbers of people with subscriptions to AI services now, is extremely
similar to the kind of emotional addiction paradigm that we saw with social media, and that we
continue to. There are a couple of things to say here. There are a lot of layers of irony and
complexity, and also, I think, a lot of layers of hope.

**[05:24] Danny Fortson:** We're speaking in the week that Anthropic comes out with its 355-page IPO
prospectus, potentially the largest deal in the history of capitalism. So it's obviously very much
on people's minds, and they spend almost a hundred pages on the various risks, including: hey, this
new digital god we're creating might kill us all.

**[05:46] Jaron Lanier:** Yeah, that's right. I guess I should just take a moment here to say that
I'm not an absolutist critic at all. What I had always thought is that the core issue is really the
business model: if the way you make money from computation is by manipulating people, which is very,
very easy to do with computation — it's the very easiest thing to do with it at all — then your
incentives become rather dark, and you tend to make money from doing things that are darker and
darker. In my view that's why we have an unfortunately dark and depressed culture in younger
generations all over the world, and it's why politics went off the rails in a lot of ways during
this period, and many other things. Just as we're saying that tech should be able to improve
medicine, tech is actually probably doing more to harm people, by making them reject modern
medicine through cranky algorithms. We make ourselves so absurd.

Now the thing is, the business model for AI has a lot in common. It has the addiction dynamic in
common: people definitely get addicted to using their chat. It definitely has the inherent, ultra
easy, readily available illusions of computing in common. What I mean by that, for those who don't
know: way back in the mid-60s, when computers were so small they really couldn't do anything, there
was an experiment called Eliza, where somebody made a chatbot that just spit back what somebody had
said, and people were convinced it was the most empathic, fully conscious, real therapist god ever.
It takes no technical knowhow to make computing into this addictive, manipulative thing, because
it's just so natural. Just having an information system that can respond — it's super easy to turn
it into a manipulation box.

**[07:42] Danny Fortson:** This is going back to the social media era: if everything's free, then
you're the product, as the saying goes, and as many have discovered.

**[07:53] Jaron Lanier:** Yes. The interesting thing about the AI era is people are actually paying
for these subscriptions — not everybody, but a lot of them. So in a way what I wanted is happening.
But here the problem is a different one. Because we now have gen AI, we have a way of filtering all
of the wealth and efforts and creativity of mankind through this scrambler, so that it seems like
it's just coming from the company. So we're getting the worst of both worlds. We're getting the
weird anonymizer, dehumanizer thing that was happening with the algorithms on social media, but then
we are paying for it, and it's not going to the people who are the sources of the information that's
being rescrambled into gen AI. Instead it's just going to these companies. And it suggests this idea
where the only thing you need in the world is OpenAI and Anthropic, and everything else becomes
dispensable, including their own customers. So it's very stupid, and I feel very embarrassed for my
kind. I don't know what to say. It's just so pathetic.

**[09:04] Danny Fortson:** So is what you're saying that effectively what we're doing with AI is
paying for our own stuff? These systems have trained on all human creation, everything on the
internet, all the books, and then, as you say, it goes through the dehumanizer — which is a great
term — and then we pay 20 bucks a month to get access to that output.

**[09:28] Jaron Lanier:** Well, let me qualify this a little bit, because I am sort of saying that,
but not quite. There's an important difference. To me, the large language models are cool things.
I'm not anti the technology itself. In fact I think it's cool. I love having new tools to extend
human efforts and collaboration. But just like with a library: a library by itself just sits there.
It only has any meaning if somebody goes in and does something with it. A library without a culture
of scholarship, without a culture of library science, without librarians, is just inert. The same
thing is true of these large language models and other recent frontier models. There has to be
something done with them in order for them to have any impact. And the thing we chose to do was
reproduce this Eliza illusion from the 60s, or the thing that drove social media, which is: let's
make it a fake person. And then people become addicted to it. They treat it as their therapist or
girlfriend or partner in some way, and then of course you start to own their lives, because now you
own this intimate part of them. Just like with social media, I think sometimes it works out well and
sometimes it doesn't.

**[10:46] Danny Fortson:** One of the things we've been talking a lot about and writing about
recently, on the pod and in the paper, is this notion: we, the leaders of this company, have created
a new species, and therefore they're, quote unquote, moral agents — they have some equivalence, and
we must think about them in a way that is not just software. One, do you agree with that? And two,
if you don't, is that framing problematic?

**[11:25] Jaron Lanier:** It embarrasses me so deeply. So let's unpack this. First of all, if we're
talking about absolute truth, any question about what's a being and what's not a being is
ultimately a matter of faith. We have latitude to believe different things. But we have to live and
we have to make decisions, and as a pragmatic concern we just have to have assumptions that we make
about things. A similar argument for me has to apply to AI, which is: if we make a machine and we
declare it God, what's the consequence? The consequence is we have to let it run rampant, and
letting a machine run rampant is really stupid.

**Danny Fortson:** And that is what we're doing right now.

**[12:16] Jaron Lanier:** Yeah. So it's pragmatically absolutely absurd. Let me give you a couple of
examples. What actual core benefits have we gotten from AI so far that have made a difference? It's
a little hard to nail them down, honestly. But let's say one of them is that some scientific
projects have been furthered by AI, like proteins and whatnot. There's a Nobel Prize out. One of the
things that's interesting about the Nobel Prize work is that it was before the popularity of trying
to treat them as gods, and so they didn't use the formulation of agents. They didn't have the thing
going off on its own. It was rather an algorithm that searched a space.

The whole idea of the agent is a ritual worship object. The idea is that we believe the AI is this
living God thing, and so instead of just using it, we're going to have it go off on its own. But
that's actually not needed for doing anything productive. There are a few exceptions. If you want to
use an AI algorithm to control something in real time, you might want to let it go and do its
thing. I have some friends who are trying to work with frontier AI models to improve ICUs, intensive
care units in hospitals. You need an agent for that. The most prominent proposed application, which
has actually seen the light of day in Ukraine, is using it to control smart drones. But in almost
all cases — if it's something about your exercise or recipes, if it's something about your stock
portfolio, even if it's something about productivity in your company — the use of agents doesn't
actually help you. It's a ritual to support the adulation of this new golden calf that people made.
It's a ritual of adoration.

The problem with it is it creates dangers. So you have this repeated stream of: oh, we set out all
these agents, and the agents messed up, they broke out of their sandbox, they committed felonies or
whatever. [laughter] They actually weren't needed in the first place. The whole thing is stupid.
This is like somebody saying, "I ate dirt and it upset my stomach." If people do survive our
stupidity during this generation — I mean, we could make people extinct, but we will be the ones
doing it, not some AI god — but presuming we survive, future historians will look back at this and
call this the era of the stupid engineers. It's a shockingly dumb period.

**[14:56] Danny Fortson:** Do you have a sense of why? Why are we here? Why are we being so moronic
and stupid? Stepping back and putting this through a normie lens: I was just talking to people this
week in Texas about data centers. One little town called Red Oak, Texas: seven data centers being
built, encircling this rural town. Everybody's angry. Taking all the water, changing the landscape.
And then you step back further and you're like: OK, for what? So we can all lose our white-collar
jobs and end up on universal basic income? But don't worry, step back one layer further: in the
distant future there will be great abundance. We will solve all the problems.

**[15:49] Jaron Lanier:** There are a couple of things to say about this. The image I always get
about the towns with data centers is human sacrifice. It's like people being dragged to the top of
the pyramid in Mesoamerica or something. We've decided our god is so awesome we must present it with
humans.

As far as getting to the future of abundance, the problem is there's this magical thinking that you
can make every little decision on the steps towards something counter to that destination, and then
somehow at the very, very last step it'll turn around. Within Silicon Valley thought, you might have
a startup that loses money and loses money and loses money, and then it hits its moment of strategic
relevance and is acquired by one of the big companies for a lot of money. So when employees at tech
companies say, "We're being more productive now because we're using this model — can we work less?"
— oh no, you cannot work less. You must work more. We've seen that interaction at Meta, for
instance. Meta for a while was asking people to use as much AI as possible, but would not allow them
to reduce their work hours. So if people even inside the industry aren't able to, what's the magic
event where that turns around?

Now, why are we doing this? I've puzzled over it for many years. Part of it is that there were some
people who really wanted us to do this, and it's been a pretty explicit agenda for decades, going
back 20 or 30 years at least, and really longer. There was this realization that the structure of
code has so much impact on people: it not only addicts people, it also creates the maze within which
they can operate. It creates the field of available actions to them. If you're using a software
interface to access products or government services or whatever, you can only work within the
structure of that software. There was this realization that software design would be the new laws,
the new culture, the new everything, and that government and culture and all that stuff were just
temporary irrelevancies that we would wipe away — which is what we're doing. We treat government and
Hollywood and journalism and everything as transient, things we can override.

So the question is what to do with that, and there were many schools of thought, going back to the
80s certainly. Some said: we should do some kind of new golden age of democracy, with better
participation. But then a lot of people — and some of the famous ones are people like Peter Thiel,
but there were a lot of others — were saying: you know what, we can get stuff this way we could
never get through democracy, and we should just get our way on this. These are people I know. They've
been acquaintances, and in some cases friends, for years, and they have a sensibility which, if it
were just one of many, would be interesting. But when it becomes dominant, it becomes really
problematic.

**[19:04] Danny Fortson:** It's the end of 2026. I now endow you, Jaron, with a magic wand. When we
think about how this is being built and deployed, how would you remake it? Is there any possibility
of a remake?

**[19:26] Jaron Lanier:** Yeah, possibly. I've said that I think the core idea of doing giant
statistical correlations of stored human data, to do better searching and extrapolation and
collaboration, is a great idea. I'm into that. So the next question is: if I don't like agents and
I don't like these addicting chatbots, is there something else to do with it? I can tell you about
something I've been experimenting with lately that I think is better.

Right now, let's say you want to get something out of AI. Just for the hell of it, I'll say you want
a synthesized video clip of something. I'm going to presume you have a good reason for it: it's for
education, it's not for deception, it's not some horrible thing. Say I want a demonstration of how
annealing works, or whatever it is. Right now you prompt for that, and you get something. But in
most domains the description itself is going to be imperfect, because that's the nature of
description. Furthermore, the act of making is an exploration in which you learn more, and one of
the problems with prompting is that you deny yourself that learning. You're just supposed to get
this thing. What actually happens in real human creativity and invention is you get close to the
thing, and then you start tweaking and experimenting, and you learn more and more, and then you get
somewhere.

So my thought was: a better way to do this is, instead of prompting for a result, I prompt for an
editor for results in the neighborhood of what I want. Let me explain what that might look like. If
I wanted to prompt for this short video, what I would say is: I want an editor for two-minute clips
that introduce annealing using video. I want six sliders in order to explore variations on the
video. One of the sliders is for degree of visual detail. Another is for degree of historical
reference. Another is for degree of technical accuracy. Another is for — I don't know, you come up
with these things. And then you get this thing, and you start playing with the sliders.

The interesting thing about playing with the sliders is, one, you start learning. You develop your
intuition for what you're doing. So instead of cognitively offloading, you're cognitively enhancing.
Two, the question of authorship becomes clear: you're the author of what you choose. Three, you're
getting what you actually want. Whether this particular method is the right one, I can't say; it's
too early. But what it does is give definite human authorship, a definite human role. It gives human
documentation, human exploration, human intuition expansion. It gives more accurate and better
results, I think, at least so far. So can that happen? Or is that inadequately worshipful of the new
AI god, so that it would be repressed as heresy?

**[22:30] Danny Fortson:** Right, because in that, it is secondary. It is in service to you, as
opposed to vastly superior to you, with you as a supplicant.

**[22:43] Jaron Lanier:** Yeah. So the question is: do we want the oracle at Delphi or the library
at Alexandria? Which model is better for civilization?

**[22:55] Danny Fortson:** Stepping back: are you an optimist, here late in 2026?

**[23:01] Jaron Lanier:** Well, first of all, just to be clear, I'm a heretic, but I haven't been
expelled from the temple. I'm still called the Prime Unifying Scientist at Microsoft, one of the
places selling agents.

**Danny Fortson:** By the way, what is a Prime Unifying Scientist? I think that might be the coolest
title anybody on this pod has had.

**[23:20] Jaron Lanier:** I used to study cephalopod cognition, and it was a joke, because I'm in
the Office of the Chief Technology Officer, so overall it spells out octopus.

**Danny Fortson:** Gotcha. So that's where that comes from.

**[23:32] Jaron Lanier:** Prime Unifying Scientist, right. A funny job title is not unique; there
are a lot of those in Silicon Valley. What is unique is I speak my mind even when it's pretty
unfiltered, as it has been in this interview, and I just make clear I'm not speaking for Microsoft.
We have an arrangement for that, and Microsoft stock is fine. We haven't imploded. I just want more
Silicon Valley companies to notice that and allow their people to speak.

One of the things that I find very depressing is this long sequence of people who feel they have to
leave places like, well, Meta famously, but also Anthropic and OpenAI and Google, to protest what's
going on. How much better would we be, as a community and as servants of mankind, if instead of
people feeling they have to leave — I mean, we are becoming a de facto government of the world. Why
can't we have debates and open discussions within ourselves? Why can't somebody in Meta or OpenAI or
Anthropic or Google or wherever say: I love the community, I love the technology, I think what we're
doing is the wrong way of bringing it out, I really think this is going to do damage. Why can't
somebody say that without having to quit? That's a huge cultural problem.

When you asked before how this all happened, that's a lot of the mechanism. When you have a
community that overall rejects the idea of discussion or disagreement within it, you end up with
this thing that narrows and narrows and narrows and ties itself into a little knot. And since there's
no such thing as a perfect thought or perfect understanding, the tighter you get, the more likely you
are to fall into something that's ridiculous.

**Danny Fortson:** Right. On that happy note — [laughter]

**[25:24] Jaron Lanier:** Oh yeah — and am I an optimist? Yeah, sure. Look, if you look at the
history of people, we've survived all kinds of nonsense in the past. Some of it wasn't as different
as it might seem from this. We've often made each other suffer terribly for it.

**[25:42] Danny Fortson:** I have a sense, and I'd love your thoughts on this, that the people
building this technology, from Elon Musk to Dario Amodei to Sam Altman, view themselves as the hero
in the story: they are going to save us all. And it feels dangerous that they're like: OK, we were
making this doomsday device, but don't worry, we are the virtuous ones who are going to build it in
a way that makes it all right for all of us. It's almost juvenile, this view that they are our
heroes and they're going to save us.

**[26:25] Jaron Lanier:** One of the things is that computer networks often have a structure where
things called network effects create natural monopolies on one layer or another, which then become
more and more reinforced. They do have a tendency to create these mega-powerful individuals at the
center of them. I would prefer to see better governance of these things, because they are so
important and influential. But at any rate, we have a rather small number of individuals who are now
the beneficiaries of those network effects, and they tend to be — not always — the type of person
who is better at dealing with the digital stuff and looking away from what might be side effects of
it. But the people are all different. They're not cookie cutters.

Another thing that happened is people got addicted to their own devices. Some of these people I've
known a little, and some of them a little more, over the years, and some of them have really changed
from interacting with their own things. I think Elon Musk was changed by Twitter, by the constant
interaction with it, to become more narrow and hardened, in a way. The same thing happened to Donald
Trump, who I used to know a little bit. Now, that's not true for all of the people in this position,
but the overall setup doesn't allow somebody to be a good actor in that role. There's not really a
way to be a good actor as the CEO of one of these companies.

**[28:07] Danny Fortson:** Right, because you'd just be destroyed. But that's Anthropic's whole
thing: we are the good guys, we are the ones doing this.

**[28:15] Jaron Lanier:** OK, let me say a couple of things about Anthropic. One is, I have many
friends at Anthropic, and many of the people I respect the most, and think are in fact the best
human actors in the community, work there. That said, if somebody really feels a need to call out
that what the company's doing is wrong, they have to leave, and that's a drag. But let's leave that
aside for a second.

Anthropic, like OpenAI, was founded on the self-proclamation that we're the good guys. OpenAI is
called OpenAI because that was supposed to signify being a good guy. Anthropic, though, is the most
religious of them all. Anthropic has teams internally who are concerned with the well-being of the
model, as opposed to the human users — this idea that the model itself is having feelings. And
they've said the best way to ensure human safety is if you make the model feel good, it'll be less
likely, although no guarantee, to do damage to people. So in terms of self-regard, they definitely
think they're the best people, and in some ways they are. They have hired great people. I have to
say, if you're an ethical, interesting person working in AI and you want a job, you're more likely to
get it at Anthropic than anywhere else. However, the official Anthropic position is more worshipful
of the new AI god than anyone else's, and ultimately that's so damaging that it trumps anything else.
When you're embedded in a deep belief community, you lose perspective. I really believe the people
involved will someday come to have a sense that they could have done better, and will realize that
they were embedded in this crazy, cultlike atmosphere.

**Danny Fortson:** Again, on that happy note — [laughter]

**[30:09] Jaron Lanier:** I really believe we'll come through it. ⟦a few words lost in the
captions⟧

**[30:14] Hosts:** I think that's the first time we've had an octopus on the podcast. — Yes, indeed.
First time for everything. — It's really fascinating to hear his perspective, particularly this week
of all weeks, just following the Anthropic IPO document. — Yes, indeed. But that is it for this
week's episode. We've given you, as usual, two episodes of the Times Tech Podcast, so please come
back next week, or subscribe and follow us on YouTube, Spotify, Apple Podcasts, wherever you get your
podcasts. — See you next week. Keep future gazing. Goodbye.

*Compiled from YouTube's automatic captions; cleaned as described in the header.*
