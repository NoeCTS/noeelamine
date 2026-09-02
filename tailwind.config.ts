import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--void)",
        "void-2": "var(--void-2)",
        ink: "var(--ink)",
        grey: "var(--grey)",
        "grey-dim": "var(--grey-dim)",
        klein: "var(--klein)",
        "klein-lift": "var(--klein-lift)",
      },
      fontFamily: {
        display: ["Silvestre", "Archivo", "sans-serif"],
        body: ["range-sans-variable", "Range Sans", "Archivo", "system-ui", "sans-serif"],
        data: ["Departure Mono", "ui-monospace", "monospace"],
        dot: ["Ndot55", "Departure Mono", "monospace"],
        gsans: ["Google Sans", "Archivo", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
