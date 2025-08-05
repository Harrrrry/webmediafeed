import React, { useState, useEffect } from 'react';
import ShaadiCreateForm from '../components/ShaadiCreateForm';
import ShaadiSummaryInvite from '../components/ShaadiSummaryInvite';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserShaadi, setCurrentShaadi, fetchUserShaadis } from '../features/shaadi/shaadiSlice';
import type { RootState } from '../app/store';
import { Box, CircularProgress, Typography } from '@mui/material';
import { UserRole } from '../utils/constants';

const ShaadiCreatePage: React.FC = () => {
  const [shaadi, setShaadi] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user's Shaadis from Redux state
  const { userShaadis, status } = useSelector((state: RootState) => state.shaadi);
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if user already has a Shaadi on mount
  useEffect(() => {
    const checkExistingShaadi = async () => {
      try {
        // Always fetch fresh data to ensure we have the latest state
        if (status === 'idle') {
          await dispatch(fetchUserShaadis() as any);
        }
        
        // Wait for the data to be loaded
        if (status === 'loading') {
          return;
        }
        
        // Check if user is a creator of any Shaadi
        const creatorMembership = userShaadis.find(membership => membership.role === UserRole.CREATOR);
        
        if (creatorMembership) {
          // User is a creator, show the invite page for their Shaadi
          setShaadi(creatorMembership.shaadi);
          // Set as current Shaadi if not already set
          dispatch(setCurrentShaadi({ 
            shaadi: creatorMembership.shaadi, 
            role: UserRole.CREATOR 
          }));
        } else if (userShaadis.length > 0) {
          // User is a member but not creator, redirect to home
          navigate('/', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error checking existing Shaadi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingShaadi();
  }, [dispatch, status, navigate]);

  const handleSuccess = (createdShaadi: any) => {
    setShaadi(createdShaadi);
    
    // The backend response structure: { ...shaadiData, creatorCode }
    // Extract the shaadi data (remove creatorCode for the shaadi object)
    const { creatorCode, ...shaadiData } = createdShaadi;
    
    // Create membership object for the user's shaadis list
    const userMembership = {
      shaadi: shaadiData,
      role: UserRole.CREATOR,
      code: creatorCode
    };
    
    // Add to user's shaadis list
    dispatch(addUserShaadi(userMembership));
    
    // Set as current shaadi with role
    dispatch(setCurrentShaadi({ 
      shaadi: shaadiData, 
      role: UserRole.CREATOR 
    }));
    
    // Refresh the user shaadis list
    dispatch(fetchUserShaadis() as any);
  };

  const handleInvite = (contact: string) => {
    // Invite logic handled in ShaadiSummaryInvite
  };

  const handleSkip = () => {
    navigate('/'); // Navigate to home/feed
  };

  // Show loading while checking existing Shaadi
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Checking your Shaadi...
        </Typography>
      </Box>
    );
  }

  return shaadi ? (
    <ShaadiSummaryInvite shaadi={shaadi} onInvite={handleInvite} onSkip={handleSkip} />
  ) : (
    <ShaadiCreateForm onSuccess={handleSuccess} />
  );
};

export default ShaadiCreatePage; 