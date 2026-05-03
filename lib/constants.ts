import type { Theme } from "@react-navigation/native";

const NAV_FONT_FAMILY = "Inter_400Regular";

export const NAV_THEME = {
  light: {
    background: "#0C0C0E",
    border: "#1F1F23",
    card: "#1E1E21",
    notification: "#FF453A",
    primary: "#C8F53C",
    text: "#F2F2F2",
  },
  dark: {
    background: "#0C0C0E",
    border: "#1F1F23",
    card: "#1E1E21",
    notification: "#FF453A",
    primary: "#C8F53C",
    text: "#F2F2F2",
  },
};

export const LIGHT_THEME: Theme = {
  dark: true,
  fonts: {
    regular: { fontFamily: NAV_FONT_FAMILY, fontWeight: "400" },
    medium: { fontFamily: NAV_FONT_FAMILY, fontWeight: "500" },
    bold: { fontFamily: NAV_FONT_FAMILY, fontWeight: "700" },
    heavy: { fontFamily: NAV_FONT_FAMILY, fontWeight: "800" },
  },
  colors: NAV_THEME.dark,
};

export const DARK_THEME: Theme = {
  dark: true,
  fonts: {
    regular: { fontFamily: NAV_FONT_FAMILY, fontWeight: "400" },
    medium: { fontFamily: NAV_FONT_FAMILY, fontWeight: "500" },
    bold: { fontFamily: NAV_FONT_FAMILY, fontWeight: "700" },
    heavy: { fontFamily: NAV_FONT_FAMILY, fontWeight: "800" },
  },
  colors: NAV_THEME.dark,
};
