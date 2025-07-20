import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useRef } from 'react';
import { createPost } from '../../features/posts/postsSlice';
import axios from 'axios';

export const useCreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('');
  const [caption, setCaption] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {return;}
    setMedia(file);
    setMediaType(file.type.startsWith('image') ? 'image' : 'video');
    setMediaUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media) {return;}
    const formData = new FormData();
    formData.append('file', media);
    formData.append('caption', caption);
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    try {
      const res = await axios.post('http://localhost:5000/media/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });
      const { url } = res.data;
      dispatch(createPost({ mediaUrl: url, mediaType, caption }) as any);
      navigate('/');
    } catch (err) {
      setUploadError('Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return {
    media, mediaUrl, mediaType, caption, inputRef, uploading, uploadProgress, uploadError,
    setCaption, handleFileChange, handleUploadClick, handleSubmit, handleBack
  };
}; 