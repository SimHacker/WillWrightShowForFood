#!/usr/bin/env bash
# One-time bootstrap for Ubuntu 24.04 LTS on GCP (e2-medium or similar).
# Run as root or with sudo on a fresh VM.
set -euo pipefail

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
	echo "Run with sudo: sudo bash scripts/vm-bootstrap.sh"
	exit 1
fi

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y ca-certificates curl git ufw rsync

# Docker Engine + Compose plugin (official repo)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
	$(. /etc/os-release && echo "${VERSION_CODENAME:-noble}") stable" \
	| tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Deploy user (optional — replace with your login)
DEPLOY_USER="${DEPLOY_USER:-$SUDO_USER}"
if [[ -n "$DEPLOY_USER" ]] && id "$DEPLOY_USER" &>/dev/null; then
	usermod -aG docker "$DEPLOY_USER"
fi

# Firewall: SSH + HTTP + HTTPS only
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "Bootstrap done."
echo "  1. Log out and back in (docker group) if needed"
echo "  2. Clone WillWrightShowForFood, cd apps/ebike-safari/deploy"
echo "  3. cp .env.example .env && edit secrets"
echo "  4. bash scripts/deploy.sh"
