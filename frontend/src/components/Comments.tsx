import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, deleteComment } from '../features/comments/commentsSlice';
import type { RootState } from '../app/store';
import { Box, Typography, CircularProgress, TextField, Button, IconButton, Stack, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface CommentsProps {
  postId: string;
}

export const Comments = ({ postId }: CommentsProps) => {
  const dispatch = useDispatch();
  const comments = useSelector((state: RootState) => state.comments.commentsByPost[postId] || []);
  const status = useSelector((state: RootState) => state.comments.statusByPost[postId] || 'idle');
  const error = useSelector((state: RootState) => state.comments.errorByPost[postId] || null);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [text, setText] = useState('');

  // Remove useEffect from Comments.tsx. Comments will be fetched on demand from PostCard.

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(addComment({ postId, text }) as any);
    setText('');
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>Comments</Typography>
      {status === 'loading' && <CircularProgress size={24} />}
      {error && <Typography color="error">{error}</Typography>}
      {comments.length === 0 && status === 'succeeded' && (
        <Typography color="text.secondary">No comments yet.</Typography>
      )}
      <Stack spacing={2} mb={2}>
        {comments.map((c) => (
          <Box key={c.id} display="flex" alignItems="flex-start" gap={1}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>{c.userId?.[0]?.toUpperCase() || 'U'}</Avatar>
            <Box flex={1}>
              <Typography variant="body2" fontWeight={500}>{c.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(c.createdAt).toLocaleString()}
              </Typography>
            </Box>
            {user && c.userId === user.id && (
              <IconButton size="small" onClick={() => dispatch(deleteComment({ postId, id: c.id }) as any)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Stack>
      {token && (
        <Box component="form" onSubmit={handleAdd} display="flex" gap={1}>
          <TextField
            value={text}
            onChange={e => setText(e.target.value)}
            size="small"
            placeholder="Add a comment..."
            fullWidth
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={!text.trim()} sx={{ borderRadius: 2 }}>
            Post
          </Button>
        </Box>
      )}
    </Box>
  );
}; 