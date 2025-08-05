import { Box, Typography, Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled Components
export const WelcomeContainer = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const Sparkle = styled(Box)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  animation: ${sparkle} 2s infinite;
`;

export const WelcomeCard = styled(Box)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 1s ease-out;
  max-width: 400px;
  width: 90%;
`;

export const CoupleAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  animation: ${float} 3s ease-in-out infinite;
  border: 4px solid #ff6b9d;
`;

export const WelcomeButton = styled(Button)`
  background: linear-gradient(45deg, #ff6b9d, #ff8e53);
  color: white;
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: none;
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.3);
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    background: linear-gradient(45deg, #ff5a8c, #ff7d42);
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(255, 107, 157, 0.4);
  }
`;

export const EventTitle = styled(Typography)`
  background: linear-gradient(45deg, #ff6b9d, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const EventDate = styled(Typography)`
  color: #666;
  font-weight: 500;
  margin-bottom: 20px;
`; 