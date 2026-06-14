
-- Gerado por seed-acumulado.sh em Sun Jun 14 03:26:52 MDT 2026


insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('310s-d-1', 'Contato PRO', 'Loja de Eletrônicos', 'Sul', 310, 'D', 5.0, 0, 'Quadra CLS Q. 310 - Bloco D - Loja 02 à 20 - SHCS CLS 310 - Asa Sul, Brasília - DF, 70363-540', 'forte', 'ChIJBbB-8XaAWZMRdHChVXy2rV4', true),
  ('310s-a-1', 'Ultra Som Eletronica, Brasilia', 'Restaurante', 'Sul', 310, 'A', 5.0, 0, '310 - SHCS CLS 310 30 - Asa Sul, Brasília - DF, 70363-000', 'forte', 'ChIJq6rqcu86WpMRbmCsFtFiCqk', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('313s-b-1', '313 Drink Bar', 'Bar', 'Sul', 313, 'B', 5.0, 0, 'SHCS CLS 313 bloco B loja 1 - Asa Sul, Brasília - DF, 70382-520', 'forte', 'ChIJHfaYThIvWpMR8P1S8vWeW7I', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('109n-a-1', 'Avanzzo 109 Norte', 'Loja de Roupas', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 LOJA 05 - Asa Norte, Brasília - DF, 70752-530', 'forte', 'ChIJ__zIt747WpMRPu33_bn_1I0', true),
  ('109n-a-2', 'Apartamento Verde Real', 'Restaurante', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 BL D ss 07 - Asa Norte, Brasília - DF, 70752-540', 'forte', 'ChIJIVjXWuc7WpMR7_zBVLEZkD0', true),
  ('109n-a-3', 'Express Distribuidora, Conveniência e Mercearia', 'Mercado', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 B. A Loja 06 - Asa Norte, Brasília - DF, 70752-510', 'forte', 'ChIJwQHnWTo7WpMRDl_eyJ-SPuE', true),
  ('109n-a-4', 'Mercearia Alto Parnaíba', 'Restaurante', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 Loja 31 - Asa Norte, Brasília - DF, 70752-530', 'forte', 'ChIJLUa-J247WpMRkCauYOzYzM0', true),
  ('109n-a-5', 'Cantinho da Batata Brasilia', 'Restaurante', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 Frente para residencial, BL D LOJA 51 - Asa Norte, Brasília - DF, 70752-540', 'forte', 'ChIJuVHjX347WpMRpMuXv8dlj0w', true),
  ('109n-b-1', 'The Plant - Asa Norte', 'Restaurante', 'Norte', 109, 'B', 5.0, 0, 'SHCN CLN 109 Bloco B Loja 15 - Asa Norte, Brasília - DF, 70752-520', 'forte', 'ChIJDfGUOqo7WpMRYE9VZ1MiNYc', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('404n-a-1', 'Barbearia 404 Norte', 'Barbearia', 'Norte', 404, 'A', 5.0, 0, 'SHCN CLN 404 BL C Loja 62 - Plano Piloto, Brasília - DF, 70845-530', 'forte', 'ChIJa-SlQw87WpMRtMi3nkvuM_w', true),
  ('404n-a-2', 'Espaço Aconchego Brasília', 'Academia', 'Norte', 404, 'A', 5.0, 0, 'SHCN CLN 404 BL D - Asa Norte, Brasília - DF, 70845-500', 'forte', 'ChIJBe-6NgA7WpMR4V1YT7wNULQ', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('410n-a-1', '410/411 norte', 'Restaurante', 'Norte', 410, 'A', 5.0, 0, 'SHCN CLN 410 - Asa Norte, Brasília - DF, 70865-520', 'forte', 'ChIJVZ3EKM07WpMRwDYw65XcBN0', true),
  ('410n-a-2', 'Rebras Uti dos Reparos 410 norte', 'Restaurante', 'Norte', 410, 'A', 5.0, 0, 'SHCN SCLN 410 BL A lojas 8/12 Térreo - Plano Piloto, Brasília - DF, 70865-510', 'forte', 'ChIJZ8_UItQ7WpMRv216TkG9tgM', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('411n-a-1', 'Restaurante O Kilão', 'Restaurante', 'Norte', 411, 'A', 5.0, 0, 'SHCN CLN 411 BL A loja 69 - Plano Piloto, Brasília - DF, 70866-510', 'forte', 'ChIJS_Y31zI6WpMRr2sR2HffYEw', true),
  ('411n-a-2', 'Restaurante Careca', 'Restaurante', 'Norte', 411, 'A', 5.0, 0, 'Lj. 2, 70866-520 - SHCN CLN 411 - Plano Piloto, Brasília - DF, 70866-130', 'forte', 'ChIJ2TlJ0zI6WpMR6B2CCyX7zYk', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('412n-a-1', 'Blend Boucherie', 'Restaurante', 'Norte', 412, 'A', 5.0, 0, 'SHCN CLN 412 - Asa Norte, Brasília - DF, 70867-520', 'forte', 'ChIJ9d6twRk7WpMRBhgzxx1nUHY', true),
  ('412n-a-2', 'Mercearia Colaborativa Asa Norte', 'Restaurante', 'Norte', 412, 'A', 5.0, 0, 'SHCN CLN 412 BL E LOJA 4, 6, 10 - Plano Piloto, Brasília - DF, 70867-550', 'forte', 'ChIJJaZIpiw6WpMRphHyFn2xh90', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

