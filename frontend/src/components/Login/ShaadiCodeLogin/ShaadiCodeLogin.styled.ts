import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ShaadiCodeForm = styled('form')({
  width: '100%',
});

export const ShaadiCodeButton = styled(Button)({
  marginTop: '16px',
  marginBottom: '8px',
});

export const ShaadiCodeLink = styled(Button)({
  color: '#1976d2',
  textDecoration: 'none',
  fontWeight: 400,
  fontSize: 'inherit',
  textTransform: 'none',
  minWidth: 'auto',
  padding: 0,
  '&:hover': {
    color: '#1565c0',
    backgroundColor: 'transparent',
    textDecoration: 'none',
  },
}); 