#!/usr/bin/env python3
"""
Deterministic markup facade generator — yaml girder → readable markdown dump.

Registry: process/markup-facades.yml
Run: pnpm run facades | pnpm run facades:check

What this does (v0.1):
  - Reads each registry entry's source yaml (NOT merged depends_on content)
  - Walks the tree: prose keys → ## sections; scalars → bullets/tables; see_also → Link|Why
  - Prepends GENERATED banner + content sha256; uses depends_on only for staleness (mtime)

What this does NOT do:
  - Call an LLM; apply tone/verbosity; merge dependency files into narrative
  - Replace instance-first LLM-authored markdown for flagship views

Future: hybrid mode, empathic templates in yaml, small-model blocks — see schemas/markup-facade.yml
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
REGISTRY = REPO_ROOT / "process" / "markup-facades.yml"

PROSE_KEYS = (
    "pitch",
    "what",
    "canonical_prose",
    "tagline",
    "rule",
    "purpose",
    "note",
    "summary",
)

SKIP_TOP_KEYS = frozenset({"markup", "meta", "see_also", "ties_to"})


def load_yaml(path: Path) -> Any:
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def slug_title(value: str) -> str:
    return re.sub(r"\b\w", lambda m: m.group(0).upper(), value.replace("-", " ").replace("_", " "))


def rel_link(from_dir: Path, target: str) -> str:
    if target.startswith("http"):
        return target
    clean = target.split("#")[0]
    if not clean:
        return target
    return clean


def resolve_path(base_dir: Path, ref: str) -> Path:
    clean = ref.split("#")[0]
    if not clean:
        return base_dir
    if clean.startswith("http"):
        return base_dir / clean
    return (base_dir / clean).resolve()


def collect_deps(entry: dict, base_dir: Path) -> list[Path]:
    paths: list[Path] = []
    source = base_dir / entry["source"]
    paths.append(source.resolve())
    for dep in entry.get("depends_on", []):
        p = resolve_path(base_dir, dep)
        if p.exists():
            paths.append(p)
    return paths


def is_stale(entry: dict, base_dir: Path, output: Path) -> bool:
    if not output.exists():
        return True
    out_mtime = output.stat().st_mtime
    for p in collect_deps(entry, base_dir):
        if p.exists() and p.stat().st_mtime > out_mtime:
            return True
    body = output.read_text(encoding="utf-8")
    if "<!-- GENERATED" not in body:
        return True
    return False


def fmt_scalar(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, bool):
        return "yes" if value else "no"
    text = str(value).strip()
    if "\n" in text:
        return text
    return text


def render_prose(key: str, value: str, lines: list[str]) -> None:
    heading = slug_title(key)
    if key == "tagline":
        lines.extend(["## Tagline", "", f"*{value.strip()}*", ""])
        return
    if key in ("pitch", "what", "canonical_prose", "purpose"):
        lines.extend([f"## {heading}", "", value.strip(), ""])
        return
    lines.extend([f"**{heading}:** {value.strip()}", ""])


def render_list_items(items: list[Any], lines: list[str], depth: int = 0) -> None:
    indent = "  " * depth
    for item in items:
        if isinstance(item, dict):
            parts = [f"{k}: {v}" for k, v in item.items()]
            lines.append(f"{indent}- {', '.join(parts)}")
        else:
            lines.append(f"{indent}- {item}")


def render_dict_table(rows: dict[str, Any], lines: list[str]) -> None:
    if not rows:
        return
    if all(isinstance(v, (str, int, float, bool)) or v is None for v in rows.values()):
        lines.extend(["| Key | Value |", "|-----|-------|"])
        for k, v in rows.items():
            cell = fmt_scalar(v).replace("|", "\\|").replace("\n", " ")
            lines.append(f"| **{k}** | {cell} |")
        lines.append("")
        return
    for k, v in rows.items():
        lines.extend([f"### {slug_title(k)}", ""])
        render_value(v, lines, k, emit_header=False)
        lines.append("")


def render_value(value: Any, lines: list[str], key: str = "", emit_header: bool = True) -> None:
    if value is None:
        return
    if isinstance(value, str):
        if key in PROSE_KEYS or len(value) > 120 or "\n" in value:
            render_prose(key or "note", value, lines)
        else:
            lines.append(f"- **{slug_title(key)}:** {value}")
            lines.append("")
        return
    if isinstance(value, bool):
        lines.append(f"- **{slug_title(key)}:** {'yes' if value else 'no'}")
        lines.append("")
        return
    if isinstance(value, list):
        if not value:
            return
        if all(isinstance(x, str) for x in value):
            if emit_header:
                lines.extend([f"## {slug_title(key)}", ""])
            render_list_items(value, lines)
            lines.append("")
            return
        if all(isinstance(x, dict) for x in value):
            if emit_header:
                lines.extend([f"## {slug_title(key)}", ""])
            for i, row in enumerate(value):
                if len(row) == 1:
                    k, v = next(iter(row.items()))
                    lines.append(f"- **{k}:** {v}")
                else:
                    lines.append(f"- {json.dumps(row, ensure_ascii=False)}")
            lines.append("")
            return
        if emit_header:
            lines.extend([f"## {slug_title(key)}", ""])
        render_list_items(value, lines)
        lines.append("")
        return
    if isinstance(value, dict):
        if key in ("challenges", "rig_classes", "game_shows", "flagship_instances", "entries"):
            if emit_header:
                lines.extend([f"## {slug_title(key)}", ""])
            if key == "challenges" and all(isinstance(v, dict) for v in value.values()):
                lines.extend(["| Challenge | Detail |", "|-----------|--------|"])
                for name, spec in value.items():
                    if isinstance(spec, dict):
                        bits = []
                        for sk, sv in spec.items():
                            if sk == "see":
                                bits.append(f"see [{sv}]({sv})")
                            elif isinstance(sv, str):
                                bits.append(f"{sk}: {sv}")
                            elif isinstance(sv, list):
                                bits.append(f"{sk}: {', '.join(str(x) for x in sv)}")
                        detail = "; ".join(bits) if bits else "—"
                    else:
                        detail = fmt_scalar(spec)
                    lines.append(f"| `{name}` | {detail.replace('|', '/')} |")
                lines.append("")
                return
            render_dict_table(value, lines)
            return
        if emit_header:
            lines.extend([f"## {slug_title(key)}", ""])
        for subk, subv in value.items():
            if isinstance(subv, (str, int, float, bool)) or subv is None:
                lines.append(f"- **{subk}:** {fmt_scalar(subv)}")
            elif isinstance(subv, list) and subv and all(isinstance(x, str) for x in subv):
                lines.append(f"- **{subk}:**")
                for item in subv:
                    lines.append(f"  - {item}")
            elif isinstance(subv, dict) and all(isinstance(v, (str, int, float, bool)) or v is None for v in subv.values()):
                lines.append(f"- **{subk}:**")
                for kk, vv in subv.items():
                    lines.append(f"  - {kk}: {fmt_scalar(vv)}")
            else:
                lines.extend([f"### {slug_title(subk)}", ""])
                render_value(subv, lines, subk, emit_header=False)
        lines.append("")
        return


def render_body(data: dict, source_rel: str) -> str:
    lines: list[str] = []
    meta = data.get("meta") or {}

    for key in PROSE_KEYS:
        if key in data and isinstance(data[key], str):
            render_prose(key, data[key], lines)
        elif key in meta and isinstance(meta[key], str) and key not in data:
            render_prose(key, meta[key], lines)

    if meta and not any(k in lines for k in ("## Meta", "meta")):
        scalar_meta = {k: v for k, v in meta.items() if isinstance(v, (str, int, float, bool)) and k not in PROSE_KEYS}
        if scalar_meta:
            lines.extend(["## Meta", ""])
            render_dict_table(scalar_meta, lines)

    for key, value in data.items():
        if key in SKIP_TOP_KEYS or key in PROSE_KEYS:
            continue
        render_value(value, lines, key)

    for section_key in ("ties_to", "see_also"):
        refs = data.get(section_key)
        if isinstance(refs, list) and refs:
            title = "Related" if section_key == "see_also" else "Ties to"
            lines.extend([f"## {title}", ""])
            if all(isinstance(r, dict) and "path" in r for r in refs):
                lines.extend(["| Link | Why |", "|------|-----|"])
                for ref in refs:
                    p = ref["path"]
                    why = ref.get("why") or ref.get("reason") or "—"
                    href = p if p.startswith("http") else rel_link(Path(source_rel).parent, p)
                    label = p.split("/")[-1] or p
                    lines.append(f"| [`{label}`]({href}) | {why.replace('|', '/')} |")
                lines.append("")
            else:
                lines.extend(["| Link |", "|------|"])
                for ref in refs:
                    if isinstance(ref, dict):
                        p = ref.get("path", "")
                        why = ref.get("why") or ref.get("reason")
                        href = p if p.startswith("http") else rel_link(Path(source_rel).parent, p)
                        label = f"{p} — {why}" if why else p
                        lines.append(f"| [{label}]({href}) |")
                    elif isinstance(ref, str):
                        lines.append(f"| [`{ref}`]({rel_link(Path(source_rel).parent, ref)}) |")
                    else:
                        lines.append(f"| {ref} |")
                lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def generate_facade(entry: dict, base_dir: Path) -> tuple[str, str]:
    source = (base_dir / entry["source"]).resolve()
    output_path = (base_dir / entry["output"]).resolve()
    data = load_yaml(source)
    source_rel = source.relative_to(REPO_ROOT).as_posix()

    try:
        registry_href = Path(REPO_ROOT / "process" / "markup-facades.yml").relative_to(
            output_path.parent
        ).as_posix()
    except ValueError:
        registry_href = "../markup-facades.yml"

    try:
        yaml_href = source.relative_to(output_path.parent).as_posix()
    except ValueError:
        yaml_href = source_rel

    title = entry.get("title") or slug_title(entry["id"])

    header = "\n".join(
        [
            f"<!-- GENERATED from `{source_rel}` — do not edit; run `pnpm run facades` -->",
            f"<!-- content-sha256:{{hash}} -->",
            "",
            f"# {title}",
            "",
            f"> **Girder:** [`{Path(entry['source']).name}`]({yaml_href}) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`]({registry_href})",
            "",
            "",
        ]
    )

    body = render_body(data, source_rel)
    full = header + body
    digest = content_hash(body)
    full = full.replace("{hash}", digest)
    return full, digest


def main(argv: list[str]) -> int:
    check_only = "--check" in argv
    registry = load_yaml(REGISTRY)
    base_dir = REGISTRY.parent
    stale: list[str] = []
    generated = 0

    for entry in registry.get("facades", []):
        render = entry.get("render") or {}
        if render.get("mode") == "llm":
            # Instance-first — authored by an LLM; never bulk-regenerated/clobbered by this script.
            continue
        output = (base_dir / entry["output"]).resolve()
        if check_only:
            if is_stale(entry, base_dir, output):
                stale.append(entry["output"])
            continue

        if "--force" not in argv and not is_stale(entry, base_dir, output):
            continue

        text, _ = generate_facade(entry, base_dir)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(text, encoding="utf-8")
        generated += 1
        print(f"facade: {entry['output']}")

    if check_only:
        if stale:
            print("Stale markup facades (run pnpm run facades):", file=sys.stderr)
            for name in stale:
                print(f"  - {name}", file=sys.stderr)
            return 1
        print("markup facades OK")
        return 0

    if generated == 0:
        print("markup facades up to date")
    else:
        print(f"generated {generated} facade(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
