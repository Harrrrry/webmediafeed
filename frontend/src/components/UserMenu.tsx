import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/users/authSlice';
import type { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';

export const UserMenu = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          WebMediaFeed
        </Typography>
        {!token ? (
          <Box display="flex" gap={2}>
            <Button component={Link} to="/login" color="primary" variant="outlined">Login</Button>
            <Button component={Link} to="/register" color="primary" variant="contained">Register</Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={500}>{user?.username || 'User'}</Typography>
            <Button onClick={() => dispatch(logout())} color="secondary" variant="outlined">Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}; 