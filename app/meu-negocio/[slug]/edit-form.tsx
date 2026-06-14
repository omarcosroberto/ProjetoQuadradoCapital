"use client";

import { useActionState } from "react";
import { salvarNegocio, type EditState } from "./actions";

const DIAS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

type HorarioDia = { fechado: boolean; abre: string; fecha: string };

function parseHorario(linhas: string[] | null): HorarioDia[] {
  const dias: HorarioDia[] = DIAS.map(() => ({ fechado: true, abre: "", fecha: "" }));
  if (!linhas) return dias;
  linhas.forEach((linha) => {
    const match = linha.match(/^([^:]+):\s*(.+)$/);
    if (!match) return;
    const nomeDia = match[1].trim().toLowerCase();
    const idx = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ].findIndex((d) => d === nomeDia);
    if (idx === -1) return;
    const resto = match[2].trim();
    if (resto === "Fechado" || resto === "fechado") {
      dias[idx] = { fechado: true, abre: "", fecha: "" };
    } else {
      const horas = resto.match(/(\d{2}:\d{2})/g);
      dias[idx] = {
        fechado: false,
        abre: horas?.[0] ?? "",
        fecha: horas?.[1] ?? "",
      };
    }
  });
  return dias;
}

const initial: EditState = { ok: false };

export function EditForm({
  slug,
  descricao,
  website,
  telefone,
  whatsapp,
  instagram,
  horario,
}: {
  slug: string;
  descricao: string;
  website: string;
  telefone: string;
  whatsapp: string;
  instagram: string;
  horario: string[] | null;
}) {
  const [state, formAction, pending] = useActionState(salvarNegocio, initial);
  const horarioDias = parseHorario(horario);

  const inputCls =
    "mt-1.5 w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none";

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="slug" value={slug} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="telefone" className="text-sm font-medium text-concreto">
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            defaultValue={telefone}
            placeholder="(61) 99999-9999"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="text-sm font-medium text-concreto">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            defaultValue={whatsapp}
            placeholder="(61) 99999-9999"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="instagram" className="text-sm font-medium text-concreto">
            Instagram (usuário)
          </label>
          <div className="relative mt-1.5">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-concreto-claro text-sm">
              @
            </span>
            <input
              id="instagram"
              name="instagram"
              type="text"
              defaultValue={instagram}
              placeholder="seuperfil"
              className="w-full rounded-lg border border-linha bg-branco pl-8 pr-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="text-sm font-medium text-concreto">
            Site
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={website}
            placeholder="https://seusite.com.br"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="descricao" className="text-sm font-medium text-concreto">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={4}
          maxLength={1000}
          defaultValue={descricao}
          placeholder="Conte o que seu negócio oferece, diferenciais, horários especiais…"
          className="mt-1.5 w-full resize-none rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
        <p className="mt-1 text-xs text-concreto-claro">Até 1000 caracteres.</p>
      </div>

      {/* Horário de funcionamento */}
      <div>
        <p className="text-sm font-medium text-concreto">Horário de funcionamento</p>
        <p className="mt-0.5 text-xs text-concreto-claro">
          Deixe os campos em branco nos dias em que não abrir.
        </p>
        <div className="mt-3 overflow-hidden rounded-xl border border-linha divide-y divide-linha">
          {DIAS.map((dia, i) => (
            <HorarioDiaRow
              key={dia}
              index={i}
              dia={dia}
              initial={horarioDias[i]}
            />
          ))}
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-medium text-aviso">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-verde/10 px-3 py-2 text-sm font-medium text-verde-escuro">
          Informações salvas ✓
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}

function HorarioDiaRow({
  index,
  dia,
  initial,
}: {
  index: number;
  dia: string;
  initial: HorarioDia;
}) {
  // Usamos state local via checkbox controlado via atributo defaultChecked
  // (não precisamos de useState aqui — o form HTML nativo gerencia o estado)
  return (
    <div className="flex flex-wrap items-center gap-3 bg-branco px-4 py-3">
      <span className="w-32 text-sm font-medium text-concreto">{dia}</span>

      <label className="flex items-center gap-1.5 text-xs text-concreto-claro cursor-pointer">
        <input
          type="checkbox"
          name={`h_${index}_fechado`}
          value="1"
          defaultChecked={initial.fechado}
          className="accent-verde"
        />
        Fechado
      </label>

      <div className="flex items-center gap-2 ml-auto">
        <input
          type="time"
          name={`h_${index}_abre`}
          defaultValue={initial.abre}
          className="rounded-md border border-linha bg-ar px-2 py-1.5 text-xs text-concreto focus:border-verde focus:outline-none"
          aria-label={`${dia} abre`}
        />
        <span className="text-xs text-concreto-claro">–</span>
        <input
          type="time"
          name={`h_${index}_fecha`}
          defaultValue={initial.fecha}
          className="rounded-md border border-linha bg-ar px-2 py-1.5 text-xs text-concreto focus:border-verde focus:outline-none"
          aria-label={`${dia} fecha`}
        />
      </div>
    </div>
  );
}
