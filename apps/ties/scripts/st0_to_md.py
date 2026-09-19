#!/usr/bin/env python3
"""Convert a 1988 HyperTIES database into markdown plus a three-namespace index.

    st0_to_md.py <archive-db-dir> <out-dir> [--name NAME]

Reads, per database:

    *.st0   storyboards  -> articles/<slug>.md   (frontmatter + prose + target blocks)
    *.tn0   target shapes -> shapes/<slug>.svg   (normalized 0..1, y FLIPPED)
    *.pn0   pictures      -> index.yml pictures  (name -> canvas file)
    *.can.png             -> images/<file>.png   (already rasterized in 2005)

Three things this does that the 2005 XML pass did not:

  JOINS.      A link only exists when the storyboard (destination) is joined to the
              target (shape) and the picture. Converting files one at a time yields
              shapes with nothing on the other end. The graph is the artifact.
  PARSES.     No CDATA. ItemPath becomes real coordinates, class becomes a type,
              name becomes identity. Nothing opaque survives the conversion.
  FLIPS Y.    PostScript is y-up, SVG is y-down, so y_svg = 1 - y_ps. Verified by
              overlaying both on the artwork: only the flipped path traces the
              telescope. The 2005 *.svg files are mirrored; we reread the .tn0.

Field aliases are the 1988 formatter's own (fmt.f):
    .description -> .definition      .synonym -> .synonyms      .content -> .contents
"""
import argparse
import json
import math
import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sunraster

FIELD_ALIASES = {
    "description": "definition",
    "synonym": "synonyms",
    "content": "contents",
}
FIELDS = {"title", "definition", "synonyms", "contents", "controls"}

# Directives that end a paragraph. Everything else formatting-only is dropped.
BREAKS = {"lines", "nl", "para", "page", "sp"}

# How much of its line each directive eats, read off its definition in fmt.f. A storyboard
# is a FORTH token stream, not one directive per line, and the index articles live in the
# difference: every entry is `.~ Some Title~ .nl`, three tokens on one line.
#
#   : .~     ascii ~ word to-buf ... make-button    -> up to the closing tilde
#   : .tab   bl word literal? if ...                -> one whitespace-delimited token
#   : .line  read-line to-buf show-string .nl       -> the whole rest of the line, as text
#   : .nl    _new_line                              -> nothing
#
# How many `bl word` tokens each layout directive takes, so that whatever follows on the
# line is still read. `.spaces` is the one that matters most: the Table of Topics is an
# indented outline built from `.spaces 16 <tab> - .~ the markup language~`, and dropping
# that line drops the link with it. Only arities confirmed in fmt.f are listed; anything
# unlisted keeps the old behaviour of dropping its line, which loses layout but never text.
ARITY = {
    "indent": 0, "save-margins": 0, "restore-margins": 0,
    "spaces": 1, "tab": 1, "lines": 1, "line-space": 1,
    "left-margin": 1, "right-margin": 1, "top-margin": 1, "bottom-margin": 1,
    "font": 2, "button-font": 2, "def-tab": 2, "rect": 2,
}
CONSUMES_REST = {"line", "left", "center"}  # .left is an alias of .line in fmt.f

# A remainder is re-read as a directive only with no space after the dot. This is what
# keeps `.~ (fig. 6)~.  Each of the following organizations` intact: that second dot ends
# a sentence, and treating it as a directive would silently eat the sentence.
DIRECTIVE = re.compile(r"^\s*\.(~|[A-Za-z][\w-]*)(\s|$)")

# Quoted text that is itself markup, which is why it needed quoting: it would otherwise
# have executed. Distinguishes the documentation printing `.title` from a button labelled
# BACK PAGE, which was quoted only to keep it on one line.
MARKUP = re.compile(r"^\.[A-Za-z~]")

# An explicit page break. Spelled as a comment so that a plain markdown renderer that
# knows nothing of piles simply runs the pages together, which is the right degradation.
# Must stay in step with PAGE_BREAK in src/lib/markdown.js.
PAGE_BREAK = "<!-- page -->"

# A row break in a control panel, which is what `.nl .nl` between LAST and RETURN means.
# Must stay in step with ROW_BREAK in src/lib/markdown.js.
ROW_BREAK = "<!-- row -->"

