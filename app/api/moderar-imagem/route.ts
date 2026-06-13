import { NextRequest, NextResponse } from "next/server";
import { moderarImagem } from "@/lib/moderation";

export async function POST(req: NextRequest) {
  let imageUrl: unknown;
  try {
    ({ imageUrl } = await req.json());
  } catch {
    return NextResponse.json(
      { aprovado: false, motivo: "Requisição inválida." },
      { status: 400 },
    );
  }

  if (typeof imageUrl !== "string" || !imageUrl) {
    return NextResponse.json(
      { aprovado: false, motivo: "URL inválida." },
      { status: 400 },
    );
  }

  const result = await moderarImagem(imageUrl);
  return NextResponse.json(result);
}
