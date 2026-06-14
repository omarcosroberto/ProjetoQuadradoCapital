# Plano de Execução — Holding MRP + Quadrado Capital

**Versão:** 2026-06-13 · 20h30 (Brasília)
**Autor:** Marcos Roberto · Consolidado de duas sessões + pesquisa de concorrentes (jun/2026)

---

## 0. REGRAS DE OPERAÇÃO (token-economia · qualidade)

1. **Uma sessão limpa por workstream.** Cole só o bloco `WS-x`. Use `/clear` entre workstreams.
2. **Reutilize a fundação de motion que já existe** (`components/reveal.tsx` + keyframes em `app/globals.css` do MRP). **Não** instale framer-motion/GSAP.
3. **Vídeo Hyperframes é caro.** Só onde agrega de verdade (máx. 1–2 por site). Para o resto, use `Reveal` + CSS (custo zero).
4. **Leia o mínimo.** Use `Grep`/`Glob`/`Explore` para localizar; só abra arquivo inteiro quando for editar.
5. **Batch.** Edições independentes na mesma leva. Não re-leia arquivo já editado.
6. **Modelo certo pro trabalho.** Scan/find → Haiku/Explore. Síntese/código crítico → Opus.
7. **Subagente só com paralelismo real.** Cada spawn re-deriva contexto = custo.
8. **Build antes de commit. Commit antes de deploy. Deploy só com OK.**

---

## 1. CONTEXTO & CAMINHOS (a holding inteira)

| Sigla | Caminho local | Repo GitHub | Stack | Domínio |
|---|---|---|---|---|
| **MRP** | `/Users/marcosrobertoss/projeto3/marcos-roberto-pro` | `omarcosroberto/marcos-roberto-pro` | Next 16 · React 19 · Tailwind v4 · Supabase | `marcosroberto.pro` |
| **QC** | `/Users/marcosrobertoss/projeto3/quadrado-capital` | `omarcosroberto/quadrado-capital` | Next · Tailwind v4 · Supabase | `quadradocapital.com.br` |
| **PPD** | `/Users/marcosrobertoss/projeto3/landing` | `omarcosroberto/plano-piloto-digital` | Next · Tailwind | `planopilotodigital.com.br` |
| **BB** | `/Users/marcosrobertoss/projeto2` | `omarcosroberto/brasiliabettas-saas` | Next · shadcn/ui · Supabase | (SaaS bettas) |

**Deploy QC:** `vercel --prod` (push **não** auto-deploya — deploy manual).
**Deploy MRP/PPD/BB:** auto-deploy na Vercel ao dar `git push main`.
**Time Vercel:** `team_XoQbVWUmIoet8to6Z2QKphFy`.
**Supabase QC:** projeto `dmhdwwajpzfzzvblphnq` · CLI: `supabase db query --linked -f <arquivo.sql>`.

**Ativos reutilizáveis do MRP:**
- `components/reveal.tsx` — scroll-reveal (IntersectionObserver, SSR-safe, `reduced-motion`).
- `app/globals.css` — keyframes `mrp-enter`, `mrp-glow`, `mrp-caret`, `mrp-ring`, reveal gated em `.js`.
- `app/layout.tsx` — script `.js` (no-flash) no `<head>`.
- `video/` — projeto Hyperframes. Render: `cd video && npx hyperframes render -o ../public/NOME.mp4 --resolution landscape --fps 30`.

---

## 2. INTELIGÊNCIA DE CONCORRENTE (pesquisada — não re-buscar)

### 2A. gmnmarketingdigitaldf.com
**Posicionamento:** "única agência de marketing digital em Brasília focada em tráfego qualificado". SEO local, GMaps, data-driven. 150+ negócios posicionados.

**Serviços que o MRP ainda não tem (incorporar no WS-3):**
- Fotos 360° / Tour Virtual
- Auditoria de Presença Digital
- Captação de Leads automatizada (funil 24/7)
- Posicionamento de Marca

**Silo de páginas (replicar no WS-2):**
- `/especialista-google-meu-negocio`
- `/gestor-google-meu-negocio-em-brasilia`
- `/gestao-google-meu-negocio`
- `/criacao-de-sites-seo`
- `/servicos-de-marketing-digital-em-brasilia`
- blog em `/agencia-de-marketing-digital-em-brasilia`

