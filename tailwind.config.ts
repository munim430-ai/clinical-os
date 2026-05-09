// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import { hairlineWidth } from "nativewind/theme";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#EEF1F8",
          surface: "#FFFFFF",
          overlay: "rgba(238,241,248,0.92)",
        },
        accent: {
          primary: "#2470FF",
          primarySoft: "#E5EDFF",
          primaryGlow: "rgba(36,112,255,0.22)",
          success: "#2BC97A",
          successSoft: "#DDF6E9",
          critical: "#FF3B30",
          criticalSoft: "#FFE3E1",
          warning: "#FFA01D",
          warningSoft: "#FFF1DC",
          info: "#2470FF",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.92)",
          elevated: "#FFFFFF",
          muted: "rgba(245,247,251,0.88)",
          glass: "rgba(255,255,255,0.72)",
          glassBorder: "rgba(255,255,255,0.78)",
        },
        border: {
          DEFAULT: "rgba(229,233,242,0.92)",
          soft: "rgba(238,241,248,0.9)",
          medium: "#E5E9F2",
          strong: "#C9D1E2",
          accent: "#2470FF",
          critical: "#FF3B30",
          red: "#FF3B30",
        },
        text: {
          primary: "#182456",
          secondary: "#4B5680",
          tertiary: "#8A91A8",
          muted: "#8A91A8",
          disabled: "#C9D1E2",
          inverse: "#FFFFFF",
          accent: "#2470FF",
          critical: "#FF3B30",
        },
        ink: {
          950: "#EEF1F8",
          900: "#F5F7FB",
          850: "#FFFFFF",
          800: "#FFFFFF",
          750: "#F5F7FB",
          700: "#EEF1F8",
          650: "#E5E9F2",
          500: "#C9D1E2",
        },
        mint: {
          DEFAULT: "#2BC97A",
          soft: "#DDF6E9",
          glow: "rgba(43,201,122,0.22)",
        },
        hero: {
          purple: "#2470FF",
          magenta: "#2BC97A",
          lime: "#FFA01D",
        },
        clinical: {
          teal: "#2BC97A",
          tealSoft: "#DDF6E9",
          red: "#FF3B30",
          redSoft: "#FFE3E1",
          amber: "#FFA01D",
          amberSoft: "#FFF1DC",
          blue: "#2470FF",
          blueSoft: "#E5EDFF",
        },
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
        heading: ["Inter_700Bold", "Inter_600SemiBold", "system-ui"],
        headingBold: ["Inter_700Bold", "Inter_600SemiBold", "system-ui"],
        headingSemi: ["Inter_600SemiBold", "system-ui"],
        body: ["Inter_400Regular", "Inter_500Medium", "system-ui"],
        bodySemi: ["Inter_600SemiBold", "Inter_500Medium", "system-ui"],
        bodyLight: ["Inter_400Regular", "system-ui"],
        mono: ["Courier New", "monospace"],
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
        touch: "48px",
        cockpit: "76px",
      },
      borderRadius: {
        clinical: "16px",
        xl2: "20px",
        pill: "999px",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      boxShadow: {
        mintGlow: "0 0 32px rgba(43,201,122,0.18)",
        limeGlow: "0 0 32px rgba(36,112,255,0.18)",
        redGlow: "0 0 32px rgba(255,59,48,0.18)",
        heroGlow: "0 8px 40px rgba(36,112,255,0.18)",
        cardShadow: "0 10px 28px rgba(24,36,86,0.08)",
        elevatedShadow: "0 18px 42px rgba(24,36,86,0.12)",
        fabShadow: "0 12px 28px rgba(36,112,255,0.35)",
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
