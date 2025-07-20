import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { fetchPosts, likePost } from '../features/posts/postsSlice';
import PostCard from '../components/PostCard';
import PostCreate from '../components/PostCreate';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import type { User } from '../utils/interfaces/user';
import type { UnknownAction } from '@reduxjs/toolkit';
import { subscribeToFeedUpdates, unsubscribeFromFeedUpdates, notifyBannerDismissed } from '../utils/feedUpdates/polling';

export const Feed = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { posts, status, error, hasMore } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth) as { user: User | null };
  const page = useRef(1);
  const loading = status === 'loading';
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  useEffect((): void => {
    dispatch(fetchPosts(page.current) as unknown as UnknownAction);
    // eslint-disable-next-line
  }, []);

  const handleLike = useCallback((postId: string): void => {
    dispatch(likePost(postId) as unknown as UnknownAction);
  }, [dispatch]);

  // Infinite scroll
  const handleScroll = useCallback((): void => {
    if (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      !loading && hasMore
    ) {
      page.current += 1;
      dispatch(fetchPosts(page.current) as unknown as UnknownAction);
    }
  }, [dispatch, loading, hasMore]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => { window.removeEventListener('scroll', handleScroll); };
    }
    return undefined;
  }, [handleScroll]);

  useEffect(() => {
    function getFeedPostIds(): string[] {
      return posts.map((p) => p.id);
    }
    function handleNewPosts(): void {
      setNewPostsAvailable(true);
    }
    subscribeToFeedUpdates(getFeedPostIds, handleNewPosts, 10000);
    return () => { unsubscribeFromFeedUpdates(); };
  }, [posts]);

  const handleShowNewPosts = async (): Promise<void> => {
    // Fetch the latest posts and prepend them
    page.current = 1;
    await dispatch(fetchPosts(1) as unknown as UnknownAction);
    setNewPostsAvailable(false);
    notifyBannerDismissed(() => posts.map((p) => p.id));
  };

  if (error != null && error !== '') {
    return <Typography color="error" align="center">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pt: 12, pb: 6 }}>
      <Container maxWidth="sm" disableGutters>
        <PostCreate />
        {newPostsAvailable && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleShowNewPosts} sx={{ borderRadius: 99, fontWeight: 700 }}>
              New posts available - Click to refresh
            </Button>
          </Box>
        )}
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
            commentCount={post.commentCount}
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