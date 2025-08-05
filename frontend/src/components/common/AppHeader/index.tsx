import React from 'react';
import { Box, Typography } from '@mui/material';

const AppHeader: React.FC = () => (
  <Box width="100%" py={3} textAlign="center" bgcolor="rgba(0,0,0,0.10)" style={{backdropFilter: 'blur(4px)'}}>
    <Typography 
      variant="h3" 
      fontWeight={900} 
      letterSpacing={1} 
      color="#fff"
      sx={{
        textShadow: '0 2px 8px rgba(0,0,0,0.25), 0 1px 0 #fff',
        lineHeight: 1.1,
      }}
    >
      Shaadi Circle
    </Typography>
  </Box>
);

export default AppHeader; 