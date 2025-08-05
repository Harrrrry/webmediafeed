import { createGlobalStyle } from 'styled-components';
import 'styled-components';
import type theme from './theme';

declare module 'styled-components' {
  type Theme = typeof theme;
  export interface DefaultTheme extends Theme {}
}

const fontUrl = 'https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap';
const dancingScriptUrl = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap';
const fontFace = `@import url('${fontUrl}'); @import url('${dancingScriptUrl}');`;

const GlobalStyle = createGlobalStyle`
  ${fontFace}
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fontFamily};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    min-height: 100vh;
    scroll-behavior: smooth;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: ${({ theme }) => theme.colors.text};
      text-decoration: underline;
    }
  }
  .glass-card {
    background: ${({ theme }) => theme.glass.background};
    border-radius: ${({ theme }) => theme.radii.card};
    box-shadow: ${({ theme }) => theme.shadows.card};
    border: ${({ theme }) => theme.glass.border};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.sm} 0;
  }
  /* Input, Select, Textarea Global Styles */
  input, select, textarea {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 12px;
    padding: 12px 16px;
    color: #fff;
    font-weight: 500;
    font-family: inherit;
    font-size: 1rem;
    transition: border 0.2s, box-shadow 0.2s;
    outline: none;
    box-shadow: none;
    margin-bottom: 0.5rem;
  }
  input::placeholder, textarea::placeholder {
    color: rgba(255, 255, 255, 0.7);
    opacity: 1;
    font-weight: 400;
  }
  input:focus, select:focus, textarea:focus {
    /* No custom focus style */
  }
  /* Remove autofill background for Chrome */
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.1) inset !important;
    -webkit-text-fill-color: #fff !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  /* Responsive breakpoints */
  @media (max-width: 600px) {
    html {
      font-size: 15px;
    }
    .glass-card {
      padding: ${({ theme }) => theme.spacing.sm};
      border-radius: ${({ theme }) => theme.radii.button};
    }
  }
  @media (max-width: 400px) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle; 