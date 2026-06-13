import type { Metadata } from "next";
import { PaginaLegal } from "@/components/pagina-legal";

export const metadata: Metadata = {
  title: "Política de Cookies — Quadrado Capital",
  description:
    "Como o Quadrado Capital usa cookies. Usamos apenas cookies essenciais ao funcionamento do site.",
};

export default function CookiesPage() {
  return (
    <PaginaLegal titulo="Política de Cookies" atualizado="Junho/2026">
      <p>
        Cookies são pequenos arquivos guardados no seu navegador. Explicamos
        abaixo como o Quadrado Capital os utiliza.
      </p>

      <h2>1. Cookies essenciais</h2>
      <p>
        Usamos apenas cookies <strong>essenciais</strong> ao funcionamento do
        site:
      </p>
      <ul>
        <li>
          <strong>Sessão de login (Supabase)</strong>: mantém você autenticado
          enquanto navega. Sem ele, não é possível avaliar comércios.
        </li>
        <li>
          <strong>Preferência de cookies</strong>: lembra que você já viu e
          aceitou este aviso.
        </li>
      </ul>

      <h2>2. O que NÃO usamos</h2>
      <p>
        Não usamos cookies de <strong>rastreamento</strong>, publicidade ou
        perfilamento de terceiros. Não compartilhamos sua navegação com redes de
        anúncios.
      </p>

      <h2>3. Como gerenciar cookies</h2>
      <p>
        Você pode bloquear ou apagar cookies nas configurações do seu navegador.
        Observe que, ao bloquear os cookies essenciais, o login e as avaliações
        deixarão de funcionar.
      </p>
      <ul>
        <li>
          <strong>Chrome</strong>: Configurações → Privacidade e segurança →
          Cookies.
        </li>
        <li>
          <strong>Firefox</strong>: Configurações → Privacidade e Segurança.
        </li>
        <li>
          <strong>Safari</strong>: Preferências → Privacidade.
        </li>
      </ul>

      <h2>4. Contato</h2>
      <p>
        Dúvidas? Escreva para{" "}
        <a href="mailto:contato@quadradocapital.com.br">
          contato@quadradocapital.com.br
        </a>
        .
      </p>
    </PaginaLegal>
  );
}
