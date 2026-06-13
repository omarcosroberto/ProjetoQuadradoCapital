import Link from "next/link";
import { asaSigla, categoriaEmoji, isVerificado, type Business } from "@/lib/data";
import { EstadoAberto } from "./estado-aberto";
import { FolhaCapivara } from "./folha-capivara";

export function BusinessCard({ b }: { b: Business }) {
  const verificado = isVerificado(b);

  return (
    <Link
      href={`/comercio/${b.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-linha bg-branco transition-all duration-200 hover:-translate-y-1 hover:border-verde/40 hover:shadow-lg"
    >
      {/* FOTO (ou fallback de emoji sobre fundo ar) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ar">
        {b.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.fotoUrl}
            alt={b.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-full w-full items-center justify-center text-5xl opacity-50"
          >
            {categoriaEmoji(b.categoria)}
          </span>
        )}

        {/* pill aberto/fechado — canto inferior esquerdo (cliente) */}
        <EstadoAberto
          horario={b.horarioFuncionamento}
          variant="overlay"
          className="absolute bottom-2 left-2"
        />

        {/* nota — canto superior direito */}
        <span
          aria-label={`${b.capivaras.toFixed(1)} capivaras`}
          className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-branco/95 px-2 py-1 leading-none text-verde shadow-sm backdrop-blur"
        >
          <span className="qc-display text-base">
            {b.capivaras.toFixed(1).replace(".", ",")}
          </span>
          <span aria-hidden className="text-xs">
            🦫
          </span>
        </span>
      </div>

      {/* CORPO */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2">
          <h3 className="qc-display text-lg leading-tight text-concreto">
            {b.nome}
          </h3>
          <FolhaCapivara verificado={verificado} />
        </div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-verde">
          {b.categoria}
        </p>

        <p className="mt-2 text-sm text-concreto-claro">
          {b.bloco ? (
            <span className="font-semibold text-concreto">Bloco {b.bloco}</span>
          ) : (
            "Comércio local"
          )}{" "}
          · Quadra {b.quadra} {asaSigla(b.asa)}
        </p>

        {/* RODAPÉ */}
        <div className="mt-auto border-t border-linha pt-3 text-sm">
          {b.avaliacoes > 0 ? (
            <span className="text-concreto-claro">
              <strong className="text-concreto">{b.avaliacoes}</strong>{" "}
              {b.avaliacoes === 1 ? "avaliação" : "avaliações"}
            </span>
          ) : (
            <span className="font-semibold text-verde">
              Seja o primeiro a avaliar
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
