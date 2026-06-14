#!/bin/bash
# Seed das quadras com menos de 3 comércios (estado em 2026-06-14)
# Quadras Sul:  106, 310, 313, 403, 506, 509, 513
# Quadras Norte: 102, 109, 201, 214, 303, 403, 404, 410, 411, 412

set -e
NODE="/Users/marcosrobertoss/.nvm/versions/node/v24.16.0/bin/node"
PROJ="/Users/marcosrobertoss/projeto3/quadrado-capital"
LOG="$PROJ/scripts/seed-vazias.log"
KEY="AIzaSyBWXhoPET91lWcjEw4HD1-WtlNBpHt28tM"

echo "$(date) — Iniciando seed das quadras rascunho (<3 comércios)" >> "$LOG"

# Sul
for q in 106 310 313 403 506 509 513; do
  echo "$(date) — sul $q" >> "$LOG"
  GOOGLE_MAPS_API_KEY=$KEY "$NODE" "$PROJ/scripts/seed-places.mjs" --asa sul --de $q --ate $q >> "$LOG" 2>&1
  sleep 0.5
done

# Norte
for q in 102 109 201 214 303 403 404 410 411 412; do
  echo "$(date) — norte $q" >> "$LOG"
  GOOGLE_MAPS_API_KEY=$KEY "$NODE" "$PROJ/scripts/seed-places.mjs" --asa norte --de $q --ate $q >> "$LOG" 2>&1
  sleep 0.5
done

echo "$(date) — Seed rascunho concluído" >> "$LOG"
echo "✅ Pronto. SQL gerado em scripts/resultado-places.sql"
