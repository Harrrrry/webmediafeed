import { Stack, Tooltip, Snackbar, Alert } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { CompactCreatePostContainer, PlaceholderText, MediaIcon } from './CompactCreatePost.styled';
import { useCompactCreatePost } from './useCompactCreatePost';
import { UI_STRINGS } from '../../utils/interfaces/ui';
import UserAvatar from '../common/UserAvatar';

const CompactCreatePost = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    handleCreatePostClick, 
    currentShaadi, 
    showNoShaadiMessage, 
    setShowNoShaadiMessage 
  } = useCompactCreatePost();

  return (
    <>
      <CompactCreatePostContainer 
        onClick={handleCreatePostClick}
        sx={{
          opacity: currentShaadi ? 1 : 0.7,
          cursor: currentShaadi ? 'pointer' : 'not-allowed'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* User Avatar */}
          <UserAvatar profilePicUrl={user?.profilePicUrl} username={user?.username} size={44} />
          {/* Placeholder Input */}
          <PlaceholderText variant="body1">
            {currentShaadi ? UI_STRINGS.shareShaadiMoment : 'Select a Shaadi to share moments'}
          </PlaceholderText>
          {/* Media Icon */}
          <Tooltip title={currentShaadi ? "Add photo or video" : "Select a Shaadi first"} arrow>
            <MediaIcon size="small">
              <AddPhotoAlternateIcon fontSize="small" />
            </MediaIcon>
          </Tooltip>
        </Stack>
      </CompactCreatePostContainer>
      
      {/* Snackbar for feedback */}
      <Snackbar 
        open={showNoShaadiMessage} 
        autoHideDuration={3000} 
        onClose={() => setShowNoShaadiMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setShowNoShaadiMessage(false)}>
          Please select a Shaadi first to share moments
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompactCreatePost; 