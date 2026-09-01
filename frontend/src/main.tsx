import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsProvider';
import { ThemeProvider } from './context/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
     <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
           <App />
        </NotificationsProvider>
      </AuthProvider>
       </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);