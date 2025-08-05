import { Avatar } from '@mui/material';
import { styled } from 'styled-components';

export const StyledAvatar = styled(Avatar)<{ $size?: number }>`
  width: ${({ $size }) => ($size ? `${$size}px` : '40px')};
  height: ${({ $size }) => ($size ? `${$size}px` : '40px')};
  font-weight: 700;
  background: ${({ theme }) => theme.colors.accentGradient};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => ($size ? `${$size / 2.5}px` : '1rem')};
  line-height: 1;
  text-align: center;
  padding: 0;
  margin: 0;
`; 