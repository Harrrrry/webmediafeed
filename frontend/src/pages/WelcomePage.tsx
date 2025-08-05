import React from 'react';
import WelcomePage from '../components/WelcomePage';

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

const WelcomePagePage: React.FC<WelcomePageProps> = (props) => {
  return <WelcomePage {...props} />;
};

export default WelcomePagePage; 