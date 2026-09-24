---
title: Transclusion
synonyms:
  - transclude
definition: "A path fence splices a WillWrightShowForFood file into the article, live. The file stays in its room."
---

A `transclude` with `path:` names a file in WillWrightShowForFood, and the reader splices it into the article. The file stays where it lives, in the character room or the package that owns it; the page shows the current text, the path, and a link to it on GitHub. Relative links inside the document go to its neighbours on GitHub.

    ```transclude
    path: packages/cabinet/BUG-JOURNAL.md
    ```

is all it takes; ~Bug journal~ is that fence plus a paragraph.

Each document is fetched only when an article shows it, so a page carries only the documents it names. The allowed rooms are the Heinz Lemke, Lars Brinkhoff and Roy Eagleson characters, the cabinet package, and the two PIXIE repo shows. A path outside them renders as a link to GitHub.

A `transclude` with `article:` splices a HyperTIES article, including across databases. That is how the playground's PIXIE live still runs the machine that lives in this database.

A `transclude` with `follows:` is bound to an applet on the page. The applet publishes its state, and the article name is a template filled from it:

    ```transclude
    follows: cabinet
    article: cabinet-{program}
    ```

On ~PIXIE live~ that is the article under the machine. Choose another program and the article changes with it: ~Drawing with SYMELEC~, ~The light pen test~, ~DUEL~, ~HILO~, ~LANDER~. If no article has the name, an `else:` article is shown, or nothing.
