import { ChatAnswer } from "@/lib/types/chat";
import { Box, Paper, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import { format } from "date-fns";
import { AccessTime } from "@mui/icons-material";

export default function ResponseMessage({ message }: { message: ChatAnswer }) {
  return (
    <Box
      aria-label="response-message"
      width={"fit-content"}
      alignSelf={"flex-start"}
      display={"flex"}
      alignItems={"flex-end"}
      gap={1.5}
    >
      <Paper
        aria-label="response-message-content"
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: COLORS.primary.main,
          px: 2,
          py: 1.5,
          lineHeight: 1.4,
          borderRadius: 1.5,
        }}
      >
        {message?.message as string}
        {message?.sources.map((source) => (
          <Typography
            key={source.sourceId}
            fontSize={12}
            fontWeight={400}
            color={COLORS.blueGrey[300]}
          >
            {source.sourceName.title}
          </Typography>
        ))}
      </Paper>
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
    </Box>
  );
}
