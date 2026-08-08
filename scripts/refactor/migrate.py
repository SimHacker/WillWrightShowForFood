#!/usr/bin/env python3
"""Table-driven registry migration for the repo-shows refactor (repo-shows/REFACTOR.md).

Each phase: git mv files per its moves table, then rewrite every path-like
token in every tracked text file that RESOLVES to a moved path. Tokens that
do not resolve to a moved path are never touched, so the sweep is safe to
run repo-wide. Root-anchored mentions (written relative to repo root) and
GitHub blob/tree URLs are handled too. Everything else lands in the
stragglers report for human review.

Usage, from repo root:
    python3 scripts/refactor/migrate.py <phase> [--dry-run]
    python3 scripts/refactor/migrate.py report        # stragglers only
"""

import os
import re
import subprocess
import sys

ROOT = os.getcwd()
TEXT_EXT = {".md", ".yml", ".yaml", ".json", ".txt", ".html", ".mjs", ".js",
            ".ts", ".py", ".sh", ".css", ".svelte"}
TOKEN_RE = re.compile(r"(?:\.\./)+[A-Za-z0-9_][A-Za-z0-9_.\-/]*"
                      r"|[A-Za-z0-9_][A-Za-z0-9_.\-/]*")
PATHISH_RE = re.compile(r".*(?:/|\.(?:yml|yaml|md|html|json|png|jpg|svg|txt))$")
IDEAS = "repo-shows"


def sh(*args):
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout


def tracked_files():
    return [f for f in sh("git", "ls-files").splitlines()
            if os.path.splitext(f)[1] in TEXT_EXT and os.path.isfile(f)]


def bucket_moves(bucket, prefix):
    """ideas/<bucket>/<name>.{yml,md} -> bits/<prefix>-<name>/<prefix>-<name>.{yml,md}"""
    moves = {}
    d = f"{IDEAS}/{bucket}"
    if not os.path.isdir(d):
        return moves
    for fn in sorted(os.listdir(d)):
        stem, ext = os.path.splitext(fn)
        if fn in ("INDEX.yml", "README.md") or ext not in (".yml", ".md"):
            continue
        moves[f"{d}/{fn}"] = f"bits/{prefix}-{stem}/{prefix}-{stem}{ext}"
    return moves


def phase1_moves():
    moves = {}
    moves.update(bucket_moves("gags", "gag"))
    moves.update(bucket_moves("traditions", "tradition"))
    moves.update(bucket_moves("swag", "swag"))
    moves.update(bucket_moves("themes", "theme"))
    # educators-track is a TRACK, not a theme (REFACTOR.md 3b)
    for ext in (".yml", ".md"):
        old = f"{IDEAS}/themes/educators-track{ext}"
        if old in moves:
            moves[old] = f"process/tracks/educators-track/educators-track{ext}"
    return moves


def phase1_aliases():
    """Reference-only rewrites for files that get dissolved, not moved."""
    a = {}
    for bucket in ("gags", "themes", "traditions", "swag"):
        a[f"{IDEAS}/{bucket}/INDEX.yml"] = "bits/INDEX.yml"
        a[f"{IDEAS}/{bucket}/README.md"] = "bits/README.md"
        a[f"{IDEAS}/{bucket}"] = "bits"
    return a


def phase2_moves():
    moves = {}
    for stem in ("ca-machinima-cabaret-drag-race", "jsonsters-gallery-lecture",
                 "kids-city-newspaper", "urban-safari-live", "urban-ebike-safari"):
        old = f"{IDEAS}/{stem}.yml"
        if os.path.isfile(old):
            moves[old] = f"repo-shows/{stem}/{stem}.yml"
    d = f"{IDEAS}/shows/will-wright-premiere"
    if os.path.isdir(d):
        for fn in sorted(os.listdir(d)):
            moves[f"{d}/{fn}"] = f"repo-shows/will-wright-premiere-ideas/{fn}"
    return moves