**Localidades alvo:** Brasília, DF, Taguatinga, Águas Claras, Vila Planalto, Asa Sul, Asa Norte + satélites.
**Prova social:** depoimentos por nicho (odonto, buffet, imobiliária, estética). → MRP precisa de seção de cases por nicho.

### 2B. gmnturbo.com.br
**Posicionamento:** "plataforma que transforma gestores de GMN em referência". +200 consultores.

| Módulo GMN Turbo | MRP já tem? | Ação (WS-5) |
|---|---|---|
| CRM Kanban (pipeline) | parcial (`painel/crm`) | virar Kanban |
| Follow-up Automático | ❌ | criar |
| Controle Financeiro | ✅ (`painel/financeiro`) | expandir metas |
| Agenda Turbo | ❌ | criar |
| Dashboard Analytics | parcial | enriquecer KPIs |
| Modo PAP 2.0 (prospecção porta-a-porta) | ❌ | criar |
| Tráfego Turbo (gestão de anúncios) | ❌ | fase 2 |
| Radar de Prospecção | ❌ | criar |
| Diagnóstico SEO Local & GBP | ✅ (`painel/raio-x`) | alinhar nome |
| Formulários Inteligentes (9 tipos) | ❌ | criar |
| Contratos Profissionais | ✅ (`painel/contrato`) | manter |
| Orçamento/Proposta Comercial | ✅ (`painel/orcamento`) | manter |
| PDFs (Radar, Proposta, Métricas) | parcial | gerar PDFs |
| Cobrança Asaas | ❌ | fase 2 |

**Prioridade painel MRP:** Kanban → Dashboard KPIs → Follow-up → Agenda → Formulários → PAP/Prospecção → PDFs → Asaas.

---

## 3. QC — O QUE JÁ ESTÁ FEITO ✅ (não repetir)

- Mapa de quadras SVG interativo (Sul/Norte toggle, células 101–116, densidade por cor)
- Sistema de busca com filtros (Aberto agora, Verificados, Com foto) e ordenação em pills
- "Quadras em destaque" dinâmicas (score = avaliacoes × capivaras)
- Skyline Brasília / Niemeyer no hero (SVG desenhado à mão)
- Design claro, palette Brasília (tokens `--qc-planalto`, `--qc-ceu`, `--qc-cerrado`)
- Favicon capivara 🦫 (`app/icon.tsx`)
- Mascote capivara sem folha; badge de verificação = escudo + checkmark
- Perfil Empresarial (tipo_perfil, CPF/CNPJ, celular) no cadastro
- Seções "Sou o dono", "É o seu comércio?", "Presença Digital" — só para empresariais logados
- Reivindicação de negócio com 3 documentos (Cartão CNPJ, Alvará, Comprovante de Vínculo)
- Upload de docs para bucket `qc-documentos` (Storage Supabase)
- Painel admin reivindicações com download dos 3 documentos
- Página `/conta` com badge de tipo de perfil, celular, link para Meus Negócios
- Página `/meu-negocio` (index) listando negócios aprovados e pendentes
- Painel do dono `/meu-negocio/[slug]`: stats, EditForm, QR code imprimível
- QR code: `/qr/[slug]` → `/comercio/[slug]?via_qr=1`
- Avaliações QR valem 10× (`via_qr`, função `qc_capivaras_ponderado`, trigger)
- Nota fiscal obrigatória em avaliações QR (`nf_numero`, `nf_data`)
- Badge "QR verificado" nas avaliações da lista pública
- Horário de funcionamento: tradução EN→PT e AM/PM→24h automático
- Moderação de texto e imagem (`/api/moderar-texto`, `/api/moderar-imagem`)
- Fotos em avaliações (bucket `qc-avaliacoes`, SafeSearch)
- Migrations executadas: `20260613_perfil_empresarial.sql`, `20260614_via_qr.sql`, `20260614_nf_qr.sql`

---

## 4. PRÓXIMOS PASSOS — QC (Quadrado Capital)

### QC-P1 — Produto (impacto direto)

