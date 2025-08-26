import { COLORS } from "@/constants/color";
import { Box, MenuItem } from "@mui/material";
import SelectWithLabel from "@/components/common/Select";

export default function BSA() {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        border={1}
        borderColor={COLORS.blueGrey[100]}
        borderRadius={2}
        p={1.5}
      >
        <form
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <SelectWithLabel label="Stream" size="small" sx={{ width: 160 }}>
            <MenuItem value={10}>Commercial</MenuItem>
            <MenuItem value={20}>Business</MenuItem>
            <MenuItem value={90}>Science</MenuItem>
          </SelectWithLabel>
          <SelectWithLabel
            label="Module"
            size="small"
            sx={{ width: 160 }}
            defaultValue={"All"}
          >
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </SelectWithLabel>
        </form>
      </Box>
    </Box>
  );
}
