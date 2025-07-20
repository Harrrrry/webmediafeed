import { styled } from 'styled-components';
import { Box, IconButton, Typography } from '@mui/material';

export const CompactCreatePost = styled(Box)`
  background: ${({ theme }) => theme.glass.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(127, 90, 240, 0.15);
  }
`;

export const PlaceholderText = styled(Typography)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  flex: 1;
  text-align: left;
  padding: 0.5rem 0;
`;

export const MediaIcon = styled(IconButton)`
  color: ${({ theme }) => theme.colors.accent} !important;
  background: transparent !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
  
  &:hover {
    background: rgba(127, 90, 240, 0.1) !important;
    color: ${({ theme }) => theme.colors.accent} !important;
    transform: scale(1.1) !important;
  }
`; 