# OLPC Micropolis — Python, Sugar, PyGTK, Cairo, Pango

Don's dive into **Python** for the XO laptop: Sugar was written in Python; the stack was **PyGTK,
gobject, Cairo, Pango** — solid GNOME modules.

## Two-step port

1. **Sugar activity adaptor** — wrap the existing Tcl/Tk/X11 SimCity app for the XO
2. **PyGTK desktop UI** — fully playable; **Cairo** for scalable printable graphics, **Pango** for beautiful scalable text — natural successor to HyperLook's PostScript tile renderer

## Forward path

**PyGTK revival candidate:** wire the OLPC Cairo/Pango UI shell to **MicropolisCore's C++ engine** (native desktop alongside WASM). GTK ecosystem status TBD — Don hasn't tracked it lately.

→ [`career/simcity-lineage.yml`](career/simcity-lineage.yml) (`implementation`, `pygtk_revival`) · [`career/lineage.yml`](career/lineage.yml) (tools + imaging braids)
