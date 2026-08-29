# Steam app strategy -- Soul City, SoulAngel, and the TMog Bridge

*Researched 2026-08-29. Answers: is a Steam app worth it, or is the web
site enough? Can a Steam app meaningfully integrate with other Steam
apps (the Sims 1 Legacy Collection, Tiny Life, other bridge
destinations)? Is the migration-and-petition campaign OK by Steam
rules? Sibling specs: [soul-angel.md](soul-angel.md),
[steam-community-guide.md](steam-community-guide.md),
[browser-ecosystem.md](browser-ecosystem.md).*

Naming in this page follows the family rules: **TMog** is our brand for
the sims1-facing toolchain and facet (the Transmogrifier lineage,
reclaimed); `sims1` is the internal token for The Sims 1 (anticipating
`sims2`, `sims3`, `sims4`); publisher brands ("The Sims", "Tiny Life",
"Proxi", "Steam") are always used nominatively, naming their products,
never as our brands. Tiny Life and Proxi are friends and collaborators;
EA gets respectful nominative distance.

## Verdict

Ship the web site first, the Steam app second, and never put the
protest on the store page. The app is worth building for **reach and
revenue**, not for platform integration: Steam grants no special powers
over other publishers' apps, but it puts SoulAngel on a store page next
to the game itself, with payments, reviews, and discovery attached. The
campaign infrastructure stays sovereign on web + git, where no platform
can foreclose it. This confirms and extends the "web first, Angel
second" rollout rule already in [soul-angel.md](soul-angel.md).

## What Steam actually gives a companion app

**No privileged cross-app APIs.** The Steamworks SDK scopes Workshop,
achievements, overlay, and inventory to your own appID. A companion app
cannot add a Workshop to The Sims or hook Tiny Life's Steam features.

**What works anyway, on the same machine (no Steam required):**

- Detect installed games by reading `steamapps` appmanifest files
- Launch games via `steam://` protocol URIs
- Watch the sims1 `UserData` tray, saves, and Web Pages exports
  (the TMog Bridge feature set)
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

## Precedents

| App | Lesson |
|-----|--------|
| **Lossless Scaling** | Paid Steam utility that injects frame generation and scaling into any running game; a platform best-seller. The strongest proof that utilities reaching into other games ship and thrive on Steam |
| **Wallpaper Engine** | A Software listing can carry a huge UGC economy |
| **OBS Studio** | Capture and broadcast software distributed free on Steam; SoulAngel's DVR/broadcast comparable |
| **Special K** | The injection framework distributes via GitHub, not Steam -- the line exists, but a save/album/capture tool sits on the shipping side of it |
| **CurseForge (Overwolf)** | The companion-app model EA actually blessed for Sims 4 mods, off Steam. The incumbent to study and differentiate against |

Nothing does soul migration or petitions. That lane is open.

## Steam rules and the real risk

[Steamworks onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding)
accepts "Player Tools" as a software category; the prohibited list
(porn, hate, malware, crypto/NFT apps) has nothing against save tools,
albums, or petitions. Submission is $100 per app through Steam Direct
plus build review; digital sales run through Steam's 70/30 split.

The real constraint is unwritten: Valve ships "everything except
what's illegal or straight-up trolling," decided at their discretion,
and **EA is one of Valve's largest partners** -- the Legacy Collection
is a Steam product. A store page that markets "organize protests
against EA" invites a partner complaint Valve has every incentive to
honor. Note the useful irony: the migration funnel *sells* Legacy
Collection copies on Steam, since players need the game to rescue
their families from it.

Historic ground: reading and writing the player's own save files is
what the Transmogrifier did from 2000 with Maxis's written blessing
(see [the naming saga](../../characters/will-wright/sources/2000-05-17-transmogrifier-naming-saga/article.md)
and [the license notes](../../characters/don-hopkins/career/contracts/transmogrifier-distribution-license-notes.md)).
The TMog brand carries that lineage and keeps EA's marks out of ours.
Not legal advice; EA's temperament in 2026 is not EA's temperament in
2000.

## The protest architecture (three layers, three venues)

1. **The Steam app is a utility.** SoulAngel: DVR, Soul Album,
   machinima, broadcast, with the TMog Bridge (sims1) as launch
   showcase. The store page describes creation, preservation, and
   storytelling. The word "protest" never appears on it.
2. **The movement lives on the web.** Petition, turnstile, tote board,
   migration counts, and comments run on Soul City -- git-backed,
   consent-first, platform-independent. Steam sign-in provides
   voluntary ownership verification. Do not build the underground
   railroad's headquarters inside the landlord's mall.
3. **The ceremony lives in the game.** Petition table, turnstile, tote
   board, and the pool with no ladder ship as sims1 custom objects
   through the same custom-content channel every other object uses --
   procedural rhetoric, performed diegetically (see
   [the Soul City README](README.md), "The turnstile" and "The pool").

Compliance note: signatures and comments are personal data. The web
side needs a real privacy policy (GDPR); consent-first design already
matches, and Steam's own Privacy Policy applies to anything the app
collects.

## Stop Killing Games -- the adjacent movement

The closest precedent for organized player protest over game
mortality: **Stop Killing Games** gathered **1,294,188 verified
signatures**, and the European Commission
[formally replied on 16 June 2026](https://citizens-initiative.europa.eu/stop-destroying-videogames-commissions-reply-european-citizens-initiative_en):
no playability law (intellectual property and proportionality cited),
a voluntary industry code of conduct to be explored by end of 2026,
and a consumer-awareness effort
([PC Gamer's coverage](https://www.pcgamer.com/games/stop-killing-games-says-the-fight-goes-on-after-european-commission-rejects-proposed-rule-changes-were-much-more-than-just-this-single-petition/);
the campaign has pivoted to the Digital Fairness Act with about 45
MEPs supporting).

Two lessons. First: more than a million people will sign for game
preservation -- the audience exists. Second: asking institutions for
permission just hit its ceiling. Soul Saver's mechanism is different
in kind -- **exit as voice**, actual migration rather than
petition-and-wait. The tote board counts what the Commission declined
to legislate, which makes Soul City the working demonstration the SKG
argument lacked, and a story its community will carry.

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
- **What NOT to put there:** the petition and migration campaign. This
  is the most EA-visible property in the family; museum and funnel
  only. New brands (TMog, Soul City) never live under EA's game name
  -- nominative rule holds.

## Rollout (extends soul-angel.md)

1. **Soul City web hub live**, with Sign in through Steam ownership
   verification wired to the turnstile and tote board.
2. **Steam Community Guides** on the Legacy Collection hub funnel
   players to the web site (already specced:
   [steam-community-guide.md](steam-community-guide.md)).
3. **SoulAngel ships on Steam** as a Player Tools listing: universal
   tier plus the TMog Bridge as launch showcase. Utility on the store,
   movement on the web, ceremony in the game.
4. **Friend bridges deepen by cooperation, not injection**: Tiny Life
   with Ell, Proxi with Galium -- shared formats and export paths,
   credited and paid where possible.
