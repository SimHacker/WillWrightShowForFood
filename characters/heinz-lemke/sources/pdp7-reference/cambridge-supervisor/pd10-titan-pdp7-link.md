# Cambridge Supervisor — Planning Document 10

**Software for the Titan/PDP-7 link**  
University Mathematical Laboratory, Cambridge · **C.A.L.** · 2 December 1965

> Faithful readable edition of
> <https://cucps.soc.srcf.net/titan/supplan/pd10.htm>
> ([local HTML mirror](pd10-titan-pdp7-link.htm)). Copyright © 1965 University of
> Cambridge Computer Laboratory; distributed by permission (Landy / Needham / Hartley).
> Editorial notes are blockquotes marked ✎.

---

## 1. Introduction

This note makes proposals for software control of the Titan/PDP-7 link. Titan will be
the master machine having control over all data transfers over the link. PDP-7 initiated
transfers may only commence after obtaining permission from Titan.

Desirable facilities for communication between Titan and the PDP-7 are:

1. Direct core to core block transfers in either direction and initiated by either machine.
2. "Attentions" — information concerning time sequenced events occurring in the PDP-7
   which is to be processed in Titan should be queued in the PDP-7 ready to be transmitted
   either on request from Titan, or when the link is free.
3. The PDP-7 should have access to the Titan disk file.
4. All facilities of the time-sharing system available at remote teletypes connected to
   the Multiplexer must also be available on a teletype at the PDP-7.

These four facilities are discussed in Sections 2 through 5 below.

> ✎ Titan-as-master + Attention permission is the 1965 answer to "who owns the wire."
> PIXIE's UI command `TITAN` / `EXECUTE LINK` is the PDP-7 *asking*; Etherton's routine
> is the PDP-7 half of the transfer once permission exists. See
> [TITAN-LINK-PROTOCOL.md](../TITAN-LINK-PROTOCOL.md).

## 2. Core to core transfers

Direct transfer of a block between areas of user program in each machine appears to be
the simplest and most general way of providing data transfers. The contents and length
of the block should be arbitrary (there may be an upper bound on length but see below)
and hence the mechanism may be used to transmit any unit of data such as characters,
lines, etc.

The transfer could be achieved by four extracodes, analogous to those used for magnetic
tape transfers.

1. **Select PDP-7** (c.f. 1260) — this would check that the PDP-7 and link were
   operational and whether it is permitted for that particular Titan program to use the
   link.
2. **Select file (or code) Ba in format n** (c.f. 1264) — this would obtain permission
   from the PDP-7 to read or write a particular area of the PDP-7 core. When reading it
   would give the length of the file. The format would indicate the packing desired of
   **18-bit PDP-7 words into 48-bit Titan words**.
3. **Write Ba words starting at register n** (c.f. 1273).
4. **Read Ba words and store starting at register n** (c.f. 1274).

(iii) and (iv) would use the lockout facility as for tape transfers. If lockout were not
used then:

1. The extracode could use an intermediate buffer, which would have to be written to or
   from, so creating an added task.
2. Extracode control could be maintained until transfer was complete. This is out of the
   question as a long block would take considerable time to transfer (e.g. at least
   150 mS for 512 48-bit words).
3. The user program could be informed when the transfer was complete either through the
   delayed fault mechanism or by setting a flag for the user to test. This method would
   be less convenient to the user than can be provided by the lockout mechanism.

The disadvantage of using lockout is that the section of user core locked out cannot be
dumped to secondary storage. Immovable areas of core could adversely affect
multi-programming strategies, and so it would be desirable to release lockout as quickly
as possible. Hence some upper bound would have to be placed on the length of a block to
be transferred. This limitation does not, however, appear to be severe. The interrupt
processing takes about 20 orders per half word, which at 6 µs/order means approximately
125 mS of interrupt processing time would be required for a 512 word block. Depending
upon other interrupt activity on Titan such a block could probably be transferred in
under a second.