def phase2_aliases():
    return {
        f"{IDEAS}/INDEX.yml": "repo-shows/INDEX.yml",
        f"{IDEAS}/README.md": "repo-shows/README.md",
        f"{IDEAS}/shows/INDEX.yml": "repo-shows/INDEX.yml",
        f"{IDEAS}/shows/README.md": "repo-shows/README.md",
        f"{IDEAS}/shows/will-wright-premiere": "repo-shows/will-wright-premiere-ideas",
        f"{IDEAS}/shows": "repo-shows",
        IDEAS: "repo-shows",
    }


def phase3_moves():
    moves = {}
    d = "repo-shows/flipbook/shows"
    if os.path.isdir(d):
        for name in sorted(os.listdir(d)):
            sub = f"{d}/{name}"
            if os.path.isdir(sub):
                for fn in sorted(os.listdir(sub)):
                    moves[f"{sub}/{fn}"] = f"repo-shows/flipbook-{name}/{fn}"
    return moves


def phase3_aliases():
    a = {"repo-shows/flipbook/shows": "repo-shows"}
    d = "repo-shows/flipbook/shows"
    if os.path.isdir(d):
        for name in sorted(os.listdir(d)):
            if os.path.isdir(f"{d}/{name}"):
                a[f"{d}/{name}"] = f"repo-shows/flipbook-{name}"
    return a


def phase4_moves():
    keep = {"INDEX.yml", "CARD.yml", "GLANCE.yml", "REPO-SHOWS.yml",
            "README.md", "REFACTOR.md"}
    moves = {}
    for fn in sorted(os.listdir("repo-shows")):
        p = f"repo-shows/{fn}"
        stem, ext = os.path.splitext(fn)
        if not os.path.isfile(p) or fn in keep or ext not in (".yml", ".md"):
            continue
        # md companion joins its yml's dir; md-only seeds get their own dir
        if ext == ".md" and os.path.isfile(f"repo-shows/{stem}.yml"):
            moves[p] = f"repo-shows/{stem}/{fn}"
        elif ext == ".md" and stem == "unnatural-selection-panel-invites":
            moves[p] = f"repo-shows/unnatural-selection/{fn}"
        else:
            moves[p] = f"repo-shows/{stem}/{fn}"
    return moves


def phase1_moves_from_dest():
    """Reconstruct the phase1 table from bits/ + process/tracks/ contents."""
    moves = {}
    prefix2bucket = {"gag": "gags", "theme": "themes",
                     "tradition": "traditions", "swag": "swag"}
    if os.path.isdir("bits"):
        for d in os.listdir("bits"):
            sub = f"bits/{d}"
            if not os.path.isdir(sub):
                continue
            prefix = d.split("-", 1)[0]
            stem = d.split("-", 1)[1]
            bucket = prefix2bucket[prefix]
            for fn in os.listdir(sub):
                ext = os.path.splitext(fn)[1]
                moves[f"{IDEAS}/{bucket}/{stem}{ext}"] = f"{sub}/{fn}"
    d = "process/tracks/educators-track"
    if os.path.isdir(d):
        for fn in os.listdir(d):
            if fn != "README.md":
                moves[f"{IDEAS}/themes/{fn}"] = f"{d}/{fn}"
    return moves


PHASES = {
    "phase1": (phase1_moves, phase1_aliases),
    "resweep1": (phase1_moves_from_dest, phase1_aliases),
    "phase2": (phase2_moves, phase2_aliases),
    "phase3": (phase3_moves, phase3_aliases),
    "phase4": (phase4_moves, lambda: {}),
}

STRAGGLER_PATTERNS = ["repo-shows/ideas/", "flipbook/shows/"]


def resolve(token, base_dir):
    """Resolve a token against a base dir; repo-root-relative normalized path."""
    p = os.path.normpath(os.path.join(base_dir, token))
    if p.startswith(".."):
        return None
    return p.replace(os.sep, "/")


