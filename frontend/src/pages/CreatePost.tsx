import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../features/posts/postsSlice';
import { CardContent, Button, TextField, Typography, Box, Avatar, Stack, IconButton, Tooltip, Container } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled, useTheme } from 'styled-components';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';

const CreatePostContainer = styled(Box)`
  background: ${({ theme }) => theme.glass.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  padding: 2rem;
  margin: 1rem auto;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const GradientButton = styled(Button)`
  background: ${({ theme }) => theme.colors.accentGradient};
  color: #fff;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radii.button};
  box-shadow: ${({ theme }) => theme.shadows.button};
  transition: background 0.3s, box-shadow 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(90deg, #fbc2eb 0%, #7f5af0 100%);
    box-shadow: 0 4px 16px 0 #a18cd1;
    transform: translateY(-2px) scale(1.03);
  }
`;

const LargeIconButton = styled(IconButton)`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 1.5rem;
  background: transparent;
  box-shadow: none;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.accent};
  margin-right: ${({ theme }) => theme.spacing.sm};
  transition: color 0.2s, transform 0.1s;
  &:hover, &:focus {
    background: transparent;
    color: ${({ theme }) => theme.colors.accent};
    box-shadow: none;
  }
  &:active {
    background: transparent;
    color: ${({ theme }) => theme.colors.accent};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('');
  const [caption, setCaption] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Debug: Log user data
  console.log('CreatePost - User data:', user);

  // Get username safely
  const getUsername = () => {
    if (!user) {return 'U';}
    if (typeof user === 'string') {return (user as string)[0]?.toUpperCase() || 'U';}
    return user.username?.[0]?.toUpperCase() || 'U';
  };

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

  return (
    <Container maxWidth="sm" sx={{ pt: 8, pb: 6 }}>
      <CreatePostContainer>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <IconButton onClick={handleBack} sx={{ color: theme.colors.text }}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ 
              bgcolor: theme.colors.accent, 
              width: 44, 
              height: 44, 
              fontWeight: 700,
              background: theme.colors.accentGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              lineHeight: 1,
              textAlign: 'center',
              padding: 0,
              margin: 0
            }}>
              {user?.profilePicUrl ? (
                <img 
                  src={user.profilePicUrl} 
                  alt={user.username || 'User'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                getUsername()
              )}
            </Avatar>
            <Typography variant="h6" fontWeight={700} color={theme.colors.text}>
              Create Post
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Media Upload */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Tooltip title="Upload Image/Video">
                <LargeIconButton onClick={handleUploadClick} tabIndex={0} aria-label="Upload image or video">
                  <AddPhotoAlternateIcon fontSize="inherit" />
                </LargeIconButton>
              </Tooltip>
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={handleFileChange}
                ref={inputRef}
                aria-label="Upload image or video"
              />
              <Tooltip title="Add Emoji">
                <LargeIconButton tabIndex={0} aria-label="Add emoji">
                  <EmojiEmotionsIcon fontSize="inherit" />
                </LargeIconButton>
              </Tooltip>
              <Box flex={1} />
            </Stack>

            {/* Media Preview */}
            {mediaUrl && (
              <Box mb={2}>
                {mediaType === 'image' ? (
                  <img src={mediaUrl} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: theme.radii.card }} />
                ) : (
                  <video src={mediaUrl} controls style={{ width: '100%', maxHeight: 300, borderRadius: theme.radii.card }} />
                )}
              </Box>
            )}

            {/* Caption Input */}
            <TextField
              label="Write a caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: theme.radii.button, backdropFilter: `blur(${theme.glass.blur})`, p: 1 }}
            />

            {/* Upload Progress */}
            {uploading && (
              <Box mb={2}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary">Uploading: {uploadProgress}%</Typography>
              </Box>
            )}

            {/* Error Message */}
            {uploadError && (
              <Typography color="error" variant="caption" sx={{ mb: 2, display: 'block' }}>
                {uploadError}
              </Typography>
            )}

            {/* Submit Button */}
            <GradientButton
              type="submit"
              fullWidth
              size="large"
              disabled={!media || !mediaType || uploading}
              sx={{ fontWeight: 700, fontSize: '1.1rem', borderRadius: theme.radii.button, mt: 1 }}
            >
              {uploading ? 'Uploading...' : 'Share Shaadi Moment'}
            </GradientButton>
          </Box>
        </CardContent>
      </CreatePostContainer>
    </Container>
  );
}; 