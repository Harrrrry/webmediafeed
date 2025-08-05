import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import UserMenu from './components/UserMenu';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './app/store';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { useEffect } from 'react';
import { getProfileMe } from './features/users/authSlice';
import { fetchUserShaadis, setCurrentShaadi, clearAllShaadiData } from './features/shaadi/shaadiSlice';
import type { UnknownAction } from '@reduxjs/toolkit';
import AppRoutes from './routes/AppRoutes';
import { useReduxPersistence } from './hooks/useReduxPersistence';

// Component to conditionally render UserMenu based on route
const ConditionalUserMenu = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  // Hide UserMenu on join pages and login page
  const isJoinPage = location.pathname.startsWith('/join');
  const isLoginPage = location.pathname === '/login';
  
  if (!token || isJoinPage || isLoginPage) {
    return null;
  }
  
  return <UserMenu />;
};

// Component to conditionally render BottomNav based on route
const ConditionalBottomNav = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  // Hide BottomNav on join pages and login page
  const isJoinPage = location.pathname.startsWith('/join');
  const isLoginPage = location.pathname === '/login';
  
  if (!token || isJoinPage || isLoginPage) {
    return null;
  }
  
  return <BottomNav />;
};

function App(): React.ReactElement {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { userShaadis, status } = useSelector((state: RootState) => state.shaadi);
  const dispatch = useDispatch();

  // Use Redux persistence hook
  useReduxPersistence();

  useEffect((): void => {
    if (token !== null && token !== '' && !user) {
      dispatch(getProfileMe() as unknown as UnknownAction);
    }
  }, [token, user, dispatch]);

  // Restore state from localStorage on app load
  useEffect(() => {
    // Restore current Shaadi from localStorage
    const savedShaadi = localStorage.getItem('currentShaadi');
    const savedUserRole = localStorage.getItem('currentUserRole');
    
    if (savedShaadi && savedUserRole) {
      try {
        const shaadi = JSON.parse(savedShaadi);
        dispatch(setCurrentShaadi({ shaadi, role: savedUserRole }) as unknown as UnknownAction);
      } catch (error) {
        console.error('Error restoring Shaadi state:', error);
        localStorage.removeItem('currentShaadi');
        localStorage.removeItem('currentUserRole');
      }
    }
  }, [dispatch]);

  // Fetch user's Shaadis when user is authenticated
  useEffect(() => {
    if (token && user) {
      console.log('App: Fetching fresh Shaadi data for user:', user.username);
      // Always fetch fresh data when user is authenticated
      dispatch(fetchUserShaadis() as unknown as UnknownAction);
    }
  }, [token, user, dispatch]);

  // Clear Shaadi data when user logs out
  useEffect(() => {
    if (!token && userShaadis.length > 0) {
      dispatch(clearAllShaadiData() as unknown as UnknownAction);
    }
  }, [token, userShaadis.length, dispatch]);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <ConditionalUserMenu />
        <AppRoutes />
        <ConditionalBottomNav />
      </BrowserRouter>
    </>
  );
}

export default App;
