/**
 * enrich-places.mjs
 * Busca telefone, horário e foto de cada comércio com google_place_id.
 * Uso: GOOGLE_MAPS_API_KEY=xxx node scripts/enrich-places.mjs
 */

import { writeFileSync } from "fs";

// Rotação de chaves — cada uma tem 100 GetPlaceRequests/dia grátis
// 5 projetos × 100 = 500 requests → cobre os 441 comércios
const API_KEYS = (process.env.GOOGLE_MAPS_API_KEY
  ? [process.env.GOOGLE_MAPS_API_KEY]
  : []
).concat([
  "AIzaSyACEzhCYwyUiTPXI_vLfBI-IQmKTAoeSsI", // decent-being-382201
  "AIzaSyBrdFyaoOOVRRfU6si7ivvTI19HQYontXM", // gen-lang-client-0215379670
  "AIzaSyAJQuasPSQE7CpXHq0BPQ4VfuZk-gPZ6r8", // gen-lang-client-0825597435
  "AIzaSyD_OFjnXnGv37TYwz2OxkgGc2rQdMOGWQw", // gtm-m557kcc-382201
  "AIzaSyBWXhoPET91lWcjEw4HD1-WtlNBpHt28tM", // quadrado-capital (nova)
  "AIzaSyDR6Kd-vmNTm6amLwvCuu9i9a8hQAioPBg", // chave original (reserva)
]);

let keyIndex = 0;
let requestsNaChaveAtual = 0;
const LIMITE_POR_CHAVE = 95; // margem de segurança

function proximaChave() {
  if (requestsNaChaveAtual >= LIMITE_POR_CHAVE) {
    keyIndex = (keyIndex + 1) % API_KEYS.length;
    requestsNaChaveAtual = 0;
    console.log(`\n🔄 Trocando para chave ${keyIndex + 1}/${API_KEYS.length}\n`);
  }
  requestsNaChaveAtual++;
  return API_KEYS[keyIndex];
}

if (API_KEYS.length === 0) { console.error("❌ Nenhuma chave disponível"); process.exit(1); }

const DELAY_MS = 150;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Campos desejados — minimiza custo (só paga pelo que pede)
// Ref: https://developers.google.com/maps/documentation/places/web-service/place-details
const FIELD_MASK = [
  "nationalPhoneNumber",
  "regularOpeningHours.weekdayDescriptions",
  "photos",
].join(",");

async function getPlaceDetails(placeId) {
  const key = proximaChave();
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?languageCode=pt-BR`,
    {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
    }
  );
  if (res.status === 429) throw new Error(`QUOTA_EXCEEDED (chave ${keyIndex + 1})`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function getPhotoUrl(photoName) {
  const key = API_KEYS[keyIndex];
  // Tenta com skipHttpRedirect=true (retorna JSON com photoUri).
  // Se a chave não permitir, faz o redirect direto.
  const res = await fetch(
    `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${key}`
  );
  if (!res.ok) return null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = await res.json();
    return data.photoUri ?? null;
  }
  // Caso o endpoint faça redirect direto para a imagem (content-type image/*),
  // a URL final é acessível via res.url.
  if (contentType.startsWith("image/")) return res.url;
  return null;
}

// Busca todos os slugs com google_place_id via Supabase REST
async function fetchComerciosComPlaceId() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const res = await fetch(
    `${url}/rest/v1/qc_comercios?google_place_id=not.is.null&google_place_id=neq.&select=slug,google_place_id&limit=2000`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Supabase: ${await res.text()}`);
  const all = await res.json();
  // Filtra IDs que parecem válidos (ChIJ... tem pelo menos 20 chars)
  return all.filter(({ google_place_id }) => google_place_id && google_place_id.length > 15);
}

