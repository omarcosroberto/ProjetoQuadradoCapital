# UX Roadmap — Quadrado Capital

> Documento de recomendações de design e produto.
> Base analisada: `app/page.tsx`, `components/search-experience.tsx`, `components/business-card.tsx`, `app/comercio/[slug]/page.tsx`, `app/globals.css`, `lib/data.ts`, `lib/comercios.ts`, `components/capivara.tsx`.
> Stack: Next.js 16 App Router · Tailwind v4 · Supabase. Paleta: `verde` / `verde-suave` / `verde-escuro` · `concreto` / `concreto-claro` · `ar` · `branco` · `linha` · `aviso` · `capivara` (#8b6f47) · `ceu` (#87ceeb).
> Última atualização: 2026-06-13.

---

## 0. Resumo executivo (TL;DR)

O produto tem uma **base de UX acima da média para early-stage**: busca instantânea client-side, agrupamento inteligente por quadra/bloco, identidade visual forte (capivaras, grade de superquadra no hero) e um fallback de seed que impede a tela vazia. O maior risco hoje **não é design — é confiança e densidade de informação**: o card e a página do comércio mostram pouco do que o morador realmente decide ("está aberto agora?", "tem foto?", "é verificado?"), e quase todos os comércios têm a mesma nota (5,0), o que **anula a função de ranking** das capivaras.

As três alavancas de maior impacto, em ordem:

1. **Enriquecer o card e a página com sinais de confiança** (foto, badge verificado, "aberto agora", contagem real de avaliações). É o que converte "lista de nomes" em "decisão de ir até lá".
2. **Filtro "Aberto agora" + ordenação** — a pergunta nº 1 de quem busca comércio de bairro.
3. **Fluxo do dono (reivindicação → dashboard) com a oferta GMN integrada de forma não intrusiva** — é o motor de monetização e de qualidade dos dados ao mesmo tempo.

---

## 1. Diagnóstico da UX atual

### 1.1 O que funciona bem (manter e proteger)

- **Busca instantânea, sem reload.** `buscar()` roda no cliente sobre a lista completa carregada via ISR (`revalidate = 300`). Para 556 comércios isso é a decisão certa: resposta imediata, custo zero de servidor por tecla. Não trocar por busca server-side enquanto o volume não passar de ~2–3 mil registros.
- **Parser de busca dual (quadra vs. tema).** O regex que separa "409 sul" (modo quadra) de "restaurantes" (modo tema) é elegante e resolve a intenção dominante do usuário de Brasília sem UI extra. Tolera plural e acento.
- **Agrupamento por quadra → bloco A·B·C·D.** Reflete o modelo mental real do morador do Plano Piloto. É o diferencial do produto frente ao Google Maps.
- **Identidade visual coesa.** Grade de superquadra no hero, brilho verde, mascote capivara flutuante, tokens bem organizados em `globals.css`. A marca tem personalidade — raro em diretório local.
- **Fallback de seed.** `getComercios()` cai no seed se o Supabase falhar. O site nunca abre vazio. Excelente decisão de resiliência.
- **Lead-gen contextual já existe.** O bloco MRP/Plano Piloto Digital na página do comércio muda de tom quando `presencaGoogle` é fraca. Boa base — só precisa não competir com a reivindicação (ver §4).

### 1.2 Pontos de fricção e oportunidades

| # | Fricção | Por quê dói | Onde |
|---|---------|-------------|------|
| F1 | **Todos os comércios mostram 5,0 🦫** | A nota perde função de comparação. Vira enfeite, não decisão. O usuário não consegue distinguir o melhor restaurante da 409. | `business-card`, página comércio |
| F2 | **Sem foto em lugar nenhum** | Card é só texto + emoji de categoria. Diretório de comércio sem foto tem CTR e tempo de sessão muito menores. As fotos do Google Places (em implementação) precisam aparecer no card e no topo da página. | card, página comércio |
| F3 | **Nenhum sinal "aberto agora"** | A pergunta nº1 de quem busca comércio de bairro às 21h é "ainda tá aberto?". O horário (em implementação) precisa virar estado visível. | card, página comércio, busca |
| F4 | **Sem badge "verificado"** | A reivindicação está sendo construída, mas o usuário não vê o resultado dela. Verificado é o principal sinal de confiança e o gancho para o dono reivindicar. | card, página comércio |
| F5 | **A oferta MRP aparece antes das avaliações da comunidade** | Na página do comércio, o bloco de lead-gen vem acima do `AvaliacaoForm`. Para o *morador* (a maioria do tráfego), isso é ruído comercial cedo demais. A ordem deveria priorizar conteúdo da comunidade. | página comércio |
| F6 | **Card sem hierarquia de ação** | Card inteiro é um `<Link>` para a página. Bom, mas perde a chance de ações rápidas (WhatsApp, rota) sem sair da lista. | card |
| F7 | **`avaliacoes` provavelmente é 0/baixo** | Sem prova social, a nota 5,0 parece artificial. Precisa de estado "Ainda sem avaliações — seja o primeiro" e incentivo a avaliar. | card, página |
| F8 | **Home não tem entrada para "perto de mim" nem mapa** | O modelo quadra/bloco é espacial, mas a UI é 100% textual. Há uma oportunidade visual enorme (grade do Plano Piloto). | home |
| F9 | **Sem OpenGraph por comércio** | Compartilhar um comércio no WhatsApp (canal nº1 em Brasília) gera um card feio/genérico. Perde viralidade orgânica. | metadata |
| F10 | **Estado vazio de busca é bom, mas sem sugestão de correção** | "Nada encontrado" não sugere quadras/categorias próximas. | search-experience |

---

## 2. Melhorias de Design Prioritárias (implementáveis agora)

> Todos os exemplos usam **somente tokens já existentes** em `globals.css`. Nada de cor nova.

### 2.1 Card de comércio — versão enriquecida

Problema: o card atual (`business-card.tsx`) é texto + emoji + nota repetida. Proposta: adicionar **faixa de foto** (com fallback elegante para o emoji quando não há foto), **badge verificado**, **pill "aberto agora"** e **contagem real de avaliações**.

Estrutura proposta (campos novos vindos de `Business`: `fotoUrl?`, `verificado?`, `abertoAgora?: "aberto" | "fechado" | "desconhecido"`):

```tsx
<Link
  href={`/comercio/${b.id}`}
  className="group relative flex flex-col overflow-hidden rounded-xl border border-linha bg-branco transition-all duration-200 hover:-translate-y-1 hover:border-verde/40 hover:shadow-lg"
>
  {/* FOTO (ou fallback de emoji sobre fundo ar) */}
  <div className="relative aspect-[16/10] w-full overflow-hidden bg-ar">
    {b.fotoUrl ? (
      <img
        src={b.fotoUrl}
        alt={b.nome}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    ) : (
      <span className="flex h-full w-full items-center justify-center text-5xl opacity-60">
        {categoriaEmoji(b.categoria)}
      </span>
    )}

    {/* pill aberto/fechado — canto inferior esquerdo */}
    {b.abertoAgora !== "desconhecido" && (
      <span
        className={`absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none backdrop-blur ${
          b.abertoAgora === "aberto"
            ? "bg-verde/90 text-branco"
            : "bg-concreto/80 text-branco"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${b.abertoAgora === "aberto" ? "bg-branco" : "bg-branco/60"}`} />
        {b.abertoAgora === "aberto" ? "Aberto agora" : "Fechado"}
      </span>
    )}

    {/* nota — canto superior direito */}
    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-branco/95 px-2 py-1 leading-none text-verde shadow-sm backdrop-blur">
      <span className="qc-display text-base">{b.capivaras.toFixed(1).replace(".", ",")}</span>
      <span aria-hidden className="text-xs">🦫</span>
    </span>
  </div>

  {/* CORPO */}
  <div className="flex flex-1 flex-col p-4">
    <div className="flex items-center gap-2">
      <h3 className="qc-display text-lg leading-tight text-concreto">{b.nome}</h3>
      {b.verificado && (
        <span title="Comércio verificado pelo dono" className="shrink-0 text-verde">
          {/* selo check */}
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-label="Verificado">
            <path d="M10 1l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.8 2.6.8 2.6-2.3 1.4-1 2.5-2.7-.2L10 19l-2.2-1.6-2.7.2-1-2.5L1.8 13.7l.8-2.6-.8-2.6 2.3-1.4 1-2.5 2.7.2L10 1z"/>
            <path d="M8.6 12.3L6.4 10l1-1 1.2 1.2 3-3 1 1-4 4z" fill="#fff"/>
          </svg>
        </span>
      )}
    </div>
    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-verde">{b.categoria}</p>

    <p className="mt-2 text-sm text-concreto-claro">
      {b.bloco ? <span className="font-semibold text-concreto">Bloco {b.bloco}</span> : "Comércio local"}
      {" · "}Quadra {b.quadra} {asaSigla(b.asa)}
    </p>

    <div className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-concreto-claro">
      <span aria-hidden>🦫</span>
      {b.avaliacoes > 0
        ? `${b.avaliacoes} ${b.avaliacoes === 1 ? "avaliação" : "avaliações"}`
        : "Seja o primeiro a avaliar"}
    </div>
  </div>
</Link>
```

Notas de design:
- **Foto com `aspect-[16/10]`** padroniza a altura dos cards na grade (hoje variam pela quantidade de texto).
- **Fallback de emoji grande** mantém o card bonito quando não há foto — nunca um buraco cinza.
- **"Seja o primeiro a avaliar"** transforma o vazio (F7) em chamada à ação.
- Remova a nota duplicada de baixo do card; manter só o badge no canto evita redundância (hoje a nota aparece duas vezes).

### 2.2 Sinal "aberto agora" — uma função pura compartilhada

Coloque em `lib/horario.ts` para o card, a página e o filtro usarem a mesma lógica. Modelo de dados sugerido: `horario: { [dia: 0..6]: Array<[abreMin, fechaMin]> }` (minutos desde meia-noite; array permite intervalo de almoço).

```ts
export type FaixaHorario = [number, number]; // [abre, fecha] em minutos
export type Horario = Record<number, FaixaHorario[]>; // 0=domingo

export function estadoAgora(h?: Horario, agora = new Date()): {
  estado: "aberto" | "fechado" | "desconhecido";
  fechaEm?: string;   // "Fecha às 22h"
  abreEm?: string;    // "Abre amanhã às 9h"
} {
  if (!h) return { estado: "desconhecido" };
  const dia = agora.getDay();
  const min = agora.getHours() * 60 + agora.getMinutes();
  for (const [abre, fecha] of h[dia] ?? []) {
    if (min >= abre && min < fecha) {
      return { estado: "aberto", fechaEm: `Fecha às ${fmt(fecha)}` };
    }
  }
  return { estado: "fechado", /* próximo bloco: calcular abreEm varrendo os próximos 7 dias */ };
}

function fmt(m: number) {
  const hh = Math.floor(m / 60), mm = m % 60;
  return mm ? `${hh}h${String(mm).padStart(2, "0")}` : `${hh}h`;
}
```

Importante: a página é ISR (`revalidate = 300`), então o "aberto agora" calculado no servidor pode ficar 5 min defasado. Para precisão, calcule no **cliente** (um pequeno componente client que recebe o `horario` e chama `estadoAgora()` no mount). No card da home — que já é client (`search-experience` é `"use client"`) — calcule direto no render.

### 2.3 Página do comércio — reordenar e dar topo visual

Problemas atuais (F2, F5): sem foto no topo, e a oferta MRP vem antes do conteúdo da comunidade.

Mudanças:

**a) Hero do comércio com foto + sinais.** Substituir o cabeçalho atual (emoji 16×16) por uma faixa com foto, nome, badge verificado e estado "aberto agora":

```tsx
<div className="overflow-hidden rounded-2xl border border-linha bg-branco">
  {c.fotoUrl && (
    <div className="aspect-[21/9] w-full overflow-hidden bg-ar">
      <img src={c.fotoUrl} alt={c.nome} className="h-full w-full object-cover" />
    </div>
  )}
  <div className="p-6 sm:p-8">
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-verde">{c.categoria}</p>
      {c.verificado && (
        <span className="flex items-center gap-1 rounded-full bg-verde/10 px-2.5 py-1 text-xs font-semibold text-verde">
          ✓ Verificado pelo dono
        </span>
      )}
      <EstadoAberto horario={c.horario} /> {/* client component */}
    </div>
    <h1 className="mt-2 qc-display text-2xl text-concreto sm:text-3xl">{c.nome}</h1>
    <p className="mt-2 text-sm text-concreto-claro">
      {c.bloco ? <span className="font-semibold text-concreto">Bloco {c.bloco}</span> : "Comércio local"} · {local}
      {c.endereco ? ` · ${c.endereco}` : ""}
    </p>
    <div className="mt-5 border-t border-linha pt-5">
      <CapivaraRating value={c.capivaras} count={c.avaliacoes} />
    </div>
    <Contato c={c} />
  </div>
</div>
```

**b) Nova ordem da coluna principal:**
1. Hero (foto + sinais + contato)
2. **Horário de funcionamento** (lista dos 7 dias, com hoje destacado)
3. **Avaliações da comunidade** (`AvaliacaoForm` + lista) ← sobe para perto do topo
4. **Bloco MRP/Plano Piloto Digital** ← desce. Para o morador é menos relevante; para o dono (que chegou via reivindicação) continua visível.

