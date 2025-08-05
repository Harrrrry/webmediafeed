import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

export const useJoinShaadi = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const handleRedirectIfAuthenticated = useCallback(() => {
    // Only redirect if user is already authenticated and has completed the join process
    // For now, we'll let the join flow handle the authentication
    // This prevents immediate redirect after login
  }, [token, user, navigate]);

  return {
    handleRedirectIfAuthenticated,
  };
}; 