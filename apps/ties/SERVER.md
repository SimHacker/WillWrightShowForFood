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

`/microm8/` needs `static/microm8/microm8.wasm` and `wasm_exec.js`, which are gitignored and
built with Go from microM8 plus `packages/cabinet/microm8/patches/`
(`node packages/cabinet/scripts/microm8-wasm.mjs`). The VM has no Go, so they are copied into
its checkout, where `git reset --hard` leaves them and every build picks them up. Copy them
again when the patches change:

```
gcloud compute scp --zone=europe-west4-a --project=ebike-safari \
  apps/ties/static/microm8/{microm8.wasm,wasm_exec.js} ebike-safari-1:/tmp/
gcloud compute ssh ebike-safari-1 --zone=europe-west4-a --project=ebike-safari --command \
  'sudo install -m 644 /tmp/microm8.wasm /tmp/wasm_exec.js /opt/WillWrightShowForFood/apps/ties/static/microm8/'
```