**c) Galeria de fotos das avaliações.** Com avaliações de até 3 fotos (em implementação), exiba uma faixa de miniaturas (lazy, lightbox simples). Prova social visual > texto.

### 2.4 Busca / Home — barra de filtros e atalhos espaciais

Adicionar, logo abaixo dos resultados, uma **barra de filtros sticky** (só aparece quando há resultados):

```tsx
<div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center gap-2 border-b border-linha bg-ar/90 px-6 py-3 backdrop-blur">
  <FiltroToggle ativo={apenasAbertos} onChange={setApenasAbertos} label="Aberto agora" />
  <FiltroToggle ativo={apenasVerificados} onChange={setApenasVerificados} label="Verificados" />
  <FiltroToggle ativo={apenasComFoto} onChange={setApenasComFoto} label="Com foto" />
  <span className="ml-auto text-sm text-concreto-claro">
    Ordenar:
    <select className="ml-1 bg-transparent font-semibold text-concreto focus:outline-none">
      <option>Mais bem avaliados</option>
      <option>Mais avaliados</option>
      <option>A–Z</option>
    </select>
  </span>
</div>
```

`FiltroToggle` — pill no padrão da marca:

```tsx
function FiltroToggle({ ativo, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!ativo)}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        ativo
          ? "bg-verde text-branco"
          : "border border-linha bg-branco text-concreto-claro hover:border-verde/40 hover:text-concreto"
      }`}
    >
      {label}
    </button>
  );
}
```

Melhorias adicionais na home:
- **Estado vazio com sugestão (F10):** quando 0 resultados, sugerir as 3 categorias/quadras mais parecidas (Levenshtein simples sobre a query) — "Você quis dizer 409 Sul?".
- **Botão "📍 Perto de mim"** ao lado da busca (ver §3e).
- **Ordenação padrão por nota desc.** assim que houver variação real de nota (hoje todos 5,0 — ver §6 sobre semear avaliações).

---

## 3. Novas Funcionalidades Recomendadas

### a) Mapa interativo — grade visual do Plano Piloto
- **Problema:** o produto é espacial (quadra/bloco), mas a navegação é 100% textual. O usuário não "vê" onde está cada comércio.
- **Como funcionaria:** um SVG estilizado da Asa Sul/Norte com as superquadras como blocos clicáveis. Clicar numa quadra = mesma busca de "modo quadra" que já existe. Heatmap leve: quadras com mais comércios em verde mais saturado. **Não precisa de mapa real (Google Maps) na v1** — uma grade esquemática combina com a marca (o hero já tem grade de superquadra) e é muito mais barata.
- **Impacto:** diferenciação forte vs. Google, tempo de sessão, descoberta de quadras vizinhas. Médio esforço, alto valor de marca.

### b) "Aberto agora" — filtro + ordenação
- **Problema:** pergunta nº1 do morador; hoje invisível (F3).
- **Como funcionaria:** função `estadoAgora()` (§2.2) alimenta a pill nos cards, o badge na página e o filtro toggle (§2.4). Cálculo no cliente para precisão.
- **Impacto:** altíssima utilidade percebida, baixo esforço (depende só do campo `horario` já em implementação). **Quick win — fazer junto com a foto.**

### c) Notificações de avaliação para o dono
- **Problema:** o dono não tem motivo recorrente para voltar; perde feedback dos clientes.
- **Como funcionaria:** ao publicar uma avaliação aprovada na moderação, dispara email para o dono que reivindicou (Supabase Edge Function ou trigger → Resend/email). Email com a nota, trecho e link para responder. Inclui um CTA discreto de upgrade só quando relevante.
- **Impacto:** retenção do dono, qualidade dos dados (dono mantém perfil atualizado), gancho natural para GMN. Médio esforço.

### d) QC Premium para donos
- **Problema:** monetização recorrente e diferenciação de quem investe no perfil.
- **Como funcionaria:** plano pago do dono verificado desbloqueia: galeria de fotos ampliada, descrição rica, **promoções/cupons** com selo, **destaque na busca** (card com borda `verde` e tag "Destaque"), prioridade de ordenação dentro da quadra, e estatísticas (visualizações, cliques no WhatsApp). Visualmente o card Premium:

```tsx
className="... ring-1 ring-verde/50 shadow-md"
// + tag:
<span className="absolute left-2 top-2 rounded-full bg-verde px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-branco">Destaque</span>
```
- **Impacto:** receita recorrente; complementa (não concorre) com o GMN, que é serviço high-touch. Premium = self-service barato; GMN = consultoria. Médio/alto esforço (pagamento + flags).

### e) Busca por distância — "perto de mim"
- **Problema:** quem não sabe o número da quadra ("estou na rua, quero um café perto").
- **Como funcionaria:** botão "📍 Perto de mim" → `navigator.geolocation` → mapeia lat/long para a quadra mais próxima (precisa de centróide lat/long por quadra; obtenível via Google Places junto com o resto). Ordena resultados por distância. Fallback gracioso se o usuário negar permissão (volta pra busca normal).
- **Impacto:** captura intenção mobile de alta conversão. Médio esforço (depende de geocoding das quadras).

### f) Ranking semanal
- **Problema:** falta de motivo para voltar ao site (engajamento recorrente) e a nota 5,0 uniforme não cria "vencedores".
- **Como funcionaria:** "Os mais bem avaliados da semana na 410 Sul" — ranking por quadra baseado em avaliações dos últimos 7 dias (peso para volume + nota). Seção na home e página `/ranking/[quadra]`. Email/notificação semanal opcional. Cria competição saudável → mais donos reivindicam para subir.
- **Impacto:** engajamento recorrente, conteúdo fresco para SEO, gancho de venda ("seu concorrente está em 1º"). Médio esforço.

### g) Compartilhamento — OG card bonito
- **Problema:** WhatsApp é o canal nº1 em Brasília; hoje compartilhar um comércio gera preview genérico (F9).
- **Como funcionaria:** rota `opengraph-image.tsx` por comércio (Next 16 suporta geração de imagem). Card com foto do comércio, nome, nota em capivaras, quadra/bloco e logo QC, nos tokens da marca. Botão "Compartilhar" na página usando `navigator.share`.
- **Impacto:** viralidade orgânica gratuita, baixo/médio esforço. **Bom ROI.**

### h) Fila de espera / avisos (futuro)
- **Problema:** restaurantes lotados; cliente quer ser avisado.
- **Como funcionaria:** "Me avise" → o dono Premium publica disponibilidade e o sistema notifica inscritos. Escopo grande, depende de adoção dos donos.
- **Impacto:** alto, mas **só faz sentido depois** que houver massa de donos ativos. Manter como visão, não roadmap imediato.

### Três ideias originais recomendadas

**i) Coleções / "Listas da quadra" curadas**
- **Problema:** descoberta além da busca literal.
- **Como funcionaria:** listas editoriais — "Cafés pet-friendly da Asa Sul", "Onde almoçar barato perto da 410". Curadas pelo admin no começo; depois, membros podem criar e seguir listas. URLs ótimas para SEO ("melhores X em Brasília").
- **Impacto:** SEO de cauda longa, identidade editorial, engajamento. Baixo/médio esforço (começa só com admin).

**j) "Sumiu/Mudou" — manutenção da base pela comunidade**
- **Problema:** 556 comércios envelhecem; alguns fecham. Dados errados destroem confiança.
- **Como funcionaria:** botão discreto "Fechou? Mudou de lugar?" na página do comércio → reporte rápido (membro logado) → fila no admin. Gamificação leve: "guardião da quadra" para quem mais ajuda a manter a base.
- **Impacto:** qualidade de dados sustentável a custo quase zero, comunidade engajada. Baixo esforço.

**k) Selo "Favorito da Quadra" (badge social, não pago)**
- **Problema:** com a nota 5,0 uniforme, falta um sinal de destaque *orgânico* (diferente do Premium pago).
- **Como funcionaria:** comércio nº1 em avaliações dos últimos 30 dias na sua quadra ganha selo "🦫 Favorito da 409 Sul". Renova mensalmente. Distinto visualmente do "Destaque" (que é pago).
- **Impacto:** prova social poderosa, incentivo a coletar avaliações reais, conteúdo compartilhável. Baixo esforço (deriva do ranking, item f).

---

## 4. Fluxo do Dono de Negócio

### 4.1 Jornada ponta a ponta

```
1. DESCOBERTA      Dono encontra o próprio comércio na busca (ou recebe link "reivindique")
        ↓
