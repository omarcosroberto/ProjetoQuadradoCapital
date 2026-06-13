import type { Metadata } from "next";
import { PaginaLegal } from "@/components/pagina-legal";

export const metadata: Metadata = {
  title: "Política de Privacidade — Quadrado Capital",
  description:
    "Como o Quadrado Capital coleta, usa e protege seus dados, conforme a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <PaginaLegal titulo="Política de Privacidade" atualizado="Junho/2026">
      <p>
        Esta Política descreve como tratamos seus dados pessoais no Quadrado
        Capital, em conformidade com a Lei Geral de Proteção de Dados (LGPD —
        Lei nº 13.709/2018).
      </p>

      <h2>1. Quem somos</h2>
      <p>
        O <strong>Quadrado Capital</strong> é um diretório de comércios de
        Brasília operado pela <strong>Plano Piloto Digital</strong>, marca da{" "}
        <strong>Marcos Roberto PRO</strong>. Somos os controladores dos dados
        tratados nesta plataforma.
      </p>

      <h2>2. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>E-mail</strong>: para criação de conta, autenticação e
          recuperação de senha.
        </li>
        <li>
          <strong>Apelido</strong>: nome público exibido nas suas avaliações.
        </li>
        <li>
          <strong>Avaliações</strong>: nota em capivaras e comentários que você
          publica sobre comércios.
        </li>
        <li>
          <strong>Endereço IP e dados técnicos</strong>: coletados
          automaticamente para segurança e prevenção de abuso.
        </li>
      </ul>

      <h2>3. Finalidade do tratamento</h2>
      <ul>
        <li>Exibir avaliações públicas dos comércios listados.</li>
        <li>Autenticar membros e manter a sessão de login.</li>
        <li>Melhorar o serviço e prevenir spam e fraudes.</li>
      </ul>

      <h2>4. Compartilhamento</h2>
      <p>
        Não vendemos seus dados. Utilizamos o <strong>Supabase</strong> como
        provedor de banco de dados e autenticação. Suas avaliações e apelido são{" "}
        <strong>públicos</strong> por natureza do serviço.
      </p>

      <h2>5. Direitos do titular</h2>
      <p>Você tem direito a:</p>
      <ul>
        <li>Acessar os dados que mantemos sobre você;</li>
        <li>Corrigir dados incompletos ou desatualizados;</li>
        <li>Solicitar a exclusão da sua conta e avaliações;</li>
        <li>Revogar consentimento a qualquer momento.</li>
      </ul>

      <h2>6. Retenção</h2>
      <p>
        Mantemos seus dados enquanto sua conta estiver ativa. Ao solicitar a
        exclusão, removemos seus dados pessoais, salvo obrigação legal de
        retenção.
      </p>

      <h2>7. Contato</h2>
      <p>
        Para exercer seus direitos ou tirar dúvidas, escreva para{" "}
        <a href="mailto:contato@quadradocapital.com.br">
          contato@quadradocapital.com.br
        </a>
        .
      </p>
    </PaginaLegal>
  );
}
