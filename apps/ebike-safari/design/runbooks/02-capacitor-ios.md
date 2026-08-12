# Runbook 02 — Capacitor iOS shell

**Goal:** Wrap the static SvelteKit build in a native iOS WebView. Develop on laptop; deploy same bundle to phone.

**Prerequisite:** [01-viewer-sveltekit.md](01-viewer-sveltekit.md) builds cleanly.

## Prerequisites

- Node **22+** for Capacitor CLI (`nvm use` — see `.nvmrc` in viewer/)
- Node 20 works for `pnpm run dev` / build (MapLibre uses `.npmrc` engine-strict=false)
- Xcode + CocoaPods for device/simulator builds

## One-time (Mac + Xcode)

```bash
cd apps/ebike-safari/viewer
nvm use                  # Node 22 for Capacitor
pnpm run build
npx cap add ios          # first time only — creates ios/ project
```

`capacitor.config.ts` already sets `webDir: 'build'`, `appId: com.donhopkins.ebikesafari`.

## Iterate

```bash
nvm use
pnpm run sync:data
pnpm run cap:sync        # build + cap copy to ios/
pnpm run cap:ios         # opens Xcode
```

Run on simulator or device from Xcode.

## Live reload from laptop (optional)

While `pnpm run dev` on laptop, set in `capacitor.config.ts`:

```typescript
server: {
  url: 'http://YOUR_LAN_IP:5173',
  cleartext: true
}
```

Then `npx cap sync ios` and run — WebView hits Vite. Remove `server.url` before App Store / offline use.

## iOS notes

- Location: add `NSLocationWhenInUseUsageDescription` in `ios/App/App/Info.plist` when GPS layers ship
- Bosch Flow FIT sync stays separate (USB/iPhone Documents) — viewer only displays built JSON
- Map tiles need network unless you add offline PMTiles later

## Verify

1. Demo loop visible on simulator
2. Scrubber moves playhead
3. Rotate device — map fills screen (`viewport-fit=cover` in layout)

↑ [`README.md`](README.md)
