import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../features/posts/postsSlice';
import { Card, CardContent, Button, TextField, Typography, Box, Avatar, Stack } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export const PostCreate = () => {
  const dispatch = useDispatch();
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('');
  const [caption, setCaption] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMedia(file);
    setMediaType(file.type.startsWith('image') ? 'image' : 'video');
    setMediaUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media || !mediaType) return;
    // TODO: Upload to backend/media service, get URL
    // For now, use local preview URL as placeholder
    dispatch(createPost({ mediaUrl, mediaType, caption }) as any);
    setMedia(null);
    setMediaUrl('');
    setMediaType('');
    setCaption('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 6, maxWidth: 500, mx: 'auto', p: 2, position: 'relative', top: -40, zIndex: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>U</Avatar>
          <Typography variant="h6" fontWeight={600}>Create Post</Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<AddPhotoAlternateIcon />}
            sx={{ mb: 2, borderStyle: 'dashed', borderRadius: 2 }}
          >
            {media ? 'Change Image/Video' : 'Upload Image/Video'}
            <input
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={handleFileChange}
              ref={inputRef}
            />
          </Button>
          {mediaUrl && (
            <Box mb={2}>
              {mediaType === 'image' ? (
                <img src={mediaUrl} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12 }} />
              ) : (
                <video src={mediaUrl} controls style={{ width: '100%', maxHeight: 300, borderRadius: 12 }} />
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
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!media || !mediaType}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}; 