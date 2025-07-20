import { styled, keyframes } from 'styled-components';
import { Box, IconButton } from '@mui/material';

const heartPop = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

export const GlassCard = styled(Box)`
  &.glass-card {
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.card};
    box-shadow: ${({ theme }) => theme.shadows.card};
    border: ${({ theme }) => theme.colors.cardBorder};
    background: ${({ theme }) => theme.glass.background};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    transition: box-shadow 0.2s, background 0.2s, transform 0.15s;
    &:hover {
      box-shadow: 0 12px 32px 0 #a18cd1;
      transform: translateY(-2px) scale(1.01);
    }
  }
`;

export const ActionIconButton = styled(IconButton)`
  border-radius: 1.2rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
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

export const AnimatedHeart = styled.div`
  color: ${({ theme }) => theme.colors.error};
  &.pop {
    animation: ${heartPop} 0.5s cubic-bezier(.36,1.01,.32,1) forwards;
  }
`; 