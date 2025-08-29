import { Box, TextField, TextFieldProps } from "@mui/material";
import { Typography } from "@mui/material";
import { SxProps } from "@mui/system";

const InputWithLabel = ({
  label,
  size = "medium",
  ...props
}: {
  label: string;
  size?: "small" | "medium";
} & TextFieldProps) => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Typography
        variant="caption"
        color={"text.primary"}
        lineHeight={size === "small" ? 1 : 1.3}
        fontWeight={size === "small" ? 400 : 500}
        m={"2px"}
      >
        {label}
      </Typography>
      <TextField
        variant="outlined"
        {...props}
        sx={{
          height: size === "small" ? 24 : 36,
          ".MuiOutlinedInput-root": {
            height: "100%",
            display: "flex",
            alignItems: "center",
            fontSize: size === "small" ? "12px" : "13px",
          },
          "& .MuiOutlinedInput-input": {
            px: size === "small" ? "8px" : "12px",
          },
          ...(props.sx as SxProps),
        }}
      />
    </Box>
  );
};

export default InputWithLabel;
