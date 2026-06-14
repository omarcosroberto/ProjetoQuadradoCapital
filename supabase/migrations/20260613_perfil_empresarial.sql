-- ============================================================
-- Perfil empresarial + documentos de reivindicação
-- ============================================================

-- 1. Campos de perfil empresarial em qc_perfis
ALTER TABLE qc_perfis
  ADD COLUMN IF NOT EXISTS tipo_perfil text NOT NULL DEFAULT 'comum'
    CHECK (tipo_perfil IN ('comum', 'empresarial')),
  ADD COLUMN IF NOT EXISTS celular text,
  ADD COLUMN IF NOT EXISTS documento text;  -- CPF (11 dígitos) ou CNPJ (14 dígitos)

-- 2. Campos de documentos na tabela de reivindicações
ALTER TABLE qc_reivindicacoes
  ADD COLUMN IF NOT EXISTS doc_cnpj_url text,
  ADD COLUMN IF NOT EXISTS doc_alvara_url text,
  ADD COLUMN IF NOT EXISTS doc_vinculo_url text;

-- 3. Storage bucket para documentos (executar via Dashboard > Storage se preferir UI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('qc-documentos', 'qc-documentos', false)
--   ON CONFLICT (id) DO NOTHING;

-- 4. Políticas RLS para o bucket qc-documentos
-- Usuários autenticados podem fazer upload na própria pasta
-- CREATE POLICY "Dono pode upload" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'qc-documentos' AND (storage.foldername(name))[1] = 'reivindicacoes');

-- CREATE POLICY "Admins podem ver docs" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id = 'qc-documentos');
