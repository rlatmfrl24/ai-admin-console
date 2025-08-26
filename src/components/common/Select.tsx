import { Box, Select, SelectProps } from "@mui/material";
import { Typography } from "@mui/material";
import { SxProps } from "@mui/system";

const SelectWithLabel = ({
  label,
  children,
  size = "medium",
  ...props
}: {
  label: string;
  size?: "small" | "medium";
} & SelectProps) => {
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
      <Select
        {...props}
        sx={{
          height: size === "small" ? 24 : 36,
          ".MuiOutlinedInput-input": {
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: size === "small" ? "0 8px" : "0 12px",
            fontSize: size === "small" ? "12px" : "13px",
          },
          ...(props.sx as SxProps),
        }}
      >
        {children}
      </Select>
    </Box>
  );
};

export default SelectWithLabel;
