import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SpeedInsights } from '@vercel/speed-insights/react';

const projectId = import.meta.env.VITE_VERCEL_SPEED_INSIGHTS_PROJECT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {projectId ? <SpeedInsights projectId={projectId} /> : null}
  </StrictMode>,
);
