import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
  Divider,
  Button
} from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import ShaadiSwitcher from '../ShaadiSwitcher';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from 'styled-components';
import { useUserMenu } from './useUserMenu';
import { WeddingAppBar, LogoText, GlowIconButton, NotificationBadge, WeddingDrawer, DrawerHeader, DrawerMenuItem, DecorativePattern } from './UserMenu.styled';
import UserAvatar from '../common/UserAvatar';
import { UserRole } from '../../utils/constants';

const UserMenu = () => {
  const theme = useTheme();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { userShaadis, status } = useSelector((state: RootState) => state.shaadi);
  const { drawerOpen, handleDrawerToggle, handleLogout } = useUserMenu();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user has any Shaadis (is member/creator of any)
  // Only show Shaadi switcher if data is loaded and user has Shaadis
  const hasUserShaadis = status === 'succeeded' && userShaadis && userShaadis.length > 0;

  const menuItems = [
    { text: 'Profile', icon: <AccountCircleIcon />, action: handleDrawerToggle },
    { text: 'Settings', icon: <SettingsIcon />, action: handleDrawerToggle },
    { text: 'Help & FAQs', icon: <HelpIcon />, action: handleDrawerToggle },
    { text: 'Logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <>
      <WeddingAppBar position="static" elevation={0}>
        <Toolbar sx={{
          minHeight: '4rem',
          maxWidth: 768,
          width: '100%',
          margin: '0 auto',
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}>
          {/* Left: App name or Back button */}
          <Box display="flex" alignItems="center" sx={{ minWidth: 'fit-content', width: '140px', flexShrink: 0 }}>
            {location.pathname === '/create-post' ? (
              <IconButton onClick={() => navigate(-1)} sx={{ color: theme.colors.text }}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.colors.accent,
                  fontSize: '1.1rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Shaadi Circle
              </Typography>
            )}
          </Box>
          
          {/* Center: Shaadi Switcher (only show if user has Shaadis) */}
          <Box display="flex" alignItems="center" justifyContent="center" flex={1} sx={{ minWidth: 0 }}>
            {hasUserShaadis && <ShaadiSwitcher />}
          </Box>
          
          {/* Right: Notifications and Menu */}
          <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 'fit-content', flexShrink: 0 }}>
            <Tooltip title="Notifications" arrow>
              <GlowIconButton size="small" sx={{ position: 'relative' }}>
                <NotificationBadge 
                  badgeContent={3} 
                  color="error"
                >
                  <NotificationsIcon fontSize="small" />
                </NotificationBadge>
              </GlowIconButton>
            </Tooltip>
            <GlowIconButton
              onClick={handleDrawerToggle}
              size="small"
              aria-label="menu"
            >
              <MenuIcon fontSize="small" />
            </GlowIconButton>
          </Box>
        </Toolbar>
      </WeddingAppBar>

      {/* Side Drawer */}
      <WeddingDrawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <DrawerHeader>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <LogoText variant="h6" sx={{ color: 'white', '&::after': { display: 'none' } }}>
              Shaadi Circle
            </LogoText>
            <GlowIconButton onClick={handleDrawerToggle} size="small" sx={{ color: 'white !important' }}>
              <CloseIcon fontSize="small" />
            </GlowIconButton>
          </Box>
          {token && user && (
            <Box display="flex" alignItems="center" gap={2}>
              <UserAvatar profilePicUrl={user?.profilePicUrl} username={user?.username} size={48} sx={{ bgcolor: 'white', color: theme.colors.accent, border: `2px solid ${theme.glass.border}` }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
                  {user?.username || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Welcome back! 💕
                </Typography>
              </Box>
            </Box>
          )}
          <DecorativePattern />
        </DrawerHeader>
        <List sx={{ pt: 0 }}>
          {menuItems.map((item, index) => (
            <DrawerMenuItem key={index} onClick={item.action}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </DrawerMenuItem>
          ))}
        </List>
        {!token && (
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/login"
              sx={{
                background: theme.colors.accentGradient,
                color: 'white',
                fontWeight: 700,
                borderRadius: '1rem',
                py: 1,
                '&:hover': {
                  background: theme.colors.accentGradient,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows.card,
                }
              }}
            >
              Login to Shaadi Circle
            </Button>
          </Box>
        )}
      </WeddingDrawer>
    </>
  );
};

export default UserMenu; 