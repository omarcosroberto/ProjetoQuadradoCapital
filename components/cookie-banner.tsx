"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_NAME = "qc_cookies_ok";

function temConsentimento(): boolean {
  if (typeof document === "undefined") return true;
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${COOKIE_NAME}=1`));
}

export function CookieBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    // Só mostra se ainda não houver consentimento (evita flash no SSR).
    if (!temConsentimento()) setVisivel(true);
  }, []);

  function aceitar() {
    const umAno = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${umAno}; samesite=lax`;
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-3 rounded-xl border border-linha bg-branco p-4 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-concreto-claro">
          Usamos cookies essenciais para o funcionamento do site.{" "}
          <Link
            href="/cookies"
            className="font-semibold text-verde underline hover:text-verde-escuro"
          >
            Saiba mais
          </Link>
        </p>
        <button
          type="button"
          onClick={aceitar}
          className="shrink-0 rounded-lg bg-verde px-5 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
