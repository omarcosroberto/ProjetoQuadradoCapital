"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  /** atraso da animação em ms (para escalonar itens em sequência) */
  delay?: number;
  /** deslocamento vertical inicial em px (default 18) */
  y?: number;
  className?: string;
};

/**
 * Revela o conteúdo ao entrar na viewport (fade + sobe).
 * — SSR-safe: o estado escondido só vale quando há JS (gate `.js` no CSS),
 *   então sem JavaScript o conteúdo aparece normalmente (SEO/acessibilidade).
 * — Respeita `prefers-reduced-motion`: mostra na hora, sem movimento.
 */
export function Reveal({ children, delay = 0, y = 18, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-shown={shown}
      className={className}
      style={
        { "--reveal-delay": `${delay}ms`, "--reveal-y": `${y}px` } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
