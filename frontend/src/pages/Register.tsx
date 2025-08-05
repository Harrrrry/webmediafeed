import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/users/authSlice';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, MenuItem, Avatar, IconButton, Stack } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Cropper from 'react-easy-crop';
import Dialog from '@mui/material/Dialog';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from '../utils/cropImage';
import type { UserRegisterRequest } from '../utils/interfaces/user';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PersonIcon from '@mui/icons-material/Person';
import { api } from '../services/api';
import Footer from '../components/common/Footer';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import AppHeader from '../components/common/AppHeader';
import UserAvatar from '../components/common/UserAvatar';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male', icon: <MaleIcon /> },
  { value: 'female', label: 'Female', icon: <FemaleIcon /> },
  { value: 'other', label: 'Other', icon: <PersonIcon /> },
];

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState<UserRegisterRequest>({
    username: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    profilePicUrl: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // New state for uniqueness checks
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
  const [emailAvailable, setEmailAvailable] = useState<null | boolean>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  useEffect(() => {
    if (token) {navigate('/');}
  }, [token, navigate]);

  const checkUsername = async () => {
    if (!form.username.trim()) return;
    setCheckingUsername(true);
    try {
      const res = await api.checkUsername(form.username.trim());
      setUsernameAvailable(res.available);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };
  const checkEmail = async () => {
    if (!form.email.trim()) return;
    setCheckingEmail(true);
    try {
      const res = await api.checkEmail(form.email.trim());
      setEmailAvailable(res.available);
    } catch {
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const validate = () => {
    if (!form.username.trim()) return 'Username is required';
    if (usernameAvailable === false) return 'Username is already taken';
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Valid email is required';
    if (emailAvailable === false) return 'Email is already taken';
    if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.gender && !['male', 'female', 'other'].includes(form.gender)) return 'Gender must be male, female, or other';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    const err = validate();
    if (err) { setFormError(err); return; }
    const result = await dispatch(register(form) as any);
    if (result.meta.requestStatus === 'fulfilled') {
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  // Profile pic cropper handlers
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setPendingFile(file);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };
  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCropConfirm = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !pendingFile) return;
    const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
    // Upload the cropped image to the backend
    const file = new File([croppedBlob], pendingFile.name || 'profile.jpg', { type: croppedBlob.type });
    try {
      const res = await api.uploadProfileImage(file);
      setForm(f => ({ ...f, profilePicUrl: res.url }));
    } catch (err) {
      setFormError('Failed to upload profile image');
    }
    setCropModalOpen(false);
    setCropImageSrc(null);
    setPendingFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };
  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCropImageSrc(null);
    setPendingFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Header with app name */}
      <AppHeader />
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
      <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box width="100%" maxWidth={400} px={2} mx="auto">
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              value={form.username}
              onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setUsernameAvailable(null); }}
              onBlur={checkUsername}
              fullWidth
              margin="normal"
              autoFocus
              autoComplete="username"
              helperText={
                checkingUsername ? 'Checking availability...' :
                usernameAvailable === false ? 'Username is already taken' :
                usernameAvailable === true ? 'Username is available' : ''
              }
              error={usernameAvailable === false}
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                )
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setEmailAvailable(null); }}
              onBlur={checkEmail}
              fullWidth
              margin="normal"
              autoComplete="email"
              helperText={
                checkingEmail ? 'Checking availability...' :
                emailAvailable === false ? 'Email is already taken' :
                emailAvailable === true ? 'Email is available' : ''
              }
              error={emailAvailable === false}
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                )
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              fullWidth
              margin="normal"
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                )
              }}
            />
            <TextField
              label="Phone (optional)"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              fullWidth
              margin="normal"
              autoComplete="tel"
              InputProps={{
                startAdornment: (
                  <PhoneIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                )
              }}
            />
            <Box mt={2} mb={2} display="flex" alignItems="center" justifyContent="center">
              {GENDER_OPTIONS.map(opt => (
                <Button
                  key={opt.value}
                  variant={form.gender === opt.value ? 'contained' : 'outlined'}
                  color={form.gender === opt.value ? 'primary' : 'inherit'}
                  onClick={() => setForm(f => ({ ...f, gender: opt.value as 'male' | 'female' | 'other' }))}
                  startIcon={opt.icon}
                  sx={{ mx: 1, minWidth: 80 }}
                >
                  {opt.label}
                </Button>
              ))}
            </Box>
            <Box display="flex" alignItems="center" mt={2} mb={2}>
              <UserAvatar profilePicUrl={form.profilePicUrl} username={form.username} size={56} sx={{ mr: 2 }} />
              <label htmlFor="profile-pic-upload">
                <input
                  accept="image/*"
                  id="profile-pic-upload"
                  type="file"
                  hidden
                  onChange={handleProfilePicChange}
                />
                <IconButton color="primary" component="span" aria-label="Upload profile picture">
                  <PhotoCamera />
                </IconButton>
              </label>
              <Typography variant="body2" color="text.secondary">Profile Picture (1:1 crop)</Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Registering...' : 'Register'}
            </Button>
            {(formError || error) && <Alert severity="error" sx={{ mt: 2 }}>{formError || error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </form>
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" sx={{ color: '#000000' }}>
              Already have an account?{' '}
              <Button
                variant="text"
                sx={{ 
                  color: '#1976d2', 
                  textDecoration: 'none',
                  fontWeight: 400,
                  fontSize: 'inherit',
                  textTransform: 'none',
                  minWidth: 'auto',
                  padding: 0,
                  '&:hover': {
                    color: '#1565c0',
                    backgroundColor: 'transparent',
                    textDecoration: 'none',
                  }
                }}
                onClick={() => navigate('/login')}
              >
                Login here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Footer */}
      <Footer />
    </Box>
  );
}; 