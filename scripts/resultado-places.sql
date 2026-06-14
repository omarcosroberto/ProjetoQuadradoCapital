-- Gerado por scripts/seed-places.mjs em 2026-06-14T09:51:46.619Z
-- 1 comércios encontrados via Google Places API

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('412n-a-3', 'Mercearia Colaborativa Asa Norte', 'Restaurante', 'Norte', 412, 'A', 5.0, 0, 'SHCN CLN 412 BL E LOJA 4, 6, 10 - Plano Piloto, Brasília - DF, 70867-550', 'forte', 'ChIJJaZIpiw6WpMRphHyFn2xh90', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();
