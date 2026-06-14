# 🟧 Quadrado Capital

<div align="center">

![Quadrado Capital](https://img.shields.io/badge/Quadrado_Capital-v0.1.0-FF6B35?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB_+_Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-auto--deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)

**🌐 [quadradocapital.com.br](https://quadradocapital.com.br)** · 🔒 [Repositório Privado](https://github.com/omarcosroberto/quadrado-capital)

> O diretório definitivo dos comércios de Brasília, organizado por quadra — e avaliado em 🦫 **capivaras**!

</div>

---

## 🦫 O Conceito das Capivaras

Esqueça as estrelas. Esqueça as estrelinhas douradas genéricas copiadas de aplicativos americanos. Em Brasília, a gente avalia com **capivaras** 🦫🦫🦫🦫🦫.

A capivara é o animal símbolo da paz, da tranquilidade e do _"deixa o povo ser feliz"_. Nada mais brasiliense do que avaliar um comércio local com o animal mais zen do Cerrado. Um restaurante **5 capivaras**? Pode ir de olhos fechados. Um bar **1 capivara**? Talvez seja melhor pedir delivery.

O **Quadrado Capital** é o diretório de comércios de Brasília organizado como a cidade foi planejada: **por quadra**. Sul, Norte, Lago, Noroeste — cada quadra tem sua vida, seu comércio local, sua identidade. Aqui você encontra, avalia e descobre os melhores comércios do Plano Piloto e arredores.

> 🦫 **5 capivaras** = O restaurante é tão bom que até a capivara acordou do cochilo pra ir lá.
> 🦫 **1 capivara** = Só fui porque era o único aberto.

---

## 🗂️ Índice

- [🦫 O Conceito das Capivaras](#-o-conceito-das-capivaras)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Stack Técnica](#️-stack-técnica)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [⏰ Cron Jobs](#-cron-jobs)
- [🚀 Deploy](#-deploy)
- [🔧 Variáveis de Ambiente](#-variáveis-de-ambiente)
- [⚙️ Setup Local](#️-setup-local)
- [⏳ Pendências e Setup Manual](#-pendências-e-setup-manual)
- [📊 Dados Atuais](#-dados-atuais)
- [📝 Histórico Recente](#-histórico-recente)

---

## ✨ Funcionalidades

### 🗺️ Diretório por Quadra

| Funcionalidade | Descrição |
|---|---|
| 📍 **Listagem por quadra** | Comércios organizados por Sul, Norte, Lago, Noroeste e demais regiões |
| 🔍 **Busca centralizada** | Buscador estilo Google no centro da tela — sem frescura, só resultado |
| 📄 **Paginação inteligente** | Escolha exibir 6, 12 ou 24 comércios por página |
| 🏷️ **Filtros por categoria** | Filtre restaurantes, farmácias, mercados, serviços e muito mais |
| 🦫 **Rating em capivaras** | Sistema único de avaliação de 1 a 5 capivaras |
| 📱 **Compartilhamento** | Compartilhe qualquer comércio com link próprio e preview rico |

### 🏪 Perfil do Comércio

| Funcionalidade | Descrição |
|---|---|
| 🕐 **Horários de funcionamento** | 438 comércios com horário cadastrado |
| 📞 **Contato direto** | 416 comércios com telefone — ligue ou mande mensagem |
| 📸 **Fotos automáticas** | Enriquecimento diário via Google Places API |
| 📋 **WhatsApp + Instagram** | Links diretos para contato e redes sociais |
| 🌐 **SEO por comércio** | `generateMetadata` + JSON-LD `LocalBusiness` + sitemap dinâmico |

### 👑 Reivindicação de Comércio

| Funcionalidade | Descrição |
|---|---|
| ✋ **Claim do perfil** | O dono do comércio reivindica e assume o controle do perfil |
| 📸 **Upload de foto** | Dono faz upload da foto oficial do estabelecimento |
| 💬 **Responder avaliações** | Dono pode responder publicamente às avaliações em capivaras |
| ✏️ **Editar informações** | Horários, WhatsApp, Instagram — tudo editável pelo painel do dono |
| 📬 **Notificação por email** | Webhook dispara email via Resend a cada nova avaliação recebida |

### 🦫 Sistema de Avaliações

| Funcionalidade | Descrição |
|---|---|
| ⭐ **1–5 capivaras** | A escala mais brasiliense que existe |
| 💬 **Comentários** | Avalie com texto livre (até 500 caracteres) |
| 🔔 **Webhook** | Cada nova avaliação dispara notificação ao dono |
| 📧 **Email via Resend** | Notificação bonita e profissional no e-mail do dono |
| 🔒 **Uma avaliação por usuário** | Constraint único no banco para evitar spam de capivaras |

---

## 🛠️ Stack Técnica

```
📦 Frontend
   ├── Next.js 16.2.9      → App Router, Server Components, generateMetadata
   ├── React 19.2.4        → RSC + Client Components
   ├── TypeScript          → Tipagem estrita em todo o projeto
   ├── Tailwind CSS 4      → Estilização utility-first com design tokens customizados
   └── lucide-react        → Ícones SVG consistentes

🗄️ Backend & Banco de Dados
   ├── Supabase Auth       → Autenticação de usuários e donos de comércio
   ├── Supabase DB         → PostgreSQL gerenciado + 5 migrations versionadas
   └── Supabase Storage    → Upload e servimento de fotos dos comércios

🔌 Integrações Externas
   ├── Google Places API   → Enriquecimento automático de fotos (6 chaves × 100/dia)
   ├── Resend              → Envio de emails transacionais para donos de comércio
   └── Vercel Cron         → Agendamento do job diário de enriquecimento

🚀 Infraestrutura
   ├── Vercel              → Hosting + auto-deploy via main + Cron Jobs
   └── GitHub              → Repositório privado com CI via push
```

---

## 🗄️ Banco de Dados

O banco de dados roda no **Supabase (PostgreSQL)** com **5 migrations** aplicadas e versionadas.

### 📐 Estrutura de Migrations

```
supabase/migrations/
├── 001_initial_schema.sql       → Tabelas base: comercios, quadras, categorias
├── 002_avaliacoes.sql           → Sistema de avaliações com rating em capivaras
├── 003_reivindicacoes.sql       → Claim de comércio pelo dono
├── 004_painel_dono.sql          → Campos do painel: foto, horário, WhatsApp, Instagram
└── 005_enrichment.sql           → Controle de enriquecimento via Google Places
```

### 🗃️ Tabelas Principais

| Tabela | Descrição |
|---|---|
| `qc_comercios` | Cadastro de todos os comércios de Brasília |
| `qc_quadras` | Quadras organizadas por região (Sul, Norte, Lago...) |
| `qc_categorias` | Categorias dos comércios (restaurante, farmácia, mercado, etc.) |
| `qc_avaliacoes` | Avaliações com rating em capivaras + comentário do usuário |
| `qc_reivindicacoes` | Registro e status das reivindicações de comércio |
| `qc_enrichment_log` | Log de enriquecimento de fotos via Google Places API |

### 🔐 Row Level Security (RLS)

Todas as tabelas possuem **RLS habilitado** via Supabase:

- 📖 **Leitura pública** para listagem de comércios e avaliações
- ✍️ **Escrita autenticada** para avaliações e reivindicações
- 👑 **Escrita restrita ao dono** para edição do perfil do comércio
- 🛡️ **Admin via service role** para operações de seed e enriquecimento

---

## ⏰ Cron Jobs

### 📸 Enriquecimento de Fotos — Google Places API

**Horário:** Todo dia às **21h00** (horário de Brasília)

```
Endpoint: /api/cron/enrich-photos
Vercel Cron: 0 0 * * * (UTC = 21h BRT)
```

**Estratégia de rotação de chaves:**

| Chave | Limite diário | Total por dia |
|---|---|---|
| `GOOGLE_PLACES_API_KEY_1` | 100 req/dia | — |
| `GOOGLE_PLACES_API_KEY_2` | 100 req/dia | — |
| `GOOGLE_PLACES_API_KEY_3` | 100 req/dia | — |
| `GOOGLE_PLACES_API_KEY_4` | 100 req/dia | — |
| `GOOGLE_PLACES_API_KEY_5` | 100 req/dia | — |
| `GOOGLE_PLACES_API_KEY_6` | 100 req/dia | **600 comércios/dia** |

**Fluxo do job:**

```
1. 🔍 Busca comércios sem foto (ou foto com mais de 30 dias)
2. 🌐 Consulta Google Places API com nome + endereço do comércio
3. 📸 Salva URL da foto no campo correto em qc_comercios
4. 📝 Registra log de sucesso/erro em qc_enrichment_log
5. 🔄 Rotaciona para próxima chave API ao atingir o limite diário
```

---

## 🚀 Deploy

O projeto roda na **Vercel** com **auto-deploy** configurado na branch `main`.

```
Projeto Vercel:   quadrado-capital
Branch de deploy: main
URL de produção:  https://quadradocapital.com.br
```

### 🔄 Fluxo de Deploy

```
git push origin main
       ↓
  GitHub (repo privado)
       ↓
  Vercel (webhook automático)
       ↓
  Build Next.js 16
       ↓
  Deploy em produção ✅
```

### 🏗️ Comandos de Build

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Iniciar servidor de desenvolvimento
npm run dev
```

---

## 🔧 Variáveis de Ambiente

### ✅ Já Configuradas no Vercel

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Chave anon pública do Supabase
SUPABASE_SERVICE_ROLE_KEY=          # Chave de serviço (server-side only)

# Google Places API — 6 chaves em rodízio (100 req/chave/dia = 600/dia)
GOOGLE_PLACES_API_KEY_1=
GOOGLE_PLACES_API_KEY_2=
GOOGLE_PLACES_API_KEY_3=
GOOGLE_PLACES_API_KEY_4=
GOOGLE_PLACES_API_KEY_5=
GOOGLE_PLACES_API_KEY_6=
```

### ⏳ Pendentes de Adicionar no Vercel

```env
# Email transacional via Resend
RESEND_API_KEY=                     # Chave da API do Resend

# Segurança do webhook Supabase → API
QC_WEBHOOK_SECRET=                  # String secreta para validar webhooks
```

> ⚠️ **Onde adicionar:** Vercel Dashboard → quadrado-capital → Settings → Environment Variables

---

## ⚙️ Setup Local

```bash
# 1. Clone o repositório
git clone https://github.com/omarcosroberto/quadrado-capital.git
cd quadrado-capital

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase e Google Places

# 4. Aplique as migrations no Supabase (se necessário)
npx supabase db push

# 5. Rode o servidor de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000) 🎉

---

## ⏳ Pendências e Setup Manual

> Estas configurações precisam ser feitas **manualmente** — não são automatizadas via código ou deploy.

---

### 🔴 Crítico — Notificações de Avaliação Não Funcionam Sem Isso

#### 1️⃣ Webhook Supabase → Nova Avaliação

**Onde configurar:** Supabase Dashboard → Database → Webhooks → Create Webhook

| Campo | Valor |
|---|---|
| Nome | `nova-avaliacao` |
| Tabela | `qc_avaliacoes` |
| Evento | `INSERT` |
| URL | `https://quadradocapital.com.br/api/webhooks/nova-avaliacao` |
| Header | `x-webhook-secret: <valor do QC_WEBHOOK_SECRET>` |

#### 2️⃣ Variáveis de Ambiente no Vercel

**Onde configurar:** [Vercel Dashboard](https://vercel.com/dashboard) → quadrado-capital → Settings → Environment Variables

| Variável | O que é |
|---|---|
| `RESEND_API_KEY` | Chave da API do Resend para envio de emails |
| `QC_WEBHOOK_SECRET` | String secreta para validar chamadas do webhook |

---

### 🟡 Importante — Storage para Documentos de Reivindicação

#### 3️⃣ Bucket de Documentos no Supabase Storage

**Onde configurar:** Supabase Dashboard → Storage → New Bucket

| Campo | Valor |
|---|---|
| Nome do bucket | `qc-documentos` |
| Visibilidade | Private (documentos de reivindicação são privados) |

---

### 🔴 Pendência de Produto — Segurança de Reivindicação

#### 4️⃣ 📱 Validação de Celular por OTP

> **Status:** Não implementado — necessário para aumentar confiabilidade das reivindicações de comércio

**O que precisa ser feito:**
- Integração com provedor de SMS (opções: Twilio, AWS SNS, ou Supabase Phone Auth nativo)
- Fluxo de envio e verificação de código OTP na tela de reivindicação
- Validação server-side do código OTP antes de confirmar a reivindicação
- Armazenar número de celular validado na tabela `qc_reivindicacoes`

---

## 📊 Dados Atuais

```
🏪 Total de comércios cadastrados .......... crescimento contínuo
🕐 Comércios com horário .................. 438
📞 Comércios com telefone ................. 416
🆕 Novos comércios inseridos .............. 21+
📸 Enriquecimento de fotos ................ até 600 comércios/dia (automático às 21h)
🦫 Sistema de avaliações .................. ativo
👑 Sistema de reivindicação ............... ativo
🌐 SEO por comércio ....................... JSON-LD + sitemap dinâmico
```

---

## 📝 Histórico Recente

### 🔀 Últimos Commits

| Tipo | Descrição |
|---|---|
| `feat(qc)` | Paginação 6/12/24 + filtros enxutos + favicon CSS puro |
| `chore(qc)` | Atualiza resultados de seed e queries SQL acumulados |
| `feat(qc)` | Buscador centralizado estilo Google + limpeza do hero |

---

## 🦫 Por que Capivaras?

Porque Brasília é diferente.

Enquanto o resto do Brasil usa estrelas genéricas copiadas de aplicativos americanos, a capital do país usa o animal que representa exatamente o que todo brasiliense aspira: **a paz de espírito de quem sabe que o burocrático vai resolver, de qualquer jeito, mais tarde**.

A capivara não se estressa. A capivara não liga. A capivara avalia o seu comércio com serenidade e sabedoria ancestral do Cerrado.

E quando ela te dá 5 capivaras, pode confiar. Esse lugar é **brasiliense demais para ser ruim**.

---

## 📄 Legal

- [Política de Privacidade](https://quadradocapital.com.br/privacidade)
- [Termos de Uso](https://quadradocapital.com.br/termos)
- [Política de Cookies](https://quadradocapital.com.br/cookies)

---

<div align="center">

Feito em Brasília 🦫 com carinho por [Marcos Roberto PRO](https://marcosroberto.pro)

**[quadradocapital.com.br](https://quadradocapital.com.br)**

</div>
