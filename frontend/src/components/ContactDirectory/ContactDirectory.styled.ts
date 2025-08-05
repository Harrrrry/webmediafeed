import styled from '@emotion/styled';
import { Box, ListItem } from '@mui/material';

export const ContactDirectoryContainer = styled(Box)`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f7 0%, #fff 100%);
`;

export const SearchContainer = styled(Box)`
  margin-bottom: 20px;
  
  .MuiTextField-root {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .MuiOutlinedInput-root {
      border-radius: 12px;
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: #ff6b9d;
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #ff6b9d;
      }
    }
  }
`;

export const ContactCard = styled(ListItem)`
  background: white;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  
  .MuiListItemAvatar-root {
    min-width: 60px;
  }
  
  .MuiListItemText-root {
    margin-left: 12px;
  }
`;

export const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .MuiTypography-h6 {
    margin-bottom: 8px;
    color: #666;
  }
  
  .MuiTypography-body2 {
    color: #999;
  }
`; 