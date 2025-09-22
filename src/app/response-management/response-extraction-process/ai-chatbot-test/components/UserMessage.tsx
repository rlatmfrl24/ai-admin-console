import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { AccessTime } from '@mui/icons-material';

import { ChatMessage } from '@/lib/types/chat';
import { COLORS } from '@/lib/theme';
import { useChatStore } from '@/lib/store/chatStore';
import { renderHighlightedText } from '@/lib/utils/highlight';

export default function UserMessage({ message }: { message: ChatMessage }) {
  const query = useChatStore((s) => s.searchQuery);
  // 하이라이트 옵션(caseSensitive/useRegex)은 전역 스토어에서 내부적으로 읽습니다.
  const matches = useChatStore((s) => s.searchMatches);
  const currentIndex = useChatStore((s) => s.searchCurrentMatchIndex);
  const active = matches[currentIndex];
  const activeOccurrence =
    active && active.chatId === message.chatId && active.section === 'body'
      ? active.occurrence
      : undefined;
  if (activeOccurrence != null) {
    console.debug('[Highlight] UserMessage', {
      chatId: message.chatId,
      activeOccurrence,
      matchesLen: matches.length,
      currentIndex,
    });
  }
  return (
    <Box
      aria-label="user-message"
      width={'fit-content'}
      alignSelf={'flex-end'}
      display={'flex'}
      alignItems={'flex-end'}
      gap={1.5}
    >
      <Typography
        fontSize={12}
        fontWeight={400}
        color={COLORS.blueGrey[300]}
        display={'flex'}
        alignItems={'center'}
        gap={0.5}
        mb={0.5}
      >
        <AccessTime sx={{ fontSize: 12 }} />
        {format(message?.createdAt, 'HH:mm:ss')}
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
        whiteSpace={'pre-wrap'}
      >
        {renderHighlightedText((message?.message as string) ?? '', query, {
          activeOccurrence,
        })}
      </Typography>
    </Box>
  );
}
