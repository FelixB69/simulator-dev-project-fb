// components/ProcessTerminal.tsx
"use client";

import { AnimatedSpan, Terminal, TypingAnimation } from "./magicui/terminal";

export default function ProcessTerminal() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6">
      <div className="w-full max-w-2xl">
        <Terminal className="bg-black text-white font-mono border border-gray-700 p-6 rounded-lg shadow-lg">
          <TypingAnimation delay={0}>
            &gt; Lancement de l’analyse des données...
          </TypingAnimation>
          <AnimatedSpan delay={2000} className="text-green-400">
            <span>✔ Récupération des données saisies... 📥</span>
          </AnimatedSpan>
          <AnimatedSpan delay={4000} className="text-green-400">
            <span>✔ Vérification du niveau d'expérience... 🧠</span>
          </AnimatedSpan>

          <AnimatedSpan delay={6000} className="text-green-400">
            <span>✔ Analyse comparative des salaires... 📊</span>
          </AnimatedSpan>
          <AnimatedSpan delay={8000} className="text-green-400">
            <span>✔ Croisement avec notre base secrète... 🤫</span>
          </AnimatedSpan>
          <AnimatedSpan delay={10000} className="text-green-400">
            <span>✔ Calcul intensif en cours... 💻⚡</span>
          </AnimatedSpan>
          <TypingAnimation delay={12000} className="text-blue-300">
            🎉 Analyse terminée ! Résultats presque prêts...
          </TypingAnimation>
        </Terminal>
      </div>
    </div>
  );
}
