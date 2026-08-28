# Speech plumbing: echo suppression rules and routing rigs

The speech loop wants what every platform is engineered to prevent: the
microphone hearing the speakers. This doc records the suppression rules per
platform (researched 2026-08-28) and the routing rigs that make the loop
deterministic anyway. Ride-side speech design lives in
[`speech-track.md`](speech-track.md); the live instrument is the viewer's
`/lab` route (vendored MOOLLM speech modules in `../viewer/src/lib/speech/`).

## The suppression rules

**macOS audio stack.** Apple's `VoiceProcessingIO` (VPIO) audio unit does AEC
by *output subtraction*: it subtracts whatever is rendered through its own
output bus from the mic input. No delay parameters, no inspectable reference
path (Apple DTS, forum thread 97679). Consequences:

- It only cancels audio that flows through that unit. TTS played through a
  different path is invisible to it — a canceller with no reference cancels
  0 dB (documented in screenpipe issue #3938, where the output element was
  disabled and the toggle did nothing).
- Activating VPIO **ducks other system audio** — hostile to a loop that
  wants playback and capture simultaneously.
- macOS 12+ adds per-app **mic modes** (Control Center: Standard / Voice
  Isolation / Wide Spectrum). Voice Isolation will eat synthetic speech
  arriving from the room; Wide Spectrum passes it. Check this first when the
  loop mysteriously goes deaf.

**Chrome.** AEC3 is on by default for `getUserMedia`
(`echoCancellation: true`), but it can only subtract audio it holds as a
reference, and on desktop Chrome that is **RTCPeerConnection audio only**
(crbug 687574). `speechSynthesis`, `<audio>`, Web Audio, and other apps'
output never reach the canceller — so Chrome does *not* cancel our TTS→mic
path. `chrome://flags/#chrome-wide-echo-cancellation` widens the reference
to system loopback; leave it off for the loop.

