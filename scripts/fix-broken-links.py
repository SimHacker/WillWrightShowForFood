#!/usr/bin/env python3
"""Find and fix broken relative markdown links in tracked files.

Usage (from repo root):
    python3 scripts/fix-broken-links.py --audit          # count only
    python3 scripts/fix-broken-links.py --fix           # apply fixes
    python3 scripts/fix-broken-links.py --fix --report   # show what changed
"""

import argparse
import os
import re
import subprocess
import posixpath
from collections import defaultdict

ROOT = os.getcwd()
LINK = re.compile(r"(\]\()([^)\s]+?)(#[^)\s]*)?(\))")

# Global substring replacements (longest first). Safe when unambiguous.
GLOBAL = [
    ("characters/INDEX.md", "characters/INDEX.yml"),
    ("gosling-hobees-lunch-original.png", "gosling-hobees-lunch.png"),
    ("characters/steve-wozniak/media/", "../steve-wozniak/media/"),
    ("../body-electric-bounce-vr-stack.md", "../../don-hopkins/body-electric-bounce-vr-stack.md"),
    ("../body-electric-1999-jaron-email.md", "../../don-hopkins/body-electric-1999-jaron-email.md"),
    ("../../../REPO-SHOWS.yml", "../../../repo-shows/REPO-SHOWS.yml"),
    ("../../../../../repo-shows/walter-bender-olpc/SHOW.yml", "../../../../repo-shows/walter-bender-olpc/SHOW.yml"),
    ("../../../phil-salvador-simrefinery/SHOW.yml", "../../../../repo-shows/phil-salvador-simrefinery/SHOW.yml"),
    ("../../../pie-menus-retrospective/README.md", "../../../../repo-shows/pie-menus-retrospective/pie-menus-retrospective.yml"),
    ("(HIGHLIGHTS.md)", "(sims-bibliography-HIGHLIGHTS.md)"),
    ("(PROJECTION.yml)", "(sims-bibliography-PROJECTION.yml)"),
    ("(maxis-people.yml)", "(sims-series-maxis-people.yml)"),
    ("(inclusivity-paper-draft.md)", "(sims-series-inclusivity-paper-draft.md)"),
    ("../../bits/gag-curiosity-cow-cube/", "../../../bits/gag-curiosity-cow-cube/"),
    ("../../bits/gag-how-to-deconstruct-the-cube/", "../../../bits/gag-how-to-deconstruct-the-cube/"),
    ("../../bits/gag-simfaux-repo-show-prototype/", "../../../bits/gag-simfaux-repo-show-prototype/"),
    ("repo-shows/snap-logo-brian-jens.yml", "repo-shows/snap-logo-brian-jens/SHOW.yml"),
    ("../../../../drew-carey/SHOW.yml", "../../../../repo-shows/drew-carey/SHOW.yml"),
    ("process/SimHacker/", "https://github.com/SimHacker/"),
    ("../repo-shows/brad-myers/", "../repo-shows/brad-myers-garnet-vpl/"),
    ("../../repo-shows/brad-myers/", "../../repo-shows/brad-myers-garnet-vpl/"),
    ("repo-shows/brad-myers/README.md", "repo-shows/brad-myers-garnet-vpl/brad-myers-garnet-vpl.yml"),
    ("../repo-shows/brian-harvey/", "../characters/brian-harvey/"),
    ("../repo-shows/jens-monig/", "../characters/jens-monig/"),
    ("../repo-shows/ken-perlin/", "../characters/ken-perlin/"),
    ("../repo-shows/steve-wozniak/", "../characters/steve-wozniak/"),
    ("../repo-shows/richard-bartle/", "../characters/richard-bartle/"),
    ("../repo-shows/arthur-van-hoff/README.md", "../characters/arthur-van-hoff/README.md"),
    ("../repo-shows/eric-hedman/README.md", "../characters/eric-hedman/README.md"),
    ("../repo-shows/matthew-sibigtroth/README.md", "../characters/matthew-sibigtroth/README.md"),
    ("../repo-shows/paul-debevec/README.md", "../characters/paul-debevec/README.md"),
    ("../repo-shows/phil-salvador-simrefinery/README.md", "../repo-shows/phil-salvador-simrefinery/SHOW.yml"),
    ("../../repo-shows/ken-perlin/README.md", "../../characters/ken-perlin/README.md"),
    ("../../repo-shows/steve-wozniak/README.md", "../../characters/steve-wozniak/README.md"),
    ("../../repo-shows/richard-bartle/README.md", "../../characters/richard-bartle/README.md"),
    ("repo-shows/scott-adams/", "characters/scott-adams/"),
    ("../repo-shows/game-show-wigcercize/", "../repo-shows/INDEX.yml"),
    ("../repo-shows/skill-creation/", "../skills/README.md"),
    ("../../repo-shows/flipbook/", "../../repo-shows/flipbook/"),  # dir link; do not append README.md
    ("../don-hopkins/people/INDEX.yml", "../../don-hopkins/people/INDEX.yml"),
    ("../../characters/david-ungar/slots-all-the-way-down.md", "../../characters/don-hopkins/import-self-from-self.md"),
    ("../bill-buxton/", "../bill-buxton/README.md"),
    ("../ultimate-machine/README.md", "../robots/ultimate-machine/README.md"),
    ("../../will-wright/correspondence.md", "../../will-wright/correspondence.yml"),
    ("../process/invitation.md", "../process/invitation-email.md"),
    ("../process/gary-drescher/made-up-minds.md", "../characters/gary-drescher/made-up-minds.md"),
    ("../../repo-shows/game-bridge-mind-mirror.yml", "../../repo-shows/INDEX.yml"),
    ("../../repo-shows/news-postscript-window-system.yml", "../../repo-shows/INDEX.yml"),
    ("../../repo-shows/pie-menus-retrospective.yml", "../../repo-shows/pie-menus-retrospective/pie-menus-retrospective.yml"),
    ("README.mdREADME.md", "README.md"),
    ("../../will-wright/sims-team-steering-committee-playthrough/", "../../repo-shows/will-wright-premiere/sims-team-steering-committee-playthrough/"),
    ("../../../heather-and-steve-alvey/", "../../../repo-shows/heather-and-steve-alvey/"),
    ("../../../repo-shows/REPO-SHOWS.yml", "../../../../repo-shows/REPO-SHOWS.yml"),
    ("../bits/gag-curiosity-cow-cube/", "../../bits/gag-curiosity-cow-cube/"),
    ("../bits/gag-how-to-deconstruct-the-cube/", "../../bits/gag-how-to-deconstruct-the-cube/"),
    ("../bits/gag-simfaux-repo-show-prototype/gag-simfaux-repo-show-prototype.yml/gag-simfaux-repo-show-prototype.yml", "../bits/gag-simfaux-repo-show-prototype/gag-simfaux-repo-show-prototype.yml"),
    ("repo-shows/news-postscript-window-system.yml", "repo-shows/REPO-SHOWS.yml#news-postscript-window-system.yml"),
    ("../news-postscript-window-system.yml", "../REPO-SHOWS.yml#news-postscript-window-system.yml"),
    ("process/design-in-public.yml", "process/vision-and-ambition.yml"),
    ("process/RULES-AND-ETHICS.md", "https://github.com/SimHacker/DonHopkins/blob/main/projects/willwrightshowforfood/strategy/RULES-AND-ETHICS.md"),
    ("process/invitation.md", "process/invitation-email.md"),
    ("process/gary-drescher/made-up-minds.md", "characters/gary-drescher/made-up-minds.md"),
    ("repo-shows/scott-adams/IDEAS.yml", "characters/scott-adams/ideas.md"),
    ("repo-shows/scott-adams/ideas.md", "characters/scott-adams/ideas.md"),
    ("repo-shows/scott-adams/invitation.md", "characters/scott-adams/invitation.md"),
    ("repo-shows/will-wright-premiere/invitation.md", "repo-shows/will-wright-premiere/README.md"),
]

