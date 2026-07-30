# VoyStick — correspondence lineage (1991–2025)

Primary-source digest of Don Hopkins' **vocal joystick** idea: continuous pitch + vowel
tracking in **voice space**, homomorphic bidirectional synthesis, and pie-menu integration.

## One sentence

**Pitch = Y, vowel = X** — a parallel **gestural** voice channel alongside natural-language speech
recognition. Urban Safari uses **both**: say commands and questions in words; hop pie arcs by warble.
Riders **code-switch** between NL and gestural voice — and combine them. Homomorphic synthesis lets
you sing along to confirm.

## Origin (June 1991)

Email to Tara (UIUC), learning DSP from Oppenheim's *Discrete-Time Signal Processing*:

- Homomorphic vocoder models vocal tract as source + filters → pitch, formants, voiced/unvoiced
- Telephony compresses to ~600 bps; Don wants the **inverse problem**: track motion in voice
  space for UI, not reconstruct speech for bandwidth
- First apps imagined: trippy paint program, whack-a-mole, blind users, phone UI, lazy typists

Mark Weiser (Sep 1989) pointed Don at Jeffrey Mark Siskind's PARC talk *Languages with Limited
Phonology* — artificial restricted phonology as orthogonal simplification to vocabulary limits.
Don never followed up; the Voystick is the complementary approach (continuous acoustics, not
discrete phoneme classification).

## Dual-channel voice + code switching (Urban Safari)

| Channel | Role | Examples on the bike |
|---------|------|----------------------|
| **Natural language** | SpeechAnalyzer — words, tools, questions | "What's near me?", "Set destination", "Capture this", "What did Parker film here?" |
| **Gestural (Voystick)** | Pitch+vowel trace — arc hops, wedge steering | Warble along pie wedge; homomorphic yeah-yeah confirm; voice-ahead expert path |

**Code switching:** the rider fluidly moves between channels — NL to **select** a tool or name a
destination, gestural to **execute** spatial hops through the card overlay; or **both at once**
("Invader" spoken while warbling northeast). Expert riders stay mostly gestural with NL punctuation;
novices lean on words until muscle memory locks in. Both streams run in parallel; the parser/LLM
fuses intent from whichever channel is active.

## Phoneloper era (~2000s)

Don built a **Phoneloper** GUI: Flite in Python + Tk canvas — edit diphone timing and pitch
envelopes, phonoscope recorded speech (spectrogram + pitch trace), resynthesize to match.
Worked as a musical instrument. Lineage to MOOLLM [Phoneloper sketch](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/one-minute-intense.yml).

## CMU guest lecture thread (2018–2019)

Brad Myers invited Don to CMU *Interaction Techniques* (pie menu history + future).

Ben Shneiderman asked *"What is a Voystick?"* — Don's definitive explanation (Feb 2019):

| Axis | Control | Maps to |
|------|---------|---------|
| **Y** | Pitch (voicebox) | Up/down continuous value |
| **X** | Vowel (tongue) | Left/right continuous value |
| **Pressure** | Lip rounding (minor) | Touch-screen pressure analogue |
| **Click** | Consonant delimiter | Less reliable than vowels |

