# PIXIE and FORTH on PDP-7 Cabinet Emulator with Type 340 Vector Graphics Display

Don Hopkins, 9 October 2026, 23 minutes. A walk through the cabinet: PIXIE drawing a circuit,
the two-level source map down to Heinz's scanned listing, editing 340 display instructions in
core, DEC's 1964 light pen test, DUEL, HILO, LANDER, UNIX v0, Mitch Bradley's Forth and its
turtle, and PIXIE rings in 3D from both PIXIE and Forth.

https://www.youtube.com/watch?v=lo8kdY-5i6c

| File | What |
|---|---|
| [transcript.md](transcript.md) | Read this: the corrected transcript, one caption a line, timestamped |
| [transcript.vtt](transcript.vtt) | The same, with YouTube's timestamps: upload this to YouTube |
| [corrections.tsv](corrections.tsv) | What YouTube heard, and what was said; edit this |
| [build.py](build.py) | Applies the corrections to the raw captions and writes both of the above |
| [transcript-cache/](transcript-cache/) | YouTube's captions as downloaded, never edited ([PROVENANCE.yml](transcript-cache/PROVENANCE.yml)) |

## Fixing a mistake

Add a line to `corrections.tsv`, what YouTube heard, a tab, then what was said. Run
`python3 build.py`. A correction can't span two captions, so split it at the caption break, one
line each. Then upload `transcript.vtt`: YouTube Studio, the video, Subtitles, English, the
three dots, Upload file, With timing.

## To do: who is saying what

The captions don't say who's talking, and there are two speakers. The cabinet's teletype has
text to speech, and it reads aloud whatever the machine prints, right over Don's narration. He
tries to get a word in and it interrupts; he waits for it to finish and it interrupts again. The
Forth turtle demo had pauses that teased him into starting a sentence. It was pretty funny that
the machine kept interrupting, and the captions should show it. That takes a careful proofreading
pass against the audio, marking each caption DON or TTY, and splitting captions where one cuts
in on the other. The high comedy to get right:

- **UNIX, about 16:00 to 17:00.** It read the `ls system` listing aloud, trying to pronounce
  UNIX's short file names, then went on to read PDP-7 assembly source as if it were prose.
- **LANDER, about 13:48 to 14:30.** So much text backed up in the speech queue that Don had to
  shut it up.
- **Forth turtle demo, about 15:08 to 15:38.** The pauses between lines, and who started talking
  in them.
- **HILO and the TTY hello, about 5:40 and 13:01.** Where the teletype first starts talking.

## Not fixed yet: check against the video

- **14:03 to 14:25, LANDER.** The numbers run together ("altitude is 34, 7.5"). The real values
  are on the teletype on screen.
- **16:47 to 16:54, UNIX.** "lac in one in get a number of interrupt one source nar zero jmp
  one off" is the teletype's speech reading PDP-7 assembly source as prose, until Don turns it
  off in CONFIG ("for your sanity"). The exact source is on screen.
- **22:16, Forth.** "So, so he said oops okay is not a thing here." Copying lines from the Forth
  teletype also copied Forth's own " ok" at the end of each line, so pasting them back typed
  OK, which Forth doesn't know, and it answered with a question mark. What was said can be
  checked against the video.
