# The head unit — a browser on the handlebar

The shippable product in this repo is a **bike computer that is a web page**: live map, live
metrics, live voice, one thumb, offline, and the ride is a file when you get home. It replaces the
phone-app-plus-proprietary-display pairing that every eBike motor vendor ships, neglects, and
partly rents back to you.

The reference target is Bosch's Smart System — the eBike Flow app with a Kiox/Purion display —
because that is the ecosystem this project already ingests from
([`../bosch-fit-quirks.md`](../bosch-fit-quirks.md), [`../scripts/sync_flow_trips.py`](../scripts/sync_flow_trips.py))
and because its failures are documented rather than merely resented.

## The incumbent's bug list is the spec

| Flow behaviour | Evidence | What the head unit does instead |
|---|---|---|
| No local map storage on display **or** phone. The nav map is fetched during the ride and pushed to the display over Bluetooth; the position marker lags behind the rider | [rider report, Kiox 400C](https://www.emtbforums.com/threads/bosch-400c-navigation.43602/) | Vector tiles cached before departure. The map is on the device; GPS draws onto something already there. No network on the ride path at all |
| Unsubscribed navigation draws **only the line to follow** — no crossings, no side streets, no map features. Roads are a paid tier called "extended navigation" | [Bosch Flow+](https://www.bosch-ebike.com/en/products/flow-plus) · rider report above | The map is the map. No tier gates a street, a contour, or a POI |
| The ConnectModule — GPS, SIM and motion sensors built into the frame you bought — **requires a paid subscription to function** | [Bosch Flow+](https://www.bosch-ebike.com/en/products/flow-plus): "A paid Flow+ subscription is required for the ConnectModule to work" | Nothing stops working when a card expires. There is no card |
| A Flow update **broke GPX import from komoot**; off-grid routes break navigation. Bosch support confirmed the regression without explaining it, and offered a future version that would follow an unrouted track | [rider report](https://www.emtbforums.com/threads/bosch-400c-navigation.43602/) | Following an unrouted track is the *default* mode, not a promised feature. GPX and GeoJSON are read locally — no server, no re-route, no snapping to what the vendor thinks is a road |
| Raw FIT export omits the `activity` message, so **Garmin Connect rejects the file**; omits `event`, so pauses read as zero speed; splits one record into two rows per timestamp | [hacdias 2023](https://hacdias.com/2023/10/11/processing-bosch-ebike-flow-fit-files/) · [2025](https://hacdias.com/2025/12/13/processing-bosch-ebike-flow-fit-files/) · [`../bosch-fit-quirks.md`](../bosch-fit-quirks.md) | Writes FIT that validates, and repairs theirs on import — the fixes are already known and one of them ([flowfit](https://github.com/hacdias/flowfit)) already runs in a browser |
| Heart rate displays in the app but is **not exported**; no third-party head units; no rear radar; no light control — per Bosch support, by policy | [rider report of Bosch support answers](https://www.reddit.com/r/BoschSmartSystem/comments/1qxn0g4/first_ebike_and_disappointed_with_bosch_ecosystem/) | Standard BLE profiles, whatever the sensor is, and every channel that arrived is in the record |
| A login outage (8 March 2026) locked riders out of the app on new phones while the status page read green. One rider could not remove his phone as a digital key before a workshop appointment | [r/BoschSmartSystem](https://www.reddit.com/r/BoschSmartSystem/comments/1roace5/ebike_flow_key_connect_down/) | **No login to ride.** An account is an optional sync target, never a gate. An auth failure cannot reach the handlebar |
| A bike bound to a previous owner's account needs a reset request through Bosch; one buyer reported weeks of daily attempts with a new bike | [App Store review](https://apps.apple.com/us/app/ebike-flow/id1559900907?platform=iphone&see-all=reviews) | Pairing is local. There is no ownership record to be stuck inside |

Every row is a feature written by the incumbent. That is the cheapest product research there is.

## A head unit is not a viewer

The [MapLibre viewer](skeleton/viewer-maplibre.md) replays finished rides at a desk. The head unit
is the same map under adversarial conditions, and the conditions dictate the interface:

| Condition | Consequence |
|---|---|
| Direct sun, tilted screen | High-contrast palette chosen for glare, not for a screenshot. Type sized for a glance, not for density |
| Gloves, one hand, bumps | Thumb-reachable targets. Pie menus, which is the idiom this project already uses for [navigation](navigation-smell-steer.md) and which forgives imprecision by direction |
| A four-second glance | Nothing important requires reading a second thing to interpret the first |
| Signal drops in a tunnel or abroad | The map degrades, the ride never does. A spinner on a handlebar is a failure, not a state |
| Battery for the whole day | Wake lock without full brightness; render on movement, not on a timer |
| Rain, sweat, a wet capacitive screen | Voice in and out ([`speech-track.md`](speech-track.md)), and no interaction that a single spurious touch can commit |

## The live source is the same series

The viewer already consumes a per-point series of `lat, lon, alt_m, speed_kmh, power_w,
cadence_rpm, distance_m` ([`../DATA-CONTRACT.md`](../DATA-CONTRACT.md)). **A live ride is that same
series arriving one point at a time.** Same renderer, same charts, same scrubber, different
source — which is why this is a small build rather than a new app:

| Layer | State |
|---|---|
| SvelteKit 2 + Svelte 5 + MapLibre GL 6 shell, iOS via Capacitor 8 | built ([`../viewer/`](../viewer/)) |
| Speech plumbing | built ([`../viewer/src/lib/speech/`](../viewer/src/lib/speech/)) |
| Ride artifacts, manifest, transcript clustering, video sync | built ([`../scripts/`](../scripts/)) |
| Live source: `watchPosition` → the same point stream | to build |
| Tile cache: service worker + Cache API, pinned by bounding box before departure | to build |
| Sensor layer: Web Bluetooth for heart rate, speed/cadence, power | to build |
| FIT writer, so the ride leaves as a file every other tool accepts | to build |

## What a browser can actually reach

| Capability | API | Caveat |
|---|---|---|
| Position, speed, heading | `navigator.geolocation.watchPosition` | Heading is unreliable below walking pace; fall back to bearing from the map or the compass |
| Orientation | `DeviceOrientationEvent` | Needs a user gesture to grant on iOS |
| **Bumps and roughness** | `DeviceMotionEvent`, ~60 Hz | Permission-gated on iOS. Enough for impulse and band energy, not for fine spectra. Disable shake-to-undo or the platform steals the signal ([`bumps-as-input.md`](bumps-as-input.md)) |
| **Camera** | `getUserMedia`, `ImageCapture`, canvas grabs | The other half of the app ([`camera.md`](camera.md)). Distance-sampled frames, retroactive marking, local blur before anything leaves |
| Sensors | Web Bluetooth (HR, CSC, Cycling Power profiles) | **Not in iOS Safari.** This is the reason the Capacitor shell already exists in the repo |
| Screen stays on | Screen Wake Lock | Well supported, cheap |
| Voice | Web Speech, Web Audio | Recognition quality varies; audio cues do not |
| Offline map + app | Service Worker, Cache API, persistent storage | Ask for persistence explicitly or the tiles are evictable |
| Ride out | Blob download, share sheet, File System Access | Capacitor covers the iOS gaps |

## The motor is the closed part, and that is the seam

Bosch publishes no interface to the drive unit. Motor power, assist level, battery state and range
live inside their Bluetooth protocol. But they are not lost: **run Flow in the background and it
records them all**, and the drive-unit channels come out in the FIT — whose defects are catalogued
above, and which we already ingest. So the architecture is:

- **Live**: GPS, phone sensors, and any sensor speaking a standard BLE profile.
- **Recorded in parallel**: Flow runs in the background logging the Bosch channels — battery,
  motor power, assist — for the same ride.
- **Merged afterwards**: those channels join the same point series, on the same clock.
- **Unlocked only by cooperation**: *live* motor telemetry during the ride, assist-aware range,
  and anything touching the drivetrain.

The problem is not access, it is the **extraction ritual**. Flow keeps ride history inside the app;
only rides you manually export land where a computer can reach them
([`../scripts/sync_flow_trips.py`](../scripts/sync_flow_trips.py) reads Flow's Documents folder over
USB, and that folder is empty until you tap). Per ride: Statistics, find the ride, Download FIT,
repeat. Then plug the phone into a cable and run a script. For a daily rider that is a tax on every
single day, paid in precise swipes at a small target, to obtain data the app already has and the
rider already owns.

What would fix it, in increasing order of unlikeliness: an export-all button, a share-sheet
destination, a folder that syncs, a local callback, or a documented API. Any one of them turns a
daily ritual into a background job. Until then the ritual is the integration, and it is worth saying
plainly that this is the single worst part of the current pipeline.

Reverse-engineering a motor controller is not a product plan, and firmware, locking and alarm stay
the vendor's business — they are safety-critical and legally theirs. Note the shape of this: for a
**navigation** head unit, the closed part costs almost nothing. Everything a rider looks at while
riding is the map, the route, the clock and their own body.

## Nothing commits that was not legible first

The head unit is where [`navigation-smell-steer.md`](navigation-smell-steer.md) is enforced, since
it owns the announcement: bias is free, a suggestion must be legible, and a heading change commits
only after **4 seconds and 25 metres**, whichever lands later. Windows that were missed get logged
like everything else. This is the [interfaces to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md)
position stated in the least forgiving place available: a moving vehicle, one glance, gloved hands.

## Files, not accounts

Rides land as the GeoJSON / series / meta trio ([`../DATA-CONTRACT.md`](../DATA-CONTRACT.md)),
sync to Postgres or git as the rider chooses ([`git-postgres-sync.md`](git-postgres-sync.md)), and
export as valid FIT. The app is static files served from anywhere, which means it outlives whoever
is hosting it — the precise property Flow lacks on the days its login server disagrees with its
status page. Privacy rules stay as specified in [`privacy.md`](privacy.md): the exact GPS never
has to leave the device to make the thing work.

## The PND lesson

Google Maps on a phone everybody already owned destroyed the dedicated satnav — not by being a
better satnav, but by being free on hardware that was already in the car. The same shape applies
here, and it is worth being precise about where it applies and where it does not, because half the
argument is doing real work and the other half is flattery.

**Where it holds:**

- The rider is carrying a better computer than the head unit — better screen, better GPS, more
  memory, cellular, and a software update cycle measured in days instead of model years.
- The margin being defended is hardware plus rent: a display sold with the bike, and features
  billed monthly afterwards. That is the PND business, exactly.
- A web page has no app store, no firmware channel, no dealer. It spreads at the speed of a URL,
  and it improves for everyone at once.

**Where it breaks:**

- **Google's weapon was free data, not the phone.** Killing paid map updates is what did it. On a
  bike, someone still has to pay for tiles and routing, so the map layer is a strategic
  dependency rather than a given — see below.
- **Bosch owns the motor, and TomTom never had to fight the car.** Assist, battery, range and
  diagnostics stay behind their Bluetooth protocol, and their support answers say the closure is
  policy rather than oversight. The winnable territory is the cockpit — map, route, record,
  story — not the drivetrain.
- **A phone on a handlebar is a worse device than a phone in a car.** Rain, cobbles, sun, theft,
  battery, and a rider who does not want their camera shaken to death. Dedicated cycling computers
  won that niche for real reasons, which is why the target is *a browser*, not *an iPhone*: a
  cheap Android or e-ink head unit runs the same page.

And the cautionary half, which is the part Don watched from inside: TomTom survived the
steamrolling by becoming the map underneath other companies' software. The transition did not
eliminate the map business. It moved the money from the device to the data.

## Map underneath

MapLibre GL renders it. The source of tiles is a decision with licence consequences, and the
offline promise above is what makes them bite:

| Source | Offline | Terms to know |
|---|---|---|
| **Self-hosted OSM** — planetiler/tilemaker output served as [PMTiles](https://docs.protomaps.com/pmtiles/) | Yes, natively — one static file, range requests, no tile server | ODbL attribution. The style is a file in this repo, which is the CloudMade lesson applied |
| Commercial vector host, rendered in MapLibre | Constrained | Mapbox documents MapLibre against its APIs, but a "Qualified Renderer" for map-load pricing means Mapbox GL JS 1.0+, so third-party rendering bills per tile request instead |
| Commercial vector host, on a phone | Constrained | Mapbox Product Terms (21 Jul 2026) §2.9.1: the Mobile SDKs are "Customer's exclusive means of accessing the Service Offerings in mobile applications" — a Capacitor-wrapped web app is a mobile application |
| Any commercial host, cached for a ride | Constrained | §2.8.1: cache on the end user's device only, 30 days maximum, populated directly from the API, no proxying and no bundling |

So the default basemap is self-hosted OSM in PMTiles, and a commercial host is a swappable option
behind the same interface — for search, for routing, for imagery, or for a deal that makes the
offline case explicit rather than accidental.

**But keep the priority straight.** Cached tiles are a convenience: most phones have fast,
effectively unlimited data, so riding out of coverage is an edge case rather than the norm. The
requirement that actually shapes this product is **local-first for the rider's own data** — the exact
GPS, the photographs, the speech, the home address implied by every ride. That is not a caching
question, it is the whole trust relationship, and it is specified in [`privacy.md`](privacy.md):
everything works, in full, on a device that has never uploaded anything, and each upload is a
separate revocable decision about one class of artifact, anonymised the way TomTom anonymised traces —
identity absent, trip ends clipped, the middle aggregated into coarse bins.

Tiles are about cost and robustness. Ride data is about whether anyone should trust this at all.

A vendor-neutral cockpit is the most widely used navigation surface in cycling that nobody owns.
Every motor brand ships its own weak version, and none of them want to be a map company.

↑ [`navigation-smell-steer.md`](navigation-smell-steer.md) · [`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md) · [`../DATA-CONTRACT.md`](../DATA-CONTRACT.md) · [`../bosch-fit-quirks.md`](../bosch-fit-quirks.md)
