import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, Alert, IconButton, Dialog, Slider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';
import { api } from '../../services/api';

const ShaadiCreateForm: React.FC<{ onSuccess: (shaadi: any) => void }> = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    brideName: '',
    groomName: '',
    date: '',
    location: '',
    image: undefined as File | undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cropping state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setPendingFile(file);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !pendingFile) return;
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], pendingFile.name, { type: 'image/jpeg' });
      setForm(f => ({ ...f, image: croppedFile }));
      setImagePreview(URL.createObjectURL(croppedBlob));
      setCropModalOpen(false);
      setCropImageSrc(null);
      setPendingFile(null);
    } catch (err) {
      setError('Failed to crop image');
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCropImageSrc(null);
    setPendingFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const shaadi = await api.createShaadi(form);
      setLoading(false);
      onSuccess(shaadi);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to create shaadi');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} maxWidth={400} mx="auto" p={3} borderRadius={3} bgcolor="transparent">
      <Typography variant="h5" fontWeight={700} mb={2}>Create Shaadi</Typography>
      <Stack spacing={2}>
        <TextField
          label="Wedding Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FavoriteIcon sx={{ color: 'rgba(233,30,99,0.6)', mr: 1 }} />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Bride Name"
          name="brideName"
          value={form.brideName}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FemaleIcon sx={{ color: 'rgba(233,30,99,0.6)', mr: 1 }} />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Groom Name"
          name="groomName"
          value={form.groomName}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MaleIcon sx={{ color: 'rgba(33,150,243,0.6)', mr: 1 }} />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EventIcon sx={{ color: 'rgba(156,39,176,0.6)', mr: 1 }} />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: 'rgba(76,175,80,0.6)', mr: 1 }} />
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textAlign: 'left',
            pl: 1,
            pr: 2,
            py: 1.5,
            minHeight: 56,
            borderRadius: 2,
            fontWeight: 500,
            fontSize: '1rem',
            gap: 2
          }}
        >
          {imagePreview && (
            <Box
              component="span"
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #e0e0e0',
                boxShadow: 1,
                background: '#fff',
                mr: 2
              }}
            >
              <img
                src={imagePreview}
                alt="shaadi preview"
                style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%' }}
              />
            </Box>
          )}
          {imagePreview ? 'Change Image' : 'Upload Image'}
          <input type="file" name="image" accept="image/*" hidden onChange={handleChange} />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ fontWeight: 700, fontSize: '1.1rem', borderRadius: 2, mb: 10 }}
        >
          {loading ? 'Creating...' : 'Create Shaadi'}
        </Button>
        {error && (
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}
      </Stack>

      {/* Image Cropping Dialog */}
      <Dialog open={cropModalOpen} onClose={handleCropCancel} maxWidth="xs" fullWidth>
        <Box sx={{ position: 'relative', width: '100%', height: 350, bgcolor: '#222' }}>
          {cropImageSrc && (
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
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
    </Box>
  );
};

export default ShaadiCreateForm; 