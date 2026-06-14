#!/bin/bash
# Seed acumulado: roda seed-places.mjs por quadra e acumula o SQL no mesmo arquivo.
# As quadras que precisam de mais comércios (< 3 em 2026-06-14).

set -e
NODE="/Users/marcosrobertoss/.nvm/versions/node/v24.16.0/bin/node"
PROJ="/Users/marcosrobertoss/projeto3/quadrado-capital"
LOG="$PROJ/scripts/seed-vazias.log"
KEY="AIzaSyBWXhoPET91lWcjEw4HD1-WtlNBpHt28tM"
OUT="$PROJ/scripts/resultado-acumulado.sql"

echo "" > "$OUT"  # zera o arquivo acumulador
echo "-- Gerado por seed-acumulado.sh em $(date)" >> "$OUT"
echo "" >> "$OUT"

run_quadra() {
  local asa=$1
  local q=$2
  echo "$(date) — $asa $q" >> "$LOG"
  rm -f "$PROJ/scripts/resultado-places.sql"  # limpa antes para não reutilizar resultado anterior
  GOOGLE_MAPS_API_KEY=$KEY "$NODE" "$PROJ/scripts/seed-places.mjs" --asa "$asa" --de "$q" --ate "$q" >> "$LOG" 2>&1
  # Acumula SQL desta rodada no arquivo mestre (pula linhas de comentário)
  if [ -f "$PROJ/scripts/resultado-places.sql" ]; then
    grep -v "^--" "$PROJ/scripts/resultado-places.sql" >> "$OUT" || true
  fi
  sleep 0.5
}

echo "$(date) — Iniciando seed acumulado" >> "$LOG"

# Sul
for q in 106 310 313 403 506 509 513; do
  run_quadra sul "$q"
done

# Norte
for q in 102 109 201 214 303 403 404 410 411 412; do
  run_quadra norte "$q"
done

echo "" >> "$OUT"
echo "$(date) — Seed acumulado concluído. SQL em: $OUT" >> "$LOG"

INSERTS=$(grep -c "INSERT INTO" "$OUT" 2>/dev/null || echo "0")
echo "✅ Pronto. $INSERTS inserções em $OUT"
