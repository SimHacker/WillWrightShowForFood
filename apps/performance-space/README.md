# performance-space — web toys & OBS helpers

Browser toys composited in OBS Browser Source. Specs live here; implementation follows P0
proofs in [`process/performance-space/README.md`](../../process/performance-space/README.md).

*Sniff:* [`GLANCE.yml`](GLANCE.yml) · [`CARD.yml`](CARD.yml)

## Toys (spec → build)

| ID | Status | Spec | Proves |
|----|--------|------|--------|
| **conan-face-puppet** | spec | [`conan-face-puppet.yml`](conan-face-puppet.yml) | Webcam mouth through face-hole PNG |
| play-along-queue | planned | — | TicketPR clip queue + credit overlay |
| amplitude-scrub-puppet | planned | — | Mic drives character video scrub |
| pink-trombone-jam | planned | — | Side-by-side vocal-tract jam URL for chat |

## OBS integration

v1 uses **transparent Browser Source** URLs served from stream-gateway (or static host) +
[`obs-websocket`](../../rigs/brain-stream-dual-laptop.SETUP.md) scene cues. No native OBS plugin
required for first on-air proofs.

## See also

- [`process/performance-space/`](../../process/performance-space/)
- [`apps/stream-gateway/`](../stream-gateway/)
