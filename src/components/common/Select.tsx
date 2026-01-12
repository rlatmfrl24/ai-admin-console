import { forwardRef } from 'react';
import { Box, MenuItem, Select, SelectProps } from '@mui/material';
import { Typography } from '@mui/material';
import { SxProps } from '@mui/system';

import type { Theme } from '@mui/material/styles';

import { COLORS } from '@/lib/theme';

export interface SelectWithLabelOption {
  label: string;
  value: string;
}
export interface SelectWithLabelProps
  extends Omit<SelectProps, 'size' | 'label' | 'sx'> {
  label: string;
  size?: 'small' | 'medium';
  options: SelectWithLabelOption[];
  sx?: SxProps<Theme>;
}

const SelectWithLabel = forwardRef<HTMLDivElement, SelectWithLabelProps>(
  function SelectWithLabel(
    { label, size = 'medium', options, sx, ...props },
    ref,
  ) {
    return (
      <Box display={'flex'} flexDirection={'column'}>
        <Typography
          id={props.id ? `${props.id}-label` : undefined}
          variant="caption"
          color={'text.primary'}
          lineHeight={size === 'small' ? 1 : 1.3}
          fontWeight={size === 'small' ? 400 : 500}
          m={'2px'}
        >
          {label}
        </Typography>
        <Select
          {...props}
          ref={ref}
          labelId={props.id ? `${props.id}-label` : undefined}
          aria-labelledby={props.id ? `${props.id}-label` : undefined}
          sx={[
            {
              height: size === 'small' ? 24 : 36,
              '.MuiOutlinedInput-input': {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: size === 'small' ? '0 8px' : '0 12px',
                fontSize: size === 'small' ? '12px' : '13px',
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontSize: 13,
                lineHeight: 1.3,
                fontWeight: 400,
                p: 1,
                '&.Mui-selected': {
                  backgroundColor: COLORS.text.states.selected,
                },
                '&:hover': {
                  backgroundColor: COLORS.text.states.hover,
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  },
);

export default SelectWithLabel;