**Safari / iOS.** The OS capture layer cancels **non-WebRTC system audio**
too. The acoustic loop is structurally hostile on iPhone — plan on digital
routing or an on-device speech stack for the Capacitor build
(see [moollm skills/speech STT-STACK](https://github.com/SimHacker/moollm/blob/main/skills/speech/STT-STACK.md)).

**Web Speech API.** Recognition captures from the **system default input**
with platform default processing. No constraints API, no device picker, no
way to ask for raw audio. The one lever you control is *which device is the
system default input* — which is exactly what the rigs below exploit.

**Electron / IDE webviews.** `webkitSpeechRecognition` exists but mic
permission is typically denied (`error: not-allowed`) and there may be no
speech backend. The bridge surfaces recognition errors instead of reporting
silence, so denied-mic and quiet-room are distinguishable.

## The routing rigs

The room is an analog patch cable with weather. Replace or augment it:

**Rig 1 — plain cable (deterministic loop).** BlackHole 2ch inside a
Multi-Output Device (speakers + BlackHole); system default input =
BlackHole. TTS reaches recognition bit-perfect: no room, no AEC anywhere in
the path. Good for testing the loop machinery; artistically inert.

**Rig 2 — OBS as router / mixer / delay.** Desktop Audio capture (native on
macOS 13+, else via BlackHole) plus the real mic as separate sources:

| OBS feature | Loop role |
|---|---|
| Per-source faders (Advanced Audio Properties) | feedback gain — decay or blow up per pass |
| Sync Offset (±950 ms per source) | echo delay |
| Filters: gain, noise suppression, compressor, EQ | shape what survives a pass |
| VST plugins (delay, reverb, bitcrusher) | telephone-game degradation as a mixing decision |
| Audio Monitoring → monitoring device = second virtual cable | the mix becomes the system default input |

Recognition then hears TTS + room + chosen delay + chosen filth, all on
faders — ride the feedback like a dub engineer.

**Rig 3 — Audio Hijack / Loopback (Rogue Amoeba).** Arbitrary block graphs
and delays longer than OBS's 950 ms, without a streaming app in the loop.
Windows: VB-Cable + VoiceMeeter Banana. Linux: PipeWire/Pulse loopback
modules with `latency_msec`, `module-echo-cancel` off.

**Rig 4 — split devices: the air is the patch cable.** Voice Rooms
(`/room` in the viewer) puts a message bus (SSE over the app's own server)
between any number of devices: send `(name, voice, text)` into a named room;
every joined device can be a **mouth** (speaks incoming messages aloud)
and/or an **ear** (recognizes the room's air and reposts what it hears, with
a half-duplex guard). Make one laptop the mouth and another the ear and the
loop crosses the physical room — no device hears itself, so per-device echo
cancellation never engages. Nothing to defeat; the OS rules above simply
stop applying.

**Rig 5 — the phone as a handheld fader.** A phone as mouth or ear makes the
across-the-air channel *performable*: distance is amplitude, orientation and
cupping are EQ, speaking directly into it injects your signal over (or
instead of) the loop, and carrying it to another room hands the channel to
other people. Any number of phones, pads, and laptops can join the same
room with any mix of roles — the acoustics between them is the mixing desk.

**Precedent.** Alvin Lucier, *I Am Sitting in a Room* (1969): speech
re-recorded through a room until the room's resonances replace the words.
The loop is the same piece with the recognizer as the room; rig 2 lets you
choose the resonances, and rigs 4–5 let you walk around inside them.

## Controlling the voice: detents now, dials later

`/room` sends `(voiceType, rate, pitch)` per message, chosen by tap: three
rate steps, three pitch steps. Discrete on purpose — detents are playable
one-handed on a phone while riding, and they survive being sent as data.

Continuous control is the obvious next move, and a phone already carries the
sensors: `DeviceOrientationEvent` beta/gamma as two smooth axes mapped to
pitch and rate (or to voice *selection*, quantized so tilt walks a voice
list). Caveats to design around: iOS requires
`DeviceOrientationEvent.requestPermission()` from a user gesture and a
secure context, sensor noise needs low-pass filtering, and TTS parameters
only take effect at utterance boundaries — a tilt mid-sentence cannot bend
the voice already speaking. So orientation naturally controls *the next
utterance*, not the current one. Which is exactly the wall that makes the
next item interesting.

## TODO: mix Pink Trombone into this

Neil Thapen's [Pink Trombone](https://dood.al/pinktrombone/) (2017) is an
articulatory synthesizer in the browser: a glottis (pitch, voicing,
breathiness) plus a draggable vocal tract whose constrictions produce
formants. Web Audio and canvas, no TTS engine — you *articulate* rather than
submit text and wait.

Why it belongs here:

- **It fixes the boundary problem.** TTS parameters are per-utterance;
  Pink Trombone is continuous. Tilt, drag, and multitouch bend the voice
  *while it is sounding*. The phone stops being a remote control for a
  speech engine and becomes an instrument.
- **It closes the loop with a human in it.** Point an ear device at a
  phone running Pink Trombone: you articulate nonsense, the recognizer
  insists on words, the room re-speaks those words, and you articulate
  against them. Lucier with a vocal tract in your hands.
- **Bike-legal.** Two thumbs, no keyboard, no dictation prompt.

Architecture note — **send gestures, not audio.** The room bus carries text
today; Pink Trombone produces sound, and streaming it would mean WebRTC and
a media server. Don't. Send the articulation *parameters* (glottal pitch,
tenseness, tongue index/diameter, constrictions) as small timestamped
messages, and let every joined device synthesize locally: MIDI, not WAV.
Tiny payloads over the existing SSE bus, every device its own throat, and
each device's own vocal tract is free to interpret the gestures differently
— the same score sung by different bodies.

Before vendoring: confirm Pink Trombone's license and credit Neil Thapen
prominently (the source is published, but this repo should not assume terms).

## Tie-in

| Doc | Role |
|-----|------|
| [`speech-track.md`](speech-track.md) | ride-side speech: commands, impressions, transcript markup |
| `../viewer/src/lib/speech/` | vendored MOOLLM speech + recognition modules, bridge, feedback loop |
| `/lab` viewer route | voice browser, mic check, echo test, feedback mode |
| `/room` viewer route | multi-device voice rooms: mouths, ears, half-duplex, paste-to-send |
| [moollm skills/speech](https://github.com/SimHacker/moollm/tree/main/skills/speech) | platform speech stacks, voices, STT options |

↑ [`README.md`](README.md) · [`VISION.md`](VISION.md)
