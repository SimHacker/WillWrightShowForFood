#!/usr/bin/env bash
# First-time VM setup: Docker, git checkout, build viewer on instance, start stack.
# Run: gcloud compute ssh ebike-safari-1 -- sudo bash /opt/.../server-install.sh
set -euo pipefail

DOMAIN="${DOMAIN:-ebike-safari.com}"
REPO_URL="${REPO_URL:-https://github.com/SimHacker/WillWrightShowForFood.git}"
REPO_DIR="${REPO_DIR:-/opt/WillWrightShowForFood}"
APP_DIR="${APP_DIR:-${REPO_DIR}/apps/ebike-safari}"
DEPLOY_DIR="${DEPLOY_DIR:-${APP_DIR}/deploy}"

if [[ $EUID -ne 0 ]]; then
	echo "Run with sudo"
	exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git ufw apt-transport-https gnupg cloud-guest-utils

if ! command -v docker >/dev/null; then
	install -m 0755 -d /etc/apt/keyrings
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
	chmod a+r /etc/apt/keyrings/docker.asc
	echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${VERSION_CODENAME:-noble}) stable" \
		> /etc/apt/sources.list.d/docker.list
	apt-get update
	apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

# Grow root FS if boot disk was resized in GCP (live, no reboot)
ROOT_PART=$(findmnt -n -o SOURCE /)
DISK="/dev/$(lsblk -no PKNAME "$ROOT_PART")"
PART_NUM="${ROOT_PART##*[!0-9]}"
growpart "$DISK" "$PART_NUM" || true
resize2fs "$ROOT_PART" || true

ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

if [[ ! -d "$REPO_DIR/.git" ]]; then
	git clone --depth 1 "$REPO_URL" "$REPO_DIR"
fi

cd "$DEPLOY_DIR"
mkdir -p data

if [[ -f /opt/ebike-safari/deploy/.env ]] && [[ ! -f .env ]]; then
	cp /opt/ebike-safari/deploy/.env .env
	chmod 600 .env
fi
if [[ -d /opt/ebike-safari/deploy/data ]] && [[ -z "$(ls -A data 2>/dev/null)" ]]; then
	cp -a /opt/ebike-safari/deploy/data/. data/
fi

if [[ ! -f .env ]]; then
	POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)
	cat > .env <<EOF
DOMAIN=${DOMAIN}
ACME_EMAIL=simhacker@gmail.com
POSTGRES_DB=ebike_safari
POSTGRES_USER=ebike
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ORIGIN=https://${DOMAIN}
EOF
	chmod 600 .env
	echo "Wrote ${DEPLOY_DIR}/.env"
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

echo "Building viewer on VM…"
docker compose build viewer

echo "Starting stack…"
docker compose up -d

echo "Deployed from git checkout at ${REPO_DIR}"
echo "Updates: sudo bash ${DEPLOY_DIR}/scripts/server-deploy.sh"
echo "Health: curl -s http://127.0.0.1/api/health"
