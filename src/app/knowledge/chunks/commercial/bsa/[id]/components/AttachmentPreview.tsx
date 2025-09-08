"use client";

import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Close, OpenInNew } from "@mui/icons-material";
import Image from "next/image";
import { COLORS } from "@/lib/theme";
import { useEffect, useMemo, useState } from "react";

type AttachmentPreviewItemProps = {
  url: string;
  index: number;
  mode: "edit" | "read";
  description: string;
  onChangeDescription?: (value: string) => void;
  onRemove?: () => void;
};

// removed: getMimeTypeFromDataUrl - no longer needed after removing type branches

export function AttachmentPreviewForUI({
  url,
  index,
  onRemove,
}: AttachmentPreviewItemProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);

  const { displayWidth, displayHeight } = useMemo(() => {
    if (
      typeof window === "undefined" ||
      naturalWidth == null ||
      naturalHeight == null
    ) {
      return { displayWidth: 0, displayHeight: 0 };
    }
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    const scale = Math.min(
      1,
      maxWidth / naturalWidth,
      maxHeight / naturalHeight
    );
    return {
      displayWidth: Math.round(naturalWidth * scale),
      displayHeight: Math.round(naturalHeight * scale),
    };
  }, [naturalWidth, naturalHeight]);

  useEffect(() => {
    if (
      isPreviewOpen &&
      (naturalWidth == null || naturalHeight == null) &&
      typeof window !== "undefined"
    ) {
      const preload = new window.Image();
      preload.src = url;
      preload.onload = () => {
        setNaturalWidth(preload.naturalWidth);
        setNaturalHeight(preload.naturalHeight);
      };
    }
  }, [isPreviewOpen, naturalWidth, naturalHeight, url]);
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
          id={`attachment-ui-screen-title-${index}`}
          fontSize={12}
          fontWeight={500}
          color="text.primary"
          flex={1}
        >
          UI Screen
        </Typography>
        <IconButton
          size="small"
          aria-label="Open preview"
          onClick={() => setIsPreviewOpen(true)}
        >
          <OpenInNew sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Remove attachment"
          onClick={onRemove}
        >
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
          objectFit: "cover",
        }}
        loading="lazy"
        onLoadingComplete={(img) => {
          if (naturalWidth == null || naturalHeight == null) {
            setNaturalWidth(img.naturalWidth);
            setNaturalHeight(img.naturalHeight);
          }
        }}
      />

      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        aria-labelledby={`attachment-ui-screen-title-${index}`}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <IconButton
            aria-label="Close preview"
            autoFocus
            onClick={() => setIsPreviewOpen(false)}
            sx={{ position: "absolute", top: -36, right: -36 }}
          >
            <Close />
          </IconButton>
          {displayWidth > 0 && displayHeight > 0 ? (
            <Image
              src={url}
              alt={`attachment-preview-${index}-full`}
              width={displayWidth}
              height={displayHeight}
              style={{ display: "block", borderRadius: 4 }}
              unoptimized
            />
          ) : (
            <Box
              sx={{
                width: "80vw",
                maxWidth: "80vw",
                maxHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}
        </Box>
      </Modal>
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);

  const { displayWidth, displayHeight } = useMemo(() => {
    if (
      typeof window === "undefined" ||
      naturalWidth == null ||
      naturalHeight == null
    ) {
      return { displayWidth: 0, displayHeight: 0 };
    }
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    const scale = Math.min(
      1,
      maxWidth / naturalWidth,
      maxHeight / naturalHeight
    );
    return {
      displayWidth: Math.round(naturalWidth * scale),
      displayHeight: Math.round(naturalHeight * scale),
    };
  }, [naturalWidth, naturalHeight]);

  useEffect(() => {
    if (
      isPreviewOpen &&
      (naturalWidth == null || naturalHeight == null) &&
      typeof window !== "undefined"
    ) {
      const preload = new window.Image();
      preload.src = url;
      preload.onload = () => {
        setNaturalWidth(preload.naturalWidth);
        setNaturalHeight(preload.naturalHeight);
      };
    }
  }, [isPreviewOpen, naturalWidth, naturalHeight, url]);

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
      <Image
        width={48}
        height={48}
        src={url}
        alt={`attachment-preview-${index}`}
        style={{
          display: "block",
          borderRadius: "4px",
          cursor: "zoom-in",
          objectFit: "cover",
        }}
        loading="lazy"
        onClick={() => setIsPreviewOpen(true)}
        onLoadingComplete={(img) => {
          if (naturalWidth == null || naturalHeight == null) {
            setNaturalWidth(img.naturalWidth);
            setNaturalHeight(img.naturalHeight);
          }
        }}
      />

      {mode === "edit" ? (
        <InputBase
          sx={{ flex: 1, fontSize: 13 }}
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
          aria-label="Remove attachment"
          onClick={onRemove}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      )}

      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        aria-labelledby={`attachment-document-title-${index}`}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <IconButton
            aria-label="Close preview"
            autoFocus
            onClick={() => setIsPreviewOpen(false)}
            sx={{ position: "absolute", top: -36, right: -36 }}
          >
            <Close />
          </IconButton>
          {displayWidth > 0 && displayHeight > 0 ? (
            <Image
              src={url}
              alt={`attachment-preview-${index}-full`}
              width={displayWidth}
              height={displayHeight}
              style={{ display: "block", borderRadius: 4 }}
              unoptimized
            />
          ) : (
            <Box
              sx={{
                width: "80vw",
                maxWidth: "80vw",
                maxHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
