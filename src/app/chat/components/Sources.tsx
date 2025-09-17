import { COLORS } from "@/lib/theme";
import {
  PimAnswerSource,
  ChatAnswerSource,
  RetrievalAnswerSource,
  ApiAnswerSource,
} from "@/lib/types/chat";
import { ArrowDropDown, ExpandMore, LocalOffer } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import APIIcon from "@/assets/icon-agent-api.svg";
import Image from "next/image";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";
import { useChatStore } from "@/lib/store/chatStore";
import { renderHighlightedText } from "@/lib/utils/highlight";

function getRankSuffix(rank: number) {
  return rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th";
}

const RankBadge = ({ rank }: { rank: number }) => {
  return (
    <Box
      width={36}
      height={36}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={99}
      bgcolor={COLORS.primary.states.focus}
      border={1}
      borderColor={COLORS.blueGrey[100]}
      color={COLORS.primary.main}
      gap={"2px"}
    >
      <Typography fontSize={16} fontWeight={500}>
        {rank}
      </Typography>
      <Typography fontSize={12} fontWeight={500} mt={"1px"}>
        {getRankSuffix(rank)}
      </Typography>
    </Box>
  );
};

const KeywordChip = ({ keyword }: { keyword: string }) => {
  return (
    <Typography
      fontSize={12}
      px={1}
      py={0.5}
      width={"fit-content"}
      borderRadius={2}
      bgcolor={COLORS.grey[200]}
    >
      {keyword}
    </Typography>
  );
};

export const RetrievalSource = ({
  source,
}: {
  source: RetrievalAnswerSource;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isKeywordsExpanded, setIsKeywordsExpanded] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewUrl = source.previewFiles?.[0] ?? null;
  const query = useChatStore((s) => s.searchQuery);
  // 하이라이트 옵션(caseSensitive/useRegex)은 전역 스토어에서 내부적으로 읽습니다.

  return (
    <Box
      border={1}
      borderColor={COLORS.blueGrey[200]}
      borderRadius={1}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={1.5}
        px={2}
        pt={1.5}
        pb={1.5}
      >
        <RankBadge rank={source.sourceRank} />
        <Box flexGrow={1}>
          <Typography
            id={`retrieval-source-title-${source.sourceRank}`}
            fontSize={16}
            fontWeight={500}
          >
            {renderHighlightedText(source.chunkName, query)}
          </Typography>
          <Typography fontSize={14} color={COLORS.blueGrey[400]}>
            {renderHighlightedText(source.sourceName, query)}
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{ alignSelf: "flex-start" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ExpandMore
            sx={{
              fontSize: 20,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box p={2} pt={0} display={"flex"} flexDirection={"column"} gap={1.5}>
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt={source.chunkName}
                width={200}
                height={200}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "4px",
                  objectFit: "cover",
                  cursor: "zoom-in",
                }}
                onClick={() => setIsPreviewOpen(true)}
              />
              <ImagePreviewModal
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                url={previewUrl}
                index={source.sourceRank}
                ariaLabelledbyId={`retrieval-source-title-${source.sourceRank}`}
                fileName={source.chunkName}
              />
            </>
          ) : (
            <Box
              height={200}
              borderRadius={1}
              border={1}
              borderColor={COLORS.blueGrey[100]}
              bgcolor={COLORS.blueGrey[50]}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography fontSize={12} color={COLORS.blueGrey[300]}>
                No Preview
              </Typography>
            </Box>
          )}
        </Box>
        <Box p={2} pt={0} display={"flex"} flexDirection={"column"} gap={1.5}>
          <Typography
            fontSize={14}
            lineHeight={"20px"}
            letterSpacing={0.14}
            color={COLORS.blueGrey[700]}
          >
            {renderHighlightedText(source.sourceDescription, query)}
          </Typography>
          <Button size="small" variant="contained">
            EDIT CHUNK
          </Button>
        </Box>
        <Divider />
        <Box p={2} pt={1} pb={1} display={"flex"} flexDirection={"column"}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography
              fontSize={12}
              lineHeight={1}
              letterSpacing={0.14}
              color={COLORS.blueGrey[300]}
              display={"flex"}
              alignItems={"center"}
              gap={1}
              flex={1}
            >
              <LocalOffer sx={{ fontSize: 16 }} />
              Matched Keywords
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsKeywordsExpanded(!isKeywordsExpanded)}
            >
              <ExpandMore
                sx={{
                  fontSize: 20,
                  transform: isKeywordsExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={isKeywordsExpanded}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              gap={1}
              flexWrap={"wrap"}
            >
              {source.keywords.map((keyword, index) => (
                <KeywordChip key={`${keyword}-${index}`} keyword={keyword} />
              ))}
            </Box>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              sx={{ mt: 1.5, mb: 1 }}
            >
              EDIT KEYWORDS
            </Button>
          </Collapse>
        </Box>
      </Collapse>
    </Box>
  );
};

