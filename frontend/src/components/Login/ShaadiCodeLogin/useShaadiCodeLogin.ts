import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginWithShaadiCode } from '../../../features/users/authSlice';
import { setCurrentShaadi, fetchUserShaadis } from '../../../features/shaadi/shaadiSlice';
import type { UnknownAction } from '@reduxjs/toolkit';

interface UseShaadiCodeLoginProps {
  mode?: 'login' | 'join';
  prefilledCode?: string;
  onLoginSuccess?: (code: string) => void;
  onAlreadyJoined?: () => void;
}

export const useShaadiCodeLogin = ({ mode = 'login', prefilledCode, onLoginSuccess, onAlreadyJoined }: UseShaadiCodeLoginProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shaadiCode, setShaadiCode] = useState('');
  const [shaadiCodeLoading, setShaadiCodeLoading] = useState(false);
  const [shaadiCodeError, setShaadiCodeError] = useState('');

  // Set prefilled code if provided
  useEffect(() => {
    if (prefilledCode) {
      setShaadiCode(prefilledCode);
    }
  }, [prefilledCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setShaadiCode(value);
    setShaadiCodeError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shaadiCode || shaadiCode.length !== 6) {
      setShaadiCodeError('Please enter a valid 6-digit code');
      return;
    }
    
    setShaadiCodeLoading(true);
    setShaadiCodeError('');
    
    try {
      const result = await dispatch(loginWithShaadiCode(shaadiCode) as unknown as UnknownAction);
      
      // Check the result type to determine success/failure
      if (result.type === 'auth/loginWithShaadiCode/fulfilled') {
        setShaadiCodeLoading(false);
        
        const payload = (result as any).payload;
        
        // Handle shaadi state updates
        if (payload && payload.shaadi && payload.role) {
          dispatch(setCurrentShaadi({ 
            shaadi: payload.shaadi, 
            role: payload.role 
          }));
          dispatch(fetchUserShaadis() as unknown as UnknownAction);
        }
        
        // Check if user is already joined using the isJoined flag from backend
        if (mode === 'join' && payload && payload.isInviteCode) {
          if (payload.isJoined) {
            // User has already joined - redirect to home
            if (onAlreadyJoined) {
              onAlreadyJoined();
            } else {
              navigate('/');
            }
          } else {
            // New user - show join form
            if (onLoginSuccess) {
              onLoginSuccess(shaadiCode);
            }
          }
        } else if (mode === 'join' && onLoginSuccess) {
          // Fallback for non-invite codes
          onLoginSuccess(shaadiCode);
        } else {
          // Regular login - redirect to home
          navigate('/');
        }
      } else if (result.type === 'auth/loginWithShaadiCode/rejected') {
        setShaadiCodeLoading(false);
        setShaadiCodeError('Invalid code or access denied');
      }
    } catch (err: any) {
      console.error('ShaadiCodeLogin: Login error:', err);
      setShaadiCodeError(err.message || 'Invalid code or access denied');
      setShaadiCodeLoading(false);
    }
  };

  return {
    shaadiCode,
    shaadiCodeLoading,
    shaadiCodeError,
    handleCodeChange,
    handleSubmit,
  };
}; 