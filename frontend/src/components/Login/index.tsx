import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import AppHeader from '../common/AppHeader';
import RegularLogin from './RegularLogin';
import ShaadiCodeLogin from './ShaadiCodeLogin';
import { LoginContainer, LoginWrapper, LoginPaper, LoginTitle } from './Login.styled';
import { useLogin } from './useLogin';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const Login = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  const { tabValue, handleTabChange } = useLogin();

  React.useEffect(() => {
    if (token && user) {
      navigate('/');
    }
  }, [token, user, navigate]);

  return (
    <LoginContainer>
      <AppHeader />
      <LoginWrapper>
        <LoginPaper elevation={3}>
          <LoginTitle variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Welcome to Shaadi Circle
          </LoginTitle>
          
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="login tabs" centered>
            <Tab label="Regular Login" />
            <Tab label="Shaadi Code" />
          </Tabs>
          
          {/* Regular Login Tab */}
          <TabPanel value={tabValue} index={0}>
            <RegularLogin />
          </TabPanel>
          
          {/* Shaadi Code Login Tab */}
          <TabPanel value={tabValue} index={1}>
            <ShaadiCodeLogin />
          </TabPanel>
        </LoginPaper>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login; 