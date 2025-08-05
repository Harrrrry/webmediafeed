import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkIcon from '@mui/icons-material/Link';
import { useShaadiSummaryInvite } from './useShaadiSummaryInvite';
import type { Invite } from './types';
import InvitationCard from './InvitationCard';
import QuickInviteForm from './QuickInviteForm';
import GuestList from './GuestList';

import DeleteShaadiDialog from './DeleteShaadiDialog';

const ShaadiSummaryInvite: React.FC<{ shaadi: any; onInvite: (contact: string) => void; onSkip: () => void }> = ({ shaadi, onInvite, onSkip }) => {
  const {
    // State
    contact,
    setContact,
    loading,
    activeTab,
    setActiveTab,
    invites,
    loadingInvites,
    selectedInvite,
    setSelectedInvite,
    inviteMenuAnchor,
    setInviteMenuAnchor,
    deleteInviteDialogOpen,
    setDeleteInviteDialogOpen,
    error,
    success,
    handleSuccess,
    sharingCard,
    cardRef,
    deleteDialogOpen,
    confirmText,
    setConfirmText,
    deleteReason,
    setDeleteReason,
    deleting,
    getInviteStats,

    // Actions
    handleInvite,
    handleShareCard,
    handleDeleteShaadi,
    handleDeleteDialogClose,
    handleDeleteInvite,
    handleResendInvite,
    openDeleteDialog,
  } = useShaadiSummaryInvite(shaadi);

  const handleInviteMenuOpen = (invite: Invite, anchor: HTMLElement) => {
    setSelectedInvite(invite);
    setInviteMenuAnchor(anchor);
  };

  return (
    <Box maxWidth={400} mx="auto" p={3} mt={4} pb={12}>
      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Invitation Card" />
        <Tab label="Guest List" />
      </Tabs>

      {/* Invitation Card Tab */}
      {activeTab === 0 && (
        <>
          <InvitationCard
            shaadi={shaadi}
            cardRef={cardRef}
            sharingCard={sharingCard}
            onShareCard={handleShareCard}
            creatorCode={shaadi.creatorCode}
          />

          <QuickInviteForm
            contact={contact}
            setContact={setContact}
            loading={loading}
            onSubmit={handleInvite}
          />

          {/* Delete Shaadi Button */}
          <Box textAlign="center" mt={4}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={openDeleteDialog}
              sx={{
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                }
              }}
            >
              Delete Shaadi
            </Button>
          </Box>
        </>
      )}

      {/* Guest List Tab */}
      {activeTab === 1 && (
        <GuestList
          shaadiId={shaadi._id || shaadi.id}
          onInviteMenuOpen={handleInviteMenuOpen}
        />
      )}

      {/* Error/Success Messages */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}



      {/* Invite Actions Menu */}
      <Menu
        anchorEl={inviteMenuAnchor}
        open={Boolean(inviteMenuAnchor)}
        onClose={() => setInviteMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          if (selectedInvite) {
            navigator.clipboard.writeText(selectedInvite.inviteLink);
            handleSuccess('Invite link copied!');
          }
          setInviteMenuAnchor(null);
        }}>
          <LinkIcon sx={{ mr: 1 }} />
          Copy Link
        </MenuItem>
        {selectedInvite && selectedInvite.status !== 'joined' && selectedInvite.status !== 'declined' && (
          <MenuItem onClick={() => {
            if (selectedInvite) {
              handleResendInvite(selectedInvite.id);
            }
            setInviteMenuAnchor(null);
          }}>
            <RefreshIcon sx={{ mr: 1 }} />
            Resend
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => {
            setDeleteInviteDialogOpen(true);
            setInviteMenuAnchor(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Invite Dialog */}
      <Dialog open={deleteInviteDialogOpen} onClose={() => setDeleteInviteDialogOpen(false)}>
        <DialogTitle>Delete Invitation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the invitation for {selectedInvite?.guestName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteInviteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteInvite} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Shaadi Dialog */}
      <DeleteShaadiDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteShaadi}
        shaadiName={shaadi.name}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
        deleteReason={deleteReason}
        setDeleteReason={setDeleteReason}
        deleting={deleting}
      />
    </Box>
  );
};

export default ShaadiSummaryInvite; 