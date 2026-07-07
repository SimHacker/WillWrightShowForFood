# Ideas to explore with Oliver Steele 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Oliver's
public work and documented connections to this repository. Things Don would love to follow
**with** Oliver Steele; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## Shows

| Show | Seed |
|------|------|
| **Solo — Instance-First** | [`repo-shows/oliver-steele/`](../../repo-shows/oliver-steele/) |
| **Group — OpenLaszlo reunion** | [`repo-shows/openlaszlo/`](../../repo-shows/openlaszlo/) |

## The hooks

### 1. Instance-First Development (2004)

[*Classes and Prototypes*](https://blog.osteele.com/2004/03/classes-and-prototypes/) — implement
functionality for a **single instance**, refactor into a **class** only when a second case appears.
*"It's easier to generalize from two examples than from one."* Don's MOOLLM **LIFT** gate is the
same method: dogfood the instance, hoist the shared parent when a second real caller earns it.

### 2. Instance Substitution Principle

An instance of a class can be replaced by the **definition of the instance** without changing
program semantics — because class-member and instance-member definitions are **syntactically
parallel**. **LZX** had it: define a `<class>` and its name becomes a tag; an instance and its class
read the same way. JavaScript 1.x violates this (Steele's own critique) — the "prototypes with a
class veneer" complaint in [`slots-all-the-way-down`](../david-rosenthal/slots-all-the-way-down.md).

### 3. LZX architecture — compilers, runtime, constraints

Chief Software Architect at Laszlo Systems: XML + JavaScript → Flash *or* DHTML/Ajax; reactive
state; data binding; animation. **Garnet** (Brad Myers, CMU) as ancestor — declare relationships,
system keeps them true; OpenLaszlo as that idea on the web. Don's lineage:
[`don-hopkins/career/lineage.yml`](../don-hopkins/career/lineage.yml).

### 4. OpenLaszlo reunion — bring the apps back

David Temkin AI-revived the Java toolchain (June 2026, per Henry Minsky). Run Don's old LZX demos
live — Micropolis nl-NL taartmenu, PacBot, SimFaux, pie menus, von Neumann CA — on the resurrected
stack. [`repo-shows/openlaszlo/`](../../repo-shows/openlaszlo/).

### 5. Minsky family connection

Marvin Minsky's son-in-law (per Don) — brother-in-law to [Henry](../henry-minsky/) and
[Margaret](../margaret-minsky/). Optional bridge to Society-of-Mind / constructionism threads
(Henry's solo show, skill-creation group) without speaking as Marvin ([memorial](../marvin-minsky/)).

## Sources (public)

- [Oliver Steele — personal site](https://osteele.com/)
- [Classes and Prototypes / Instance-First (2004)](https://blog.osteele.com/2004/03/classes-and-prototypes/)
- [Laszlo Presentation Server](https://osteele.com/products/laszlo-presentation-server/)
- [`invitation.md`](invitation.md) · [`CHARACTER.yml`](CHARACTER.yml)
- [`slots-all-the-way-down.md`](../david-rosenthal/slots-all-the-way-down.md) — instance/class seam
