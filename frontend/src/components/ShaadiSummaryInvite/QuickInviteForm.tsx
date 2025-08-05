import React from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';

interface QuickInviteFormProps {
  contact: string;
  setContact: (contact: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const QuickInviteForm: React.FC<QuickInviteFormProps> = ({
  contact,
  setContact,
  loading,
  onSubmit
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quick Invite
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          label="Email or Phone Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Sending...' : 'Send Invite'}
        </Button>
      </form>
    </Paper>
  );
};

export default QuickInviteForm; 