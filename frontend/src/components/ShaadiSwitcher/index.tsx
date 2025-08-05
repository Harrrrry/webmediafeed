import React, { useState, useEffect } from 'react';
import { Box, Typography, Menu, MenuItem, Button, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, Divider, Avatar, Tooltip, Snackbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { fetchUserShaadis, switchShaadi, clearCurrentShaadi, clearError } from '../../features/shaadi/shaadiSlice';
import { styled } from 'styled-components';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { UserRole, getRoleDisplayName } from '../../utils/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SwitcherContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 2rem;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  transition: all 0.2s ease;
  min-width: auto;
  max-width: auto;
  
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

const ShaadiAvatar = styled(Avatar)`
  width: 32px !important;
  height: 32px !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  background: ${({ theme }) => theme.colors.accentGradient} !important;
  color: white !important;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder} !important;
`;

const ShaadiSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userShaadis, currentShaadi, currentUserRole, status, error } = useSelector((state: RootState) => state.shaadi);
  const isSwitching = status === 'loading';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [selectedShaadi, setSelectedShaadi] = useState<any>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  // Removed codeLoading state - using Redux status instead
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Note: Shaadi data fetching is handled at App level
  // This component just displays the data

  // Watch for errors from Redux state
  useEffect(() => {
    console.log('ShaadiSwitcher - Redux error:', error);
    console.log('ShaadiSwitcher - Current shaadi:', currentShaadi);
    console.log('ShaadiSwitcher - Status:', status);
    console.log('ShaadiSwitcher - Is switching:', isSwitching);
    
    if (error && codeDialogOpen) {
      console.log('Setting error from Redux state:', error);
      setCodeError(error);
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [error, codeDialogOpen, currentShaadi, status, isSwitching]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShaadiSelect = (membership: any) => {
    setSelectedShaadi(membership);
    setCodeDialogOpen(true);
    handleClose();
  };

  const handleCurrentShaadiSelect = () => {
    if (currentShaadi && currentUserRole) {
      const currentMembership = {
        shaadi: currentShaadi,
        role: currentUserRole,
        code: userShaadis.find(m => m.shaadi._id === currentShaadi._id)?.code || ''
      };
      setSelectedShaadi(currentMembership);
      setCodeDialogOpen(true);
      handleClose();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    // Clear error when user starts typing
    if (codeError) {
      setCodeError('');
    }
  };

  const handleCodeSubmit = async () => {
    if (!code || code.length !== 6) {
      setCodeError('Please enter a valid 6-digit code');
      return;
    }

    setCodeError(''); // Clear previous errors
    // Clear any previous Redux errors
    dispatch(clearError());
    
    try {
      console.log('Submitting code:', code);
      
      // Try the traditional promise approach first
      const action = dispatch(switchShaadi(code) as any);
      console.log('Action dispatched:', action);
      
      // Wait for the action to complete
      const result = await action;
      console.log('Switch Shaadi Result:', result);
      
      // Check if the action was fulfilled or rejected
      if (result.type === 'shaadi/switchShaadi/fulfilled') {
        console.log('Switch Shaadi Success:', result.payload);
        // Success: Close dialog and clear form
        setCodeDialogOpen(false);
        setCode('');
        setCodeError('');
        setSelectedShaadi(null);
      } else if (result.type === 'shaadi/switchShaadi/rejected') {
        console.log('Switch Shaadi Rejected:', result);
        // Error: Keep dialog open, show error message
        const errorMessage = result.payload || 'Invalid code or access denied';
        setCodeError(errorMessage);
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      // This will catch both API errors and network errors
      console.log('Switch Shaadi Error:', error);
      console.log('Error type:', typeof error);
      console.log('Error message:', error.message);
      console.log('Error payload:', error.payload);
      console.log('Error stack:', error.stack);
      
      // Try to extract error message from different possible locations
      let errorMessage = 'Invalid code or access denied';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.payload) {
        errorMessage = error.payload;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Error: Keep dialog open, show error message
      setCodeError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleCodeDialogClose = () => {
    setCodeDialogOpen(false);
    setCode('');
    setCodeError('');
    setSelectedShaadi(null);
    setSnackbarOpen(false); // Clear any error notifications
  };

  const handleCreateNew = () => {
    handleClose();
    navigate('/create-shaadi');
  };

  const handleClearContext = () => {
    dispatch(clearCurrentShaadi());
    handleClose();
  };



  // Helper function to get Shaadi initials
  const getShaadiInitials = (shaadi: any) => {
    if (!shaadi?.name) return 'S';
    return shaadi.name.split(' ').map((word: string) => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  };

  // Helper function to get Shaadi image URL
  const getShaadiImageUrl = (shaadi: any) => {
    return shaadi?.image ? `${API_URL}${shaadi.image}` : null;
  };

  if (!user) return null;

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case UserRole.CREATOR:
        return { label: getRoleDisplayName(UserRole.CREATOR), color: 'primary' as const, icon: <AdminPanelSettingsIcon fontSize="small" /> };
      case UserRole.GUEST:
        return { label: getRoleDisplayName(UserRole.GUEST), color: 'default' as const };
      case UserRole.RELATIVE:
        return { label: getRoleDisplayName(UserRole.RELATIVE), color: 'secondary' as const };
      default:
        return { label: role, color: 'default' as const };
    }
  };

  // Check if user already has a creator shaadi
  const hasCreatorShaadi = userShaadis.some(membership => membership.role === UserRole.CREATOR);

  return (
    <Box>
      <SwitcherContainer onClick={handleClick}>
        <Tooltip title={currentShaadi?.name || 'Select Shaadi'}>
          <ShaadiAvatar 
            src={currentShaadi ? getShaadiImageUrl(currentShaadi) || undefined : undefined}
            sx={{ 
              width: 36, 
              height: 36,
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            {currentShaadi ? getShaadiInitials(currentShaadi) : 'S'}
          </ShaadiAvatar>
        </Tooltip>
        <KeyboardArrowDownIcon fontSize="small" />
      </SwitcherContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 250,
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        {/* Current Shaadi (if any) */}
        {currentShaadi && (
          <>
            <MenuItem
              // Remove onClick to prevent code entry popup when clicking current Shaadi
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                bgcolor: 'action.selected',
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={getShaadiImageUrl(currentShaadi) || undefined}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {getShaadiInitials(currentShaadi)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {currentShaadi.name} (Current)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentShaadi.brideName} & {currentShaadi.groomName}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Removed RefreshIcon */}
                  <Chip 
                    label={getRoleDisplay(currentUserRole || '').label} 
                    size="small" 
                    color={getRoleDisplay(currentUserRole || '').color}
                    icon={getRoleDisplay(currentUserRole || '').icon}
                  />
                </Box>
              </Box>
            </MenuItem>
            {/* Only show divider if there are other Shaadis */}
            {userShaadis.filter(m => m.shaadi._id !== currentShaadi?._id).length > 0 && <Divider />}
          </>
        )}

        {/* Other Shaadis */}
        {userShaadis.filter(membership => membership.shaadi._id !== currentShaadi?._id).map((membership: any, idx, arr) => {
          const roleInfo = getRoleDisplay(membership.role);
          return (
            <MenuItem
              key={membership.shaadi._id}
              onClick={() => handleShaadiSelect(membership)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={getShaadiImageUrl(membership.shaadi) || undefined}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      bgcolor: 'secondary.main'
                    }}
                  >
                    {getShaadiInitials(membership.shaadi)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {membership.shaadi.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {membership.shaadi.brideName} & {membership.shaadi.groomName}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={roleInfo.label} 
                  size="small" 
                  color={roleInfo.color}
                  icon={roleInfo.icon}
                />
              </Box>
            </MenuItem>
          );
        })}
        
        {currentShaadi && (
          <>
            <Divider />
            <MenuItem onClick={handleClearContext} sx={{ color: 'error.main' }}>
              Clear Shaadi Selection
            </MenuItem>
          </>
        )}
        

      </Menu>

      {/* Code Entry Dialog */}
      <Dialog open={codeDialogOpen} onClose={handleCodeDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          Enter Your 6-Digit Code
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your 6-digit code for "{selectedShaadi?.shaadi?.name}" to switch to this Shaadi.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="6-Digit Code"
            type="text"
            fullWidth
            variant="outlined"
            value={code}
            onChange={handleCodeChange}
            inputProps={{
              maxLength: 6,
              pattern: '[0-9]{6}',
              style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
            }}
            placeholder="000000"
          />
          {codeError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {codeError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCodeDialogClose}>Cancel</Button>
          <Button 
            onClick={handleCodeSubmit} 
            variant="contained" 
            disabled={code.length !== 6 || isSwitching}
          >
            {isSwitching ? 'Switching...' : 'Switch Shaadi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for error notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShaadiSwitcher; 