export const ApiSource = ({ source }: { source: ApiAnswerSource }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSpecificFieldsExpanded, setIsSpecificFieldsExpanded] =
    useState(true);
  const openJsonViewer = useChatStore((s) => s.openJsonViewer);
  const query = useChatStore((s) => s.searchQuery);
  // 하이라이트 옵션(caseSensitive/useRegex)은 전역 스토어에서 내부적으로 읽습니다.

  return (
    <Box
      border={1}
      borderColor={COLORS.blueGrey[200]}
      borderRadius={1}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={1.5}
        px={2}
        pt={1.5}
        pb={1.5}
      >
        <RankBadge rank={source.sourceRank} />
        <Typography fontSize={16} fontWeight={500} flex={1}>
          {renderHighlightedText(source.sourceName, query)}
        </Typography>
        <IconButton
          size="small"
          sx={{ alignSelf: "flex-start" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ExpandMore
            sx={{
              fontSize: 20,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box p={2} pt={0} display={"flex"} flexDirection={"column"} gap={1.5}>
          <Typography
            fontSize={14}
            lineHeight={"20px"}
            letterSpacing={0.14}
            color={COLORS.blueGrey[700]}
          >
            {renderHighlightedText(source.sourceDescription, query)}
          </Typography>
          <Box
            border={1}
            borderColor={COLORS.blueGrey[50]}
            borderRadius={1}
            px={1.5}
            py={1}
            display={"flex"}
            flexDirection={"column"}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
            >
              <Box
                bgcolor={COLORS.agent.api.background}
                borderRadius={99}
                p={0.5}
                width={24}
                height={24}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={1}
              >
                <APIIcon />
              </Box>
              <Typography
                fontSize={14}
                color={COLORS.text.primary}
                fontWeight={600}
                flex={1}
              >
                API Call
              </Typography>
              <IconButton
                size="small"
                onClick={() =>
                  setIsSpecificFieldsExpanded(!isSpecificFieldsExpanded)
                }
              >
                <ArrowDropDown
                  sx={{
                    fontSize: 20,
                    transform: isSpecificFieldsExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </IconButton>
            </Box>
            <Collapse in={isSpecificFieldsExpanded}>
              <Typography fontSize={14} color={COLORS.blueGrey[700]}>
                {renderHighlightedText(
                  `Method: ${source.specificFields.method}`,
                  query
                )}
              </Typography>
              <Typography fontSize={14} color={COLORS.blueGrey[700]}>
                {renderHighlightedText(
                  `Endpoint: ${source.specificFields.endpoint}`,
                  query
                )}
              </Typography>
              <Typography fontSize={14} color={COLORS.blueGrey[700]}>
                {renderHighlightedText(
                  `Status: ${source.specificFields.status}`,
                  query
                )}
              </Typography>
            </Collapse>
          </Box>
          <Box display={"flex"} flexDirection={"row"} gap={1}>
            <Button variant="contained" size="small" fullWidth>
              EDIT API
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => openJsonViewer(source.specificFields.json)}
            >
              JSON DATA
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export const PimSource = ({ source }: { source: PimAnswerSource }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const query = useChatStore((s) => s.searchQuery);
  // 하이라이트 옵션(caseSensitive/useRegex)은 전역 스토어에서 내부적으로 읽습니다.

  return (
    <Box
      border={1}
      borderColor={COLORS.blueGrey[200]}
      borderRadius={1}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={1.5}
        px={2}
        pt={1.5}
        pb={1.5}
      >
        <RankBadge rank={source.sourceRank} />
        <Typography fontSize={16} fontWeight={500} flex={1}>
          {renderHighlightedText(source.sourceName, query)}
        </Typography>
        <IconButton
          size="small"
          sx={{ alignSelf: "flex-start" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ExpandMore
            sx={{
              fontSize: 20,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box p={2} pt={0} display={"flex"} flexDirection={"column"} gap={1.5}>
          <Typography fontSize={14} color={COLORS.blueGrey[700]}>
            {renderHighlightedText(source.sourceDescription, query)}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export const ChatSource = ({ source }: { source: ChatAnswerSource }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const query = useChatStore((s) => s.searchQuery);
  // 하이라이트 옵션(caseSensitive/useRegex)은 전역 스토어에서 내부적으로 읽습니다.

  return (
    <Box
      border={1}
      borderColor={COLORS.blueGrey[200]}
      borderRadius={1}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={1.5}
        px={2}
        pt={1.5}
        pb={1.5}
      >
        <RankBadge rank={source.sourceRank} />
        <Typography fontSize={16} fontWeight={500} flex={1}>
          {renderHighlightedText(source.sourceName, query)}
        </Typography>
        <IconButton
          size="small"
          sx={{ alignSelf: "flex-start" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ExpandMore
            sx={{
              fontSize: 20,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          gap={1.5}
          px={2}
          alignItems={"center"}
        >
          <Typography
            fontSize={12}
            color={COLORS.blueGrey[300]}
            display={"flex"}
            alignItems={"center"}
            gap={0.5}
          >
            <LocalOffer sx={{ fontSize: 16 }} />
            Chat Context
          </Typography>
          {source.context.map((context, index) => (
            <KeywordChip key={`${context}-${index}`} keyword={context} />
          ))}
        </Box>
        <Box p={2} pt={1.5} display={"flex"} flexDirection={"column"} gap={1.5}>
          <Typography
            fontSize={14}
            lineHeight={"20px"}
            letterSpacing={0.14}
            color={COLORS.blueGrey[700]}
          >
            {renderHighlightedText(source.sourceDescription, query)}
          </Typography>
          <Button variant="contained" size="small" fullWidth>
            EDIT PROCESS
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};
