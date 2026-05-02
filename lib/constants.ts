import type { Theme } from "@react-navigation/native";

const NAV_FONT_FAMILY = "Inter_400Regular";

export const NAV_THEME = {
  light: {
    background: "#000000",
    border: "#2A2A2A",
    card: "#1A1A1A",
    notification: "#FF4444",
    primary: "#00C896",
    text: "#F2F2F2",
  },
  dark: {
    background: "#000000",
    border: "#2A2A2A",
    card: "#1A1A1A",
    notification: "#FF4444",
    primary: "#00C896",
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
