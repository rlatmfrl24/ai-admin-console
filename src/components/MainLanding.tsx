'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState, memo } from 'react';

import type { NavigationItem } from '@/lib/types/navigation';

import MainLayer1 from '@/assets/main-layer-1.svg';
import MainLayer2 from '@/assets/main-layer-2.svg';
import { MainCard } from '@/components/MainCard';

export interface MainLandingProps {
  items: NavigationItem[];
}

function MainLandingImpl({ items }: MainLandingProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!expandedId) return;
      const currentRef = cardRefs.current[expandedId];
      if (!currentRef) return;
      const target = event.target as Node;
      if (!currentRef.contains(target)) {
        setExpandedId(null);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [expandedId]);

  const handleCardClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Box
      position="relative"
      height="100%"
      sx={{
        background: 'linear-gradient(180deg, #FFF 0%, #F7F6FF 100%)',
      }}
    >
      <Box position="absolute" top={0} right={0} zIndex={1}>
        <MainLayer1 />
      </Box>
      <Box position="absolute" top={0} right={493} zIndex={1}>
        <MainLayer2 />
      </Box>
      <Typography
        fontSize={45}
        fontWeight={500}
        lineHeight={'52px'}
        position="absolute"
        top={247}
        left={40}
      >
        ALLEGRO NX System Admin
        <br /> super easy and quick for everyone.
      </Typography>

      {items?.length > 0 && (
        <Box
          zIndex={3}
          p={5}
          gap={3}
          display="flex"
          alignItems="flex-end"
          position="absolute"
          bottom={0}
          left={0}
          width="100%"
        >
          {items.map((child) => (
            <MainCard
              key={child.id}
              isExpanded={expandedId === child.id}
              onClick={() => handleCardClick(child.id)}
              data={child}
              ref={(el) => {
                cardRefs.current[child.id] = el;
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

const MainLanding = memo(MainLandingImpl);
export default MainLanding;
