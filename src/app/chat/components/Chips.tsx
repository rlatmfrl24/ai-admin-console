import { Box } from "@mui/material";

export const AgentChip = ({
  type,
  count,
}: {
  type: "agent" | "retrieval" | "api" | "pim";
  count: number;
}) => {
  return (
    <Box>
      {type} {count}
    </Box>
  );
};
