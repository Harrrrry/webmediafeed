import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { fetchPosts, likePost, clearPosts } from '../features/posts/postsSlice';
import PostCard from '../components/PostCard';
import CompactCreatePost from '../components/CompactCreatePost';
import { Container, Box, Typography, CircularProgress, Button, Paper, Alert } from '@mui/material';
import type { User } from '../utils/interfaces/user';
import type { UnknownAction } from '@reduxjs/toolkit';
import { subscribeToFeedUpdates, unsubscribeFromFeedUpdates, notifyBannerDismissed } from '../utils/feedUpdates/polling';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export const Feed = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { posts, status, error, hasMore } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth) as { user: User | null };
  const { currentShaadi, currentUserRole, status: shaadiStatus } = useSelector((state: RootState) => state.shaadi);
  const page = useRef(1);
  const loading = status === 'loading';
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  // Clear posts when shaadi changes
  useEffect(() => {
    dispatch(clearPosts());
    page.current = 1;
  }, [currentShaadi?._id, dispatch]);

  useEffect((): void => {
    if (currentShaadi?._id && currentShaadi._id !== '') {
      dispatch(fetchPosts({ shaadiId: currentShaadi._id, page: page.current }) as unknown as UnknownAction);
    }
    // eslint-disable-next-line
  }, [currentShaadi?._id]);

  const handleLike = useCallback((postId: string): void => {
    if (currentShaadi?._id && currentShaadi._id !== '') {
      dispatch(likePost({ id: postId, shaadiId: currentShaadi._id }) as unknown as UnknownAction);
    }
  }, [dispatch, currentShaadi?._id]);

  // Infinite scroll
  const handleScroll = useCallback((): void => {
    if (
      currentShaadi?._id && currentShaadi._id !== '' &&
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      !loading && hasMore
    ) {
      page.current += 1;
      dispatch(fetchPosts({ shaadiId: currentShaadi._id, page: page.current }) as unknown as UnknownAction);
    }
  }, [dispatch, loading, hasMore, currentShaadi?._id]);

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
    if (currentShaadi?._id && currentShaadi._id !== '') {
      subscribeToFeedUpdates(getFeedPostIds, handleNewPosts, 10000, currentShaadi._id);
    }
    return () => { unsubscribeFromFeedUpdates(); };
  }, [currentShaadi?._id]);

  const handleShowNewPosts = async (): Promise<void> => {
    if (currentShaadi?._id && currentShaadi._id !== '') {
      // Fetch the latest posts and prepend them
      page.current = 1;
      await dispatch(fetchPosts({ shaadiId: currentShaadi._id, page: 1 }) as unknown as UnknownAction);
      setNewPostsAvailable(false);
      notifyBannerDismissed(() => posts.map((p) => p.id));
    }
  };

  // Show loading when Shaadi data is being fetched
  if (shaadiStatus === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pt: 3, pb: 6 }}>
        <Container maxWidth="sm" disableGutters>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading your Shaadis...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!currentShaadi) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pt: 3, pb: 6 }}>
        <Container maxWidth="sm" disableGutters>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
            <EventAvailableIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} color="text.primary" mb={2}>
              Select a Shaadi to Continue
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Choose a Shaadi from the switcher above to view posts, create content, and connect with other members.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Use the Shaadi switcher in the header to select or create a Shaadi.
            </Alert>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error != null && error !== '') {
    return <Typography color="error" align="center">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pt: 3, pb: 6 }}>
      <Container maxWidth="sm" disableGutters>
        <CompactCreatePost />
        {newPostsAvailable && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleShowNewPosts} sx={{ borderRadius: 99, fontWeight: 700 }}>
              New posts available - Click to refresh
            </Button>
          </Box>
        )}
        {posts.map((post) => (
          <Box key={post.id} mb={1}>
            <PostCard
              id={post.id}
              mediaUrls={post.mediaUrls || []}
              mediaTypes={post.mediaTypes || []}
              caption={post.caption}
              likes={post.likes}
              onLike={() => handleLike(post.id)}
              user={post.user}
              timestamp={post.timestamp}
              userObj={user}
              commentCount={post.commentCount}
              tags={post.tags || []}
            />
          </Box>
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