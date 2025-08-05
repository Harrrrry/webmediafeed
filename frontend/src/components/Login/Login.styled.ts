import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LoginContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '100%',
  overflowX: 'hidden',
});

export const LoginWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const LoginPaper = styled(Paper)({
  padding: '24px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
});

export const LoginTitle = styled(Typography)({
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '24px',
}); 