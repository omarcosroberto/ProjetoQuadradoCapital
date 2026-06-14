/**
 * seed-places.mjs
 * Busca comércios reais por quadra no Google Places API (Text Search)
 * e gera uma migration SQL para o Supabase.
 *
 * Uso:
 *   GOOGLE_MAPS_API_KEY=xxx node scripts/seed-places.mjs
 *   GOOGLE_MAPS_API_KEY=xxx node scripts/seed-places.mjs --asa sul --de 101 --ate 116
 *   GOOGLE_MAPS_API_KEY=xxx node scripts/seed-places.mjs --dry-run
 */

import { writeFileSync, appendFileSync, existsSync, readFileSync } from "fs";
import { argv } from "process";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error("❌  Defina GOOGLE_MAPS_API_KEY no ambiente.");
  process.exit(1);
}

// ─── Config ────────────────────────────────────────────────────────────────

const DRY_RUN = argv.includes("--dry-run");
const ASA_FILTER = argv.includes("--asa")
  ? argv[argv.indexOf("--asa") + 1]
  : null; // "sul" | "norte"
const DE = argv.includes("--de") ? Number(argv[argv.indexOf("--de") + 1]) : 101;
const ATE = argv.includes("--ate")
  ? Number(argv[argv.indexOf("--ate") + 1])
  : 516;

const DELAY_MS = 200; // entre requests (evita rate limit)
const OUT_SQL = "scripts/resultado-places.sql";
const OUT_JSON = "scripts/resultado-places.json";

// Slugs já existentes no banco — não sobrescrever
const SLUGS_EXISTENTES = new Set([
  "104s-a-1","106s-a-1","106s-b-1","107s-a-1","107s-b-1","108s-a-1","108s-d-1",
  "109s-c-1","109s-c-2","109s-d-1","206s-a-1","206s-b-1","206s-c-1","207s-a-1",
  "207s-b-1","207s-c-1","208s-b-1","208s-c-1","209s-a-1","209s-a-2","209s-b-1",
  "209s-c-1","210s-b-1","210s-c-1","215s-a-1","215s-a-2","215s-a-3","215s-b-1",
  "216s-b-1","306s-c-1","404s-c-1","405s-a-1","405s-b-1","405s-d-1","405s-d-2",
  "406s-a-1","406s-d-1","406s-d-2","408s-a-1","408s-b-1","408s-c-1","408s-c-2",
  "409s-a-1","409s-a-2","412s-a-1","413s-a-1","413s-b-1","415s-a-1","506s-b-1",
  "104n-a-1","104n-a-2","107n-c-1","107n-d-1","110n-a-1","201n-a-1","206n-c-1",
  "209n-d-1","211n-a-1","213n-b-1","214n-c-1","308n-b-1","308n-c-1","309n-e-1",
  "311n-e-1","316n-e-1","404n-b-1","405n-a-1","408n-b-1","408n-b-2","411n-b-1",
  "412n-e-1",
]);

// ─── Quadras ────────────────────────────────────────────────────────────────

const TODAS_SUL = [
  101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,
  201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,
  301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,
  401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,
  501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,
];
const TODAS_NORTE = [
  104,105,106,107,108,109,110,111,112,113,114,115,116,
  204,205,206,207,208,209,210,211,212,213,214,215,216,
  304,305,306,307,308,309,310,311,312,313,314,315,316,
  404,405,406,407,408,409,410,411,412,413,414,415,416,
  504,505,506,507,508,509,510,511,512,513,514,515,516,
];

// ─── Categorias de busca ────────────────────────────────────────────────────