**Homomorphic**: Siri sings current setting; you sing along; harmonic blend = on target,
inharmonic clash = off. Synthesis via [Pink Trombone](https://dood.al/pinktrombone/) —
"yeah yeah" (yes), "oy oy" (no/attention).

**Pie integration**: steady vowel = pop menu at voice-space coordinates; each slice label
sung as its vocal gesture; **voice ahead** = expert path (mouse-ahead analogue); rhythm matters.

**aQuery**: jQuery-for-accessibility overlay — prerequisite to Voystick in arbitrary apps
([wiki](https://donhopkins.com/mediawiki/index.php/AQuery), Prefab lineage).

Lecture slides: [Google Slides](https://docs.google.com/presentation/d/1R9s4EEAwUjI_7A8GgdLYD_U1yUs9omaVqkY9GY-2D78/edit) ·
recorded talk (VoyStick in Future section): [Panopto](https://scs.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=f0600d9d-282e-4b83-a6f4-a9f2003ad407)

## Parallel research (recognition-only cousins)

| Project | Who | What Voystick adds |
|---------|-----|-------------------|
| [Vocal Joystick](https://linguistics.washington.edu/research/projects-and-grants/vocal-joystick) | James Landay, UW | Don emailed 2020 — wants **bidirectional** + browser; their work is control, not homomorphic prompt |
| [mypystick](https://github.com/elisaoh/mypystick) | elisaoh | Python formant tracking — ongoing |
| GuitarPie (UIST 2025) | Andreas Fender et al. | Fretboard pie menus from guitar audio — [HN](https://news.ycombinator.com/item?id=45250328); Don: combine with Voystick |

## Evan Balster / imitone thread (Apr 2023)

GDC → Mongolian grill → email arc with Zack Qattan (Pink Trombone + ML).

**Evan's DSP counsel:**

- Vocoder/LPC telephony tricks **fail for control** — discontinuities cancel on decode
- Formants are **easier to measure than pitch** (ironic vs auto-tune abundance)
- F1/F2/F3 ≈ width/height/depth of vocal cavity; F1/F2 graph separates vowels cleanly
- Dynamic resonator aligns energy blob with formant bands ([demo](https://www.youtube.com/watch?v=-EtLzXRnx7s))
- Classifiers (Zack's KNN on MFCC) add **information loss** vs direct formant measurement
- Many users may prefer **quiet monotone** over singing — design for phonetic not operatic use

**Don's projection strategy** (Apr 7 2023):

- Collapse formants to **one X dimension** + pitch Y — simpler user model (like pie stroke direction vs handwriting)
- Two **diphthong rails** along vowel periphery, skip ambiguous central schwa zone:
  - Front: `(i, e, ɛ, a)`
  - Back: `(u, o, ɔ, ɑ)`
- Front/backness as **discrete bit** → press/release (mouse down/up analogue)

Shared with Zack + Evan: [Pink Trombone Vocap](https://www.youtube.com/@ZackQattan/search?query=pink),
[imitone formant tracker](https://www.youtube.com/watch?v=-EtLzXRnx7s).

## Vowel space — acoustic not articulatory (Apr 2023)

Don forwarded Geoff Lindsey's [*The Vowel Space*](https://www.youtube.com/watch?v=FdldD0-kEcc)
([HN](https://news.ycombinator.com/item?id=35701116)) to Evan:

- Jones **tongue quadrilateral** is pre-Galilean guesswork — vowels are **continuous** like color (CIE space)
- Real HCI coordinates: **F1** (vertical, openness) × **F2** (horizontal, backness); **F3** for /ɚ/
- Lip rounding is a **third dimension** often conflated with F2 on old charts
- Praat vowel editor + Lindsey's [clickable chart](https://www.englishspeechservices.com/ipa-vowels/) = synthesis reference targets
- Individual + cultural calibration required (Evan agrees)

MOOLLM machine-readable: [vowel-space.yml](https://github.com/SimHacker/moollm/blob/main/skills/speech/platforms/vowel-space.yml)

## Homomorphic synthesis stack

| Layer | Tool |
|-------|------|
| Analysis | imitone resonator · aubio YIN (pitch) · Pratt/Praat formants |
| Synthesis | Pink Trombone · LPC stub (Evan) · Flite/Phoneloper pitch envelopes |
| Feedback | Harmonic blend when matched; auto-tune toward ideal gesture |
| Voice training | Evan's "Unison" / X-Y resonance videos — same metrics, different UX goal |

Paul Boersma (Pratt, Amsterdam) — Don emailed 2013; asked about JS port for browser Voystick.

## Patent / product posture

Don to Evan (Apr 2023): not academic, not startup — **flexible working implementation** to
discover what works; possible side app; integrates with aQuery/accessibility.

Evan: activism angle (voice gender training, accessibility); cooperative/crowdfunding for
sustained R&D.

## Urban eBike Safari (2026 use case)

**Primary application** — not a side demo. Voystick navigates the **linked card overlay** on a bike:
warble along pie wedge arcs to hop between POIs and cards (MediaGraph-style Mario-cannon flick),
hands on Koga handlebars. SpeechAnalyzer for words; parallel gesture stream for arc hops.

Lineage: Logo Adventure (zeroth) → DreamScape (first) → MediaFlow (Lisp+QT, no pies) → iLoci → MediaGraph → Urban Safari cards.

Don (2026): *really fun and smooth — best gestural UI I've ever done.*

See [urban-safari-steering-voystick-pie-network.md](urban-safari-steering-voystick-pie-network.md) ·
[Crazy Idea Jam Voystick](../../../process/crazy-idea-jam.yml#voystick_homomorphic_vocal_joystick).

GuitarPie + Voystick (Sep 2025 HN): hardcore cyberpunk grindcore metal indistinguishable from
computer interaction — [Eclipse](https://en.wikipedia.org/wiki/Eclipse_(novel)) Rickenharp on the
Arc de Triomphe energy.

## Trail

| Link | |
|------|--|
| [voystick-correspondence-lineage.yml](voystick-correspondence-lineage.yml) | Girder index |
| [urban-safari-steering-voystick-pie-network.md](urban-safari-steering-voystick-pie-network.md) | Field UX |
| [MOOLLM voystick.yml](https://github.com/SimHacker/moollm/blob/main/skills/speech/voystick.yml) | Implementation spec |
| [gesture-space (Medium)](https://donhopkins.medium.com/gesture-space-842e3cdc7102) | Pie rehearsal theory |
| [Pie menus retrospective](https://donhopkins.medium.com/pie-menus-936fed383ff1) | Fitts + voystick HN refs |

↑ [Don's sources](README.md) · [Crazy Idea Jam](../../../process/crazy-idea-jam.yml#voystick_homomorphic_vocal_joystick) · [Urban eBike Safari](../../../repo-shows/ideas/urban-ebike-safari.yml) · [Voystick × Pink Trombone show](../../../repo-shows/voystick-pink-trombone/SHOW.yml)
