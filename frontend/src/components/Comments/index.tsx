import { Typography, Box, CircularProgress, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { CommentsContainer } from './Comments.styled';
import { useComments } from './useComments';

interface CommentsProps {
  postId: string;
}

const Comments = ({ postId }: CommentsProps) => {
  const { comments, status, error, text, setText, handleAdd, handleDelete } = useComments(postId);
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <CommentsContainer>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>Comments</Typography>
      {status === 'loading' && <CircularProgress size={24} />}
      {error && <Typography color="error">{error}</Typography>}
      {comments.length === 0 && status === 'succeeded' && (
        <Typography color="text.secondary">No comments yet.</Typography>
      )}
      {comments.map((comment: any) => (
        <Box key={comment.id} display="flex" alignItems="center" mb={1}>
          <Typography variant="body2" sx={{ flex: 1 }}>{comment.text}</Typography>
          {user && comment.userId === user.id && (
            <IconButton size="small" onClick={() => handleDelete(comment.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
      {token && (
        <Box component="form" onSubmit={handleAdd} mt={2} display="flex" gap={1}>
          <TextField
            value={text}
            onChange={e => setText(e.target.value)}
            size="small"
            placeholder="Add a comment..."
            fullWidth
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary" disabled={!text.trim()}>Post</Button>
        </Box>
      )}
    </CommentsContainer>
  );
};

export default Comments; 