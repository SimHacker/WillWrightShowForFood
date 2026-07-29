# Jesus Mouse 🕯️🐭✝️

*Memorial portrayal — we represent and discuss Don's published memoir; we do not
interview him or speak as him.* [Memorial standards](../../schemas/portrayal-standards.md#memorial-mode)
· authored by Don Hopkins

*True crime literature. The crime: they never crowned him Jesus.*

## Who

**Jesus Mouse** was a Haight Street coffee-shop regular (early 1990s) — Mickey Mouse hat, long tail, Jesus beard and hair, wizard stick with purple jester head (key on the tongue), sequined spell book. Charged tourists $5 for selfies. He told Don **explicitly** that he represented the **combination of the most prominent icons of American mythology** — Jesus and Mickey Mouse — so everybody already knew who he was, and he **embodied their combination**, inheriting from both.

Lived inventory (not pronunciation — that axis is [Duckmouse](../donald-michie/)). Spec: `from <well> import <dimension.aspect> as <local>`. Full list: [sources/latent-imports.md](sources/latent-imports.md).

```python
# from <module> import <dimension.aspect> as <local>
from jesus_christ import soul.jesus as jesus
from jesus_christ import hair.long as hair
from jesus_christ import beard.long as beard
from jesus_christ import mission.liquidate_treasures_for_the_poor as mission

from mickey_mouse import soul.mickey as mouse
from mickey_mouse import costume.hat as hat
from mickey_mouse import costume.long_tail as tail

from the_wizard import props.walking_stick as scepter
from the_wizard import props.jester_head.purple as jester_head
from the_wizard import props.spell_book.sequined as spell_book

class JesusMouse(Jesus, MickeyMouse, Wizard):
    look = hair | beard | hat | tail | scepter | jester_head | spell_book
    body = 1
```

He did not (as Don read him) believe he *was* Jesus; he believed he could pass the Vatican's own Second Coming test and then demand they liquidate the art for the poor. Last Don sighting: Amsterdam, InterCHI '93, Homegrown Fantasy Coffeeshop window. Later: passed away (relayed by a mutual friend).

## Why he's in this cast

He is the street proof of MOOLLM Self multiple inheritance — a **tangible example** for the [Soul Model](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md):

| Variation | Shape |
|-----------|--------|
| **What he lived** | One **soul** inherits Jesus *and* Mickey Mouse (blended incarnation) |
| **Different model** | One soul, **two minds** — Jesus-cup and Mickey-cup that may argue |

Not a Repo Show interview guest. Memorial + design receipt.

## Links

| | |
|---|---|
| **Memorial tribute** | [memorial.md](memorial.md) |
| **Latent imports (Python)** | [sources/latent-imports.md](sources/latent-imports.md) |
| **Story (HN text)** | [sources/hn-34398396.md](sources/hn-34398396.md) |
| **HN thread** | https://news.ycombinator.com/item?id=34398396 |
| **Soul Model** | [moollm SOUL-MODEL.md](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md) |
| **Machine index** | [CHARACTER.yml](CHARACTER.yml) · [CARD.yml](CARD.yml) |

*We celebrate the documented public story; we do not speak as him. Disney names used as cultural archetypes in design examples only.*
