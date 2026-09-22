# syntax=docker/dockerfile:1
# Build context: apps/ties/
#
# The image is the interpreter (auth, /proxy, /view). Articles stay files
# at /data/releases/hyperties/current. Same commit id tags both.

FROM node:22-bookworm-slim AS build

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

WORKDIR /app

COPY package.json ./
RUN pnpm install --no-frozen-lockfile

COPY . .
ENV SVELTE_ADAPTER=node
RUN pnpm build

FROM node:22-bookworm-slim AS run

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:3000/api/auth/session').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "build"]