// Mapeamento: tipo Google → nossa categoria
// Ref: https://developers.google.com/maps/documentation/places/web-service/place-types
const TIPO_PARA_CATEGORIA = {
  supermarket: "Supermercado",
  grocery_or_supermarket: "Mercado",
  convenience_store: "Mercado",
  bakery: "Padaria",
  cafe: "Cafeteria",
  coffee_shop: "Cafeteria",
  restaurant: "Restaurante",
  food: "Restaurante",
  meal_takeaway: "Lanchonete",
  meal_delivery: "Lanchonete",
  pizza_delivery: "Pizzaria",
  bar: "Bar",
  night_club: "Bar",
  liquor_store: "Bar",
  ice_cream_shop: "Sorveteria",
  butcher_shop: "Açougue",
  drugstore: "Farmácia",
  pharmacy: "Farmácia",
  hospital: "Clínica",
  doctor: "Clínica",
  dentist: "Dentista",
  gym: "Academia",
  health: "Academia",
  hair_care: "Salão de Beleza",
  beauty_salon: "Salão de Beleza",
  barber_shop: "Barbearia",
  pet_store: "Pet Shop",
  veterinary_care: "Pet Shop",
  stationery_store: "Papelaria",
  book_store: "Livraria",
  optician: "Ótica",
  laundry: "Lavanderia",
  car_repair: "Mecânica",
  car_wash: "Lava a Jato",
  locksmith: "Chaveiro",
  shoe_store: "Sapataria",
  florist: "Floricultura",
  clothing_store: "Loja de Roupas",
  electronics_store: "Loja de Eletrônicos",
  hardware_store: "Ferragem",
  bank: "Banco",
  atm: "Banco",
  finance: "Banco",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function prefixo(quadra, asa) {
  if (asa === "Sul") return quadra >= 400 ? "SCLS" : "CLS";
  return quadra >= 400 ? "SCLN" : "CLN";
}

/** Tenta extrair bloco e número da loja do endereço retornado pelo Google. */
function parseEndereco(address) {
  if (!address) return { bloco: "A", loja: null };
  const blocoMatch = address.match(/[Bb]loco\s+([A-Ja-j])/);
  const lojaMatch = address.match(/[Ll]oja\s+(\d+)/);
  return {
    bloco: blocoMatch ? blocoMatch[1].toUpperCase() : "A",
    loja: lojaMatch ? lojaMatch[1] : null,
  };
}

/** Verifica se o endereço pertence à quadra esperada. */
function enderecoNaQuadra(address, quadra, asa) {
  if (!address) return false;
  const pref = prefixo(quadra, asa);
  const numStr = String(quadra);
  const re = new RegExp(`(${pref}|CL[SN]|SCL[SN])\\s*${numStr}`, "i");
  return re.test(address);
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

// Controla índices de loja por slug-base (ex: "104s-a" → próximo = 3)
const slugCounters = new Map();

function proximoSlug(quadra, asa, bloco) {
  const asaChar = asa === "Sul" ? "s" : "n";
  const base = `${quadra}${asaChar}-${bloco.toLowerCase()}`;
  const count = (slugCounters.get(base) ?? 0) + 1;
  slugCounters.set(base, count);
  const slug = `${base}-${count}`;
  if (SLUGS_EXISTENTES.has(slug)) {
    return proximoSlug(quadra, asa, bloco); // pula se já existe
  }
  SLUGS_EXISTENTES.add(slug);
  return slug;
}

// ─── Google Places API (New) ────────────────────────────────────────────────
// Usa a Places API (New): POST /v1/places:searchText
// Documentação: https://developers.google.com/maps/documentation/places/web-service/text-search

async function textSearch(query) {
  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        // Campos desejados — minimiza custo e latência
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.types",
          "places.rating",
          "places.userRatingCount",
        ].join(","),
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "pt-BR",
        regionCode: "BR",
        maxResultCount: 10,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`Places API: ${data.error.status} — ${data.error.message}`);
  }

  // Normaliza para o mesmo formato que o código abaixo espera
  return (data.places ?? []).map((p) => ({
    name: p.displayName?.text ?? "",
    formatted_address: p.formattedAddress ?? "",
    place_id: p.id ?? "",
    rating: p.rating ?? null,
    user_ratings_total: p.userRatingCount ?? 0,
    types: p.types ?? [],
  }));
}

// Padrões de nomes genéricos que o Google às vezes retorna
const NOMES_IGNORAR = [
  /^cls\s+\d/i,
  /^cln\s+\d/i,
  /^scls\s+\d/i,
  /^scln\s+\d/i,
  /^\d{3}\s+(sul|norte)/i,
];

function nomeValido(nome) {
  if (!nome || nome.trim().length < 3) return false;
  return !NOMES_IGNORAR.some((re) => re.test(nome.trim()));
}

// ─── Main ───────────────────────────────────────────────────────────────────

const resultados = [];
const slugsGerados = new Set();
const placeIdsVistos = new Set(); // evita duplicar mesmo lugar com categorias diferentes

/** Determina a melhor categoria a partir dos types do Google. */
function categoriaDosTypes(types) {
  for (const t of types) {
    if (TIPO_PARA_CATEGORIA[t]) return TIPO_PARA_CATEGORIA[t];
  }
  return "Restaurante"; // fallback genérico para estabelecimentos comerciais
}