2. REIVINDICAÇÃO   Página /comercio/[slug] → "É o seu comércio? Reivindique"
                   → ClaimForm (variant="reivindicacao")
                   → precisa estar logado (/entrar); se não, cadastra primeiro
        ↓
3. VERIFICAÇÃO     Confirma posse: código por WhatsApp/telefone do comércio, OU
                   doc/print do Google Meu Negócio anexado p/ análise manual
        ↓
4. APROVAÇÃO ADMIN Pedido entra na fila do /admin → admin aprova/recusa
                   → comércio recebe flag `verificado = true` + `dono_id`
        ↓
5. DASHBOARD       Dono acessa /conta → vê "Meus comércios" → painel do negócio
        ↓
6. EDIÇÃO          Edita foto, horário, telefone, descrição, redes (vai p/ moderação)
        ↓
7. OFERTA GMN      No dashboard, faixa não intrusiva oferece o serviço GMN do MRP
                   (só para donos verificados) + eventual upsell QC Premium
```

### 4.2 Como o dono acessa o painel do próprio negócio

- Entrada única por **`/conta`** (perfil já existe). Adicionar uma seção **"Meus comércios"** que lista os comércios onde `dono_id = usuário`. Cada item → **`/conta/comercio/[slug]`** (dashboard do negócio).
- Estados claros: *Reivindicação pendente* (badge laranja `aviso`), *Verificado* (badge `verde`), *Recusado* (com motivo + reenviar).
- Atalho contextual: na página pública do comércio, se o usuário logado **é o dono**, trocar o card "Reivindique este perfil" por **"Você gerencia este comércio → Editar perfil"**.

### 4.3 O que o dono pode editar

| Campo | Edita? | Moderação |
|-------|--------|-----------|
| Foto de capa + galeria | Sim | Vision API (imagem) |
| Horário de funcionamento | Sim | Auto (formato validado) |
| Telefone / WhatsApp | Sim | Auto (formato) |
| Descrição | Sim | Vision/texto |
| Instagram / Site | Sim | Auto (formato) |
| Categoria | Sugere; admin confirma | Manual |
| **Nome, quadra, bloco** | **Não** (pede ao admin) | Manual — protege integridade do diretório |
| Nota / avaliações | Nunca | — |
| Responder avaliações | Sim | Vision/texto |

Regra de ouro: **dono nunca edita a própria nota nem apaga avaliação** — só responde. Isso preserva a confiança no sistema de capivaras.

### 4.4 Como a oferta GMN aparece de forma não intrusiva

Princípios:
- **Nunca bloqueia** a tarefa do dono. A oferta é uma faixa lateral/rodapé no dashboard, **não** um modal nem um passo obrigatório.
- **Contextual, baseada em sinal real.** Reusar `presencaGoogle`: se "fraca"/"ausente", a copy é mais direta ("quase ninguém te encontra no Google"); se "forte", vira convite suave. Mesma lógica que já existe na página pública.
- **Uma oferta por vez.** Não empilhar GMN + Premium na mesma tela. GMN (serviço high-touch do MRP) aparece no dashboard do dono; Premium (self-service) aparece como upsell separado, leve.
- **Dispensável e com memória.** Botão "agora não" some por 30 dias (flag por usuário). Respeitar o "não" constrói confiança.

Exemplo de faixa GMN no dashboard:

```tsx
<aside className="rounded-2xl border border-aviso/40 bg-aviso/5 p-5">
  <p className="qc-brand text-sm text-verde">Plano Piloto Digital · GMN</p>
  <h3 className="mt-1 qc-display text-lg text-concreto">
    {googleFraco ? "Seu comércio quase não aparece no Google." : "Quer mais clientes da sua quadra?"}
  </h3>
  <p className="mt-1 text-sm text-concreto-claro">
    A gente cuida do seu Google Meu Negócio, avaliações e presença — você cuida do balcão.
  </p>
  <div className="mt-3 flex items-center gap-3">
    <a href="https://marcosroberto.pro/..." className="rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco hover:bg-verde-escuro">
      Falar com a Plano Piloto Digital
    </a>
    <button className="text-sm text-concreto-claro hover:text-concreto">Agora não</button>
  </div>
