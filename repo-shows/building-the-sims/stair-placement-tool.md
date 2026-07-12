# Stair placement tool

*Build-mode complexity — Don's primary pet peeve from The Sims 1 CTG era. Related to pool rescue
scenarios in [`pool-qa.md`](pool-qa.md).*
[Portrayal standards](../../schemas/portrayal-standards.md)

## Behavior (Don's memory)

The stair placement tool coupled several concerns:

- **Multi-floor** editing — which level is active
- **Pivoting** stair runs in isometric space
- **Floor openings** — punching holes in floor topology on placement
- **Undo/redo** — state spanning multiple prior tool operations
- **Direct manipulation** — coupled degrees of freedom (Don describes it as a Rubik's-cube feel)

## Interaction with pools

QA and dev testing reportedly included **stairs placed inside pools** as attempted rescue paths.
That combines this tool with the pool layer and multi-floor logic — see [`pool-qa.md`](pool-qa.md).

## Discussion prompts

- What invariants did the tool try to preserve?
- What broke most often in QA?
- What would you build differently today?

## See also

- [`swimming-pools-objects-or-rooms.md`](swimming-pools-objects-or-rooms.md)
- [`qa-bug-pile.md`](qa-bug-pile.md)
