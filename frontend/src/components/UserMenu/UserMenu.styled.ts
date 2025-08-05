import { styled } from 'styled-components';
import { AppBar, Typography, Button, Avatar, IconButton, Menu, MenuItem, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Badge } from '@mui/material';

export const WeddingAppBar = styled(AppBar)`
  background: #fff !important;
  border-bottom: 1px solid ${({ theme }) => theme.glass.border} !important;
  box-shadow: ${({ theme }) => theme.shadows.card} !important;
  position: sticky !important;
  top: 0;
  z-index: 1202;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.accentGradient};
    opacity: 0.8;
  }
`;

export const LogoText = styled(Typography)`
  background: ${({ theme }) => theme.colors.accentGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(255, 107, 157, 0.2);
  position: relative;
  &::after {
    content: '💕';
    position: absolute;
    right: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    opacity: 0.8;
  }
`;

export const GlowIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.accent} !important;
  background: ${({ theme }) => theme.glass.background} !important;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder} !important;
  backdrop-filter: blur(15px) !important;
  -webkit-backdrop-filter: blur(15px) !important;
  border-radius: 50% !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  margin: 0 0.25rem !important;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.accentGradient};
    transition: left 0.3s ease;
    z-index: -1;
  }
  &:hover {
    color: white !important;
    transform: translateY(-2px) scale(1.05) !important;
    box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4) !important;
    &::before {
      left: 0;
    }
  }
  &:active {
    transform: translateY(0) scale(0.95) !important;
  }
`;

export const NotificationBadge = styled(Badge)`
  .MuiBadge-badge {
    background: ${({ theme }) => theme.colors.accentGradient} !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 0.6rem !important;
    min-width: 18px !important;
    height: 18px !important;
    border: 2px solid white !important;
    box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3) !important;
    right: -3px;
    top: 3px;
  }
`;

export const WeddingDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    background: ${({ theme }) => theme.glass.background} !important;
    backdrop-filter: blur(25px) !important;
    -webkit-backdrop-filter: blur(25px) !important;
    border-left: 1px solid ${({ theme }) => theme.glass.border} !important;
    box-shadow: ${({ theme }) => theme.shadows.card} !important;
    width: 280px !important;
    padding: 1rem !important;
  }
`;

export const DrawerHeader = styled(Box)`
  background: ${({ theme }) => theme.colors.accentGradient};
  margin: -1rem -1rem 1rem -1rem;
  padding: 2rem 1rem 1rem 1rem;
  border-radius: 0 0 0 2rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
`;

export const DrawerMenuItem = styled(ListItem)`
  background: ${({ theme }) => theme.glass.background} !important;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder} !important;
  border-radius: 1rem !important;
  margin: 0.5rem 0 !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: translateX(5px) !important;
    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.2) !important;
  }
  .MuiListItemIcon-root {
    color: ${({ theme }) => theme.colors.accent} !important;
    min-width: 40px !important;
  }
  .MuiListItemText-primary {
    color: #333 !important;
    font-weight: 600 !important;
    font-size: 0.95rem !important;
  }
`;

export const DecorativePattern = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  opacity: 0.1;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L35 25 L60 30 L35 35 L30 60 L25 35 L0 30 L25 25 Z' fill='%23FF6B9D'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
`; 