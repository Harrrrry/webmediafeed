import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import Contact from '../pages/Contact';
import { CreatePost } from '../pages/CreatePost';
import ShaadiCreatePage from '../pages/ShaadiCreatePage';
import ManageInvitesPage from '../pages/ManageInvitesPage';
import { Login } from '../components/Login';
import { Register } from '../pages/Register';
import JoinShaadi from '../components/JoinShaadi';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { ReactElement } from 'react';
import ShaadiSummaryInvite from '../components/ShaadiSummaryInvite';
import { useNavigate } from 'react-router-dom';

function RequireAuth({ children }: { children: ReactElement }) {
  const { token } = useSelector((state: RootState) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RedirectIfAuth({ children }: { children: ReactElement }) {
  const { token } = useSelector((state: RootState) => state.auth);
  if (token) return <Navigate to="/" replace />;
  return children;
}

const InvitePage = () => {
  const navigate = useNavigate();
  const { currentShaadi, userShaadis, status } = useSelector((state: RootState) => state.shaadi);
  
  // Wait for data to be loaded before making routing decisions
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  // If no current Shaadi but user has Shaadis, redirect to home to select one
  if (!currentShaadi && userShaadis.length > 0) {
    return <Navigate to="/" replace />;
  }
  
  // If no current Shaadi and no Shaadis, redirect to create Shaadi
  if (!currentShaadi && userShaadis.length === 0) {
    return <Navigate to="/create-shaadi" replace />;
  }
  
  // If current Shaadi exists, show the invite page
  if (currentShaadi) {
    return (
      <ShaadiSummaryInvite 
        shaadi={currentShaadi} 
        onInvite={() => {}} 
        onSkip={() => navigate('/')} 
      />
    );
  }
  
  // Fallback
  return <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={
      <RedirectIfAuth>
        <Login />
      </RedirectIfAuth>
    } />
    <Route path="/register" element={
      <RedirectIfAuth>
        <Register />
      </RedirectIfAuth>
    } />
    <Route path="/join" element={<JoinShaadi />} />
    <Route path="/" element={
      <RequireAuth>
        <HomePage />
      </RequireAuth>
    } />
    <Route path="/contact" element={
      <RequireAuth>
        <Contact />
      </RequireAuth>
    } />
    <Route path="/create-post" element={
      <RequireAuth>
        <CreatePost />
      </RequireAuth>
    } />
    <Route path="/create-shaadi" element={
      <RequireAuth>
        <ShaadiCreatePage />
      </RequireAuth>
    } />
    <Route path="/invite" element={
      <RequireAuth>
        <InvitePage />
      </RequireAuth>
    } />
    <Route path="/manage-invites" element={
      <RequireAuth>
        <ManageInvitesPage />
      </RequireAuth>
    } />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes; 