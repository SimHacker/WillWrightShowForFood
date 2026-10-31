# @wwsff/bridge

The base layer under the cabinet's game bridges: a saved world on an old disk becomes a
directory of YAML Jazz a person, an LLM or a script can edit, and goes back onto the disk
byte for byte. Runs in the browser and under Node; the CLIs that read real disks and
directories are thin wrappers in the packages that use it.

| File | What |
|---|---|
| [src/records.ts](src/records.ts) | Binary records declared as data (`record`, `f`, `int`, `str`, `packed`, `keyed`, `long`...), decoded to plain values and encoded back over the original bytes. UCSD Pascal's layout rules. |
| [src/yaml-jazz.ts](src/yaml-jazz.ts) | `makeYaml` writes a file with notes as comments; `mergeYaml` puts new values into an existing file and keeps its comments, key order, and keys the program doesn't own. |
| [src/world.ts](src/world.ts) | A world as path → text; locations as `FILE#key/sub` like the moollm wumpus topologies; slugs; hex rows for bytes with no structure yet. |

Three rules make a round trip exact:

- **Encode over the base.** A field the YAML leaves out keeps the base's bytes, and so do
  string tails, padding, and a value that reads the same as the base (a TRUE stored as -1, a
  length byte past the string's room).
- **Show the meaning, keep an escape.** A view that can't say every byte pattern (a location
  that shares a word with poison) gets a raw override, written only when it's needed.
- **Merge, don't rewrite.** Re-exporting into a world someone has annotated changes values
  and leaves their comments where they wrote them.

Used by the cabinet's [Wizardry](../cabinet/worlds/wizardry/README.md),
[Mind Mirror](../cabinet/worlds/mind-mirror/README.md) and
[Little Computer People](../cabinet/worlds/little-computer-people/README.md) worlds.
