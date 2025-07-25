import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchComments } from '../../features/comments/commentsSlice';
import type { UnknownAction } from '@reduxjs/toolkit';

interface UsePostCardProps {
  id: string;
  likes: string[] | number;
  userObj: any;
  commentCount: number;
  onLike: () => void;
}

export const usePostCard = ({ id, likes, userObj, commentCount, onLike }: UsePostCardProps) => {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const heartRef = useRef<SVGSVGElement>(null);

  const likeCount = Array.isArray(likes) ? likes.length : likes;
  const liked = Array.isArray(likes) && userObj ? likes.includes(userObj.id) : false;

  const backendBaseUrl = 'http://localhost:5000'; // Update for production

  const getMediaSrc = useCallback((mediaUrl: string) => {
    if (mediaUrl.startsWith('/uploads')) {
      return backendBaseUrl + mediaUrl;
    }
    return mediaUrl;
  }, []);

  useEffect(() => {
    if (showComments && commentCount > 0) {
      dispatch(fetchComments(id) as unknown as UnknownAction);
    }
  }, [showComments, commentCount, dispatch, id]);

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

  const handleLike = useCallback(() => {
    setAnimate(true);
    onLike();
  }, [onLike]);

  const handleToggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  return {
    likeCount,
    liked,
    animate,
    showComments,
    heartRef,
    getMediaSrc,
    handleLike,
    handleToggleComments,
  };
}; 