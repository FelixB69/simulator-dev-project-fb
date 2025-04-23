"use client";

import { useEffect } from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "./magicui/terminal";

export default function ProcessTerminal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 12000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6">
      {/* <div className="w-full"> */}
      <Terminal className="bg-black text-[var(--white)] font-mono border border-[var(--gray)] p-6 rounded-[var(--radius)] shadow-lg">
        <TypingAnimation delay={0}>
          &gt; Lancement de l’analyse des données...
        </TypingAnimation>

        <AnimatedSpan delay={3000} className="text-[var(--green)]">
          <span>✔ Récupération des données saisies... 📥</span>
        </AnimatedSpan>

        <AnimatedSpan delay={4000} className="text-[var(--green)]">
          <span>✔ Vérification du niveau d'expérience... 🧠</span>
        </AnimatedSpan>

        <AnimatedSpan delay={5000} className="text-[var(--green)]">
          <span>✔ Analyse comparative des salaires... 📊</span>
        </AnimatedSpan>

        <AnimatedSpan delay={6000} className="text-[var(--green)]">
          <span>✔ Croisement avec notre base secrète... 🤫</span>
        </AnimatedSpan>

        <AnimatedSpan delay={7000} className="text-[var(--green)]">
          <span>✔ Calcul intensif en cours... 💻⚡</span>
        </AnimatedSpan>

        <TypingAnimation delay={8000} className="text-[var(--pink)]">
          🎉 Analyse terminée ! Résultats presque prêts...
        </TypingAnimation>
      </Terminal>
      {/* </div> */}
    </div>
  );
}
