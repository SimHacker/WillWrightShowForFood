#!/usr/bin/env python3
"""Generate the CS547 archive girder + facade from the raw catalog.

Inputs:
  cs547-catalog.psv  -- pipe-delimited raw catalog, one row per recording:
                  speaker | org | title | session | date | format | box
                  (faithful transcription of the Stanford SC1217 spreadsheet
                   supplied by Don Hopkins; pipe-delimited so titles may keep
                   their commas, colons, and quotes verbatim).

Outputs:
  cs547-catalog.tsv  -- faithful TAB-separated mirror (same rows, real tabs).
  cs547-archive.yml  -- machine-readable catalog: VHS/DVD inventory rows collapsed to
                  one entry per talk (speaker+title+date), enriched with known
                  SearchWorks scan ids, YouTube uploads, and WWSFF character flags.
  cs547-ARCHIVE.md   -- human-readable facade grouped by year.

Run:  python3 cs547-build-archive.py
"""
import csv
import os
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
PSV = os.path.join(HERE, "cs547-catalog.psv")
TSV = os.path.join(HERE, "cs547-catalog.tsv")
YML = os.path.join(HERE, "cs547-archive.yml")
MD = os.path.join(HERE, "cs547-ARCHIVE.md")

# --- known online scans (Stanford SearchWorks view ids), from Don Hopkins's
# --- 2024 Hacker News inventory (news.ycombinator.com/item?id=39252103).
# id -> (speaker substring, title substring) used to attach to a talk.
SEARCHWORKS = {
    "yj113jt5999": ("Will Wright", "Interfacing to Microworlds"),
    "bz890ng3047": ("Gosling", "Bringing Behavior"),
    "jm095fy2355": ("Carr", "Mobile Pen-based"),
    "jh333ht2903": ("Nass", "Computers Are Social Actors"),
    "gw943dj4628": ("Goldberg", "Unistrokes"),
    "kk938rh3332": ("Minsky", "Look and Feel"),
    "gs214qy7233": ("Saddler", "Making It Macintosh"),
    "rm437wv9779": ("Mountford", "Design of New Media"),
    "fk686sy4072": ("Kahn", "Toon Talk"),
    "ss855db5288": ("Bier", "Magic Lens"),
    "pv655pr7635": ("Selker", "Proactive and Reactive"),
    "nf237zt2615": ("Tognazzini", "Computing in the Year 2004"),
    "mp885xf4366": ("Hertzfeld", "Magic Cap"),
    "dd753rg7554": ("Norman", "Academic Discovers"),
    "vj346zm2128": ("Nielsen", "Heuristic Evaluation"),
}

YOUTUBE = {
    ("Will Wright", "Interfacing to Microworlds"): "https://www.youtube.com/watch?v=nsxoZXaYJSk",
    ("Gosling", "Bringing Behavior"): "https://www.youtube.com/watch?v=dgrNeyuwA8k",
}

# --- WWSFF characters who appear in the catalog. Ordered; first match wins.
WWSFF = [
    ("Will Wright", "will-wright"),
    ("Gosling", "james-gosling"),
    ("Alan Kay", "alan-kay"),
    ("Ted Selker", "ted-selker"),
    ("Scott Kim", "scott-kim"),
    ("Ken Kahn", "ken-kahn"),
    ("Ben Shneiderman", "ben-shneiderman"),
    ("Margaret Min", "margaret-minsky"),   # Minsky / "Minksy" typo
    ("Brad Myers", "brad-myers"),
    ("Ken Perlin", "ken-perlin"),
    ("Terry Winograd", "terry-winograd"),
    ("Terry Wniograd", "terry-winograd"),  # source typo
]


def norm_date(d):
    d = d.strip()
    if not d or d.lower() in ("n/a", ""):
        return ""
    parts = d.split("-")
    if len(parts) != 3:
        return d
    y, m, day = parts
    try:
        return "%04d-%02d-%02d" % (int(y), int(m), int(day))
    except ValueError:
        return d


def clean_session(s):
    s = s.strip()
    if s in ("(n/a)", "n/a", ""):
        return ""
    # strip outer parens, keep e.g. "CS547 Winograd 6"
    return s.strip("()").strip()


