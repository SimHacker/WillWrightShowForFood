# Fictional audience — Will's virtual children interrogate their creator

Seeded **TicketPR** personas for the kickoff show: game characters, bots, and tool-personae who
ask Will pointed questions — loving, warm, sometimes harsh. Sims fan in-jokes welcome.

**Schema:** [fictional-audience.yml](../../../schemas/fictional-audience.yml) · **Onboarding:** [README.md](README.md) (the welcome packet)

---

## The bit

> Will gets interrogated by his **virtual children** — his creations — in the `audience/` folder
> before and during the Repo Show. Not TicketMaster. **Master ⇒ PR.**

They're the **warm-up act**: clearly-labeled fiction that shows newcomers exactly how a TicketPR
works, and makes an empty `audience/` folder impossible — without ever being dishonest. "Obvious
plant" and "celebrity audience member" are features, not bugs (late-night tradition, in git).

Don Philahue (the AI orchestrator — **not** Don Hopkins) harvests these alongside human TicketPRs.
Will may merge, reply, or ignore — guest's call.

**Guests plant audience too.** Will (or any guest) may open PRs under `audience/` — virtual
characters, costume plants, **running gags** — same late-night energy, **labeled in git**.
Guide: [PLANTED-AUDIENCE.md](../../_TEMPLATE/audience/PLANTED-AUDIENCE.md).

---

## What we allow

| Kind | Example | Ethics |
|------|---------|--------|
| **Sims game characters / objects** | Bella Goth, Tragic Clown, Cow Plant | Labeled `fictional_game_character`; fan voice; not official EA dialogue |
| **Repo bots** | [Slats](../../../characters/slats/), [Ultimate Machine](../../../characters/ultimate-machine/) | `character_ref` to `characters/`; fictional; may quote documented transcripts |
| **Tool personae** | Edith (SimAntics), Transmogrifier (UGC) | Personify the TOOL, not a human |
| **Guest-primed plants** | Will adds a running gag or virtual child via PR | `authorship.by: guest`, `planted.disclosure: true` |
| **Running gags** | Broken Robot, Slats robopoetry, Ultimate Machine gong | `running_gag: true`; recurring CARD / SIMULATION hooks |
| **Self-aware AI character** | [Palm](palm/) — freed Monkey's Paw philosopher | `fictional_ai_character`; knows it's simulated; **our brand** |
| **Consented real self-author** | [Richard Bartle](richard-bartle/) — MUD1 co-creator | Real person, explicit consent, **writes his own questions** |
| **Honored real guests** | [Heather Alvey](heather-alvey/), [Steve Alvey](steve-alvey/), [Phil Salvador](phil-salvador/) | Real, invited, front-row/box; write their own |

---

## What we forbid

**Deceased real humans speaking in `audience/`.** Do not put words in the mouths of Dani Berry,
Marvin Minsky, or anyone in memorial mode. We **represent and discuss** them in
`characters/<id>/memorial.md` and invite **living** people who knew them to speak.

The Sims dedication to Dani is tribute in prose — not a fake Dani TicketPR.

Same for living humans: no impersonating guests or fans without consent.

---

## Seeded roster

⭐ = filled `images/` (headshot, 128² avatar, with-guest) — copy these as your starting point.

| Directory | Who | Tone |
|-----------|-----|------|
| [bot-slats/](bot-slats/) ⭐ | Slats + Will photos | **Example** — copy this |
| [fictional-bob-newbie/](fictional-bob-newbie/) ⭐ | Bob in Will's hand | **Example** — promo trilogy |
| [palm/](palm/) | Palm 🐒✋ (self-aware AI) | What's it like to be a Sim? |
| [fictional-bella-goth/](fictional-bella-goth/) | Bella Goth | Missing-poster energy |
| [fictional-tragic-clown/](fictional-tragic-clown/) | Tragic Clown 🤡 | Balcony left — weeping heckler |
| [fictional-killer-hamster/](fictional-killer-hamster/) | Killer Hamster | Wheel of doom |
| [fictional-grim-reaper/](fictional-grim-reaper/) | Death 💀 | Balcony right — 🤡💀 duo |
| [fictional-social-bunny/](fictional-social-bunny/) | Social Bunny | Loneliness hallucination |
| [fictional-edith-ghost/](fictional-edith-ghost/) | Edith tool ghost | SimAntics |
| [fictional-transmogrifier/](fictional-transmogrifier/) | The Transmogrifier 🧪 | User-created content incarnate |
| [fictional-simant-black-ant/](fictional-simant-black-ant/) | Black ant (SimAnt) | "Too easy" post-mortem |
| [fictional-simant-red-spider/](fictional-simant-red-spider/) | Red spider (SimAnt) | Misunderstood hero |
| [fictional-spore-creature/](fictional-spore-creature/) | Spore creature | Cell → space |
| [fictional-cow-plant/](fictional-cow-plant/) | Cow Plant 🐮🌱 | Feed-me-Seymour + Chain Chomp |
| [fictional-some-sneaky-sim/](fictional-some-sneaky-sim/) | Some Sneaky Sim | Canonical burglar; sympathetic |
| [fictional-little-computer-person/](fictional-little-computer-person/) | Pixel + dog 🧍💾🐕 | The 1985 Sims ancestor |
| [fictional-seaman/](fictional-seaman/) | Seaman 🐟 | Asks Will's embarrassing Qs for Yoot |
| [fictional-broken-robot/](fictional-broken-robot/) | Broken Robot 🤖🔧 | Running gag — crashes, begs, dragged off |
| [fictional-zombie-sim/](fictional-zombie-sim/) | ZombieSim 🧟 | The crew's +1 |
| [fictional-gaia/](fictional-gaia/) | Gaia 🌍 (SimEarth) | "even though the earth is our mother, we sure treat her like dirt"; Pee-wee's Globey |
| [fictional-simcity-advisor/](fictional-simcity-advisor/) | SimCity Advisor | The nag you clicked away |
| [fictional-llama/](fictional-llama/) | The Llama 🦙 | Maxis absurdist running gag |
| [fictional-museum-curator/](fictional-museum-curator/) | Museum Curator 🏛️ | Archivist tribute (box w/ Phil) |
| [bot-ultimate-machine/](bot-ultimate-machine/) | Ultimate Machine 🔌 | Refusal koans; gong; closes the stream |

