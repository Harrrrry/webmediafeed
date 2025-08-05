import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteShaadi } from '../../../features/shaadi/shaadiSlice';

export const useShaadiDeletion = (shaadiId: string, shaadiName: string) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteShaadi = async () => {
    if (confirmText !== shaadiName) return;
    
    setDeleting(true);
    try {
      await dispatch(deleteShaadi({ shaadiId, reason: deleteReason }) as any);
      setDeleteDialogOpen(false);
      setConfirmText('');
      setDeleteReason('');
      navigate('/', { replace: true });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete Shaadi');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setConfirmText('');
    setDeleteReason('');
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  return {
    // State
    deleteDialogOpen,
    confirmText,
    setConfirmText,
    deleteReason,
    setDeleteReason,
    deleting,

    // Actions
    handleDeleteShaadi,
    handleDeleteDialogClose,
    openDeleteDialog,
  };
}; 