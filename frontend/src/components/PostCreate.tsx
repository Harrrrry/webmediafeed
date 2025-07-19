import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../features/posts/postsSlice';
import { CardContent, Button, TextField, Typography, Box, Avatar, Stack, IconButton, Tooltip } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { styled, useTheme } from 'styled-components';

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

export const PostCreate = () => {
  const dispatch = useDispatch();
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('');
  const [caption, setCaption] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMedia(file);
    setMediaType(file.type.startsWith('image') ? 'image' : 'video');
    setMediaUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media || !mediaType) return;
    dispatch(createPost({ mediaUrl, mediaType, caption }) as any);
    setMedia(null);
    setMediaUrl('');
    setMediaType('');
    setCaption('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Box className="glass-card" sx={{ mb: { xs: 3, sm: 4 }, maxWidth: 500, mx: 'auto', p: { xs: 2, sm: 3 }, position: 'relative', top: -40, zIndex: 2, border: theme.colors.cardBorder, boxShadow: theme.shadows.card, borderRadius: theme.radii.card }}>
      <CardContent sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: theme.colors.accent, width: 44, height: 44, fontWeight: 700 }}>U</Avatar>
          <Typography variant="h6" fontWeight={700} color={theme.colors.text}>Create Post</Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit}>
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
          {mediaUrl && (
            <Box mb={2}>
              {mediaType === 'image' ? (
                <img src={mediaUrl} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: theme.radii.card }} />
              ) : (
                <video src={mediaUrl} controls style={{ width: '100%', maxHeight: 300, borderRadius: theme.radii.card }} />
              )}
            </Box>
          )}
          <TextField
            label="Write a caption..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: theme.radii.button, backdropFilter: `blur(${theme.glass.blur})`, p: 1 }}
          />
          <GradientButton
            type="submit"
            fullWidth
            size="large"
            disabled={!media || !mediaType}
            sx={{ fontWeight: 700, fontSize: '1.1rem', borderRadius: theme.radii.button, mt: 1 }}
          >
            Post
          </GradientButton>
        </Box>
      </CardContent>
    </Box>
  );
}; 