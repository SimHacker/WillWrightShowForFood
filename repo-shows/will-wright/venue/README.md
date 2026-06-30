# 🎭 The Venue

*Sniff:* [`CARD.yml`](CARD.yml) · [`GLANCE.yml`](GLANCE.yml) · *Machine map:* [`VENUE.yml`](VENUE.yml) · *Balcony duo 🤡💀:* [`../audience/fictional-tragic-clown/`](../audience/fictional-tragic-clown/README.md) · [`../audience/fictional-grim-reaper/`](../audience/fictional-grim-reaper/README.md)

The Repo Show theater, modeled as **navigable MOOLLM rooms** — because seats are a **scarce,
tangible resource**, not just labels. Characters are *placed* by pointing their `location:` at a
room; they move live (puppeteered via chat and web panels). The whole map is in [`VENUE.yml`](VENUE.yml).

```
lobby ── red-carpet (arrivals, venue tour)
  │
  ├─ stairs → mezzanine ── balcony-left (Tragic Clown 🤡) · balcony-right (Death 💀) · sky-boxes (top donors)
  │
  └─ house (the floor)
       rear · standing (live Twitch default) · aisle
       left · right · front-row (honored/donor) · floor-boxes (Curator + Phil)
       mic-line (queue) → the-mic (ask live)
                                 │
                            orchestra-pit (Transmogrifier; band-leader/sidekick)
                                 │
       stage ── apron · left-wing/right-wing (wait to trot out)
                rig-above (gong, the Ultimate Machine's reach)
                trap-below (Broken Robot crashes up/down)
```

**Why model it for real?** Because MOOLLM is built for exactly this: rooms, characters, placement,
movement, and ethical/privacy/scope boundaries. Scarce balconies and boxes become *earned*. You can
**wait in line at the mic**, get **called from the front row**, or heckle from the **balcony**. And
we can rearrange the whole thing into theater-in-the-round whenever we like — just rewire the exits.

**Pre-show:** Don Philahue broadcasts a **venue tour** down the red carpet, greeting guests and
celebrity audience members as they arrive — then we make real-time edits to these room files,
commit with a narrative message, and announce what just happened to the chat.

See [`../performance-and-culture.yml`](../performance-and-culture.yml) · [`../../process/ticket-pr.yml`](../../process/ticket-pr.yml) · [`../audience/README.md`](../audience/README.md)

---

## Navigation

*(Skeleton: [`GLANCE.yml`](GLANCE.yml))*

| Room | → | Why |
|------|---|-----|
| **Up** | [show](../README.md) | Flagship episode root |
| **Audience** | [audience](../audience/README.md) | Who sits where |
| **Balcony 🤡** | [tragic clown](../audience/fictional-tragic-clown/README.md) | Left balcony |
| **Balcony 💀** | [grim reaper](../audience/fictional-grim-reaper/README.md) | Right balcony |
| **Orchestra pit** | [bot-slats](../audience/bot-slats/README.md) | Slats + Transmogrifier |
| **Machine map** | [VENUE.yml](VENUE.yml) | Full room graph |

↑ [show](../README.md) · [`GLANCE.yml`](GLANCE.yml) · [audience](../audience/README.md)

*Raw directory:* [browse files in this folder](./)
