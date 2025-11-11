'use client';

import { useState } from 'react';
import { Box } from '@mui/material';

import { MainAppBar } from './MainAppBar';
import SideNavigation from './SideNavigation';
import FloatingChatButton from './FloatingChatButton';

import { useAuthStore } from '@/lib/store/authStore';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {isAuthenticated && (
        <>
          <MainAppBar onMenuClick={() => setIsDrawerOpen(true)} />
          <SideNavigation open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
        </>
      )}
      <Box flexGrow={1} overflow="hidden">
        {children}
      </Box>
      <FloatingChatButton />
    </Box>
  );
}
