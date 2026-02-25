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
        // Kumarie Brand Palette
        forest: {
          DEFAULT: "#2D4A1E",
          50: "#EEF3EB",
          100: "#D5E4CE",
          200: "#A9C99B",
          300: "#7DAE68",
          400: "#4E8835",
          500: "#2D4A1E",
          600: "#243C18",
          700: "#1B2D12",
          800: "#121F0C",
          900: "#091006",
        },
        sage: {
          DEFAULT: "#6B7A5A",
          50: "#F2F4EF",
          100: "#E0E5D9",
          200: "#BFCCB2",
          300: "#9EB28B",
          400: "#7D9864",
          500: "#6B7A5A",
          600: "#566248",
          700: "#404936",
          800: "#2B3124",
          900: "#151812",
        },
        amber: {
          DEFAULT: "#B5863A",
          50: "#FBF5E9",
          100: "#F5E6C9",
          200: "#EBCC93",
          300: "#E1B35D",
          400: "#D49927",
          500: "#B5863A",
          600: "#916B2E",
          700: "#6D5023",
          800: "#493617",
          900: "#241B0C",
        },
        clay: {
          DEFAULT: "#C4956A",
          50: "#FBF5EF",
          100: "#F6E7D7",
          200: "#EDCEAF",
          300: "#E4B587",
          400: "#DB9C5F",
          500: "#C4956A",
          600: "#9D7755",
          700: "#765940",
          800: "#4E3B2A",
          900: "#271E15",
        },
        cream: {
          DEFAULT: "#FAF8F3",
          50: "#FFFFFF",
          100: "#FAF8F3",
          200: "#F0EBE0",
          300: "#E6DFCF",
          400: "#DCD3BE",
          500: "#D2C7AD",
          600: "#C8BB9C",
          700: "#BEAF8B",
          800: "#B4A37A",
          900: "#AA9769",
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
        display: ["Cormorant Garamond", "Georgia", "serif"],
        heading: ["Playfair Display", "Georgia", "serif"],
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
      backgroundImage: {
        "grain-texture":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
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