// Aplica o update direto via Supabase REST (PostgREST), usando a service role key
// para passar por RLS. Sem isso, o SQL gerado fica parado em scripts/enrich-resultado.sql
// e nada é atualizado de fato.
async function aplicarUpdate(slug, sets) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return false;

  const res = await fetch(`${url}/rest/v1/qc_comercios?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ...sets, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`PATCH ${slug}: ${(await res.text()).slice(0, 150)}`);
  return true;
}

const resultados = [];

async function main() {
  console.log("📸  Enriquecendo comércios com telefone, horário e foto...\n");

  const comercios = await fetchComerciosComPlaceId();
  console.log(`   ${comercios.length} comércios com google_place_id\n`);

  for (const { slug, google_place_id } of comercios) {
    try {
      const details = await getPlaceDetails(google_place_id);

      const telefone = details.nationalPhoneNumber ?? details.internationalPhoneNumber ?? null;
      const horario = details.regularOpeningHours?.weekdayDescriptions ?? null;

      // Pega a primeira foto
      let foto_url = null;
      if (details.photos?.length > 0) {
        foto_url = await getPhotoUrl(details.photos[0].name);
        await delay(50);
      }

      if (telefone || horario || foto_url) {
        resultados.push({ slug, telefone, horario, foto_url });

        const sets = {};
        if (telefone) sets.telefone = telefone;
        if (horario) sets.horario_funcionamento = horario;
        if (foto_url) sets.foto_url = foto_url;

        let aplicado = false;
        try {
          aplicado = await aplicarUpdate(slug, sets);
        } catch (e) {
          console.warn(`  ⚠️  PATCH falhou para ${slug}: ${e.message.slice(0, 100)}`);
        }

        const info = [telefone ? "📞" : "", horario ? "🕐" : "", foto_url ? "📸" : ""].filter(Boolean).join(" ");
        console.log(`  ✅ ${slug.padEnd(16)} ${info} ${aplicado ? "(aplicado)" : "(só no SQL/JSON gerado)"}`);
      } else {
        console.log(`  ○  ${slug.padEnd(16)} (sem dados extras)`);
      }
    } catch (e) {
      console.warn(`  ⚠️  ${slug}: ${e.message.slice(0, 80)}`);
      await delay(1000);
    }

    await delay(DELAY_MS);
  }

  // Gera SQL de update
  if (resultados.length === 0) {
    console.log("\nNenhum dado encontrado.");
    return;
  }

  writeFileSync("scripts/enrich-resultado.json", JSON.stringify(resultados, null, 2));

  const linhas = resultados.map(({ slug, telefone, horario, foto_url }) => {
    const tel = telefone ? `'${telefone.replace(/'/g, "''")}'` : "null";
    const hor = horario ? `'${JSON.stringify(horario).replace(/'/g, "''")}'::jsonb` : "null";
    const foto = foto_url ? `'${foto_url.replace(/'/g, "''")}'` : "null";
    return `  when slug = '${slug}' then (${tel}, ${hor}, ${foto})`;
  });

  // Gera UPDATE individual por slug usando case
  const updates = resultados.map(({ slug, telefone, horario, foto_url }) => {
    const sets = [];
    if (telefone) sets.push(`telefone = '${telefone.replace(/'/g, "''")}'`);
    if (horario) sets.push(`horario_funcionamento = '${JSON.stringify(horario).replace(/'/g, "''")}'::jsonb`);
    if (foto_url) sets.push(`foto_url = '${foto_url.replace(/'/g, "''")}'`);
    if (sets.length === 0) return null;
    return `update public.qc_comercios set ${sets.join(", ")}, updated_at = now() where slug = '${slug}';`;
  }).filter(Boolean);

  const sql = `-- Gerado por scripts/enrich-places.mjs
-- ${resultados.length} comércios enriquecidos com telefone, horário e foto

${updates.join("\n")}
`;

  writeFileSync("scripts/enrich-resultado.sql", sql);
  console.log(`\n✅ ${resultados.length} registros enriquecidos`);
  console.log(`   JSON: scripts/enrich-resultado.json`);
  console.log(`   SQL:  scripts/enrich-resultado.sql`);
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
