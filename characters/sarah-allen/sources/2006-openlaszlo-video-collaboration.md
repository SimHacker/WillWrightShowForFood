# Receipts — Sarah Allen × Don Hopkins, OpenLaszlo video work (2006)

*Digest of a real email archive, curated by Don. Sarah may edit or request removal.
[Portrayal standards](../../../schemas/portrayal-standards.md).*

## The contract (Jul 28, 2006)

Sarah (Director of Application Development, Laszlo Systems) hired Don to **complete
OpenLaszlo's audio/video support**: stream APIs for audio-only, recording over RTMP,
playback over RTMP/HTTP for FLV and MP3, video player with scrubber and buffering display,
mic level, audio player, A/V recorder — tested against both **FMS and Red5**. Process:
work in the OpenLaszlo video branch, every checkin code-reviewed by Sarah, API changes
community-reviewed on laszlo-dev, weekly status. Three milestones, $2,000 each.

## The API design review (Aug 2006, laszlo-dev)

Don refactored the components and proposed the API on-list; Sarah reviewed interleaved:

- `stream` → **`mediastream`** ("I like the 'mediastream' name idea" — she'd wanted
  `stream` free as a variable name)
- camera + microphone → shared **`mediadevice`** base class ("This is nice.")
- Macromedia's `mute` → **`capturing`** (negated; "mute isn't appropriate for a camera…
  'deaf' and 'blind' would be more descriptive but that's just too anthropomorphic for me")
- Fixed Macromedia's conflated camera/mic permission callbacks by broadcasting `allowed`
  status to all devices — hiding Flash's quirks behind a portable API
- `rtmpconnection` kept protocol-named, not Flash-named (Sarah: rtmp isn't Flash per se)

Don's style note from the checkin: the components double as example code, so the
formatting is bite-size morsels meant for cut-and-paste — documentation as UI.

## The YouTube player (Sep 26, 2006)

Don built an LZX YouTube player on the new components — ReST API for popular videos,
scrape the watch page, stream the FLV, no server support needed. **Jim Grandy:** "Wow,
Don! That's fabulous. A nice looking app, and very fast. I can't wait to get this up on
www.openlaszlo.org as a demo."

## The comedy track

- **The stolen laptop** (Aug 14): Don's car broken into, laptop + signed contract gone —
  "I'll need to print out and sign another copy of the contract, since they got that too."
- **The biometric login theory** (Aug 16): Don scans all ten fingers "so as not to jinx
  any of them… according to the hopkins normalization lemma of murphy's law," plus toes
  pending, for luck.
- **Hallucinotronics** (Jun 2006): Don ports the Dreamachine to LZX
  (`DreamMachine.lzx`); Max Carlson: "Jesus dude - I almost had a seizure Pokemon style!"
  Sarah: "It just makes me nauseous, which i must admit is common reaction for me with
  hallucinogenics :)"
- **AntiORP / Netochka Nezvanova** (Jul 2006): Don introduces Sarah to the net-art
  entity; Sarah: "without that translation at the top I would have missed half the words!"

## After Laszlo

Newsletters and notes 2007–2016 (ENIAC programmers fundraiser with Jean Bartik; PIF at
the Smithsonian; 18F College Scorecard; Google/Vanadium move), Pantomime Bug Squish
exchange (2016: "Dinosaurs learn to code! I love the game concept"), and the Nov 2023
Leela AI thread (Don working with Henry Minsky; Blender/ML pipeline).

## Show hooks mined here

1. Don's 2006 video components under Sarah's review — run them again on OL 5.0, on air
2. API design as craft: `mediastream`, `mediadevice`, `capturing` — naming argued in public
3. The YouTube player — a 2006 no-server video app, resurrected by the Software
   Preservation Society's build
4. Cinematic interaction design (her Interaction08 thesis) × Repo Show staging
5. Flash Video from inception (her team) → Don's RTMP components → the whole streaming web
