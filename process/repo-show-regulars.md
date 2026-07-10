# Repo Show regulars

[TicketPR](ticket-pr.md) · [Fictional audience schema](../schemas/fictional-audience.yml) · [Will premiere audience](../repo-shows/will-wright-premiere/audience/)

---

## The hook

Cross-cutting audience mascots who make every Repo Show work — balcony hecklers, fictional Sims, repo bots. Gentle grumpy hecklers, beloved bots, famous Sims — on-brand fans. **Not deceased humans.**

## Sims balcony — 🤡💀

| Seat | Character |
|------|-----------|
| Left | Tragic Clown (painting) |
| Right | Death (Grim Reaper) |

Muppet Show balcony energy — original characters, never Statler/Waldorf names. Clown sobs a heckle; Death punctures with one word; guest tries to answer both.

Slats (orchestra pit) and Ultimate Machine orbit the bit.

## The Glick Gallery — 🎙️🥪

Labeled-fiction presenter foils — [Don Philahue](../characters/don-philahue/README.md)'s unethical
Cunk/Glick cousins (Smarmy Glickfeld, Rex Upsell, Paula Gotchya, Vic Rerun). Each personifies an
interviewing sin the show's standards forbid; Philahue cuts their mic and ejects them, deadpan.
Guests are in on the bit before any of them enters a segment.
Spec: [`GLICK-GALLERY.yml`](../characters/menagerie/GLICK-GALLERY.yml)

## Kinds

| Kind | Home |
|------|------|
| Balcony hecklers | `repo-shows/<show>/audience/fictional-<slug>/` |
| Fictional Sims | Same — show-scoped TicketPR |
| Repo bots | `characters/<bot>/` + per-show overlay |

Running gags: set `running_gag: true` in CHARACTER.yml. Ethics: disclosed planted/fictional; never impersonate living humans without consent.

## Show hooks

- **Balcony intro:** Name the house regulars — labeled in repo.
- **Slats call-in:** Orchestra pit bot surfaces TicketPR question.

## Deeper links

| Topic | Where |
|-------|--------|
| Planted audience guide | [../repo-shows/_TEMPLATE/audience/PLANTED-AUDIENCE.md](../repo-shows/_TEMPLATE/audience/PLANTED-AUDIENCE.md) |
| Slats judge rubric | [../characters/robots/slats/judge-rubric.yml](../characters/robots/slats/judge-rubric.yml) |

↑ [process index](README.md) · Girder: `repo-show-regulars.yml`
