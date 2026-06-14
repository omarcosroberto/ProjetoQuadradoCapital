"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createAuthClient } from "@/lib/supabase";
import {
  sanitizeComentario,
  COMENTARIO_MAX,
} from "@/lib/sanitize";

/* Cabeça de capivara clicável (derivada de components/capivara.tsx). */
function CapivaraStar({
  ativa,
  onClick,
  onHover,
  onLeave,
  label,
}: {
  ativa: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      aria-label={label}
      className="transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110"
    >
      <svg viewBox="0 0 64 72" className="h-8 w-[28px]" role="presentation">
        {ativa ? (
          <g>
            <ellipse cx="32" cy="40" rx="24" ry="28" fill="var(--qc-verde)" />
            <circle cx="16" cy="18" r="7" fill="var(--qc-verde)" />
            <circle cx="48" cy="18" r="7" fill="var(--qc-verde)" />
            <circle cx="24" cy="35" r="4" fill="#1a1a1a" />
            <circle cx="40" cy="35" r="4" fill="#1a1a1a" />
            <ellipse cx="32" cy="48" rx="3" ry="2.5" fill="#1a1a1a" />
          </g>
        ) : (
          <g fill="none" stroke="var(--qc-linha)" strokeWidth={2}>
            <ellipse cx="32" cy="40" rx="24" ry="28" />
            <circle cx="16" cy="18" r="7" />
            <circle cx="48" cy="18" r="7" />
            <circle cx="24" cy="35" r="4" />
            <circle cx="40" cy="35" r="4" />
            <ellipse cx="32" cy="48" rx="3" ry="2.5" />
          </g>
        )}
      </svg>
    </button>
  );
}

type AvaliacaoPublica = {
  id: string;
  user_id: string;
  nota: number;
  comentario: string | null;
  fotos: string[];
  via_qr: boolean;
  created_at: string;
  apelido: string | null;
};

