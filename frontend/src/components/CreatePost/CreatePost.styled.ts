import { styled } from 'styled-components';
import { Box, Button, IconButton } from '@mui/material';

export const CreatePostContainer = styled(Box)`
  background: ${({ theme }) => theme.glass.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  padding: 2rem;
  margin: 1rem auto;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const GradientButton = styled(Button)`
  background: ${({ theme }) => theme.colors.accentGradient};
  color: #fff;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radii.button};
  box-shadow: ${({ theme }) => theme.shadows.button};
  transition: background 0.3s, box-shadow 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(90deg, #fbc2eb 0%, #7f5af0 100%);
    box-shadow: 0 4px 16px 0 #a18cd1;
    transform: translateY(-2px) scale(1.03);
  }
`;

export const LargeIconButton = styled(IconButton)`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 1.5rem;
  background: transparent;
  box-shadow: none;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.accent};
  margin-right: ${({ theme }) => theme.spacing.sm};
  transition: color 0.2s, transform 0.1s;
  &:hover, &:focus {
    background: transparent;
    color: ${({ theme }) => theme.colors.accent};
    box-shadow: none;
  }
  &:active {
    background: transparent;
    color: ${({ theme }) => theme.colors.accent};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`; 