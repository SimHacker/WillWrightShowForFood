# Client-side rendering: what we render, what we host

*The rule that lets Soul City show the whole game without
redistributing any of it: **the client renders, the server keeps what
the player authored.** Machine-readable spec:
[rendering-and-rights.yml](rendering-and-rights.yml).*

## The short answer

Uploading **rendered images** is a screenshot. Uploading
**asset-fidelity sprite sets** is distributing the object. The line
between them is not resolution or taste, it is a technical question
with a testable answer:

> **Could a determined person rebuild a working game object from what
> we host?**

If yes, we hosted the object. If no, we hosted a picture. Compose,
flatten, and publish pictures freely. Never publish a complete,
reassemblable set of an official object's sprites, rotations, zooms,
z-buffers, and alpha channels -- that IS the art asset wearing a PNG
extension.

## Why the picture side is solid ground

Two precedents, one of them EA's own:

1. **The game shipped a publish-to-web feature.** The Sims 1's
   *Auto Generate Web Pages* exported your houses, families, and
   albums as HTML for putting on the internet -- rendered Maxis art
   included. Maxis built the pipeline whose whole purpose was
   publishing images of their own objects. Soul City's album and
   scene publishing is that feature, restored, after the Legacy
   Collection dropped the upload path
   ([the Exchange gap](../../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/README.md)).
2. **Object preview images were the fansite economy for 25 years.**
   Every download site, including SimFreaks, showed rendered previews
   of what you were about to install. Don formally requested the
   tooling for it in the **2004 Transmogrifier renovation plan**:
   "Export composed picture previews and text descriptions of
   objects, for use on web pages... they could just export them as
   gifs or jpegs directly from Transmogrifier. This will save lots of
   time for people who create web sites for downloading objects."
   (A request on the record; we have no document showing Maxis
   answered it. The practice it describes ran unchallenged for two
   decades regardless.)

Add the ordinary background: screenshots and machinima of games are
normal, expected, and marketing that publishers want.

## The architecture that makes it moot

Split what lives where, and most of the question dissolves:

| Layer | Where it lives | Why |
|-------|----------------|-----|
| **Object metadata** (name, description, price, GUID, expansion, category) | Server, public, complete | Facts about a product, not art. This is what makes the catalog useful to everyone. |
| **Official object art** | Rendered on the client, from the player's own legal install | Never uploaded as a standalone asset. Materializes on machines entitled to it. |
| **User-authored compositions** (scenes, showcases, room snapshots, albums) | Server, on explicit consent | The player made it. It is a screenshot of their game. |
| **UGC object art** | Server, creator's choice | It is the creator's own work; the mods policy already allows free distribution. |

So the catalog is complete for everybody, and the pictures of Maxis
objects materialize locally for people who own the game. The
advanced dynamic house rendering, editors, and scene composition
require a real purchased install -- which is not a limitation to
apologize for. It means Soul City makes owning the game **more**
valuable rather than substituting for it, and that is a good-faith
posture worth being able to point at.

Ownership verification is already designed: Steam sign-in via OpenID,
built for the turnstile
([steam-app-strategy.md](steam-app-strategy.md)). It does double duty
here as the license-hygiene gate.

## The gray area, resolved

You named it precisely: composed scenes read as screenshots;
systematically extracted individual object renders start to read as
an asset library. Where each falls:

- **Composed room and scene showcases** -- clearly fine. This is the
  SimFreaks playset prototype's whole point: a room, a background,
  objects arranged in it, published as a picture. Same category as
  every screenshot ever posted.
- **Preview thumbnails attached to a catalog listing or a creator's
  showcase** -- fine, and the 25-year norm. Presentation renders:
  composed, flattened, one viewing angle, screenshot resolution.
- **A complete rendered extraction of every official object, at asset
  fidelity, browsable as an art library** -- don't. That is the one
  version that functions as an asset repository and substitutes for
  the install, and it fails the reconstructability test.

The practical difference is small and cheap to honor: render Maxis
object previews locally, cache them locally, and let the server hold
the metadata plus whatever the player composed on purpose.

## Rules

1. **Push rendering to the client.** Always. The server never needs
   game art to do its job.
2. **Upload only on explicit consent**, per artifact, never
   ambiently. (Paid tiers may gate features; they never widen what
   gets uploaded.)
3. **Reconstructability test** before hosting any render of official
   art: composed and flattened, yes; complete sprite/rotation/zoom/
   z-buffer sets, no.
4. **Metadata travels freely** -- facts about objects are how
   non-owners still get a complete, searchable catalog.
5. **Never host official object art as a standalone download**, at
   any fidelity, for any tier.
6. **Creators own their own art**; UGC publishing is the creator's
   call, credited.
7. **Advanced rendering requires a verified install.** Not a
   punishment -- the thing that keeps the whole design clean.

Not legal advice; counsel should read this page before launch. But
the posture is defensible and the architecture costs us nothing,
which is the combination worth having.

## Related

- [Portals and modules](portals-and-modules.md) · [Browser ecosystem](browser-ecosystem.md)
- [Stat-U-Matic](stat-u-matic.md) -- the scene composer this governs
- [GUID registry](guid-registry.md) -- the official-object catalog as metadata
- [Membership model](membership-model.md) · [Steam app strategy](steam-app-strategy.md)
- [The 2004 renovation plan](../../characters/will-wright/sources/2004-02-05-transmogrifier-renovation-plan/README.md)
