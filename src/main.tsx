import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MsalAuthProvider } from "./providers/MsalProvider";
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MsalAuthProvider>
        <App />
      </MsalAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
