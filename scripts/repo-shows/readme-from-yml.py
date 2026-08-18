#!/usr/bin/env python3
"""Generate repo-show README.md front pages from primary YAML (lazy prototype promotion)."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
SHOWS = ROOT / "repo-shows"
SKIP_DIRS = {"_TEMPLATE", "artifacts", "sources", "audience", "episodes", "topics", "source"}


def _front_page_names() -> dict[str, set[str]]:
    out: dict[str, set[str]] = {}
    for d in SHOWS.iterdir():
        if d.is_dir() and d.name not in {"_TEMPLATE", "process"}:
            out[d.name] = {f"{d.name}.yml", "SHOW.yml", "FLIPBOOK.yml"}
    return out


FRONT_PAGES = _front_page_names()


def humanize_slug(slug: str) -> str:
    words = slug.replace("_", "-").split("-")
    small = {"a", "an", "and", "as", "at", "for", "in", "of", "on", "or", "the", "to", "vs", "with"}
    out: list[str] = []
    for i, w in enumerate(words):
        if w.upper() in {"AI", "CA", "CHI", "CS", "EA", "GDC", "HN", "HUD", "ITS", "NC", "OLPC", "PDP7", "PDP-7", "QGCon", "SC2K", "SIMH", "UI", "VR", "XML", "YAML"}:
            out.append(w.upper() if w.lower() == w else w)
        elif i > 0 and w.lower() in small:
            out.append(w.lower())
        else:
            out.append(w.capitalize())
    return " ".join(out)


def load_yaml(path: Path) -> tuple[dict[str, Any], str]:
    text = path.read_text(encoding="utf-8")
    data = yaml.safe_load(text)
    return (data if isinstance(data, dict) else {}), text


def title_from_comment(yml_text: str, fallback: str) -> str:
    for line in yml_text.splitlines()[:3]:
        line = line.strip()
        if not line.startswith("#"):
            continue
        body = line.lstrip("#").strip()
        for sep in (" — ", " - ", " – "):
            if sep in body:
                left = body.split(sep, 1)[0].strip()
                if left.lower().startswith(("show seed", "seed", "flipbook")):
                    rest = body.split("—", 1)[-1].strip() if "—" in body else body.split("-", 1)[-1].strip()
                    if rest and len(rest) > 5:
                        return rest.split("(")[0].strip()
                if len(left) > 3:
                    return left
        if body and not body.lower().startswith(("show seed", "seed —")):
            return body.split("(")[0].strip()
    return fallback


def primary_yml(show_dir: Path) -> Path | None:
    show_yml = show_dir / "SHOW.yml"
    if show_yml.exists():
        return show_yml
    named = show_dir / f"{show_dir.name}.yml"
    if named.exists():
        return named
    flip = show_dir / "FLIPBOOK.yml"
    if flip.exists():
        return flip
    ymls = sorted(show_dir.glob("*.yml"))
    exclude = re.compile(
        r"^(simulated-opening|AUCTIONS|MOOLA|SECONDARY-MARKET|ORCHESTRATOR|party-deck|INDEX|content-map|episode-seeds|CARD|GLANCE|ROOM|SEGMENTS|SIMULATION)\.yml$"
    )
    candidates = [p for p in ymls if not exclude.match(p.name)]
    if len(candidates) == 1:
        return candidates[0]
    if named in ymls:
        return named
    return candidates[0] if candidates else None


def companion_md(show_dir: Path, yml_path: Path | None, data: dict[str, Any]) -> Path | None:
    show = data.get("show") or {}
    rendered = show.get("rendered_edition")
    if rendered:
        p = show_dir / rendered
        if p.exists():
            return p
    base = show_dir.name
    for name in (f"{base}.md", f"{base.replace('-', '_')}.md"):
        p = show_dir / name
        if p.exists() and p.name != "README.md":
            return p
    if yml_path:
        sibling = yml_path.with_suffix(".md")
        if sibling.exists():
            return sibling
    return None


def first_paragraph(*chunks: Any) -> str:
    for c in chunks:
        if isinstance(c, str) and c.strip():
            return " ".join(c.strip().split())
    return ""


def consolidate_tie_strings(ties: list[Any]) -> list[Any]:
    """Collapse repeated paths (e.g. crazy-idea-jam.yml#foo × 8) into one labeled entry."""
    groups: dict[str, list[str]] = {}
    order: list[str] = []
    others: list[Any] = []
    for item in ties:
        if not isinstance(item, str):
            others.append(item)
            continue
        base, _, anchor = item.partition("#")
        if base not in groups:
            groups[base] = []
            order.append(base)
        if anchor:
            groups[base].append(anchor)
    result: list[Any] = []
    for base in order:
        anchors = groups[base]
        if not anchors:
            result.append(base)
        elif len(anchors) == 1:
            result.append(f"{base}#{anchors[0]}")
        else:
            label = humanize_slug(Path(base).stem)
            note = " · ".join(a.replace("_", " ") for a in anchors)
            result.append({"name": label, "connection": note, "character": base})
    return result + others


def md_link(path_str: str, show_dir: Path) -> str:
    if path_str.startswith(("http://", "https://")):
        return f"[{path_str}]({path_str})"
    anchor = ""
    if "#" in path_str:
        path_str, anchor = path_str.split("#", 1)
        anchor = "#" + anchor
    p = Path(path_str)
    # Human nav: another show's seed yml → README front page
    parts = p.parts
    if len(parts) >= 2 and parts[0] == "repo-shows":
        show_name, fname = parts[1], parts[-1]
        if fname in (f"{show_name}.yml", "SHOW.yml", "FLIPBOOK.yml"):
            p = Path("repo-shows") / show_name / "README.md"
    elif len(parts) == 2 and not path_str.startswith((".", "..")):
        show_name, fname = parts[0], parts[1]
        if show_name in FRONT_PAGES and fname in FRONT_PAGES.get(show_name, set()):
            p = Path("repo-shows") / show_name / "README.md"
    if p.is_absolute():
        return f"[{path_str}]({path_str}{anchor})"
    if path_str.startswith((".", "..")):
        target = (show_dir / p).resolve()
    else:
        target = (ROOT / p).resolve()
    try:
        rel = target.relative_to(ROOT)
    except ValueError:
        rel = p
    label = p.name or str(p)
    if label == "README.md" and len(p.parts) >= 2:
        label = p.parts[-2]
    return f"[{label}]({rel.as_posix()}{anchor})"


def list_section(title: str, items: list[Any], show_dir: Path) -> str:
    if not items:
        return ""
    lines = [f"## {title}", ""]
    for item in items:
        if isinstance(item, str):
            lines.append(f"- {md_link(item, show_dir)}")
        elif isinstance(item, dict):
            name = item.get("name") or item.get("id") or item.get("title") or str(item)
            note = item.get("connection") or item.get("topic") or item.get("caption") or ""
            if note:
                note = " — " + " ".join(str(note).strip().split())
            char = item.get("character")
            if char:
                lines.append(f"- **{name}** — {md_link(char, show_dir)}{note}")
            else:
                lines.append(f"- **{name}**{note}")
        else:
            lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


def beats_section(data: dict[str, Any]) -> str:
    beats = data.get("beats")
    if not beats:
        show = data.get("show") or {}
        beats = show.get("beats")
    if not beats:
        return ""
    lines = ["## Beats", ""]
    for i, b in enumerate(beats, 1):
        if isinstance(b, str):
            lines.append(f"{i}. {b}")
        elif isinstance(b, dict):
            cap = b.get("caption") or b.get("page") or f"Beat {i}"
            at = b.get("at_sec")
            prefix = f"**{cap}**"
            if at is not None:
                prefix = f"**{at}s — {cap}**"
            visual = b.get("visual") or b.get("topic") or ""
            if visual:
                lines.append(f"{i}. {prefix} — {visual}")
            else:
                lines.append(f"{i}. {prefix}")
        else:
            lines.append(f"{i}. {b}")
    lines.append("")
    return "\n".join(lines)


def meta_table(rows: list[tuple[str, str]]) -> str:
    rows = [(k, v) for k, v in rows if v]
    if not rows:
        return ""
    lines = ["| Field | Value |", "|-------|-------|"]
    for k, v in rows:
        v = v.replace("|", "\\|")
        lines.append(f"| **{k}** | {v} |")
    lines.append("")
    return "\n".join(lines)


def extract_show(data: dict[str, Any], show_dir: Path, yml_path: Path | None, yml_text: str = "") -> str:
    show = data.get("show") or {}
    flip = data.get("flipbook") or {}
    meta = data.get("meta") or {}

    fallback_title = humanize_slug(show_dir.name)
    title = (
        show.get("title")
        or flip.get("title")
        or data.get("title")
        or title_from_comment(yml_text, fallback_title)
    )

    host = show.get("host") or meta.get("host") or data.get("host") or ""
    status = show.get("status") or meta.get("status") or data.get("status") or "seed"
    show_type = show.get("type") or flip.get("department") or data.get("type") or ""
    consent = show.get("consent") or data.get("consent") or ""

    guest_entries = show.get("guests")
    if guest_entries is None:
        guest_entries = data.get("guests")
    guest_str = ""
    guest_dicts: list[dict[str, Any]] = []
    if isinstance(guest_entries, list):
        if guest_entries and isinstance(guest_entries[0], dict):
            guest_dicts = [g for g in guest_entries if isinstance(g, dict)]
        else:
            guest_str = ", ".join(str(g) for g in guest_entries)
    elif isinstance(guest_entries, str):
        guest_str = guest_entries

    narration = flip.get("narration") if isinstance(flip.get("narration"), dict) else {}
    topic = first_paragraph(
        show.get("topic"),
        data.get("pitch"),
        data.get("premise"),
        data.get("origin"),
        narration.get("required_on_air"),
        narration.get("speaker_note"),
        data.get("why_it_matters"),
    )

    tagline = topic[:160] + ("…" if len(topic) > 160 else "") if topic else f"Repo Show seed — {humanize_slug(show_dir.name)}."

    lines = [f"# {title}", ""]
    if tagline:
        lines.append(f"> {tagline}")
        lines.append("")

    table_rows = [
        ("Status", str(status)),
        ("Type", str(show_type) if show_type else ""),
        ("Host", str(host).replace("-", " ").title() if host else ""),
        ("Guests", guest_str),
        ("Consent", str(consent).replace("_", " ") if consent else ""),
    ]
    tbl = meta_table(table_rows)
    if tbl:
        lines.append(tbl)

    body_fields = [
        ("Premise", data.get("premise")),
        ("Pitch", data.get("pitch")),
        ("Topic", show.get("topic")),
        ("Origin", data.get("origin") or show.get("origin")),
        ("Why it matters", data.get("why_it_matters")),
    ]
    seen: set[str] = set()
    for heading, text in body_fields:
        if isinstance(text, str) and text.strip():
            norm = " ".join(text.split())
            if norm in seen:
                continue
            seen.add(norm)
            lines.append(f"## {heading}")
            lines.append("")
            lines.append(text.strip())
            lines.append("")

    memorial = data.get("memorial_mode")
    if isinstance(memorial, dict):
        lines.append("## Memorial mode")
        lines.append("")
        subj = memorial.get("subject") or ""
        rule = memorial.get("rule") or ""
        if subj:
            lines.append(f"**Subject:** {humanize_slug(str(subj))}")
        if rule:
            lines.append("")
            lines.append(rule.strip())
        lines.append("")

    frame = data.get("the_frame")
    if isinstance(frame, dict):
        lines.append("## Frame")
        lines.append("")
        for k, v in frame.items():
            if isinstance(v, str) and v.strip():
                label = humanize_slug(k.replace("_", "-"))
                lines.append(f"**{label}.** {v.strip()}")
                lines.append("")

    lines.append(beats_section(data))

    if guest_dicts:
        lines.append(list_section("Guests", guest_dicts, show_dir))

    prompts = show.get("discussion_prompts") or data.get("discussion_prompts")
    if isinstance(prompts, list) and prompts:
        lines.append("## Discussion prompts")
        lines.append("")
        for i, p in enumerate(prompts, 1):
            if isinstance(p, str):
                lines.append(f"{i}. {p}")
        lines.append("")

    ties = (
        show.get("ties_to")
        or data.get("ties_to")
        or data.get("ties")
        or flip.get("ties_to")
    )
    if ties:
        tie_list = ties if isinstance(ties, list) else [ties]
        tie_list = consolidate_tie_strings(tie_list)
        lines.append(list_section("Related", tie_list, show_dir))

    companion = companion_md(show_dir, yml_path, data)
    lines.append("## In this directory")
    lines.append("")
    if yml_path:
        lines.append(f"- [`{yml_path.name}`]({yml_path.name}) — machine reading (seed spec)")
    if companion:
        lines.append(f"- [`{companion.name}`]({companion.name}) — readable edition")
    lines.append("- `SHOW.yml` — *not yet*; add when ready to run the show (lazy prototype promotion)")
    lines.append("")
    lines.append("↑ [`../README.md`](../README.md) · [`../INDEX.yml`](../INDEX.yml)")
    lines.append("")

    return "\n".join(lines)


def generate_readme(show_dir: Path, force: bool = False) -> bool:
    readme = show_dir / "README.md"
    if readme.exists() and not force:
        return False
    yml_path = primary_yml(show_dir)
    if yml_path:
        data, yml_text = load_yaml(yml_path)
        content = extract_show(data, show_dir, yml_path, yml_text)
    else:
        companion = companion_md(show_dir, None, {})
        if not companion:
            print(f"SKIP {show_dir.name}: no yml or md", file=sys.stderr)
            return False
        title = humanize_slug(show_dir.name)
        content = "\n".join(
            [
                f"# {title}",
                "",
                f"> Front page for this show directory.",
                "",
                f"Readable notes live in [`{companion.name}`]({companion.name}). No YAML seed yet.",
                "",
                "## In this directory",
                "",
                f"- [`{companion.name}`]({companion.name}) — working notes",
                "- Add a seed `.yml` when the show graduates from notes",
                "- `SHOW.yml` — *not yet*; add when ready to run",
                "",
                "↑ [`../README.md`](../README.md) · [`../INDEX.yml`](../INDEX.yml)",
                "",
            ]
        )
    readme.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    force = "--force" in sys.argv
    created = 0
    for d in sorted(SHOWS.iterdir()):
        if not d.is_dir() or d.name in SKIP_DIRS or d.name.startswith("."):
            continue
        if generate_readme(d, force=force):
            print(f"WROTE {d.name}/README.md")
            created += 1
    print(f"Done: {created} README(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