GITHUB_CROSS = [
    ("../DonHopkins/", "https://github.com/SimHacker/DonHopkins/blob/main/"),
    ("../MicropolisCore/", "https://github.com/SimHacker/MicropolisCore/blob/main/"),
    ("../micropolis/", "https://github.com/SimHacker/micropolis/blob/main/"),
    ("../catalogs/soul-city/", "https://github.com/SimHacker/WillWrightShowForFood/tree/main/catalogs/soul-city/"),
    ("../drew-carey/", "https://github.com/SimHacker/WillWrightShowForFood/tree/main/repo-shows/drew-carey/"),
]


def tracked():
    files = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.splitlines()
    return set(files), [f for f in files if f.endswith(".md")]


def resolve(src, tgt, files, dirs):
    if "://" in tgt or tgt.startswith(("mailto:", "#", "<")):
        return tgt, True
    base = posixpath.dirname(src)
    frag = ""
    core = tgt
    if "#" in core:
        core, frag = core.split("#", 1)
        frag = "#" + frag
    p = posixpath.normpath(posixpath.join(base, core)).rstrip("/")
    ok = p in files or p in dirs
    return p, ok


def relpath(target, src):
    return posixpath.relpath(target, posixpath.dirname(src)).replace(os.sep, "/")


def depth_fix(resolved, src, files, dirs):
    """Try prefixing repo path or trimming extra ../ from over-deep relatives."""
    if resolved in files or resolved in dirs:
        return None

    # heather-and-steve-alvey/README.md → repo-shows/heather-and-steve-alvey/README.md
    for prefix in ("repo-shows/", "characters/", "bits/", "process/", "catalogs/"):
        cand = prefix + resolved
        if cand in files or cand.rstrip("/") in dirs:
            return relpath(cand, src)

    # over-deep: ../repo-shows/... → repo-shows/...
    trimmed = resolved
    for _ in range(5):
        if trimmed.startswith("../"):
            trimmed = trimmed[3:]
            if trimmed in files or trimmed.rstrip("/") in dirs:
                return relpath(trimmed, src)
        else:
            break

    # under-deep from will-wright/sims-team-steering → premiere show
    m = re.match(r"will-wright/sims-team-steering-committee-playthrough/?$", resolved)
    if m:
        cand = "repo-shows/will-wright-premiere/sims-team-steering-committee-playthrough/SHOW.yml"
        if cand in files:
            return relpath(cand, src)

    return None


