"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAuthClient } from "@/lib/supabase";

export function SairButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function sair() {
    setPending(true);
    try {
      await createAuthClient().auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={sair}
      disabled={pending}
      className="rounded-lg border border-linha bg-branco px-4 py-2 text-sm font-semibold text-concreto transition-colors hover:border-aviso hover:text-aviso disabled:opacity-60"
    >
      {pending ? "Saindo…" : "Sair"}
    </button>
  );
}
