import { Box, IconButton, Typography } from "@mui/material";
import { Close, ContentCopy, Check } from "@mui/icons-material";
import { useMemo, useState } from "react";

import { COLORS } from "@/lib/theme";
import { useChatStore } from "@/lib/store/chatStore";


export default function JsonViewer() {
  const isOpen = useChatStore((s) => s.isJsonViewerOpen);
  const jsonData = useChatStore((s) => s.jsonViewerData);
  const close = useChatStore((s) => s.closeJsonViewer);

  const [isCopied, setIsCopied] = useState(false);

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
        position="relative"
        overflow="auto"
      >
        <IconButton
          sx={{
            position: "sticky",
            top: 0,
            left: "calc(100%)",
            border: 1,
            borderColor: COLORS.blueGrey[100],
            zIndex: 1,
          }}
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(formatted);
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 1000);
          }}
        >
          {isCopied ? (
            <Check sx={{ fontSize: 20 }} />
          ) : (
            <ContentCopy sx={{ fontSize: 20 }} />
          )}
        </IconButton>
        <pre
          style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {formatted}
        </pre>
      </Box>
    </Box>
  );
}
