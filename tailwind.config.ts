import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kumarie Brand Palette — Clean Minimal White + Sage Green
        forest: {
          // Near-black: primary buttons, headings, text
          DEFAULT: "#1A1A18",
          50: "#F5F5F4",
          100: "#EAEAE9",
          200: "#D5D5D3",
          300: "#B0B0AE",
          400: "#6B6B69",
          500: "#1A1A18",
          600: "#161614",
          700: "#111110",
          800: "#0D0D0C",
          900: "#080807",
        },
        sage: {
          // Gray: body text, muted elements, placeholders
          DEFAULT: "#737370",
          50: "#F8F8F7",
          100: "#F0F0EF",
          200: "#E4E4E2",
          300: "#C8C8C6",
          400: "#A3A39F",
          500: "#737370",
          600: "#5A5A57",
          700: "#404040",
          800: "#2D2D2B",
          900: "#1A1A18",
        },
        amber: {
          // Sage green: primary accent — CTAs, links, highlights
          DEFAULT: "#3D6B5C",
          50: "#EEF4F1",
          100: "#D4E6DF",
          200: "#AACBBD",
          300: "#7FB09C",
          400: "#55957D",
          500: "#3D6B5C",
          600: "#2F5448",
          700: "#213D34",
          800: "#132720",
          900: "#06100D",
        },
        clay: {
          // Deep sage green: hover/pressed states on accent
          DEFAULT: "#2A4F44",
          50: "#EBF2EF",
          100: "#CFDFDA",
          200: "#9FBFB5",
          300: "#6F9F90",
          400: "#3F7F6B",
          500: "#2A4F44",
          600: "#213F36",
          700: "#182F28",
          800: "#0F1F1A",
          900: "#060F0D",
        },
        cream: {
          // Clean white / light gray: backgrounds, surfaces, borders
          DEFAULT: "#FAFAF9",
          50: "#FFFFFF",
          100: "#FAFAF9",
          200: "#F4F4F2",
          300: "#E8E8E6",
          400: "#D5D5D3",
          500: "#B8B8B6",
          600: "#8A8A88",
          700: "#616160",
          800: "#3D3D3C",
          900: "#1A1A18",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Jost", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
