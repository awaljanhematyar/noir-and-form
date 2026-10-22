/** Browser entry mounts the shared shopping provider and client-side router. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './app/Store';
import App from './app/App';
import './styles/index.css';

// ========================================
// APPLICATION BOOTSTRAP
// ========================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
