'use client';

import { Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

import { AgentFilterChip } from './components/Chips';
import {
  ApiSource,
  PimSource,
  RetrievalSource,
  ChatSource,
} from './components/Sources';

import { COLORS } from '@/lib/theme';
import { useChatStore } from '@/lib/store/chatStore';
import {
  AnswerSource,
  ChatAnswerSource,
  PimAnswerSource,
  RetrievalAnswerSource,
  ApiAnswerSource,
} from '@/lib/types/chat';

export default function Source() {
  const setSelectedAnswer = useChatStore((s) => s.setSelectedAnswer);
  const selectedAnswer = useChatStore((s) => s.selectedAnswer);
  const selectedSourceTypes = useChatStore((s) => s.selectedSourceTypes);
  const setSelectedSourceTypes = useChatStore((s) => s.setSelectedSourceTypes);

  const AgentChips = (() => {
    const map = new Map<string, number>();
    for (const s of selectedAnswer?.sources ?? []) {
      const existing = map.get(s.sourceType);
      map.set(s.sourceType, (existing ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([type, count]) => ({
      type,
      count,
    }));
  })();

  return (
    <Box
      bgcolor={'white'}
      borderLeft={1}
      borderColor={COLORS.blueGrey[100]}
      minWidth={488 + 16 + 16}
      maxWidth={488 + 16 + 16}
      px={2}
      display={'flex'}
      flexDirection={'column'}
      overflow={'auto'}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        mt={1.5}
      >
        <Typography fontSize={20} fontWeight={500}>
          Source
        </Typography>
        <IconButton
          size="small"
          onClick={() => {
            setSelectedSourceTypes([]);
            setSelectedAnswer(null);
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
      <Box display={'flex'} alignItems={'center'} gap={0.5} mt={1.5}>
        {AgentChips.map((chip) => (
          <AgentFilterChip
            key={chip.type}
            type={chip.type as 'api' | 'pim' | 'retrieval' | 'chat'}
            count={chip.count}
            checked={selectedSourceTypes.includes(
              chip.type as AnswerSource['sourceType'],
            )}
          />
        ))}
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={1} my={2}>
        {selectedAnswer?.sources
          .slice()
          .sort((a, b) => a.sourceRank - b.sourceRank)
          .filter((source) => selectedSourceTypes.includes(source.sourceType))
          .map((source) =>
            source.sourceType === 'retrieval' ? (
              <RetrievalSource
                key={source.sourceId}
                source={source as RetrievalAnswerSource}
              />
            ) : source.sourceType === 'api' ? (
              <ApiSource
                key={source.sourceId}
                source={source as ApiAnswerSource}
              />
            ) : source.sourceType === 'pim' ? (
              <PimSource
                key={source.sourceId}
                source={source as PimAnswerSource}
              />
            ) : source.sourceType === 'chat' ? (
              <ChatSource
                key={source.sourceId}
                source={source as ChatAnswerSource}
              />
            ) : null,
          )}
      </Box>
    </Box>
  );
}
