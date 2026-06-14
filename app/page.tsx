import { SearchExperience } from "@/components/search-experience";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { getComercios } from "@/lib/comercios";

// Diretório muda raramente — ISR de 5 min mantém rápido (CDN) e fresco.
export const revalidate = 300;

export default async function Home() {
  const businesses = await getComercios();

  return (
    <div className="flex min-h-dvh flex-col">
      <SearchExperience businesses={businesses} />
      <Reveal delay={150}>
        <Footer />
      </Reveal>
    </div>
  );
}