def read_rows():
    rows = []
    with open(PSV, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line or line.startswith("#"):
                continue
            parts = line.split("|")
            if len(parts) < 7:
                # pad short rows
                parts += [""] * (7 - len(parts))
            speaker, org, title, session, date, fmt, box = (p.strip() for p in parts[:7])
            rows.append({
                "speaker": speaker, "org": org, "title": title,
                "session": session, "date": date, "format": fmt, "box": box,
            })
    return rows


def write_tsv(rows):
    with open(TSV, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter="\t")
        w.writerow(["speaker", "org", "title", "session", "date", "format", "box"])
        for r in rows:
            w.writerow([r["speaker"], r["org"], r["title"], r["session"],
                        r["date"], r["format"], r["box"]])


def dedupe(rows):
    """Collapse VHS/DVD inventory rows to one talk per (speaker,title,date)."""
    talks = OrderedDict()
    for r in rows:
        key = (r["speaker"], r["title"], norm_date(r["date"]))
        if key not in talks:
            talks[key] = {
                "speaker": r["speaker"], "org": r["org"], "title": r["title"],
                "session": clean_session(r["session"]),
                "date": norm_date(r["date"]),
                "boxes": set(), "formats": set(),
            }
        t = talks[key]
        if not t["session"]:
            t["session"] = clean_session(r["session"])
        if not t["org"] and r["org"]:
            t["org"] = r["org"]
        if r["box"]:
            t["boxes"].add(r["box"])
        if r["format"]:
            t["formats"].add(r["format"].upper())
    return list(talks.values())


def match_searchworks(t):
    for sid, (spk, ttl) in SEARCHWORKS.items():
        if spk in t["speaker"] and ttl.lower() in t["title"].lower():
            return sid
    return None


def match_youtube(t):
    for (spk, ttl), url in YOUTUBE.items():
        if spk in t["speaker"] and ttl.lower() in t["title"].lower():
            return url
    return None


def match_wwsff(t):
    for sub, slug in WWSFF:
        if sub in t["speaker"]:
            return slug
    return None


def yq(s):
    """Quote a scalar for YAML."""
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    return '"%s"' % s


def boxes_str(boxes):
    def num(b):
        try:
            return int(b.replace("Box", "").strip())
        except ValueError:
            return 999
    return ", ".join(sorted(boxes, key=num))


def write_yaml(talks):
    talks_sorted = sorted(talks, key=lambda t: (t["date"] or "9999", t["speaker"]))
    online = [t for t in talks_sorted if match_searchworks(t)]
    wwsff = [t for t in talks_sorted if match_wwsff(t)]
    with open(YML, "w", encoding="utf-8") as f:
        f.write("# CS547 ARCHIVE — Stanford HCI Seminar videorecording catalog (GENERATED)\n")
        f.write("# Source of truth: cs547-catalog.psv (raw mirror: cs547-catalog.tsv). Regenerate: python3 cs547-build-archive.py\n")
        f.write("# Do not hand-edit; edit cs547-catalog.psv + the maps in cs547-build-archive.py instead.\n\n")
        f.write("meta:\n")
        f.write("  collection: \"Stanford University, Computer Science Department, HCI Group, CS547 seminar videorecordings, 1990-2012\"\n")
        f.write("  collection_id: SC1217\n")
        f.write("  host: Terry Winograd\n")
        f.write("  finding_aid: \"https://oac.cdlib.org/findaid/ark:/13030/c82b926h\"\n")
        f.write("  searchworks_collection: \"https://searchworks.stanford.edu/catalog?f%5Bcollection%5D%5B%5D=a10637698\"\n")
        f.write("  provenance: \"Catalog supplied by Don Hopkins; SearchWorks scan ids + YouTube uploads cross-referenced from his 2024 Hacker News inventory (item 39252103).\"\n")
        f.write("  rights: \"Stanford Special Collections (SC1217). Research/educational use; reproduction requires written permission. Catalog metadata only is mirrored here.\"\n")
        f.write("  counts:\n")
        f.write("    talks: %d\n" % len(talks_sorted))
        f.write("    online_scans_known: %d\n" % len(online))
        f.write("    wwsff_characters_in_catalog: %d\n" % len(wwsff))
        f.write("  online_scans_note: \"FLOOR, not ceiling: only the scans cross-referenced from Don's 2024 HN post are marked. Many more CS547 talks are likely already scanned (or easily scannable) on SearchWorks — to be dug up and catalogued later, after contacting Terry Winograd.\"\n")
        f.write("\n")
        f.write("# Each talk: VHS/DVD inventory rows collapsed to one entry per (speaker, title, date).\n")
        f.write("talks:\n")
        for t in talks_sorted:
            f.write("  - speaker: %s\n" % yq(t["speaker"]))
            if t["org"]:
                f.write("    org: %s\n" % yq(t["org"]))
            f.write("    title: %s\n" % yq(t["title"]))
            if t["date"]:
                f.write("    date: %s\n" % yq(t["date"]))
            if t["session"]:
                f.write("    cs547_session: %s\n" % yq(t["session"]))
            if t["boxes"]:
                f.write("    boxes: %s\n" % yq(boxes_str(t["boxes"])))
            if t["formats"]:
                f.write("    formats: [%s]\n" % ", ".join(sorted(t["formats"])))
            sid = match_searchworks(t)
            if sid:
                f.write("    searchworks: %s\n" % yq(sid))
                f.write("    searchworks_url: %s\n" % yq("https://searchworks.stanford.edu/view/" + sid))
            yt = match_youtube(t)
            if yt:
                f.write("    youtube: %s\n" % yq(yt))
            slug = match_wwsff(t)
            if slug:
                f.write("    wwsff_character: %s\n" % yq(slug))


def write_md(talks):
    talks_sorted = sorted(talks, key=lambda t: (t["date"] or "9999", t["speaker"]))
    by_year = OrderedDict()
    for t in talks_sorted:
        yr = t["date"][:4] if t["date"] else "undated"
        by_year.setdefault(yr, []).append(t)
    online = [t for t in talks_sorted if match_searchworks(t)]
    wwsff = [t for t in talks_sorted if match_wwsff(t)]
    with open(MD, "w", encoding="utf-8") as f:
        f.write("# CS547 Archive — The Treasure Trove\n\n")
        f.write("> GENERATED from `cs547-archive.yml` / `cs547-catalog.psv` — do not hand-edit. "
                "Run `python3 cs547-build-archive.py`.\n\n")
        f.write("**Stanford University, CS Dept., HCI Group, CS547 seminar videorecordings, 1990–2012** "
                "(collection [SC1217](https://oac.cdlib.org/findaid/ark:/13030/c82b926h)). "
                "Terry Winograd's open, recorded, one-guest-a-week public seminar — the direct forebear of the Repo Show.\n\n")
        f.write("- **%d talks** catalogued (VHS/DVD inventory rows collapsed to one per talk)\n" % len(talks_sorted))
        f.write("- **%d+** have a known online scan (Stanford SearchWorks) — a *floor*, not a ceiling: only the ones cross-referenced from Don's 2024 HN post. Many more are likely already scanned; to be dug up after contacting Terry.\n" % len(online))
        f.write("- **%d** were given by people who are WillWrightShowForFood characters\n\n" % len(wwsff))
        f.write("Raw mirror: [`cs547-catalog.tsv`](cs547-catalog.tsv) · machine girder: [`cs547-archive.yml`](cs547-archive.yml) · "
                "finding aid: [OAC](https://oac.cdlib.org/findaid/ark:/13030/c82b926h) · "
                "[SearchWorks collection](https://searchworks.stanford.edu/catalog?f%5Bcollection%5D%5B%5D=a10637698)\n\n")

        f.write("## WWSFF guests in the catalog\n\n")
        seen = OrderedDict()
        for t in wwsff:
            seen.setdefault(match_wwsff(t), []).append(t)
        for slug, ts in seen.items():
            f.write("- **[%s](../../%s/)** — %s\n" % (
                slug, slug,
                "; ".join("%s (%s)" % (x["title"], x["date"] or "?") for x in ts)))
        f.write("\n")

        f.write("## Online scans (watchable now)\n\n")
        f.write("| Date | Speaker | Title | Watch |\n|---|---|---|---|\n")
        for t in online:
            sid = match_searchworks(t)
            link = "[SearchWorks](https://searchworks.stanford.edu/view/%s)" % sid
            yt = match_youtube(t)
            if yt:
                link += " · [YouTube](%s)" % yt
            f.write("| %s | %s | %s | %s |\n" % (
                t["date"] or "?", t["speaker"], t["title"].replace("|", "/"), link))
        f.write("\n")

        f.write("## Full catalog by year\n\n")
        for yr, ts in by_year.items():
            f.write("### %s\n\n" % yr)
            for t in ts:
                sess = " · _%s_" % t["session"] if t["session"] else ""
                star = " ⭐" if match_wwsff(t) else ""
                scan = ""
                sid = match_searchworks(t)
                if sid:
                    scan = " — [scan](https://searchworks.stanford.edu/view/%s)" % sid
                f.write("- **%s** — %s — %s%s%s%s\n" % (
                    t["date"] or "?", t["speaker"], t["title"].replace("|", "/"),
                    sess, scan, star))
            f.write("\n")


def main():
    rows = read_rows()
    write_tsv(rows)
    talks = dedupe(rows)
    write_yaml(talks)
    write_md(talks)
    print("rows: %d  talks: %d" % (len(rows), len(talks)))
    print("wrote: cs547-catalog.tsv, cs547-archive.yml, cs547-ARCHIVE.md")


if __name__ == "__main__":
    main()
