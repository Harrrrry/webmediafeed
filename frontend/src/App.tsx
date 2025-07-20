import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import UserMenu from './components/UserMenu';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './app/store';
import { Feed } from './pages/Feed';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreatePost } from './pages/CreatePost';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { useEffect } from 'react';
import { getProfileMe } from './features/users/authSlice';
import type { UnknownAction } from '@reduxjs/toolkit';

function App(): React.ReactElement {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect((): void => {
    if (token !== null && token !== '' && !user) {
      dispatch(getProfileMe() as unknown as UnknownAction);
    }
  }, [token, user, dispatch]);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <UserMenu />
        <Routes>
          <Route path="/" element={token !== null && token !== '' ? <Feed /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-post" element={token !== null && token !== '' ? <CreatePost /> : <Login />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </>
  );
}

export default App;
