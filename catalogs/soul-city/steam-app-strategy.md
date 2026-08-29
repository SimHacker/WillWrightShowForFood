# Steam app strategy -- Soul City, SoulAngel, and TMog

*Researched 2026-08-29. Answers: is a Steam app worth it, or is the web
site enough? Can a Steam app meaningfully integrate with other Steam
apps (the Sims 1 Legacy Collection, Tiny Life, other bridge
destinations)? Where do the site, the guides, and the app each live?
Sibling specs: [soul-angel.md](soul-angel.md),
[steam-community-guide.md](steam-community-guide.md),
[browser-ecosystem.md](browser-ecosystem.md).*

Naming in this page follows the family rules: **TMog** is the umbrella
brand for our sims1 content tools (the Transmogrifier lineage,
reclaimed); the **sims1 Soul Bridge** and the sims1 portal *use* TMog
modules (see [portals-and-modules.md](portals-and-modules.md));
`sims1` is the internal token for The Sims 1 (anticipating `sims2`,
`sims3`, `sims4`); publisher brands ("The Sims", "Tiny Life", "Proxi",
"Steam") are always used nominatively, naming their products, never as
our brands. Tiny Life and Proxi are friends and collaborators; EA gets
respectful nominative distance.

## Verdict

Ship the web site first, the Steam app second. The app is worth
building for **reach and revenue**, not for platform integration:
Steam grants no special powers over other publishers' apps, but it
puts SoulAngel on a store page next to the game itself, with payments,
reviews, and discovery attached. The community layer stays on web +
git, open and platform-independent by construction. This confirms and
extends the "web first, Angel second" rollout rule already in
[soul-angel.md](soul-angel.md).

## What Steam actually gives a companion app

**No privileged cross-app APIs.** The Steamworks SDK scopes Workshop,
achievements, overlay, and inventory to your own appID. A companion app
cannot add a Workshop to The Sims or hook Tiny Life's Steam features.

**What works anyway, on the same machine (no Steam required):**

- Detect installed games by reading `steamapps` appmanifest files
- Launch games via `steam://` protocol URIs
- Watch the sims1 `UserData` tray, saves, and Web Pages exports
  (the sims1 Soul Bridge feature set, built from TMog modules)
- Watch Tiny Life's export folder (cooperative, with Ell)
- Screen capture, DVR, TTS -- the SoulAngel universal tier

**The one genuinely Steam-native integration that matters:** "Sign in
through Steam" (OpenID) plus the Steam Web API lets the **Soul City web
site** verify -- with the player's consent -- that a petition signer
owns the sims1 Legacy Collection or Tiny Life on Steam. That upgrades
the turnstile tote board from honor-system counting to verified,
consent-first data ("the opt-in is the data"). This works without
shipping any Steam app at all.

**What the Steam listing buys:** placement next to the Legacy
Collection in search and more-like-this, Steam payments for the paid
tier, reviews, community hub, and the legitimacy of a real store page.
That reach is the case for the app.

**What the app IS (ruling, Don 2026-08-29):** the main focus of the
Steam app, besides being a portal and hub wrapper for the web site,
is **the SoulAngel app itself** -- shipping on **Windows and Mac**,
and Linux if that makes sense and is possible. Implementation note:
the current prototype shell (WinUI 3 + WebView2) is Windows-only, so
Mac support forces the cross-platform shell decision (per-OS native
shells vs a Tauri/wry-class wrapper around the same web modules) --
flagged for the SoulAngel architecture doc. The modules themselves
are web and portable by construction.

## Precedents

| App | Lesson |
|-----|--------|
| **Lossless Scaling** | Paid Steam utility that injects frame generation and scaling into any running game; a platform best-seller. The strongest proof that utilities reaching into other games ship and thrive on Steam |
| **Wallpaper Engine** | A Software listing can carry a huge UGC economy |
| **OBS Studio** | Capture and broadcast software distributed free on Steam; SoulAngel's DVR/broadcast comparable |
| **Special K** | The injection framework distributes via GitHub, not Steam -- the line exists, but a save/album/capture tool sits on the shipping side of it |
| **CurseForge (Overwolf)** | The companion-app model EA actually blessed for Sims 4 mods, off Steam. The incumbent to study and differentiate against |

Nothing does soul migration or petitions. That lane is open.

## Steam rules and historic ground

[Steamworks onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding)
accepts "Player Tools" as a software category; the prohibited list
(porn, hate, malware, crypto/NFT apps) has nothing against save
tools, albums, or capture suites. Submission is $100 per app through
Steam Direct plus build review; digital sales run through Steam's
70/30 split.

A pleasing economic alignment: the rescue funnel *sells* Legacy
Collection copies on Steam, since players need the game to bring
their families out of it.

Historic ground: reading and writing the player's own save files is
what the Transmogrifier did from 2000 with Maxis's written blessing
(see [the naming saga](../../characters/will-wright/sources/2000-05-17-transmogrifier-naming-saga/article.md)
and [the license notes](../../characters/don-hopkins/career/contracts/transmogrifier-distribution-license-notes.md)).
The TMog brand carries that lineage and keeps everyone's marks where
they belong. Not legal advice.

## Three venues

1. **The store carries the utility.** SoulAngel: DVR, Soul Album,
   machinima, broadcast, with the sims1 Soul Bridge and its TMog
   modules as launch showcase. The store page describes what the app
   does: creation, preservation, and storytelling.
2. **The community lives on the web.** Turnstile, tote board,
   migration counts, and comments run on Soul City -- git-backed,
   consent-first, platform-independent. Steam sign-in provides
   voluntary ownership verification.
