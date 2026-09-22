# Three kinds of checkout

The `/opt` clone that builds and deploys the box is cattle. A checkout that *is
the world* is pet. Same git URL can be both, and then they are two clones with
two rules. Do not reuse one working tree for both jobs.

| Kind | Where | Lost if the VM dies? | Dirty tree |
|---|---|---|---|
| **Deploy** | `/opt/<repo>`, shallow | no — recloned | a bug. Build from a commit. |
| **Model** | `/data/models/<site>/<repo>` | yes — that is why it is here | the work. Uncommitted YAML *is* the site. |
| **Simulate** | not yet; own tree, later own disk | yes, with the model | a branch that is not what we ship |

`/data/releases/<app>/current` is not a checkout. It is a build product. A model
tree can *feed* a build; it is not the release directory.

## Deploy

`MANIFEST.yml` `repo.dir`: `/opt/WillWrightShowForFood`. Reconstructible.
`server-deploy.sh` fetches a ref and builds. Nothing uncommitted lives here on
purpose.

A second clone of WWSFF, moollm, or MicropolisCore under `/opt` for a *different
app's* build is still deploy. Cattle.

## Model

A MOOLLM-orchestrated site is a working tree. Characters, rooms, PLACE.yml,
uncommitted fieldwork — deleting the VM would lose them, so they live on the
pet disk.

```
/data/models/<site>/<repo>/
```

Not `/opt`, not inside a container, not a bind-mount of the deploy clone.
The orchestrator (mooco) is told that path. Same absolute string on the host
and in the container, like every other `/data` subtree.

Git remains how you snapshot. The live model is the working tree. "Clone the
repo, get the world" is true of commits. It is false of today's uncommitted
afternoon.

## Simulate (not yet)

A third clone of the same repo, often another branch, used to *run* the world
rather than to *ship* an app from it. Different rules: it may be dirty, it may
diverge from `main`, it must not be what `deploy-app.sh` builds.

Later: a set of simulation checkouts on its **own virtual disk**, attachable to
whichever worker is simulating them. The data migrates; the workers are cattle.
Same idea as `wwsff-data` vs `ebike-safari-1`, one level down — simulated
worlds as pets, simulators as cattle.

Do not build that disk yet. When it exists it is still `/data/models/…` or
`/sim/<id>/…` *inside its mount*, never remapped.

## Who owns the namespace

The box owns physical paths (`server/MANIFEST.yml`). mooco owns the *virtual*
namespace the LLM walks: rooms, skills, K-lines, which of these trees is
"here." Mapping a mooco room onto `/data/models/<site>/…` is mooco's job.
See `mooco/designs/MOOCO-MEMORY.md`.