The link would only deal with one transfer request (of whatever kind, see Section 3, 4,
5 below also) at a time and would complete that before starting another. Consequently, a
new halt queue must be introduced — "Halt for PDP-7 link busy". A Titan user program
would be added to the queue if requesting a transfer when the link was busy.

Transfers initiated by the PDP-7 would be handled by the "Attention" mechanism described
below.

> ✎ Performance budget for stubs: ~1 s for a 512×48-bit-word block under Titan interrupt
> load. PIXIE's application blocklets (up to 8K 18-bit words of ring structure) are a
> higher layer riding these core transfers. Packing 18→48 is the TypeScript codec's first
> job on the Titan service side.

## 3. Attentions

Time sequenced events occurring in the PDP-7 may yield information that requires
processing in Titan. This information may well be generated faster than Titan can
process it, especially as the user program in Titan is only running intermittently. Such
information may concern **light pen sees, push buttons, requests for data from Titan**
etc., and it is essential that the PDP-7 should be able to generate the information,
whatever the status of the corresponding Titan user program. It provides the ability for
the PDP-7 user (person or program) to operate continuously even though the Titan user
program operates intermittently. This is particularly important for information produced
by **display interrupts** which is to be processed in Titan. The name coined at
**Project MAC** for such a piece of information is an Attention, and the queue of
Attentions is known as the Attention List. A user controlled executive function could
place an identifying character on the screen each time an Attention is added to the
list, and remove it when the Attention is removed. This serves to leave a history on the
screen of actions performed, but not yet processed.

The information added to the Attention List would be under user control. The PDP-7
executive will contain an option allowing information from selected interrupts to be
automatically added if the user does not wish to process them in the PDP-7. There will
also be a facility allowing the user program to add arbitrary information (up to some
limited length) to the Attention List.

There are two methods of informing the Titan user program of the occurrence of an
Attention. Both require a further queue for halting a Titan user program "Halt awaiting
arrival of an Attention".

1. The Attention could be transmitted to Titan as soon as it occurred (or as soon as the
   link was free) and the Titan user program informed via the delayed fault mechanism.
   The Titan user program could stack it or process it at once. If the program was
   organized such that after processing an Attention it waited for the next one, it must
   be halted until it is available.
2. The Titan user program could request the next Attention (via an extracode) when ready
   to process it. The Attention List would be kept in the PDP-7 with the possible
   exception of the top (i.e. oldest) Attention which could be sent to Titan as soon as
   the channel was free. Keeping the list in the PDP-7 would make it easier to control
   the displayed character associated with each Attention. Again the program would be
   halted if no Attention existed when the next one was requested.

### 3.1 Core to core transfers initiated by the PDP-7

This problem could be handled via the Attention mechanism. Since the PDP-7 user program
may add arbitrary information to the Attention List it may add a message to be decoded
by the Titan user program to be a request for a core-to-core transfer (read or write).
If the Titan user program allowed the request, it could then itself initiate it using
the machinery described in Section 2 above.

> ✎ Attentions = the 1965 name for "events the satellite queues while the mainframe is
> scheduled elsewhere." Light-pen sees and display interrupts are listed explicitly —
> the same interrupt surface PIXIE's `PEN`/`TRACK` and Type 340 stop-code handling live
> on. A Titan service that wants to be historically honest exposes an Attention List API
> even if the first stub only ever carries "please transfer my PIXIE ring file."

## 4. Access to the Titan disk file from the PDP-7

Access to the disk can be achieved in several ways. Three are set out below. I favour
the first for initial implementation. The second could be implemented later if found
necessary.

1. The simplest would be to use the core to core transfer mechanism described above. The
   Titan user program (either on its own initiative, or as a result of an Attention) may
   use the regular file and stream handling extracodes to transfer data between Titan
   core and disk. When writing to the disk, it may have received the data from the PDP-7
   and similarly after reading it into core it could transmit it to the PDP-7. This
   method necessitates the PDP-7 user having a Titan user program. Its disadvantage is
   that if the PDP-7 user program wanted to access the disk at an arbitrary time the
   Titan user program must either be written to cope with this (easy via the Attention
   mechanism) or must be interrupted and a special one run to handle the transfer. Both
   would be laborious for standard PDP-7 software kept on the disk and wanted at any
   time e.g. the assembler, DDT, etc.
