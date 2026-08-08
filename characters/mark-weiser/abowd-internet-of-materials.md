# Gregory Abowd — *The Internet of Materials: The next logical step or a paradigm shift?* 🕯️

*A summary artifact, part of [Mark Weiser's legacy](legacy.yml). Gregory Abowd read Weiser's 1991
paper when he arrived at Georgia Tech in 1994 and it redirected his whole career; this 2019 talk is
that legacy still compounding, three decades on. We summarize public work — we do not speak for
Abowd or Weiser. Memorial standards: [`portrayal-standards.md`](../../schemas/portrayal-standards.md#memorial-mode).*

- **Talk:** UC Berkeley EECS Colloquium, December 5, 2019
- **Video:** https://www.youtube.com/watch?v=qko_wzQeP20
- **Speaker (as introduced):** Gregory D. Abowd — Georgia Tech Regents' Professor & J.Z. Liang Chair, School of Interactive Computing; Associate Dean, College of Computing; ACM Fellow. Two sons on the autism spectrum (relevant to his motivation below).

---

## The method: re-read an old paper, reinterpret it today

Abowd opens with a reusable research philosophy: **every so often, take a 20-to-30-year-old paper
and reinterpret it in the context of today.** His two touchstones:

- **Weiser's 1991 "The Computer for the 21st Century."** He quotes the two sentences he says you
  should read even if you read nothing else: *"The most profound technologies are those that
  disappear. They weave themselves into the fabric of everyday life until they are indistinguishable
  from it."* Weiser's insight was that computing would take on such variety of size and form that
  we'd stop noticing it — like the electric motor, recognized mainly when it breaks.
- **Berkeley's own Smart Dust** (Kris Pister, David Culler, ~1999 MobiCom) — computing shrunk toward
  dust, sensing and communicating on ambient power. Abowd defends "smart dust" as a *powerful*
  vision even though (he notes) Culler later thought the analogy was a mistake.

## The critique: today's "IoT" is neither things nor an internet

Looking at present-day IoT / edge computing, Abowd is blunt: those diagrams "really aren't things,"
and (quoting David Culler) it "isn't really an internet" either. As a human-centered designer he
focuses on the **thing** part — most IoT devices still look like small computers in packaging,
not like the everyday objects they live among.

## Two aspirational goals

1. **The computational Post-it note** — a sticker that looks and feels like paper (costs a fraction
   of a cent, disposable) but that you can *tap and speak to* to record and transmit audio.
2. **The "infinite bit"** — a wristband like a Fitbit that counts and analyzes your movement, is
   waterproof and cheap (rubber bracelets cost ~4¢ in bulk), **and never needs charging.**

## Three constraints in the way

- **Power** — the biggest design factor in anything wearable/mobile; battery size dominates form.
- **Cost** — IC manufacturing yield *compounds*: even 99.9% per step collapses below 90% over the
  ~1,000 steps modern chips take. Computing devices are still too costly to deploy at true mass scale.
- **Form factor** — IoT devices remain clearly identifiable as computers, so they don't "disappear"
  into the environment the way Weiser wanted.

## Computational materials — two flagship projects

- **Saturn** — a thin, flexible, cheap multilayer material (paper + PTFE dielectric + copper,
  laser-cut holes, glue dots). Sound micro-vibrates the layers; **triboelectric** charge separation
  generates an alternating current — so it **harvests power from the very sound it senses**
  (self-sustaining acoustic sensing). Add **passive RF backscatter** and it transmits that signal a
  few feet with no battery — i.e., the computational Post-it note, made real.
- **OptoSense** — self-powered **ambient-light** sensing using commodity photodetectors and
  **printed organic** photovoltaics in 0D / 1D / 2D form factors: detect object states, liquid level
  and type, step counting from wrist-worn arrays, and multi-touch / swipe on a surface — powered by
  ambient indoor light. (Also shown: **Serpentine**, a silicone triboelectric sensor, and a
  multilayer **water-leak** sensor that stays inert for decades until water activates it.)

## The five P's (research opportunities)

**Power**-savvy platforms · **Prototyping** relevant user experiences · **Production** practices ·
**Principles** (drive innovation *and* check the dangerous kinds) · **People** (work with material
scientists and chemical engineers, not just computer scientists).

## The COSMOS conjecture — a re-read of Moore's Law

Moore's Law trained us to expect *shrink, shrink, shrink* via ever-cleverer **integrated-circuit**
manufacturing. Abowd's inversion: use ever-cleverer ways to manufacture **at lower cost and larger
scale** — bulk-process transistors chemically (like fractionating gasoline), sort them by
performance into a "device ink," disperse and vision-wire them on surfaces. Not smaller and faster,
but **cheaper and everywhere**. He thinks it's less than a decade off.

## The human core

Abowd's most personal motivation: his oldest son (22 at the time), who is non-speaking, communicates
by tapping letters on a **laminated alphabet board** while a partner transcribes. A paper-thin,
battery-free, wireless keyboard — the kind computational materials could make — would turn that board
into a real input device. A concrete reminder that "disappearing" computing is, at its best, about
serving human needs.

## Sharp moments from Q&A

- **William Gibson quote (from an audience question):** asked how he foresaw how tech would be used,
  Gibson reportedly said don't ask technologists — *"give me a roomful of artists and criminals."*
- **Privacy:** a paper microphone with no feedback is a surveillance problem; Abowd's partial answers
  — require physical touch to power it, and spend harvested energy on an **electrochromic-ink**
  "recording" indicator — but he concedes belief/trust in such devices is the hard part.
- **Toxicity:** an audience member pushes on nanoparticle/e-waste health risks of "computing in the
  dust/fluids"; Abowd's response is that controlling the base materials lets you choose **non-toxic,
  renewable, biodegradable** ones — which is *why* materials literacy matters.
- **Affordance discovery** as a genuine paradigm shift: when *everything* computes, how do people
  learn what they can interact with, and how, without instructions everywhere?
- **Reading list for the future:** "**science fiction**" — because it explores the implications of
  technology by assuming it already works.

---

## Why this belongs in Mark's memorial

Abowd is Weiser's legacy in a single career: a researcher who read "The Computer for the 21st
Century," changed direction, and has spent 25+ years chipping at the same vision — now arguing the
way to finally make computing "disappear" is to stop shrinking chips and start growing **materials**.
He's a natural voice for [Remembering Mark Weiser](../../repo-shows/remembering-mark-weiser/remembering-mark-weiser.yml)
(consent not_yet_asked), and this talk pairs directly with the calm-tech thread in
[`ideas.md`](ideas.md) and the *Ubik → ubicomp* seed in [`pkd-lem-ai-sf.md`](pkd-lem-ai-sf.md).

*Source: talk transcript, [youtube.com/watch?v=qko_wzQeP20](https://www.youtube.com/watch?v=qko_wzQeP20). Figures/quotes paraphrased from Abowd's public presentation.*
