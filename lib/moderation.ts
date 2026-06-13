"use server";
import "server-only";

/**
 * Moderação de conteúdo do Quadrado Capital.
 *
 * - moderarTexto: blocklist PT-BR (palavrões, conteúdo adulto/sexual explícito,
 *   ódio). Usada em comentários de avaliação e mensagens de reivindicação.
 * - moderarImagem: Google Cloud Vision SafeSearch nas fotos de avaliação.
 *
 * Filosofia: a blocklist usa *raízes* de termos (ex. "porr") para pegar
 * variações flexionadas, e a normalização remove acentos para driblar
 * "fódá" → "foda". Não inclui palavras comuns/ambíguas para evitar falsos
 * positivos (ex.: não bloqueamos "saco", "pinto" como nome próprio etc.).
 */

// Raízes de termos proibidos (PT-BR). Comparação por inclusão sobre texto
// normalizado (sem acento, minúsculo). Mantidas como raízes para cobrir plural,
// gênero e flexões sem listar cada forma.
const BLOCKLIST: readonly string[] = [
  // palavrões / ofensas gerais
  "porra",
  "caralho",
  "carai",
  "merda",
  "bosta",
  "cacete",
  "puta",
  "putinha",
  "putaria",
  "vagabunda",
  "vagabundo",
  "viado",
  "viadinho",
  "bicha",
  "corno",
  "cornao",
  "otario",
  "babaca",
  "imbecil",
  "idiota",
  "escroto",
  "arrombado",
  "fdp",
  "filho da puta",
  "filho de uma puta",
  "desgracado",
  "cuzao",
  "cuzinho",
  "buceta",
  "boceta",
  "xoxota",
  "ppk",
  "piroca",
  "rola",
  "pau no cu",
  "vai tomar no cu",
  "vtnc",
  "vsf",
  "vai se fuder",
  "foder",
  "fuder",
  "fudido",
  "fodido",
  "fodase",
  "foda-se",
  "punheta",
  "punheteiro",
  "siririca",
  "gozada",
  "chupa meu",
  "chupar pau",
  "boquete",
  "meu pau",
  // conteúdo sexual explícito
  "sexo explicito",
  "pornografia",
  "pornô",
  "porno",
  "nudes",
  "nude pic",
  "putaria pesada",
  "garota de programa",
  "acompanhante de luxo",
  "michê",
  "michê",
  "prostituta",
  "prostituicao",
  "webcam adulto",
  "video porno",
  "filme porno",
  "sexo anal",
  "sexo oral",
  "transar",
  "tesao",
  "tesuda",
  "gostosa pelada",
  "pelada nua",
  "pelado nu",
  "masturba",
  // ódio / termos discriminatórios graves
  "macaco preto",
  "crioulo",
  "negrinho de senzala",
  "judeu nojento",
  "viadagem",
  "sapatao",
  "traveco",
  "retardado",
  "mongoloide",
  "aborto deve morrer",
  "nazista do bem",
  "hitler tinha razao",
  "morte aos",
  "estupro",
  "estuprar",
  "pedofilia",
  "pedofilo",
];

export type ModerationResult = {
  aprovado: boolean;
  motivo?: string;
};

/** Normaliza para comparação: minúsculas e sem acentos. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export async function moderarTexto(texto: string): Promise<ModerationResult> {
  const limpo = normalizar(texto);
  for (const termo of BLOCKLIST) {
    if (limpo.includes(normalizar(termo))) {
      return {
        aprovado: false,
        motivo: "Conteúdo inadequado detectado no texto.",
      };
    }
  }
  return { aprovado: true };
}

export async function moderarImagem(
  imageUrl: string,
): Promise<ModerationResult> {
  const apiKey =
    process.env.GOOGLE_VISION_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return { aprovado: true }; // sem chave, passa (revisar manualmente)

  try {
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { source: { imageUri: imageUrl } },
              features: [{ type: "SAFE_SEARCH_DETECTION" }],
            },
          ],
        }),
        // Não cachear: cada imagem é única.
        cache: "no-store",
      },
    );

    if (!res.ok) return { aprovado: true }; // erro de API: não bloqueia (revisar)

    const data = await res.json();
    const safe = data?.responses?.[0]?.safeSearchAnnotation;
    if (!safe) return { aprovado: true };

    // Bloqueia se LIKELY ou VERY_LIKELY para adult, violence ou racy.
    const niveis = ["LIKELY", "VERY_LIKELY"];
    if (
      niveis.includes(safe.adult) ||
      niveis.includes(safe.violence) ||
      niveis.includes(safe.racy)
    ) {
      return {
        aprovado: false,
        motivo:
          "Esta imagem não pode ser publicada pois contém conteúdo inadequado.",
      };
    }

    return { aprovado: true };
  } catch (err) {
    console.error("[QC] Falha na moderação de imagem:", err);
    return { aprovado: true }; // falha de rede: não bloqueia (revisar)
  }
}
