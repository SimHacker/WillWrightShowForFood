# MicropolisAngel (app)

Windows-native host for the Sims Legacy Collection companion and the unified stream-gateway rig.

**Not Electron.** WinUI 3 shell + WebView2 embeds the same SvelteKit UI as `apps/stream-gateway`.

| Doc | Purpose |
|-----|---------|
| [ARCHITECTURE.yml](ARCHITECTURE.yml) | Unified plan — WebView2 hosts Micropolis Home TS platform, FileBridge, SQLite catalog |
| [CATALOG-DB-SCHEMA.yml](CATALOG-DB-SCHEMA.yml) | SQLite schema — scan, GUID triage, creditcasting, save bundles, Postgres sync |
| [CATALOG-SCREEN-MATCH.yml](CATALOG-SCREEN-MATCH.yml) | Buy/build OCR → fuzzy GUID match; ambiguous candidate sets |
| [GUID-ISSUE-HUB.yml](GUID-ISSUE-HUB.yml) | One GitHub issue per GUID; `issue_n` branch artifact tree |
| [OBJECT-ERROR-TELEMETRY.yml](OBJECT-ERROR-TELEMETRY.yml) | ObjectError parse, consent tiers, creator notify |
| [SIMSKIT-LINEAGE.yml](SIMSKIT-LINEAGE.yml) | Port map from TheSims/SimsKit + Sim Obliterator credit |
| [WINDOWS-DEV-SETUP.md](WINDOWS-DEV-SETUP.md) | **Start here on Legion** — VS, Cursor, first build, phases |
| [native/README.md](native/README.md) | WinUI solution layout, `dotnet` CLI |
| [native/MicropolisAngel.sln](native/MicropolisAngel.sln) | Open in Visual Studio 2022 (Windows only) |
| [../stream-gateway/SPEC.yml](../stream-gateway/SPEC.yml) | Bus, overlay, Twitch/YouTube/OBS |
| [../../catalogs/micropolis-home/micropolis-angel.yml](../../catalogs/micropolis-home/micropolis-angel.yml) | Product spec (Steam, rollout, ethics) |

Native project scaffold (`native/MicropolisAngel.sln`) — **w0 WinUI 3 + WebView2 placeholder**. Build on Windows; edit specs on Mac or Windows.
