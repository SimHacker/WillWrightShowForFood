# linkget, parent scope, COOL plans (Jun 1991)

**Arthur van Hoff** (`[email redacted]`) → Rafael Bracho / TNT core, cc Tim Niblett, Jim Rudolf, Cathy Waite.

## Parent-scope / linkget design

Arthur independently converged on Rafael's parent-scope solution. Proposals:

- Prefix scoped variables: `/&BG`, `/&3D?` — namespace clarity + debug/edit affordances.
- **Back-stop** when instance has no parent yet (TNT bootstrap cases).
- Prefer **`linkwhere`** over bare **`linkget`**:

```postscript
/linkwhere  { % dict linkkey key -- dict true | false
/linkget    { dup 4 1 roll linkwhere {exch get} {cvx exec} ifelse } def
/linkknown? { linkwhere {pop true} {false} ifelse } def
```

Class defines `/&BG .5 .5 .5 rgbcolor def` backstop; instance method `/BG { self /Parent /&BG linkget } def`.

**linkkey** may not always be `/Parent` — essential for later COOL hierarchy.

## Tim Niblett — COOL Plan A vs Plan B (5 Jun 1991)

Turing Institute planning **COOL** (HyperNeWS functionality on TNT):

| Plan | Approach |
|------|----------|
| **A** | Incrementally evolve TNT (parent scope → persistence → safe Send → UI IDE) — compatibility burden |
| **B** | **Layer on TNT** — unrestricted container hierarchy with persistence + parent scope rooted in TNT objects; preferred for cleaner separation |

Goals: single maintenance path (i18n, X interop once); upgrade path from TNT apps to COOL.

## Cross-links

- [`../../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md`](../../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md) — same summer TNT politics + HyperNeWS 1.5 bulletin
- [`../ideas.md`](../ideas.md) — HyperLook / Glasgow arc
