# Getting the map onto the bike

A city is a large file that everybody in that city wants, which is the oldest peer-to-peer shape
there is — and Don already built this once, for TomTom, in 2007
([`sources/tomtom-hn-record.md`](sources/tomtom-hn-record.md)).

**Scope check first.** This is an optimisation, not a foundation. Phones mostly have fast,
effectively unlimited data, so a rider without a cached city is inconvenienced rather than stranded.
What matters here is cost, robustness abroad, and — the part worth the whole document — the consent
interface, which this project needs far more urgently for **uploading the rider's own data** than for
sharing map tiles. The local-first policy that actually matters is in [`privacy.md`](privacy.md).

## The unit is a region pack, and it is a file

| Property | Choice |
|---|---|
| Format | [PMTiles](https://docs.protomaps.com/pmtiles/) — one file, HTTP range requests, no tile server |
| Contents | Vector basemap tiles for a bounding box, plus the road graph and the layers the games need |
| Build | planetiler or tilemaker from an OSM extract, reproducibly, with the style kept as a file in this repo |
| Identity | Content hash. A pack is verifiable, so it does not matter who handed it to you |
| Update | Periodic rebuild plus deltas, because OSM changes daily and a rider does not need to re-download Amsterdam to get one new bike lane |

Because the data is ODbL and the render is ours, a pack is **legal to copy**. That single fact is what
makes everything below possible, and it is the reason the default basemap is self-hosted rather than
licensed: commercial tile terms forbid proxying, bundling and redistribution, so a licensed pack
could only ever be downloaded, never shared ([`bike-computer.md`](bike-computer.md)).

## Peer-assisted, with the CDN as the floor

The TomTom findings transfer almost unchanged:

- **Many people in one place want the same bytes.** Everybody in Amsterdam wants the Amsterdam pack.
  Don's Akamai log analysis found Australia was the extreme case — poor international links, good
  domestic bandwidth — and a rider on a metered mobile connection abroad is the same case again.
- **Serve from the CDN while the swarm is cold**, and fall back to it whenever peers are thin. The
  download must never be *slower* because it was clever.
- **Keep the transfer out of the app process.** BitTorrent DNA worked because it was a separate
  process driven over HTTP. In a browser the equivalent is a worker plus WebRTC transport, and the
  page stays responsive because it is only issuing requests and reading progress.
- **One shared service, not one per app**, or several apps fight over the same disk and radio.
- **Desktop users are seeds.** People touring cities from a desk
  ([`virtual-ride.md`](virtual-ride.md)) hold the same packs on better connections, and can seed the
  riders. The virtual audience pays for itself in bandwidth.

## The consent panel, copied deliberately

Pieter Geelen micromanaged this part at TomTom and was right to. Uploading on someone's behalf
without a clear, honest, opt-in explanation is how a bandwidth saving turns into a betrayal:

1. Say plainly what it does, in one screen, before anything uploads.
2. **Opt in, never opt out.** Fewer seeders is a cheaper problem than lost trust.
3. Disclose the risk in the rider's terms: metered connections, upload caps, tethering, roaming.
4. Say who benefits, including us, and never imply the rider is the only winner.
5. Show live status and a working off switch, mid-transfer.
6. Default to **Wi-Fi and mains power only**, because the failure mode is a phone that arrives at
   the ride with no battery.

The reason to take this seriously is the same reason it mattered then, and it is the reason this
document exists at all: **the same panel governs uploads of the rider's own rides**, where the stakes
are not bandwidth but home addresses. TomTom's traffic product depended on riders trusting the company
enough to send traces, and Don's account is explicit that saving a million euros was not worth
spending that trust. Get the panel right here, where the cost of a sleazy default is a phone bill, and
it is already right where the cost is somebody's front door ([`privacy.md`](privacy.md)).

## Attribution travels with the pack

ODbL requires credit and share-alike on derived data. A pack carries its OSM attribution, its build
date, its extract source, and its style, so a map handed rider-to-rider still says where the world
came from. Nothing here writes to OSM; contributions leave as a reviewed worklist
([`bumps-as-input.md`](bumps-as-input.md)).

↑ [`bike-computer.md`](bike-computer.md) · [`sources/tomtom-hn-record.md`](sources/tomtom-hn-record.md) · [`virtual-ride.md`](virtual-ride.md) · [`privacy.md`](privacy.md)
