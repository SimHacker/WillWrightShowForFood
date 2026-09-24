# Leo Joskowicz: papers

Chosen for the CARS 2027 medical part of the interface-to-agency essay
([plan](../../../heinz-lemke/cars-2027-medicine.md)): what surgeons keep and what machines do, how
AI output should admit uncertainty, and where the human is the bottleneck.

## Cached here

| File | Paper | Source of copy |
|---|---|---|
| [1996 overview](1996-taylor-joskowicz-ibm-computer-integrated-surgery-overview.pdf) | R. H. Taylor, J. Funda, L. Joskowicz, A. D. Kalvin, S. H. Gomory, A. P. Gueziec, L. M. G. Brown. "An overview of computer-integrated surgery at the IBM Thomas J. Watson Research Center." *IBM J. Res. Dev.* 40(2):163–183, 1996. [doi:10.1147/rd.402.0163](https://doi.org/10.1147/rd.402.0163) | [Russell Taylor's IBM page](https://www.cs.jhu.edu/~rht/RHT%20Medical%20Robotics%20Research%20at%20IBM.html) |
| [1996 insertion](1996-joskowicz-taylor-interference-free-insertion.pdf) | L. Joskowicz, R. H. Taylor. "Interference-free insertion of a solid body into a cavity: an algorithm and a medical application." *Int. J. Robotics Research* 15(3):211–229, 1996. [doi:10.1177/027836499601500301](https://doi.org/10.1177/027836499601500301) | Taylor's page |
| [1999 revision hip](1999-taylor-joskowicz-revision-total-hip-replacement.pdf) | R. H. Taylor, L. Joskowicz, B. Williamson et al. "Computer-integrated revision total hip replacement surgery: concept and preliminary results." *Medical Image Analysis*, 1999. [doi:10.1016/s1361-8415(99)80026-7](https://doi.org/10.1016/s1361-8415(99)80026-7) | Taylor's page |
| [2025 annotation (JATS XML)](2025-ryabtsev-joskowicz-radiologist-annotation-few-shot.xml) | A. Ryabtsev, R. Lederman, J. Sosna, L. Joskowicz. "Streamlining the annotation process by radiologists of volumetric medical images with few-shot learning." *IJCARS* 20:1863–1873, 2025. [doi:10.1007/s11548-025-03457-3](https://doi.org/10.1007/s11548-025-03457-3) | Europe PMC full text, PMC12476431, CC BY |

## Read but not cached

- L. Joskowicz, M. Beil, S. Sviri. "Artificial Intelligence interpretation of chest radiographs in
  intensive care. Ready for prime time?" *Intensive Care Medicine* 51:154–156, 2025 (editorial,
  online 20 Nov 2024). [doi:10.1007/s00134-024-07725-9](https://doi.org/10.1007/s00134-024-07725-9).
  Free to read on the publisher's site, which refuses scripted download.
- A. Davidson, G. Feldman, R. Mosheiff, A. Suna, L. Joskowicz, Y. A. Weil. "Computer-generated
  radiographic measurements of distal radius fractures: does it help with decision making?"
  *J. Hand Surgery* 49(8):796–803, 2024 (online 2022).
  [doi:10.1016/j.jhsa.2022.09.015](https://doi.org/10.1016/j.jhsa.2022.09.015). Abstract only.

## Not reached

- L. Joskowicz, E. J. Hazan. "Computer Aided Orthopaedic Surgery: incremental shift or paradigm
  change?" *Medical Image Analysis* 33:84–90, 2016 (20th anniversary issue).
  [doi:10.1016/j.media.2016.06.036](https://doi.org/10.1016/j.media.2016.06.036). Revised as a
  chapter in *Intelligent Orthopaedics*, Springer, 2018,
  [doi:10.1007/978-981-13-1396-7_2](https://doi.org/10.1007/978-981-13-1396-7_2). No open copy
  found; ask Leo for the author's copy.
- The talk with "how to be very precisely wrong" and "a fool with a tool remains a fool". Not in
  his CV's publication list; ask Leo for the slides.

## What each gives the essay

**IBM overview, 1996.** The group's premise, in its own words: "By combining human judgment with
machine precision, such systems permit a surgeon to perform critical surgical tasks better than an
unaided surgeon, and enable the surgeon to do other tasks that could not be done at all." The
paper covers Robodoc for cementless hip replacement, craniofacial planning, the LARS laparoscopic
assistant, and medical modelling, and lays out the chain from imaging and model through planning,
registration and execution to follow-up. It is the division of labour between surgeon and machine
as the people who built the first surgical robots drew it. It also names the problem of the
surgeon who "must often rely on an assistant to point the camera", which the LARS work addressed.

**Interference-free insertion, 1996.** Leo's configuration-space work from his thesis, applied to
whether a custom hip implant can be inserted into the reamed canal: it finds an insertion path or
reports where the implant sticks. The program is a check made before the operation, on the
model, with an answer a person can inspect.

**Revision hip, 1999.** Robodoc's approach carried to revision surgery, the replacement of a
failed hip implant. Not yet read past the title.

**Chest radiographs in intensive care, 2025.** Intensivists read most ICU chest films first, under
pressure and with less diagnostic proficiency than radiologists; AI for this lags AI for radiology.
The editorial's first proposal is that the model be allowed to output "indeterminate" instead of
being forced to give a precise label for every finding. The second is to detect change between
consecutive films instead of labelling each one, since change is easier to detect and matters
more for a deteriorating patient. The third is to combine the films with monitors and laboratory
data over time, toward AI that advises on treatment. This is the written form of "how to be very
precisely wrong": the remedy is an output that can say it does not know.

**Distal radius measurements, 2022/2024.** Nine surgeons chose casting or plating for 35 fracture
cases, then again three weeks later with software-computed radiographic measurements beside the
films. Agreement between surgeons rose from poor to moderate (intraclass coefficient 0.35 to
0.50). The software measures; the surgeons decide. A measured case of a tool that changes human
judgment without taking the decision.

**Radiologist annotation, 2025.** A few-shot model labels scans, the radiologist corrects a subset,
the scans needing least correction come first, and the corrected set trains a supervised model.
The radiologist's correction effort is the quantity being reduced. This is Leo's "the bottleneck
is the human user" turned into a method: the design target is the human's time.
