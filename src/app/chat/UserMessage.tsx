import { ChatMessage } from "@/lib/types/chat";
import { Box, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import { format } from "date-fns";
import { AccessTime } from "@mui/icons-material";

export default function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <Box
      aria-label="user-message"
      width={"fit-content"}
      alignSelf={"flex-end"}
      display={"flex"}
      alignItems={"flex-end"}
      gap={1.5}
    >
      <Typography
        fontSize={12}
        fontWeight={400}
        color={COLORS.blueGrey[300]}
        display={"flex"}
        alignItems={"center"}
        gap={0.5}
        mb={0.5}
      >
        <AccessTime sx={{ fontSize: 12 }} />
        {format(message?.createdAt, "HH:mm:ss")}
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={600}
        color={COLORS.primary.main}
        border={1}
        borderColor={COLORS.primary.states.outlineBorder}
        bgcolor={COLORS.primary.states.selected}
        px={2}
        py={1.5}
        lineHeight={1.4}
        borderRadius={1.5}
      >
        {message?.message as string}
      </Typography>
    </Box>
  );
}
