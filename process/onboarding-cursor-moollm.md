# Cursor + MOOLLM onboarding — for guests who want the full instrument

*Optional power tier. Linked from the
[portrayal standards](../schemas/portrayal-standards.md#onboarding). A plain
[GitHub account](onboarding-github.md) — or just email — is completely enough to participate;
this page is for guests who want to play the repo like an instrument.*

## Why bother

**Cursor** ([https://cursor.com](https://cursor.com)) is an editor with an AI agent built in. The
practical magic for non-programmers: **you use git in natural language.** Say *"pull the latest
changes,"* *"commit my edits to my room and write a good message,"* *"what changed since last
week?"* — and the agent runs the notorious command line for you. You read and write plain text;
it handles the plumbing. It also reads the whole repo, so you can ask *"where is my invitation?"*
or *"summarize the show I'm proposed for"* and get an answer with links.

**MOOLLM** is the operating system these repos run on: directories are rooms, YAML files carry
meaning in their comments, and **skills** are readable protocols the AI can follow — including
the Repo Show's own play-along skills. If you're committed enough to install Cursor, mount MOOLLM
too; that's where the instrument's manual lives.

## Setup (15 minutes)

1. **Install Cursor** — download from [https://cursor.com](https://cursor.com), sign in (free tier
   is fine to start).
2. **Get the three repos.** Make one folder (say `RepoShow/`) and clone these side by side — you
   can literally ask Cursor's agent *"clone these three repos into this folder"*:
   - [https://github.com/SimHacker/moollm](https://github.com/SimHacker/moollm) — the skill OS
   - [https://github.com/SimHacker/MicropolisCore](https://github.com/SimHacker/MicropolisCore) — SimCity/Micropolis, the running code
   - [https://github.com/SimHacker/WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood) — the show
3. **Open the folder as one workspace** (*File → Open Folder*). The three repos are designed to be
   mounted together — the show cites the code, the code demos on the show, and MOOLLM's skills
   drive both.
4. **Let it boot.** Ask the agent: *"Read moollm's skills/INDEX.yml and this repo's README and
   give me a tour."* MOOLLM's bootstrap does the rest — that's the point of it.

## What you can do once you're in

- **Edit your own room** in `characters/<you>/` and say *"commit and push my changes"* — done.
- **Walk your research bundle** on camera with the repo open — the Repo Show's native stage.
- **Run skills** — ask the agent to follow a play-along skill, spin a show seed, or check your
  portrayal against the [standards](../schemas/portrayal-standards.md).
- **Run Micropolis** — the code is right there; ask the agent to build and launch it.

## Honest framing

This tier takes real commitment. The [participation ladder](guest-participation-ladder.md) starts
at *record a phone video and email it* — every rung below this one is fully honored. But if the
command line is what's kept you away from git for thirty years, this is the workaround: natural
language in, version control out.

↑ [process index](README.md) · [GitHub onboarding](onboarding-github.md) · Girder: `onboarding-cursor-moollm.yml`
