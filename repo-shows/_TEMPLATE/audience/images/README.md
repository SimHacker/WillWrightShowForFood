# TicketPR images — copy this folder

Three files make your TicketPR **concrete** on stream and in chat. Don Philahue and overlay
tools use these paths.

| File | Size hint | Purpose |
|------|-----------|---------|
| `headshot.png` | any; face/object centered | CARD, PR review, Come On Down lower-third |
| `avatar.png` | **128×128** square | Twitch/YouTube chat badge, MSPO RPG |
| `with-guest.png` | any | You with the guest — photo, screenshot, cosplay, rig |

Optional:

| File | Purpose |
|------|---------|
| `with-guest-*.png` | Extra angles (eating the sim trilogy, crew photo, …) |
| `costume.png` | Stream rig reference — also set in [`../costume.yml`](../costume.yml) |

## Any kind of image is welcome — have fun! 🎨

**Real photos, AI-generated images, photoshops, screenshots, MS Paint, crayon scans — all good.**
This is a playful show; make whatever delights you and fits your character:

- **AI-generated** (Imagen, DALL·E, Midjourney, SDXL, …) — totally fine, lean in
- **Photoshops / collages** — the Will-eating-a-Sim trilogy is literally Don's photoshops
- **Real photos** — you, your rig, your cosplay, your cat in a tiny hat
- **Game captures** — buy-mode thumbnails, in-game screenshots, mod previews

Only rules: keep it yours-to-share (no infringing/abusive imagery), label it honestly if it's
AI or a 'shop when that matters, and keep it family-friendly-ish (this is an educational show).

Wire in [`../CHARACTER.yml`](../CHARACTER.yml):

```yaml
media:
  headshot: images/headshot.png
  avatar: images/avatar.png
  with_guest: images/with-guest.png
```

Wire in [`../questions.yml`](../questions.yml):

```yaml
costume_ref: ../costume.yml
media:
  avatar: images/avatar.png
```

---

## Filled-out examples (Will Wright kickoff show)

Copy structure from these — they are **templates you can steal**:

| Example | Path |
|---------|------|
| Bot + real photo with Will | [`../../../will-wright/audience/bot-slats/`](../../../will-wright/audience/bot-slats/README.md) |
| Sim in Will's hand (Bob Newbie bit) | [`../../../will-wright/audience/fictional-bob-newbie/`](../../../will-wright/audience/fictional-bob-newbie/README.md) |
| Fictional game character | [`../../../will-wright/audience/fictional-bella-goth/`](../../../will-wright/audience/fictional-bella-goth/README.md) |
| Balcony regular (🤡💀) | [`../../../will-wright/audience/fictional-tragic-clown/`](../../../will-wright/audience/fictional-tragic-clown/README.md) |

Replace placeholder headshots with catalog captures or your own photo when you have them.
