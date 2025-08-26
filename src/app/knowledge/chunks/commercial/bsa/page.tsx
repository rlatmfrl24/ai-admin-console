import { COLORS } from "@/constants/color";
import { Box, Typography } from "@mui/material";

export default function BSA() {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box border={1} borderColor={COLORS.blueGrey[100]} borderRadius={2}>
        <Typography>BSA</Typography>
      </Box>
    </Box>
  );
}
