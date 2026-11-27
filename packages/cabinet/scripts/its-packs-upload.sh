#!/usr/bin/env bash
# Put the four ITS packs on the VM's data disk, where every hyperties release links to them
# (packages/cabinet/its/README.md). Run from a laptop that has them; run again after a rebuild.
# Each pack goes over gzipped (about 25 MB instead of 82), is unpacked beside the old one and
# checked against its sha1, and only then renamed over it.
#
#   bash packages/cabinet/scripts/its-packs-upload.sh [workdir]
set -euo pipefail

DIR="${1:-$HOME/GroundUp/git/its/dl/pdp10-ka}"
PROJECT="${GCP_PROJECT:-ebike-safari}"
ZONE="${GCP_ZONE:-europe-west4-a}"
INSTANCE="${GCP_INSTANCE:-ebike-safari-1}"
DEST=/data/releases/hyperties/packs/its
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

remote() { gcloud compute ssh "$INSTANCE" --zone="$ZONE" --project="$PROJECT" --command="$1"; }

remote "sudo mkdir -p $DEST && mkdir -p /tmp/its-packs"
for n in 0 1 2 3; do
	f="rp03.$n"
	sum="$(shasum "$DIR/$f" | cut -d' ' -f1)"
	echo "$f: $sum"
	gzip -c "$DIR/$f" >"$TMP/$f.gz"
	gcloud compute scp "$TMP/$f.gz" "$INSTANCE:/tmp/its-packs/$f.gz" --zone="$ZONE" --project="$PROJECT"
	remote "set -e; gunzip -c /tmp/its-packs/$f.gz | sudo tee $DEST/$f.new >/dev/null
		test \"\$(sha1sum $DEST/$f.new | cut -d' ' -f1)\" = $sum
		sudo chmod 644 $DEST/$f.new && sudo mv $DEST/$f.new $DEST/$f && rm /tmp/its-packs/$f.gz"
done
remote "ls -l $DEST"