</aside>
```

---

## 5. Wireframes em ASCII (3 melhorias de maior impacto)

### 5.1 Card de comércio enriquecido (§2.1 + §3b)

```
┌───────────────────────────────────┐
│                              ┌────┐│
│        [ FOTO DO LOCAL ]     │5,0🦫││   ← nota canto sup. dir
│        16:10, object-cover   └────┘│
│ ┌──────────────┐                   │
│ │● Aberto agora│                   │   ← pill (verde=aberto / concreto=fechado)
│ └──────────────┘                   │
├───────────────────────────────────┤
│ Café da Quadra        ✓            │   ← nome + selo verificado
│ CAFETERIA                          │
│ Bloco B · Quadra 409 SUL           │
│                                    │
│ 🦫 38 avaliações                   │   ← prova social (ou "Seja o 1º a avaliar")
└───────────────────────────────────┘
```

### 5.2 Página do comércio reordenada (§2.3)

```
┌──────────────────────────────────────────────────────────────┐
│  Q  Quadrado Capital                         ← Voltar à busca  │
├──────────────────────────────────────────────────────────────┤
│ Início / Quadra 409 SUL / Café da Quadra                       │
│                                                                │
│ ┌──────────────────────────────────┐  ┌────────────────────┐  │
│ │ [ FOTO DE CAPA 21:9 ]            │  │ Você gerencia este │  │
│ │                                  │  │ comércio?          │  │
│ │ CAFETERIA  ✓Verificado ●Aberto   │  │ → Editar perfil    │  │
│ │ Café da Quadra                   │  │  (ou Reivindicar,  │  │
│ │ Bloco B · Q409 SUL · End.        │  │   se não é dono)   │  │
│ │ ─────────────────────────────    │  └────────────────────┘  │
│ │ 🦫🦫🦫🦫🦫 5,0 (38)              │   (sidebar sticky)        │
│ │ [WhatsApp][Telefone][Site][IG]   │                          │
│ └──────────────────────────────────┘                          │
│ ┌──────────────────────────────────┐                          │
│ │ HORÁRIO   Hoje ● aberto até 22h   │  ← novo bloco            │
│ │ Seg–Sex 8h–22h · Sáb 9h–18h ...   │                          │
│ └──────────────────────────────────┘                          │
│ ┌──────────────────────────────────┐                          │
│ │ AVALIAÇÕES DA COMUNIDADE          │  ← SOBE (antes do MRP)   │
│ │ [ ✍ Avaliar ]  [foto][foto][foto] │                          │
│ │ "Melhor pão de queijo..." 🦫🦫🦫🦫🦫│                          │
│ └──────────────────────────────────┘                          │
│ ┌──────────────────────────────────┐                          │
│ │ Presença digital · Plano Piloto…  │  ← DESCE (lead-gen)      │
│ └──────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 Home com filtros + atalho espacial (§2.4 + §3a/e)

