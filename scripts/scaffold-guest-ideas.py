#!/usr/bin/env python3
"""Scaffold characters/<slug>/ideas.md from CHARACTER.yml + INDEX.yml + DonHopkins correspondence."""

from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")

ROOT = Path(__file__).resolve().parents[1]
CHARS = ROOT / "characters"
INDEX = CHARS / "INDEX.yml"
DON_CORR = Path("/Users/a2deh/GroundUp/git/DonHopkins/characters/don-hopkins/correspondence")
SKIP = {"_TEMPLATE", "don-hopkins", "don-philahue", "slats", "ultimate-machine", "palm"}

# WWSFF slug -> DonHopkins correspondence filename
CORR_MAP = {
    "alan-kay": "alan-kay.yml",
    "dan-ingalls": "daniel-ingalls.yml",
    "terry-winograd": "terry-winograd.yml",
    "yoot-saito": "yoot-saito.yml",
    "chaim-gingold": None,
    "ken-kahn": "ken-kahn.yml",
    "brad-myers": "brad-myers.yml",
    "ted-selker": "ted-selker.yml",
    "david-ungar": "david-ungar.yml",
    "ben-cerveny": "ben-cerveny.yml",
    "arthur-van-hoff": "arthur-van-hoff.yml",
    "brian-harvey": "brian-harvey-jens-moenig.yml",
    "jens-monig": "brian-harvey-jens-moenig.yml",
    "golan-levin": "golan-levin.yml",
    "edd-coates": "edd-coates.yml",
    "gary-drescher": "gary-drescher.yml",
    "matthew-sibigtroth": "matthew-sibigtroth.yml",
    "thomas-cherryhomes": "thomas-cherryhomes.yml",
    "margaret-minsky": "margaret-minsky.yml",
    "ted-nelson": "ted-nelson.yml",
    "vanessa-freudenberg": "vanessa-freudenberg.yml",
}

LONG_RELATIONSHIP = {"alan-kay", "will-wright"}


def load_yaml(path: Path) -> dict:
    if not path.exists():
        return {}
    with path.open() as f:
        data = yaml.safe_load(f) or {}
    return data if isinstance(data, dict) else {}


def strip_md(s: str) -> str:
    return re.sub(r"\*\*", "", s).strip()


def guest_index() -> dict:
    idx = load_yaml(INDEX)
    return idx.get("guests") or {}


def read_correspondence(slug: str) -> dict:
    fname = CORR_MAP.get(slug)
    if not fname:
        return {}
    return load_yaml(DON_CORR / fname)


def read_public_correspondence(char_dir: Path) -> dict:
    return load_yaml(char_dir / "correspondence.yml")


def hooks_from_data(slug: str, char: dict, idx_note: str, corr: dict, pub_corr: dict) -> list[str]:
    hooks: list[str] = []
    show = (char.get("invitation") or {}).get("show_seed", "")
    if show:
        hooks.append(f"Show seed: `{show}` — walk the repo on air and build from the seed.")
    if idx_note:
        for part in re.split(r"[;.]\\s+", idx_note):
            part = part.strip()
            if len(part) > 20:
                hooks.append(part)
    themes = corr.get("themes") or []
    if isinstance(themes, dict):
        themes = list(themes.values())
    for t in themes[:6]:
        if isinstance(t, str) and len(t) > 15:
            hooks.append(t)
    threads = pub_corr.get("threads") or {}
    for key, val in list(threads.items())[:4]:
        if isinstance(val, dict) and val.get("what"):
            hooks.append(val["what"])
    show_hooks = pub_corr.get("show_hooks") or []
    hooks.extend(show_hooks[:4])
    # dedupe preserve order
    seen = set()
    out = []
    for h in hooks:
        k = h.lower()[:80]
        if k not in seen:
            seen.add(k)
            out.append(h)
    return out[:8]