2. The second method is similar except that the Titan end of things would be handled not
   by the user's own Titan program but by a special Titan user program. The PDP-7
   executive could be a permanently logged in user which would be desirable for several
   jobs including this one. Requests by the PDP-7 user program to access the disk would
   then be made to the PDP-7 executive which would in turn communicate with this special
   Titan user program. In this case the user need not be logged into Titan. Both methods
   have the disadvantage that access time would be subject to scheduling delay, but
   giving the special user program privileged status would reduce the delay.
3. The third method is to access the disk without the intervention of a Titan user
   program. This could be implemented by making use of the "indirect route" supplied by
   the Multiplexer routines. The idea is to make the PDP-7 look like a teletype (a fast
   one!). The PDP-7 user program would issue a command to the PDP-7 executive. The
   executive would send over the link the appropriate characters that would normally be
   typed on a teletype. Each character would be passed by the PDP-7 interrupt routines
   in Titan to the Multiplexer routines (by jumping in at the appropriate point) which
   would not be aware that it had not come from a teletype except that the PDP-7 would
   have a special line number. Information flow back to the PDP-7 would be in similar
   vein. Since the Multiplexer routines handle only characters, a special command would
   be added "write (or read) binary". This would handle binary characters (say 24 bits)
   and would only make sense when coming from the PDP-7, and not from a teletype.

This method has the two advantages that there would be no scheduling delay and it would
not require a Titan user program. However, it would require additional Titan supervisor
and PDP-7 executive program and provide the PDP-7 user with only very limited disk
access facilities, as designed for a teletype. I feel this method is not nearly so
general or powerful as the above two, and its advantages are not strong enough to
justify its adoption.

> ✎ Method 1 is exactly "PIXIE has a Titan peer program" — CONN, LADAN, filestore, the
> RAINBOW ecology. Method 2 is the permanent daemon our TypeScript Titan service should
> pretend to be. Method 3 (PDP-7 as fake teletype) was rejected in 1965 — do not
> re-invent it. Assembler/DDT-on-disk is named as the motivating case for better disk
> access: Titan as build/file server, foreshadowed here.

## 5. Time-sharing facilities on a teletype at the PDP-7

The existing PDP-7 teletype could be used to act as a normal remote teletype to the
time-sharing system (via the Titan/PDP-7 link) as well as to handle the PDP-7
input/output as at present. This would add further complications to the PDP-7 executive
and Titan supervisor, as well as place a slight restriction on the user who would have
to type some control code and say if following characters were for the PDP-7 or Titan.
Further, printouts could be difficult to follow with output coming from two machines.

A far simpler and more desirable solution would be to install a **second teletype** at
the PDP-7, it being one of those connected to the Multiplexer. The additional cost of
this teletype would be largely offset by the savings in not writing or running the
software required for the single teletype scheme.

C.A.L.  
2 December 1965

> ✎ Section 5 is the architectural blessing for Heinz's two chairs. PD10 preferred two
> TTYs in December 1965; thesis Figs 8.6/8.7 (PDP-7 TTY session ending `TIT`; Titan TTY
> `SET RAINBOW` / `LADAN`) are what that recommendation looked like in nightly practice.
> The [diegetic film-loop TTY](../../2026-07-24-tty-film-loop-titles.md) can wear either
> paper stream — or both, cut between chairs.

---

Copyright © 1965 University of Cambridge Computer Laboratory. Distributed by permission.
Thanks to Barry Landy, Roger Needham and David Hartley for giving permission to
distribute these documents. Thanks to Barry Landy for lending the paper document from
which this was scanned. Any typographical errors probably arose in the course of OCR.

↑ [cambridge-supervisor README](README.md) · [TITAN-LINK-PROTOCOL](../TITAN-LINK-PROTOCOL.md) · [GUIDE](../GUIDE.md)
