import { useState, useEffect, useRef } from 'react';
import { CardContent, Typography, Box, Avatar, Stack, Collapse, Divider, IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Comments } from './Comments';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import type { User } from '../utils/interfaces/user';
import { fetchComments } from '../features/comments/commentsSlice';
import type { UnknownAction } from '@reduxjs/toolkit';
import { styled, useTheme, keyframes } from 'styled-components';

const GlassCard = styled(Box)`
  &.glass-card {
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.card};
    box-shadow: ${({ theme }) => theme.shadows.card};
    border: ${({ theme }) => theme.colors.cardBorder};
    background: ${({ theme }) => theme.glass.background};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    transition: box-shadow 0.2s, background 0.2s, transform 0.15s;
    &:hover {
      box-shadow: 0 12px 32px 0 #a18cd1;
      transform: translateY(-2px) scale(1.01);
    }
  }
`;

const ActionIconButton = styled(IconButton)`
  border-radius: 1.2rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  transition: color 0.2s, transform 0.1s;
  &:hover, &:focus {
    background: transparent;
    color: ${({ theme }) => theme.colors.accent};
    box-shadow: none;
  }
  &:active {
    background: transparent;
    color: ${({ theme }) => theme.colors.accent};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const heartPop = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const AnimatedHeart = styled(FavoriteIcon)`
  color: ${({ theme }) => theme.colors.error};
  &.pop {
    animation: ${heartPop} 0.5s cubic-bezier(.36,1.01,.32,1) forwards;
  }
`;

export const PostCard = ({ id, mediaUrl, mediaType, caption, likes, onLike, user, timestamp, userObj }: any) => {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentCount = useSelector((state: RootState) => (state.comments.commentsByPost[id]?.length || 0));
  const likeCount = Array.isArray(likes) ? likes.length : likes;
  const liked = Array.isArray(likes) && userObj ? likes.includes(userObj.id) : false;
  const theme = useTheme();
  const heartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (showComments) {
      dispatch(fetchComments(id) as unknown as UnknownAction);
    }
  }, [showComments, dispatch, id]);

  useEffect(() => {
    if (animate && heartRef.current) {
      const node = heartRef.current;
      node.classList.add('pop');
      const handleEnd = () => {
        node.classList.remove('pop');
        setAnimate(false);
      };
      node.addEventListener('animationend', handleEnd, { once: true });
      return () => node.removeEventListener('animationend', handleEnd);
    }
  }, [animate]);

  const handleLike = () => {
    setAnimate(true);
    onLike();
  };

  return (
    <GlassCard className="glass-card" sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 }, boxShadow: theme.shadows.card, borderRadius: theme.radii.card }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header: Avatar, Username, Timestamp */}
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Avatar sx={{ bgcolor: theme.colors.accent, width: 40, height: 40, fontWeight: 700 }}>{user?.[0]?.toUpperCase() || 'U'}</Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight={700} color={theme.colors.text}>{user}</Typography>
            <Typography variant="caption" color={theme.colors.textSecondary}>
              {new Date(timestamp).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
        {/* Media */}
        {mediaType === 'image' ? (
          <Box mb={2} mt={1}>
            <img src={mediaUrl} alt={caption} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: theme.radii.card, boxShadow: theme.shadows.card }} />
          </Box>
        ) : (
          <Box mb={2} mt={1}>
            <video src={mediaUrl} controls style={{ width: '100%', maxHeight: 400, borderRadius: theme.radii.card, boxShadow: theme.shadows.card }} />
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
              onClick={() => setShowComments((v) => !v)}
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