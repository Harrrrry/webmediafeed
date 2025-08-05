import styled from '@emotion/styled';
import { Box, Card } from '@mui/material';

export const GuestManagementContainer = styled(Box)`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f7 0%, #fff 100%);
`;

export const StatsCard = styled(Card)`
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  
  .MuiTypography-h4 {
    margin-bottom: 4px;
  }
  
  .MuiTypography-body2 {
    color: #666;
  }
`;

export const InviteForm = styled(Box)`
  .MuiTextField-root {
    margin-bottom: 16px;
  }
  
  .MuiButton-root {
    margin-top: 16px;
  }
`; 