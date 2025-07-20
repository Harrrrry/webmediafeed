import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Avatar, Box, IconButton, Tooltip, Badge, Menu, MenuItem, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from 'styled-components';
import { useUserMenu } from './useUserMenu';
import { WeddingAppBar, LogoText, GlowIconButton, NotificationBadge, WeddingDrawer, DrawerHeader, DrawerMenuItem, DecorativePattern } from './UserMenu.styled';

const UserMenu = () => {
  const theme = useTheme();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { drawerOpen, handleDrawerToggle, handleLogout } = useUserMenu();

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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: '4rem',
          px: { xs: 2, sm: 3 }
        }}>
          {/* Left: App Name */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <LogoText variant="h6">
              ShaadiFeed
            </LogoText>
          </Link>

          {/* Right: Notifications and Menu */}
          <Box display="flex" alignItems="center" gap={1}>
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
              ShaadiFeed
            </LogoText>
            <GlowIconButton onClick={handleDrawerToggle} size="small" sx={{ color: 'white !important' }}>
              <CloseIcon fontSize="small" />
            </GlowIconButton>
          </Box>
          {token && user && (
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                sx={{ 
                  bgcolor: 'white', 
                  color: theme.colors.accent,
                  width: 48, 
                  height: 48, 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  border: `2px solid ${theme.glass.border}`
                }}
              >
                {user?.profilePicUrl ? (
                  <img 
                    src={user.profilePicUrl} 
                    alt={user.username || 'User'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  user?.username?.[0]?.toUpperCase() || 'U'
                )}
              </Avatar>
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
              Login to ShaadiFeed
            </Button>
          </Box>
        )}
      </WeddingDrawer>
    </>
  );
};

export default UserMenu; 