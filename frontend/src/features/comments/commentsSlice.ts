import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { Comment, AddCommentRequest, AddCommentResponse } from '../../utils/interfaces/comment';

interface CommentsState {
  commentsByPost: { [postId: string]: Comment[] };
  statusByPost: { [postId: string]: 'idle' | 'loading' | 'succeeded' | 'failed' };
  errorByPost: { [postId: string]: string | null };
}

const initialState: CommentsState = {
  commentsByPost: {},
  statusByPost: {},
  errorByPost: {},
};

export const fetchComments = createAsyncThunk('comments/fetchComments', async (data: { postId: string; shaadiId: string }) => {
  const { postId, shaadiId } = data;
  const comments = await api.getComments(postId, shaadiId);
  // Map _id to id for each comment
  return { postId, comments: comments.map((c: any) => ({ ...c, id: c._id || c.id })) };
});

export const addComment = createAsyncThunk('comments/addComment', async (data: { postId: string; shaadiId: string; text: string }) => {
  const { postId, shaadiId, text } = data;
  const comment = await api.addComment(postId, shaadiId, text);
  return { postId, comment: { ...comment, id: comment._id || comment.id } };
});

export const deleteComment = createAsyncThunk('comments/deleteComment', async (data: { id: string; postId: string }) => {
  await api.deleteComment(data.id);
  return { id: data.id, postId: data.postId };
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg.postId;
        state.statusByPost[postId] = 'loading';
        state.errorByPost[postId] = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.statusByPost[postId] = 'succeeded';
        state.commentsByPost[postId] = comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const postId = action.meta.arg.postId;
        state.statusByPost[postId] = 'failed';
        state.errorByPost[postId] = action.error.message || 'Failed to fetch comments';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.commentsByPost[postId]) {state.commentsByPost[postId] = [];}
        state.commentsByPost[postId].push(comment);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, id } = action.payload;
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId] = state.commentsByPost[postId].filter((c) => c.id !== id);
        }
      });
  },
});

export default commentsSlice.reducer; 