#!/usr/bin/env bash
# ============================================================
# new-project.sh
#
# Provisions a new site from this template:
#   1. Prompts for project name, domain, Sanity dataset name
#   2. Updates package.json + .env.local
#   3. Creates a Sanity project (interactive)
#   4. Links to a Vercel project + pushes env vars
#   5. Prints a checklist of remaining manual steps
#
# Requires (install first):
#   - gh        (https://cli.github.com)
#   - vercel    (npm i -g vercel)
#   - sanity    (npm i -g sanity@latest)
#   - pnpm      (npm i -g pnpm)  — or swap for npm/yarn below
# ============================================================
set -euo pipefail

# ---- helpers ----
bold() { printf "\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "\033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "\033[33m!\033[0m %s\n" "$1"; }
die()  { printf "\033[31m✗ %s\033[0m\n" "$1"; exit 1; }

ask() {
  local var_name=$1 prompt=$2 default=${3:-}
  local input
  if [ -n "$default" ]; then
    read -r -p "$prompt [$default]: " input
    input=${input:-$default}
  else
    read -r -p "$prompt: " input
  fi
  printf -v "$var_name" "%s" "$input"
}

# ---- preflight ----
bold "==> Checking required CLIs"
for cmd in gh vercel sanity pnpm; do
  command -v "$cmd" >/dev/null 2>&1 || die "Missing CLI: $cmd"
done
ok "All CLIs present"

# ---- gather inputs ----
bold "==> Project details"
ask PROJECT_NAME "Project name (kebab-case)" "my-new-site"
ask SITE_NAME    "Display name"               "$PROJECT_NAME"
ask DOMAIN       "Production domain"          "$PROJECT_NAME.com"
ask SANITY_DATASET "Sanity dataset"           "production"

# ---- update package.json + create .env.local ----
bold "==> Writing config files"
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.name = '$PROJECT_NAME';
  pkg.version = '0.1.0';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"
ok "Updated package.json"

cp .env.example .env.local
# Pre-fill what we know
{
  echo ""
  echo "# Auto-filled by scripts/new-project.sh"
  echo "NEXT_PUBLIC_SITE_NAME=\"$SITE_NAME\""
  echo "NEXT_PUBLIC_SITE_URL=https://$DOMAIN"
  echo "NEXT_PUBLIC_SANITY_DATASET=$SANITY_DATASET"
  echo "NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$DOMAIN"
} >> .env.local
ok "Wrote .env.local"

# ---- install deps ----
bold "==> Installing dependencies"
pnpm install

# ---- Sanity project ----
bold "==> Creating Sanity project"
warn "An interactive prompt will follow. Choose 'Create new project'."
sanity init --bare --dataset "$SANITY_DATASET"

# After init, Sanity writes the project id to ./sanity.cli.ts and .env files vary.
# We'll prompt the user to paste it to be safe:
ask SANITY_PROJECT_ID "Paste the Sanity Project ID it just created"
echo "NEXT_PUBLIC_SANITY_PROJECT_ID=$SANITY_PROJECT_ID" >> .env.local
ok "Linked Sanity project"

# ---- Vercel project ----
bold "==> Linking Vercel project"
vercel link --yes
ok "Linked Vercel project"

bold "==> Pushing env vars to Vercel (production)"
# Push everything from .env.local to Vercel production
while IFS='=' read -r key val; do
  # Skip comments and blanks
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  # Strip surrounding quotes from val
  val="${val%\"}"; val="${val#\"}"
  echo "$val" | vercel env add "$key" production --force 2>/dev/null || true
done < .env.local
ok "Pushed env vars"

# ---- final checklist ----
bold "==> Almost done. Manual steps remaining:"
cat <<EOF

  1. Plausible: add the site at plausible.io/sites and verify the snippet loads
  2. Sanity: add CORS origin for https://$DOMAIN at
       https://www.sanity.io/manage/project/$SANITY_PROJECT_ID/api
  3. Sanity: create a read token (Viewer role) and add as SANITY_API_READ_TOKEN
       in Vercel + .env.local
  4. Sanity: add the revalidate webhook
       URL:    https://$DOMAIN/api/revalidate
       Secret: generate one and add as SANITY_REVALIDATE_SECRET (both Vercel + Sanity)
  5. DNS: point $DOMAIN to Vercel (A 76.76.21.21 or CNAME cname.vercel-dns.com)
  6. Run: pnpm dev    → visit /studio to seed Site Settings + a home page
  7. Commit & push:   gh repo create $PROJECT_NAME --private --source=. --push

EOF
ok "Setup complete"
