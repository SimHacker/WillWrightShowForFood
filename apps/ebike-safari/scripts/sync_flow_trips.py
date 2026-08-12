#!/usr/bin/env python3
"""Pull Bosch eBike Flow .fit files from a USB-connected iPhone (live, not backup).

Usage:
  pip install pymobiledevice3
  python sync_flow_trips.py --list
  python sync_flow_trips.py --dest ./rides
  python sync_flow_trips.py --dest ./rides --force

Flow keeps ride history inside the app (Statistics). Only rides you export as FIT
land in Flow Documents / Finder File Sharing. USB sync reads Documents only.
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

FLOW_BUNDLE_ID = "com.bosch.ebike.flow"
SCRIPT_DIR = Path(__file__).resolve().parent
APP_ROOT = SCRIPT_DIR.parent
DEFAULT_DEST = APP_ROOT / "demo" / "rides"


async def _remote_fits(service, documents_root: str) -> dict[str, int]:
    names = await service.listdir(documents_root)
    out: dict[str, int] = {}
    for name in names:
        if not name.lower().endswith(".fit"):
            continue
        remote = f"{documents_root}/{name}"
        st = await service.stat(remote)
        out[name] = int(st.get("st_size", 0))
    return out


async def list_device(dest: Path) -> int:
    try:
        from pymobiledevice3.lockdown import create_using_usbmux
        from pymobiledevice3.services.house_arrest import DOCUMENTS_ROOT, HouseArrestService
    except ImportError:
        print("Install pymobiledevice3: pip install pymobiledevice3", file=sys.stderr)
        return 1

    try:
        async with await create_using_usbmux() as lockdown:
            async with await HouseArrestService.create(
                lockdown, FLOW_BUNDLE_ID, documents_only=True
            ) as service:
                remote = await _remote_fits(service, DOCUMENTS_ROOT)
                local = {p.name: p.stat().st_size for p in dest.glob("*.fit") if p.is_file()}

                print(f"Device: {lockdown.display_name}  iOS {lockdown.product_version}")
                print("Source: live USB -> Flow Documents (not iCloud backup)")
                print(f"FIT on phone: {len(remote)}")
                print(f"FIT local ({dest}): {len(local)}")
                print()

                if not remote:
                    print("No .fit files in Flow Documents.")
                    print()
                    print("Flow Statistics can list many more rides than Documents exposes.")
                    print("Export each ride: Statistics -> ride -> menu -> Download FIT.")
                    print("Official help (GPX; FIT also from ride menu):")
                    print(
                        "  https://help.bosch-ebike.com/en/help-center/"
                        "ebw-flowapp-activitytracking/asset-asf-00128"
                    )
                    return 0

                only_phone = sorted(set(remote) - set(local))
                only_local = sorted(set(local) - set(remote))
                size_diff = sorted(
                    n for n in remote if n in local and remote[n] != local[n]
                )

                print("On phone:")
                for name in sorted(remote):
                    flag = ""
                    if name not in local:
                        flag = "  [not pulled yet]"
                    elif remote[name] != local[name]:
                        flag = (
                            f"  [size changed: phone {remote[name]}"
                            f" vs local {local[name]}]"
                        )
                    print(f"  {name}{flag}")

                if only_local:
                    print()
                    print("Local only (not on phone anymore):")
                    for name in only_local:
                        print(f"  {name}")

                if only_phone or size_diff:
                    print()
                    print(
                        f"Run sync to pull {len(only_phone)} new"
                        f" + {len(size_diff)} changed file(s)."
                    )
                else:
                    print()
                    print(
                        "Phone and local match. If Statistics shows more rides,"
                        " export them in Flow first."
                    )
                return 0
    except Exception as exc:
        print(f"USB: could not connect to iPhone -- {exc}", file=sys.stderr)
        print("Check: cable, unlocked, trusted, Flow installed.", file=sys.stderr)
        return 1


async def sync(dest: Path, dry_run: bool, force: bool) -> int:
    try:
        from pymobiledevice3.lockdown import create_using_usbmux
        from pymobiledevice3.services.house_arrest import DOCUMENTS_ROOT, HouseArrestService
    except ImportError:
        print("Install pymobiledevice3: pip install pymobiledevice3", file=sys.stderr)
        return 1

    dest.mkdir(parents=True, exist_ok=True)

    try:
        async with await create_using_usbmux() as lockdown:
            async with await HouseArrestService.create(
                lockdown, FLOW_BUNDLE_ID, documents_only=True
            ) as service:
                remote = await _remote_fits(service, DOCUMENTS_ROOT)
                if not remote:
                    print("No .fit files in Flow Documents.")
                    print("Export rides in Flow app first (Statistics -> ride -> Download FIT).")
                    return 0

                print(f"Device: {lockdown.display_name}  iOS {lockdown.product_version}")

                pulled = 0
                skipped = 0
                updated = 0

                for name in sorted(remote):
                    remote_path = f"{DOCUMENTS_ROOT}/{name}"
                    local = dest / name
                    remote_size = remote[name]

                    if local.exists() and not force:
                        local_size = local.stat().st_size
                        if local_size == remote_size and local_size > 0:
                            skipped += 1
                            continue
                        is_update = local_size != remote_size
                    else:
                        is_update = False

                    if dry_run:
                        verb = "would update" if is_update else "would pull"
                        print(f"{verb}: {name} ({remote_size} bytes)")
                        if is_update:
                            updated += 1
                        else:
                            pulled += 1
                        continue

                    verb = "update" if is_update else "pull"
                    print(f"{verb}: {name}")
                    await service.pull(remote_path, str(local))
                    if is_update:
                        updated += 1
                    else:
                        pulled += 1

                print(
                    f"Done -- pulled {pulled}, updated {updated},"
                    f" skipped {skipped} (unchanged) -> {dest}"
                )
                if skipped and not pulled and not updated:
                    print(
                        "Note: Flow Statistics may list more rides than Documents."
                        " Export missing rides in the app (Download FIT), then sync again."
                    )
                return 0
    except Exception as exc:
        print(f"USB: could not connect to iPhone -- {exc}", file=sys.stderr)
        return 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sync Flow FIT files from iPhone USB (Flow Documents only)"
    )
    parser.add_argument("--dest", type=Path, default=DEFAULT_DEST)
    parser.add_argument("--list", action="store_true", help="Compare phone vs local FIT files")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-pull all FIT files even when size matches",
    )
    args = parser.parse_args()
    dest = args.dest.resolve()

    if args.list:
        return asyncio.run(list_device(dest))
    return asyncio.run(sync(dest, args.dry_run, args.force))


if __name__ == "__main__":
    raise SystemExit(main())
