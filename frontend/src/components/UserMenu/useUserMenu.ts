import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/users/authSlice';
import { clearAllShaadiData } from '../../features/shaadi/shaadiSlice';

export const useUserMenu = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((open) => !open);
  };

  const handleLogout = () => {
    dispatch(clearAllShaadiData());
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