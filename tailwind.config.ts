// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import { hairlineWidth } from "nativewind/theme";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#000000",
          900: "#080808",
          850: "#0B0B0C",
          800: "#121212",
          750: "#161616",
          700: "#1A1A1A",
          650: "#1C1C1E",
          500: "#2A2A2D",
        },
        mint: {
          DEFAULT: "#B8FFD2",
          soft: "rgba(184,255,210,0.16)",
          glow: "rgba(184,255,210,0.34)",
        },
        clinical: {
          teal: "#00D7B5",
          tealSoft: "rgba(0,215,181,0.16)",
          red: "#FF453A",
          redSoft: "rgba(255,69,58,0.16)",
          amber: "#FFD60A",
          blue: "#64D2FF",
        },
        text: {
          primary: "#F5F5F7",
          secondary: "#B8B8BE",
          muted: "#7A7A80",
          disabled: "#4A4A4F",
          inverse: "#050505",
        },
        border: {
          DEFAULT: "#1C1C1E",
          soft: "rgba(255,255,255,0.07)",
          strong: "rgba(255,255,255,0.14)",
          mint: "rgba(184,255,210,0.38)",
          red: "rgba(255,69,58,0.48)",
        },
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
        heading: ["Geist-ExtraBold", "Inter_600SemiBold"],
        headingBold: ["Geist-Bold", "Inter_600SemiBold"],
        body: ["Inter_500Medium", "Inter_400Regular"],
        bodySemi: ["Inter_600SemiBold"],
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
        touch: "48px",
        cockpit: "76px",
      },
      borderRadius: {
        clinical: "24px",
        xl2: "28px",
        pill: "999px",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      boxShadow: {
        mintGlow: "0 0 32px rgba(184,255,210,0.22)",
        redGlow: "0 0 32px rgba(255,69,58,0.28)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies import("tailwindcss").Config;