LINK_FORTH = re.compile(r"\.~\s*([^~]+?)\s*~")     # prototype dialect: .~ name~
LINK_CLEAN = re.compile(r"(?<![.\w])~\s*([^~\n]+?)\s*~")
ARROWS = re.compile(r"^\s*=+>\s*")
COORD = re.compile(r"(-?[\d.]+)\s+(-?[\d.]+)\s+(moveto|lineto)")
NUM = r"(-?\d*\.?\d+)"
RRP = re.compile(rf"{NUM}\s+{NUM}\s+{NUM}\s+{NUM}\s+rrp")
ARC = re.compile(rf"{NUM}\s+{NUM}\s+{NUM}\s+{NUM}\s+{NUM}\s+arc")


def slug(name):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "untitled"


def fold(name):
    """The resolution key: case-insensitive, sentence punctuation and spacing ignored.

    A LEADING `!` survives, because that is HyperTIES's marker for a reserved name --
    !home, !index, !topics, !Control Panel, !OptionBack -- and folding it away would let
    prose ~home~ resolve to the database's home article. A TRAILING `!` is ordinary
    sentence punctuation and still goes, which is how the cookbook's declared synonym
    `Reshape!` resolves to Reshape. Must stay in step with fold() in corpus.js.
    """
    s = name.lower().strip().lstrip(" \t.,;:?").rstrip(" \t.,;:!?")
    return re.sub(r"\s+", " ", s).strip()


QUOTED = "\x00"  # stands in for a tilde that .quote escaped, restored after link parsing
INLINE_QUOTE = re.compile(r"\.quote(?:-line)?\s+(\S+?)([,.;:)]*)(?=\s|$)")


def normalize_links(text):
    """.~ name~ -> ~name~, the clean form the 1988 authors said they meant to return to."""
    # .quote also appears mid-sentence, where it quotes the next token so that the
    # token prints instead of executing: "the format of the .quote .pn0 file".
    text = INLINE_QUOTE.sub(
        lambda m: f"`{m.group(1).replace('~', QUOTED)}`{m.group(2)}", text
    )
    text = LINK_FORTH.sub(lambda m: f"~{m.group(1)}~", text)
    return text.replace(QUOTED, "~")


def drop_tokens(arg, n):
    """Consume n whitespace-delimited tokens, FORTH's `bl word`."""
    for _ in range(n):
        parts = arg.split(None, 1)
        arg = parts[1] if len(parts) > 1 else ""
    return arg


def handle_rest(rest, para):
    """Route the unread tail of a line: another directive, or prose.

    Returns what to re-read as the next line, or None. Prose is appended to `para`
    instead, and joins the preceding text with no space when it opens with sentence
    punctuation, so that `.~ (fig. 6)~.  Each of the` closes up to "(fig. 6).  Each of
    the" rather than drifting into "(fig. 6) . Each of the".
    """
    if DIRECTIVE.match(rest):
        return rest
    tail = rest.strip()
    if tail:
        if tail[0] in ".,;:!?)" and para:
            para[-1] += tail
        else:
            para.append(tail)
    return None


