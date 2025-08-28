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
  components: {},
});

export const dataGridTheme = {
  rowHeight: 30,
  columnHeaderHeight: 32,
  sx: {
    border: 1,
    px: 1,
    py: 0.5,
    borderRadius: 2,
    borderColor: COLORS.blueGrey[100],
    "& .MuiDataGrid-columnHeader": {
      fontSize: 13,
      fontWeight: 600,
    },
    "& .MuiDataGrid-cell": {
      fontSize: 13,
    },
    "& .MuiDataGrid-row.Mui-hover": {
      backgroundColor: COLORS.text.states.hover,
    },
    "& .MuiDataGrid-row.Mui-selected": {
      backgroundColor: COLORS.blueGrey[100],
    },
  },
};

export default theme;
