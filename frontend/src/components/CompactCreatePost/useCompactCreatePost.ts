import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';

export const useCompactCreatePost = () => {
  const navigate = useNavigate();
  const { currentShaadi } = useSelector((state: RootState) => state.shaadi);
  const [showNoShaadiMessage, setShowNoShaadiMessage] = useState(false);
  
  const handleCreatePostClick = () => {
    if (!currentShaadi?._id) {
      setShowNoShaadiMessage(true);
      setTimeout(() => setShowNoShaadiMessage(false), 3000);
      return;
    }
    navigate('/create-post');
  };
  
  return { 
    handleCreatePostClick, 
    currentShaadi, 
    showNoShaadiMessage,
    setShowNoShaadiMessage 
  };
}; 