import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

function Main() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createTheme({
    palette: {
      mode: prefersDark ? 'dark' : 'light',
      primary: { main: '#2563eb' },
      secondary: { main: '#e0245e' },
    },
    shape: { borderRadius: 12 },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