async function buscarQuadra(quadra, asa) {
  const pref = prefixo(quadra, asa);
  const asaNome = asa === "Sul" ? "Asa Sul" : "Asa Norte";

  // Uma única busca genérica por quadra retorna até 20 resultados
  const query = `estabelecimentos ${pref} ${quadra} ${asaNome} Brasília DF`;

  if (DRY_RUN) {
    console.log(`  [DRY] ${query}`);
    return;
  }

  let places;
  try {
    places = await textSearch(query);
  } catch (e) {
    console.warn(`  ⚠️  Erro: ${e.message}`);
    await delay(2000);
    return;
  }

  for (const place of places) {
    const addr = place.formatted_address ?? "";
    if (!enderecoNaQuadra(addr, quadra, asa)) continue;
    if (!nomeValido(place.name)) continue;
    if (placeIdsVistos.has(place.place_id)) continue;
    placeIdsVistos.add(place.place_id);

    const categoria = categoriaDosTypes(place.types ?? []);
    const { bloco } = parseEndereco(addr);
    const slug = proximoSlug(quadra, asa, bloco);
    if (slugsGerados.has(slug)) continue;
    slugsGerados.add(slug);

    const enderecoLimpo = addr.replace(", Brasil", "").trim();

    resultados.push({
      slug,
      nome: place.name,
      categoria,
      asa,
      quadra,
      bloco,
      endereco: enderecoLimpo,
      place_id: place.place_id,
      google_rating: place.rating ?? null,
      google_reviews: place.user_ratings_total ?? 0,
      fonte: `google_places:${place.place_id}`,
    });

    console.log(`  ✅ ${slug} — ${place.name} (${categoria})`);
  }

  await delay(DELAY_MS);
}

async function main() {
  console.log("🗺️  Quadrado Capital — Google Places Seeder");
  console.log(`   DRY_RUN=${DRY_RUN}  ASA=${ASA_FILTER ?? "ambas"}  ${DE}–${ATE}`);
  console.log("");

  const asas = [
    ...(ASA_FILTER === "norte" ? [] : [{ asa: "Sul", quadras: TODAS_SUL }]),
    ...(ASA_FILTER === "sul" ? [] : [{ asa: "Norte", quadras: TODAS_NORTE }]),
  ];

  for (const { asa, quadras } of asas) {
    const filtradas = quadras.filter((q) => q >= DE && q <= ATE);
    for (const quadra of filtradas) {
      console.log(`\n📍 ${prefixo(quadra, asa)} ${quadra} — ${asa}`);
      await buscarQuadra(quadra, asa);
    }
  }

  if (DRY_RUN) {
    console.log("\n✅ Dry run concluído — nenhum arquivo gerado.");
    return;
  }

  // Salva JSON completo para auditoria
  writeFileSync(OUT_JSON, JSON.stringify(resultados, null, 2));
  console.log(`\n💾 JSON salvo em ${OUT_JSON} (${resultados.length} registros)`);

  // Gera SQL
  if (resultados.length === 0) {
    console.log("ℹ️  Nenhum resultado novo — SQL não gerado.");
    return;
  }

  const ts = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const linhas = resultados
    .map(
      ({ slug, nome, categoria, asa, quadra, bloco, endereco, place_id }) => {
        const placeId = place_id ? escapeSql(place_id) : null;
        const placeIdSql = placeId ? `'${placeId}'` : "null";
        return `  ('${slug}', '${escapeSql(nome)}', '${escapeSql(categoria)}', '${asa}', ${quadra}, '${bloco}', 5.0, 0, '${escapeSql(endereco)}', 'forte', ${placeIdSql}, true)`;
      }
    )
    .join(",\n");

  const sql = `-- Gerado por scripts/seed-places.mjs em ${new Date().toISOString()}
-- ${resultados.length} comércios encontrados via Google Places API

insert into public.comercios (slug, nome, categoria, asa, quadra, bloco, capivaras, avaliacoes, endereco, presenca_google, google_place_id, ativo)
values
${linhas}
on conflict (slug) do update set
  nome=excluded.nome, categoria=excluded.categoria, asa=excluded.asa,
  quadra=excluded.quadra, bloco=excluded.bloco, capivaras=excluded.capivaras,
  avaliacoes=excluded.avaliacoes, endereco=excluded.endereco,
  presenca_google=excluded.presenca_google, google_place_id=excluded.google_place_id, updated_at=now();
`;

  writeFileSync(OUT_SQL, sql);
  console.log(`\n✅ SQL gerado em ${OUT_SQL}`);
  console.log(`\n📋 Próximos passos:`);
  console.log(`   1. Revise ${OUT_JSON} para conferir os resultados`);
  console.log(
    `   2. Copie ${OUT_SQL} para marcos-roberto-pro/supabase/migrations/${ts}10_comercios_places.sql`
  );
  console.log(
    `   3. cd ../marcos-roberto-pro && supabase db push --include-all`
  );
}

main().catch((e) => {
  console.error("❌ Erro fatal:", e);
  process.exit(1);
});
