-- Campos de nota fiscal para avaliações verificadas via QR
ALTER TABLE qc_avaliacoes
  ADD COLUMN IF NOT EXISTS nf_numero text,   -- número/série da nota fiscal
  ADD COLUMN IF NOT EXISTS nf_data   date;   -- data de emissão da nota fiscal
