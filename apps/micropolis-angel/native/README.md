# MicropolisAngel — native (WinUI 3)

Windows shell for MicropolisAngel: **WinUI 3 + WebView2**, not Electron.

| Path | Purpose |
|------|---------|
| `MicropolisAngel.sln` | Open this in Visual Studio 2022 on Windows |
| `src/MicropolisAngel/` | C# WinUI 3 app — WebView host, future FileBridge |
| `scripts/check-dev.ps1` | Preflight: SDK, WebView2, optional tools |

**Mac:** edit specs in `apps/micropolis-angel/*.yml` and this README; build on the Legion.

**Windows first run:** [`../WINDOWS-DEV-SETUP.md`](../WINDOWS-DEV-SETUP.md)

## Quick start (Legion)

```powershell
cd apps\micropolis-angel\native
.\scripts\check-dev.ps1
dotnet restore MicropolisAngel.sln
dotnet build MicropolisAngel.sln -c Debug
dotnet run --project src\MicropolisAngel\MicropolisAngel.csproj
```

Or open `MicropolisAngel.sln` in Visual Studio → **Debug → Start Debugging** (F5).

Default WebView URL: `http://127.0.0.1:5371` (edit `src/MicropolisAngel/appsettings.json`).

If nothing is listening, the app shows `Assets/placeholder.html`.

## Regenerate from template (optional)

If the placeholder drifts from current WinUI templates:

```powershell
dotnet new uninstall Microsoft.WindowsAppSDK.ProjectTemplates 2>$null
dotnet new install Microsoft.WindowsAppSDK.ProjectTemplates
dotnet new winui -n MicropolisAngelFresh -o .\tmp-winui
# Diff and merge — keep WebView2 + appsettings patterns from this repo.
```

## Build phases (see ARCHITECTURE.yml)

| Phase | Native deliverable |
|-------|-------------------|
| **w0** | This shell — WebView2 + appsettings + placeholder fallback |
| **w1** | FileBridge host object; read UserData |
| **w2** | Install scan trigger from native; SQLite path bridge |
| **w3** | Catalog OCR capture service (Graphics.Capture) |
| **w3b** | Sims launcher profiles, `-debug_objects`, ObjectError watcher |