def shared_ground_section(slug: str, name: str, corr: dict, pub_corr: dict) -> str:
    gist = pub_corr.get("gist") or corr.get("summary") or ""
    if not gist:
        themes = corr.get("themes") or []
        if isinstance(themes, dict):
            themes = list(themes.values())
        if not themes:
            return ""
        lines = ["## Shared ground", "", f"*Topics that connect {name}'s work to this repo — public themes only.*", ""]
        for t in themes[:5]:
            if isinstance(t, str):
                lines.append(f"- {t}")
        lines.append("")
        return "\n".join(lines)
    gist = gist.strip()
    if slug in LONG_RELATIONSHIP:
        return f"## Shared ground\n\n{gist}\n\n"
    # Abstract gist as narrative paragraph without "we emailed" framing
    return f"## Shared ground\n\n{gist}\n\n"


def build_ideas(slug: str, char_dir: Path, guests: dict, force: bool) -> bool:
    out = char_dir / "ideas.md"
    if out.exists() and not force:
        return False
    char_yml = load_yaml(char_dir / "CHARACTER.yml")
    c = char_yml.get("character") or {}
    name = c.get("name") or slug.replace("-", " ").title()
    signifier = c.get("signifier") or "👤"
    bio = strip_md((char_yml.get("bio") or {}).get("summary") or "")
    idx_entry = guests.get(slug) or {}
    idx_note = idx_entry.get("note", "") if isinstance(idx_entry, dict) else ""
    corr = read_correspondence(slug)
    pub_corr = read_public_correspondence(char_dir)
    hooks = hooks_from_data(slug, char_yml, idx_note, corr, pub_corr)
    if not hooks:
        hooks = [
            f"Walk `{slug}/` — biography, sources, and show materials on air.",
            "Repo Show format: build in public, credit ideas, leave artifacts in the repo.",
        ]

    consent = (char_yml.get("invitation") or {}).get("consent") or "not_yet_asked"
    status_note = "dream guest" if idx_entry.get("invitation_status") == "dream_guest" else "invitation guest"

    body = f"""# Ideas to explore with {name} {signifier}

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in {name.split()[0]}'s
public work and documented connections to this repository. Things Don would love to follow
**with** {name}; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · {status_note} · consent {consent}

"""
    if bio:
        body += f"""## What {name.split()[0]} has done

{bio}

"""
    sg = shared_ground_section(slug, name, corr, pub_corr)
    if sg:
        body += sg

    body += "## The hooks\n\n"
    for i, h in enumerate(hooks, 1):
        title = h.split("—")[0].split(" - ")[0].strip()
        if len(title) > 70:
            title = title[:67] + "..."
        rest = h[len(title) :].lstrip(" —-")
        if rest:
            body += f"### {i}. {title}\n{rest.strip()}\n\n"
        else:
            body += f"### {i}. {title}\n\n"

    sources = []
    if (char_dir / "invitation.md").exists():
        sources.append("- [`invitation.md`](invitation.md)")
    if (char_dir / "correspondence.yml").exists():
        sources.append("- [`correspondence.yml`](correspondence.yml) — public-safe thread digest")
    show = (char_yml.get("invitation") or {}).get("show_seed")
    if show:
        sources.append(f"- Show seed: [`{show}`](../../{show})")
    if (char_dir / "media/from-mail/MANIFEST.yml").exists():
        sources.append("- [`media/from-mail/MANIFEST.yml`](media/from-mail/MANIFEST.yml) — mail-sourced artifacts")
    if (char_dir / "CHARACTER.yml").exists():
        sources.append("- [`CHARACTER.yml`](CHARACTER.yml)")

    body += "## Sources (public)\n\n" + "\n".join(sources) + "\n"
    out.write_text(body)
    return True


def main() -> None:
    force = "--force" in sys.argv
    guests = guest_index()
    created = []
    skipped = []
    for char_dir in sorted(CHARS.iterdir()):
        if not char_dir.is_dir() or char_dir.name in SKIP:
            continue
        if not (char_dir / "CHARACTER.yml").exists():
            continue
        has_invite = (char_dir / "invitation.md").exists()
        in_index = char_dir.name in guests or char_dir.name == "will-wright"
        if not has_invite and not in_index:
            continue
        if build_ideas(char_dir.name, char_dir, guests, force):
            created.append(char_dir.name)
        else:
            skipped.append(char_dir.name)
    print(f"created: {len(created)}")
    for s in created:
        print(f"  + {s}")
    print(f"skipped (existing): {len(skipped)}")


if __name__ == "__main__":
    main()
