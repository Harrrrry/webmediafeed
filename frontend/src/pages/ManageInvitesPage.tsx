import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { styled } from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';

const PageContainer = styled(Box)`
  min-height: 100vh;
  padding: 1rem;
  max-width: 768px;
  margin: 0 auto;
  padding-top: 6rem;
`;

const Header = styled(Box)`
  text-align: center;
  margin-bottom: 2rem;
`;

const InviteCard = styled(Paper)`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

const ManageInvitesPage: React.FC = () => {
  const { currentShaadi, status } = useSelector((state: RootState) => state.shaadi);
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if user is admin of current shaadi
  const isAdmin = currentShaadi?.members?.some(
    member => member.userId === user?.id && member.role === 'admin'
  );

  // Mock data for pending invites
  const pendingInvites = [
    { id: '1', name: 'Priya Sharma', relationship: 'Cousin', side: 'Bride', contact: '+91 98765 43210' },
    { id: '2', name: 'Rahul Kumar', relationship: 'Friend', side: 'Groom', contact: '+91 98765 43211' },
    { id: '3', name: 'Anjali Patel', relationship: 'Sister', side: 'Bride', contact: '+91 98765 43212' },
  ];

  const handleApprove = (inviteId: string) => {
    // TODO: Implement approve logic
    console.log('Approve invite:', inviteId);
  };

  const handleDecline = (inviteId: string) => {
    // TODO: Implement decline logic
    console.log('Decline invite:', inviteId);
  };

  // Show loading when Shaadi data is being fetched
  if (status === 'loading') {
    return (
      <PageContainer>
        <Header>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your Shaadi...
          </Typography>
        </Header>
      </PageContainer>
    );
  }

  if (!currentShaadi) {
    return (
      <PageContainer>
        <Header>
          <Typography variant="h5" gutterBottom>
            No Shaadi Selected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please select a shaadi from the header to manage invites.
          </Typography>
        </Header>
      </PageContainer>
    );
  }

  if (!isAdmin) {
    return (
      <PageContainer>
        <Header>
          <Typography variant="h5" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Only admins can manage invites for this shaadi.
          </Typography>
        </Header>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Typography variant="h4" gutterBottom>
          Manage Invites
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {currentShaadi.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve guest requests
        </Typography>
      </Header>

      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PeopleIcon color="primary" />
          <Typography variant="h6">
            Pending Requests ({pendingInvites.length})
          </Typography>
        </Box>

        {pendingInvites.length === 0 ? (
          <InviteCard>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              No pending requests at the moment.
            </Typography>
          </InviteCard>
        ) : (
          <List>
            {pendingInvites.map((invite) => (
              <InviteCard key={invite.id}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6">
                          {invite.name}
                        </Typography>
                        <Chip 
                          label={invite.side} 
                          size="small" 
                          color={invite.side === 'Bride' ? 'secondary' : 'primary'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {invite.relationship} • {invite.contact}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(invite.id)}
                        size="small"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDecline(invite.id)}
                        size="small"
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </InviteCard>
            ))}
          </List>
        )}
      </Box>
    </PageContainer>
  );
};

export default ManageInvitesPage; 