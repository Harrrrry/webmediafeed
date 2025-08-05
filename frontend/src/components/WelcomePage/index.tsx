import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { useWelcomePage } from './useWelcomePage';
import {
  WelcomeContainer,
  Sparkle,
  WelcomeCard,
  CoupleAvatar,
  WelcomeButton,
  EventTitle,
  EventDate,
} from './WelcomePage.styled';

interface WelcomePageProps {
  shaadi: {
    name: string;
    date?: string;
    brideName?: string;
    groomName?: string;
    image?: string;
  };
  onContinue: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ shaadi, onContinue }) => {
  const { sparkles, formatDate } = useWelcomePage();

  return (
    <WelcomeContainer>
      {/* Animated Sparkles */}
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          sx={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}

      <WelcomeCard>
        <CoupleAvatar
          src={shaadi.image}
          alt="Couple"
        >
          {shaadi.brideName?.[0]}{shaadi.groomName?.[0]}
        </CoupleAvatar>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          Welcome to
        </Typography>

        <EventTitle variant="h4">
          {shaadi.name}
        </EventTitle>

        <EventDate variant="body1">
          {formatDate(shaadi.date)}
        </EventDate>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          We're thrilled to have you join us for this special celebration! 🎉
        </Typography>

        <WelcomeButton
          variant="contained"
          onClick={onContinue}
          fullWidth
        >
          Shaadi me Swagat Hai 💖
        </WelcomeButton>
      </WelcomeCard>
    </WelcomeContainer>
  );
};

export default WelcomePage; 