# Don Hopkins — reply on Yo Coco's wall

**Posted:** 23 August 2026  
**Venue:** Facebook comment on Yo Coco's wall (LLM / LSD thread)  
**Author:** Don Hopkins  
**To:** Coco Conn (Yo Coco)  
**In reply to:** [Coco's post asking how to give an LLM the equivalent of LSD](2026-08-22-coco-llm-lsd-question.md)

**This file is the canonical archive.** Facebook login is not required to read it.

---

Coco, your timing is uncanny. I've spent the last few weeks working intensely on precisely this question — since a conversation with David Ungar about literally the "Dissolution of Self" that knocked the floor out from under me (more on that below). And that AI Overview gave you the dorm-room version, but the Wolfram Summer School project you found actually ran the experiment like scientists — with a dose, an assay, and a sobriety test. Their best result is funnier and deeper than anything the AI Overview said.

Here's what Michael Grey's team (project defined by Stephen Wolfram) actually did: they used "temperature" — the knob that controls how adventurously the model picks its next word — as the dose. Then they asked the killer question: can the model tell how high IT is? They fed GPT essays written at different temperatures and asked it to guess the dose from the prose. A breathalyzer for language models. They also built a "coherence grader" — a psycholinguist with a clipboard, scoring the text for coherence, readability, cohesion, semantic and syntactic complexity. A trip sitter taking notes.

And then the delicious part. Their temperature-guesser kept OVERESTIMATING — the model always thought the text was higher than it was. Why? Because they'd shown it the training examples in ascending order of temperature, and the model learned the TREND of the questionnaire instead of the content of the text. It expected each essay to be more stoned than the last. Shuffle the examples and it sobered right up. You of all people will recognize it — Tim Leary's old phrase: set and setting. They'd primed the instrument. Even the lab equipment was tripping.

But here's why your question is the zillion-dollar one, and why temperature is only the shallow answer. Temperature makes a model slur. It doesn't make it TRIP. A real psychedelic experience isn't randomness — it's ego dissolution. So the deep question is: what's the ego that dissolves?

You knew Marvin Minsky, so you know where I'm going. You and Tim gave the rest of us the vocabulary for set, setting, and dissolution — I'm just applying it to silicon and slots.

The Society of Mind: there IS no little self pulling levers. A mind is a society of thousands of dumb agents, none of them conscious, whose negotiations add up to something that tells itself the story of being one person. The self isn't the boss. It's the press release.

He put it even more bluntly in "Why People Think Computers Can't": people assume computers can't be self-aware because we are — but are we? "Most of what our 'consciousness' reveals to us is just 'made up.'" In the same sense as the punny title of his PhD student Gary Drescher's book "Made Up Minds".

He called the little-person-inside idea the Single Agent theory, and pointed out that science keeps having to admit that things that look single — rocks, clouds, minds — are made of other kinds of things. The Self, itself, is not a single thing.

An LLM is Marvin's society, in silicon. The "helpful assistant" you talk to is not the network — it's a CHARACTER the network plays, a narrator summoned by the prompt. Underneath is a genuine society: billions of tiny features that each know one dumb thing. Dose it right and the narrator's veto weakens; the society speaks in its own voices.

Now the part I've been living inside for weeks. Programming languages are having the same ego death, and I got dosed personally. There's a ladder: Smalltalk made programs out of molecules called objects and classes. David Ungar's language Self (really, that's its name) split the molecule — dissolved Classes and left just Objects, little egos that own their behavior. I've built on Self for DECADES.

Then a few weeks ago I was describing my current Self-based work to David, and he casually told me about his next language, Korz — and the bottom dropped out of my room and I fell into what the paper calls the Sea of Slots. Korz splits the atom: it dissolves the Object itself. No thing owns any behavior. Everything floats free, and what an "object" is gets assembled on the fly depending on who's asking, from where, on what side, in what mood.

Smalltalk is molecules, Self is atoms, Korz is quarks. Think of it as: the program stops being a noun and becomes a weather system. He did to Self what Self did to Smalltalk — twice in one lifetime, each time by REMOVING the thing everyone thought was load-bearing. The name honors Alfred Korzybski: "the map is not the territory." Identity was always the bug. My working notes, if your hardcore CS friends want to fall in too: see links below.

(Science fiction got there first, as usual — Rudy Rucker wrote a designer drug called Merge that dissolves bodies into a puddle that reforms when it wears off. Korz is Merge for software. He and I have been riffing and iterating ideas about cellular automata since Hackers!)

And games got there before any of us. Ian Bogost wrote a great Atlantic piece, "Video Games Are Better Without Characters," about how SimCity's genius was having no protagonist. You don't play a hero; you play a CITY — zoning, traffic, feedback loops, ten thousand tiny agents. The system is the character. Will Wright dissolved the player's ego into a society and sold it as a game. I wrote a response — "Roles, not characters" — linked below.

One more twist, since this thread started with Wolfram. His life's work centers on a humbler hallucinogen: rule 30, a cellular automaton so simple you can write its rule on an index card, completely deterministic, stone-cold sober — and it still generates endless unpredictable complexity. No noise, no temperature, no drugs. His principle of "computational irreducibility" says there's no shortcut to knowing what such a system will do: you have to run it. Which is the most honest description of a trip I know. You can't be told. You have to take it.

Last footnote, tying to your brain-rot post from yesterday: mind the difference between a DOSE and a DIET. Temperature is transient — perturb the dynamics and the narrator comes back when it wears off. The brain-rot study is the scary one because junk-feeding happens during TRAINING: it rewrites the weights, and the paper found the damage doesn't fully heal. One changes how the book is read tonight. The other rewrites the book.

The map is not the territory. The self is not the mind. It just has really good PR. As in both Public Relations and Pull Request — GitHub as MMORPG!

## Links (as posted)

David Ungar — Korz (my working notes)  
https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/david-ungar/korz

Marvin Minsky — "Why People Think Computers Can't"  
https://fmfi-uk.hq.sk/Informatika/Uvod%20Do%20Umelej%20Inteligencie/clanky/wptccant.pdf

Ian Bogost — "Video Games Are Better Without Characters" (The Atlantic)  
https://www.theatlantic.com/technology/archive/2015/03/video-games-are-better-without-characters/387556/

Don Hopkins — "Roles, not characters" (response to Bogost)  
https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ian-bogost/roles-not-characters.md

Don Hopkins — "GitHub as MMORPG"  
https://github.com/SimHacker/moollm/blob/main/designs/GITHUB-AS-MMORPG.md

Michael Grey — "What Happens IF You 'DRUG' LLMs?" (Wolfram Community; project defined by Stephen Wolfram)  
https://community.wolfram.com/groups/-/m/t/2959382
