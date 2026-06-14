import Link from "next/link";
import { asaSigla, categoriaEmoji, isVerificado, type Business } from "@/lib/data";
import { EstadoAberto } from "./estado-aberto";
import { FolhaCapivara } from "./folha-capivara";
import { BandeiraReivindicado } from "./bandeira-reivindicado";

export function BusinessCard({ b }: { b: Business }) {
  const verificado = isVerificado(b);

  return (
    <Link
      href={`/comercio/${b.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-linha bg-branco transition-all duration-200 hover:-translate-y-1 hover:border-verde/30 hover:shadow-lg hover:shadow-ceu/10"
    >
      {/* FOTO (ou fallback de emoji sobre fundo planalto) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-planalto">
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
        <div className="flex flex-wrap items-start gap-1.5">
          <h3 className="qc-display text-lg leading-tight text-concreto">
            {b.nome}
          </h3>
          <FolhaCapivara verificado={verificado} />
          <BandeiraReivindicado reivindicado={b.reivindicado ?? false} />
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
        <div className="mt-auto border-t border-linha pt-3 flex items-center justify-between gap-2 text-sm">
          <span>
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
          </span>

          {b.whatsapp && (
            <a
              href={`https://wa.me/55${b.whatsapp.replace(/\D/g, "")}?text=Olá,%20vi%20vocês%20no%20Quadrado%20Capital!`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`WhatsApp de ${b.nome}`}
              className="flex items-center gap-1 rounded-full bg-[#25D366]/10 px-2.5 py-1 text-xs font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}
