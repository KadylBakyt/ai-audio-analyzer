import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import { AppProviders } from '@/app/providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingScreen } from '@/app/LoadingScreen';

// Code-split the main app shell for a smaller initial bundle.
const App = lazy(() => import('@/app/App'));

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <Suspense fallback={<LoadingScreen />}>
          <App />
        </Suspense>
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
);
