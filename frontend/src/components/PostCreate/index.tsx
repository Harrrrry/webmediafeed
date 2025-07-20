import { Stack, Avatar, Tooltip } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useTheme } from 'styled-components';
import { CompactCreatePost, PlaceholderText, MediaIcon } from './PostCreate.styled';
import { usePostCreate } from './usePostCreate';

const PostCreate = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const { handleCreatePostClick } = usePostCreate();

  // Get username safely
  const getUsername = () => {
    if (!user) {return 'U';}
    if (typeof user === 'string') {return (user as string)[0]?.toUpperCase() || 'U';}
    return user.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <CompactCreatePost onClick={handleCreatePostClick}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* User Avatar */}
        <Avatar sx={{ 
          bgcolor: theme.colors.accent, 
          width: 40, 
          height: 40, 
          fontWeight: 700,
          background: theme.colors.accentGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          lineHeight: 1,
          textAlign: 'center',
          padding: 0,
          margin: 0
        }}>
          {user?.profilePicUrl ? (
            <img 
              src={user.profilePicUrl} 
              alt={user.username || 'User'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            getUsername()
          )}
        </Avatar>
        {/* Placeholder Input */}
        <PlaceholderText variant="body1">
          Share a Shaadi moment... 💕
        </PlaceholderText>
        {/* Media Icon */}
        <Tooltip title="Add photo or video" arrow>
          <MediaIcon size="small">
            <AddPhotoAlternateIcon fontSize="small" />
          </MediaIcon>
        </Tooltip>
      </Stack>
    </CompactCreatePost>
  );
};

export default PostCreate; 