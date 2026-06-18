<div align="center">

# 🦫 Quadrado Capital

### O diretório definitivo dos comércios de Brasília — avaliado em capivaras

[![Live](https://img.shields.io/badge/🌐_Acesse_ao_vivo-quadradocapital.com.br-FF6B35?style=for-the-badge)](https://quadradocapital.com.br)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

> Encontre restaurantes, farmácias, mercados e serviços organizados por quadra — do jeito que Brasília foi planejada.

</div>

---

## 🤖 IA no centro do desenvolvimento

Este projeto foi desenvolvido com **inteligência artificial como ferramenta principal de trabalho**, não como recurso auxiliar. O Claude (Anthropic) atuou como par de programação em tempo real ao longo de todo o desenvolvimento:

| Área | Como a IA foi usada |
|---|---|
| 🏗️ **Arquitetura** | Decisões de estrutura de banco, RLS policies, Server Components |
| 🔌 **Integrações** | Google Places API (New), Supabase REST, Vercel Cron Jobs |
| 🐛 **Debug** | Diagnóstico de erros em tempo real, análise de logs |
| ✍️ **Código** | Geração, refatoração e revisão de TypeScript/React/SQL |
| 🤖 **Automações** | Scripts de seed e enriquecimento de dados com rotação de chaves |
| 🎨 **UI/UX** | Componentes, animações, sistema de design em capivaras |

A experiência prática com IA neste projeto é o que motivou a candidatura à **Residência em IA da UnB**.

---

## 🗺️ O que é o Quadrado Capital?

Brasília foi projetada em quadras — e cada quadra tem sua própria identidade comercial. O **Quadrado Capital** organiza esse universo de forma digital:

- 🔍 **Busca por quadra, categoria ou nome** — estilo Google, sem complicação
- 🦫 **Sistema de avaliação em capivaras** — porque estrelas são genéricas demais para Brasília
- 📍 **Mapa interativo de quadras** — visualize onde há mais comércio por região
- 📞 **Contato direto** — telefone, WhatsApp e Instagram em um clique
- 🕐 **Horários atualizados automaticamente** — via Google Places API todo dia às 21h
- 👑 **Painel do dono** — proprietários podem reivindicar e gerenciar seu perfil

---

## 🦫 Por que capivaras?

Esqueça as estrelinhas genéricas copiadas de apps americanos. Em Brasília, avaliamos com **capivaras**.

A capivara é o animal mais zen do Cerrado. Calma, serena, sem julgamentos precipitados. Quando ela te dá 5 capivaras, pode ir de olhos fechados.

```
🦫🦫🦫🦫🦫  Imperdível. A capivara acordou do cochilo só pra recomendar.
🦫🦫🦫🦫    Muito bom. Vale cada real.
🦫🦫🦫      Ok. Cumpre o papel.
🦫🦫        Tem dias melhores.
🦫           Só fui porque era o único aberto.
```

---

## 🛠️ Stack técnica

```
🖥️  Frontend
    ├── Next.js 16 (App Router + Server Components)
    ├── React 19 + TypeScript
    └── Tailwind CSS 4 com design tokens customizados

🗄️  Backend & Banco de Dados
    ├── Supabase PostgreSQL (5 migrations versionadas)
    ├── Row Level Security (RLS) em todas as tabelas
    └── Supabase Auth + Storage

🤖  Integrações & Automações
    ├── Google Places API — enriquecimento de fotos e horários
    ├── Vercel Cron Jobs — job diário às 21h
    ├── Resend — emails transacionais para donos de comércio
    └── Claude AI — desenvolvimento assistido por IA

🚀  Infraestrutura
    ├── Vercel (hosting + auto-deploy)
    └── GitHub (versionamento)
```

---

## 🤖 Automações com IA

### 📍 Seed de novos comércios
```bash
node scripts/seed-places.mjs
```
Busca automaticamente novos comércios via Google Places API e insere no banco com slug, categoria, endereço e avaliação inicial.

### 📸 Enriquecimento diário
```bash
node scripts/enrich-places.mjs
```
Roda todo dia às 21h via Vercel Cron. Para cada comércio com `google_place_id`, busca telefone, horário de funcionamento e foto — e atualiza o banco automaticamente.

**Estratégia de rotação de chaves API:**
```
6 chaves × 95 req/dia = 570 comércios enriquecidos por dia
Troca automática de chave ao atingir o limite diário
```

---

## 🗄️ Banco de dados

```
supabase/migrations/
├── 001_initial_schema.sql    → Tabelas base
├── 002_avaliacoes.sql        → Sistema de capivaras
├── 003_reivindicacoes.sql    → Claim de comércio
├── 004_painel_dono.sql       → Painel do proprietário
└── 005_enrichment.sql        → Log de enriquecimento
```

Todas as tabelas têm **RLS habilitado**:
- 📖 Leitura pública para listagens
- ✍️ Escrita autenticada para avaliações
- 👑 Escrita restrita ao dono para edição do perfil

---

## ⚙️ Rodando localmente

```bash
# Clone o repositório
git clone https://github.com/omarcosroberto/ProjetoQuadradoCapital.git
cd ProjetoQuadradoCapital

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔧 Variáveis de ambiente necessárias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google Places API (rotação de chaves)
GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_API_KEY_1=
GOOGLE_MAPS_API_KEY_2=
GOOGLE_MAPS_API_KEY_3=
GOOGLE_MAPS_API_KEY_4=
GOOGLE_MAPS_API_KEY_5=

# Email transacional
RESEND_API_KEY=

# Segurança de webhooks
QC_WEBHOOK_SECRET=
```

---

## 📊 Status atual

```
🏪  Comércios cadastrados ........... crescimento contínuo
🕐  Com horário de funcionamento .... 438+
📞  Com telefone .................... 416+
📸  Enriquecimento automático ....... até 570 comércios/dia
🦫  Sistema de avaliações ........... ativo
👑  Reivindicação de comércio ....... ativo
🌐  SEO (JSON-LD + sitemap) ......... ativo
```

---

<div align="center">

Feito em Brasília 🦫 por [Marcos Roberto](https://marcosroberto.pro)

**[quadradocapital.com.br](https://quadradocapital.com.br)**

</div>
