# CARS 2027: interface to agency, medical leg

Plan for two things that share one argument: Part 7 of the essay
[Interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md),
and Don's presentation and demonstration at CARS 2027 in Berlin.

## The session


|                        |                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme                  | "HCI and Modelling -- where we come from and may be going to" (joint IFCARS project, CARS 2027 through 2030)                                                                 |
| Session                | "IA and AI: pearls and pitfalls", CARS 2027 Berlin. Title from Leo (16 Jul), building on Roy's "IA versus AI"                                                                |
| Date                   | 29 June 2027, the special HCI session; 60 years after Heinz's first PIXIE lecture at the Cambridge Mathematical Laboratory                                                   |
| Venue                  | Langenbeck-Virchow-Haus, Berlin                                                                                                                                              |
| Format (Heinz, 17 Jul) | Four presentations of 15 minutes and a 30–45 minute panel. Two on the 1960s, one on 2027, one 5–10 years ahead                                                               |
| Slots so far           | Leo offered to help organise and take the 2027 slot (17 Jul). Mario offered a Human–AI Model Interaction contribution (22 Jul). Roy offered to co-organise with Leo (16 Jul) |
| Asked of Don           | A presentation and demonstration                                                                                                                                             |
| Planning loop          | Heinz Lemke, Roy Eagleson and his students, Mario Cypko, Leo Joskowicz; Franziska Schweikert for CARS logistics                                                              |
| After                  | 2.5-day IFCARS Think Tank meeting, autumn 2028, Black Forest                                                                                                                 |


