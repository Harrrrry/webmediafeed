import React from 'react';
import { getImageUrl } from '../../../utils/formatDate';
import { StyledAvatar } from './UserAvatar.styled';
import type { UserAvatarProps } from '../../../utils/interfaces/user';

const UserAvatar: React.FC<UserAvatarProps> = ({ profilePicUrl, username, size = 40, sx }) => (
  <StyledAvatar $size={size} sx={sx}>
    {profilePicUrl ? (
      <img
        src={getImageUrl(profilePicUrl)}
        alt={username || 'User'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
      />
    ) : (
      username?.[0]?.toUpperCase() || 'U'
    )}
  </StyledAvatar>
);

export default UserAvatar; 