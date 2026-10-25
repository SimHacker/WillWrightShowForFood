# The Disk II's sound

> The disk drives in those days, when they went from track one to track twenty, you'd hear
> "ennnnnnnnnnnh" – this horrible sound like a buzz-saw. Mine went "shew, shew, shew." Beautiful
> sounding, and it did it twice as fast.
>
> — Steve Wozniak, [interviewed by Paleotronic](https://paleotronic.com/2018/05/19/steve-wozniak-talks-disk/), 2018

The emulator has to make that sound, and make it for the right reason: not a recording played on
every seek, but the sound of the head moving the way the software moved it. Then Woz's seek sounds
like "shew" because of Woz's code, and anything that steps the head another way sounds different.

## Why it sounds that way

Woz took the Shugart drive's own stepping electronics out. On the Shugart, a seek stepped the head
one track at a time and waited a fixed fifteen milliseconds after each step, so a long seek was a
steady buzz. On the Disk II the Apple's software drives the four stepper-motor phases directly,
through soft switches in the controller's slot (`$C0E0`–`$C0E7` for slot 6, each phase on and off),
and Woz timed them like pushing a heavy wagon:

> why don't I speed up the head that's moving from track one to track two to track three… speed it
> up until it's half-way to the destination – which I know – and then start slowing it down so that
> it doesn't overshoot at the end. I made a little table (to calculate the distances) and I love
> the sound that my disk drive makes!

DOS 3.3's disk routines keep that acceleration as a pair of timing tables, one for how long each
phase stays on and one for the gap after it, indexed by how far the seek has gone and has left to
go. The sound is that schedule, heard.

## Making it from the events

The emulator already sees every phase change, because each is a read or write of a soft switch at
a known cycle. That is enough to make the sound:

1. **Record phase events** with their CPU cycle: which phase, on or off.
2. **Move a model head**: the four phases pull a rotor; two adjacent phases on hold it on a half
   track. The head position follows the phase pattern with a little mass and damping, so a phase
   switched too fast lags, and a phase switched in the wrong order shudders.
3. **Make sound from the head's motion**: each step is a short mechanical click whose loudness
   follows how hard the step was; steps close together blur into a whoosh whose pitch follows the
   step rate. Accelerating and decelerating steps make the rising and falling "shew"; constant
   fifteen-millisecond steps make the buzz-saw.
4. **Add the rest of the drive**: the spindle motor's hum while the motor soft switch is on, the
   head load, the disk turning, and the famous clatter at boot, when DOS steps the head outward far
   more times than there are tracks to be sure it's at track zero, and it bangs against the stop.

The sound comes out of the same backplane clock as everything else, so in slow motion it slows down
with the machine, and the [cause-and-effect](CAUSE-AND-EFFECT.md) view can show which instruction
moved the head for each click.

## What it makes possible

- **Hear the difference.** A button plays the same seek with Woz's tables and with Shugart's fixed
  fifteen-millisecond steps, side by side.
- **Hear copy protection.** Protected disks seek to half tracks and quarter tracks and step in odd
  patterns; they sound different, and the sound tells you something is going on.
- **Teach the drive.** A view of the four phases, the rotor and the head, driven by the same events,
  beside the code that switched them.
- **Fidelity where it's cheap.** microM8 and other Apple emulators play drive sounds; this one
  derives them, which is the point of an emulator that sees every cycle.

The same approach fits every mechanical device the cabinet emulates: the Teletype's print head and
carriage return, the paper tape reader, the DECtape's reels, all sounded from the events that move
them, as the PDP-7's [AM radio](AM-RADIO.md) is heard from its memory cycles.

## Order of work

1. Phase events from the Disk II soft switches, with cycles.
2. The head model, and a click per step.
3. The step-rate whoosh, the motor hum, and the recalibration clatter.
4. The Woz-versus-Shugart comparison, and the phase and rotor view.

↑ [README](README.md) · [DISPLAY-DEVICES](DISPLAY-DEVICES.md) · [CAUSE-AND-EFFECT](CAUSE-AND-EFFECT.md)
