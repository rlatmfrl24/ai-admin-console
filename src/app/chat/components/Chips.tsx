import { Box, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import RetrievalIcon from "@/assets/icon-agent-retrieval.svg";
import PimIcon from "@/assets/icon-agent-pim.svg";
import ApiIcon from "@/assets/icon-agent-api.svg";
import ChatIcon from "@/assets/icon-agent-chat.svg";

export const AgentChip = ({
  type,
  count,
}: {
  type: "api" | "pim" | "retrieval" | "chat";
  count: number;
}) => {
  const icon = (() => {
    switch (type) {
      case "api":
        return <ApiIcon />;
      case "pim":
        return <PimIcon />;
      case "retrieval":
        return <RetrievalIcon />;
      case "chat":
        return <ChatIcon />;
    }
  })();

  return (
    <Box
      px={1}
      py={0.5}
      bgcolor={COLORS.agent[type].background}
      color={COLORS.agent[type].main}
      borderRadius={5}
      display={"flex"}
      alignItems={"center"}
      gap={"6px"}
    >
      {icon}
      <Typography color={COLORS.text.primary} fontSize={12}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Typography>
      <Box
        width={16}
        height={16}
        bgcolor={COLORS.agent[type].main}
        color={"white"}
        fontWeight={500}
        borderRadius={5}
        fontSize={12}
        lineHeight={"20px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {count}
      </Box>
    </Box>
  );
};
