import type { Business } from "./data";

/**
 * Seed v1 — usado APENAS como fallback se o Supabase estiver indisponível,
 * para o site nunca abrir em branco. A fonte da verdade é a tabela
 * public.comercios (ver lib/comercios.ts). Mantenha em sincronia com a
 * migration 20260612000000_comercios.sql.
 */
export const SEED_BUSINESSES: Business[] = [
  { id: "409s-a", nome: "Padaria Pão & Companhia", categoria: "Padaria", asa: "Sul", quadra: 409, bloco: "A", capivaras: 4.6, avaliacoes: 132 },
  { id: "409s-b", nome: "Academia Corpo em Forma", categoria: "Academia", asa: "Sul", quadra: 409, bloco: "B", capivaras: 4.2, avaliacoes: 88 },
  { id: "409s-c", nome: "Farmácia Vida", categoria: "Farmácia", asa: "Sul", quadra: 409, bloco: "C", capivaras: 4.0, avaliacoes: 54 },
  { id: "409s-d", nome: "Cafeteria Grão Especial", categoria: "Cafeteria", asa: "Sul", quadra: 409, bloco: "D", capivaras: 4.8, avaliacoes: 210 },
  { id: "409s-e", nome: "Pet Shop Mundo Animal", categoria: "Pet Shop", asa: "Sul", quadra: 409, bloco: "E", capivaras: 4.4, avaliacoes: 67 },
  { id: "409s-f", nome: "Barbearia do Téo", categoria: "Barbearia", asa: "Sul", quadra: 409, bloco: "F", capivaras: 4.9, avaliacoes: 156 },
  { id: "410s-a", nome: "Restaurante Sabor da Asa", categoria: "Restaurante", asa: "Sul", quadra: 410, bloco: "A", capivaras: 4.5, avaliacoes: 174 },
  { id: "410s-b", nome: "Mercadinho 410", categoria: "Mercado", asa: "Sul", quadra: 410, bloco: "B", capivaras: 3.9, avaliacoes: 41 },
  { id: "410s-c", nome: "Salão Beleza Pura", categoria: "Salão de Beleza", asa: "Sul", quadra: 410, bloco: "C", capivaras: 4.3, avaliacoes: 73 },
  { id: "410s-d", nome: "Sorveteria Geladão", categoria: "Sorveteria", asa: "Sul", quadra: 410, bloco: "D", capivaras: 4.7, avaliacoes: 121 },
  { id: "411s-a", nome: "Pizzaria Forno a Lenha", categoria: "Pizzaria", asa: "Sul", quadra: 411, bloco: "A", capivaras: 4.6, avaliacoes: 198 },
  { id: "411s-b", nome: "Bar do Zé", categoria: "Bar", asa: "Sul", quadra: 411, bloco: "B", capivaras: 4.1, avaliacoes: 64 },
  { id: "411s-c", nome: "Lanchonete Pão Quente", categoria: "Lanchonete", asa: "Sul", quadra: 411, bloco: "C", capivaras: 4.0, avaliacoes: 39 },
  { id: "513s-a", nome: "Academia Bluefit", categoria: "Academia", asa: "Sul", quadra: 513, bloco: "A", capivaras: 4.4, avaliacoes: 245 },
  { id: "513s-b", nome: "Açaí da 513", categoria: "Sorveteria", asa: "Sul", quadra: 513, bloco: "B", capivaras: 4.8, avaliacoes: 187 },
  { id: "513s-c", nome: "Farmácia Saúde Total", categoria: "Farmácia", asa: "Sul", quadra: 513, bloco: "C", capivaras: 4.2, avaliacoes: 58 },
  { id: "513s-d", nome: "Restaurante Tempero Mineiro", categoria: "Restaurante", asa: "Sul", quadra: 513, bloco: "D", capivaras: 4.7, avaliacoes: 163 },
  { id: "408n-a", nome: "Café com Letras", categoria: "Cafeteria", asa: "Norte", quadra: 408, bloco: "A", capivaras: 4.9, avaliacoes: 142 },
  { id: "408n-b", nome: "Padaria Trigo Dourado", categoria: "Padaria", asa: "Norte", quadra: 408, bloco: "B", capivaras: 4.3, avaliacoes: 76 },
  { id: "408n-c", nome: "Academia FitNorte", categoria: "Academia", asa: "Norte", quadra: 408, bloco: "C", capivaras: 4.1, avaliacoes: 53 },
  { id: "408n-d", nome: "Pet Shop Patas & Cia", categoria: "Pet Shop", asa: "Norte", quadra: 408, bloco: "D", capivaras: 4.5, avaliacoes: 61 },
  { id: "410n-a", nome: "Restaurante Cantinho Norte", categoria: "Restaurante", asa: "Norte", quadra: 410, bloco: "A", capivaras: 4.4, avaliacoes: 98 },
  { id: "410n-b", nome: "Barbearia Navalha", categoria: "Barbearia", asa: "Norte", quadra: 410, bloco: "B", capivaras: 4.6, avaliacoes: 84 },
  { id: "410n-c", nome: "Mercado Norte", categoria: "Mercado", asa: "Norte", quadra: 410, bloco: "C", capivaras: 4.0, avaliacoes: 47 },
];
