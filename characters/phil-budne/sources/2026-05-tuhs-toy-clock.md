# TUHS, May 2026: the VAX-11/780's clock

The Unix Heritage Society mailing list, thread "DECtapes under the UNIX room floor". Public
list; quoted from TUHS Digest vol. 126, issue 5 (8 May 2026).
[Archive](https://www.tuhs.org/pipermail/tuhs/).

## Phil's question (6 May 2026)

> I wonder: Was the VAX 11/780 the first DEC system that came with an
> RTC/TOY clock out of the box?

## Answers, in brief

- **Clem Cole (6 May):** "Sort of." Not battery-backed, which is why VMS and UNIX both asked
  for the time; the first VAXen with a battery for the TOY clock were the MicroVAX and
  VAXstation machines. J-11 systems and the 11/23+ had one.
- **Paul Winalski (7 May):** the 11/780 and 11/750 had optional battery backup; the 11/730
  had none, which led Dick Hustvedt, chief VAX/VMS engineer, to an April Fools prank: a
  sundial with a photocell at noon, plugged into the 11/730's UNIBUS adapter, with a
  convincing DEC brochure for the "SD730 Fixed Head Solar Horologue".
- **Clem Cole (7 May):** the sundial and brochure were kept in a plexiglass case in a ZK03
  conference room, in Hustvedt's memory.

↑ [Correspondence](../correspondence.md)
