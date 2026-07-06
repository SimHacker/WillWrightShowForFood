#!/usr/bin/env python3
"""Generate batch-6 YAML sidecars for legacy Don Hopkins media PNGs."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

ROOM_META = {
    "sims-transmogrifier": {
        "era": "2000-2002",
        "what": "The Sims 1 Transmogrifier mod — clone/export BMP sprites, Green Flamingo tutorial, SimProv Theatre wedding pack",
        "gags": ["../../../repo-shows/ideas/gags/transmogrifier-mona-lisa-pushpins.yml"],
        "see_also": [
            "../../../will-wright/media/sims-series-transmogrifier-story.md",
            "../pie-menus/INDEX.yml",
        ],
    },
    "pantomime": {
        "era": "~2014 (Oculus SDK demos); copyleft envelope 1984",
        "what": "Pantomime Corporation AR/VR — Bug Farm squish compulsion, Too many butterflies!, Copyleft envelope to RMS",
        "gags": [
            "../../../repo-shows/ideas/gags/pantomime-gallery.yml",
            "../../../repo-shows/ideas/gags/curiosity-cow-cube.yml",
        ],
        "see_also": ["INDEX.yml", "bug-farm.yml"],
    },
    "simprov-exploratorium": {
        "era": "early 1990s",
        "what": "HyperLook/NeWS demo at Exploratorium SF — SPARCstation 2 video stills (not Sims SimProv)",
        "gags": ["../../../repo-shows/ideas/gags/simprov-exploratorium-sparc.yml"],
        "see_also": ["../../hyperlook-news-postscript-simcity.md", "../pie-menus/INDEX.yml"],
    },
    "cellular-automata-tiles": {
        "era": "~2010-2011",
        "what": "iPad CA sandbox — SimCity tiles as cells; worms2/harble rules; hardware misreads",
        "gags": ["../../../repo-shows/ideas/gags/cellular-automata-simcity-tiles.yml"],
        "see_also": ["../micropolis-gallery/INDEX.yml"],
    },
    "micropolis-gallery": {
        "era": "1991 HyperLook through 2010s Facebook",
        "what": "Open-source Micropolis arc — HyperLook, OLPC, PyGTK, OpenLaszlo nl-NL, PacBot",
        "gags": [
            "../../../repo-shows/ideas/gags/micropolis-gallery.yml",
            "../../../repo-shows/ideas/gags/pacbot-eats-traffic.yml",
        ],
        "see_also": ["micropolis-gallery.yml"],
    },
    "rolf": {
        "era": "TomTom-era Amsterdam",
        "what": "Rolf Pixley workshop junk drawer — space keychains, curios, MIND=BLOWN face-puppet shots",
        "gags": ["../../../repo-shows/ideas/gags/rolf-junk-auction.yml"],
        "see_also": ["INDEX.yml", "raving-bonkers.yml", "../robot-collection/INDEX.yml"],
    },
    "jaunt-vr": {
        "era": "2016-2017",
        "what": "Jaunt VR cinematic 360 camera hardware — Don contractor era",
        "gags": [],
        "see_also": ["INDEX.yml"],
    },
    "robot-collection": {
        "era": "~2007-2009",
        "what": "Van Leer antique press as outdoor robot-face street art — Modemstraat / Disketteweg",
        "gags": [
            "../../../repo-shows/ideas/gags/van-leer-robot-collection.yml",
            "../../../repo-shows/ideas/gags/turing-robot-olympics.yml",
        ],
        "see_also": ["INDEX.yml"],
    },
    "amsterdam-tile-art": {
        "era": "~2010-2011",
        "what": "Invader-style tile mosaics + Objectionable C dev selfies",
        "gags": [],
        "see_also": ["../storymaker-urban-safari/INDEX.yml"],
    },
    "turing-institute": {
        "era": "~1990-1992",
        "what": "Turing Institute Glasgow — HyperLook + SimCity; Donald Michie; Robot Olympics orbit",
        "gags": ["../../../repo-shows/ideas/gags/turing-robot-olympics.yml"],
        "see_also": ["first-robot-olympics.yml", "../simprov-exploratorium/INDEX.yml"],
    },
    "pie-menus": {
        "era": "CHI 1988 through Sims Online",
        "what": "Radial pie menu UI — NeWS SimCity, Fitts Law promo, Sims Online multiplayer",
        "gags": ["../../../repo-shows/ideas/gags/simprov-exploratorium-sparc.yml"],
        "see_also": ["pie-menus.yml", "../news-tnt/INDEX.yml"],
    },
    "sims-ctg-1999": {
        "era": "~2000–2001 post ship",
        "what": "Sims 1 Transmogrifier tutorial + SimProv (SimBabes/SimFreaks/SimSlice) — not Maxis 1999 dev",
        "gags": [],
        "see_also": ["../sims-transmogrifier/INDEX.yml", "../../../../catalogs/simprov/README.md"],
    },
    "storymaker-urban-safari": {
        "era": "2011",
        "what": "Stupid Fun Club StoryMaker Urban Safari — Layar geotagged scenes (2011)",
        "gags": [],
        "see_also": ["../amsterdam-coffeeshops-layar/INDEX.yml", "../storymaker/INDEX.yml"],
    },
    "amsterdam-coffeeshops-layar": {
        "era": "2009",
        "what": "Amsterdam coffeeshop database as Layar AR layer on iPhone — progenitor of Urban Safari",
        "gags": [],
        "see_also": ["../storymaker-urban-safari/INDEX.yml", "../../career/stupid-fun-club.yml"],
    },
    "news-tshirts": {
        "era": "late 1980s-1990s",
        "what": "Sun NeWS era t-shirt graphics — X11/NeWS Porsche pun, PostScript jokes",
        "gags": [],
        "see_also": ["../news-tnt/INDEX.yml", "../hyperties/INDEX.yml"],
    },
    "frys-electronics": {
        "era": "pre-closure SV retail",
        "what": "Fry's Electronics cowboy/gold-rush themed big-box archaeology",
        "gags": [],
        "see_also": ["INDEX.yml"],
    },
    "hyperties": {
        "era": "1980s-90s NeWS",
        "what": "HyperTIES hypermedia on NeWS — road pizza diagram, NeWS Tape browser",
        "gags": [],
        "see_also": ["INDEX.yml", "../../nemacs-hyperties-news-hubble.yml"],
    },
    "news-tnt": {
        "era": "Sun NeWS / OpenWindows",
        "what": "NeWS Toolkit demos — RasterRap, Pizza Tool, FrameMaker spelling checker",
        "gags": ["../../../repo-shows/ideas/gags/news-pizza-tool-fax.yml"],
        "see_also": ["INDEX.yml"],
    },
    "danielle-bunten-berry": {
        "era": "~2010",
        "what": "Dan Bunten (M.U.L.E.) portrait + party photo with Mark Weiser orbit",
        "gags": [],
        "see_also": ["INDEX.yml", "../olpc-gdc/INDEX.yml"],
    },
    "google-pacman": {
        "era": "2010",
        "what": "Google Pac-Man 30th anniversary doodle + Maps mashup on iPhone",
        "gags": [],
        "see_also": ["INDEX.yml"],
    },
    "sfc-emeryville": {
        "era": "~2013",
        "what": "Stupid Fun Club Emeryville workshop — logo + Will birthday",
        "gags": [],
        "see_also": ["INDEX.yml"],
    },
    "simfaux": {
        "era": "2006",
        "what": "SimFaux OpenLaszlo/Flash Fox News parody — Repo Show overlay prototype",
        "gags": ["../../../repo-shows/ideas/gags/simfaux-repo-show-prototype.yml"],
        "see_also": ["simfaux.yml"],
    },
    "storymaker": {
        "era": "~2010",
        "what": "StoryMaker SFC iPhone branching-story UI (Bar Karma progenitor)",
        "gags": [],
        "see_also": ["INDEX.yml"],
    },
    "brainwash-cafe": {
        "era": "pre-closure",
        "what": "Brainwash Cafe/Laundromat Folsom St SF — HOT/WARM/COLD brain logo",
        "gags": [],
        "see_also": ["INDEX.yml"],
    },
    "connectedtv-palm": {
        "era": "2001",
        "what": "ConnectedTV program guide on Palm m505",
        "gags": [],
        "see_also": ["INDEX.yml"],
    },
    "olpc-gdc": {
        "era": "GDC 2010",
        "what": "OLPC booth — Don staffing XO laptops running Micropolis/Sugar",
        "gags": [],
        "see_also": ["../micropolis-gallery/INDEX.yml"],
    },
}

ROOT_META = {
    "alan-turing-portrait.png": {
        "what": "Alan Turing portrait used in HyperLook NeatClock / Exploratorium demos",
        "era": "archival reference",
        "room": "simprov-exploratorium",
    },
}

BUG_FARM_HINTS = {
    "flies": "Bug Farm — flies on wooden table",
    "spiders": "Bug Farm — spiders squish tutorial",
    "scorpions": "Bug Farm — scorpions on parchment HUD",
    "squish": "Bug Farm — green squish splat",
    "brain": "Bug Farm — brain-marble bait",
    "unity": "Bug Farm — Unity dev capture",
}


def slug_to_title(slug: str) -> str:
    return slug.replace("-", " ").strip()


def guess_what(slug: str, room: str) -> str:
    if slug.startswith("bug-farm-"):
        n = slug.replace("bug-farm-", "").replace(".png", "")
        if n.isdigit():
            return f"Pantomime Bug Farm screenshot #{int(n)} — squish-compulsion AR tutorial"
        return f"Pantomime Bug Farm — {slug_to_title(n)}"
    if slug.startswith("hyperlook-"):
        rest = slug.replace("hyperlook-", "")
        return f"HyperLook Exploratorium demo — {slug_to_title(rest)}"
    if slug.startswith("transmogrifier-"):
        rest = slug.replace("transmogrifier-", "")
        return f"Sims Transmogrifier — {slug_to_title(rest)}"
    if slug.startswith("ca-"):
        return f"SimCity-tile cellular automata — {slug_to_title(slug.replace('ca-', ''))}"
    if slug.startswith("sims-1999-"):
        return f"Sims 1 Transmogrifier/SimProv — {slug_to_title(slug.replace('sims-1999-', ''))}"
    if slug.startswith("jaunt-"):
        return f"Jaunt VR camera rig — {slug_to_title(slug.replace('jaunt-', ''))}"
    if slug.startswith("van-leer-"):
        return f"Van Leer press robot face — {slug_to_title(slug.replace('van-leer-', ''))}"
    return slug_to_title(slug.replace(".png", ""))


def room_for_path(png: Path) -> str:
    parts = png.relative_to(ROOT).parts
    if len(parts) == 1:
        return "(root)"
    return parts[0]


def yaml_quote(s: str) -> str:
    if any(c in s for c in ':"{}[]#&*!|>@%'):
        return '"' + s.replace('"', '\\"') + '"'
    return s


def write_sidecar(png: Path, dry_run: bool = False) -> bool:
    yml = png.with_suffix(".yml")
    if yml.exists():
        return False

    slug = png.stem
    room = room_for_path(png)
    rel_png = png.name

    if room == "(root)" and rel_png in ROOT_META:
        meta = ROOT_META[rel_png]
        what = meta["what"]
        era = meta["era"]
        gags = []
        see_also = [f"../{meta['room']}/INDEX.yml"]
        room_label = "(root)"
    elif room in ROOM_META:
        rm = ROOM_META[room]
        what = guess_what(slug, room)
        era = rm["era"]
        gags = rm.get("gags", [])
        see_also = rm.get("see_also", ["INDEX.yml"])
        room_label = room
    else:
        what = guess_what(slug, room)
        era = "unknown"
        gags = []
        see_also = ["INDEX.yml"] if (png.parent / "INDEX.yml").exists() else []
        room_label = room

    lines = [
        f"# Sidecar — {rel_png}",
        "",
        "artifact:",
        f"  file: {rel_png}",
        f"  slug: {slug}",
        f"  room: {room_label}",
        f"  what: {yaml_quote(what)}",
        f"  era: {yaml_quote(era)}",
        f"  sidecar_of: {rel_png}",
        "",
    ]

    if gags:
        lines.append("gags:")
        for g in gags:
            lines.append(f"  - {g}")
        lines.append("")

    if see_also:
        lines.append("see_also:")
        for s in see_also:
            lines.append(f"  - {s}")
        lines.append("")

    lines.append('note: "Not AI Generated!"')
    lines.append("")

    content = "\n".join(lines)
    if not dry_run:
        yml.write_text(content, encoding="utf-8")
    return True


def main() -> None:
    created = 0
    skipped = 0
    for png in sorted(ROOT.rglob("*.png")):
        if write_sidecar(png):
            created += 1
        else:
            skipped += 1
    print(f"created: {created}, skipped (existing): {skipped}")


if __name__ == "__main__":
    main()
