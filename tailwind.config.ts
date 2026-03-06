// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],

  theme: {
    extend: {
      colors: {
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-fg))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-fg))",

        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",

        brand: {
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },

        cyan: {
          400: "hsl(var(--cyan-400))",
          500: "hsl(var(--cyan-500))",
        },
      },

      boxShadow: {
        glow: "0 0 0 1px hsl(var(--ring) / 0.35), 0 18px 60px -20px hsl(var(--ring) / 0.5)",
        soft: "0 10px 30px -18px rgba(0,0,0,0.65)",
      },

      backgroundImage: {
        "cosmic-radial":
          "radial-gradient(1200px circle at 18% 12%, hsl(var(--ring) / 0.22), transparent 45%), radial-gradient(1000px circle at 82% 36%, hsl(var(--cyan-500) / 0.14), transparent 45%)",
        "brand-gradient":
          "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--brand-500)))",
      },
    },
  },
  plugins: [],
};

export default config;