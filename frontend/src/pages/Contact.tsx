import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import ContactDirectory from '../components/ContactDirectory';
import { Box, Typography, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

const ContactPage: React.FC = () => {
  const { currentShaadi } = useSelector((state: RootState) => state.shaadi);

  if (!currentShaadi) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Shaadi Selected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please select a shaadi to view the contact directory.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return <ContactDirectory />;
};

export default ContactPage; 