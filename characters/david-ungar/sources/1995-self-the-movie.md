# Self: The Movie (1995)

https://www.youtube.com/watch?v=Ox5P7QyL774

Don supplied the video link and pasted YouTube transcript on 16 October
2026. The upload is by Jecel Assumpção Jr, dated 11 September 2013;
the film is dated 1995, not 2013.

The supplied description credits copyright to Sun Microsystems and states
that Sun permitted redistribution with its copyright ownership made clear.
No video or audio has been downloaded here.

[Supplied transcript and page text](1995-self-the-movie-supplied-transcript.txt).
This is an unchanged pasted capture, including navigation and recommendation
text. Its transcript contains recognition errors; check the recording before
quoting it. Timestamps below are approximate.

## Demonstrations

- **0:14–1:50:** Randy Smith introduces directness, uniformity, and a
  continuously running environment using physical objects as the comparison.
  He describes changing a system while people are using it, without a
  separate run/edit mode.
- **1:57–3:20:** objects contain named slots referring to other objects.
  Message sends access slots or activate methods. A point's length method
  uses its x and y values.
- **3:21–4:25:** lookup follows parent slots when a name is not found
  locally. Moving a shared method to a parent and copying a point
  demonstrates sharing behavior while retaining separate coordinate slots.
- **4:33–5:45:** replacing a constant x slot with a method that returns y
  changes the point's behavior without changing the messages clients send.
  A further example combines the computed coordinate with an inherited one.

The existing [Self source guide](self-entry-points.md) identifies later
sections with Dave Ungar discussing implementation and Mario demonstrating
Smalltalk in Self. The supplied transcript extends to approximately 20:39;
the notes above cover its opening examples, not a complete chapter index.

## Relevance to live data-structure tools

This is a useful reference for presenting objects as things a person can
inspect and change while the program runs. A browser showing an emulated
object graph should distinguish stored slot values, computed results,
inherited behavior, and object identity. Merely exporting a static graph
would not reproduce the running environment demonstrated here.

Use the film as teaching material alongside runnable examples: inspect
slots, follow parents, send messages, change a method, and observe the
effect. Any new implementation should document which of these operations
it actually supports rather than treating a visual resemblance as equivalent
behavior.

Related people: [David Ungar](../README.md) and
[Randall B. Smith](../../randall-smith/README.md).
