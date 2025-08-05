import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

interface InvitationCardProps {
  shaadi: any;
  cardRef: React.RefObject<HTMLDivElement | null>;
  sharingCard: boolean;
  onShareCard: () => void;
  creatorCode: string;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  shaadi,
  cardRef,
  sharingCard,
  onShareCard,
  creatorCode
}) => {
  return (
    <>
      {/* Invitation Card */}
      <Paper ref={cardRef} elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {shaadi.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {shaadi.brideName} & {shaadi.groomName}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          📅 {new Date(shaadi.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📍 {shaadi.location}
        </Typography>
      </Paper>

      {/* Share Card Button */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<ShareIcon />}
        onClick={onShareCard}
        disabled={sharingCard}
        sx={{ mb: 2 }}
      >
        {sharingCard ? 'Creating Image...' : 'Share Invitation Card'}
      </Button>

      {/* Creator Code */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Your Creator Code:
        </Typography>
        <Typography variant="h6" fontWeight={700} color="primary">
          {creatorCode}
        </Typography>
      </Paper>
    </>
  );
};

export default InvitationCard; 