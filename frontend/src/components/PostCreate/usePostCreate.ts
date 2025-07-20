import { useNavigate } from 'react-router-dom';

export const usePostCreate = () => {
  const navigate = useNavigate();
  const handleCreatePostClick = () => {
    navigate('/create-post');
  };
  return { handleCreatePostClick };
}; 