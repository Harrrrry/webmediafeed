import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  body {
    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
    color: #222;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background 0.3s, color 0.3s;
  }
  a {
    color: #2563eb;
    text-decoration: none;
    transition: color 0.2s;
  }
  a:hover {
    color: #1e40af;
  }
  input, button, textarea, select {
    font: inherit;
    outline: none;
  }
`;

export default GlobalStyle; 