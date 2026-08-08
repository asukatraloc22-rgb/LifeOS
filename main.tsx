import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { kernel } from '@/core/kernel/Kernel';
import { LockScreen } from '@/core/auth/LockScreen';
import App from './App.tsx';
import './index.css';

kernel.boot();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LockScreen>
        <App />
      </LockScreen>
    </BrowserRouter>
  </StrictMode>,
);
