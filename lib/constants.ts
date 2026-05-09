import type { Theme } from "@react-navigation/native";

const NAV_FONT_FAMILY = "Inter_400Regular";

export const NAV_THEME = {
  light: {
    background: "#EEF1F8",
    border: "#E5E9F2",
    card: "#FFFFFF",
    notification: "#FF3B30",
    primary: "#2470FF",
    text: "#182456",
  },
  dark: {
    background: "#EEF1F8",
    border: "#E5E9F2",
    card: "#FFFFFF",
    notification: "#FF3B30",
    primary: "#2470FF",
    text: "#182456",
  },
};

export const LIGHT_THEME: Theme = {
  dark: false,
  fonts: {
    regular: { fontFamily: NAV_FONT_FAMILY, fontWeight: "400" },
    medium: { fontFamily: NAV_FONT_FAMILY, fontWeight: "500" },
    bold: { fontFamily: NAV_FONT_FAMILY, fontWeight: "700" },
    heavy: { fontFamily: NAV_FONT_FAMILY, fontWeight: "800" },
  },
  colors: NAV_THEME.light,
};

export const DARK_THEME: Theme = LIGHT_THEME;
