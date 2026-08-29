# The browser ecosystem — replacing the Exchange without asking permission

*Soul City's browser-native Sims 1 spec: save read/write with consent,
no zip, no Explorer, no dead Share button. Machine-readable spec:
[browser-ecosystem.yml](browser-ecosystem.yml).*

**In one line:** a fully browser-based local UI plus optional catalog
server — reads and writes UserData saves with consent, and replaces the
UCP Internet button with something at least as convenient and far more
capable.

## The problem

The Steam Legacy Collection (January 31, 2025) shipped the game without
the **medium**: no Exchange server or upload pipeline, no UCP
Internet/Share button, no Auto Generate Web Pages cloud sync, no Sims
Creator in the bundle
([the research](../../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/README.md)).
The community's workaround is manual zips, SimFileShare, Tumblr, and
Discord — leave the game, open a file manager, re-learn 2005 workflows
with worse discovery and no official hook.

## The vision

- **No zip, no Explorer.** The user never hunts UserData paths. The
  browser app (PWA, or embedded WebView2 in the Angel) mounts the save
  tree via the File System Access API or a native FileBridge.
- **Replaces the Internet button.** One click: "Share this lot" parses
  the IFF/FAM, validates, shows a consent dialog, then publishes to the
  catalog, copies a federated SimFileShare link, or opens a PR to the
  GitHub catalog branch.
- **Offline first.** Service worker plus local cache: browse catalogs,
  install objects, edit Family Album YAML, run compatibility checks
  without network; sync when online.
- **Consent everywhere.** No upload without explicit per-item consent —
  public, unlisted link, federate-only metadata, or local-only draft.

## What it can do

Save-file intelligence: on folder grant, index Neighborhoods, Houses,
Characters, Web Pages, Downloads, and Objects; parse IFF headers, GUID
tables, family trees, and lot metadata into a searchable local
catalog. A "file cop" copies lots, families, and objects between
neighborhoods with GUID-remap preview and a shopping list for missing
dependencies; a GUID collision manager detects duplicates on install; a
compatibility engine checks expansion flags and engine versions; and
the graveyard manager enumerates urns and tombstones from save parse
for resurrection, kill, and clone flows with operator consent.

Sharing runs a real pipeline — parse, validate, virus scan,
compatibility report, consent, upload, catalog entry — and federates
rather than replaces: SimFileShare links indexed in CARD metadata,
ModTheSims and TSR deep-linked with their VIP lanes left alone, free
objects living in git with PRs as the modern Exchange upload
([the distribution model](github-distribution-model.md)). Safety is
server-side scanning, an extension allowlist (no executables), a
quarantine queue, and attribution chains — the April 2025 SimFileShare
compromise taught the lesson: never trust an account alone.

## The gap-fill matrix

Every missing Legacy Collection feature has a named fill: the dead
Internet button becomes the browser hub and tray hotkey; Generate Web
Pages becomes the local album generator with one-click publish; manual
zips become FileBridge auto-locating the Steam UserData; SimFileShare's
missing search becomes the federated CARD index; missing custom objects
on shared lots become a shopping list with one-click fetch; GUID
collisions get the remap manager; the missing Sims Creator is out of
scope for v1 (federate Transmogrifier docs instead); and the
4K-microscopic UI gets documented workarounds plus the Angel's
TTS/Simplifier accessibility lane.

## Rollout

1. **Web:** browse git-backed CARD catalogs; Steam Community Guide
   pointing at repo roots; read-only save parse demo in the browser.
2. **Local write:** FileBridge / directory picker — install objects,
   file cop, Family Album YAML editor.
3. **Publish:** consent upload to the catalog server with virus scan
   and compatibility gates.
4. **Angel:** WebView2 shell, tray watcher, stream integration,
   graveyard manager
   ([the sims1 Soul Bridge](sims1-soul-bridge.md)).

## Related

- [SoulAngel](soul-angel.md) · [sims1 Soul Bridge](sims1-soul-bridge.md)
- [GitHub distribution model](github-distribution-model.md) · [Steam guide strategy](steam-community-guide.md)
- [The Exchange gap research](../../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/README.md)
