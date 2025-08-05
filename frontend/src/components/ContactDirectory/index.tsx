import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Chip, 
  TextField, 
  IconButton, 
  Menu, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  Block as BlockIcon,
  Report as ReportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { ContactDirectoryContainer, ContactCard, SearchContainer, EmptyState } from './ContactDirectory.styled';
import { useShaadiMembers } from '../../hooks/useShaadiMembers';

interface Contact {
  _id: string;
  userId: string;
  role: 'creator' | 'guest';
  name: string;
  profilePic?: string;
  email?: string;
  phone?: string;
  side?: 'groom' | 'bride';
  relationship?: string;
  createdAt: string;
}

const ContactDirectory: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentShaadi, status } = useSelector((state: RootState) => state.shaadi);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Use the new hook
  const {
    filteredMembers: contacts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedSide,
    setSelectedSide,
    sortBy,
    setSortBy,
    sideCounts,
    refresh
  } = useShaadiMembers(currentShaadi?._id || '');

  const handleContactMenuOpen = (event: React.MouseEvent<HTMLElement>, contact: Contact) => {
    setSelectedContact(contact);
    setAnchorEl(event.currentTarget);
  };

  const handleContactMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null);
  };

  const handleBlock = async () => {
    if (selectedContact) {
      // TODO: Implement block functionality
      console.log('Block contact:', selectedContact._id);
      handleContactMenuClose();
    }
  };

  const handleReport = () => {
    handleContactMenuClose();
    setReportDialogOpen(true);
  };

  const handleReportSubmit = async () => {
    if (selectedContact && reportReason) {
      // TODO: Implement report functionality
      console.log('Report contact:', selectedContact._id, reportReason);
      setReportDialogOpen(false);
      setReportReason('');
    }
  };



  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string') {
      return '?';
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSideColor = (side?: string) => {
    return side === 'groom' ? 'primary' : 'secondary';
  };

  const getSideLabel = (side?: string) => {
    return side === 'groom' ? 'Groom Side' : 'Bride Side';
  };

  // Show loading when Shaadi data is being fetched
  if (status === 'loading') {
    return (
      <ContactDirectoryContainer>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading your Shaadi...
          </Typography>
        </Box>
      </ContactDirectoryContainer>
    );
  }

  if (!currentShaadi) {
    return (
      <ContactDirectoryContainer>
        <Alert severity="info">
          Please select a Shaadi to view the contact directory.
        </Alert>
      </ContactDirectoryContainer>
    );
  }

  if (loading) {
    return (
      <ContactDirectoryContainer>
        <Typography>Loading contacts...</Typography>
      </ContactDirectoryContainer>
    );
  }

  if (error) {
    return (
      <ContactDirectoryContainer>
        <Alert severity="error">{error}</Alert>
      </ContactDirectoryContainer>
    );
  }

  return (
    <ContactDirectoryContainer>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Contact Directory
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {currentShaadi.name} - {currentShaadi.brideName} & {currentShaadi.groomName}
      </Typography>

      <SearchContainer>
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={`All (${sideCounts.all})`}
          color={selectedSide === 'all' ? 'primary' : 'default'}
          onClick={() => setSelectedSide('all')}
          clickable
        />
        <Chip
          label={`Groom Side (${sideCounts.groom})`}
          color={selectedSide === 'groom' ? 'primary' : 'default'}
          onClick={() => setSelectedSide('groom')}
          clickable
        />
        <Chip
          label={`Bride Side (${sideCounts.bride})`}
          color={selectedSide === 'bride' ? 'primary' : 'default'}
          onClick={() => setSelectedSide('bride')}
          clickable
        />
      </Box>

      {/* Sort Dropdown */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="side">Side</MenuItem>
            <MenuItem value="relationship">Relationship</MenuItem>
            <MenuItem value="joinDate">Join Date</MenuItem>
          </Select>
        </FormControl>
        
        <IconButton onClick={refresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {contacts.length === 0 ? (
        <EmptyState>
          <Typography variant="h6" color="text.secondary">
            No contacts to display
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search terms.' : 'Contacts will appear here once guests join.'}
          </Typography>
        </EmptyState>
      ) : (
        <List>
          {contacts.map((contact) => (
            <ContactCard key={contact._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={contact.profilePic}
                    sx={{ width: 50, height: 50 }}
                  >
                    {getInitials(contact.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {contact.name || 'Unknown User'}
                      </Typography>
                      <Chip
                        label={getSideLabel(contact.side)}
                        size="small"
                        color={getSideColor(contact.side)}
                        variant="outlined"
                      />
                      {contact.role === 'creator' && (
                        <Chip
                          label="Creator"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {contact.relationship || 'Guest'}
                      </Typography>
                      {contact.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.primary">
                            {contact.email}
                          </Typography>
                        </Box>
                      )}
                      {contact.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.primary">
                            {contact.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleContactMenuOpen(e, contact)}
                    disabled={contact.userId === user?.id}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </ListItem>
            </ContactCard>
          ))}
        </List>
      )}

      {/* Contact Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleContactMenuClose}
      >
        <MenuItem onClick={handleBlock}>
          <BlockIcon sx={{ mr: 1 }} />
          Block this user
        </MenuItem>
        <MenuItem onClick={handleReport}>
          <ReportIcon sx={{ mr: 1 }} />
          Report this user
        </MenuItem>
      </Menu>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please select a reason for reporting {selectedContact?.name}:
          </Typography>
          <TextField
            select
            fullWidth
            label="Reason"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="inappropriate_behavior">Inappropriate Behavior</MenuItem>
            <MenuItem value="spam">Spam</MenuItem>
            <MenuItem value="harassment">Harassment</MenuItem>
            <MenuItem value="fake_profile">Fake Profile</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReportSubmit} 
            variant="contained" 
            color="error"
            disabled={!reportReason}
          >
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </ContactDirectoryContainer>
  );
};

export default ContactDirectory; 