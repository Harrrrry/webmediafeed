import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Link as LinkIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { GuestManagementContainer, StatsCard, InviteForm } from './GuestManagement.styled';
import { useGuestManagement } from './useGuestManagement';

interface Invite {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  relationship: string;
  side: 'groom' | 'bride';
  status: 'pending' | 'sent' | 'joined' | 'declined' | 'expired';
  inviteCode: string;
  inviteLink: string;
  sentAt?: string;
  joinedAt?: string;
  declinedAt?: string;
  expiresAt?: string;
  message?: string;
  notes?: string;
  openCount: number;
  clickCount: number;
  reminderCount: number;
  lastReminderSent?: string;
  createdAt: string;
}

const GuestManagement: React.FC = () => {
  const { currentShaadi, status } = useSelector((state: RootState) => state.shaadi);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addInviteDialogOpen, setAddInviteDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    fetchInvites,
    createInvite,
    deleteInvite,
    resendInvite,
    updateInviteNotes
  } = useGuestManagement();

  useEffect(() => {
    if (currentShaadi) {
      loadInvites();
    }
  }, [currentShaadi]);

  const loadInvites = async () => {
    if (!currentShaadi) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchInvites(currentShaadi._id);
      setInvites(result.invites || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvite = async (inviteData: any) => {
    if (!currentShaadi) return;
    
    try {
      await createInvite(currentShaadi._id, inviteData);
      setAddInviteDialogOpen(false);
      loadInvites(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to create invite');
    }
  };

  const handleDeleteInvite = async () => {
    if (!selectedInvite) return;
    
    try {
      await deleteInvite(selectedInvite.id);
      setDeleteDialogOpen(false);
      setSelectedInvite(null);
      loadInvites(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete invite');
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await resendInvite(inviteId);
      loadInvites(); // Refresh to get updated reminder count
    } catch (err: any) {
      setError(err.message || 'Failed to resend invite');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'joined': return 'success';
      case 'sent': return 'info';
      case 'pending': return 'warning';
      case 'declined': return 'error';
      case 'expired': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'joined': return <CheckCircleIcon />;
      case 'sent': return <EmailIcon />;
      case 'pending': return <ScheduleIcon />;
      case 'declined': return <CancelIcon />;
      case 'expired': return <WarningIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getSideColor = (side: string) => {
    return side === 'groom' ? 'primary' : 'secondary';
  };

  const getStats = () => {
    const total = invites.length;
    const joined = invites.filter(invite => invite.status === 'joined').length;
    const pending = invites.filter(invite => invite.status === 'pending').length;
    const sent = invites.filter(invite => invite.status === 'sent').length;
    const declined = invites.filter(invite => invite.status === 'declined').length;
    const expired = invites.filter(invite => invite.status === 'expired').length;

    return { total, joined, pending, sent, declined, expired };
  };

  const stats = getStats();

  // Show loading when Shaadi data is being fetched
  if (status === 'loading') {
    return (
      <GuestManagementContainer>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading your Shaadi...
          </Typography>
        </Box>
      </GuestManagementContainer>
    );
  }

  if (!currentShaadi) {
    return (
      <GuestManagementContainer>
        <Alert severity="info">
          Please select a Shaadi to manage guest invitations.
        </Alert>
      </GuestManagementContainer>
    );
  }

  return (
    <GuestManagementContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Guest Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadInvites}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddInviteDialogOpen(true)}
          >
            Add Guest
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {currentShaadi.name} - {currentShaadi.brideName} & {currentShaadi.groomName}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard>
            <Typography variant="h4" fontWeight={700} color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Invites
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {stats.joined}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Joined
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard>
            <Typography variant="h4" fontWeight={700} color="warning.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard>
            <Typography variant="h4" fontWeight={700} color="info.main">
              {stats.sent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sent
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard>
            <Typography variant="h4" fontWeight={700} color="error.main">
              {stats.declined}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Declined
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard>
            <Typography variant="h4" fontWeight={700} color="text.secondary">
              {stats.expired}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expired
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Guest</TableCell>
                <TableCell>Relationship</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Analytics</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {invite.guestName ? invite.guestName.charAt(0) : '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {invite.guestName || 'Guest'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {invite.guestEmail || invite.guestPhone || 'Contact not provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {invite.relationship || 'Guest'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invite.side === 'groom' ? 'Groom Side' : 'Bride Side'}
                      size="small"
                      color={getSideColor(invite.side)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(invite.status)}
                      label={invite.status ? invite.status.charAt(0).toUpperCase() + invite.status.slice(1) : 'Unknown'}
                      size="small"
                      color={getStatusColor(invite.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Opens: {invite.openCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Clicks: {invite.clickCount}
                      </Typography>
                      {invite.reminderCount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Reminders: {invite.reminderCount}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Copy invite link">
                        <IconButton
                          size="small"
                          onClick={() => navigator.clipboard.writeText(invite.inviteLink)}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Tooltip>
                      {invite.status !== 'joined' && invite.status !== 'declined' && (
                        <Tooltip title="Resend invite">
                          <IconButton
                            size="small"
                            onClick={() => handleResendInvite(invite.id)}
                          >
                            <EmailIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete invite">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedInvite(invite);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Invite Dialog */}
      <AddInviteDialog
        open={addInviteDialogOpen}
        onClose={() => setAddInviteDialogOpen(false)}
        onSubmit={handleAddInvite}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Invitation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the invitation for {selectedInvite?.guestName}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteInvite} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </GuestManagementContainer>
  );
};

// Add Invite Dialog Component
interface AddInviteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddInviteDialog: React.FC<AddInviteDialogProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    relationship: '',
    side: 'groom',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      relationship: '',
      side: 'groom',
      message: ''
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Guest</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Guest Name"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone (optional)"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Side"
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                required
              >
                <MenuItem value="groom">Groom Side</MenuItem>
                <MenuItem value="bride">Bride Side</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Personal Message (optional)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Send Invitation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GuestManagement; 