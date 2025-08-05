import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const JoinFormContainer = styled(Box)({
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '24px',
});

export const JoinFormTitle = styled(Typography)({
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '16px',
});

export const JoinFormSubtitle = styled(Typography)({
  textAlign: 'center',
  marginBottom: '24px',
  color: 'rgba(0, 0, 0, 0.6)',
});

export const JoinFormButton = styled(Button)({
  marginTop: '16px',
  marginBottom: '8px',
  height: '48px',
  fontSize: '16px',
  fontWeight: 600,
}); 