def parse_st0(path, has_geometry=frozenset()):
    """A storyboard -> {title, synonyms[], definition, blocks[]}.

    The storyboard is a STATEFUL layout language, like the PostScript it compiled to:
    `.picture` sets the current picture and each following `.target` places a shape on
    it. Converting each directive independently loses that containment.

    Two kinds of target, told apart by whether the shape carries geometry:

      PopupTarget etc. have a real /ItemPath of coordinates -> a region ON the picture.
      LinkTarget has /ItemPath {rr}, a round-rect the formatter computed at layout time
        from the text it wrapped -> a text button, whose LABEL is the text since the
        last break directive. That is why `Diagram` sits just above `.target
        default-button` and must not be emitted as its own paragraph.
    """
    art = {
        "title": None,
        "synonyms": [],
        "definition": "",
        "blocks": [],
        "controls": False,
        # fmt.f's found-contents? flag. `.contents` sets it on, and the DEFINITION pass
        # emits the FULL ENTRY button only when it reaches that directive:
        #
        #   : .contents  found-contents? on
        #     doing-contents? @ if  init-contents ... \ contents pass: draw the body
        #     else doing-definition? @ if
        #       _full_entry_button_ref @ _show_string      \ definition pass: draw
        #       _full_entry_button_name @ _stamp_target    \ the button, then stop
        #       pop-interpreter
        #
        # So an article with no `.contents` has no FULL ENTRY button. The conditional is
        # resolved at format time, not evaluated at click time.
        "contents": False,
    }
    field = None
    para = []
    picture = None  # the current picture block, which targets attach to

    def flush():
        """End a paragraph. In the definition field the text is the FIELD, not a block."""
        if not para:
            return
        joined = " ".join(l.strip() for l in para if l.strip())
        para.clear()
        if not joined:
            return
        if field == "definition":
            art["definition"] = normalize_links(joined)
        else:
            art["blocks"].append({"kind": "para", "text": normalize_links(joined)})

    lines = path.read_text(errors="replace").splitlines()
    pending = None  # the unread remainder of a line, re-read as though it came next
    i = 0
    while pending is not None or i < len(lines):
        if pending is not None:
            raw, pending = pending, None
        else:
            raw = lines[i]
            i += 1
        stripped = raw.strip()

        if stripped.startswith("."):
            if stripped.startswith(".~"):
                # Split before the generic tokenizer: the tilde is the delimiter, so
                # `.~Name~` needs no space and would otherwise parse as one long word.
                word = canon = "~"
                arg = stripped[2:]
            else:
                # Directive names are case-insensitive: FORTH words are conventionally
                # uppercase and at least one author typed .TITLE / .SYNONYM / .DESCRIPTION.
                # Matching only lowercase silently drops whole articles.
                word = stripped[1:].split()[0] if len(stripped) > 1 else ""
                arg = stripped[1 + len(word):].strip()
                word = word.lower()
                canon = FIELD_ALIASES.get(word, word)

            if canon in FIELDS:
                flush()
                field = canon
                if canon == "controls":
                    art["controls"] = True
                if canon == "contents":
                    art["contents"] = True
                continue

            if canon == "target":
                # The destination is the next non-empty line: documents namespace.
                dest = ""
                j = i
                while j < len(lines) and not lines[j].strip():
                    j += 1
                if j < len(lines) and not lines[j].strip().startswith("."):
                    dest = lines[j].strip()
                    i = j + 1

                if fold(arg) in has_geometry:
                    flush()
                    shape = {"shape": arg, "to": dest}
                    if picture is None:
                        picture = {"kind": "picture", "name": None, "shapes": []}
                        art["blocks"].append(picture)
                    picture["shapes"].append(shape)
                else:
                    # A text button. The pending text is its label, so consume it
                    # rather than flushing it into a paragraph of its own.
                    label = " ".join(l.strip() for l in para if l.strip())
                    para.clear()
                    art["blocks"].append(
                        {"kind": "button", "shape": arg, "to": dest, "label": label}
                    )
                continue

            if canon == "picture":
                flush()
                picture = {"kind": "picture", "name": arg, "shapes": []}
                art["blocks"].append(picture)
                continue

            if canon == "~":
                # The self-naming link: make-button over the text, so the label IS the
                # destination. Upgraded here to the one modern form, ~name~, so that
                # everything downstream has a single link syntax to know about.
                text, sep, rest = arg.partition("~")
                if not sep:
                    print(f"  warn: {path.name}: unterminated .~ link", file=sys.stderr)
                para.append(f"~{text.strip()}~")
                pending = handle_rest(rest, para)
                continue

            if canon == "page":
                # : .page  _start_page  -> an explicit page break. A pile holds a STACK of
                # pages (_zap_pages clears it), and this is what FIRST / BACK PAGE / NEXT
                # PAGE / LAST move through. Seven articles use it; piedemo.st0 has 8 pages.
                flush()
                art["blocks"].append({"kind": "page"})
                pending = handle_rest(arg, para)
                continue

            if canon in BREAKS:
                flush()
                # In a control panel the newline is the only layout there is. control.st0
                # separates buttons within a row by `.spaces 8` and rows by `.nl .nl`, so
                # this is how the panel says it wants two rows. Collapsed, since `.nl .nl`
                # asks for one break between rows, not two.
                if art["controls"] and canon == "nl":
                    if not art["blocks"] or art["blocks"][-1]["kind"] != "row":
                        art["blocks"].append({"kind": "row"})
                pending = handle_rest(drop_tokens(arg, ARITY.get(canon, 0)), para)
                continue

            if canon == "quote":
                # : .quote  bl word to-buf show-word  -> ONE token, shown literally so
                # that a leading-dot word prints instead of executing. The rest of the
                # line is ordinary prose and can carry links of its own, as in
                # "`.tn0` files are stored ... the role of the ~master index builder~".
                parts = arg.split(None, 1)
                if parts:
                    para.append(f"`{parts[0].replace('~', QUOTED)}`")
                pending = handle_rest(parts[1] if len(parts) > 1 else "", para)
                continue

            if canon == "quote-line":
                # : .quote-line  read-line to-buf show-word  -> the rest of the line as
                # one unbreakable run, and no newline after it. Quoted markup becomes a
                # code span, and its tildes must survive link parsing or the article that
                # documents `.~ button~` would link to an article called "button". Plain
                # labels do not: the control panel quotes BACK PAGE only to stop it
                # wrapping mid-button, and it is a label, not code.
                if arg:
                    para.append(
                        f"`{arg.replace('~', QUOTED)}`" if MARKUP.match(arg) else arg
                    )
                continue

            if canon in CONSUMES_REST:
                # read-line to-buf show-string: the remainder is text, then a break.
                # `.~ Figure 1~ .tab 0 .line Pie Menu Schematic` is one line of a figure
                # list -- link, spacing, caption -- and the caption is only reachable here.
                if arg:
                    para.append(arg)
                flush()
                continue

            if canon in ARITY:
                pending = handle_rest(drop_tokens(arg, ARITY[canon]), para)
                continue

            continue  # formatting-only: margins, fonts, spaces, rem, rect, save...

        if field == "title":
            if stripped:
                art["title"] = stripped
        elif field == "synonyms":
            if stripped:
                art["synonyms"].append(stripped)
        elif field == "definition":
            if stripped:
                para.append(stripped)
            else:
                flush()
        elif field in ("contents", "controls"):
            if ARROWS.match(raw):
                flush()
                art["blocks"].append(
                    {"kind": "link", "text": normalize_links(ARROWS.sub("", stripped))}
                )
            elif stripped:
                para.append(raw)
            else:
                flush()

    flush()
    return art


