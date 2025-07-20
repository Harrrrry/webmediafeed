import { CardContent, Typography, Box, Avatar, Stack, Collapse, Divider, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Comments } from '../Comments';
import { useTheme } from 'styled-components';
import { formatRelative } from '../../utils/formatDate';
import { GlassCard, ActionIconButton, AnimatedHeart } from './PostCard.styled';
import { usePostCard } from './usePostCard';

interface PostCardProps {
  id: string;
  mediaUrl: string;
  mediaType: string;
  caption: string;
  likes: string[] | number;
  onLike: () => void;
  user: any;
  timestamp: string;
  userObj: any;
  commentCount: number;
}

const PostCard = ({ id, mediaUrl, mediaType, caption, likes, onLike, user, timestamp, userObj, commentCount }: PostCardProps) => {
  const theme = useTheme();
  const {
    likeCount,
    liked,
    animate,
    showComments,
    heartRef,
    getMediaSrc,
    handleLike,
    handleToggleComments,
  } = usePostCard({ id, likes, userObj, commentCount, onLike });

  return (
    <GlassCard className="glass-card" sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 }, boxShadow: theme.shadows.card, borderRadius: theme.radii.card }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header: Avatar, Username, Timestamp */}
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
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
            {typeof user === 'string' ? (
              user?.[0]?.toUpperCase() || 'U'
            ) : (
              user?.profilePicUrl ? (
                <img 
                  src={user.profilePicUrl} 
                  alt={user.username || 'User'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                user?.username?.[0]?.toUpperCase() || 'U'
              )
            )}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight={700} color={theme.colors.text}>
              {typeof user === 'string' ? user : user?.username || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color={theme.colors.textSecondary}>
              {formatRelative(timestamp)}
            </Typography>
          </Box>
        </Stack>
        {/* Media */}
        {mediaType === 'image' ? (
          <Box mb={2} mt={1}>
            <img src={getMediaSrc(mediaUrl)} alt={caption} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: theme.radii.card, boxShadow: theme.shadows.card }} />
          </Box>
        ) : (
          <Box mb={2} mt={1}>
            <video src={getMediaSrc(mediaUrl)} controls style={{ width: '100%', maxHeight: 400, borderRadius: theme.radii.card, boxShadow: theme.shadows.card }} />
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
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Comments postId={id} />
        </Collapse>
      </CardContent>
    </GlassCard>
  );
};

export default PostCard; 