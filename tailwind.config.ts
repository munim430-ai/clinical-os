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
        // Premium 8k Matte Black Design System
        background: {
          DEFAULT: "#000000", // Pure Matte Black
          surface: "#121212", // Dark Grey for cards/modals
          overlay: "rgba(0,0,0,0.8)", // Glassmorphism base
        },
        accent: {
          primary: "#B8FFD2", // Luminous Mint
          primarySoft: "rgba(184,255,210,0.16)",
          primaryGlow: "rgba(184,255,210,0.34)",
          success: "#00D7B5", // Surgical Teal
          successSoft: "rgba(0,215,181,0.16)",
          critical: "#FF453A", // Emergency Red
          criticalSoft: "rgba(255,69,58,0.16)",
          warning: "#FFD60A", // Amber for alerts
          info: "#64D2FF", // Clinical Blue
        },
        surface: {
          DEFAULT: "#121212", // Dark Grey surfaces
          elevated: "#1A1A1A", // Elevated surfaces
          glass: "rgba(18,18,18,0.7)", // Glassmorphism
          glassBorder: "rgba(255,255,255,0.1)", // Glass border
        },
        border: {
          DEFAULT: "#1C1C1E", // Strict 1px border color
          soft: "rgba(255,255,255,0.05)",
          medium: "rgba(255,255,255,0.1)",
          strong: "rgba(255,255,255,0.2)",
          accent: "#B8FFD2",
          critical: "#FF453A",
        },
        text: {
          primary: "#FFFFFF", // High contrast
          secondary: "#B8B8BE", // Medium contrast
          tertiary: "#7A7A80", // Muted text
          disabled: "#4A4A4F", // Disabled state
          inverse: "#000000", // Inverse text
          accent: "#B8FFD2", // Accent text
          critical: "#FF453A", // Critical text
        },
        // Legacy color compatibility
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
