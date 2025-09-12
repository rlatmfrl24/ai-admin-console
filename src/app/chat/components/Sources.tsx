import { COLORS } from "@/lib/theme";
import {
  PimAnswerSource,
  ChatAnswerSource,
  RetrievalAnswerSource,
  ApiAnswerSource,
} from "@/lib/types/chat";
import { ExpandMore, LocalOffer } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isKeywordsExpanded, setIsKeywordsExpanded] = useState(false);

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
        pb={2}
      >
        <RankBadge rank={source.sourceRank} />
        <Box flexGrow={1}>
          <Typography fontSize={16} fontWeight={500}>
            {source.chunkName}
          </Typography>
          <Typography fontSize={14} color={COLORS.blueGrey[400]}>
            {source.sourceName}
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
          <Typography
            fontSize={14}
            lineHeight={"20px"}
            letterSpacing={0.14}
            color={COLORS.blueGrey[700]}
          >
            {source.sourceDescription}
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
              {source.keywords.map((keyword) => (
                <KeywordChip key={keyword} keyword={keyword} />
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
  return (
    <Box>
      <Typography>
        {source.sourceName + " " + source.sourceRank + " " + source.sourceType}
      </Typography>
    </Box>
  );
};

export const PimSource = ({ source }: { source: PimAnswerSource }) => {
  return (
    <Box>
      <Typography>
        {source.sourceName + " " + source.sourceRank + " " + source.sourceType}
      </Typography>
    </Box>
  );
};

export const ChatSource = ({ source }: { source: ChatAnswerSource }) => {
  return (
    <Box>
      <Typography>
        {source.sourceName + " " + source.sourceRank + " " + source.sourceType}
      </Typography>
    </Box>
  );
};
