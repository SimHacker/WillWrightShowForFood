# Dan Bornstein — conversation hooks

Public work first, shared ground second, show segments last.
Standards: [portrayal-standards](../../schemas/portrayal-standards.md).

## Public work

1. **Dalvik** — a register-based VM designed for phones that were
   poor in RAM and battery: dx-compiled bytecode, shared clean
   memory across processes via Zygote, the tradeoffs against stack
   machines. How the constraints shaped the design, and what he'd do
   differently now that ART replaced it.
2. **Danger** — the hiptop/Sidekick era: a Java-language platform on
   a phone before Android, the dress rehearsal nobody frames that
   way.
3. **Kaleida ScriptX** — the object system: what the dispatch model
   really was, what shipped versus what lived on branches. Don
   recalls CLOS-like multimethods and a Scheme-like syntactic
   surface, both Dan's work — and wants Dan to refresh his memory,
   if he remembers ([README](README.md)).
4. **milk.com** — a personal domain older than most guests'
   careers; the Wall o' Shame as proto-blogging, still
   [making Hacker News](https://news.ycombinator.com/item?id=47102576).

## Shared ground

- **Kaleida days** — Don and Dan worked together in the ScriptX era
  and Don remembers it as one of the great jobs ("an object-oriented
  multimedia Lisp machine — so fucking fun"). Stickers, bagel
  policy, logo guidelines: the material culture of a lab that
  believed in objects.
- **The Conscientious Objectors meetup** — ScriptX object-system
  team × Self team at Kaleida, talking objects with David Ungar's
  crew. Don coined the name; Don thinks Dan was in the room.
  Cross-examine memories with
  [David Ungar](../david-ungar/README.md) — attendee list, what was
  argued, who conceded what.
- **Korz and multiple dispatch** — Korz demotes the receiver to one
  dimension among many
  ([the cauldron](../david-ungar/korz/README.md)); CLOS, Dylan, and
  (per Don's recollection) ScriptX shipped the N-argument ancestor.
  Would a VM engineer who's actually built multimethod dispatch buy
  symmetric dispatch over a whole context — and what does he think
  it costs?
- **Crystallize/deopt from the Dalvik side** — Korz′'s two tiers
  lean on Self's adaptive-optimization story
  ([design](../david-ungar/korz/design.md)); Dalvik-to-ART is a
  production case of swapping execution tiers under a live world.
  Where does VM experience say the tier boundary wants to sit?
  (Same question we're asking Ungar —
  [ask-david](../david-ungar/korz/ask-david.md).)

## Show segments

- **Kaleida show-and-tell** — K-Men stickers, the bagel policy, the
  logo guidelines that may survive only in memory; Wikipedia
  article archaeology with the Kaleida alumni.
- **"Refresh my memory"** — Don states his ScriptX multiple-dispatch
  recollection on air and Dan corrects, confirms, or complicates it;
  living oral history of a dead great language.
- **The dispatch panel** — Dan + David Ungar on symmetric dispatch:
  one built the multimethods, one is dissolving the receiver;
  moderated by the troll who blends his heads
  ([exhibit](../david-ungar/korz/examples/troll-blend.md)).
