import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addComment, deleteComment } from '../../features/comments/commentsSlice';
import type { RootState } from '../../app/store';

export const useComments = (postId: string) => {
  const dispatch = useDispatch();
  const { currentShaadi } = useSelector((state: RootState) => state.shaadi);
  const comments = useSelector((state: RootState) => state.comments.commentsByPost[postId] || []);
  const status = useSelector((state: RootState) => state.comments.statusByPost[postId] || 'idle');
  const error = useSelector((state: RootState) => state.comments.errorByPost[postId] || null);
  const [text, setText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentShaadi?._id) {return;}
    dispatch(addComment({ postId, shaadiId: currentShaadi._id, text }) as any);
    setText('');
  };

  const handleDelete = (id: string) => {
    dispatch(deleteComment({ postId, id }) as any);
  };

  return {
    comments, status, error, text, setText, handleAdd, handleDelete
  };
}; 