const MAX_FOTOS = 3;
const MAX_FOTO_BYTES = 5 * 1024 * 1024; // 5 MB

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function AvaliacaoForm({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const viaQr = searchParams.get("via_qr") === "1";

  const [user, setUser] = useState<User | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [nfNumero, setNfNumero] = useState("");
  const [nfData, setNfData] = useState("");
  const [pending, setPending] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  // Fotos: URLs públicas já aprovadas + estado de upload.
  const [fotos, setFotos] = useState<string[]>([]);
  const [uploadando, setUploadando] = useState(false);

  const [lista, setLista] = useState<AvaliacaoPublica[]>([]);

  const carregarLista = useCallback(async () => {
    const supabase = createAuthClient();
    const { data: avals } = await supabase
      .from("qc_avaliacoes")
      .select("id,user_id,nota,comentario,fotos,via_qr,created_at")
      .eq("comercio_slug", slug)
      .order("created_at", { ascending: false });

    const linhas = (avals ?? []).map((l) => ({
      ...l,
      fotos: (l.fotos ?? []) as string[],
      via_qr: l.via_qr ?? false,
    })) as Omit<AvaliacaoPublica, "apelido">[];

    // qc_avaliacoes e qc_perfis apontam ambos para auth.users (sem FK direta
    // entre si), então não dá pra usar join embedado do PostgREST. Buscamos os
    // apelidos num segundo query e juntamos no cliente.
    const ids = [...new Set(linhas.map((l) => l.user_id))];
    const apelidos = new Map<string, string>();
    if (ids.length > 0) {
      const { data: perfis } = await supabase
        .from("qc_perfis")
        .select("id,apelido")
        .in("id", ids);
      (perfis ?? []).forEach((p: { id: string; apelido: string }) =>
        apelidos.set(p.id, p.apelido),
      );
    }

    setLista(
      linhas.map((l) => ({ ...l, apelido: apelidos.get(l.user_id) ?? null })),
    );
  }, [slug]);

  useEffect(() => {
    const supabase = createAuthClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setCarregandoAuth(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Pré-preenche a avaliação do próprio usuário, se já existir.
  useEffect(() => {
    if (!user) return;
    const minha = lista.find((a) => a.user_id === user.id);
    if (minha) {
      setNota(minha.nota);
      setComentario(minha.comentario ?? "");
      setFotos(minha.fotos ?? []);
    }
  }, [user, lista]);

  useEffect(() => {
    carregarLista();
  }, [carregarLista]);

  async function adicionarFoto(file: File) {
    if (!user) return;
    setErro(null);

    if (fotos.length >= MAX_FOTOS) {
      setErro(`Você pode enviar no máximo ${MAX_FOTOS} fotos.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErro("Envie apenas arquivos de imagem.");
      return;
    }
    if (file.size > MAX_FOTO_BYTES) {
      setErro("Cada foto pode ter no máximo 5 MB.");
      return;
    }

    setUploadando(true);
    const supabase = createAuthClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    try {
      const { error: upErr } = await supabase.storage
        .from("qc-avaliacoes")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setErro("Não foi possível enviar a foto. Tente de novo.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("qc-avaliacoes").getPublicUrl(path);

      // Moderação SafeSearch antes de aceitar a URL.
      const res = await fetch("/api/moderar-imagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });
      const mod = (await res.json()) as { aprovado: boolean; motivo?: string };

      if (!mod.aprovado) {
        // Remove a foto reprovada do Storage.
        await supabase.storage.from("qc-avaliacoes").remove([path]);
        setErro(mod.motivo ?? "Esta imagem não pode ser publicada.");
        return;
      }

      setFotos((prev) => [...prev, publicUrl]);
    } catch {
      setErro("Erro ao enviar a foto. Tente de novo em instantes.");
    } finally {
      setUploadando(false);
    }
  }

  async function removerFoto(url: string) {
    setFotos((prev) => prev.filter((f) => f !== url));
    // Best-effort: apaga do Storage o objeto da própria pasta do usuário.
    try {
      const supabase = createAuthClient();
      const marker = "/qc-avaliacoes/";
      const idx = url.indexOf(marker);
      if (idx !== -1) {
        const path = url.slice(idx + marker.length);
        await supabase.storage.from("qc-avaliacoes").remove([path]);
      }
    } catch {
      /* ignore — a foto já saiu da avaliação */
    }
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvo(false);

    if (!user) return;
    if (nota < 1 || nota > 5) {
      setErro("Escolha de 1 a 5 capivaras.");
      return;
    }

    // Campos obrigatórios para avaliações via QR
    if (viaQr) {
      if (!nfNumero.trim()) {
        setErro("Informe o número da nota fiscal.");
        return;
      }
      if (!nfData) {
        setErro("Informe a data da nota fiscal.");
        return;
      }
    }

    const comentarioLimpo = sanitizeComentario(comentario);

    setPending(true);
    try {
      // Moderação do texto antes de salvar (blocklist server-side).
      if (comentarioLimpo) {
        const res = await fetch("/api/moderar-texto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto: comentarioLimpo }),
        });
        const mod = (await res.json()) as {
          aprovado: boolean;
          motivo?: string;
        };
        if (!mod.aprovado) {
          setErro(mod.motivo ?? "Conteúdo inadequado no comentário.");
          return;
        }
      }

      const supabase = createAuthClient();
      const { error } = await supabase.from("qc_avaliacoes").upsert(
        {
          user_id: user.id,
          comercio_slug: slug,
          nota,
          comentario: comentarioLimpo || null,
          fotos,
          via_qr: viaQr,
          nf_numero: viaQr ? nfNumero.trim() || null : null,
          nf_data: viaQr ? nfData || null : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,comercio_slug" },
      );
      if (error) {
        setErro("Não foi possível salvar sua avaliação. Tente de novo.");
        return;
      }
      setSalvo(true);
      await carregarLista();
    } catch {
      setErro("Erro de conexão. Tente de novo em instantes.");
    } finally {
      setPending(false);
    }
  }

  const exibidas = hover || nota;

  return (
    <div className="mt-6 rounded-2xl border border-linha bg-branco p-6 sm:p-8">
      <p className="qc-brand text-sm text-verde">Avaliações da comunidade</p>
      <h2 className="mt-1 qc-display text-xl text-concreto">
        Avalie em capivaras 🦫
      </h2>

      {/* Banner QR — aparece somente quando o usuário veio por um QR code */}
      {viaQr && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-verde/40 bg-verde/8 px-4 py-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-verde">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="19" y="14" width="2" height="2" />
            <rect x="14" y="19" width="2" height="2" />
            <rect x="19" y="19" width="2" height="2" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-verde-escuro">Avaliação verificada por QR</p>
            <p className="text-xs text-concreto-claro">Sua avaliação vale 10× mais porque veio de uma visita presencial confirmada.</p>
          </div>
        </div>
      )}

      {carregandoAuth ? (
        <p className="mt-4 text-sm text-concreto-claro">Carregando…</p>
      ) : !user ? (
        <div className="mt-4 rounded-xl border border-linha bg-ar p-5">
          <p className="text-sm text-concreto">
            Faça login para avaliar este comércio e ajudar quem busca pela sua
            quadra.
          </p>
          <Link
            href="/entrar"
            className="mt-3 inline-block rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
          >
            Faça login para avaliar
          </Link>
        </div>
      ) : (
        <form onSubmit={enviar} className="mt-4 grid gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <CapivaraStar
                key={i}
                ativa={i < exibidas}
                onClick={() => setNota(i + 1)}
                onHover={() => setHover(i + 1)}
                onLeave={() => setHover(0)}
                label={`${i + 1} capivara${i > 0 ? "s" : ""}`}
              />
            ))}
            {nota > 0 && (
              <span className="ml-2 text-sm font-semibold text-concreto">
                {nota} de 5
              </span>
            )}
          </div>

          {/* Nota fiscal — obrigatório somente para avaliações via QR */}
          {viaQr && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-concreto mb-1">
                  Número da nota fiscal <span className="text-aviso">*</span>
                </label>
                <input
                  type="text"
                  value={nfNumero}
                  onChange={(e) => setNfNumero(e.target.value)}
                  placeholder="Ex.: 000123456"
                  required
                  className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-concreto mb-1">
                  Data da nota fiscal <span className="text-aviso">*</span>
                </label>
                <input
                  type="date"
                  value={nfData}
                  onChange={(e) => setNfData(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  required
                  className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto focus:border-verde focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <textarea
              value={comentario}
              onChange={(e) =>
                setComentario(e.target.value.slice(0, COMENTARIO_MAX))
              }
              rows={3}
              maxLength={COMENTARIO_MAX}
              placeholder="Conte como foi sua experiência (opcional)"
              className="w-full resize-none rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
            />
            <p className="mt-1 text-right text-xs text-concreto-claro">
              {comentario.length}/{COMENTARIO_MAX}
            </p>
          </div>

          {/* fotos (até 3) */}
          <div>
            <p className="text-sm font-medium text-concreto">
              Fotos (opcional)
            </p>
            <p className="mt-0.5 text-xs text-concreto-claro">
              Até {MAX_FOTOS} fotos, 5 MB cada. Imagens passam por moderação.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {fotos.map((url) => (
                <div
                  key={url}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border border-linha"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Foto da avaliação"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removerFoto(url)}
                    aria-label="Remover foto"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-concreto/80 text-xs leading-none text-branco hover:bg-concreto"
                  >
                    ×
                  </button>
                </div>
              ))}

              {fotos.length < MAX_FOTOS && (
                <label
                  className={`flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-linha text-center text-xs text-concreto-claro transition-colors hover:border-verde hover:text-verde ${
                    uploadando ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  {uploadando ? (
                    <span>Enviando…</span>
                  ) : (
                    <>
                      <span className="text-lg leading-none">＋</span>
                      <span className="mt-1">Adicionar</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadando}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) adicionarFoto(file);
                      e.target.value = ""; // permite re-selecionar o mesmo arquivo
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {erro && (
            <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-medium text-aviso">
              {erro}
            </p>
          )}
          {salvo && (
            <p className="rounded-lg bg-verde/10 px-3 py-2 text-sm font-medium text-verde-escuro">
              Avaliação salva ✓ Obrigado por contribuir!
            </p>
          )}

          <button
            type="submit"
            disabled={pending || uploadando}
            className="justify-self-start rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
          >
            {pending ? "Salvando…" : "Enviar avaliação"}
          </button>
        </form>
      )}

      {/* lista pública */}
      {lista.length > 0 && (
        <div className="mt-7 border-t border-linha pt-6">
          <p className="text-sm font-semibold text-concreto">
            O que dizem ({lista.length})
          </p>
          <ul className="mt-4 grid gap-4">
            {lista.map((a) => (
              <li key={a.id} className="border-b border-linha pb-4 last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="qc-brand text-sm text-concreto">
                      {a.apelido ?? "Membro"}
                    </span>
                    {a.via_qr && (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-verde/10 px-2 py-0.5 text-[10px] font-semibold text-verde-escuro">
                        <svg viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
                          <path fillRule="evenodd" d="M8 .5L1.5 3v4.5c0 3.5 2.7 6.6 6.5 7.5 3.8-.9 6.5-4 6.5-7.5V3L8 .5zm-1.3 9.9L4.5 8.2 5.6 7l1.1 1.1 3.7-3.7 1.1 1.1-4.8 4.9z" clipRule="evenodd" />
                        </svg>
                        QR verificado
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-concreto-claro">
                    {formatarData(a.created_at)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 64 72"
                      className="h-4 w-[15px]"
                      role="presentation"
                    >
                      {i < a.nota ? (
                        <ellipse
                          cx="32"
                          cy="40"
                          rx="24"
                          ry="28"
                          fill="var(--qc-verde)"
                        />
                      ) : (
                        <ellipse
                          cx="32"
                          cy="40"
                          rx="24"
                          ry="28"
                          fill="none"
                          stroke="var(--qc-linha)"
                          strokeWidth={3}
                        />
                      )}
                    </svg>
                  ))}
                </div>
                {a.comentario && (
                  <p className="mt-2 text-sm text-concreto-claro">
                    {a.comentario}
                  </p>
                )}
                {a.fotos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {a.fotos.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-16 w-16 overflow-hidden rounded-lg border border-linha"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt="Foto da avaliação"
                          className="h-full w-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
