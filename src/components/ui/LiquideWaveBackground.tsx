import { motion } from "framer-motion";

export default function LiquidWaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--blue)" />
            <stop offset="50%" stopColor="var(--pink)" />
            <stop offset="100%" stopColor="var(--orange)" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#gradient)"
          fillOpacity="0.08" // TRÈS léger ici
          d="M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z"
          animate={{
            d: [
              "M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z",
              "M0,140 C400,300 1040,20 1440,140 L1440,320 L0,320 Z",
              "M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