def rewrite_file(path, moves, all_moves, dry):
    """all_moves includes aliases; moves maps every old path to its new path.
    base for token resolution = the file's OLD location if it moved."""
    old_self = next((o for o, n in all_moves.items() if n == path), None)
    base_dir = os.path.dirname(old_self if old_self else path)
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read()
    except (UnicodeDecodeError, FileNotFoundError):
        return False
    changed = []

    def sub(m):
        token = m.group(0)
        core = token.rstrip(".")
        trail = token[len(core):]
        frag = ""
        if "#" in core:
            core, frag = core.split("#", 1)
            frag = "#" + frag
        # skip URLs, but rewrite repo paths embedded in GitHub blob/tree URLs
        start = m.start()
        pre = text[max(0, start - 8):start]
        if "://" in pre or pre.endswith(("http:", "https:")):
            return token
        new_target = None
        anchored = None
        r = resolve(core, base_dir)
        if r in moves:
            new_target, anchored = moves[r], False
        elif core in moves:  # root-anchored mention
            new_target, anchored = moves[core], True
        elif (old_self and r and PATHISH_RE.match(core)
              and os.path.exists(os.path.join(ROOT, r))):
            # moved file referencing an UNMOVED path: re-relativize for depth
            new_target, anchored = r, False
        else:
            # pre-existing broken relative link (wrong ../ count) whose
            # dots-stripped remainder matches a moved path: repair it
            stripped = re.sub(r"^(?:\.\./)+", "", core)
            if stripped != core and stripped in moves:
                new_target, anchored = moves[stripped], False
        if new_target is None:
            return token
        if anchored:
            out = new_target
        else:
            out = os.path.relpath(new_target, os.path.dirname(path)).replace(os.sep, "/")
        if core.endswith("/") and not out.endswith("/"):
            out += "/"
        changed.append((core, out))
        return out + frag + trail

    new_text = TOKEN_RE.sub(sub, text)
    # GitHub URL path segments
    for old, new in moves.items():
        for kind in ("blob/main/", "tree/main/", "blob/master/", "tree/master/"):
            if kind + old in new_text:
                new_text = new_text.replace(kind + old, kind + new)
                changed.append((kind + old, kind + new))
    if new_text != text and not dry:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_text)
    return bool(changed)


def report():
    hits = []
    for f in tracked_files():
        try:
            with open(f, encoding="utf-8") as fh:
                for i, line in enumerate(fh, 1):
                    for pat in STRAGGLER_PATTERNS:
                        if pat in line:
                            hits.append(f"{f}:{i}: {line.strip()[:120]}")
                            break
        except UnicodeDecodeError:
            continue
    return hits


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cmd = sys.argv[1]
    dry = "--dry-run" in sys.argv
    if cmd == "report":
        hits = report()
        print("\n".join(hits) or "clean")
        print(f"{len(hits)} straggler line(s)")
        return
    moves_fn, alias_fn = PHASES[cmd]
    moves = moves_fn()
    aliases = alias_fn()
    if not moves:
        sys.exit(f"{cmd}: nothing to move (already done?)")
    print(f"{cmd}: {len(moves)} moves, {len(aliases)} aliases")
    for old, new in moves.items():
        if os.path.exists(new) and not os.path.exists(old):
            continue  # already moved (resweep mode)
        print(f"  {old} -> {new}")
        if not dry:
            os.makedirs(os.path.dirname(new), exist_ok=True)
            sh("git", "mv", old, new)
    all_ref = dict(moves)
    all_ref.update(aliases)
    n = 0
    for f in tracked_files():
        if rewrite_file(f, all_ref, dict(moves, **aliases), dry):
            n += 1
    print(f"rewrote {n} file(s){' (dry run)' if dry else ''}")


if __name__ == "__main__":
    main()
