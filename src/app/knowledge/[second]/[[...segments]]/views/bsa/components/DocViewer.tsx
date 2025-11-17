'use client';

import { Box, IconButton, Typography } from '@mui/material';
import { useRef, useEffect, useCallback, useState } from 'react';
import { Close, OpenInNew } from '@mui/icons-material';

import { useBSAStore } from '@/lib/store/bsaStore';
import { COLORS } from '@/lib/theme';

const MIN_WIDTH = 514;
const MAX_WIDTH = 800;

export default function DocViewer() {
  const docViewerOpen = useBSAStore((s) => s.docViewerOpen);
  const docViewerWidth = useBSAStore((s) => s.docViewerWidth);
  const setDocViewerWidth = useBSAStore((s) => s.setDocViewerWidth);
  const setDocViewerOpen = useBSAStore((s) => s.setDocViewerOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      setDocViewerWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, setDocViewerWidth]);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: docViewerOpen ? docViewerWidth : 0,
        height: '100%',
        flexShrink: 0,
        overflow: 'hidden',
        transition: isResizing
          ? 'none'
          : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {docViewerOpen && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              ref={resizeHandleRef}
              onMouseDown={handleMouseDown}
              sx={{
                mx: 0.5,
                width: '4px',
                height: '48px',
                cursor: 'col-resize',
                backgroundColor: 'divider',
                borderRadius: '40px',
              }}
            />
          </Box>
          <Box
            aria-label="Doc Viewer"
            display={'flex'}
            overflow={'hidden'}
            flexDirection={'column'}
            width={'100%'}
            border={1}
            borderColor={COLORS.blueGrey[100]}
            borderRadius={2}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              paddingX={2}
              paddingY={1}
              borderBottom={1}
              borderColor={COLORS.blueGrey[100]}
            >
              <Typography fontSize={14} fontWeight={500}>
                Original DOC
              </Typography>
              <Box display={'flex'} alignItems={'center'} gap={0.5}>
                <IconButton size="small" onClick={() => {}}>
                  <OpenInNew sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setDocViewerOpen(false)}
                  sx={{ p: '4px' }}
                >
                  <Close sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
            <div
              aria-label="Doc Viewer Content"
              style={{ flex: 1, overflow: 'auto', backgroundColor: '#f0f2f7' }}
            ></div>
          </Box>
        </>
      )}
    </Box>
  );
}
