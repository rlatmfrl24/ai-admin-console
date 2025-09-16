import { Box, IconButton, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme";
import { Close } from "@mui/icons-material";
import { useChatStore } from "@/lib/store/chatStore";
import { useMemo } from "react";

export default function JsonViewer() {
  const isOpen = useChatStore((s) => s.isJsonViewerOpen);
  const jsonData = useChatStore((s) => s.jsonViewerData);
  const close = useChatStore((s) => s.closeJsonViewer);

  const formatted = useMemo(() => {
    if (!jsonData) return "";
    try {
      const obj = JSON.parse(jsonData);
      return JSON.stringify(obj, null, 2);
    } catch {
      return jsonData;
    }
  }, [jsonData]);

  if (!isOpen) return null;

  return (
    <Box
      width={"520px"}
      bgcolor={"white"}
      borderLeft={1}
      borderColor={COLORS.blueGrey[100]}
      px={2}
      py={1.5}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography fontSize={20} fontWeight={500} lineHeight={1.6}>
          JSON Data
        </Typography>
        <IconButton size="small" onClick={close}>
          <Close />
        </IconButton>
      </Box>
      <Box
        border={1}
        borderColor={COLORS.blueGrey[100]}
        borderRadius={1}
        p={1.5}
        flex={1}
        mt={1.5}
        bgcolor={COLORS.grey[100]}
        sx={{ overflow: "auto" }}
      >
        <pre
          style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {formatted}
        </pre>
      </Box>
    </Box>
  );
}
