# Emulation & Virtualization as Preservation Strategies (2015)

David S. H. Rosenthal, LOCKSS Program, Stanford University Libraries. A report for the Andrew W.
Mellon Foundation, on behalf of itself, the Sloan Foundation and the US Institute of Museum and
Library Services, October 2015. 37 pages; references on pp. 31–37.

**PDF:** [rosenthal-emulation-2015.pdf](rosenthal-emulation-2015.pdf), copied from the
[UNT Digital Library](https://digital.library.unt.edu/ark:/67531/metadc799755/m2/1/high_res_d/rosenthal-emulation-2015.pdf)
(ark:/67531/metadc799755) on 25 October 2026.

**License:** Copyright © 2015 Andrew W. Mellon Foundation, licensed under
[Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/),
as stated on its first page. Redistributed here unchanged under that license.

**What follows from it for the cabinet:** [PRESERVATION.md](../../../packages/cabinet/PRESERVATION.md).

## The argument

Of the two basic strategies for keeping digital things usable, migration (converting them to
current formats) has been strongly favored over emulation (running the original software on a
stand-in for the original machine). Emulation frameworks that deliver an emulator as an ordinary
part of a web page removed the main barrier: "Readers see no difference between the emulated
artefact and other components of a Web page" (p. 3). Two barriers remain: the tools for creating
preserved system images are inadequate, and the legal basis for giving access to them is unclear,
and highly restrictive where it is clear.

He is not selling it. "Emulation is not a panacea" (p. 1). It costs more per artefact than
migration, most of the cost is ingest (metadata and quality assurance), and "the most important
reason for the failure of current strategies to collect and preserve the majority of their target
material is economic; the resources available are inadequate."

## Section by section

**1. Introduction (pp. 2–3).** Jeff Rothenberg's 1995 *Scientific American* article, "Ensuring the
Longevity of Digital Documents" (vol. 272, no. 1, pp. 42–47;
[doi:10.1038/scientificamerican0195-42](https://doi.org/10.1038/scientificamerican0195-42),
[JSTOR](https://www.jstor.org/stable/24980135)), set up the choice
([preview, archived](https://web.archive.org/web/20110426062417/http://www.sciamdigital.com/index.cfm?fa=Products.ViewIssuePreview&ARTICLEID_CHAR=07FBACA7-7185-43C8-B9E7-E07B5343F87)).
It opens in 2045, with grandchildren finding a CD-ROM and a letter in an attic: "only the letter
will be immediately intelligible 50 years from now." On the same page (p. 42): "It is only slightly
facetious to say that digital information lasts forever—or five years, whichever comes first."
Rothenberg favored emulation; migration won anyway. Early demonstrations "had little effect," and the search for a Universal Virtual Computer
"diverted resources that could have been applied to making the existing emulations easily usable."
Terminology: a *preserved system image* is "a set of stored data that is input to an emulator or a
VMM": configuration, storage media, and optionally memory.

**2. Looking backward (pp. 3–19).** An emulation service has three parts: emulators, a collection of
system images with metadata, and a framework that joins them.

- *Emulators (2.1):* QEMU, MAME and MESS (merged in 2015; JSMESS compiles them to JavaScript with
  Emscripten), Basilisk II, DOSBox, SheepShaver, UAE.
- *Frameworks (2.2):* bwFLA at Freiburg, emulation as a service in the cloud, with each emulator
  wrapped behind standard interfaces; Olive at Carnegie Mellon, which streams a virtual machine to
  the reader's computer but needs software installed; and the Internet Archive's, which runs the
  emulator in the reader's browser, so the Archive pays only to store and serve the files.
- *Collections (2.3):* Rhizome (the Theresa Duncan CD-ROMs: 4,644 sessions in two months, median 99
  seconds), the Internet Archive (nearly 36,000 items, p. 11, passage below), Carnegie Mellon (17
  images, campus only), Yale (about 440 CD-ROMs in a pilot), the German National Library (about
  500,000 physical carriers), the British Library. "The key to emulation's usefulness as a
  preservation strategy will be large collections of preserved system images."
- *Shared concerns (2.4):* emulator support, metadata, fidelity, load, intellectual property and
  curation tools; the passages below cover the first three. Load: browser frameworks bring their
  own computing, cloud frameworks must buy it (Bomb Iraq peaked at about 20 times normal load).
  Intellectual property, at length (pp. 16–18): every layer of the stack is licensed, fonts
  included; rights holders are often unfindable; "Institutions will not build … collections … at
  the scale needed … unless the legal basis for doing so is clarified." Curation: a base operating
  system image "might take 2–20 hours," packaged software an hour or two, research software
  person-weeks (p. 18).
- *Conclusions (2.5):* emulation works and scales. Most of what is emulated is games, which have a
  market and fans; "preserving content for scholars lacks the business model and fan base of retro
  gaming." bwFLA and Olive are "strikingly similar," but "their XML metadata is system-specific, so
  they cannot share preserved system images."

**3. The last two decades (pp. 19–23).** Artefacts became networked, active and huge; JavaScript
became the Web's assembly language. Hardware moved to GPUs and phones, Moore's Law speedups ended,
and old images grow less safe with age.

**4. Looking forward (pp. 23–26).** Networked artefacts need an "Internet Emulator" that serves the
web as it was, using Memento, sandboxed with "very restrictive default policies." GPUs and phones
are hard to emulate. Current artefacts will be "far more difficult and costly" to preserve.

**5. Sustainability (pp. 26–27).** Increasing returns favor one or a few "good enough" technologies.
Emulators are maintained by retro gamers and QEMU's developers, with "no effective mechanism" for
preservation-specific work. Olive and bwFLA had two or three years of grants and no plan for what
came after, or for the legal problem of selling access to software they don't own. The Internet
Archive's collection is "the result of dynamic leadership and its curation is of very variable
quality"; it is "hard to imagine any other institution" copying it.

**6. The to-do list (pp. 27–30).** Four goals: cheap packaging, reuse, no repackaging for each
framework, and links that don't depend on one framework. Links into a particular service, like the
Theresa Duncan URLs, make artefacts "not themselves discoverable or preservable." Eight tasks, and
his ranking (Table 3, p. 30):

| Task | Difficulty | Impact | Cost |
|------|-----------|--------|------|
| 6.1 Standard system images | Low | Medium | Low |
| 6.2 Standard access to images | Low | Medium | Low |
| 6.3 Standard invoking | Low | Low | Low |
| 6.4 Improved tools | Medium | High | Medium |
| 6.5 Metadata databases | Low | Low | Low |
| 6.6 Emulator support | Low | Medium | Medium |
| 6.7 Internet emulators | Low | Low | Low |
| 6.8 Legalities | High | High | High |

For emulator support he suggests pooled programmers, bounties or a hackathon. For the law: legal
deposit in national libraries to collect operating systems and libraries, with reading-room access,
and lending on the Internet Archive's model, one reader per copy.

**7. Conclusion (pp. 30–31).** Current efforts save less than half of what they aim at. Emulation
will matter more because it reaches artefacts migration can't, but it costs more, and diverting
scarce resources to it could make the shortage worse.

## Passages

From §2.3.2, *Internet Archive* (p. 11), with footnote 2:

> The Internet Archive's software collection currently holds nearly 36,000 items, including more
> than 7,300 for MS-DOS, 3,600 for Apple, 2,900 console games and 600 arcade games. Some can be
> downloaded, but most can only be streamed.
>
> The oldest is an emulation of a PDP-1 with a DEC 30 display running the Space War game from 1962
> [49], more than half a century ago. As I can testify having played this and similar games on
> Cambridge University's PDP-7 with a DEC 340 display seven years later, this emulation works well
> (Figure 13).²
>
> The quality of the others is mixed. Resources for QA and fixing problems are limited; with a
> collection this size problems are to be expected. Jason Scott crowdsources most of the QA; his
> method is to see if the software boots up and if so, put it up and wait to see whether visitors
> who remember it post comments identifying problems, or whether the copyright owner objects.
>
> ² The Computer History Museum has restored PDP-1 hardware [35] that runs Space War [12].

Reference [49] is the Archive's [Spacewar! for the PDP-1](https://archive.org/details/pdp1_spacewar).
The PDP-7 and 340 are the machine of
[My Introduction to Computer Graphics](https://blog.dshr.org/2026/07/my-introduction-to-computer-graphics.html),
and of Heinz Lemke's PIXIE, which now runs in the cabinet.

Later in §2.3.2, on sound, quoting Jason Scott:

> Sound has turned out to be one of the more difficult issues with JavaScript programs. Different
> browsers handle sound differently, and the human ear notices tiny differences in sound quality
> much more than they noticed microscopic slowdowns in video rendering. This is definitely on the
> list to be improved as soon as possible, as soon as we have the best solution in place.

The cabinet's [AM radio](../../../packages/cabinet/AM-RADIO.md) takes up that problem for the
PDP-7.

From §2.4.1, *Emulator Support* (p. 14):

> Jason Scott at the Internet Archive has been remarkably effective at encouraging emulator
> developers to work on problems relevant to preservation, but this is a personal rather than
> institutional effort. If emulation is to become a mainstream preservation technology some
> mechanism for commissioning fixes for critical problems from the emulation community will be
> needed.

The cabinet is one more result of that encouragement: Jason's answer about the Archive's Apple II
emulation in 2025 is what pointed Don toward emulation in the browser.

From §2.4.2, *Metadata* (p. 14): the tools of the time (JHOVE, DROID, Siegfried, PRONOM) "cannot
identify or record the dependencies that specify the emulator, operating system and application
needed to emulate a preserved artefact." Besides technical and bibliographic metadata, he names
usability metadata, such as key bindings, which the Archive's visitors often supplied in comments,
and usage metadata, which helps justify funding but raises privacy questions.

From §2.4.3, *Fidelity* (p. 15), on the same Spacewar emulation:

> The experience of pointing and clicking at the Internet Archive's web page, pressing LEFTCTRL and
> ENTER to start, watching a small patch in one window on your screen among many others, and
> controlling your spaceship from the keyboard is not the same as the original. That experience
> included loading the paper tape into the reader, entering the paper tape bootstrap from the
> switches, and pressing the Start switch (Figure 20). The program displayed on a large, round,
> flickering CRT.

He distinguishes execution fidelity, whether the emulation runs the program correctly, from
experiential fidelity, how close the user's experience is to the original user's.

## Before 2015: Rothenberg, and David's answer to him

Rothenberg's article ([Semantic Scholar](https://www.semanticscholar.org/paper/Ensuring-the-Longevity-of-Digital-Documents-Rothenberg/6f973a607d783e9fe12b3e56b6e02c22b0805376)
lists 359 citations) led to his 1999 report for the Council on Library and Information Resources,
[*Avoiding Technological Quicksand*](https://www.clir.org/pubs/reports/rothenberg/), the full case for
emulation. David's 2009 slides, below, credit the 1995 article with getting governments and
foundations to start funding digital preservation: the Mellon Foundation, NSF, the Library of
Congress and the National Archives.

In 2009, at the Library of Congress, David asked
["How are we 'Ensuring the Longevity of Digital Documents'?"](https://www.digitalpreservation.gov/multimedia/documents/rosenthal_slides072709.pdf)
(slides, CC BY-NC-ND 3.0 US). Kirk McKusick's Unix file system could still read every disk it had
ever written, after thirty years. Documents had moved online, where copying is built in; formats had
become standards with open source renderers; virtual machines had become ordinary. So on format
obsolescence, "Jeff wrong in every particular," though "Jeff was right about emulation – But
preservation wasn't the reason for doing it." His points that bear on the cabinet:

- "Open Source is best preserved of all": source, history, and the ability to rebuild the stack as
  it was. A format with an open source renderer is safe, its renderer being "executable
  'preservation metadata'."
- Scale and cost: preserving a document at a time is impractical, and "1 hour of 1 lawyer ≈ 5TB of
  disk."
- His practical next steps: collect the bits; "Please use Creative Commons licenses"; "Preserve
  Open Source repositories: Easy & vital"; "Support Open Source renderers & emulators"; "KISS."

The 2015 report is the next step in the same argument: by then emulation had become practical in
the browser, and the remaining barriers were tools, standards, money and the law.

## Since 2015

- **His own follow-up.** In ["The Architecture of Emulation on the Web"](https://blog.dshr.org/2016/04/the-architecture-of-emulation-on-web.html)
  (April 2016) he proposed MIME types for emulations and disk images, and a standard picker like
  pdf.js, warning that wrapping an image in one particular emulation "makes it accessible in the
  present, not preservable for the future."
- **The law.** The Copyright Office granted a software preservation exemption to §1201 in 2018
  ([Harvard Cyberlaw Clinic](https://clinic.cyber.harvard.edu/2018/10/26/a-victory-for-software-preservation-dmca-exemption-granted-for-spn/)).
  The 2024 rule allows off-premises access to preserved software "to only one user at a time, for
  a limited time" per lawfully owned copy, close to the lending he proposed, but keeps video games
  on the premises ([Federal Register, 28 Oct 2024](https://www.govinfo.gov/content/pkg/FR-2024-10-28/pdf/2024-24563.pdf);
  [Video Game History Foundation](https://gamehistory.org/dmca-2024-statement/)). The 2027 cycle
  is open ([copyright.gov](https://www.copyright.gov/1201/2027/)). For books, the courts rejected
  the Internet Archive's lending in *Hachette v. Internet Archive* (2024).
- **Emulation as a service.** Yale's EaaSI program, which Mellon funded with $750,000 in 2020
  ([Mellon](https://mellon.org/grant-details/eaasi-(emulation-as-a-service-infrastructure)%3A-phase-ii-20446893)),
  continues in the [Software Preservation Network](https://www.softwarepreservationnetwork.org/).
  bwFLA's line continues as [OpenSLX's EaaS](https://www.openslx.com/), which
  [Rhizome](https://rhizome.org/artifacts-and-infrastructure/) uses.
- **The browser.** WebAssembly became a W3C Recommendation in 2019
  ([W3C](https://www.w3.org/press-releases/2019/wasm/)); the Archive runs MAME compiled to it, and
  added Flash through Ruffle in 2020 ([Internet Archive](https://blog.archive.org/2020/11/19/flash-animations-live-forever-at-the-internet-archive/)),
  as §4.2 predicted Flash would need.

## Why it's here

David introduced Don to Jason Scott in October 2026; §2.3.2 is where he had described Jason's work
nine years earlier ([Jason Scott](../../jason-scott/README.md)). The cabinet is a browser emulator
on the path this report describes, and its plans answer several of its tasks; which ones, how far,
and what is missing is worked through in [PRESERVATION.md](../../../packages/cabinet/PRESERVATION.md).

↑ [David Rosenthal](../README.md)
