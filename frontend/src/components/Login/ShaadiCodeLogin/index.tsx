import React from 'react';
import { TextField, Button, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginWithShaadiCode } from '../../../features/users/authSlice';
import type { UnknownAction } from '@reduxjs/toolkit';
import PinIcon from '@mui/icons-material/Pin';
import { useShaadiCodeLogin } from './useShaadiCodeLogin';

interface ShaadiCodeLoginProps {
  mode?: 'login' | 'join';
  prefilledCode?: string;
  onLoginSuccess?: (code: string) => void;
  onAlreadyJoined?: () => void;
}

export const ShaadiCodeLogin = ({ mode = 'login', prefilledCode, onLoginSuccess, onAlreadyJoined }: ShaadiCodeLoginProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    shaadiCode, 
    shaadiCodeLoading, 
    shaadiCodeError, 
    handleCodeChange, 
    handleSubmit 
  } = useShaadiCodeLogin({ mode, prefilledCode, onLoginSuccess, onAlreadyJoined });

  return (
    <>
      <Typography variant="body2" color="text.secondary" mb={2} textAlign="center">
        {mode === 'join' 
          ? 'Enter your 6-digit Shaadi code to join the wedding celebration'
          : 'Enter your 6-digit Shaadi code to join directly'
        }
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="6-Digit Shaadi Code"
          value={shaadiCode}
          onChange={handleCodeChange}
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
    </>
  );
};

export default ShaadiCodeLogin; 