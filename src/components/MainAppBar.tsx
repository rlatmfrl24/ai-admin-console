"use client";

import {
  AppBar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { Menu, Search } from "@mui/icons-material";
import NXLogo from "@/assets/logo-nx.svg";
import SolutionIcon from "@/assets/icon-solution.svg";
import FlowIcon from "@/assets/icon-flow.svg";
import NotificationIcon from "@/assets/icon-notification.svg";
import UserIcon from "@/assets/icon-user-profile.svg";
import BusinessIcon from "@/assets/icon-business.svg";
import { indigo } from "@mui/material/colors";

type MainAppBarProps = {
  onMenuClick?: () => void;
};

export const MainAppBar = ({ onMenuClick }: MainAppBarProps) => (
  <AppBar sx={{ backgroundColor: indigo[900] }} position="static">
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height={48}
      px={1}
    >
      <IconButton onClick={onMenuClick}>
        <Menu sx={{ color: "white" }} />
      </IconButton>
      <NXLogo />
      <Box flexGrow={1}>
        <InputBase
          startAdornment={
            <Search sx={{ fontSize: 16, m: 1, color: indigo[200] }} />
          }
          placeholder="Search"
          sx={{
            backgroundColor: indigo[800],
            borderRadius: "28px",
            mx: 1.5,
            px: 0.5,
            color: "white",
            fontSize: 14,
            minWidth: 336,
          }}
        />
      </Box>
      <ButtonSet />
    </Box>
  </AppBar>
);

const ButtonSet = () => (
  <>
    <IconButton>
      <SolutionIcon width={24} height={24} />
    </IconButton>
    <IconButton>
      <FlowIcon width={24} height={24} />
    </IconButton>
    <IconButton>
      <NotificationIcon width={24} height={24} />
    </IconButton>
    <Divider
      orientation="vertical"
      sx={{
        mx: 1.5,
        height: 28,
        backgroundColor: indigo[800],
      }}
    />
    <Box width={16} height={16} display="flex" alignItems="center">
      <BusinessIcon />
    </Box>
    <Typography ml={0.5} fontSize={12} fontWeight={500} lineHeight={1}>
      ABCDE
    </Typography>
    <Divider
      orientation="vertical"
      sx={{ mx: 1, height: 12, backgroundColor: indigo[200] }}
    />
    <Typography fontSize={12} fontWeight={500}>
      SELHO
    </Typography>
    <IconButton sx={{ ml: 1 }}>
      <UserIcon width={24} height={24} />
    </IconButton>
  </>
);
