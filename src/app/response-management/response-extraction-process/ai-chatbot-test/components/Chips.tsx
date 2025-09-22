import { Box, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';

import { COLORS } from '@/lib/theme';
import RetrievalIcon from '@/assets/icon-agent-retrieval.svg';
import PimIcon from '@/assets/icon-agent-pim.svg';
import ApiIcon from '@/assets/icon-agent-api.svg';
import ChatIcon from '@/assets/icon-agent-chat.svg';
import { useChatStore } from '@/lib/store/chatStore';

function getAgentText(type: 'api' | 'pim' | 'retrieval' | 'chat') {
  return (() => {
    switch (type) {
      case 'api':
        return 'API';
      case 'pim':
        return 'PIM';
      case 'retrieval':
        return 'Retrieval';
      case 'chat':
        return 'Chat';
      default:
        return type;
    }
  })();
}

export const AgentFilterChip = ({
  type,
  count,
  checked = false,
}: {
  type: 'api' | 'pim' | 'retrieval' | 'chat';
  count: number;
  checked?: boolean;
}) => {
  const toggleSelectedSourceType = useChatStore(
    (s) => s.toggleSelectedSourceType,
  );
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      gap={'6px'}
      border={1}
      px={1.5}
      py={'6px'}
      borderRadius={5}
      borderColor={checked ? COLORS.agent[type].main : COLORS.blueGrey[200]}
      bgcolor={checked ? COLORS.agent[type].background : 'white'}
      sx={{
        cursor: 'pointer',
      }}
      onClick={() => {
        toggleSelectedSourceType(type);
      }}
    >
      {checked && <Check sx={{ fontSize: 16 }} />}
      <Typography fontSize={13} fontWeight={500} lineHeight={'18px'}>
        {getAgentText(type)}
      </Typography>
      <Typography
        fontSize={12}
        fontWeight={500}
        bgcolor={COLORS.agent[type].main}
        color={'white'}
        borderRadius={5}
        width={16}
        height={16}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        {count}
      </Typography>
    </Box>
  );
};

export const AgentChip = ({
  type,
  count,
}: {
  type: 'api' | 'pim' | 'retrieval' | 'chat';
  count: number;
}) => {
  const icon = (() => {
    switch (type) {
      case 'api':
        return <ApiIcon />;
      case 'pim':
        return <PimIcon />;
      case 'retrieval':
        return <RetrievalIcon />;
      case 'chat':
        return <ChatIcon />;
    }
  })();

  return (
    <Box
      px={1}
      py={0.5}
      bgcolor={COLORS.agent[type].background}
      color={COLORS.agent[type].main}
      borderRadius={5}
      display={'flex'}
      alignItems={'center'}
      gap={'6px'}
    >
      {icon}
      <Typography color={COLORS.text.primary} fontSize={12}>
        {getAgentText(type)}
      </Typography>
      <Box
        width={16}
        height={16}
        bgcolor={COLORS.agent[type].main}
        color={'white'}
        fontWeight={500}
        borderRadius={5}
        fontSize={12}
        lineHeight={'20px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        {count}
      </Box>
    </Box>
  );
};
