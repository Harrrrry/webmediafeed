import AppRoutes from './routes/AppRoutes';
import GlobalStyle from './styles/GlobalStyle';
import { UserMenu } from './components/UserMenu';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';
import { Feed } from './pages/Feed';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <UserMenu />
        <Routes>
          <Route path="/" element={token ? <Feed /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
