import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Alert, 
  Typography 
} from '@mui/material';

interface DeleteShaadiDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  shaadiName: string;
  confirmText: string;
  setConfirmText: (text: string) => void;
  deleteReason: string;
  setDeleteReason: (reason: string) => void;
  deleting: boolean;
}

const DeleteShaadiDialog: React.FC<DeleteShaadiDialogProps> = ({
  open,
  onClose,
  onDelete,
  shaadiName,
  confirmText,
  setConfirmText,
  deleteReason,
  setDeleteReason,
  deleting
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>
        Delete Shaadi?
      </DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            This action cannot be undone!
          </Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Are you sure you want to delete this Shaadi? All posts, comments, and member data will be lost.
        </Typography>

        <TextField
          label="Reason for deletion (optional)"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
          placeholder="e.g., Event cancelled, created by mistake, etc."
        />

        <TextField
          label={`Type "${shaadiName}" to confirm`}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder={shaadiName}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderColor: confirmText === shaadiName ? 'success.main' : 'error.main',
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={confirmText !== shaadiName || deleting}
          onClick={onDelete}
        >
          {deleting ? 'Deleting...' : 'Delete Shaadi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteShaadiDialog; 