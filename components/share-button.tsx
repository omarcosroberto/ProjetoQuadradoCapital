"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Usuário cancelou ou não suportado — cai no fallback
      }
    }
    // Fallback: copia para área de transferência
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de clipboard — ignora silenciosamente
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-lg border border-linha bg-branco px-3.5 py-2 text-sm font-semibold text-concreto transition-colors hover:border-verde hover:text-verde"
      aria-label="Compartilhar este comércio"
    >
      {/* Ícone de share SVG inline */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.474l6.733-3.367A2.52 2.52 0 0 1 13 4.5Z" />
      </svg>
      {copied ? "Link copiado!" : "Compartilhar"}
    </button>
  );
}
