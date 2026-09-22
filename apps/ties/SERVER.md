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
