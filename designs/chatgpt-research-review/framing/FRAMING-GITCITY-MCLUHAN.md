# GitCity and McLuhan — the repo is the message

> Extracts and organizes the review's McLuhan analysis and Don's **GitCity** framing: what happens when you
> stop treating a git host as a filing cabinet and start treating it as a *civic/social medium* — and why
> the concept must be **de-Microsoftified** to survive.
>
> **Author:** Claude Opus, from review lines ~900–1000, 1498–1604. Stance: the McLuhan reading is the correct
> lens; GitCity is the right generic frame; de-Microsoftifying is a survivability requirement, not a slogan.

---

## The four-layer frame (Don's stack, cleaned up)

```
Repo Show      = the format          (an individual show whose canonical form is a repo)
GitCity        = the civic/social medium   (git-hosting-as-a-city, vendor-neutral)
MOOLLM         = the inhabitable intelligence layer   (the LLM OS living in the repo)
MicropolisCity = Don's specific game / meta-game world   (his brand on top)
```

The important move: **GitCity is the generic, de-branded abstraction; MicropolisCity is Don's instance of
it.** "MicropolisCity is my brand of games and meta-games and game data bus, but the generic idea of Repo
Shows ⇒ GitCity." Anyone can run a GitCity; Don runs MicropolisCity.

## The McLuhan reading

McLuhan's "the medium is the message" means the *form* of a medium reshapes perception more than any
particular content it carries. Applied here, the review works through a ladder of increasingly precise lines:

- *"The repo is the message."* — first cut: the container, not the file, is what changes how we think.
- *"The medium is not the file. The medium is the collaborative versioned world."* — sharper: it's the
  *versioned, collaborative* structure that's new.
- *"The commit is the message."* — the atomic unit of that world is a change-with-history.
- **"The pull request is the message."** — the best line, and the one I'd keep: **a PR is not content, it is
  social intent + proposed change + review + identity + history + possible incorporation into the world.**
  That bundle is the message the medium is built to carry, and no prior medium had it as a native primitive.

**Why the PR-as-message line is the keeper:** it names exactly what's new. A YouTube comment, a blog reply, a
podcast mention — all are *reactions*. A pull request is a *governed proposal to change the shared world,
attributed and reviewable.* That is a categorically richer speech act, and it's the same primitive as
MicropolisCore's command bus and WWSFF's TicketPR (see [`FRAMING-REPO-AS-MEDIUM.md`](FRAMING-REPO-AS-MEDIUM.md)
and [`../read-only-hosts.md`](../read-only-hosts.md)). The medium's message *is* the governed proposal.

## GitCity: the city metaphor, and why it's load-bearing

"GitHub accidentally became the first industrial-strength platform for collaborative world-building." Read as
a **city**, a git host already has: public squares (repos), civic proposals (PRs), debate (issues/
discussions), zoning and law (workflows, CODEOWNERS, branch protection), districts (orgs), citizens
(identities with history), and reactions-of-the-world-to-events (event-triggered automation). Repo Shows are
"what happens when we stop treating repos as backstage storage and start treating them as the stage, the
studio, the city, and the world."

The city framing isn't just poetic — it tells you **what to build and what not to build.** You do *not*
reimplement identity, social graph, notifications, permissions, or event automation; the city already has
them. You build the *world* that lives in the city, and the *intelligence* (MOOLLM) that inhabits it. This is
why Don can ship the social layer now: the civic infrastructure exists.

## De-Microsoftify — survivability, not ideology

GitHub is owned by Microsoft. Binding GitCity to GitHub-the-company makes the whole civic medium a tenant of
one landlord — and the GitHub outage that punctuated this very conversation is the demonstration: *when the
landlord is down, the city is down.* So GitCity must be **de-Microsoftified**:

- **GitCity is the abstraction; GitHub is one implementation.** Treat "the git host" as a **driver seam** —
  the exact same discipline as MOOLLM treating "the LLM host" as a driver (Cursor now, mooco later). Bootstrap
  on GitHub because it exists and works; design so the city can stand on other ground.
- **Support open-source clones** (Forgejo/Gitea, GitLab CE, Sourcehut) — "or better yet, *reimaginations*."
  Don's stronger ask is not just clones of GitHub's model but successors that rethink it (content-addressed,
  distributed, offline-first).
- **Keep the civic semantics portable** — PR-as-message, repo-as-world, event-as-reaction — so migrating off
  GitHub is a **backend swap, not a rewrite.**

This is the same pattern twice over — **Cursor→mooco** and **GitHub→GitCity**:
*bootstrap on the vendor you have, but never let the vendor become an existential dependency.* Robust-first,
applied to platforms.

## The compression (one line)

> Treat the git host as a **city**, not a filing cabinet — and treat the *specific* city (GitHub) as a
> replaceable driver, so GitCity outlives its landlord. The pull request is the message.
