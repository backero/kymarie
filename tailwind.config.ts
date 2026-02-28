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
        // Kumarie Brand Palette — Black & Gold (from logo)
        forest: {
          // Near-black: primary buttons, text, dark backgrounds
          DEFAULT: "#111111",
          50: "#F7F7F7",
          100: "#EEEEEE",
          200: "#D9D9D9",
          300: "#BFBFBF",
          400: "#8A8A8A",
          500: "#111111",
          600: "#0D0D0D",
          700: "#080808",
          800: "#050505",
          900: "#020202",
        },
        sage: {
          // Charcoal: secondary text, muted elements
          DEFAULT: "#4A4A4A",
          50: "#F5F5F5",
          100: "#EBEBEB",
          200: "#D6D6D6",
          300: "#ADADAD",
          400: "#828282",
          500: "#4A4A4A",
          600: "#383838",
          700: "#282828",
          800: "#1A1A1A",
          900: "#0D0D0D",
        },
        amber: {
          // Bright gold: accent highlights, cart badge, hover states
          DEFAULT: "#C8A020",
          50: "#FBF6DC",
          100: "#F5E8A0",
          200: "#EDD460",
          300: "#E5BE28",
          400: "#D4A818",
          500: "#C8A020",
          600: "#A07F18",
          700: "#785E10",
          800: "#503D08",
          900: "#281E04",
        },
        clay: {
          // Muted brass gold: secondary accents
          DEFAULT: "#B49028",
          50: "#FBF6E8",
          100: "#F5E6BE",
          200: "#EBCC80",
          300: "#E0B448",
          400: "#D4A228",
          500: "#B49028",
          600: "#907018",
          700: "#685010",
          800: "#443408",
          900: "#201904",
        },
        cream: {
          // Ivory: backgrounds, text on dark surfaces
          DEFAULT: "#FFFDF7",
          50: "#FFFFFF",
          100: "#FFFDF7",
          200: "#FFF8EF",
          300: "#FFEFD6",
          400: "#FFE2B2",
          500: "#F5CC70",
          600: "#D4A818",
          700: "#A07818",
          800: "#6A4E10",
          900: "#342808",
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
