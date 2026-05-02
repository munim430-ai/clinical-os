import type { Theme } from "@react-navigation/native";

const NAV_FONT_FAMILY = "Inter_400Regular";

export const NAV_THEME = {
  light: {
    background: "#F5F7FA",
    border: "#E2E6EC",
    card: "#FFFFFF",
    notification: "#FF453A",
    primary: "#2E7D5A",   // darker clinical green for day contrast
    text: "#111827",
  },
  dark: {
    background: "#000000",
    border: "#1C1C1E",
    card: "#121212",
    notification: "#FF453A",
    primary: "#B8FFD2",   // premium mint from design system
    text: "#F5F5F7",
  },
};

export const LIGHT_THEME: Theme = {
  dark: false,
  fonts: {
    regular: { fontFamily: NAV_FONT_FAMILY, fontWeight: "400" },
    medium:  { fontFamily: NAV_FONT_FAMILY, fontWeight: "500" },
    bold:    { fontFamily: NAV_FONT_FAMILY, fontWeight: "700" },
    heavy:   { fontFamily: NAV_FONT_FAMILY, fontWeight: "800" },
  },
  colors: NAV_THEME.light,
};

export const DARK_THEME: Theme = {
  dark: true,
  fonts: {
    regular: { fontFamily: NAV_FONT_FAMILY, fontWeight: "400" },
    medium:  { fontFamily: NAV_FONT_FAMILY, fontWeight: "500" },
    bold:    { fontFamily: NAV_FONT_FAMILY, fontWeight: "700" },
    heavy:   { fontFamily: NAV_FONT_FAMILY, fontWeight: "800" },
  },
  colors: NAV_THEME.dark,
};
