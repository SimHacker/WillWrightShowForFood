# Planted audience — guests, curators, running gags

**Spec:** [`../../../process/ticket-pr.yml`](../../../process/ticket-pr.yml) (`guest_primed_audience`, `planted_audience`)  
**Ethics:** [`../../../schemas/fictional-audience.yml`](../../../schemas/fictional-audience.yml)

---

## The idea

Repo Shows borrow **late-night and game-show audience energy** — planted bits, costumes,
recurring characters — but keep it **honest in git**:

| Tradition | Repo Show equivalent |
|-----------|---------------------|
| Celebrity in audience | Consented human TicketPR + costume.yml |
| Recurring comedy character | `running_gag: true` + CARD abilities |
| Talk-show balcony | [`process/repo-show-regulars.yml`](../../../process/repo-show-regulars.yml) + show `audience/` overlays |
| Price Is Right "Come On Down" | [`costume.yml`](costume.yml) + Don call-on |
| Virtual / puppet plant | `fictional_*` type + `planted.disclosure: true` |

**Virtual Sims interrogating Will Wright** = on-brand entertainment when labeled fiction — not
astroturfing, not fake fan letters.

---

## Who may plant audience?

| Author | Directory | Consent |
|--------|-----------|---------|
| **Fan** | `audience/<github-username>/` | Self-sovereign |
| **Guest** | `audience/guest-primed-<slug>/` | Guest opens or approves PR |
| **Curator** | `audience/fictional-<slug>/` or `guest-primed-*` | Guest welcome; disclose in README |
| **Cross-show regular** | `process/repo-show-regulars.yml` + show `audience/` overlay | Show format; always disclosed |

Guests **may merge fan TicketPRs** and **add their own** pre-primed virtual children, running
gags, and costume plants before air.

---

## Required yaml (planted / virtual)

In `CHARACTER.yml`:

```yaml
character:
  type: fictional_game_character   # or fictional_bot_audience, audience_member, …

authorship:
  by: guest                        # guest | self | curator
  guest_ref: characters/will-wright/   # when by: guest

planted:
  disclosure: true                 # required for virtual and costume plants
  running_gag: false               # true = recurring bit across segments/shows
  on_air_wink: "Planted audience — see audience/<id>/ in the repo"

representation:
  fictional: true                  # when virtual
  not_official_ea: true            # when game character
```

In `questions.yml`:

```yaml
ticket:
  planted: true
  running_gag: false
  authored_by: guest
```

---

## Running gags

A **running gag** is a planted audience bit that **returns** — same voice, catchphrase, or CARD
ability each segment or each show.

Examples on Will Wright kickoff:

- **Row Twelve Left / Right** — balcony heckle between topics
- **Slats** — RoboResurrection call-in; "it seemed to be the thing to do"
- **Ultimate Machine** — gongs segments that run long
- **Tragic Clown** — debuff joke when happiness mechanics come up
- **Bob Newbie** — palm → nose → eaten callback when promo photos appear

Configure in [`SIMULATION.yml`](SIMULATION.yml) — fire on topic or schedule.

---

## On-air disclosure

Don or the guest may say plainly:

> "That's our planted Tragic Clown — fiction, in the repo under `audience/fictional-tragic-clown/`."

Transparency **is** the ethics. The joke works because everyone can RTFR.

---

## Forbidden

- Deceased humans as audience speakers
- Living humans impersonated without consent
- Unlabeled virtual plants presented as real fans
- Bad-faith heckles (guest may still welcome sharp fiction)

---

## Copy paths

| Goal | Start from |
|------|------------|
| Virtual sim/object | [`../../will-wright/audience/fictional-bob-newbie/`](../../will-wright/audience/fictional-bob-newbie/) |
| Bot + Will photos | [`../../will-wright/audience/bot-slats/`](../../will-wright/audience/bot-slats/) |
| Cross-show heckler | [`../../will-wright/audience/fictional-tragic-clown/`](../../will-wright/audience/fictional-tragic-clown/) |
| Minimal fan TicketPR | [`questions.yml`](questions.yml) only |
