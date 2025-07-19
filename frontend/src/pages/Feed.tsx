import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { fetchPosts, likePost } from '../features/posts/postsSlice';
import { fetchComments } from '../features/comments/commentsSlice';
import { PostCard } from '../components/PostCard';
import { PostCreate } from '../components/PostCreate';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import type { User } from '../utils/interfaces/user';
import type { UnknownAction } from '@reduxjs/toolkit';

export const Feed = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth) as { user: User | null };
  const page = useRef(1);
  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts(page.current) as unknown as UnknownAction);
    // eslint-disable-next-line
  }, []);

  const handleLike = useCallback((postId: string) => {
    dispatch(likePost(postId) as unknown as UnknownAction);
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        dispatch(fetchComments(post.id) as unknown as UnknownAction);
      });
    }
    // eslint-disable-next-line
  }, []); // Only run once on mount

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      !loading
    ) {
      page.current += 1;
      dispatch(fetchPosts(page.current) as unknown as UnknownAction);
    }
  }, [dispatch, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (error) return <Typography color="error" align="center">Error: {error}</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 6 }}>
      <Container maxWidth="sm" disableGutters>
        <PostCreate />
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            mediaUrl={post.mediaUrl}
            mediaType={post.mediaType}
            caption={post.caption}
            likes={post.likes}
            onLike={() => handleLike(post.id)}
            user={post.user}
            timestamp={post.timestamp}
            userObj={user}
          />
        ))}
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Box>
  );
}; 