def parse_named_ps(path):
    """A .tn0/.pn0 begins: <Class>\\n"<name>"\\n ... -> (class, name, text)."""
    text = path.read_text(errors="replace")
    lines = [l for l in text.splitlines() if l.strip()]
    cls = lines[0].strip() if lines else "Unknown"
    name = ""
    for l in lines[:4]:
        m = re.search(r'"([^"]+)"', l)
        if m:
            name = m.group(1)
            break
    return cls, name, text


def item_path(text):
    """ItemPath -> an SVG path `d`, or "" when the shape carries no coordinates.

    Coordinates are normalized 0..1, which is why one target served renderings at
    450x337, 507x598 and 533x509. PostScript is y-up and SVG is y-down, so every y
    becomes 1-y. The 2005 conversion omitted this and its SVGs are mirrored.

    Three coordinate-bearing forms appear in the archive:

        moveto/lineto/closepath   32 shapes  polygons traced around artwork
        x y w h rrp               16 shapes  a rounded rect placed on a picture
        cx cy r a1 a2 arc         16 shapes  a PIE MENU SLICE, in doc/obj and newdb/earth

    A fourth form, bare `rr` (30 shapes), has no coordinates at all: the formatter took
    that geometry from the text the target wrapped. Those are text buttons, and returning
    "" for them is what tells the converter to treat them as such.
    """
    if "/ItemPath" not in text:
        return ""
    body = text.split("/ItemPath", 1)[1]

    arc = ARC.search(body)
    if arc:
        cx, cy, r, a1, a2 = (float(v) for v in arc.groups())
        start = arc_point(cx, cy, r, a1)
        end = arc_point(cx, cy, r, a2)
        large = 1 if abs(a2 - a1) > 180 else 0
        # PostScript sweeps counter-clockwise; the y flip mirrors that, so the arc is
        # drawn in SVG's negative direction. Verified by rendering: sweep 1 bows the
        # wedges inward, which is how a pie menu slice should not look.
        return (
            f"M {cx:.5f} {1 - cy:.5f} L {start[0]:.5f} {start[1]:.5f} "
            f"A {r:.5f} {r:.5f} 0 {large} 0 {end[0]:.5f} {end[1]:.5f} Z"
        )

    rrp = RRP.search(body)
    if rrp:
        x, y, w, h = (float(v) for v in rrp.groups())
        return (
            f"M {x:.5f} {1 - y - h:.5f} h {w:.5f} v {h:.5f} h {-w:.5f} Z"
        )

    pts = [(float(x), 1.0 - float(y)) for x, y, _ in COORD.findall(body)]
    if not pts:
        return ""
    return "M " + " ".join(f"{x:.5f} {y:.5f}" for x, y in pts) + " Z"


