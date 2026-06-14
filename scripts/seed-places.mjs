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

// Slugs já existentes no banco — não sobrescrever (atualizado 2026-06-14)
const SLUGS_EXISTENTES = new Set([
  "102n-a-1","102s-a-1","102s-a-2","102s-a-3","102s-a-4","102s-b-1","102s-c-1","102s-c-2",
  "103s-a-1","103s-a-2","103s-a-3","103s-a-4","103s-a-5",
  "104n-a-1","104n-a-2","104n-a-3","104n-a-4","104n-a-5","104n-a-6","104n-b-1",
  "104s-a-1","104s-a-2","104s-a-3","104s-a-4","104s-a-5","104s-b-1","104s-c-1",
  "105n-a-1","105n-a-2","105n-a-3","105n-a-4","105n-a-5","105s-a-1","105s-a-2","105s-a-3","105s-a-4","105s-c-1",
  "106n-a-1","106n-a-2","106n-a-3","106s-a-1","106s-b-1",
  "107n-a-1","107n-a-2","107n-a-3","107n-a-4","107n-a-5","107n-c-1","107n-c-2","107n-d-1",
  "107s-a-1","107s-a-2","107s-a-3","107s-a-4","107s-a-5","107s-b-1","107s-c-1","107s-c-2","107s-c-3",
  "108n-a-1","108n-a-2","108n-a-3","108s-a-1","108s-a-2","108s-a-3","108s-a-4","108s-a-5","108s-a-6","108s-b-2","108s-d-1",
  "109n-a-1","109n-a-2","109n-a-3","109n-a-4","109n-a-5","109n-b-1","109n-c-1",
  "109s-a-1","109s-a-2","109s-a-3","109s-c-1","109s-c-2","109s-c-3","109s-d-1",
  "110n-a-1","110n-a-2","110n-a-3","110n-a-4","110n-d-1","110s-a-1","110s-a-2","110s-a-3","110s-a-4","110s-c-1",
  "111n-a-1","111n-a-2","111n-a-3","111s-a-1","111s-a-2","111s-a-3","111s-a-4","111s-a-5",
  "112n-a-1","112n-a-2","112n-a-3","112n-a-4","112n-a-5","112s-a-1","112s-a-2","112s-a-3","112s-a-4","112s-c-1","112s-c-2",
  "113n-a-1","113n-a-2","113n-a-3","113n-a-4","113n-a-5","113s-a-1","113s-a-2","113s-a-3","113s-a-4","113s-a-5","113s-c-1","113s-c-2","113s-d-1",
  "114n-a-1","114n-a-2","114n-a-3","114n-b-1","114n-c-1","114s-a-1","114s-a-2","114s-a-3","114s-a-4","114s-a-5","114s-c-1",
  "115n-a-1","115n-a-2","115n-a-3","115n-a-4","115n-a-6","115n-a-7","115n-a-8","115s-a-1","115s-a-2","115s-a-3","115s-a-4","115s-b-1","115s-b-2","115s-d-1",
  "116n-a-1","116n-a-2","116n-a-3","116n-a-4","116n-a-5","116n-f-1","116s-a-1","116s-a-2","116s-a-3","116s-b-1","116s-d-1",
  "201n-a-1","201s-a-1","201s-a-2","201s-a-3","201s-a-4","201s-b-1","201s-c-1",
  "202s-a-1","202s-a-2","202s-a-3","202s-a-4","202s-b-1","202s-c-1","202s-c-2",
  "203s-a-1","203s-a-2","203s-a-3","203s-b-1","203s-c-1",
  "204n-a-1","204n-a-2","204n-a-3","204n-a-4","204n-a-5","204n-d-1","204n-d-2","204s-a-1","204s-a-2","204s-a-3","204s-a-4","204s-a-5",
  "205n-a-1","205n-a-2","205n-a-3","205n-b-1","205n-b-2","205n-c-1","205n-c-2","205s-a-1","205s-a-2","205s-a-3","205s-a-4","205s-b-1",
  "206n-a-1","206n-a-2","206n-c-1","206n-c-2","206n-d-1","206s-a-1","206s-a-2","206s-a-3","206s-a-4","206s-b-1","206s-b-2","206s-c-1",
  "207n-a-1","207n-a-2","207n-a-3","207n-b-1","207n-b-2","207s-a-1","207s-b-1","207s-c-1",
  "208n-a-1","208n-a-2","208n-c-1","208n-c-2","208s-a-1","208s-a-2","208s-a-3","208s-a-4","208s-a-5","208s-b-1","208s-c-1",
  "209n-a-1","209n-a-2","209n-a-3","209n-d-1","209s-a-1","209s-a-2","209s-a-3","209s-a-4","209s-a-5","209s-a-6","209s-b-1","209s-b-2","209s-c-1","209s-c-2","209s-c-3","209s-d-1",
  "210n-a-1","210n-a-2","210n-a-3","210n-a-4","210n-a-5","210s-a-1","210s-b-1","210s-b-2","210s-b-3","210s-c-1",
  "211n-a-1","211n-a-2","211n-a-3","211n-a-4","211n-d-1","211s-a-1","211s-a-2","211s-a-3","211s-a-4","211s-b-1","211s-c-1",
  "212n-a-1","212n-a-2","212n-a-3","212n-c-1","212s-a-1","212s-a-2","212s-a-3","212s-b-1","212s-b-2","212s-b-3","212s-c-1",
  "213n-a-1","213n-a-2","213n-a-3","213n-a-4","213n-a-5","213n-a-6","213n-a-7","213n-b-1","213n-c-1","213s-a-1","213s-a-2","213s-a-3","213s-c-1","213s-c-2",
  "214n-c-1","214s-a-1","214s-c-1","214s-c-2",
  "215n-a-1","215n-a-2","215n-a-3","215n-a-4","215n-c-1","215s-a-1","215s-a-2","215s-a-3","215s-a-4","215s-a-5","215s-a-6","215s-a-7","215s-b-1","215s-b-2","215s-c-1","215s-c-2",
  "216n-a-1","216n-a-2","216n-a-3","216n-a-4","216s-a-1","216s-a-2","216s-a-3","216s-b-1","216s-b-2",
  "302s-a-1","302s-a-2","302s-a-3","302s-a-4","302s-a-5","302s-b-1","302s-b-2",
  "303n-b-1","303s-a-1","303s-a-2","303s-c-1","303s-d-1",
  "304n-a-1","304n-a-2","304n-a-3","304n-a-4","304s-a-1","304s-a-2","304s-a-3","304s-a-4","304s-c-1","304s-c-2",
  "305n-a-1","305n-a-2","305n-a-3","305n-a-4","305n-a-5","305n-a-6","305n-a-7","305n-a-8","305s-a-1","305s-a-2","305s-a-3","305s-a-4","305s-a-5","305s-c-1",
  "306n-a-1","306n-a-2","306n-a-3","306n-a-4","306n-a-5","306n-a-6","306s-a-1","306s-a-2","306s-a-3","306s-c-1","306s-c-2",
  "307n-a-1","307n-a-2","307n-a-3","307n-a-4","307n-c-1","307s-a-1","307s-a-2","307s-a-3","307s-a-4","307s-a-5","307s-a-6","307s-c-1",
  "308n-a-1","308n-a-2","308n-a-3","308n-a-4","308n-a-5","308n-b-1","308n-c-1","308s-a-1","308s-a-2","308s-a-3","308s-a-4","308s-a-5",
  "309n-a-1","309n-a-2","309n-a-3","309n-a-4","309n-a-5","309n-a-6","309n-e-1","309n-e-2","309s-a-1","309s-a-2","309s-a-3","309s-a-4","309s-b-1",
  "310n-a-1","310n-a-2","310n-a-3","310n-b-1","310n-c-1","310n-d-1","310s-a-1","310s-d-1",
  "311n-a-1","311n-a-2","311n-a-3","311n-a-4","311n-a-5","311n-a-6","311n-a-7","311n-a-8","311n-a-9","311n-e-1",
  "312n-a-1","312n-a-2","312n-a-3","312s-a-1","312s-a-2","312s-a-3","312s-a-4","312s-a-5","312s-d-1",
  "313n-a-1","313n-a-2","313n-a-3","313n-a-4","313n-a-5","313n-d-1","313s-b-1",
  "314s-a-1","314s-a-2","314s-d-1","315s-a-1","315s-a-2","315s-a-3","315s-a-4","315s-b-1","315s-d-1","315s-d-2",
  "316n-a-1","316n-a-2","316n-a-3","316n-b-1","316n-e-1","316n-f-1",
  "402s-a-1","402s-b-1","402s-c-1",
  "403n-a-1","403s-b-1","403s-d-1",
  "404n-a-1","404n-a-2","404n-b-1","404s-a-1","404s-a-2","404s-a-3","404s-a-4","404s-a-5","404s-a-6","404s-b-1","404s-c-1","404s-c-2",
  "405n-a-1","405n-b-1","405n-c-1","405s-a-1","405s-a-2","405s-a-3","405s-a-4","405s-a-5","405s-a-6","405s-b-1","405s-b-2","405s-d-1","405s-d-2","405s-d-3",
  "406s-a-1","406s-a-2","406s-a-3","406s-a-4","406s-a-5","406s-d-1","406s-d-2","406s-d-3","406s-d-4",
  "407s-a-1","407s-a-2","407s-b-1",
  "408n-a-1","408n-a-2","408n-b-1","408n-b-2","408n-b-3","408s-a-1","408s-b-1","408s-c-1","408s-c-2",
  "409s-a-1","409s-a-2","409s-c-1",
  "410n-a-1","410n-a-2","410s-a-1","410s-a-2","410s-a-3","410s-a-4","410s-a-5","410s-c-1","410s-d-1",
  "411n-a-1","411n-a-2","411n-b-1","411n-c-1","411s-a-1","411s-a-2","411s-a-3","411s-a-4","411s-a-5","411s-a-6",
  "412n-a-1","412n-a-2","412n-e-1","412s-a-1","412s-a-2","412s-a-3","412s-a-4","412s-a-5","412s-b-1","412s-c-1",
  "413n-a-1","413n-c-1","413n-d-1","413s-a-1","413s-a-2","413s-a-3","413s-b-1","413s-b-2","413s-d-1",
  "414s-a-1","414s-a-2","414s-a-3","414s-d-1",
  "415s-a-1","415s-a-2","415s-a-3","415s-a-4","415s-a-5","415s-a-6","415s-b-1",
  "506s-b-1","509s-c-1","513s-c-1",
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
