import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../features/posts/postsSlice';
import { CardContent, Button, TextField, Typography, Box, Stack, IconButton, Tooltip, Container } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled, useTheme } from 'styled-components';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import { UI_STRINGS } from '../utils/interfaces/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import imageCompression from 'browser-image-compression';
import * as ffmpegModule from '@ffmpeg/ffmpeg';
import Dialog from '@mui/material/Dialog';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from '../utils/cropImage';
import UserAvatar from '../components/common/UserAvatar';

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

const DEFAULT_TAGS = [
  'general',
  'haldi',
  'mehndi',
  'shadi',
  'reception',
];

export const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentShaadi } = useSelector((state: RootState) => state.shaadi);
  const [media, setMedia] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const MAX_VIDEO_SIZE_MB = 30;
  const MAX_VIDEO_DURATION_SEC = 60;
  const ffmpeg = useRef<any>(null);
  const [compressingVideo, setCompressingVideo] = useState(false);
  // Cropping modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [aspect, setAspect] = useState(1); // Default 1:1, extensible
  const [imageQueue, setImageQueue] = useState<File[]>([]); // For multi-image cropping

  // Redirect if no Shaadi is selected
  useEffect(() => {
    if (!currentShaadi) {
      navigate('/', { replace: true });
    }
  }, [currentShaadi, navigate]);

  // Debug: Log user data
  console.log('CreatePost - User data:', user);

  // Get username safely
  const getUsername = () => {
    if (!user) {return 'U';}
    if (typeof user === 'string') {return (user as string)[0]?.toUpperCase() || 'U';}
    return user.username?.[0]?.toUpperCase() || 'U';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let videoError = '';
    const imageFiles: File[] = [];
    for (const file of files) {
      if (file.type.startsWith('image')) {
        imageFiles.push(file);
      } else if (file.type.startsWith('video')) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          videoError = `Video file size exceeds ${MAX_VIDEO_SIZE_MB}MB.`;
          continue;
        }
        // Check duration
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
        await new Promise<void>(async (resolve) => {
          video.onloadedmetadata = async () => {
            URL.revokeObjectURL(url);
            if (video.duration > MAX_VIDEO_DURATION_SEC) {
              videoError = `Video duration exceeds ${MAX_VIDEO_DURATION_SEC} seconds.`;
              resolve();
              return;
            }
            // Only compress if <20MB and <30s
            if (file.size < 20 * 1024 * 1024 && video.duration < 30) {
              setCompressingVideo(true);
              // Dynamic import of ffmpeg.wasm
              const ffmpegModuleDynamic = await import('@ffmpeg/ffmpeg');
              const ffmpegExport = (ffmpegModuleDynamic as any).default || ffmpegModuleDynamic;
              const createFFmpeg = ffmpegExport.createFFmpeg;
              const fetchFile = ffmpegExport.fetchFile;
              if (!ffmpeg.current) {
                ffmpeg.current = createFFmpeg({ log: false });
                await ffmpeg.current.load();
              }
              const inputName = 'input.mp4';
              const outputName = 'output.mp4';
              ffmpeg.current.FS('writeFile', inputName, await fetchFile(file));
              await ffmpeg.current.run('-i', inputName, '-vcodec', 'libx264', '-crf', '28', '-preset', 'veryfast', outputName);
              const data = ffmpeg.current.FS('readFile', outputName);
              const compressed = new File([data.buffer], file.name.replace(/\.[^/.]+$/, '.mp4'), { type: 'video/mp4' });
              const newMedia = [...media, compressed];
              setMedia(newMedia);
              setMediaUrls(newMedia.map(file => URL.createObjectURL(file)));
              setMediaTypes(newMedia.map(file => file.type.startsWith('image') ? 'image' : 'video'));
              setCompressingVideo(false);
            } else {
              const newMedia = [...media, file]; // skip compression for larger videos
              setMedia(newMedia);
              setMediaUrls(newMedia.map(file => URL.createObjectURL(file)));
              setMediaTypes(newMedia.map(file => file.type.startsWith('image') ? 'image' : 'video'));
            }
            resolve();
          };
        });
      } else {
        const newMedia = [...media, file];
        setMedia(newMedia);
        setMediaUrls(newMedia.map(file => URL.createObjectURL(file)));
        setMediaTypes(newMedia.map(file => file.type.startsWith('image') ? 'image' : 'video'));
      }
    }
    if (imageFiles.length > 0) {
      // Start cropping the first image, queue the rest
      const [first, ...rest] = imageFiles;
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setPendingFile(first);
        setCropModalOpen(true);
        setImageQueue(rest);
      };
      reader.readAsDataURL(first);
      return;
    }
    if (videoError) {
      setUploadError(videoError);
      setCompressingVideo(false);
      return;
    }
  };

  // Cropping modal handlers
  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !pendingFile) return;
    const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], pendingFile.name, { type: pendingFile.type });
    const newMedia = [...media, croppedFile];
    setMedia(newMedia);
    setMediaUrls(newMedia.map(file => URL.createObjectURL(file)));
    setMediaTypes(newMedia.map(file => file.type.startsWith('image') ? 'image' : 'video'));
    // If there are more images in the queue, show next
    if (imageQueue.length > 0) {
      const [next, ...rest] = imageQueue;
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setPendingFile(next);
        setImageQueue(rest);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(next);
    } else {
      setCropModalOpen(false);
      setCropImageSrc(null);
      setPendingFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setImageQueue([]);
    }
  };

  const handleCropCancel = () => {
    // If there are more images in the queue, skip current and show next
    if (imageQueue.length > 0) {
      const [next, ...rest] = imageQueue;
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setPendingFile(next);
        setImageQueue(rest);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(next);
    } else {
      setCropModalOpen(false);
      setCropImageSrc(null);
      setPendingFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setImageQueue([]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = [...media];
    const newMediaUrls = [...mediaUrls];
    const newMediaTypes = [...mediaTypes];
    newMedia.splice(index, 1);
    newMediaUrls.splice(index, 1);
    newMediaTypes.splice(index, 1);
    setMedia(newMedia);
    setMediaUrls(newMediaUrls);
    setMediaTypes(newMediaTypes);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media.length) return;
    
    // Check if a Shaadi is selected
    if (!currentShaadi?._id) {
      setUploadError('Please select a Shaadi first');
      return;
    }
    
    const formData = new FormData();
    media.forEach((file, idx) => {
      formData.append('files', file);
    });
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
      const { urls } = res.data; // Expecting an array of URLs
      dispatch(createPost({ 
        shaadiId: currentShaadi._id,
        mediaUrls: urls, 
        mediaTypes, 
        caption, 
        tags 
      }) as any);
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
      {/* Cropping Modal */}
      <Dialog open={cropModalOpen} onClose={handleCropCancel} maxWidth="xs" fullWidth>
        <Box sx={{ position: 'relative', width: '100%', height: 350, bgcolor: '#222' }}>
          {cropImageSrc && (
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </Box>
        <Box px={3} py={2} display="flex" flexDirection="column" alignItems="center">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            onChange={(_, value) => setZoom(value as number)}
            aria-labelledby="Zoom"
            sx={{ width: '80%', mb: 2 }}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button onClick={handleCropCancel} color="secondary" variant="outlined">Cancel</Button>
            <Button onClick={handleCropConfirm} color="primary" variant="contained">Crop & Add</Button>
          </Stack>
        </Box>
      </Dialog>
      <CreatePostContainer>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <UserAvatar profilePicUrl={user?.profilePicUrl} username={user?.username} size={44} />
            <Typography variant="h6" fontWeight={700} color={theme.colors.text} sx={{ flexShrink: 0 }}>
              Create Post
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Media Upload */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Tooltip title="Upload Images/Videos">
                <LargeIconButton onClick={handleUploadClick} tabIndex={0} aria-label="Upload images or videos">
                  <AddPhotoAlternateIcon fontSize="inherit" />
                </LargeIconButton>
              </Tooltip>
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                multiple
                onChange={handleFileChange}
                ref={inputRef}
                aria-label="Upload images or videos"
              />
              <Tooltip title="Add Emoji">
                <LargeIconButton tabIndex={0} aria-label="Add emoji">
                  <EmojiEmotionsIcon fontSize="inherit" />
                </LargeIconButton>
              </Tooltip>
              <Box flex={1} />
            </Stack>

            {/* Media Previews Grid */}
            {mediaUrls.length > 0 && (
              <Box mb={2} display="grid" gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={2}>
                {mediaUrls.map((url, idx) => (
                  <Box key={url} position="relative">
                    {mediaTypes[idx] === 'image' ? (
                      <img src={url} alt={`preview-${idx}`} style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: theme.radii.card }} />
                    ) : (
                      <video src={url} controls style={{ width: '100%', maxHeight: 120, borderRadius: theme.radii.card }} />
                    )}
                    <IconButton size="small" onClick={() => handleRemoveMedia(idx)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.7)' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* Caption Input */}
            <TextField
              label={UI_STRINGS.shareShaadiMoment}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              sx={{
                mb: 2,
                bgcolor: 'rgba(255,255,255,0.5)',
                borderRadius: theme.radii.button,
                backdropFilter: `blur(${theme.glass.blur})`,
                p: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.colors.accent,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.colors.accent,
                    boxShadow: '0 0 0 2px #e0e7ff',
                  },
                },
              }}
            />

            {/* Tag Selection Section */}
            <Box mb={2}>
              <Autocomplete
                multiple
                options={DEFAULT_TAGS}
                value={tags}
                onChange={(_, newValue) => setTags(newValue)}
                freeSolo
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <span {...getTagProps({ index })}>{option}</span>
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Add tags (e.g., haldi, shadi)"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: theme.colors.accent,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.colors.accent,
                          boxShadow: '0 0 0 2px #e0e7ff',
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Upload Progress */}
            {uploading && (
              <Box mb={2}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary">Uploading: {uploadProgress}%</Typography>
              </Box>
            )}
            {compressingVideo && (
              <Box mb={2}><LinearProgress /><Typography variant="caption">Compressing video...</Typography></Box>
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
              disabled={!media.length || uploading}
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