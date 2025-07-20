import { CardContent, TextField, Typography, Box, Avatar, Stack, Tooltip, Container, IconButton, LinearProgress } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useTheme } from 'styled-components';
import { CreatePostContainer, GradientButton, LargeIconButton } from './CreatePost.styled';
import { useCreatePost } from './useCreatePost';

const CreatePost = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const {
    media, mediaUrl, mediaType, caption, inputRef, uploading, uploadProgress, uploadError,
    setCaption, handleFileChange, handleUploadClick, handleSubmit, handleBack
  } = useCreatePost();

  // Get username safely
  const getUsername = () => {
    if (!user) {return 'U';}
    if (typeof user === 'string') {return (user as string)[0]?.toUpperCase() || 'U';}
    return user.username?.[0]?.toUpperCase() || 'U';
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

export default CreatePost; 