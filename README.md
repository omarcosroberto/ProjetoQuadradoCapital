# 🦫 Quadrado Capital

**O diretório de comércios de Brasília por quadra e bloco.**

Comércios da Asa Sul e Asa Norte organizados por **quadra** e **bloco**, avaliados em capivaras pelos próprios moradores.

[quadradocapital.com.br](https://quadradocapital.com.br)

## 🗺️ O que é

O Google te mostra um pino. O Quadrado Capital te mostra a **quadra**. Em vez de coordenadas, organizamos os comércios do jeito que o brasiliense pensa o endereço: por superquadra e bloco. Quem mora na 409 Sul acha o que precisa na 409 Sul.

## ⚙️ Funcionalidades

- 🔍 Busca por quadra (ex: 409 Sul) ou categoria (ex: Restaurantes)
- 🦫 Sistema de avaliação em capivaras (membros cadastrados)
- 🗂️ Páginas por categoria (/categoria/restaurante)
- 👤 Login/cadastro de membros
- 🛡️ Painel admin protegido por senha (/admin)
- 📜 Política de privacidade, cookies e termos de uso

## 🏗️ Stack

- **Next.js 16** App Router
- **Tailwind CSS v4** com design tokens customizados
- **Supabase** (PostgreSQL + Auth + RLS)
- **Vercel** (deploy)

## 🚀 Desenvolvimento local

```bash
npm install
cp .env.example .env.local  # preencha as vars do Supabase
npm run dev
```

## 🔐 Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| NEXT_PUBLIC_SUPABASE_URL | URL do projeto Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Chave anon pública |
| SUPABASE_SERVICE_ROLE_KEY | Chave admin (só server-side) |
| QC_ADMIN_PASS | Senha do painel /admin |

## 📁 Estrutura

```
app/
├── page.tsx              # Home com busca
├── comercio/[slug]/      # Página do comércio
├── categoria/[slug]/     # Listagem por categoria
├── entrar/               # Login / cadastro
├── conta/                # Perfil do membro
├── admin/                # Painel admin (protegido)
├── privacidade/          # Política de privacidade
├── termos/               # Termos de uso
└── cookies/              # Política de cookies

components/
├── search-experience.tsx # Hero + busca
├── business-card.tsx     # Card de comércio
├── avaliacao-form.tsx    # Formulário de avaliação
├── logo-qc.tsx           # Logo SVG
└── cookie-banner.tsx     # Banner LGPD

lib/
├── supabase.ts           # Clientes Supabase
├── comercios.ts          # Queries de comércios
└── data.ts               # Tipos + lógica de busca
```

## 🦫 O sistema de capivaras

A nota de 1 a 5 capivaras é calculada automaticamente pela média das avaliações dos membros cadastrados. Cada membro pode avaliar cada comércio uma vez. Comércios novos começam com 5.0 🦫 até receberem avaliações.

## 🛡️ Segurança

- RLS ativo em todas as tabelas
- Uma avaliação por usuário por comércio (constraint único no banco)
- Comentários limitados a 500 caracteres
- Cookies de sessão httpOnly
- Admin protegido por senha separada do Supabase

## 📄 Legal

- [Política de Privacidade](/privacidade)
- [Termos de Uso](/termos)
- [Política de Cookies](/cookies)

---

Feito em Brasília 🦫 por [Marcos Roberto PRO](https://marcosroberto.pro)
