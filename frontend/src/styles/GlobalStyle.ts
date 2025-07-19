import { createGlobalStyle } from 'styled-components';
import 'styled-components';
import type theme from './theme';

declare module 'styled-components' {
  type Theme = typeof theme;
  export interface DefaultTheme extends Theme {}
}

const fontUrl = 'https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap';
const fontFace = `@import url('${fontUrl}');`;

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
    transition: box-shadow 0.2s, background 0.2s;
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