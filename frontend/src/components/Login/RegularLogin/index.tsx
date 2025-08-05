import React from 'react';
import { TextField, Button, Alert, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../features/users/authSlice';
import type { RootState } from '../../../app/store';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useRegularLogin } from './useRegularLogin';
import { RegularLoginForm, RegularLoginButton, RegularLoginLink } from './RegularLogin.styled';

export const RegularLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);
  
  const { username, password, handleUsernameChange, handlePasswordChange, handleSubmit } = useRegularLogin();

  return (
    <RegularLoginForm onSubmit={handleSubmit}>
      <TextField
        label="Email or Username"
        value={username}
        onChange={handleUsernameChange}
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
        onChange={handlePasswordChange}
        fullWidth
        margin="normal"
        autoComplete="current-password"
        InputProps={{
          startAdornment: (
            <LockPersonIcon sx={{ color: 'rgba(0,0,0,0.4)', mr: 1 }} />
          )
        }}
      />
      <RegularLoginButton
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Logging in...' : 'Login'}
      </RegularLoginButton>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      <Box textAlign="center" mt={3}>
        <Typography variant="body2" sx={{ color: '#000000' }}>
          Don't have an account?{' '}
          <RegularLoginLink
            variant="text"
            onClick={() => navigate('/register')}
          >
            Register here
          </RegularLoginLink>
        </Typography>
      </Box>
    </RegularLoginForm>
  );
};

export default RegularLogin; 