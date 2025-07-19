import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';

function Main() {
  // Optionally, you can sync MUI theme with your custom theme
  const muiTheme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: theme.colors.accent },
      secondary: { main: theme.colors.success },
      error: { main: theme.colors.error },
      background: { default: '#fafafa' },
      text: { primary: theme.colors.text, secondary: theme.colors.textSecondary },
    },
    shape: { borderRadius: 16 },
    typography: { fontFamily: theme.fontFamily },
  });
  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
