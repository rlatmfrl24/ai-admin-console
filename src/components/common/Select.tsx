import { Box, MenuItem, Select, SelectProps } from "@mui/material";
import { Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { COLORS } from "@/constants/color";

const SelectWithLabel = ({
  label,
  size = "medium",
  options,
  ...props
}: {
  label: string;
  size?: "small" | "medium";
  options: { label: string; value: string }[];
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
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontSize: 13,
              lineHeight: 1.3,
              fontWeight: 400,
              p: 1,
              "&.Mui-selected": {
                backgroundColor: COLORS.text.states.selected,
              },
              "&.Mui-hover": {
                backgroundColor: COLORS.text.states.hover,
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default SelectWithLabel;