3. **The ceremony lives in the game.** Petition table, turnstile,
   tote board, and the pool with no ladder ship as sims1 custom
   objects through the same custom-content channel every other object
   uses -- procedural rhetoric, performed diegetically (see
   [the Soul City README](README.md), "The turnstile" and "The pool").

### Two petitions (ruling, Don 2026-08-29)

**The human petition is delegated.** Host it on an established
petition platform and point at it from Soul City. Their signature
handling, verification, and privacy policy cover the personal data;
Soul City stays nearly free of it. What Soul City keeps is the
turnstile and tote board -- voluntary, Steam-verified ownership counts
("the opt-in is the data"), not names.

**The character petition is ours, and it is the point.** Rescued
characters sign it themselves -- and giving characters themselves
voices is the whole THING. The soul IS the signature: a soul-file in
git, speaking through soul voice (the soul-chat skill: give anything
a voice), testifying in character on the record. No platform hosts
it because no platform could: it is diegetic, git-backed, and
composed of fictional representations, not personal data (BYOB --
whether the character "is" its player stays permanently on the
player's side of the line). If somebody signs a petition with their
sims characters, well, nobody controls that. Wink.

Compliance note: delegating the human petition shrinks the GDPR
surface to the tote board's consent-first counts and whatever the app
collects (Steam's own Privacy Policy applies there). Character
signatures are authored fiction; the player's authorship consent is
the standard publish step every shared object already takes.

## Stop Killing Games -- the adjacent movement

Nothing like the soul-migration hub exists -- that lane is open. The
closest cultural precedent for organized player advocacy over game
mortality: **Stop Killing Games** gathered **1,294,188 verified
signatures**, submitted as the "Stop Destroying Videogames" European
Citizens' Initiative on 26 January 2026. The European Commission
[formally replied on 16 June 2026](https://citizens-initiative.europa.eu/news/european-commission-replies-stop-destroying-videogames-initiative-2026-06-16_en)
(communication C(2026) 4110): it "cannot propose a legal obligation"
to keep games playable (proportionality, intellectual property,
publisher costs, and security cited), offering instead stakeholder
exchanges toward a **voluntary industry code of conduct** by end of
2026, a report on the Digital Content Directive (EU) 2019/770, and
consumer-awareness work. The campaign has pivoted to the Digital
Fairness Act, with roughly 45 MEPs supportive per press coverage.

Two lessons, one framing. First: a proven audience of over a million
people cares enough about game preservation to sign for it. Second:
asking institutions for permission just hit its ceiling. The Soul
City mechanism is different in kind -- **exit as voice**, actual
migration rather than petition-and-wait: souls don't need anyone's
permission to move house, and the tote board counts what the
Commission declined to legislate. Preservation you can do is worth
more than preservation you can ask for. **"We built what the EU said
it couldn't require."**

## The dormant domain: thesimstransmogrifier.com

Don still owns **thesimstransmogrifier.com** (registered since 2000,
currently empty). It is safe and singularly useful:

- **Why the "thesims" prefix is OK here:** the domain names the tool's
  official, EA-reviewed name. It was the *authorized distribution
  channel* under the distributor agreement (distribution permitted
  "only from Don's web site: donhopkins.com / thesimstransmogrifier.com"
  -- see [the license notes](../../characters/don-hopkins/career/contracts/transmogrifier-distribution-license-notes.md)).
  EA Legal reviewed the name in May 2000 and Will Wright approved it in
  writing. 26 years of registration for an authorized purpose makes a
  bad-faith domain claim near impossible. Precedent: thesimsresource.com
  has operated commercially since 1999. Belt and suspenders: the EULA's
  own required disclaimer ("This site is not endorsed by or affiliated
  with Electronic Arts...") goes in the footer.
- **The link equity:** a quarter century of tutorials, forum posts, and
  wikis still point at the domain and currently hit nothing. A revived
  site converts all of it into a funnel -- SEO that cannot be bought,
  plus community muscle memory.
- **What to put there:** a period-faithful museum restoration (the
  Wayback capture index and gap checklist already exist in the
  DonHopkins strategy repo: `research/sources/transmogrifier-wayback-INDEX.yml`
  and `strategy/acquisition/GAPS.md` -- home page, downloads
  (Transmogrifier 2.0.5 BETA, RugOMatic 1.6), tutorials, glossary,
  Magic Cookie registry, the click-through EULA flow), the restored
  authorized download, and a visible on-ramp to TMog and Soul City.
  Host it as GitHub Pages from a public repo: the museum is itself a
  Repo Show artifact.
- **What NOT to put there:** anything but the museum and the funnel.
  New brands (TMog, Soul City) never live under another company's
  game name -- the nominative rule holds; the domain names one
  historical tool, and that is all it should ever do.

## Rollout (extends soul-angel.md)

1. **Soul City web hub live**, with Sign in through Steam ownership
   verification wired to the turnstile and tote board.
2. **Steam Community Guides** on the Legacy Collection hub funnel
   players to the web site (already specced:
   [steam-community-guide.md](steam-community-guide.md)).
3. **SoulAngel ships on Steam** as a Player Tools listing (Windows
   and Mac; Linux if feasible): universal tier plus the sims1 Soul
   Bridge and TMog modules as launch showcase. Utility on the store,
   community on the web, ceremony in the game.
4. **Friend bridges deepen by cooperation, not injection**: Tiny Life
   with Ell, Proxi with Galium -- shared formats and export paths,
   credited and paid where possible.
