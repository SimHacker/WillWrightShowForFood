# Robust-first Computing: Distributed City Generation

**YouTube:** [watch?v=XkSXERxucPc](https://www.youtube.com/watch?v=XkSXERxucPc)  
**Channel:** [Dave Ackley](https://www.youtube.com/@DaveAckley)  
**Published:** 18 June 2015  
**Views:** ~9,385 (as captured 2026)  
**License:** Creative Commons Attribution (reuse allowed)  
**Paper link in description:** [nm8.us/q](http://nm8.us/q) → Trent Small paper ([full-text.md](full-text.md))  
**Source code (comment):** [github.com/Sixstring982/MFMv2-city](https://github.com/Sixstring982/MFMv2-city) · [github.com/DaveAckley/MFM](https://github.com/DaveAckley/MFM)

Related paper: [full-text.md](full-text.md) · summary: [../../city-generation-routing.md](../../city-generation-routing.md)

---

## What the video shows

Dave Ackley narrates **Trent R. Small's** procedural city in the **Movable Feast Machine** simulator:

1. Seed one **city street** atom in the center.
2. Streets spread; light-gray **sidewalks** appear beside them.
3. Random **intersection** probability → more streets → grid fills quickly.
4. Block mismatches detected locally → filled with **parks**.
5. Sidewalks trigger **buildings** (colors = product/service type).
6. Buildings emit **cars** seeking a matching color/type elsewhere.
7. Sidewalks observe traffic and **adaptively route** cars (see paper: Sidewalk-Only + Canalization).
8. **Gas usage** lines = successful routings.
9. **Disaster recovery:** destroy a chunk — road/park/block rules still present, unused until needed; sprawl refills space.
10. New growth interacts with **Oldtown** without breaking.

Ackley closes: blocks between buildings could host **other computational processes**, not just routing — "more than just random routing of the cars."

---

## Transcript (from YouTube auto/caption track)

> this is a quick video demo of procedural City generation in the Movable Feast machine using bottomup distributed robust first Computing principles so let's take a look uh we seed the simulation with a single uh bit of city street in the middle uh as it uh spreads it produces more streets that have the light gray sidewalks that's next to them as the street grows it has a random number probability of producing an intersection which produces more streets which produces more intersections and in fact it very quickly fills the available space now just because the things are random it means the city blocks are not all going to be uniform and they don't necessarily match up but those uh mismatches are locally detected and are filled in with Parks perhaps not the uh best reason to decide where to put a park but it works nonetheless after a period of time uh the sidewalks start triggering the construction of buildings the buildings have colors which represent the product or services available there they also emit cars that have a a desire for a specific other color and the sidewalks by observing the passage of cars that are looking for different products and services adaptively learn to Route the cars as the city overall now wakes up and activity is going on in parallel all through the system every line there that says gas usage is one of a successful routing and this is inherently robust if a disaster happens to a chunk of the city the ability to make roads and parks and blocks was not lost it was merely not being used because it wasn't needed and if in fact more space becomes available urban sprawl will happen spontaneously and this is in the nature of distributed bottomup dynamical processes now all of this uh new city is now in its period where it's waiting before starting to construct buildings but it works perfectly well interacting with the Oldtown uh uh part of the city aside from being you know sort of fun to watch and and pretty spectacular visually it's easy to imagine that this sort of structuring of space with routing abilities uh could be used in a more fully developed form for those those blocks between the buildings we could fill in other computational processes into those blocks which would then provide uh the basis for something other than just random routing of the cars but I thought this was kind of fun to look at and I have to admit I just I just can't stop messing with these simulations uh uh a quick video demo of Trent Smalls distributed City generation in the Movable Feast

---

## Notable comments (provenance)

| Author | Note |
|--------|------|
| **Dave Ackley** | Trent Small designed and implemented the MFM elements in the video and much of the simulator code; description link switched to the paper. |
| **Dave Ackley** | Rectangles form because intersections spawn randomly **and** when a growing street **paves over a sidewalk** on a cross street — completing blocks. |
| **Dave Ackley** | SimCity connection "hard to resist"; hopes distributed models (cities, biology) may use Ulam/MFM as platform. |
| **Dave Ackley** | Repo: [github.com/DaveAckley/MFM](https://github.com/DaveAckley/MFM) |
| **@lehw916** | City project: [github.com/Sixstring982/MFMv2-city](https://github.com/Sixstring982/MFMv2-city) |

---

## Ebike Safari lineage

| MFM demo | Ebike Safari |
|----------|--------------|
| Self-growing street graph | OSM road graph (static base) + game overlays |
| Building **types**, not addresses | Smell **embeddings** / categories |
| Sidewalk distance maps | Local smell gradients, bounce-to-centers |
| Intersection canalization | Lock/sluice memory on canal graph |
| Gas = successful route | Ride events, exposure, hunt conversion |
| Parks fill mismatches | Commons beds, semantic polder gaps |
| Disaster → rebuild | Robust-first; Git replay from emitters |

↑ [README.md](README.md) · [full-text.md](full-text.md)
