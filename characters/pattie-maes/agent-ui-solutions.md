# Your slide 13

*For Pattie Maes, from Don Hopkins. Everything linked from here is public work. Corrections are
welcome: [portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md).*

Pattie —

My friend Cyrus Shaoul was in the audience at your talk this week and sent me a photo of slide 13
from your January 1997 deck, "Agent UI solutions." I've spent months writing about your debate with
Ben Shneiderman, and that slide is the best summary of where I ended up. You had the list in 1997.

> **Agent UI solutions**
>
> - make user model available to user
> - method of operation has to be understandable to user
> - explanations should be available
> - gradual approaches work best
> - give continuous feedback to user about agent's state, actions & learning
> - allow variable degrees of autonomy (user decides)
> - allow user programming of the agent (teach/forget)
> - avoid making user learn a new language; use language of application to communicate between
>   agent & user
>
> *Pattie Maes, MIT Media Laboratory · Software Agents Debate, Jan '97 · slide 13*

Cyrus says you ended the panel by saying that most AI tools today don't take the human into
account. That's his paraphrase, not your words. Measured against this slide, most of them fail
nearly every bullet.

## The argument in one sentence

**Anything an agent can do, a person should be able to do through the same interface, and no
capability should be reachable only by asking the agent.** I call that an *interface to agency*,
rather than agents instead of an interface:
[INTERFACE-TO-AGENCY.md](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md).

Put that way, your eight bullets stop being a list of separate features. They follow from one
design choice: the agent and the person share the same visible controls.

| Your bullet | What it looks like when the agent shares the interface |
|---|---|
| make user model available | Allen Cypher's Eager turned the button or menu item it predicted green *before* acting, and corrected itself from your actual choice. In MOOLLM the agent's state is a visible, revertible file ([the state is a file](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-state-is-a-file.md)). |
| method of operation understandable | In The Sims, objects advertise what can be done with them. The pie menu the player picks from and the list the Sims' autonomy scores are the same list ([The Sims](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-sims.md)). |
| explanations available | The agent says what it did by pointing at what changed: on screen as the controls moving, or on disk as a diff. |
| gradual approaches | One queued action at a time, each visible before it runs, rather than one opaque leap. |
| continuous feedback on state, actions & learning | The Sims' action queue shows what a Sim will do next and lets you cancel it. Learning shows up as a change you can read and revert. |
| variable autonomy, user decides | The Sims shipped a free-will switch. Sims could run their own queues, take yours, or both. |
| user programming, teach/forget | Programming by demonstration in both directions: you do it and the agent generalizes, or the agent does it through the same controls and you watch and learn. Teach is a commit; forget is a revert. |
| use the language of the application | The agent uses the application's own verbs and controls, not a private API, so its actions are things you could have done yourself. [Screen Angel](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/screen-angel.md) works a closed program through nothing but its screen, mouse and keyboard. |

## What the debate record lost

I wrote up the published transcript ("Direct Manipulation vs. Interface Agents," *interactions*
4(6), 1997) here:
[AGENTS-DEBATE-1997.md](https://github.com/SimHacker/moollm/blob/main/designs/AGENTS-DEBATE-1997.md).
In short:

- **It ended in agreement.** Ben: "I like the new Pattie. I am ready to be partners and collaborate
  with the new Pattie." You: "I think we both have changed." The field kept the dichotomy and
  dropped the convergence.
- **Ben quoted your first bullet back at you, approvingly:** "Make the user model available to the
  user… I don't see that being done in most of the work about agents." His complaint was that the
  field wasn't meeting your standard, not that the standard was wrong.
- **Your stakes point has aged best.** You chose domains where a wrong answer is "not a big deal,"
  because agents won't always be right. That's more cautious than most of what ships in 2026, which
  points agents at code, money and email.

## The answer that was in the room

A questioner asked for a "Shneider-Maes" synthesis, and nobody named one. Ben, from the stage, asked
for it by name: "we have no graphical macros tools… This is the greatest opportunity for visual
programming." That's programming by demonstration. And you pointed to it: "Henry Lieberman, sitting
here in the audience," citing his work on teaching an agent by demonstration. Henry co-edited
*Watch What I Do* (Allen Cypher, ed., MIT Press, 1993; [full text](http://acypher.com/wwid/)).

Cyrus says Henry is at the same event this week.

Ted Selker's COACH at IBM Almaden was the other answer in reach: proactive and adaptive, as you
asked, but advisory rather than acting on the user's behalf, and backed by a user study.

What changed is that the wall both ran into, inferring intent from one or two examples, has moved.
Allen Cypher now writes that "with the advent of Large Language Models, my dream of End User
Programming has come true." The open question is whether it came true in the form your slide asks
for. Vibe coding mostly doesn't: nothing turns green before it acts.

## Questions I'd love your take on

1. Which of your eight bullets do today's AI tools fail worst?
2. Was programming by demonstration what you had in mind for "allow user programming of the agent"?
3. Does the rest of the January 1997 deck survive? The *interactions* transcript is the only record
   most people cite, and slide 13 says a lot that it doesn't.
4. Do you remember who the floor speakers were? The transcript labels them only "Question."

I'd love to talk about any of this, in whatever form suits you: email, a call, or one of the Repo
Shows below. Cyrus can connect us.

## More to read

- **The argument:** [An interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md),
  in six parts: [The Sims](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-sims.md) ·
  [DreamScape, 1995](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/dreamscape.md) ·
  [the errand](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-errand.md) ·
  [Screen Angel](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/screen-angel.md) ·
  [Ebike Safari](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/ebike-safari.md) ·
  [the state is a file](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-state-is-a-file.md)
- **Why the dichotomy outlived its answer:** [Axes, not camps](https://github.com/SimHacker/moollm/blob/main/designs/AXES-NOT-CAMPS.md)
- **The 1997 debate, from the transcript:** [AGENTS-DEBATE-1997.md](https://github.com/SimHacker/moollm/blob/main/designs/AGENTS-DEBATE-1997.md)
- **The people in this story:**
  [Ben Shneiderman](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ben-shneiderman/README.md) ·
  [Henry Lieberman](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/henry-lieberman/README.md) ·
  [Ted Selker](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ted-selker/README.md) ·
  [Brad Myers](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brad-myers/README.md) ·
  [Cyrus Shaoul](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/cyrus-shaoul/README.md)
- **Your page here:** [pattie-maes/](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/pattie-maes/README.md),
  which you can correct, extend or delete.

One request: this repo is in quiet mode while invitations go out, so please don't share the links
publicly yet.

— Don