- [ ] **Aprovar reivindicação → setar `comercios.reivindicado = true`:** Verificar e corrigir `app/admin/(dashboard)/reivindicacoes/actions.ts`.
- [ ] **Painel do dono — upload de foto do comércio:** Empresarial aprovado troca `comercios.foto_url` em `/meu-negocio/[slug]`.
- [ ] **Painel do dono — responder avaliações:** Resposta pública por avaliação. Requer tabela `qc_respostas_avaliacao` + exibição no perfil.
- [ ] **Horário editável pelo dono:** EditForm atual só edita descrição/website/telefone. Adicionar os 7 dias de horário.
- [ ] **WhatsApp e Instagram editáveis:** Incluir no EditForm do painel.

### QC-P2 — Crescimento

- [ ] **Sitemap dinâmico:** `app/sitemap.ts` cobrindo todos os comércios.
- [ ] **SEO por página de comércio:** `generateMetadata` já existe — revisar title/description/OG de cada rota.
- [ ] **Página de categoria (`/categoria/[slug]`):** Verificar se está funcional e com SEO completo.
- [ ] **Notificação ao dono:** E-mail (Supabase Edge Function + Resend) quando nova avaliação chega.
- [ ] **Compartilhar avaliação:** Botão com link direto + Open Graph da avaliação.

### QC-P3 — Dados

- [ ] **Adicionar mais comércios reais:** Scripts em `scripts/` via Google Places API. Meta: quadras com < 3 comércios.
- [ ] **Validação de celular por OTP:** Celular coletado mas não verificado. Supabase Auth SMS ou fallback e-mail.

### QC-P4 — Infraestrutura

- [ ] **Bucket `qc-documentos` — criar no Dashboard Supabase** (Storage > New bucket, ativar RLS comentada na migration).
- [ ] **Auditoria RLS:** `qc_avaliacoes`, `qc_reivindicacoes`, `qc_perfis`, `comercios`.
- [ ] **SEO motion:** Aplicar `Reveal` + animações CSS do MRP nas seções do QC (WS-4 equivalente).

---

## 5. WORKSTREAMS — MRP (Marcos Roberto PRO)

### WS-1 · BLOG
**Rota:** `app/blog/` · MDX + frontmatter · `generateStaticParams` + `generateMetadata` · JSON-LD `BlogPosting`.
5 posts iniciais: "Como aparecer no Google Maps em Brasília", "GMN para [nicho] no DF", "Quanto custa gestão GMN", "Checklist perfil GMN", "GMN vs Instagram para negócio local".
**DoD:** build verde, `/blog` e um post renderizando, sitemap incluindo posts.

### WS-2 · SEO LOCAL DF
1. `generateMetadata` em todas as páginas (keyword+local, canonical, OG).
2. Páginas-silo: `/gestao-google-meu-negocio-brasilia`, `/criacao-de-sites-brasilia`, `/google-meu-negocio-[localidade]` (via `generateStaticParams`).
3. Schema JSON-LD: `LocalBusiness` (`areaServed` = DF), `Service`, `FAQPage`, `BreadcrumbList` — centralizar em `lib/seo.ts`.
4. `app/sitemap.ts` + `app/robots.ts`.
5. Performance: `next/image`, fontes `display:swap`, lazy de vídeo.
**DoD:** sitemap e robots OK, Rich Results válido, cada silo com conteúdo único.

### WS-3 · INCORPORAR CONCORRENTE 2A
- Serviços: Fotos 360°/Tour Virtual, Auditoria de Presença Digital, Captação de Leads, Posicionamento de Marca.
- Seção "Cases por nicho" (odonto, buffet, imobiliária, estética).
- Número-âncora "X negócios posicionados em Brasília".
**DoD:** seções no fluxo da home + `/servicos` atualizada, build verde.

### WS-4 · MOVIMENTO (Reveal + Hyperframes)
1. Envolver **todas** as rotas com `Reveal`; hover-lift em cards; micro-interações com keyframes existentes.
2. Vídeo Hyperframes seletivo (máx. 2–3): `cd video && npx hyperframes render -o ../public/NOME.mp4 --resolution landscape --fps 30`.
3. `reduced-motion` respeitado.
**DoD:** toda rota com reveal/hover, vídeos embutidos, build verde.

### WS-5 · PAINEL GMN (fases)
**Fase 1:** CRM Kanban · Dashboard KPIs · Follow-up · Agenda · Formulários Inteligentes.
**Fase 2:** PAP/Prospecção · PDFs (Radar, Proposta, Métricas) · Asaas (cobrança).
**Fase 3:** Tráfego Turbo · QR/Bio/Cardápio · Cursos/Comunidade.
**Banco:** usar `aiox-data-engineer` ou `db-sage` para schema + RLS. RLS obrigatório.
**DoD:** cada módulo com CRUD + RLS testada; sem service-role exposta no client.

