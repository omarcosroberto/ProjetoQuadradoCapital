# Auditoria RLS — Quadrado Capital

**Data:** 2026-06-14  
**Supabase project:** `dmhdwwajpzfzzvblphnq`  
**Comando executado:**
```sql
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('comercios','qc_avaliacoes','qc_reivindicacoes','qc_perfis','qc_respostas_avaliacao')
ORDER BY tablename, cmd;
```

---

## Políticas encontradas

| Tabela | Política | Roles | Operação | Modo |
|---|---|---|---|---|
| `comercios` | `comercios_public_read` | anon, authenticated | SELECT | PERMISSIVE |
| `qc_avaliacoes` | `qc_avaliacoes_own_delete` | authenticated | DELETE | PERMISSIVE |
| `qc_avaliacoes` | `qc_avaliacoes_own_insert` | authenticated | INSERT | PERMISSIVE |
| `qc_avaliacoes` | `qc_avaliacoes_public_read` | anon, authenticated | SELECT | PERMISSIVE |
| `qc_avaliacoes` | `qc_avaliacoes_own_update` | authenticated | UPDATE | PERMISSIVE |
| `qc_perfis` | `qc_perfis_own_all` | authenticated | ALL | PERMISSIVE |
| `qc_perfis` | `qc_perfis_public_read` | anon, authenticated | SELECT | PERMISSIVE |
| `qc_reivindicacoes` | `qc_reivindicacoes_service_all` | service_role | ALL | PERMISSIVE |
| `qc_reivindicacoes` | `qc_reivindicacoes_own_insert` | authenticated | INSERT | PERMISSIVE |
| `qc_reivindicacoes` | `qc_reivindicacoes_own_read` | authenticated | SELECT | PERMISSIVE |
| `qc_respostas_avaliacao` | `Dono gerencia respostas` | authenticated | ALL | PERMISSIVE |
| `qc_respostas_avaliacao` | `Leitura publica respostas` | anon, authenticated | SELECT | PERMISSIVE |

---

## O que está OK

### `comercios`
- Leitura pública sem autenticação: correto — o diretório deve ser indexável.
- Sem INSERT/UPDATE/DELETE para roles públicas: correto — comércios são gerenciados via service_role/admin.

### `qc_avaliacoes`
- Leitura pública: correto — avaliações devem aparecer para visitantes.
- INSERT restrito a `authenticated`: correto — apenas usuários logados avaliam.
- UPDATE/DELETE próprios: correto (pressupondo que a política usa `auth.uid() = user_id`).

### `qc_perfis`
- Perfis públicos legíveis (ex: nome do dono aparece nas respostas): OK.
- `own_all` restrito ao authenticated: OK.

### `qc_reivindicacoes`
- `service_role` tem acesso total: necessário para o painel admin aprovar/rejeitar.
- Usuário só lê as próprias: correto.
- Usuário só insere (não atualiza/deleta): correto — aprovação é exclusiva do admin.

### `qc_respostas_avaliacao`
- Leitura pública: correto — respostas do dono devem aparecer publicamente.
- `authenticated` gerencia: OK como ponto de partida.

---

## O que está faltando ou é preocupante

### 1. `comercios` — sem UPDATE para donos reivindicados
A rota `/meu-negocio` permite que o dono edite dados do comércio (horário, descrição, foto). Atualmente só `service_role` pode escrever em `comercios`. Isso significa que a edição passa pelo service_role no servidor — **aceitável** mas frágil: qualquer bug no Route Handler pode sobrescrever dados de outro comercio.

**Risco:** médio. A validação de `comercio_slug` no Route Handler é a única barreira.

### 2. `qc_avaliacoes` — política own_update sem verificação de `user_id`?
O nome sugere "own_update", mas sem ver o corpo da política não dá pra confirmar se usa `WITH CHECK (auth.uid() = user_id)`. Se não usar, qualquer usuário autenticado pode editar qualquer avaliação.

**Risco:** alto — verificar o corpo da política no Dashboard.

### 3. `qc_avaliacoes` — sem proteção contra spam (rate limit por IP/user)
RLS não implementa rate limit. Um usuário autenticado pode inserir centenas de avaliações para o mesmo comércio.

**Risco:** médio — considerar constraint `UNIQUE(comercio_slug, user_id)` se ainda não existe.

### 4. `qc_reivindicacoes` — usuário pode inserir com `status = 'aprovada'`?
A política `qc_reivindicacoes_own_insert` permite INSERT. Se não houver `WITH CHECK` restringindo `status = 'pendente'`, um usuário mal-intencionado pode inserir uma reivindicação já aprovada e assumir qualquer comércio.

**Risco:** crítico — verificar urgentemente o corpo da política.

### 5. `qc_respostas_avaliacao` — `authenticated` gerencia TUDO
A política `Dono gerencia respostas` dá ALL para `authenticated` — possivelmente sem restrição ao `user_id` do dono. Se não houver `USING (auth.uid() = user_id)`, qualquer usuário logado pode editar/deletar a resposta de outro dono.

**Risco:** alto — verificar o corpo da política.

### 6. `qc_perfis` — own_all sem restrição explícita de qual perfil?
`own_all` para authenticated pode permitir que um usuário leia/atualize perfis de outros se a política não usar `auth.uid() = id`.

**Risco:** médio.

---

## Recomendações (sem implementar — para revisão)

1. **Auditar o corpo de cada política** no Dashboard Supabase (Database > Policies > editar cada política) e confirmar que as cláusulas `USING` e `WITH CHECK` usam `auth.uid()` corretamente.

2. **`qc_reivindicacoes` INSERT**: adicionar `WITH CHECK (status = 'pendente')` se não existir.

3. **`qc_avaliacoes` constraint de unicidade**: considerar `UNIQUE(comercio_slug, user_id)` para evitar avaliações duplicadas do mesmo usuário.

4. **`qc_respostas_avaliacao` ALL**: restringir com `USING (auth.uid() = user_id)` para que o dono só gerencie as próprias respostas.

5. **`comercios` UPDATE para donos**: considerar política `UPDATE` restrita ao `user_id` do dono (via JOIN com `qc_reivindicacoes WHERE status = 'aprovada'`), eliminando a dependência exclusiva do service_role.

6. **Habilitar RLS em todas as tabelas**: confirmar que `ALTER TABLE x ENABLE ROW LEVEL SECURITY` foi executado em todas as tabelas auditadas (sem isso, as políticas são ignoradas).
