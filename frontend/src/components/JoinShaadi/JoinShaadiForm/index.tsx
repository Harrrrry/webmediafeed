import React from 'react';
import { 
  TextField, 
  Button, 
  Alert, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Switch 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useJoinShaadiForm } from './useJoinShaadiForm';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

const SIDE_OPTIONS = [
  { value: 'groom', label: 'Groom Side', icon: <MaleIcon /> },
  { value: 'bride', label: 'Bride Side', icon: <FemaleIcon /> },
];

const RELATIONSHIP_OPTIONS = [
  'Friend', 'Cousin', 'Uncle', 'Aunt', 'Brother', 'Sister', 'Colleague', 'Other'
];

interface JoinShaadiFormProps {
  inviteCode: string;
  onSuccess?: () => void;
}

export const JoinShaadiForm = ({ inviteCode, onSuccess }: JoinShaadiFormProps) => {
  const navigate = useNavigate();
  
  const {
    form,
    errors,
    loading,
    handleChange,
    handleToggleShowContact,
    handleSubmit,
    validateForm,
    isFormValid
  } = useJoinShaadiForm({ inviteCode, onSuccess });

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
        Join Wedding Celebration
      </Typography>
      
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Please provide your details to join the wedding celebration
      </Typography>

      <TextField
        label="Your Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.name}
        helperText={errors.name}
        autoFocus
        InputProps={{
          startAdornment: (
            <PersonIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
          )
        }}
      />

      <TextField
        label="Email Address"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email}
        InputProps={{
          startAdornment: (
            <EmailIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
          )
        }}
      />

      <TextField
        label="Phone Number"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.phone}
        helperText={errors.phone}
        InputProps={{
          startAdornment: (
            <PhoneIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
          )
        }}
      />

      <Box mt={2} mb={2} display="flex" alignItems="center" justifyContent="center">
        {SIDE_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            variant={form.side === opt.value ? 'contained' : 'outlined'}
            color={form.side === opt.value ? 'primary' : 'inherit'}
            onClick={() => handleChange({ target: { name: 'side', value: opt.value } })}
            startIcon={opt.icon}
            sx={{ mx: 1, minWidth: 80 }}
          >
            {opt.label}
          </Button>
        ))}
      </Box>

      <FormControl fullWidth margin="normal" required error={!!errors.relationship}>
        <InputLabel id="relationship-label">Relationship</InputLabel>
        <Select
          labelId="relationship-label"
          name="relationship"
          value={form.relationship}
          onChange={handleChange}
          label="Relationship"
        >
          {RELATIONSHIP_OPTIONS.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={form.showContact}
            onChange={handleToggleShowContact}
            color="primary"
          />
        }
        label="Allow others to see my contact number"
        sx={{ mb: 2, mt: 1 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2, mb: 1 }}
        disabled={loading || !isFormValid()}
      >
        {loading ? 'Joining...' : 'Shaadi me Swagat Hai 💖'}
      </Button>

      {errors.submit && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.submit}
        </Alert>
      )}
    </form>
  );
};

export default JoinShaadiForm; 