### WS-6 · DEPLOY
1. `npm run build` (passa).
2. `git add -A && git commit -m "..."` → OK Marcos → `git push`.
3. Vercel auto-deploya. Verificar: `curl -s -o /dev/null -w '%{http_code}' https://marcosroberto.pro`.

---

## 6. REPLICAÇÃO (rodar depois que MRP estiver validado)

> MRP é a referência. QC, PPD e BB recebem o mesmo tratamento de motion + SEO local.

**Cole numa sessão limpa, trocando `<ALVO>`:**

```
Replicar o padrão de melhorias do MRP neste site: <ALVO>

Referência (NÃO reimplementar do zero — copiar o padrão):
- Motion: /Users/marcosrobertoss/projeto3/marcos-roberto-pro/components/reveal.tsx
  e o bloco "Motion" de app/globals.css (keyframes mrp-enter/glow/caret/ring)
  e o script .js no <head> de app/layout.tsx.
- SEO: lib/seo.ts, app/sitemap.ts, app/robots.ts, generateMetadata por rota,
  JSON-LD LocalBusiness/Service/FAQ.
- Plano completo: /Users/marcosrobertoss/projeto3/quadrado-capital/docs/EXECUCAO-STATUS.md

Tarefas:
1. Copiar reveal.tsx + keyframes + script .js (adaptar tokens de cor do alvo).
2. Envolver todas as seções/rotas com Reveal; hover-lift nos cards.
3. SEO local DF: metadata, sitemap.ts, robots.ts, schema JSON-LD.
4. (Se fizer sentido) 1 vídeo Hyperframes de hero.
5. npm run build verde → commit local → PEDIR OK antes de push.

Regras: reusar, não reinventar. Não instalar lib de animação.
Ler o mínimo (Grep/Explore). Respeitar prefers-reduced-motion.
```

| Alvo | Caminho | Observações |
|---|---|---|
| **QC** | `/Users/marcosrobertoss/projeto3/quadrado-capital` | Tokens próprios — adaptar. Hardening de leads (RPC SECURITY DEFINER + honeypot). |
| **PPD** | `/Users/marcosrobertoss/projeto3/landing` | Landing simples; foco em motion + SEO da oferta Plano Piloto. |
| **BB** | `/Users/marcosrobertoss/projeto2` | shadcn/ui — adaptar `Reveal`. Alterações não commitadas (`navbar.tsx`, `ui/index.ts`) — resolver antes. SEO de e-commerce/leilão, não GMN. |

---

## 7. MATRIZ DE FERRAMENTAS/AGENTES

| Tarefa | Melhor opção | Por quê |
|---|---|---|
| Localizar código | `Explore` (read-only) ou `Grep`/`Glob` | barato, não polui contexto |
| Arquitetura / silo SEO | `Plan` ou `aiox-architect` | 1 passada antes de codar |
| Implementar código | `aiox-dev` ou inline | inline se contexto já carregado |
| Banco / migrations / RLS | `aiox-data-engineer` ou `db-sage` | evita retrabalho de RLS |
| Motion / vídeo HTML→MP4 | skill `hyperframes` + skill `gsap` | encapsula runtime |
| UI/UX caprichada | `aiox-ux` ou `brad-frost` | só quando design importa |
| Pesquisa keyword/pauta | `WebSearch` (1–2 queries focadas) | não re-pesquisar o que já está neste doc |
| Deploy / CI | `vercel:deploy` / `aiox-devops` | usa MCP `vercel-api` |

---

## 8. ORDEM SUGERIDA DE EXECUÇÃO GERAL

1. **QC-P1** (produto direto — reivindicação, foto, resposta avaliação, horário editável).
2. **WS-2 MRP** (SEO técnico) → **WS-1** (blog) → **WS-3** (serviços/concorrente).
3. **WS-4 MRP** (motion em todas as páginas).
4. **WS-5 MRP** (painel, Fase 1).
5. **WS-6** deploy a cada marco.
6. **Replicar** (§6) em QC, PPD, BB.
7. **QC-P2/P3/P4** em paralelo com o WS-5.
