import React from 'react';
import Box from '@mui/material/Box';

const Footer: React.FC = () => (
  <Box width="100%" textAlign="center" mt="auto" py={2} color="#7f5af0" fontWeight={500} fontSize="1rem">
    Crafted with <span role="img" aria-label="love">❤️</span> in India
    <span role="img" aria-label="India" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
      <svg width="1.2em" height="0.85em" viewBox="0 0 60 42" style={{ display: 'inline', verticalAlign: 'middle' }}>
        <rect width="60" height="14" fill="#FF9933"/>
        <rect y="14" width="60" height="14" fill="#fff"/>
        <rect y="28" width="60" height="14" fill="#138808"/>
        <circle cx="30" cy="21" r="5" fill="#008" stroke="#008" strokeWidth="1"/>
        <circle cx="30" cy="21" r="2" fill="#fff"/>
      </svg>
    </span>
    <span style={{ display: 'none' }}>🇮🇳</span>
  </Box>
);

export default Footer; 