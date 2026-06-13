import type { Metadata } from "next";
import { PaginaLegal } from "@/components/pagina-legal";

export const metadata: Metadata = {
  title: "Termos de Uso — Quadrado Capital",
  description:
    "Termos de Uso do Quadrado Capital, o diretório de comércios de Brasília por quadra e bloco.",
};

export default function TermosPage() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizado="Junho/2026">
      <p>
        Ao usar o Quadrado Capital, você concorda com os termos abaixo. Leia com
        atenção.
      </p>

      <h2>1. O serviço</h2>
      <p>
        O Quadrado Capital é um <strong>diretório informativo</strong> de
        comércios de Brasília, organizado por quadra e bloco. As informações são
        oferecidas como referência e podem conter imprecisões.
      </p>

      <h2>2. Avaliações</h2>
      <ul>
        <li>
          As avaliações são de <strong>responsabilidade exclusiva do autor</strong>.
        </li>
        <li>
          É <strong>proibido</strong> publicar avaliações falsas, spam, conteúdo
          ofensivo, difamatório, discriminatório ou ilegal.
        </li>
        <li>Cada membro pode avaliar cada comércio uma única vez.</li>
        <li>
          Podemos remover avaliações que violem estes termos, sem aviso prévio.
        </li>
      </ul>

      <h2>3. Conta</h2>
      <p>
        Você é responsável por manter a confidencialidade da sua senha e por
        todas as atividades realizadas na sua conta.
      </p>

      <h2>4. Suspensão</h2>
      <p>
        Podemos <strong>suspender ou encerrar</strong> contas que violem estes
        termos, pratiquem abuso ou prejudiquem outros usuários.
      </p>

      <h2>5. Remoção de dados</h2>
      <p>
        Comércios e usuários podem solicitar a remoção de seus dados a qualquer
        momento pelo e-mail{" "}
        <a href="mailto:contato@quadradocapital.com.br">
          contato@quadradocapital.com.br
        </a>
        .
      </p>

      <h2>6. Limitação de responsabilidade</h2>
      <p>
        O Quadrado Capital não se responsabiliza por negociações, produtos ou
        serviços prestados pelos comércios listados. O contato e a contratação
        ocorrem diretamente entre você e o estabelecimento.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Estes termos podem ser atualizados. Mudanças relevantes serão informadas
        nesta página.
      </p>
    </PaginaLegal>
  );
}
