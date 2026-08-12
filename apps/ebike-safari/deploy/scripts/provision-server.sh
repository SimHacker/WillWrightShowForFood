#!/usr/bin/env bash
# Provision GCP VM + DNS for ebike-safari.com (run from laptop with gcloud).
set -euo pipefail

PROJECT="${GCP_PROJECT:-ebike-safari}"
REGION="${GCP_REGION:-europe-west4}"
ZONE="${GCP_ZONE:-europe-west4-a}"
INSTANCE="${GCP_INSTANCE:-ebike-safari-1}"
IP_NAME="${GCP_IP_NAME:-ebike-safari-ip}"
SA_NAME="${GCP_SA_NAME:-ebike-safari-vm}"
DNS_ZONE="${GCP_DNS_ZONE:-ebike-safari-com}"
DOMAIN="${DOMAIN:-ebike-safari.com}"

gcloud config set project "$PROJECT"

if ! gcloud iam service-accounts describe "${SA_NAME}@${PROJECT}.iam.gserviceaccount.com" &>/dev/null; then
	gcloud iam service-accounts create "$SA_NAME" --display-name="Ebike Safari VM"
fi
SA_EMAIL="${SA_NAME}@${PROJECT}.iam.gserviceaccount.com"

if ! gcloud compute firewall-rules describe allow-ebike-http --project="$PROJECT" &>/dev/null; then
	gcloud compute firewall-rules create allow-ebike-http \
		--project="$PROJECT" \
		--direction=INGRESS \
		--priority=1000 \
		--network=default \
		--action=ALLOW \
		--rules=tcp:80,tcp:443 \
		--source-ranges=0.0.0.0/0 \
		--target-tags=http-server,https-server
fi

if ! gcloud compute addresses describe "$IP_NAME" --region="$REGION" --project="$PROJECT" &>/dev/null; then
	gcloud compute addresses create "$IP_NAME" --region="$REGION" --project="$PROJECT"
fi
STATIC_IP=$(gcloud compute addresses describe "$IP_NAME" --region="$REGION" --project="$PROJECT" --format='value(address)')
echo "Static IP: $STATIC_IP"

if ! gcloud compute instances describe "$INSTANCE" --zone="$ZONE" --project="$PROJECT" &>/dev/null; then
	gcloud compute instances create "$INSTANCE" \
		--project="$PROJECT" \
		--zone="$ZONE" \
		--machine-type=e2-medium \
		--tags=http-server,https-server \
		--address="$STATIC_IP" \
		--service-account="$SA_EMAIL" \
		--scopes=https://www.googleapis.com/auth/cloud-platform \
		--image-family=ubuntu-2404-lts-amd64 \
		--image-project=ubuntu-os-cloud \
		--boot-disk-size=100GB \
		--metadata=enable-oslogin=TRUE
fi

gcloud dns record-sets transaction start --zone="$DNS_ZONE" --project="$PROJECT"
for name in "$DOMAIN" "www.${DOMAIN}"; do
	gcloud dns record-sets transaction remove --zone="$DNS_ZONE" --project="$PROJECT" \
		--name="${name}." --type=A --ttl=300 "${STATIC_IP}" 2>/dev/null || true
	gcloud dns record-sets transaction add --zone="$DNS_ZONE" --project="$PROJECT" \
		--name="${name}." --type=A --ttl=300 "${STATIC_IP}"
done
gcloud dns record-sets transaction execute --zone="$DNS_ZONE" --project="$PROJECT"

echo ""
echo "VM: $INSTANCE ($ZONE) -> $STATIC_IP"
echo "DNS A records set for $DOMAIN and www.$DOMAIN"