Sources: [3 Aug proposal](sources/2026-08-03-cars-2027-hci-modelling-cooperation.md) ·
[13–14 Aug Think Tank thread](sources/2026-08-13-cars-2027-hci-modelling-think-tank.md) ·
[Roy's reply](../roy-eagleson/sources/2026-08-13-think-tank-reply.md) ·
[Leo's reply](../leo-joskowicz/sources/2026-08-14-think-tank-reply.md) ·
[Mario](../mario-cypko/)

Not yet known: which of the four slots is Don's (a 1960s slot for PIXIE, or the 5–10 years ahead
slot for the argument), whether Don sits on the panel, whether a paper is expected (Mario spoke of
submitting to CARS), its length, the proceedings, and the submission deadline. The 16–17 July
messages are in the DonHopkins archive, not yet digested here.

## Why medicine

The essay's cases so far are a game, a butterfly, a bike and a coffeeshop register. In each, a
wrong agent action is cheap to recover from. In a hospital it can harm a patient, so every claim
in the essay has to hold there or be restated.

Heinz's framing already carries the argument. CARS started in 1985 saying medical work stations
would depend on "MODELLING and MAN-COMPUTER INTERACTION techniques". His "Good" future is a
PIXIE III: graph models you can see and poke, with a Model Identity Certificate for the AI models
behind them. Leo's reply names the problem from the other side: the bottleneck of AI is now the
human, and AI promotes a false sense of understanding.

## Part 7 outline

Working title: **The high-stakes case: medicine**. Each section extends an earlier part and needs a
real case from someone who works in the field. No case gets invented to fill a section.

### 1. Where it comes from

PIXIE on the Cambridge PDP-7 (1969), then the 1979 TU Berlin report *A Network of Medical Work
Stations for Integrated Word and Picture Communication in Clinical Medicine*, derived from the
Cambridge Ring and republished by SIIM in 2003 as a PACS anniversary article, then PIXIE II (MMVR
2014: MEBN graphs and screen representations of patient models, on Dave Warner's ANTz). Virtually
all hospitals now run PACS, and, as Heinz notes, its origins are mostly forgotten.

- Extends: the front page and [The Sims](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-sims.md) (pie menus).
- Needs: Heinz's check of the dates and the Cambridge Ring connection.

### 2. The same verbs

No agent-only verbs. When an AI marks a nodule, flags a study, reorders a worklist or drafts an
order, the result is the same kind of object a clinician makes with the same menu: editable,
signed, attributed. What the agent intends to do next sits in a queue the clinician can see and
cancel before it runs, as the Sims queue does.

- Extends: [The Sims](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-sims.md).
- Needs: one current clinical tool where AI output is a different kind of object from human
output, and what that costs in practice.

### 3. What cannot be undone

No agent can pedal the bike, and no agent makes the incision or gives the dose. The ride cannot be
undone but its interpretation can; the procedure cannot be undone but the report, the model and
the plan can. The line between the two decides what an agent may do alone.

- Extends: [Ebike Safari](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/ebike-safari.md).
- Needs: Leo on computer-aided orthopaedic surgery, which steps surgeons kept and why ("how to be
very precisely wrong").

### 4. The model is a file

The patient model as something clinicians read, compare and fork. Mario's Bayesian networks for
head and neck oncology are already this kind of model. The Model Identity Certificate is the file's
provenance record. A tumour board or heart team compares treatments by discussion; a copy of the
model run on each option would put the comparison on screen, where members can inspect it.

- Extends: [The state is a file](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-state-is-a-file.md) ("Agents you can copy").
- Needs: Mario on who may change a clinical model today, how a change is reviewed, and what his
LLM-guided knowledge modelling does when a clinician disagrees with it.

### 5. Legacy software and the layer that clicks

A hospital workflow runs through software nobody in the room can change: the record system, the
PACS viewer, the scanner console, the planning station, the lab system. Each is proprietary, under
a vendor contract, often certified as it ships, and too embedded in the workflow to replace. None
of them was written to be driven by an agent, and most expose no API worth the name. People bridge
them by hand: re-typing values from one screen into another, screenshots, printouts, a phone call.

An agent that is to help there has two choices. It can wait for every vendor to open an interface,
or it can work through the screens that already exist, the way the people do. The second is what
Screen Angel does with a game from 2000, and it has a research lineage:

- **Triggers** (Richard Potter, HCIL, University of Maryland; Macintosh, 1991, funded by Apple):
a macro system that reads the screen's pixels to find the data and the controls it acts on, for
applications that gave a macro no other way in, and posts events to drive them. It also added
behaviour the applications lacked, such as a floating tool palette for MacDraw II made from a
bitmap. "Triggers: Guiding Automation with Pixels to Achieve Data Access", chapter 17 of Allen
Cypher (ed.), *Watch What I Do: Programming by Demonstration*, MIT Press, 1993
([online](http://acypher.com/wwid/Chapters/17Triggers.html)); Potter's "Just-in-time
Programming" is chapter 27 of the same book.
- **Prefab** (Morgan Dixon and James Fogarty, University of Washington): pixel-based reverse
engineering of interface structure. From screen pixels alone it recovers widgets and hierarchy,
then adds behaviour the application never had (target-aware pointing, the bubble cursor,
previews, translated or re-laid-out interfaces) without the application's source, across
toolkits, platforms and remote desktops.
([project](http://homes.cs.washington.edu/~mdixon/research/prefab/))
- **aQuery**, Don's proposal to select and query accessibility trees the way jQuery selects the
DOM, combining screen scraping with accessibility APIs because each covers what the other misses.
([wiki](https://donhopkins.com/mediawiki/index.php/AQuery))
- **Screen Angel**, the layer in Part 4: accessibility tree where there is one, pixels where there
is not, models on top, and every action on a reviewable event ring.

The two test beds in this work share one constraint and differ on a second. Both run software that
has to be used as it is. The Sims 1 is a closed binary from 2000 with no source, no API and no
vendor to ask. The PDP-7 emulator runs the recovered PIXIE code as found, and every departure from
the listing is a named patch. A design that works on either does not depend on anyone changing the
software first.

They differ in what can be seen. The Sims running natively shows only its screen and its files,
which is the hospital's usual case. PIXIE runs on a PDP-7, a Type 340 display and a Titan link that
are written in TypeScript and run in a browser tab, so the machine is fully open while the program
stays fixed: every word of core, every register, every display list, at every step. The same holds
for Little Computer People or Mind Mirror in an Apple II emulator, and for Micropolis compiled to
WebAssembly with a TypeScript interface.

That openness has already paid off. When PIXIE is told to save, it sends its ring structures over
the emulated link to tiny-titan, the stand-in for the Cambridge Titan. A test decodes what arrives,
checks the stream heading against the variables in the running machine's memory, and re-encodes
the structures to exactly the words that crossed the wire. That tests the link code and the codec,
and it tests the transcription: a word misread in the OCR of the 1972 listing, or a bug from the
1970s, shows up as a structure that does not decode or does not match memory. Sending structures
back into PIXIE is the next step. The same access supports a live view and editor of the ring
structures, in memory as PIXIE runs and in the files tiny-titan keeps.

Because it runs in a browser, the standard browser test tools apply (Playwright, as in the
questionnaire project). A test can drive PIXIE, the emulator and the 340 display through two
channels at once: underneath, with full access to internal state, and on the surface, with the
same access a user or an agent has, by reading the screen, clicking, dragging, typing and pointing
a light pen. Each channel checks the other. When what the screen shows can be compared with what
the machine holds, the screen-reading layer can be tested against ground truth before it is used
on software where only the screen is available.

In the clinic, the agent's reading of a clinical screen cannot be checked against the
vendor's internal state, because nobody outside the vendor has it. An emulated or instrumented
test bed where both are visible is where that reading gets measured, and where its error rate is
known before a clinician relies on it.

How far an agent can reach depends on the machine, and hospitals have every kind:

- **A stock Windows or macOS workstation**: the record client, the PACS viewer, many planning
stations. Screen Angel works as it does on The Sims: accessibility tree, screen capture,
synthetic input. Clinical workstations are often locked down so nothing can be installed.
- **A tablet or phone**: iPads, Android tablets and phones at the bedside and on rounds, usually
managed by the hospital. Android is the more open: an accessibility service can read another
app's view tree and perform gestures in it, and screen capture is a standard API. iOS lets no
third-party app read or drive another. Apple's new Siri (September 2026) has on-screen awareness
and acts in apps, but only through what each app's developer exposes with App Intents and view
annotations, routed by Apple's own orchestrator; apps "don't drive each other directly"
([WWDC26](https://developer.apple.com/videos/play/wwdc2026/8011/)). That helps where a clinical
app's vendor adopts it, which is the wait-for-the-vendor route again. From outside, an iPad is
closer to the next kind: video out over USB-C or AirPlay, and input from an external keyboard,
mouse or switch device, which iPadOS accepts for accessibility.
- **An application delivered through Citrix or a remote desktop.** The protocol already carries
the whole screen one way and every key and pointer event the other, so a relay in the middle
can read the screen and inject input without installing anything on the clinician's machine or
the server. It gets only pixels, no accessibility tree (Prefab's case), and the relay has to be
set up by hospital IT because the sessions are encrypted. In return it sits at one point that
serves every workstation, and session recording on these systems is an existing practice that
an audit trail can build on.
- **A bespoke device with a video output and standard input ports**: an ultrasound cart, an
endoscopy tower, a scanner console. A capture card takes the video; a USB device that presents
itself as a keyboard, mouse or button box injects input, as KVM-over-IP boxes do. Nothing is
installed on the device. Custom button panels need an adaptor spliced into the wiring, and that
changes the hardware.
- **A device with only its own screen and buttons**: pumps, ventilators, bedside monitors, the
machines that go ping. The only way in is a camera: the clinician points a phone or tablet at the
device, the agent reads the display and says which button to press, and the clinician presses
it, then points the camera at the display again so the agent can check that the device shows
what it should before giving the next step. A mismatch stops the sequence there. The agent sees,
  advises and checks; only the human acts.
- Some devices also send data out over a serial or network port, usually read-only. That gives
the agent a second channel to check its reading of the screen against, where it exists.

**Camera Angel** is Screen Angel running on a phone or tablet, or on a fixed camera, with the
camera as its input. It can be pointed at anything a person can look at: a workstation screen
where nothing can be installed, a device with only its own display and buttons, the room, and the
people in it, both patients and staff. It works on any of the kinds above, and on the last it is
the only way in. Its output is advice to the person holding or watching it, and that person's hand
does the rest.

The camera case is the essay's rule with nothing left over: the agent has no verb of its own, the
clinician does every step on the controls they were trained on, each instruction is on the
record before the button is pressed, and the device's state after each press is on the record
too, as the image the check was made from. The same check-after-acting applies in the other
cases, where the agent reads the screen after its own input. It is also the case where the
reading is hardest (glare, angle, seven-segment digits, a screen that changes as the hand moves),
so it needs the same measurement against ground truth as the other cases: an emulated device, or
a real one whose data port gives what the screen should show. Pointed at people, it reads what no
screen shows: who is in the room, what their hands are doing, whether a patient is moving or
still.

Factories have the same gap, and it is the one Don's employer, Leela AI, works in: cameras and
machine vision watching what the machine buses and control systems cannot sense, with a neural
layer for perception (detection, pose, tracking), a symbolic layer that reasons over the events
it produces, processing on edge boxes beside the cameras, and a stated rule that the AI advises
and people decide. Carried to a ward, Camera Angel on a fixed camera does what the handheld one
does without anyone holding it: it reads the pump, the monitor and the ventilator continuously, and sees the
hand that presses the button as well as the display that changes. The symbolic layer is where the
check becomes something a clinician can read: after this press, this display should read this
value, and the record says whether it did. Processing beside the camera keeps the video of
patients in the room.

The factory case carries over because nothing in it is specific to factories. A room, the
equipment in it, the people working there, and the events among them are the same objects on a
production line and on a ward. What a hospital adds is a range of uses, sorted by how close each
one is to a clinical decision:

- **Operations**, where a hospital works like a plant: sterile processing, operating-room
  turnover, equipment use and availability, hand hygiene and protective equipment. These are the
  process and safety monitoring Leela's technology already does, with the hospital's operations
  staff as the people who read the results.
- **Workflow**: the steps of a procedure as they happen, which people and which devices took
  part, how long each took, and where the plan and the practice diverged. Surgical workflow is a
  CARS subject, and the people who model it are in the Think Tank.
- **Devices**: reading pumps, monitors and ventilators that have no usable data port, and
  checking each change a clinician makes against what the device then shows.
- **Care**: watching the people under care and the people caring for them, where the questions
  of consent, privacy and regulation are sharpest.

The further down that list, the more the reading feeds a clinical decision, and the more it
matters that every inference can be explained and checked and that people make the decision.
Those are the terms the technology was built on.

The medical version sharpens three things the game version already has. The overlay leaves the
certified binary unmodified, so the question is whether the combination still counts as the same
device. The keylogger problem from Part 4 becomes patient privacy. And the rule that the
automation's interface is the user's interface does real work here: an agent driving the same
screens a clinician drives produces actions the clinician can watch, audit and take over, in the
software the clinician already knows.

- Extends: [Screen Angel](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/screen-angel.md).
- Needs: which systems in each Think Tank member's workflow cannot be replaced or changed, and
which of these kinds each one is; whether clinical workstations there allow installed
software, and which applications come through Citrix or a remote desktop; how people bridge the systems today; whether anyone has seen
automation driving clinical screens or devices and how it was audited; and how regulators treat
each kind: an overlay on a certified workstation application, video capture and injected USB
  input on a certified device, and a phone that only tells the clinician which button to press.
  Also: whether cameras already watch devices on their wards or in their operating rooms, and
  what the rules on recording patients allow; which of the four uses (operations, workflow,
  devices, care) each member would want first; and, for Heinz, where surgical workflow modelling
  stands now and what it cannot yet observe.

### 6. What medicine already has

Medicine has institutions the essay's other domains lack: informed consent, the second opinion,
morbidity and mortality review, and a chart corrected by signed addendum, never erased. The
essay's rule that claims accumulate and are resolved at read time is how a chart already works.
This section says medicine had these first and asks what each looks like when one party is an
agent.

- Extends: [The state is a file](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-state-is-a-file.md) and [Ebike Safari](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/ebike-safari.md) (the exposure log).
- Needs: the clinicians' view of which of these already covers AI and which does not.

### 7. The human bottleneck

Leo's point closes the part. If reading capacity is fixed, an interface has to let a clinician
check what the agent did faster than redoing it: see the queue, poke the model, diff the change.
Where it cannot, the agent should not act. Roy's symbolic-AI pendulum fits here: an inspectable
model is easier to check than an opaque one.

- Extends: the front page claim.
- Needs: Leo's permission to quote his reply in the public essay; Roy's likewise.

## Questions for Heinz, Roy, Leo and Mario

For Heinz:

- Which slot is Don's, and is Don on the panel?
- Is a paper expected alongside the presentation, and in what format and by what date?
- May the essay quote your 13 August framing of PIXIE III and the Model Identity Certificate?

For Mario (his 22 July message already states the medical form of the essay's claim: the LLM
translates what a clinician says into a formal model the clinician can inspect, discuss and
correct; conversation alone is not sufficient; the structured model makes assumptions, sources,
uncertainties and responsibilities visible;
[digest](sources/2026-07-24-pixie-storyline-thread.md)):

- In the laryngeal and head and neck oncology networks, who could change the model, and how was a
change reviewed?
- In the LLM, retrieval and dashboard studies, what happens when the clinician and the model
disagree, and which edits happen by talking and which by pointing at the graph?
- What did the Virtual Heart Team show about several people working one model?

For Leo:

- Which steps in computer-aided orthopaedic surgery did surgeons refuse to hand over?
- May the essay quote your 14 August reply?
- Reply to him personally about "a fool with a tool remains a fool": it has a relative in the
X-Windows disaster notice, which Don remembers being handed out at an early X conference (X10
era), with lines such as "power tools for power fools" and "the world's first fully modular
software disaster"; Don's X chapter of *The UNIX-Haters Handbook* is the citable relative.

For Roy:

- Would the students' PIXIE re-implementation be shown in the same session?
- May the essay quote your 13 August reply?

To route through Heinz to the wider Think Tank (Dirk Wilhelm, Kevin Cleary, Krishna Kandarpa,
Leonard Berliner, Hugo Herrero Antón, Akinobu Shimizu, Carlos Amato): one case each where an
automated step was hard to see or hard to stop, and one system in their workflow that cannot be
replaced or changed, with how people work around it.

## Demonstration candidates

- [PIXIE live](https://hyperties.org/databases/playground/pixie-live/) on the emulated PDP-7: where we come from.
- A small patient-model graph with pie-menu actions that the clinician and the agent share: the
same verbs, the visible queue, fork and diff. A sketch toward PIXIE III, built only after
Mario's answers show what the model should contain.
- The student PIXIE re-implementation, if Roy's group finishes it.

## Rules for this work

- No clinical case, number or quote enters the essay unless its source gave it and agreed to
publication.
- Private correspondence stays in the DonHopkins repo; this file cites only the public digests.
- The essay part is written after the answers arrive; this file is the plan and the questions.

↑ [Heinz Lemke](README.md) · [ideas](ideas.md) · [correspondence](correspondence.yml)