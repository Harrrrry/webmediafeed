import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  IconButton, 
  Card,
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleIcon from '@mui/icons-material/People';
import type { Invite } from './types';
import { getStatusColor, getStatusIcon, getSideColor, getSideLabel } from './utils/statusUtils';
import type { RootState } from '../../app/store';
import { useGuestStats } from './hooks/useGuestStats';

interface GuestListProps {
  shaadiId: string;
  onInviteMenuOpen: (invite: Invite, anchor: HTMLElement) => void;
}

const GuestList: React.FC<GuestListProps> = ({
  shaadiId,
  onInviteMenuOpen
}) => {
  const { currentUserRole } = useSelector((state: RootState) => state.shaadi);
  const isCreator = currentUserRole === 'creator';
  
  const { stats, loading, error } = useGuestStats(shaadiId);

  return (
    <>
      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, textAlign: 'center', p: 1 }}>
          <Typography variant="h6" color="primary">
            {stats.total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Card>
        <Card sx={{ flex: 1, textAlign: 'center', p: 1 }}>
          <Typography variant="h6" color="success.main">
            {stats.joinedCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Joined
          </Typography>
        </Card>
        <Card sx={{ flex: 1, textAlign: 'center', p: 1 }}>
          <Typography variant="h6" color="warning.main">
            {stats.pending.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pending
          </Typography>
        </Card>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Guest List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading pending guests...</Typography>
        </Box>
      ) : stats.pending.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No pending invites
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All guests have joined or no invites have been sent yet
          </Typography>
        </Paper>
      ) : (
        <List>
          {stats.pending.map((invite: Invite) => (
            <Card key={invite.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getSideColor(invite.side) }}>
                    {invite.guestName ? invite.guestName.charAt(0) : '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {invite.guestName || 'Guest'}
                      </Typography>
                      <Chip
                        label={getStatusIcon(invite.status)}
                        size="small"
                        color={getStatusColor(invite.status) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {invite.relationship || 'Guest'} • {getSideLabel(invite.side)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invite.guestEmail || invite.guestPhone || 'Contact not provided'}
                      </Typography>
                    </Box>
                  }
                />
                <IconButton
                  size="small"
                  onClick={(e) => onInviteMenuOpen(invite, e.currentTarget)}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            </Card>
          ))}
        </List>
      )}


    </>
  );
};

export default GuestList; 