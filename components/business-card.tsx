import Link from "next/link";
import { CapivaraRating } from "./capivara";
import { asaSigla, categoriaEmoji, type Business } from "@/lib/data";

export function BusinessCard({ b }: { b: Business }) {
  return (
    <Link
      href={`/comercio/${b.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-linha bg-branco p-5 transition-all duration-200 hover:-translate-y-1 hover:border-verde/40 hover:shadow-lg"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-verde transition-transform duration-300 group-hover:scale-x-100"
      />

      {/* badge de avaliação — canto superior direito */}
      <span
        aria-label={`${b.capivaras.toFixed(1)} capivaras`}
        className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-verde/10 px-2 py-1 leading-none text-verde"
      >
        <span className="qc-display text-lg">
          {b.capivaras.toFixed(1).replace(".", ",")}
        </span>
        <span aria-hidden className="text-xs">
          🦫
        </span>
      </span>

      <div className="flex items-start gap-3 pr-12">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ar text-xl"
        >
          {categoriaEmoji(b.categoria)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="qc-display text-lg leading-tight text-concreto">
            {b.nome}
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-verde">
            {b.categoria}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-concreto-claro">
        {b.bloco ? (
          <span className="font-semibold text-concreto">Bloco {b.bloco}</span>
        ) : (
          "Comércio local"
        )}{" "}
        · Quadra {b.quadra} {asaSigla(b.asa)}
      </p>

      <div className="mt-4 border-t border-linha pt-3">
        <CapivaraRating value={b.capivaras} count={b.avaliacoes} />
      </div>
    </Link>
  );
}