```
┌──────────────────────────────────────────────────────────────┐
│ ░░ grade superquadra ░░            Quadrado Capital            │
│                                                                │
│ Encontre tudo na sua QUADRA.                          ╭─────╮  │
│ ┌──────────────────────────────────────┐ ┌──────────┐│ 🦫  │  │
│ │ 🔍 Busque tema ou quadra...          │ │📍 Perto  ││capi-│  │
│ └──────────────────────────────────────┘ │  de mim  ││vara │  │
│ [Academias][409 Sul][Restaurantes]...     └──────────┘╰─────╯  │
│ Quadras populares: (409 Sul)(410 Sul)(513 Sul)...             │
│ 556 comércios · 87 quadras · nota em capivaras 🦫             │
├──────────────────────────────────────────────────────────────┤
│ ▓ FILTROS (sticky) ▓                                          │
│ [●Aberto agora] [Verificados] [Com foto]   Ordenar: Mais ▾   │
├──────────────────────────────────────────────────────────────┤
│  409 SUL ──────────────────────────────────── 12 comércios   │
│  ┌────────┐ ┌────────┐ ┌────────┐                            │
│  │ [card] │ │ [card] │ │ [card] │   ← cards com foto (§5.1)   │
│  └────────┘ └────────┘ └────────┘                            │
│                                                                │
│  [ 🗺  Ver na grade do Plano Piloto ]   ← entrada do mapa     │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Métricas de Sucesso (KPIs early-stage)

Manter simples e acionável. Sugestão de instrumentação leve (eventos no Supabase ou um analytics como Plausible/PostHog).

### Engajamento de busca/descoberta
- **Taxa de clique no resultado** (cliques em card ÷ buscas com resultado). Meta inicial: > 35%. Sobe quando o card ganha foto e sinais.
- **% buscas que retornam 0 resultados.** Meta: < 8%. Cair indica que o parser e as sugestões (F10) estão bons.
- **Uso dos filtros** (% de sessões que ativam "Aberto agora"). Valida a feature (b).

### Confiança e conteúdo
- **Nº de avaliações publicadas / semana** (e % de comércios com ≥1 avaliação). Hoje provavelmente baixíssimo — é o KPI de saúde do produto. **Ação imediata:** semear avaliações reais para quebrar o 5,0 uniforme (F1); a nota só vira útil quando varia.
- **% de comércios com foto** e **% com horário cadastrado.** Mede a evolução da base via Google Places + donos.
- **Taxa de moderação** (% de avaliações/imagens reprovadas). Acompanhar para calibrar a Vision API.

### Funil do dono (monetização)
- **Reivindicações iniciadas → aprovadas** (taxa de conversão e tempo médio até aprovação no admin).
- **% de comércios verificados** sobre o total. Meta de tração: 5% em 90 dias.
- **Cliques na oferta GMN** (no dashboard) e **leads gerados** para o MRP. KPI de receita.
- **Conversão QC Premium** (donos verificados que assinam), quando lançado.

### Retorno / retenção
- **Visitantes recorrentes / semana** (alavancado por ranking semanal e notificações).
- **Compartilhamentos** (cliques no botão share / OG impressions), validando feature (g).

### Norte estratégico (1 número-chave)
> **Comércios "vivos": % de comércios com foto + horário + ≥1 avaliação real.**
> É o melhor proxy único de que o diretório é útil, confiável e mantido. Tudo acima empurra esse número.

---

## Apêndice — Sequência de implementação sugerida

| Onda | Itens | Por quê primeiro |
|------|-------|------------------|
| **1 — Confiança visível** | Foto no card e na página · badge verificado · "aberto agora" (§2.1–2.3, 3b) | Maior impacto percebido, depende só dos campos já em implementação |
| **2 — Decisão e prova social** | Filtros + ordenação · avaliações acima do MRP · galeria de fotos · OG card (§2.4, 3g) | Converte tráfego em ação; viralidade |
| **3 — Dono e receita** | Dashboard do dono · oferta GMN não intrusiva · notificações (§4, 3c) | Motor de monetização e qualidade de dados |
| **4 — Engajamento recorrente** | Ranking + Favorito da Quadra · "perto de mim" · coleções (3f, 3e, 3i, 3k) | Retenção e SEO de cauda longa |
| **5 — Visão** | Mapa interativo · QC Premium completo · fila de espera (3a, 3d, 3h) | Diferenciação e receita recorrente, exigem mais base |

> Princípio transversal: **a nota em capivaras só cumpre seu papel quando varia.** Priorizar a coleta de avaliações reais (e quebrar o 5,0 uniforme) é pré-requisito para que ordenação, ranking, "Favorito da Quadra" e busca por qualidade façam sentido.
