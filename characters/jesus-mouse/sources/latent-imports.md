# Jesus Mouse — latent-space imports

Memorial inventory from Don's HN memoir ([hn-34398396.md](hn-34398396.md)).
Represent and discuss; do not speak as him.

Duckmouse binds **pronunciation**. Jesus Mouse binds **costume, wells, props,
mission, and street praxis**.

## Import convention

`from <module> import <dimension.aspect> as <local>` — spec syntax, not a runnable program.

| Piece | Means |
|---|---|
| `from <module>` | latent-space well |
| `import <dimension.aspect>` | dimension and aspect |
| `as <local>` | local name in this character |

**Decorate on import** — qualify a generic object in the dotted path + comment:
`props.jester_head.purple` plus tongue/key detail.

**`|` scat** — compose locals into a trait chord:
`look = hair | beard | hat | tail | scepter | jester_head | spell_book`
(trait union, not CPU bitwise OR).

Kin surface: [Declare](../../david-temkin/) — OpenLaszlo lineage named in a small language.

```python
# from <well> import <dimension.aspect> as <local>
# decorate-on-import: props.jester_head.purple — generic + specific traits
# | scat: look = hair | beard | hat | … — trait chord

# Jesus as in Christ · Mouse as in Mickey · Wizard as in the stick with the key

from jesus_christ import soul.jesus as jesus                 # soul → jesus
from jesus_christ import hair.long as hair                   # Jesus-like long hair
from jesus_christ import beard.long as beard                 # Jesus-like long beard
from jesus_christ import archetype.american_myth as jesus_well
from jesus_christ import mission.second_coming_test as vatican_test
from jesus_christ import mission.liquidate_treasures_for_the_poor as mission
from jesus_christ import praxis.public_declaration as declare_self  # Haight → Golden Gate Park

from mickey_mouse import soul.mickey as mouse                # soul → mouse
from mickey_mouse import costume.hat as hat                  # Mickey hat
from mickey_mouse import costume.long_tail as tail           # long tail
from mickey_mouse import archetype.american_myth as mouse_well

from the_wizard import props.walking_stick as scepter
from the_wizard import props.jester_head.purple as jester_head
#   ornate purple court jester; curling tongue; small key at tip
from the_wizard import props.spell_book.sequined as spell_book
#   thick, worn; fabric + sequins + runes; wrote in it constantly
from the_wizard import praxis.miraculous_encounter as encounter

from haight_ashbury import scene.coffee_shop_regular as hangout
from haight_ashbury import praxis.hippie_parade as parade
from tourism import economy.selfie_rate as selfie_rate        # $5 a shot

from the_wizard.props.scepter import decoration.blotter_paper as customs_camouflage


class JesusMouse(Jesus, MickeyMouse, Wizard):
    """Stated intention: embody the combination of America's two biggest myth icons."""

    wells = (jesus_well, mouse_well)
    look = hair | beard | hat | tail | scepter | jester_head | spell_book
    body = 1
    knows = vatican_test               # secret answer not in the memoir
    seeks = mission                    # liquidate Vatican art → give to the poor
    charges = selfie_rate              # Money(5)
    writes_in = spell_book
    last_sighting = ("Amsterdam", "Homegrown Fantasy Coffeeshop", "InterCHI '93")

    # Non-imports (Don's reading):
    #   belief.i_am_jesus — did not believe he *was* Jesus
    #   belief.in_jesus   — did not believe *in* Jesus
    #   lunatic.mode      — church-full-of-shit realist, not lunatic
```

## Module map

| Module | Imports |
|--------|---------|
| `jesus_christ` | soul well · long hair · long beard · American-myth archetype · Second Coming test · liquidate-for-the-poor mission · public declaration |
| `mickey_mouse` | soul well · hat · long tail · American-myth archetype |
| `the_wizard` | walking stick/scepter · purple jester head (tongue + key) · sequined rune spell book · blotter-as-decoration · encounter framing |
| `haight_ashbury` | coffee-shop regular · hippie parade |
| `tourism` | $5 selfie economy |

## Kin — Duckmouse

[Donald Michie — Duckmouse](../../donald-michie/) — pronunciation dimension only:

```python
from donald_duck import pronunciation.donald as donald
from mickey_mouse import pronunciation.mmickey as michie
```

Sounds vs lived inventory.

## Kin — Declare

[David Temkin — Declare](../../david-temkin/) · [`ideas.md`](../../david-temkin/ideas.md)
