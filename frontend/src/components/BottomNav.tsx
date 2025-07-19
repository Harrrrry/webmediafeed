import { Box, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled, useTheme } from 'styled-components';

const NavBar = styled(Box)`
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95vw;
  max-width: 420px;
  padding: 0.5rem 1.2rem;
  border-radius: ${({ theme }) => theme.radii.nav};
  background: ${({ theme }) => theme.colors.navBg};
  box-shadow: ${({ theme }) => theme.shadows.nav};
  border: 2px solid ${({ theme }) => theme.colors.navBorder};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  z-index: 1000;
  @media (min-width: 700px) {
    display: none;
  }
`;

const GlowIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.accent};
  background: transparent;
  border-radius: 1.5rem;
  font-size: 2.1rem;
  box-shadow: none;
  transition: color 0.18s, box-shadow 0.18s, background 0.18s;
  &:hover, &:focus {
    color: #fff;
    background: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 16px 2px ${({ theme }) => theme.colors.accent};
  }
  &:active {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
    box-shadow: 0 0 24px 4px ${({ theme }) => theme.colors.accent};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const BottomNav = () => {
  const theme = useTheme();
  return (
    <NavBar className="glass-card" role="navigation" aria-label="Bottom navigation">
      <Tooltip title="Home" arrow><GlowIconButton aria-label="Home" tabIndex={0}><HomeIcon fontSize="inherit" /></GlowIconButton></Tooltip>
      <Tooltip title="Search" arrow><GlowIconButton aria-label="Search" tabIndex={0}><SearchIcon fontSize="inherit" /></GlowIconButton></Tooltip>
      <Tooltip title="Add Post" arrow><GlowIconButton aria-label="Add post" tabIndex={0}><AddCircleIcon fontSize="inherit" /></GlowIconButton></Tooltip>
      <Tooltip title="Notifications" arrow><GlowIconButton aria-label="Notifications" tabIndex={0}><NotificationsIcon fontSize="inherit" /></GlowIconButton></Tooltip>
      <Tooltip title="Profile" arrow><GlowIconButton aria-label="Profile" tabIndex={0}><AccountCircleIcon fontSize="inherit" /></GlowIconButton></Tooltip>
    </NavBar>
  );
}; 