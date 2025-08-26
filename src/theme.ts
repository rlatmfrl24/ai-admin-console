"use client";
import { createTheme } from "@mui/material/styles";
import { COLORS } from "./constants/color";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: COLORS.primary.main,
      dark: COLORS.primary.dark,
      light: COLORS.primary.light,
      contrastText: COLORS.primary.contrastText,
    },
    error: {
      main: COLORS.error.main,
      dark: COLORS.error.dark,
      light: COLORS.error.light,
      contrastText: COLORS.error.contrastText,
    },
    warning: {
      main: COLORS.warning.main,
      dark: COLORS.warning.dark,
      light: COLORS.warning.light,
      contrastText: COLORS.warning.contrastText,
    },
    success: {
      main: COLORS.success.main,
      dark: COLORS.success.dark,
      light: COLORS.success.light,
      contrastText: COLORS.success.contrastText,
    },
    text: {
      primary: COLORS.text.primary,
      secondary: COLORS.text.secondary,
      disabled: COLORS.text.disabled,
    },
    action: {
      active: COLORS.action.active,
      hover: COLORS.action.hover,
      selected: COLORS.action.selected,
      focus: COLORS.action.focus,
      disabled: COLORS.action.disabled,
      disabledBackground: COLORS.action.disabledBackground,
    },
    background: {
      default: COLORS.background.default,
      paper: COLORS.background.paper,
    },
    grey: COLORS.grey,
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
