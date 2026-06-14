#!/bin/bash
# Seed das 51 quadras sem nenhum comércio cadastrado
# Prioriza as quadras mais centrais primeiro
# Quota: 51 SearchTextRequests — cabe em 1 projeto (100/dia)

set -e
PROJ="/Users/marcosrobertoss/projeto3/quadrado-capital"
LOG="$PROJ/scripts/seed-vazias.log"
KEY="AIzaSyBWXhoPET91lWcjEw4HD1-WtlNBpHt28tM"  # quadrado-capital project

echo "$(date) — Iniciando seed das quadras vazias" >> "$LOG"

# Sul
for q in 101 301 311 316 401 416 501 502 503 504 505 507 508 510 511 512 514 515 516; do
  echo "$(date) — sul $q" >> "$LOG"
  GOOGLE_MAPS_API_KEY=$KEY node "$PROJ/scripts/seed-places.mjs" --asa sul --de $q --ate $q >> "$LOG" 2>&1
  sleep 0.5
done

# Norte
for q in 101 103 202 203 301 302 314 315 401 402 406 407 409 414 415 416 501 502 503 504 505 506 507 508 509 510 511 512 513 514 515 516; do
  echo "$(date) — norte $q" >> "$LOG"
  GOOGLE_MAPS_API_KEY=$KEY node "$PROJ/scripts/seed-places.mjs" --asa norte --de $q --ate $q >> "$LOG" 2>&1
  sleep 0.5
done

echo "$(date) — Seed concluído" >> "$LOG"

# Aplicar SQL gerado no banco via supabase
if [ -f "$PROJ/scripts/resultado-places.sql" ]; then
  echo "$(date) — Aplicando SQL no banco" >> "$LOG"
  cd "$PROJ" && npx supabase db push --db-url "$(grep SUPABASE_DB_URL .env.local | cut -d= -f2-)" >> "$LOG" 2>&1 || true
fi

echo "✅ Seed das quadras vazias concluído. Ver $LOG"
