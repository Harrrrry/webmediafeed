import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { Post, CreatePostRequest, CreatePostResponse } from '../../utils/interfaces/post';

interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (page: number = 1) => {
  const posts = await api.getPosts(page);
  // Map _id to id for each post
  return posts.map((p: any) => ({ ...p, id: p._id || p.id, user: p.userId || p.user, timestamp: p.createdAt || p.timestamp }));
});

export const createPost = createAsyncThunk('posts/createPost', async (data: { mediaUrl: string; mediaType: string; caption?: string }) => {
  const post = await api.createPost(data);
  return { ...post, id: post._id || post.id, user: post.userId || post.user, timestamp: post.createdAt || post.timestamp };
});

export const likePost = createAsyncThunk('posts/likePost', async (id: string) => {
  const post = await api.likePost(id);
  return { ...post, id: post._id || post.id, user: post.userId || post.user, timestamp: post.createdAt || post.timestamp };
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
    setStatus(state, action: PayloadAction<PostsState['status']>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // If page is 1, replace; otherwise, append
        if (action.meta.arg === 1) {
          state.posts = action.payload;
        } else {
          state.posts = [...state.posts, ...action.payload];
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.posts.findIndex((p) => p.id === updated.id);
        if (idx !== -1) state.posts[idx] = updated;
      });
  },
});

export const { setPosts, addPost, setStatus, setError } = postsSlice.actions;
export default postsSlice.reducer; 