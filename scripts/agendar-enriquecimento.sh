#!/bin/bash
# Agenda o enriquecimento do QC para rodar às 21h (horário de Brasília)
# Uso: bash scripts/agendar-enriquecimento.sh

PROJETO_DIR="/Users/marcosrobertoss/projeto3/quadrado-capital"
LOG="$PROJETO_DIR/scripts/enrich-cron.log"
SUPABASE_URL="https://dmhdwwajpzfzzvblphnq.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaGR3d2FqcHpmenp2YmxwaG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDIzMzcsImV4cCI6MjA5Njc3ODMzN30.8B77Xr2yriw-DrRi4jHQJExnECraPs8NHWnXkju4ImQ"

CRON_CMD="cd $PROJETO_DIR && NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY node scripts/enrich-places.mjs >> $LOG 2>&1"

# Remove cron anterior do QC (se existir) e adiciona novo às 21h
(crontab -l 2>/dev/null | grep -v "enrich-places.mjs"; echo "0 21 * * * $CRON_CMD") | crontab -

echo "✅ Agendado para rodar todos os dias às 21h"
echo "   Log: $LOG"
echo ""
echo "Para verificar: crontab -l | grep enrich"
echo "Para cancelar:  crontab -l | grep -v enrich-places.mjs | crontab -"
