-- ============================================================
-- Reivindicado + Dono + Respostas de avaliação + bucket fotos
-- ============================================================

-- 1. Adiciona colunas de vínculo dono → comércio
ALTER TABLE comercios
  ADD COLUMN IF NOT EXISTS reivindicado boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dono_id uuid REFERENCES auth.users(id);

-- 2. Tabela de respostas do dono às avaliações
CREATE TABLE IF NOT EXISTS qc_respostas_avaliacao (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliacao_id uuid       NOT NULL REFERENCES qc_avaliacoes(id) ON DELETE CASCADE,
  dono_id     uuid        NOT NULL REFERENCES auth.users(id),
  texto       text        NOT NULL CHECK (char_length(texto) <= 500),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(avaliacao_id)
);

ALTER TABLE qc_respostas_avaliacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dono gerencia respostas" ON qc_respostas_avaliacao;
CREATE POLICY "Dono gerencia respostas" ON qc_respostas_avaliacao
  FOR ALL TO authenticated
  USING  (dono_id = auth.uid())
  WITH CHECK (dono_id = auth.uid());

DROP POLICY IF EXISTS "Leitura publica respostas" ON qc_respostas_avaliacao;
CREATE POLICY "Leitura publica respostas" ON qc_respostas_avaliacao
  FOR SELECT TO anon, authenticated
  USING (true);

-- 3. Bucket público para fotos dos comércios (criado via service_role no server action)
-- Executar via Dashboard > Storage se preferir UI, ou o server action cria automaticamente
INSERT INTO storage.buckets (id, name, public)
VALUES ('qc-comercios', 'qc-comercios', true)
ON CONFLICT (id) DO NOTHING;
