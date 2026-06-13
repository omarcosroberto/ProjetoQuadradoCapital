import type { Metadata } from "next";
import { Poppins, Inter, Fredoka } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quadradocapital.com.br"),
  title: "Quadrado Capital — Comércios de Brasília por Quadra e Bloco",
  description:
    "Encontre lojas e serviços da Asa Sul e Asa Norte de Brasília organizados por QUADRA e BLOCO. Avaliados em capivaras 🦫.",
  alternates: { canonical: "https://quadradocapital.com.br" },
  openGraph: {
    title: "Quadrado Capital",
    description:
      "O Google te mostra um pino. O Quadrado Capital te mostra a quadra. Comércios de Brasília por quadra e bloco, avaliados em capivaras.",
    siteName: "Quadrado Capital",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${inter.variable} ${fredoka.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
