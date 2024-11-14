import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Custom colors
        customGold: '#E0C28C',
        customCream: '#EFE5C8',
        customBrownLight: '#9B8967',
        customBrownDark: '#564E40',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      
    },
  },
  plugins: [],
} satisfies Config;
