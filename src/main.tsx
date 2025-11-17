import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from './components/Router.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </StrictMode>
);
