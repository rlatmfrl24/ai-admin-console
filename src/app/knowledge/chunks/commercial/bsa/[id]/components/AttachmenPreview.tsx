"use client";

import { Box, IconButton, InputBase, Typography } from "@mui/material";
import { Close, OpenInNew } from "@mui/icons-material";
import Image from "next/image";
import { COLORS } from "@/constants/color";

type AttachmentPreviewItemProps = {
  url: string;
  index: number;
  mode: "edit" | "read";
  description: string;
  onChangeDescription?: (value: string) => void;
  onRemove?: () => void;
};

function getMimeTypeFromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : "";
}

export function AttachmentPreviewForUI({
  url,
  index,
  onRemove,
}: AttachmentPreviewItemProps) {
  return (
    <Box
      bgcolor={"white"}
      borderRadius={2}
      border={1}
      borderColor={COLORS.blueGrey[100]}
      p={1.5}
      pt={0.5}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box display={"flex"} alignItems={"center"}>
        <Typography
          fontSize={12}
          fontWeight={500}
          color="text.primary"
          flex={1}
        >
          UI Screen
        </Typography>
        <IconButton size="small">
          <OpenInNew sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" onClick={onRemove}>
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Image
        src={url}
        alt={`attachment-preview-${index}`}
        width={0}
        height={0}
        sizes="100vw"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          borderRadius: "4px",
        }}
        objectFit="cover"
      />
    </Box>
  );
}

export function AttachmentPreviewForDocument({
  url,
  index,
  mode,
  description,
  onChangeDescription,
  onRemove,
}: AttachmentPreviewItemProps) {
  const mime = getMimeTypeFromDataUrl(url);
  const isImage = mime.startsWith("image/");
  const isPdf = mime === "application/pdf";

  return (
    <Box
      bgcolor={"white"}
      borderRadius={2}
      border={1}
      borderColor={COLORS.blueGrey[100]}
      p={1.5}
      sx={{ lineHeight: 0 }}
      position={"relative"}
      display={"flex"}
      alignItems={"center"}
      gap={1.5}
    >
      {isImage ? (
        <Image
          width={48}
          height={48}
          src={url}
          alt={`attachment-preview-${index}`}
          style={{ display: "block", borderRadius: "4px" }}
          objectFit="cover"
        />
      ) : isPdf ? (
        <Box
          width={48}
          height={48}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={1}
          bgcolor={COLORS.grey[100]}
          border={1}
          borderColor={COLORS.blueGrey[100]}
        >
          <Typography fontSize={10} fontWeight={700} color="text.primary">
            PDF
          </Typography>
        </Box>
      ) : (
        <Box
          width={48}
          height={48}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={1}
          bgcolor={COLORS.grey[100]}
          border={1}
          borderColor={COLORS.blueGrey[100]}
        >
          <Typography fontSize={10} fontWeight={700} color="text.primary">
            FILE
          </Typography>
        </Box>
      )}

      {mode === "edit" ? (
        <InputBase
          sx={{ flex: 1 }}
          multiline
          minRows={1}
          maxRows={8}
          onChange={(e) =>
            onChangeDescription?.((e.target as HTMLInputElement).value)
          }
          placeholder="Please input description"
          value={description}
        />
      ) : (
        <Typography sx={{ flex: 1, whiteSpace: "pre-line" }} fontSize={12}>
          {description}
        </Typography>
      )}

      {mode === "edit" && (
        <IconButton
          size="small"
          sx={{ alignSelf: "flex-start" }}
          onClick={onRemove}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );
}