def art_net_fix(tgt, resolved, src, files):
    """Missing art.net GIFs: keep remote preview URL."""
    m = re.match(
        r"characters/will-wright/sources/art-net-simcity-archive/images/(h\d+|x\d+|k\d+)\.(gif|jpeg)$",
        resolved,
    )
    if not m:
        return None
    name = m.group(0).split("/")[-1]
    base = name.rsplit(".", 1)[0]
    ext = "gif" if name.endswith(".gif") else "jpeg"
    if ext == "gif" and base.startswith(("h", "x")):
        return f"http://www.art.net/~hopkins/Don/simcity/previews/{name}"
    if ext == "jpeg" and base.startswith("k"):
        return f"http://www.art.net/~hopkins/Don/simcity/{name}"
    return None


def moollm_skill_fix(resolved):
    m = re.match(r"process/SimHacker/moollm/skills/([^/]+)/?$", resolved)
    if m:
        return f"https://github.com/SimHacker/moollm/tree/main/skills/{m.group(1)}"
    if resolved == "process/SimHacker/MicropolisCore":
        return "https://github.com/SimHacker/MicropolisCore"
    return None


def suggest(resolved, src, files, dirs):
    """Return fixed target string (relative to src) or None."""
    core = resolved.split("#")[0].rstrip("/")
    frag = resolved[len(core):]

    if core in files or core in dirs:
        return None

    fix = depth_fix(core, src, files, dirs)
    if fix:
        return fix + frag

    # repo-shows/SLUG.yml -> dir seed or SHOW.yml
    m = re.match(r"repo-shows/([^/]+)\.yml$", core)
    if m:
        slug = m.group(1)
        for cand in (f"repo-shows/{slug}/{slug}.yml", f"repo-shows/{slug}/SHOW.yml"):
            if cand in files:
                return relpath(cand, src) + frag

    # repo-shows/SLUG/README.md or repo-shows/SLUG
    m = re.match(r"repo-shows/([^/]+)(?:/README\.md)?$", core)
    if m:
        slug = m.group(1)
        for cand in (
            f"repo-shows/{slug}/SHOW.yml",
            f"repo-shows/{slug}/{slug}.yml",
            f"repo-shows/{slug}/README.md",
            f"characters/{slug}/README.md",
        ):
            if cand in files or cand.rstrip("/") in dirs:
                return relpath(cand, src) + frag

    # premiere audience stubs without README → CHARACTER.yml
    m = re.match(r"repo-shows/will-wright-premiere/audience/([^/]+)/README\.md$", core)
    if m:
        cand = f"repo-shows/will-wright-premiere/audience/{m.group(1)}/CHARACTER.yml"
        if cand in files:
            return relpath(cand, src) + frag

    # characters/foo without README suffix
    m = re.match(r"characters/([^/]+)$", core)
    if m and f"characters/{m.group(1)}/README.md" in files:
        return relpath(f"characters/{m.group(1)}/README.md", src) + frag

    return None


