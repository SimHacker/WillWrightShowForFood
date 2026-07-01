# MicropolisAngel — Windows dev setup

Target machine: **Lenovo Legion** (or any Windows 11 PC with The Sims Legacy Collection).

MicropolisAngel is a **WinUI 3 + WebView2** shell around Micropolis Home / stream-gateway — not Electron.

Native project: [`native/MicropolisAngel.sln`](native/MicropolisAngel.sln)

---

## Day 0 — clone on the Legion

```powershell
# Pick your fork or the public repo
git clone https://github.com/leela-ai/WillWrightShowForFood.git
cd WillWrightShowForFood

# Cursor: File → Open Folder → this repo root
# Install Cursor Windows build; same workspace as Mac
```

Optional: open repo in **two roots** if you also mount MicropolisCore / SimObliterator locally — Angel specs reference those for TS ports, but **w0 builds from this repo alone**.

---

## Install checklist

### Required

| # | Tool | Notes |
|---|------|--------|
| 1 | **Visual Studio 2022 Community** | Workload: *Desktop development with C++*. Individual components: **Windows 11 SDK** (latest), **MSVC v143**, **Windows App SDK C# templates** |
| 2 | **.NET 8 SDK** | Often bundled with VS; verify with `dotnet --list-sdks` |
| 3 | **WebView2 Runtime** | Preinstalled on Win11; [Evergreen bootstrapper](https://developer.microsoft.com/microsoft-edge/webview2/) on clean VMs |
| 4 | **Git for Windows** | |
| 5 | **Node 22 LTS + pnpm** | For stream-gateway / Micropolis Home when those apps land in-repo |
| 6 | **Cursor (Windows)** | Primary editor for YAML specs + TS; VS for native debug |

Run preflight:

```powershell
cd apps\micropolis-angel\native
.\scripts\check-dev.ps1
```

### Recommended

| Tool | Why |
|------|-----|
| **OBS Studio** + obs-websocket v5 | Stream rig (phase w5) |
| **FFmpeg** on PATH | Fallback transcode / probes |
| **Accessibility Insights for Windows** | UI Automation tree — Sims window, catalog panel |
| **SimPE** | Reference for `.far` / neighborhood formats while TS parsers grow |
| **The Sims Legacy Collection** (Steam) | Real install for UserData paths, ObjectError telemetry |

### Not required for w0

- Code signing certificate
- MSIX packaging (we use **unpackaged** WinUI — `WindowsPackageType=None`)
- Steamworks SDK (Steam listing is a later phase)

---

## Two-IDE workflow

| Layer | Tool | What you edit |
|-------|------|----------------|
| Native shell | **Visual Studio 2022** | `apps/micropolis-angel/native/` — WinUI, WebView2, capture, inject |
| Web + specs | **Cursor / VS Code** | `apps/micropolis-angel/*.yml`, future `apps/stream-gateway` SvelteKit |
| Stream ops | Terminal + OBS | `pnpm dev`, obs-websocket, Twitch EventSub |

Typical session:

1. Terminal A: `pnpm dev` (when stream-gateway exists) on port **5371**
2. Visual Studio: F5 on `MicropolisAngel.sln` → WebView loads localhost
3. Cursor: edit specs, TS packages, commit from Windows

---

## First build (w0 spike)

```powershell
cd apps\micropolis-angel\native
dotnet restore MicropolisAngel.sln
dotnet build MicropolisAngel.sln -c Debug
dotnet run --project src\MicropolisAngel\MicropolisAngel.csproj
```

**Success looks like:** WinUI window titled *MicropolisAngel* with WebView content.

- If `http://127.0.0.1:5371` is down → yellow InfoBar + local `Assets/placeholder.html`
- Edit start URL: `native/src/MicropolisAngel/appsettings.json` → `WebView.StartUrl`

### Visual Studio

1. Open `apps/micropolis-angel/native/MicropolisAngel.sln`
2. Set configuration **Debug | x64**
3. **Project → MicropolisAngel Properties → Debug** — confirm launch profile
4. F5

First WinUI + WebView2 build can take several minutes (NuGet + Windows App SDK).

---

## Configuration

`native/src/MicropolisAngel/appsettings.json`:

```json
{
  "WebView": {
    "StartUrl": "http://127.0.0.1:5371"
  },
  "Sims": {
    "LaunchExecutable": "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Sims Legacy Collection\\...",
    "UserDataPath": "C:\\Users\\YOU\\Documents\\EA Games\\The Sims\\UserData",
    "WorkingDirectory": "C:\\Users\\YOU\\AppData\\Local\\MicropolisHome\\sims-cwd",
    "ExtraArgs": "-debug_objects"
  }
}
```

Leave `Sims` empty for w0. Fill after Legacy Collection install (phase w3b launcher).

**UserData** (typical LC):

- `%USERPROFILE%\Documents\EA Games\The Sims\UserData`
- Downloads: `UserData\Downloads`

**ObjectError logs** (with `-debug_objects`): written to Sims **working directory** — Angel will set `WorkingDirectory` explicitly so FileWatcher knows where to look.

---

## SDKs and APIs (priority order)

| Priority | API | Phase | Use |
|----------|-----|-------|-----|
| 1 | **WebView2** | w0 | Embed Micropolis Home; `AddHostObjectToScript` for FileBridge (w1) |
| 2 | **File system + JSON** | w1 | UserData read, appsettings, catalog.sqlite path |
| 3 | **Windows.Graphics.Capture** | w3 | Catalog panel / preview scrape |
| 4 | **Windows.Media.Ocr** | w3 | Title, price, description — [`CATALOG-SCREEN-MATCH.yml`](CATALOG-SCREEN-MATCH.yml) |
| 5 | **UI Automation** | w3 | Dialog dismiss, Sims window tree |
| 6 | **SendInput** | w4 | Lifecycle inject (save, menu, buy-mode crawl) |
| 7 | **FileSystemWatcher** | w3b | `ObjectError_h*.txt` ingest |
| 8 | **Windows.Media.SpeechSynthesis** | w6 | TTS catalog showcase |
| 9 | **OBS WebSocket** | w5 | Stream panels |

Legacy fallbacks only when WinRT fails: `BitBlt`, `FindWindow`.

---

## Cursor on Windows — suggested layout

```
WillWrightShowForFood/          ← workspace root
  apps/micropolis-angel/        ← specs + native/
  apps/stream-gateway/          ← future SvelteKit
  catalogs/
```

**`.cursor/rules`** (optional later): WinUI build commands, path to `check-dev.ps1`.

Use Cursor for:

- Editing `ARCHITECTURE.yml`, `CATALOG-DB-SCHEMA.yml`, TS packages under future `packages/@micropolis/`
- Running `pnpm` scripts when web tier exists
- Git commit / push to **public repo**

Use Visual Studio for:

- XAML designer peek
- Native breakpoint debug (WebView2 init, future capture services)
- Windows App SDK upgrade diffs

---

## Build phases (your checklist)

| Phase | You ship | Verify |
|-------|----------|--------|
| **w0** | WinUI + WebView2 shell | F5 → window + placeholder or dev URL |
| **w1** | FileBridge host object | JS `chrome.webview.hostObjects.fileBridge.Ping()` |
| **w2** | TS save/iff reader in WebView + scan trigger | Open neighborhood; list lots |
| **w3** | GUID collision UI + catalog OCR fuzzy match | Buy mode → ambiguous candidate list |
| **w3b** | Launcher profiles, `-debug_objects`, ObjectError upload | Error file → GitHub issue hub |
| **w4** | Game lifecycle state machine | Save → main menu → reload |
| **w5** | OBS WebSocket panel | Scene toggle from WebView |
| **w6** | Federation sync + stream bus | |

Full plan: [`ARCHITECTURE.yml`](ARCHITECTURE.yml)

---

## Troubleshooting

### WebView2 blank / init failed

- Install [WebView2 Evergreen](https://developer.microsoft.com/microsoft-edge/webview2/)
- Run VS as normal user (not elevated) — elevated WebView2 can break
- Delete `bin/` and `obj/`, rebuild

### Windows App SDK / WinUI build errors

- VS Installer → modify → ensure **Windows App SDK** + **.NET desktop development**
- `dotnet workload restore` in `native/`
- Match `Microsoft.WindowsAppSDK` version in `.csproj` to VS recommendations

### NuGet restore behind proxy

```powershell
dotnet nuget locals all --clear
dotnet restore --interactive
```

### Sims not found

- LC path varies; use Steam → The Sims Legacy Collection → Browse local files
- Document your path in `appsettings.json` (local only — don't commit personal paths; use `appsettings.local.json` later)

### Mac edited the repo — line endings

```powershell
git config core.autocrlf true
```

---

## Repo hygiene

Build artifacts are gitignored (`bin/`, `obj/`, `.vs/`).

Do **not** commit:

- Personal `appsettings` with home paths (future: `appsettings.Development.json` in `.gitignore`)
- `catalog.sqlite` from dragon hoard scans
- User `.far` / save uploads

---

## Related docs

| Doc | Purpose |
|-----|---------|
| [`native/README.md`](native/README.md) | Solution layout, dotnet CLI |
| [`ARCHITECTURE.yml`](ARCHITECTURE.yml) | Unified product plan |
| [`CATALOG-DB-SCHEMA.yml`](CATALOG-DB-SCHEMA.yml) | SQLite schema |
| [`../stream-gateway/README.md`](../stream-gateway/README.md) | Stream / OBS topology |
| [`../../catalogs/micropolis-home/micropolis-angel.yml`](../../catalogs/micropolis-home/micropolis-angel.yml) | Product / Steam spec |

Parent product: Micropolis Home · Will Wright Show For Food · public repo.