**Real guests (seated by invitation/donation):**
[richard-bartle/](richard-bartle/) (consented, self-authoring) ·
[phil-salvador/](phil-salvador/) (box seat w/ Curator) ·
[heather-alvey/](heather-alvey/) + [steve-alvey/](steve-alvey/) (front-row SimFreaks/SimSlice crew).

**More games & ideas:** [AUDIENCE-ROSTER-IDEAS.md](AUDIENCE-ROSTER-IDEAS.md) · **Machine index:** [INDEX.yml](INDEX.yml) · **Regulars spec:** [../../../process/repo-show-regulars.yml](../../../process/repo-show-regulars.yml)

---

## Seating — a property of characters, not a thing in itself

The balcony, box seats, front row, and orchestra pit are **seats** (places). Only **characters**
exist in the audience; each character **declares its own seat** as a property — `seating: { seat,
adjacent, attending_with, earned_by }`. The roster "who sits where" is **computed** from those
declarations (see [INDEX.yml](INDEX.yml)).

- **Donating beforehand** earns front/box/balcony seats — organic visibility, called on first.
  Never a paywall; free general admission is always picked on merit. (In-show § Simoleons are
  play-money and can't buy seats.)
- **Groups** attend together via a shared `attending_with` id (e.g. `simfreaks-simslice` = Heather
  + Steve + the ZombieSim they brought).
- **Floating** characters (the Tragic Clown) have no fixed seat — they *invade* and harass.
- **Orchestra pit** = sidekick / band-leader energy (Paul Shaffer / Guillermo); the Transmogrifier hums there.

---

## Add your own fictional audience

Fork → `audience/fictional-<slug>/` → copy the MOOLLM stack from [`../../_TEMPLATE/audience/`](../../_TEMPLATE/audience/) → set:

```yaml
character:
  type: fictional_game_character   # or fictional_bot_audience / fictional_tool_persona
representation:
  fictional: true
  not_official_ea: true
seating:
  seat: general          # or balcony_left, front_row, floating, …
```

Drop in any artifacts you want to show Will (within reason): a pointer to **your repo**, a small
program, a code example, an image. Sharp questions encouraged. Slurs and bad-faith bigotry are not.

---

## Simlish — speak the native tongue 🗣️✨ (cross-cutting; all Sims)

Just like the game: **thoughts are English, speech is Simlish.**

- A character's **written questions stay English** — they're *thoughts* (direct perception, like
  a thought bubble). Readable. No gibberish walls.
- **Simlish is rendered when SPOKEN** live. **Don Philahue is fluent** — greets Sims in Simlish,
  translates for the audience, orchestrates them asking/replying in Simlish.
- **Will may answer in Simlish**; Don translates. The creator speaking his creatures' tongue.
- **Used sparingly** — a greeting, an exclamation, a call-and-response. Humans may opt in; never required.

Optional per character: `speaks: simlish` + a one-line `simlish_voice` catchphrase.
Spec: [language-simlish.yml](../../../schemas/language-simlish.yml) · Interpreter: [don-philahue](../../../characters/don-philahue/CHARACTER.yml) · Example: [fictional-bella-goth/questions.yml](fictional-bella-goth/questions.yml)

---

## Ethics experiments (open discussion)

Spectrum in [audience-ethics-experiments.yml](../../../schemas/audience-ethics-experiments.yml):

| Tier | What | Default |
|------|------|---------|
| **Green** | Game characters (SimAnt, Spore, Sims, …) | Seed freely, label fiction |
| **Green+** | Consented real self-author (Bartle); honored real guests (Alveys, Phil) | Their words, their consent |
| **Self-aware AI** | Palm | Knows it's simulated; links home to MOOLLM |
| **Yellow** | Family memorial voice **Will authors** | Guest PR only; disclosed |
| **Orange** | Historical figures — **cited quotes only** | Experimental; guest ok |
| **Red** | Theological (Jesus, God, …) | **Off** until Will explicitly PRs |

**Dani Berry** stays memorial-discuss, not audience voice. **Jesus / God?** Open topic for Will
to reject or shape — we do not default-merge.
