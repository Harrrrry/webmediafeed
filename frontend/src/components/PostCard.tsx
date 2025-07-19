import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Avatar, Stack, Collapse, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Comments } from './Comments';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import type { User } from '../utils/interfaces/user';
import { fetchComments } from '../features/comments/commentsSlice';
import type { UnknownAction } from '@reduxjs/toolkit';

interface PostCardProps {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  likes: string[]; // Array of user IDs
  onLike: () => void;
  user: string;
  timestamp: string;
  commentCount?: number;
  userObj: User | null;
}

export const PostCard = ({ id, mediaUrl, mediaType, caption, likes, onLike, user, timestamp, userObj }: PostCardProps) => {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentCount = useSelector((state: RootState) => (state.comments.commentsByPost[id]?.length || 0));
  const likeCount = Array.isArray(likes) ? likes.length : likes;
  const liked = Array.isArray(likes) && userObj ? likes.includes(userObj.id) : false;
  // Debug output
  console.log('DEBUG:', { id, likes, userId: userObj?.id, liked });

  useEffect(() => {
    if (showComments) {
      dispatch(fetchComments(id) as unknown as UnknownAction);
    }
  }, [showComments, dispatch, id]);

  const handleLike = () => {
    setAnimate(true);
    onLike();
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, maxWidth: 500, mx: 'auto' }}>
      {/* Header: Avatar, Username, Timestamp */}
      <Box display="flex" alignItems="center" px={2} pt={2} pb={1}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, mr: 2 }}>
          {user?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box flex={1}>
          <Typography variant="subtitle2" fontWeight={600}>{user}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(timestamp).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      {/* Media */}
      {mediaType === 'image' ? (
        <CardMedia
          component="img"
          image={mediaUrl}
          alt={caption}
          sx={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 0 }}
        />
      ) : (
        <CardMedia
          component="video"
          src={mediaUrl}
          controls
          sx={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 0 }}
        />
      )}
      {/* Actions: Like, Comment, Likes count */}
      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            onClick={handleLike}
            aria-label="Like post"
            sx={{
              color: liked ? 'error.main' : 'inherit',
              transform: animate ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 0.2s, color 0.2s',
            }}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" fontWeight={600}>{likeCount}</Typography>
          <IconButton
            onClick={() => setShowComments((v) => !v)}
            aria-label="Show comments"
            sx={{ ml: 1 }}
          >
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2">{commentCount}</Typography>
        </Stack>
        <Typography variant="body1" sx={{ mt: 1 }}>{caption}</Typography>
        {/* Debug output visible in UI */}
        <Typography variant="caption" color="secondary">
          Debug: userId={userObj?.id} | likes={JSON.stringify(likes)} | liked={String(liked)}
        </Typography>
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Comments postId={id} />
        </Collapse>
      </CardContent>
    </Card>
  );
}; 