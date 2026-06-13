import { NextRequest, NextResponse } from "next/server";
import { moderarTexto } from "@/lib/moderation";

export async function POST(req: NextRequest) {
  let texto: unknown;
  try {
    ({ texto } = await req.json());
  } catch {
    return NextResponse.json(
      { aprovado: false, motivo: "Requisição inválida." },
      { status: 400 },
    );
  }

  if (typeof texto !== "string") {
    return NextResponse.json(
      { aprovado: false, motivo: "Texto inválido." },
      { status: 400 },
    );
  }

  // Texto vazio é sempre aprovado (comentário/foto são opcionais).
  if (texto.trim() === "") return NextResponse.json({ aprovado: true });

  const result = await moderarTexto(texto);
  return NextResponse.json(result);
}
