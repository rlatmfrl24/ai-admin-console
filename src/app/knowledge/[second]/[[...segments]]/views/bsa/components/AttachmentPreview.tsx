"use client";

// [인수인계 메모]
// - 역할: 첨부 이미지/문서 미리보기 및 설명 입력.
// - API 연동 시: 파일 업로드 후 받은 CDN/서버 URL을 props로 전달하여 표시.
// - 유의: Next/Image 최적화와 모달 프리로드 로직으로 초기 깜빡임 최소화.
// - 접근성: 모달 열림 시 포커스 트랩/esc 닫기, aria-labelledby 제공(이미 반영).

import { Box, IconButton, InputBase, Typography } from "@mui/material";
import { Close, OpenInNew } from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";

import { COLORS } from "@/lib/theme";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";

type AttachmentPreviewItemProps = {
  url: string;
  index: number;
  mode: "edit" | "read";
  description: string;
  onChangeDescription?: (value: string) => void;
  onRemove?: () => void;
  fileName?: string;
};

type AttachmentUIPreviewProps = Partial<AttachmentPreviewItemProps> &
  Pick<AttachmentPreviewItemProps, "url" | "index">;

// removed: getMimeTypeFromDataUrl - no longer needed after removing type branches

export function AttachmentPreviewForUI({
  url,
  index,
  onRemove,
  fileName,
}: AttachmentUIPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
        {onRemove && (
          <IconButton
            size="small"
            aria-label="Remove attachment"
            onClick={onRemove}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        )}
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
      />

      <ImagePreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        url={url}
        index={index}
        ariaLabelledbyId={`attachment-ui-screen-title-${index}`}
        fileName={fileName}
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
  fileName,
}: AttachmentPreviewItemProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

      <ImagePreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        url={url}
        index={index}
        ariaLabelledbyId={`attachment-document-title-${index}`}
        fileName={fileName}
      />
    </Box>
  );
}
