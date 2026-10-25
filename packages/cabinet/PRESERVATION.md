# Preservation: what David Rosenthal's report means for the cabinet

In 2015 David Rosenthal wrote a report for the Mellon Foundation,
[*Emulation & Virtualization as Preservation Strategies*](../../characters/david-rosenthal/sources/rosenthal-emulation-2015.md),
and followed it in 2016 with ["The Architecture of Emulation on the Web"](https://blog.dshr.org/2016/04/the-architecture-of-emulation-on-web.html)
and a [talk at the Jisc/CNI workshop](https://blog.dshr.org/2016/07/talk-at-jisccni-workshop.html).
This page reads the cabinet against them: what it already does, what it gets wrong, where the work
leads, who it is for, and how to pay for it.

## His argument in brief

Emulation in the browser works, at scale: "You don't even need to know you're seeing an emulation"
(2016). What holds it back is the cost of preparing preserved system images, the lack of standards
that would let one framework's images run in another, the absence of any institution paying for
emulator maintenance, and the law. "Emulation is not a panacea": it costs more per artefact than
migration, most of the cost is ingest, and the deeper problem is that "the resources available are
inadequate." Games are emulated because they have a market and fans; "preserving content for
scholars lacks the business model and fan base of retro gaming." In the 2016 talk his conclusion
went further: as containers take over computing, migration-based preservation will come to look
obsolete.

## The cabinet against his list

His eight tasks (§6), with what the cabinet has, what is planned, and what is missing.

| Task | Today | Planned | Missing |
|------|-------|---------|---------|
| 6.1 Standard system images | The RB09 disk uses SIMH's attach format, so UNIX's `image.fs` moves between SIMH and the cabinet unchanged ([UNIX-V0.md](UNIX-V0.md)) | A cartridge as a self-describing directory, `cartridge.yml` plus its media ([CARTRIDGES.md](CARTRIDGES.md) §1); portable JSON snapshots ([WEB-BENCH.md](WEB-BENCH.md)) | Cartridges are still entries in the applet's program table. No link to the qcow2 and XML world of other frameworks |
| 6.2 Standard access | A stable URL per program, `/cabinet/<program>/` | Loading a cartridge from any repository ([CARTRIDGES.md](CARTRIDGES.md) §7) | A media type for a cartridge, so a link names the artefact, not the cabinet (see below) |
| 6.3 Standard invoking | One device contract inside the cabinet, and one port for local or remote play | | Wrapping other emulators |
| 6.4 Tools for images | The OCR'd PIXIE listing assembled and checked by running it; literal pools recovered by script ([PIXIE-RESTORATION.md](PIXIE-RESTORATION.md)) | A build cache, verify steps, decoding binaries back to verified source, CI that rebuilds every cartridge ([CARTRIDGES.md](CARTRIDGES.md) §§2, 4, 7) | Imaging physical media; identifying file systems |
| 6.5 Metadata | Provenance READMEs for each tape; source maps from core to the scanned listing | Typed links between every layer, by hash ([DESIGN.md](DESIGN.md#source-maps-as-transclusion-layers-spans-links)) | PRONOM, PREMIS, any shared registry |
| 6.6 Emulator support | SIMH is the oracle the cabinet is checked against | A JK09 disk and a radio probe offered back to SIMH ([UNIX-V0.md](UNIX-V0.md), [AM-RADIO.md](AM-RADIO.md)) | Contributions made rather than offered; any pooled funding |
| 6.7 Internet emulators | Cartridges carry data, not code that escapes the emulator | tiny-titan as a gateway to the network ([MANIFESTO.md](MANIFESTO.md)) | A written default-deny policy; Memento, which matters once ITS is networked |
| 6.8 Legalities | Everything run so far is open or used with its authors' permission: PIXIE with Heinz Lemke, PDP-7 UNIX under GPLv3, Mitch Bradley's Forth under MIT; ROMs are supplied by the user, never committed | | A LICENSE file. [RIGHTS.md](../../RIGHTS.md) declares the code MIT and the writing CC BY 4.0, but the repository has no license file, so GitHub reports none |

On his shared concerns (§2.4): **execution fidelity** is checked by tests, by SIMH and by DEC's 1964
light pen diagnostic; **experiential fidelity** is the subject of the AM radio, the photocell pen in
[BEAM-AND-PEN.md](BEAM-AND-PEN.md), the [portrait](PORTRAIT.md) and
[CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md), all planned. Two honest gaps: every instruction counts as
one cycle, and the pen is sampled once per browser frame. **Load** is the Internet Archive's model:
the reader's browser does the work, so serving costs almost nothing. **Curation cost** has not been
measured, though the AI model bills for the PIXIE restoration, in the thousands of dollars a month,
are a rare concrete figure ([PIXIE-RESTORATION.md](PIXIE-RESTORATION.md#what-it-cost)).

## The criticism to take seriously

In 2016 he wrote that the frameworks' links "are to specific emulation instances. Over time
emulation technology will improve, and these links will break." A page that wraps an image in one
emulator "makes it accessible in the present, not preservable for the future." The cabinet's
`/cabinet/symelec/` is exactly such a link: it names the cabinet, not PIXIE.

The answer is to make the cartridge the thing that is preserved, and the cabinet one way to play it:

- **A cartridge is an artefact.** A directory with the media (tapes, disks, listings, scans), a
  `cartridge.yml` naming the machine and devices it needs, the provenance and license of every file,
  and checksums. Nothing in it depends on the cabinet's code.
- **It has a media type.** So a page can link to the cartridge and let the reader's browser choose
  what plays it, as he proposed with emulation MIME types and an "emul.js" like pdf.js.
- **It can live in an archive.** A cartridge is a natural Internet Archive item, held by the
  Archive and runnable by the cabinet today and by whatever replaces it; that is the first thing to
  ask Jason Scott ([invitation](../../characters/jason-scott/invitation.md)).
- **It exports to SIMH.** Where SIMH has the machine, a cartridge should produce what SIMH needs, as
  the RB09 disk already does, so there are always two players.

## Where this leads, and why

- **Teaching supplies the fan base scholarship lacks.** Games are preserved because people want to
  play them. A PDP-7 is preserved if people want to learn from it. The cabinet's bet is that showing
  how a machine works, from the hand on the light pen to the line in the scanned listing, gives
  teachers, students, museum visitors and the audience of a Repo Show a reason to come back. In his
  report the Blue Ribbon Task Force is quoted: "the only real justification for preservation is to
  provide access." Access that teaches is a stronger justification.
- **Keep the letter with the disk.** Jeff Rothenberg's 1995 article that started the debate opens
  with grandchildren in 2045 finding a CD-ROM and a letter explaining it, and observes that "only
  the letter will be immediately intelligible 50 years from now"
  ([*Scientific American* 272(1), January 1995](https://doi.org/10.1038/scientificamerican0195-42); [preview](https://web.archive.org/web/20110426062417/http://www.sciamdigital.com/index.cfm?fa=Products.ViewIssuePreview&ARTICLEID_CHAR=07FBACA7-7185-43C8-B9E7-E07B5343F87)).
  The cabinet's letters are the listings, scans, manuals and films. They are readable with no
  machinery, and the source maps tie every word in core back to them, so the paper explains the
  machine and the machine checks the paper.
- **Running the document checks the document.** The PIXIE listing was corrected by assembling it and
  running it. That turns an emulator into a tool for verifying a scan, which is work libraries
  already value, and it is cheap once the machine exists.
- **Curation can be measured.** Ingest dominates the cost of preservation. AI-assisted restoration
  changes that cost, and nobody has published numbers. Logging the hours and the model costs for
  each cartridge, with what was verified and how, would give him and others data he didn't have.
- **One person is a risk.** He called Jason Scott's work "personal rather than institutional." The
  cabinet is too. The remedies are an open license, cartridges that outlive the cabinet, upstream
  work in SIMH, and an institution that hosts or adopts it.
- **Open source is the best-preserved software.** David's 2009 talk at the Library of Congress made
  the point that open source is "best preserved of all," because its source and history let anyone
  rebuild the stack, and an open source renderer is "executable 'preservation metadata'"
  ([slides](https://www.digitalpreservation.gov/multimedia/documents/rosenthal_slides072709.pdf)).
  The cabinet is open source, and the emulator is itself the renderer for the cartridges: keeping
  both open is the most durable thing the project can do.
- **The law is the hard part, and here it is avoided.** By choosing software whose authors agree or
  whose license allows it, the cabinet can show the whole path, from scan to running machine to
  archive item, without the legal barrier that stops most collections. It is a clean example for the
  cases that are harder.

## Who it is for

- **Museums with the real machines.** The Interim Computer Museum, which now has PDP-7 serial 129
  ([UNIX-V0.md](UNIX-V0.md)); the Computer History Museum; Cambridge. A cartridge runs on a kiosk,
  needs no maintenance, and can be checked against their machine.
- **Libraries and archives.** Cambridge University Library, whose PIXIE films need a durable home;
  Stanford, with Terry Winograd's CS547 recordings; the Internet Archive, as a home for cartridges.
- **Teachers and students.** Roy Eagleson's students at Western, who planned to reimplement PIXIE as
  an HCI exercise; anyone
  teaching Forth, assembly, graphics, operating systems or the history of interfaces
  ([TEACHING.md](TEACHING.md)).
- **Historians.** Of graphics and of interfaces: PIXIE's radial menus came two decades before pie
  menus, and the evidence now runs.
- **Emulator developers.** SIMH, through tested contributions; anyone who wants a browser front end
  with source maps down to the scanned page.
- **The people who made the software, and their families.** Heinz Lemke, who ran PIXIE in the 1969
  films and is still active, can use it again, and show it to others.

## Paying for it

Verified in October 2026. The detail and sources are in
[the report notes](../../characters/david-rosenthal/sources/rosenthal-emulation-2015.md#since-2015).

| Route | Fits | First step |
|-------|------|-----------|
| [NLnet](https://nlnet.nl/funding.html) | Individuals may apply; the work must be free software. The best fit for an independent developer in Europe | Add a LICENSE file; watch for the next call |
| [GitHub Sponsors](https://docs.github.com/en/sponsors/receiving-sponsorships-through-github-sponsors/about-github-sponsors-for-open-source-contributors), [Patreon](https://www.patreon.com/c/DonHopkins) | Individuals and institutions; Patreon has institutional tiers already ([FOR-MUSEUMS.md](FOR-MUSEUMS.md#support)) | Turn on GitHub Sponsors |
| A fiscal sponsor: [Software Freedom Conservancy](https://sfconservancy.org/projects/apply/), which hosts QEMU, SPI, or [Open Source Collective](https://docs.oscollective.org/getting-started/acceptance-criteria) | Tax-deductible donations and grants to the project rather than to a person. Open Source Collective wants a license and an organization account, not a personal one | A license, and a GitHub organization for the cabinet |
| [Mellon Foundation](https://www.mellon.org/grant-programs/public-knowledge), Public Knowledge | Funded his report and Yale's EaaSI; grants go to institutions, mostly by invitation | A museum, library or university as partner |
| The [Software Preservation Network](https://www.softwarepreservationnetwork.org/) | A membership network of institutions, home of EaaSI and of the §1201 exemptions | Through a member institution |
| US federal funding (IMLS, NEH) | US institutions only, and uncertain in 2025–26 | Only through a US partner |
| Commissioned exhibits | A museum pays for a version for its own exhibit ([FOR-MUSEUMS.md](FOR-MUSEUMS.md#support)) | Ask the museums above |

The pattern is the same for most of them: a clear license, a project rather than a person, and an
institution willing to be named as a partner.

## Unfinished work

1. **A LICENSE file** at the root, matching what RIGHTS.md already declares. Don's decision; it
   blocks NLnet and the fiscal sponsors, and David's 2009 advice was simply "Please use Creative
   Commons licenses."
2. **Cartridges for real**: `cartridge.yml` for each program in `tapes/`, with provenance, license
   and checksums, and a media type.
3. **A first Archive item**: one cartridge, with its listing and scans, offered to the Internet
   Archive through Jason Scott.
4. **A cost log**: hours, model costs and verification for each restoration.
5. **SIMH contributions**: the JK09 and anything else the cabinet adds that SIMH lacks, as pull
   requests.
6. **Memory-cycle timing**, which the radio, the photocell pen and honest fidelity all wait on.
7. **A partner**: one museum, library or university willing to host cartridges and apply with the
   project.
8. **An NLnet application**, once 1 and 2 are done.

↑ [README](README.md) · [FOR-MUSEUMS](FOR-MUSEUMS.md) · [Rosenthal 2015](../../characters/david-rosenthal/sources/rosenthal-emulation-2015.md)
