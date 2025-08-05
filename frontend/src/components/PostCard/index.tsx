import { CardContent, Typography, Box, Stack, Collapse, Divider, Tooltip, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Comments from '../Comments';
import { useTheme } from 'styled-components';
import { formatRelative } from '../../utils/formatDate';
import { GlassCard, ActionIconButton } from './PostCard.styled';
import { usePostCard } from './usePostCard';
import SwipeableViews from 'react-swipeable-views';
import { useState } from 'react';
import UserAvatar from '../common/UserAvatar';
import type { PostCardProps } from '../../utils/interfaces/post';

const PostCard = ({ id, mediaUrls, mediaTypes, caption, likes, onLike, user, timestamp, userObj, commentCount, tags }: PostCardProps & { tags?: string[] }) => {
  const theme = useTheme();
  const {
    likeCount,
    liked,
    showComments,
    getMediaSrc,
    handleLike,
    handleToggleComments,
  } = usePostCard({ id, likes, userObj, commentCount, onLike });

  const [mediaIndex, setMediaIndex] = useState(0);

  return (
    <GlassCard className="glass-card" sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 }, boxShadow: theme.shadows.card, borderRadius: theme.radii.card }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header: Avatar, Username, Timestamp */}
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <UserAvatar profilePicUrl={typeof user === 'string' ? undefined : user?.profilePicUrl} username={typeof user === 'string' ? user : user?.username} size={40} />
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight={700} color={theme.colors.text}>
              {typeof user === 'string' ? user : user?.username || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color={theme.colors.textSecondary}>
              {formatRelative(timestamp)}
            </Typography>
          </Box>
        </Stack>
        {/* Media Slider */}
        {mediaUrls && mediaUrls.length > 0 && (
          <Box mb={2} mt={1} position="relative">
            <SwipeableViews
              index={mediaIndex}
              onChangeIndex={setMediaIndex}
              enableMouseEvents
              style={{ borderRadius: theme.radii.card }}
            >
              {mediaUrls.map((url, idx) => (
                <Box key={url} display="flex" justifyContent="center" alignItems="center" sx={{ aspectRatio: '1 / 1', width: '100%', background: '#f5f5f5', borderRadius: theme.radii.card, overflow: 'hidden' }}>
                  {mediaTypes[idx] === 'image' ? (
                    <img src={getMediaSrc(url)} alt={caption} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: theme.radii.card }} />
                  ) : (
                    <video src={getMediaSrc(url)} controls style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: theme.radii.card }} />
                  )}
                </Box>
              ))}
            </SwipeableViews>
            {/* Dots navigation */}
            {mediaUrls.length > 1 && (
              <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                {mediaUrls.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: idx === mediaIndex ? theme.colors.accent : '#ccc',
                      mx: 0.5,
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        {/* Actions: Like, Comment, Likes count */}
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Tooltip title={liked ? 'Unlike' : 'Like'}>
            <ActionIconButton
              onClick={handleLike}
              aria-label={liked ? 'Unlike post' : 'Like post'}
              tabIndex={0}
            >
              {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </ActionIconButton>
          </Tooltip>
          <Typography variant="body2" fontWeight={600}>{likeCount}</Typography>
          <Tooltip title="Show comments">
            <ActionIconButton
              onClick={handleToggleComments}
              aria-label="Show comments"
              tabIndex={0}
              sx={{ ml: 1 }}
            >
              <ChatBubbleOutlineIcon />
            </ActionIconButton>
          </Tooltip>
          <Typography variant="body2">{commentCount}</Typography>
        </Stack>
        <Typography variant="body1" sx={{ mt: 1, mb: 1, color: theme.colors.text }}>{caption}</Typography>
        {/* Tags display */}
        {Array.isArray(tags) && tags.length > 0 && (
          <Box mb={1} display="flex" flexWrap="wrap" gap={1}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        )}
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Comments postId={id} />
        </Collapse>
      </CardContent>
    </GlassCard>
  );
};

export default PostCard; 