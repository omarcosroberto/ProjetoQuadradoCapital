#!/bin/bash
# Agenda o enriquecimento do QC para rodar às 21h (horário de Brasília)
# Uso: bash scripts/agendar-enriquecimento.sh

set -euo pipefail

PROJETO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$PROJETO_DIR/scripts/enrich-cron.log"
NODE_BIN="$(command -v node)"

if [ -z "$NODE_BIN" ]; then
  echo "❌ node não encontrado no PATH atual — ajuste NODE_BIN manualmente." >&2
  exit 1
fi

# Carrega as credenciais do .env.local em vez de hardcodar no script
set -a
source "$PROJETO_DIR/.env.local"
set +a

CRON_CMD="cd $PROJETO_DIR && NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY $NODE_BIN scripts/enrich-places.mjs >> $LOG 2>&1"

# Remove cron anterior do QC (se existir) e adiciona novo às 21h
(crontab -l 2>/dev/null | grep -v "enrich-places.mjs" || true; echo "0 21 * * * $CRON_CMD") | crontab -

echo "✅ Agendado para rodar todos os dias às 21h"
echo "   Log: $LOG"
echo ""
echo "Para verificar: crontab -l | grep enrich"
echo "Para cancelar:  crontab -l | grep -v enrich-places.mjs | crontab -"
