import { forwardRef } from 'react';
import { Box, TextField, TextFieldProps } from '@mui/material';
import { Typography } from '@mui/material';
import { SxProps } from '@mui/system';

import type { Theme } from '@mui/material/styles';

import { COLORS } from '@/lib/theme';

export type InputWithLabelProps = Omit<
  TextFieldProps,
  'size' | 'label' | 'sx'
> & {
  label?: string;
  size?: 'small' | 'medium';
  noLabel?: boolean;
  sx?: SxProps<Theme>;
};

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  function InputWithLabel(
    { label, size = 'medium', noLabel, sx, ...props },
    ref,
  ) {
    return (
      <Box display={'flex'} flexDirection={'column'}>
        {!noLabel && (
          <Typography
            variant="caption"
            color={'text.primary'}
            lineHeight={size === 'small' ? 1 : 1.3}
            fontWeight={size === 'small' ? 400 : 500}
            m={'2px'}
          >
            {label}
          </Typography>
        )}
        <TextField
          variant="outlined"
          inputRef={ref}
          {...props}
          sx={[
            {
              height: size === 'small' ? 24 : 36,
              '& .MuiOutlinedInput-root': {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontSize: size === 'small' ? '12px' : '13px',
                backgroundColor: props.disabled ? COLORS.grey[100] : 'white',
              },
              '& .MuiOutlinedInput-input': {
                padding: '0px 12px',
              },
              '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        />
      </Box>
    );
  },
);

export default InputWithLabel;