def audit(files, md_files):
    broken = defaultdict(list)
    total = 0
    dirs = set()
    for f in files:
        p = posixpath.dirname(f)
        while p:
            dirs.add(p)
            p = posixpath.dirname(p)
    for f in md_files:
        try:
            t = open(f, encoding="utf-8").read()
        except Exception:
            continue
        for m in LINK.finditer(t):
            tgt = m.group(2) + (m.group(3) or "")
            if "://" in tgt or tgt.startswith(("#", "mailto:")):
                continue
            total += 1
            r, ok = resolve(f, tgt, files, dirs)
            if not ok:
                broken[r].append((f, tgt))
    return broken, total


def apply_global(text, path):
    if path == "characters/will-wright/media/sims-bibliography-HIGHLIGHTS.md":
        text = text.replace("(INDEX.yml)", "(sims-bibliography-README.md)")
    for old, new in sorted(GLOBAL, key=lambda x: -len(x[0])):
        text = text.replace(old, new)
    for old, new in GITHUB_CROSS:
        text = text.replace(old, new)
    return text


def fix_file(path, files, dirs, report):
    t = open(path, encoding="utf-8").read()
    orig = apply_global(t, path)

    def repl(m):
        prefix, tgt, frag, suffix = m.group(1), m.group(2), m.group(3) or "", m.group(4)
        full = tgt + frag
        if "://" in full or full.startswith(("#", "mailto:")):
            return m.group(0)
        r, ok = resolve(path, full, files, dirs)
        if ok:
            return m.group(0)
        core = r.split("#")[0]
        fix = suggest(r, path, files, dirs)
        if not fix:
            fix = art_net_fix(tgt, core, path, files)
        if not fix:
            fix = moollm_skill_fix(core)
        if fix:
            if frag and "#" in full and fix.startswith("http"):
                pass  # external URLs ignore fragment from bad local path
            elif frag and "#" in full and not fix.endswith(frag):
                fix += frag if frag.startswith("#") else ""
            report.append((path, full, fix))
            return f"{prefix}{fix}{suffix}"
        return m.group(0)

    new = LINK.sub(repl, orig)
    return new, new != t


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audit", action="store_true")
    ap.add_argument("--fix", action="store_true")
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()
    files, md_files = tracked()
    dirs = set()
    for f in files:
        p = posixpath.dirname(f)
        while p:
            dirs.add(p)
            p = posixpath.dirname(p)

    broken, total = audit(files, md_files)
    print(f"broken: {len(broken)} unique targets, {sum(len(v) for v in broken.values())} instances / {total} relative links")

    if args.audit and not args.fix:
        for r in sorted(broken)[:40]:
            print(f"  {r} ({len(broken[r])})")
        return

    if args.fix:
        report = []
        changed = 0
        for f in md_files:
            new, ch = fix_file(f, files, dirs, report)
            if ch:
                open(f, "w", encoding="utf-8").write(new)
                changed += 1
        print(f"changed {changed} files, {len(report)} link fixes")
        if args.report:
            for path, old, new in report[:60]:
                print(f"  {path}: {old} -> {new}")
            if len(report) > 60:
                print(f"  ... +{len(report)-60}")
        broken2, _ = audit(files, md_files)
        print(f"after: {len(broken2)} unique broken targets, {sum(len(v) for v in broken2.values())} instances")


if __name__ == "__main__":
    main()
