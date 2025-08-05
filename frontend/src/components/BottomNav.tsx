import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import EventIcon from '@mui/icons-material/Event';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleIcon from '@mui/icons-material/People';
import ShareIcon from '@mui/icons-material/Share';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { UserRole } from '../utils/constants';

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
  const navigate = useNavigate();
  const { userShaadis, currentShaadi, currentUserRole, status } = useSelector((state: RootState) => state.shaadi);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Check if user is currently the creator of selected shaadi or has no creator shaadis
  const hasCreatorShaadi = userShaadis.some(membership => membership.role === UserRole.CREATOR);
  const isCreator = currentUserRole === UserRole.CREATOR || !hasCreatorShaadi;

  const handleShaadiAction = () => {
    if (isCreator && currentShaadi) {
      // Navigate to manage invites
      navigate('/invite');
    } else if (isCreator) {
      // Create new shaadi
      navigate('/create-shaadi');
    }
  };

  const handleCreatePost = () => {
    if (!currentShaadi) {
      setSnackbarOpen(true);
      return;
    }
    navigate('/create-post');
  };

  return (
    <NavBar className="glass-card" role="navigation" aria-label="Bottom navigation">
      <Tooltip title="Home" arrow>
        <GlowIconButton aria-label="Home" tabIndex={0} onClick={() => navigate('/')}> 
          <HomeIcon fontSize="inherit" />
        </GlowIconButton>
      </Tooltip>
      <Tooltip title={currentShaadi ? "Events" : "Select a Shaadi to view events"} arrow>
        <GlowIconButton 
          aria-label="Events" 
          tabIndex={0}
          onClick={() => currentShaadi && navigate('/events')}
          sx={{
            opacity: currentShaadi ? 1 : 0.5,
            cursor: currentShaadi ? 'pointer' : 'not-allowed'
          }}
        >
          <EventIcon fontSize="inherit" />
        </GlowIconButton>
      </Tooltip>
      <Tooltip title={currentShaadi ? "Add Post" : "Select a Shaadi to create posts"} arrow>
        <GlowIconButton 
          aria-label="Add post" 
          tabIndex={0} 
          onClick={handleCreatePost}
          sx={{
            opacity: currentShaadi ? 1 : 0.5,
            cursor: currentShaadi ? 'pointer' : 'not-allowed'
          }}
        >
          <AddCircleIcon fontSize="inherit" />
        </GlowIconButton>
      </Tooltip>
      
      {/* Dynamic Shaadi Action Button */}
      {isCreator && currentShaadi ? (
        <Tooltip title="Manage Invites" arrow>
          <GlowIconButton aria-label="Manage Invites" tabIndex={0} onClick={handleShaadiAction}>
            <ShareIcon fontSize="inherit" />
          </GlowIconButton>
        </Tooltip>
      ) : isCreator ? (
        <Tooltip title="Create Shaadi" arrow>
          <GlowIconButton aria-label="Create Shaadi" tabIndex={0} onClick={handleShaadiAction}>
            <GroupAddIcon fontSize="inherit" />
          </GlowIconButton>
        </Tooltip>
      ) : null}
      
      {/* <Tooltip title={currentShaadi ? "Profile" : "Select a Shaadi to access profile"} arrow>
        <GlowIconButton 
          aria-label="Profile" 
          tabIndex={0}
          onClick={() => currentShaadi && navigate('/profile')}
          sx={{
            opacity: currentShaadi ? 1 : 0.5,
            cursor: currentShaadi ? 'pointer' : 'not-allowed'
          }}
        >
          <AccountCircleIcon fontSize="inherit" />
        </GlowIconButton>
      </Tooltip> */}
      <Tooltip title={currentShaadi ? "Contact" : "Select a Shaadi to view contacts"} arrow>
        <GlowIconButton 
          aria-label="Contact" 
          tabIndex={0} 
          onClick={() => currentShaadi && navigate('/contact')}
          sx={{
            opacity: currentShaadi ? 1 : 0.5,
            cursor: currentShaadi ? 'pointer' : 'not-allowed'
          }}
        >
          <ContactMailIcon fontSize="inherit" />
        </GlowIconButton>
      </Tooltip>
      
      {/* Snackbar for feedback */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
          {!currentShaadi ? 
            "Please select a Shaadi first to manage invites" : 
            "Please select a Shaadi first to create posts"
          }
        </Alert>
      </Snackbar>
    </NavBar>
  );
}; 