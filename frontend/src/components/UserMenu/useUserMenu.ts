import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/users/authSlice';

export const useUserMenu = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((open) => !open);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDrawerOpen(false);
  };

  return {
    drawerOpen,
    handleDrawerToggle,
    handleLogout,
    setDrawerOpen,
  };
}; 