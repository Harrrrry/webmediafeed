import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Tabs, Tab, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginWithShaadiCode, getProfileMe } from '../features/users/authSlice';
import type { RootState } from '../app/store';
import type { UnknownAction } from '@reduxjs/toolkit';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import PinIcon from '@mui/icons-material/Pin';
import PageLayout from '../components/common/PageLayout';
import { api } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface LoginProps {
  mode?: 'login' | 'join';
  prefilledCode?: string;
  showTabs?: boolean;
}

export const Login = ({ mode = 'login', prefilledCode, showTabs = true }: LoginProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, error, token, user } = useSelector((state: RootState) => state.auth);
  
  // Regular login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Shaadi code login state
  const [shaadiCode, setShaadiCode] = useState('');
  const [shaadiCodeLoading, setShaadiCodeLoading] = useState(false);
  const [shaadiCodeError, setShaadiCodeError] = useState('');
  
  // Tab state - default to shaadi code tab if in join mode
  const [tabValue, setTabValue] = useState(mode === 'join' ? 1 : 0);

  // Get code from URL parameter or prefilled code
  useEffect(() => {
    if (mode === 'join') {
      const codeFromUrl = searchParams.get('code') || prefilledCode;
      if (codeFromUrl) {
        setShaadiCode(codeFromUrl);
      }
    }
  }, [mode, searchParams, prefilledCode]);

  React.useEffect(() => {
    if (token && !user) {
      dispatch(getProfileMe() as unknown as UnknownAction);
    }
    if (token && user) {
      navigate('/');
    }
  }, [token, user, navigate, dispatch]);

  const handleRegularLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }) as any);
  };

  const handleShaadiCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shaadiCode || shaadiCode.length !== 6) {
      setShaadiCodeError('Please enter a valid 6-digit code');
      return;
    }
    
    setShaadiCodeLoading(true);
    setShaadiCodeError('');
    
    try {
      const result = await dispatch(loginWithShaadiCode(shaadiCode) as unknown as UnknownAction);
      if (loginWithShaadiCode.fulfilled.match(result)) {
        // Login successful, navigate to home
        navigate('/');
      } else if (loginWithShaadiCode.rejected.match(result)) {
        // Login failed, error will be set by the reducer
        setShaadiCodeError(result.error?.message || 'Invalid code or access denied');
      }
    } catch (err: any) {
      setShaadiCodeError(err.message || 'Invalid code or access denied');
    } finally {
      setShaadiCodeLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Clear errors when switching tabs
    setShaadiCodeError('');
  };

  return (
    <PageLayout>
      <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box width="100%" maxWidth={400} px={2} mx="auto">
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
              {mode === 'join' ? 'Join Shaadi' : 'Welcome to Shaadi Circle'}
            </Typography>
            
            {showTabs && (
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="login tabs" centered>
                <Tab label="Regular Login" />
                <Tab label="Shaadi Code" />
              </Tabs>
            )}
            
            {/* Regular Login Tab - Only show if tabs are enabled */}
            {showTabs && (
              <TabPanel value={tabValue} index={0}>
                <form onSubmit={handleRegularLogin}>
                  <TextField
                    label="Email or Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    autoFocus
                    autoComplete="username"
                    InputProps={{
                      startAdornment: (
                        <LockPersonIcon sx={{ color: 'rgba(0,0,0,0.4)', mr: 1 }} />
                      )
                    }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <LockPersonIcon sx={{ color: 'rgba(0,0,0,0.4)', mr: 1 }} />
                      )
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, mb: 1 }}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Logging in...' : 'Login'}
                  </Button>
                  {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </form>
              </TabPanel>
            )}
            
            {/* Shaadi Code Login Tab - Show if tabs enabled and tab is selected, or if no tabs */}
            {(showTabs ? tabValue === 1 : true) && (
              <TabPanel value={tabValue} index={1}>
                <form onSubmit={handleShaadiCodeSubmit}>
                  <Typography variant="body2" color="text.secondary" mb={2} textAlign="center">
                    {mode === 'join' 
                      ? 'Enter your 6-digit Shaadi code to join the wedding celebration'
                      : 'Enter your 6-digit Shaadi code to join directly'
                    }
                  </Typography>
                  <TextField
                    label="6-Digit Shaadi Code"
                    value={shaadiCode}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setShaadiCode(value);
                      setShaadiCodeError('');
                    }}
                    fullWidth
                    margin="normal"
                    autoFocus
                    inputProps={{
                      maxLength: 6,
                      pattern: '[0-9]{6}',
                      style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
                    }}
                    placeholder="000000"
                    InputProps={{
                      startAdornment: (
                        <PinIcon sx={{ color: 'rgba(0,0,0,0.4)', mr: 1 }} />
                      )
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, mb: 1 }}
                    disabled={shaadiCodeLoading || shaadiCode.length !== 6}
                  >
                    {shaadiCodeLoading ? 'Joining...' : (mode === 'join' ? 'Join Shaadi' : 'Join Shaadi')}
                  </Button>
                  {shaadiCodeError && <Alert severity="error" sx={{ mt: 2 }}>{shaadiCodeError}</Alert>}
                </form>
              </TabPanel>
            )}
          </Paper>
          
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" sx={{ color: '#000000' }}>
              {mode === 'join' ? (
                <>
                  Already have an account?{' '}
                  <Button
                    variant="text"
                    sx={{ 
                      color: '#1976d2', 
                      textDecoration: 'none',
                      fontWeight: 400,
                      fontSize: 'inherit',
                      textTransform: 'none',
                      minWidth: 'auto',
                      padding: 0,
                      '&:hover': {
                        color: '#1565c0',
                        backgroundColor: 'transparent',
                        textDecoration: 'none',
                      }
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Login here
                  </Button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    sx={{ 
                      color: '#1976d2', 
                      textDecoration: 'none',
                      fontWeight: 400,
                      fontSize: 'inherit',
                      textTransform: 'none',
                      minWidth: 'auto',
                      padding: 0,
                      '&:hover': {
                        color: '#1565c0',
                        backgroundColor: 'transparent',
                        textDecoration: 'none',
                      }
                    }}
                    onClick={() => navigate('/register')}
                  >
                    Register here
                  </Button>
                </>
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </PageLayout>
  );
}; 