-- ============================================================
-- Avaliações verificadas por QR code (valem 10× mais no rating)
-- ============================================================

-- 1. Coluna na tabela de avaliações
ALTER TABLE qc_avaliacoes
  ADD COLUMN IF NOT EXISTS via_qr boolean NOT NULL DEFAULT false;

-- 2. Função de média ponderada — QR vale 10×, normal vale 1×
CREATE OR REPLACE FUNCTION qc_capivaras_ponderado(p_slug text)
RETURNS numeric LANGUAGE sql STABLE AS $$
  SELECT CASE
    WHEN SUM(CASE WHEN via_qr THEN 10 ELSE 1 END) = 0 THEN 0
    ELSE ROUND(
      SUM(nota::numeric * CASE WHEN via_qr THEN 10 ELSE 1 END)
      / SUM(CASE WHEN via_qr THEN 10 ELSE 1 END)
    , 1)
  END
  FROM qc_avaliacoes
  WHERE comercio_slug = p_slug;
$$;

-- 3. Trigger para manter comercios.capivaras e comercios.avaliacoes sincronizados
CREATE OR REPLACE FUNCTION qc_atualizar_rating()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_slug text;
BEGIN
  v_slug := COALESCE(NEW.comercio_slug, OLD.comercio_slug);

  UPDATE comercios
  SET
    capivaras  = qc_capivaras_ponderado(v_slug),
    avaliacoes = (
      SELECT COUNT(*)
      FROM qc_avaliacoes
      WHERE comercio_slug = v_slug
    )
  WHERE slug = v_slug;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_qc_rating ON qc_avaliacoes;
CREATE TRIGGER trg_qc_rating
AFTER INSERT OR UPDATE OR DELETE ON qc_avaliacoes
FOR EACH ROW EXECUTE FUNCTION qc_atualizar_rating();
