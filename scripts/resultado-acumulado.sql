
-- Gerado por seed-acumulado.sh em Sun Jun 14 03:51:30 MDT 2026


insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('310s-d-2', 'Contato PRO', 'Loja de Eletrônicos', 'Sul', 310, 'D', 5.0, 0, 'Quadra CLS Q. 310 - Bloco D - Loja 02 à 20 - SHCS CLS 310 - Asa Sul, Brasília - DF, 70363-540', 'forte', 'ChIJBbB-8XaAWZMRdHChVXy2rV4', true),
  ('310s-a-2', 'Ultra Som Eletronica, Brasilia', 'Restaurante', 'Sul', 310, 'A', 5.0, 0, '310 - SHCS CLS 310 30 - Asa Sul, Brasília - DF, 70363-000', 'forte', 'ChIJq6rqcu86WpMRbmCsFtFiCqk', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('313s-b-2', '313 Drink Bar', 'Bar', 'Sul', 313, 'B', 5.0, 0, 'SHCS CLS 313 bloco B loja 1 - Asa Sul, Brasília - DF, 70382-520', 'forte', 'ChIJHfaYThIvWpMR8P1S8vWeW7I', true),
  ('313s-a-1', 'Studio Simone Mendes', 'Salão de Beleza', 'Sul', 313, 'A', 5.0, 0, 'SHCS CLS 313 BL D Loja 5A - Asa Sul, Brasília - DF, 70390-100', 'forte', 'ChIJEV6PPeM7WpMRHKavH7I-uwg', true),
  ('313s-a-2', 'Clínica Elegance Estética', 'Restaurante', 'Sul', 313, 'A', 5.0, 0, 'SHCS CLS 313 bloco A sobreloja 23 - Plano Piloto, Brasília - DF, 70382-510', 'forte', 'ChIJWWs_fUE7WpMRaARfWFFe0RI', true),
  ('313s-b-3', 'Armarinho e Cosméticos 313 Sul', 'Restaurante', 'Sul', 313, 'B', 5.0, 0, 'SHCS CLS 313 Bloco B Loja 33 - Asa Sul, Brasília - DF, 70382-520', 'forte', 'ChIJNQ92nO87WpMRp4_ErzqO9RQ', true),
  ('313s-a-3', 'Benvinda Cabeleireiros', 'Salão de Beleza', 'Sul', 313, 'A', 5.0, 0, 'CLS 313 Bl B - SHCS CLS 313 5 s/n - Plano Piloto, Brasília - DF, 70382-520', 'forte', 'ChIJEZEAeas6WpMRUFXO92IKU_Y', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('513s-c-2', 'Arte e Cores', 'Restaurante', 'Sul', 513, 'C', 5.0, 0, 'SHCS CLS 513 Entrada virada para, bloco C entrada 67, Edifício Rolimam sala 203 - Asa Sul, Brasília - DF, 70380-530', 'forte', 'ChIJE1yAz1M6WpMRMecztcjKoOM', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('109n-a-6', 'Avanzzo 109 Norte', 'Loja de Roupas', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 LOJA 05 - Asa Norte, Brasília - DF, 70752-530', 'forte', 'ChIJ__zIt747WpMRPu33_bn_1I0', true),
  ('109n-a-7', 'Apartamento Verde Real', 'Restaurante', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 BL D ss 07 - Asa Norte, Brasília - DF, 70752-540', 'forte', 'ChIJIVjXWuc7WpMR7_zBVLEZkD0', true),
  ('109n-a-8', 'Express Distribuidora, Conveniência e Mercearia', 'Mercado', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 B. A Loja 06 - Asa Norte, Brasília - DF, 70752-510', 'forte', 'ChIJwQHnWTo7WpMRDl_eyJ-SPuE', true),
  ('109n-a-9', 'Mercearia Alto Parnaíba', 'Restaurante', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 Loja 31 - Asa Norte, Brasília - DF, 70752-530', 'forte', 'ChIJLUa-J247WpMRkCauYOzYzM0', true),
  ('109n-a-10', 'Cantinho da Batata Brasilia', 'Restaurante', 'Norte', 109, 'A', 5.0, 0, 'SHCN CLN 109 Frente para residencial, BL D LOJA 51 - Asa Norte, Brasília - DF, 70752-540', 'forte', 'ChIJuVHjX347WpMRpMuXv8dlj0w', true),
  ('109n-b-2', 'The Plant - Asa Norte', 'Restaurante', 'Norte', 109, 'B', 5.0, 0, 'SHCN CLN 109 Bloco B Loja 15 - Asa Norte, Brasília - DF, 70752-520', 'forte', 'ChIJDfGUOqo7WpMRYE9VZ1MiNYc', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('404n-a-3', 'Barbearia 404 Norte', 'Barbearia', 'Norte', 404, 'A', 5.0, 0, 'SHCN CLN 404 BL C Loja 62 - Plano Piloto, Brasília - DF, 70845-530', 'forte', 'ChIJa-SlQw87WpMRtMi3nkvuM_w', true),
  ('404n-a-4', 'Espaço Aconchego Brasília', 'Academia', 'Norte', 404, 'A', 5.0, 0, 'SHCN CLN 404 BL D - Asa Norte, Brasília - DF, 70845-500', 'forte', 'ChIJBe-6NgA7WpMR4V1YT7wNULQ', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('410n-a-3', '410/411 norte', 'Restaurante', 'Norte', 410, 'A', 5.0, 0, 'SHCN CLN 410 - Asa Norte, Brasília - DF, 70865-520', 'forte', 'ChIJVZ3EKM07WpMRwDYw65XcBN0', true),
  ('410n-a-4', 'Rebras Uti dos Reparos 410 norte', 'Restaurante', 'Norte', 410, 'A', 5.0, 0, 'SHCN SCLN 410 BL A lojas 8/12 Térreo - Plano Piloto, Brasília - DF, 70865-510', 'forte', 'ChIJZ8_UItQ7WpMRv216TkG9tgM', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('411n-a-3', 'Restaurante O Kilão', 'Restaurante', 'Norte', 411, 'A', 5.0, 0, 'SHCN CLN 411 BL A loja 69 - Plano Piloto, Brasília - DF, 70866-510', 'forte', 'ChIJS_Y31zI6WpMRr2sR2HffYEw', true),
  ('411n-a-4', 'Restaurante Careca', 'Restaurante', 'Norte', 411, 'A', 5.0, 0, 'Lj. 2, 70866-520 - SHCN CLN 411 - Plano Piloto, Brasília - DF, 70866-130', 'forte', 'ChIJ2TlJ0zI6WpMR6B2CCyX7zYk', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
  ('412n-a-3', 'Mercearia Colaborativa Asa Norte', 'Restaurante', 'Norte', 412, 'A', 5.0, 0, 'SHCN CLN 412 BL E LOJA 4, 6, 10 - Plano Piloto, Brasília - DF, 70867-550', 'forte', 'ChIJJaZIpiw6WpMRphHyFn2xh90', true)
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();

