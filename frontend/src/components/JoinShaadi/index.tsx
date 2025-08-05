import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import AppHeader from '../common/AppHeader';
import ShaadiCodeLogin from '../Login/ShaadiCodeLogin';
import JoinShaadiForm from './JoinShaadiForm';

export const JoinShaadi = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>('');

  // Get code from URL parameter
  const codeFromUrl = searchParams.get('code');

  const handleLoginSuccess = (code: string) => {
    setInviteCode(code);
    setShowJoinForm(true);
  };

  const handleJoinSuccess = () => {
    // Redirect to home after successful join
    navigate('/');
  };

  const handleAlreadyJoined = () => {
    // If user is already joined, redirect directly to home
    navigate('/');
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <AppHeader />
      {!showJoinForm ? (
        <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box width="100%" maxWidth={400} px={2} mx="auto">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
                Join Shaadi
              </Typography>
              <ShaadiCodeLogin 
                mode="join" 
                prefilledCode={codeFromUrl || undefined}
                onLoginSuccess={handleLoginSuccess}
                onAlreadyJoined={handleAlreadyJoined}
              />
            </Paper>
          </Box>
        </Box>
      ) : (
        <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box width="100%" maxWidth={400} px={2} mx="auto">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
                Complete Your Profile
              </Typography>
              <JoinShaadiForm 
                inviteCode={inviteCode}
                onSuccess={handleJoinSuccess}
              />
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default JoinShaadi; 