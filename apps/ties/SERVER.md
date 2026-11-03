# The server jump

Caddy still serves `current` off a symlink. The container is the lid:
`/proxy`, `/view`, `/api/auth`. If it dies, the encyclopedia still reads.

```
bash scripts/build-app.sh --mode node
bash scripts/deploy-app.sh
```

Same commit id tags `/data/releases/hyperties/releases/<id>` and
`wwsff/hyperties:<id>`. Build the image on linux.

| Path | Who |
|---|---|
| `/` articles | Caddy, files |
| `/proxy/gwern/…` | container, courtesy fetch, cache at `/data/hyperties/cache` |
| `/api/auth/*` | container, users + sessions in database `hyperties` |
| `/view/:id` | 501 until there is a views table |

Caddyfile: `deploy/hyperties-node.Caddyfile`. Rollback of the files is still
`deploy-app.sh --rollback <id>`.

`/microm8/` needs `static/microm8/microm8.wasm` and `wasm_exec.js`, which are gitignored. The
VM has no Go. `build-app.sh` fetches them by release key
(`packages/cabinet/scripts/microm8-wasm.mjs --fetch`) from
`https://storage.googleapis.com/wwsff-artifacts/microm8/<key>/`, checking `SHA256SUMS`. The key
hashes FORK.yml's base commit and Go version, the build flags and every patch, so a commit
names its module without anyone bumping a version.

The `microM8 module` workflow (`.github/workflows/microm8.yml`) builds and publishes a new key
when a patch or FORK.yml changes on main. A deploy started before it finishes waits up to
`MICROM8_WAIT` seconds (900) for it. Objects are write-once and cached as immutable.

The bucket is in ebike-safari, europe-west4, public read. GitHub Actions writes through
Workload Identity Federation (pool `github`, provider `github`, limited to this repository) as
`wwsff-ci@ebike-safari.iam.gserviceaccount.com`, which holds only `storage.objectCreator` on
the bucket. No key file exists. To publish by hand instead, as an account with write access:

```
cd packages/cabinet
node scripts/microm8-wasm.mjs --patches && node scripts/microm8-wasm.mjs --publish
```
