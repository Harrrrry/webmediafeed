import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from 'styled-components';
import '@testing-library/jest-dom';
import UserMenu from './index';
import shaadiReducer from '../../features/shaadi/shaadiSlice';
import authReducer from '../../features/users/authSlice';
import { theme } from '../../styles/theme';
import { UserRole } from '../../utils/constants';

const createMockStore = (shaadiState: any, authState: any) => {
  return configureStore({
    reducer: {
      shaadi: shaadiReducer,
      auth: authReducer,
    },
    preloadedState: {
      shaadi: {
        userShaadis: shaadiState.userShaadis || [],
        currentShaadi: shaadiState.currentShaadi || null,
        currentUserRole: shaadiState.currentUserRole || null,
        status: 'idle',
        error: null,
      },
      auth: {
        user: authState.user || null,
        token: authState.token || null,
        status: 'succeeded',
        error: null,
      },
    },
  });
};

const renderUserMenu = (shaadiState: any, authState: any) => {
  const store = createMockStore(shaadiState, authState);
  
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <UserMenu />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('UserMenu', () => {
  const mockUser = {
    id: 'user123',
    username: 'testuser',
    email: 'test@example.com'
  };

  const mockShaadi = {
    _id: 'shaadi123',
    name: 'Test Wedding',
    brideName: 'Asha',
    groomName: 'Ravi',
    date: '2024-12-01',
    location: 'Delhi'
  };

  describe('Conditional Shaadi Switcher Display', () => {
    it('should show "No Shaadi selected" when user has no Shaadis', () => {
      renderUserMenu(
        { userShaadis: [] }, // No Shaadis
        { user: mockUser, token: 'mock-token' }
      );

      expect(screen.getByText('No Shaadi selected')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /shaadi switcher/i })).not.toBeInTheDocument();
    });

    it('should show ShaadiSwitcher when user has Shaadis', () => {
      const userShaadis = [
        {
          shaadi: mockShaadi,
          role: UserRole.CREATOR,
          code: '123456'
        }
      ];

      renderUserMenu(
        { userShaadis, currentShaadi: mockShaadi, currentUserRole: UserRole.CREATOR },
        { user: mockUser, token: 'mock-token' }
      );

      expect(screen.queryByText('No Shaadi selected')).not.toBeInTheDocument();
      // The ShaadiSwitcher should be rendered (we can check for its container or avatar)
      expect(screen.getByText('T')).toBeInTheDocument(); // Avatar with initials
    });

    it('should hide ShaadiSwitcher when userShaadis is null/undefined', () => {
      renderUserMenu(
        { userShaadis: null }, // null userShaadis
        { user: mockUser, token: 'mock-token' }
      );

      expect(screen.getByText('No Shaadi selected')).toBeInTheDocument();
    });

    it('should show app name "Shaadi Circle" in header', () => {
      renderUserMenu(
        { userShaadis: [] },
        { user: mockUser, token: 'mock-token' }
      );

      expect(screen.getByText('Shaadi Circle')).toBeInTheDocument();
    });

    it('should show back button when on create-post page', () => {
      // Mock location pathname
      Object.defineProperty(window, 'location', {
        value: { pathname: '/create-post' },
        writable: true
      });

      renderUserMenu(
        { userShaadis: [] },
        { user: mockUser, token: 'mock-token' }
      );

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.queryByText('Shaadi Circle')).not.toBeInTheDocument();
    });
  });

  describe('User Authentication States', () => {
    it('should render properly when user is authenticated', () => {
      renderUserMenu(
        { userShaadis: [] },
        { user: mockUser, token: 'mock-token' }
      );

      expect(screen.getByText('Shaadi Circle')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    it('should render properly when user is not authenticated', () => {
      renderUserMenu(
        { userShaadis: [] },
        { user: null, token: null }
      );

      expect(screen.getByText('Shaadi Circle')).toBeInTheDocument();
    });
  });
}); 