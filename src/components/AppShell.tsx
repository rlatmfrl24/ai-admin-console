"use client";

import { useState } from "react";
import { Box } from "@mui/material";

import { MainAppBar } from "./MainAppBar";
import SideNavigation from "./SideNavigation";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <MainAppBar onMenuClick={() => setIsDrawerOpen(true)} />
      <SideNavigation open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Box flexGrow={1} overflow="hidden">
        {children}
      </Box>
    </Box>
  );
}
