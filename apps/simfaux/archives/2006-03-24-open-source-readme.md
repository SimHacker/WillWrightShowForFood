# Open Source SimFaux OpenLaszlo Code Now Available via Subversion

**Published:** 2006-03-24 · Don Hopkins · Drupal node/123  
**Wayback (this capture):** https://web.archive.org/web/20070208025302/http://www.donhopkins.com/drupal/node/123  
**Tags (period):** Laszlo Applications · Pie Menu Applications · Downloadable Software

I've published the source code and content of SimFaux as Open Source Software. It's available via read-only anonymous subversion. Here's the command to get all the source code and content:

```text
svn co svn://SimFaux.com/SimFaux/trunk/SimFaux
```

I've started writing a README.txt file, but that's about all the documentation there is so far.

---

## SimFaux 1.0 README

SimFaux is an interactive TV station simulator written in OpenLaszlo,
by Don Hopkins, for the HuffingtonPost Contagious Festival.

It's an open-ended framework for plugging together keyword tagged
multimedia character simulations, video, text, quotes, surveys,
interactive games and application.

It's configured with XML files, so non-programmers can easily add
characters, video and other types of content.

It includes tools for validating, processing and compressing the
content into appropriate file formats.

### Installation

Dependencies: OpenLaszlo; Python (checking and adding new content); Cygwin
(rebuilding the content conversion tools).

Install OpenLaszlo 3.1.1 or newer. Example: version 3.1.1 in `C:\OpenLaszlo`,
checkout into the lps directory as `C:\OpenLaszlo\lps-3.1.1\SimFaux`:

```text
cd c:\OpenLaszlo\lps-3.1.1
svn co svn://SimFaux.com/SimFaux/trunk/SimFaux
```

### Running

Open:

```text
http://localhost:8080/lps-3.1.1/SimFaux/SimFaux.lzx
```

Compiled SWF deposits at:

```text
C:\OpenLaszlo\Server\lps-3.1.1\SimFaux\SimFaux.lzx.swf
```

Deploy that OpenLaszlo "SOLO" application on a server with support files and
`content/` subdirectories.

**URL query parameters:**

| Param | Meaning |
|---|---|
| `surfing=0\|1` | Initial surf checkbox |
| `program=<symbol>` | Start on named program (e.g. `bushmatrix`) |
| `channel=1-8` | Random program on channel (if no program) |
| `gameZoomFactor` | Zoom (default 1.0) |
| `contentServer` | Content base URL (e.g. `http:content/`) |

### Playing

Starts in **surf** mode (random channel changes). Channel buttons top-right +
Surf checkbox. Pie menus control the station. `[TODO]` pie-menu detail in original.

### Content tools

| Tool | Role |
|---|---|
| `src/scripts/CheckContent.py` | Validate XML; check media; keyword index. Audio: `sounds.xml` / `bites.xml` → `src/audio` mp3, `content/audio` flv. Video: `movies.xml` → `src/video` wmv, `content/video` flv. |
| `src/scripts/ConvertContent.py` | PNG→SWF via traceswf; `sprites.xml`; `src/sprites` |
| `src/utils/traceswf.exe` | Alpha outline → vector clip + SWF (autotrace, ming, lpng, zlib). Prebuilt Windows binary. |

### Limitations (contest)

HuffPo Contagious Festival: **≤15 MB** content; self-contained; no web services
except streaming static content.

### Ideas (post-contest — still a 2026 roadmap)

Server-side content DB · live chat / talk shows · shared channel broadcasts ·
webcam upload · shared stations / character roles · Space Ghost / MST3K puppetry ·
verbal combat · keyword blogging · avitar heads + voice bites · Flickr ·
keyword overlays (lightning, smoke, stonewall, tomato, duck) · teleprompter ·
ratings · program guide · Hangman / Tic Tac Faux / Angry-Libs · shopping channels ·
content authoring · Red5 RTMP · DHTML OpenLaszlo port notes.

Full idea dump preserved from the Drupal post (games, shopping, authoring,
streaming) — see Wayback if you need the complete list verbatim; the structure
above is the working index for Declare reimagine.

### Extending (checklist from README)

Programs · characters · sprites · bites · sounds · movies · quotes · surveys ·
chats · graphs · hangman · text messages · channel frame layouts · feed types ·
pie menus · keywords.

---

*Copyright (C) 2005–2006 by Don Hopkins. Typos in original preserved where quoted
("deposite", "auduo", "SimFaix", "avitars", "Jusxtoposition").*