def arc_point(cx, cy, r, degrees):
    a = math.radians(degrees)
    return (cx + r * math.cos(a), 1 - (cy + r * math.sin(a)))


def write_shape_svg(out, name, d, cls):
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"\n'
        f'     preserveAspectRatio="none" data-class="{cls}" data-name="{esc(name)}">\n'
        f'  <path d="{d}" vector-effect="non-scaling-stroke"/>\n'
        f"</svg>\n"
    )
    out.write_text(svg)


def esc(s):
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def yaml_scalar(s):
    s = str(s)
    if s == "" or re.search(r'[:#\[\]{}&*!|>%@`"\']|^\s|\s$|^[-?]', s):
        return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'
    return s


def emit_md(art, source):
    fm = [f"title: {yaml_scalar(art['title'] or 'Untitled')}"]
    if art["synonyms"]:
        fm.append("synonyms:")
        fm += [f"  - {yaml_scalar(s)}" for s in art["synonyms"]]
    if art["definition"]:
        fm.append(f"definition: {yaml_scalar(art['definition'])}")
    if art["controls"]:
        fm.append("controls: true          # browser chrome, not content: targets are !Option verbs")
    if not art["contents"] and not art["controls"]:
        fm.append("contents: false         # no .contents directive, so no FULL ENTRY button")
    fm.append(f"source: {yaml_scalar(source)}")

    def dest_key(to):
        # A control-panel target invokes a browser verb rather than opening an article.
        return "command" if to.startswith("!Option") else "to"

    body = []
    for b in art["blocks"]:
        if b["kind"] == "para":
            body.append(b["text"])
        elif b["kind"] == "page":
            body.append(PAGE_BREAK)
        elif b["kind"] == "row":
            body.append(ROW_BREAK)
        elif b["kind"] == "link":
            body.append(f"→ {b['text']}")
        elif b["kind"] == "picture":
            blk = ["```target"]
            if b["name"]:
                blk.append(f"picture: {yaml_scalar(b['name'])}")
            if b["shapes"]:
                blk.append("shapes:")
                for s in b["shapes"]:
                    blk.append(f"  - shape: {yaml_scalar(s['shape'])}")
                    if s["to"]:
                        blk.append(f"    {dest_key(s['to'])}: {yaml_scalar(s['to'])}")
            blk.append("```")
            body.append("\n".join(blk))
        elif b["kind"] == "button":
            blk = ["```target", f"shape: {yaml_scalar(b['shape'])}"]
            if b["label"]:
                blk.append(f"label: {yaml_scalar(b['label'])}")
            if b["to"]:
                blk.append(f"{dest_key(b['to'])}: {yaml_scalar(b['to'])}")
            blk.append("```")
            body.append("\n".join(blk))

    return "---\n" + "\n".join(fm) + "\n---\n\n" + "\n\n".join(body) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--name", default=None)
    ap.add_argument(
        "--flat",
        action="store_true",
        help="do not recurse; doc/ holds three separate databases in subdirectories",
    )
    ap.add_argument(
        "--global-dir",
        default=None,
        help="the shared outer scope. ties/global/ holds 19 reusable button shapes "
        "(back-button, next-button, home-button...) that every database resolves into, "
        "so name resolution in 1988 was a two-level scope walk: database, then global.",
    )
    args = ap.parse_args()

    src, out = Path(args.src), Path(args.out)
    walk = src.glob if args.flat else src.rglob
    db = args.name or src.name
    for sub in ("articles", "shapes", "images"):
        (out / sub).mkdir(parents=True, exist_ok=True)

    documents, pictures, targets = {}, {}, {}
    unresolved, stats = [], {"articles": 0, "synonyms": 0, "targets": 0, "pictures": 0}

    # Shapes FIRST: a storyboard cannot be parsed correctly without knowing which of its
    # targets carry geometry, because that decides whether a target lands on the current
    # picture or wraps the preceding text as a button.
    # Outer scope first, so a database's own shape of the same name shadows it.
    shape_sources = []
    if args.global_dir:
        shape_sources += [(p, "global") for p in sorted(Path(args.global_dir).glob("*.tn0"))]
    shape_sources += [(p, "local") for p in sorted(walk("*.tn0"))]

    has_geometry = set()
    for tn0, scope in shape_sources:
        cls, name, text = parse_named_ps(tn0)
        d = item_path(text)
        if not name:
            continue
        s = slug(name)
        root = tn0.parent if scope == "global" else src.parent
        entry = {"class": cls, "scope": scope, "source": str(tn0.relative_to(root.parent))}
        if d:
            write_shape_svg(out / "shapes" / f"{s}.svg", name, d, cls)
            entry["shape"] = f"shapes/{s}.svg"
            has_geometry.add(fold(name))
        if name in targets and targets[name].get("scope") != scope:
            entry["shadows"] = targets[name]["scope"]
        targets[name] = entry
        stats["targets"] += 1

    for st0 in sorted(walk("*.st0")):
        art = parse_st0(st0, has_geometry)
        if not art["title"]:
            continue
        s = slug(art["title"])
        rel = str(st0.relative_to(src.parent))
        (out / "articles" / f"{s}.md").write_text(emit_md(art, rel))
        documents[art["title"]] = {"file": f"articles/{s}.md", "principal": True}
        for syn in art["synonyms"]:
            documents.setdefault(syn, {"file": f"articles/{s}.md", "alias_of": art["title"]})
        stats["articles"] += 1
        stats["synonyms"] += len(art["synonyms"])

    for pn0 in sorted(walk("*.pn0")):
        cls, name, text = parse_named_ps(pn0)
        if not name:
            continue
        m = re.search(r"\(([^)]+\.can)\)", text)
        entry = {"class": cls, "source": str(pn0.relative_to(src.parent))}
        if m:
            can = pn0.parent / m.group(1)
            dest = out / "images" / (can.name + ".png")
            # Decode the Sun rasterfile rather than copying the 2005 PNG, whose black and
            # white are inverted for rootmenu.can and framemenu.can. See sunraster.py.
            if can.exists():
                try:
                    sunraster.read(can).save(dest)
                    entry["image"] = f"images/{dest.name}"
                    entry["decoded_from"] = m.group(1)
                except Exception as err:  # a damaged raster must not stop the corpus
                    print(f"  warn: {can.name}: {err}", file=sys.stderr)
            if "image" not in entry and (legacy := can.with_suffix(".can.png")).exists():
                shutil.copy(legacy, dest)
                entry["image"] = f"images/{dest.name}"
                entry["note"] = "2005 png; original raster missing"
        pictures[name] = entry
        stats["pictures"] += 1

    # Resolution is case-insensitive and tolerates sentence punctuation, because prose
    # is prose: the archive writes ~Direction~ and declares the synonym "direction", and
    # writes ~font selection menu.~ with the sentence's full stop inside the tildes.
    # That tolerance IS the self-naming property; an exact-match index would drop these.
    lookup = {}
    for space, table in (("documents", documents), ("pictures", pictures), ("targets", targets)):
        for key in table:
            lookup.setdefault(fold(key), space)

    for md in sorted((out / "articles").glob("*.md")):
        for ref in LINK_CLEAN.findall(md.read_text()):
            if fold(ref) not in lookup:
                unresolved.append({"in": md.name, "name": ref})

    principals = sum(1 for v in documents.values() if v.get("principal"))
    index = {
        "database": db,
        "converted_from": str(src),
        # Weiland's MASTER_INDEX: struct index *documents, *pictures, *targets
        "namespaces": {
            "documents": {"principals": principals, "entries": len(documents), "index": documents},
            "pictures": {"entries": len(pictures), "index": pictures},
            "targets": {"entries": len(targets), "index": targets},
        },
        "unresolved": unresolved,
    }
    (out / "index.json").write_text(json.dumps(index, indent=1, sort_keys=False))

    print(
        f"{db}: {stats['articles']} articles ({principals} principals, "
        f"{len(documents)} document entries incl. {stats['synonyms']} synonyms), "
        f"{stats['targets']} targets, {stats['pictures']} pictures, "
        f"{len(unresolved)} unresolved refs"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
