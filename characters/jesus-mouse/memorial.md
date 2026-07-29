# Remembering Jesus Mouse

Memorial mode — we represent and discuss Don Hopkins's published memoir. We do not interview him, invent his voice, or fabricate the Vatican “secret answer.” [Portrayal standards](../../schemas/portrayal-standards.md#memorial-mode)

**Public source:** Don's Hacker News comment, 16 January 2023, under [*A cab ride I'll never forget (1999)*](https://news.ycombinator.com/item?id=34398396) · cleaned text in [sources/hn-34398396.md](sources/hn-34398396.md)

He walked as **Jesus × Mickey Mouse** — not as a joke punchline alone, but as a stated design: invoke the two biggest archetypes in the American mind at once, so everybody already knows the wells, and embody their combination.

### How Python would import the inheritance (not just sounds)

Say **Jesus** as in **Christ**. Say **Mouse** as in **Mickey**. Add **the Wizard** (scepter, jester head, spell book).

Duckmouse binds *pronunciation*. Jesus Mouse binds the *lived inventory* — costume, wells, props, mission. Full inventory: [sources/latent-imports.md](sources/latent-imports.md).

```python
# from <module> import <dimension.aspect> as <local>
from jesus_christ import soul.jesus as jesus
from jesus_christ import hair.long as hair
from jesus_christ import beard.long as beard
from jesus_christ import archetype.american_myth as jesus_well
from jesus_christ import mission.second_coming_test as vatican_test
from jesus_christ import mission.liquidate_treasures_for_the_poor as mission

from mickey_mouse import soul.mickey as mouse
from mickey_mouse import costume.hat as hat
from mickey_mouse import costume.long_tail as tail
from mickey_mouse import archetype.american_myth as mouse_well

from the_wizard import props.walking_stick as scepter
from the_wizard import props.jester_head.purple as jester_head  # tongue + key
from the_wizard import props.spell_book.sequined as spell_book

class JesusMouse(Jesus, MickeyMouse, Wizard):
    wells = (jesus_well, mouse_well)
    look = hair | beard | hat | tail | scepter | jester_head | spell_book
    body = 1
```

That is Self multiple inheritance on the street — one body, two American myth wells, wizard props, combined. He told Don that was the point.

Thread echo (same HN page):

> **sparks1970:** I think Jesus Mouse was onto something. I've been to the Vatican. I don't think Jesus would have been impressed.

**Soul Model receipt:** blended soul vs two minds — [SOUL-MODEL.md § Jesus Mouse](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md#jesus-mouse--blended-soul-vs-two-minds)

**Kin:** [Donald Michie — Duckmouse](../donald-michie/) — parallel import gag, opposite axis: `from donald_duck import pronunciation.donald as donald` / `from mickey_mouse import pronunciation.mmickey as michie`. Cartoon alchemy as said name (colleagues + biology), not costume.
