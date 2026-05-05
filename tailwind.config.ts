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
        // Premium Dark Design System — Music Player Aesthetic
        background: {
          DEFAULT: "#0C0C0E",
          surface: "#161618",
          overlay: "rgba(12,12,14,0.85)",
        },
        accent: {
          primary: "#C8F53C", // Vivid Lime
          primarySoft: "rgba(200,245,60,0.14)",
          primaryGlow: "rgba(200,245,60,0.28)",
          success: "#00D7B5", // Surgical Teal (preserved)
          successSoft: "rgba(0,215,181,0.16)",
          critical: "#FF453A", // Emergency Red (preserved)
          criticalSoft: "rgba(255,69,58,0.16)",
          warning: "#FFD60A", // Amber (preserved)
          info: "#64D2FF", // Clinical Blue (preserved)
        },
        surface: {
          DEFAULT: "#161618",
          elevated: "#1E1E21",
          glass: "rgba(22,22,24,0.75)",
          glassBorder: "rgba(255,255,255,0.08)",
        },
        border: {
          DEFAULT: "#1F1F23",
          soft: "rgba(255,255,255,0.06)",
          medium: "rgba(255,255,255,0.1)",
          strong: "rgba(255,255,255,0.2)",
          accent: "#C8F53C",
          critical: "#FF453A",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B8B8BE",
          tertiary: "#7A7A80",
          disabled: "#4A4A4F",
          inverse: "#0C0C0E",
          accent: "#C8F53C",
          critical: "#FF453A",
        },
        // Legacy color compatibility
        ink: {
          950: "#0C0C0E",
          900: "#0F0F11",
          850: "#131315",
          800: "#161618",
          750: "#1A1A1D",
          700: "#1E1E21",
          650: "#1F1F23",
          500: "#2C2C30",
        },
        mint: {
          DEFAULT: "#C8F53C", // Repointed to lime for backward compat
          soft: "rgba(200,245,60,0.14)",
          glow: "rgba(200,245,60,0.28)",
        },
        // Hero gradient palette
        hero: {
          purple: "#7B2FBE",
          magenta: "#E91E8C",
          lime: "#C8F53C",
        },
        clinical: {
          teal: "#00D7B5",
          tealSoft: "rgba(0,215,181,0.16)",
          red: "#FF453A",
          redSoft: "rgba(255,69,58,0.16)",
          amber: "#FFD60A",
          blue: "#64D2FF",
        },
        // Shadcn UI compatibility
        shadcn: {
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
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        },
      },
      fontFamily: {
        // Premium Medical Typography System
        heading: ["Geist-ExtraBold", "Inter_700Bold", "system-ui"],
        headingBold: ["Geist-Bold", "Inter_600SemiBold", "system-ui"],
        headingSemi: ["Geist-SemiBold", "Inter_600SemiBold", "system-ui"],
        body: ["InterVariable", "Inter_500Medium", "Inter_400Regular", "system-ui"],
        bodySemi: ["InterVariable", "Inter_600SemiBold", "system-ui"],
        bodyLight: ["InterVariable", "Inter_300Light", "Inter_400Regular", "system-ui"],
        mono: ["JetBrainsMonoVariable", "Courier New", "monospace"],
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
        mintGlow: "0 0 32px rgba(200,245,60,0.22)",
        limeGlow: "0 0 32px rgba(200,245,60,0.22)",
        redGlow: "0 0 32px rgba(255,69,58,0.28)",
        heroGlow: "0 8px 40px rgba(123,47,190,0.35)",
        cardShadow: "0 2px 12px rgba(0,0,0,0.5)",
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
