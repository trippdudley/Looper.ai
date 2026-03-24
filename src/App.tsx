import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import DemoWalkthroughBanner from './components/ui/DemoWalkthroughBanner';
import { SkeletonCard } from './components/ui/Skeleton';

// Eagerly loaded (landing page — must be fast)
import PersonaSelector from './pages/PersonaSelector';

// Lazy-loaded persona routes
const ThesisPage = lazy(() => import('./pages/ThesisPage'));
const LooperNarrative = lazy(() => import('./components/looper-narrative'));
const SizzleReel = lazy(() => import('./pages/SizzleReel'));
const EvolutionPage = lazy(() => import('./pages/EvolutionPage'));
const CoachingOS = lazy(() => import('./pages/LiveSessionSideline'));
const TrackmanIntegration = lazy(() => import('./lesson-sidebar/LiveSessionSideline'));

const PlayerLayout = lazy(() => import('./personas/player/PlayerLayout'));

const CoachLayout = lazy(() => import('./personas/coach/CoachLayout'));
const CoachToday = lazy(() => import('./personas/coach/pages/CoachToday'));
const StudentRoster = lazy(() => import('./personas/coach/pages/StudentRoster'));
const StudentDetail = lazy(() => import('./personas/coach/pages/StudentDetail'));
const SessionCapture = lazy(() => import('./personas/coach/pages/SessionCapture'));
const SessionReview = lazy(() => import('./personas/coach/pages/SessionReview'));
const PreSessionBrief = lazy(() => import('./personas/coach/pages/PreSessionBrief'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-4">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={2} />
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<PersonaSelector />} />
          <Route path="/thesis" element={<ErrorBoundary><ThesisPage /></ErrorBoundary>} />
          <Route path="/narrative" element={<ErrorBoundary><LooperNarrative /></ErrorBoundary>} />
          <Route path="/coaching-os" element={<Navigate to="/coach/live" replace />} />
          <Route path="/vision" element={<ErrorBoundary><SizzleReel /></ErrorBoundary>} />
          <Route path="/trackman" element={<ErrorBoundary fallbackTitle="Trackman view error"><TrackmanIntegration /></ErrorBoundary>} />
          <Route path="/evolution" element={<ErrorBoundary><EvolutionPage /></ErrorBoundary>} />

          <Route path="/player" element={<ErrorBoundary fallbackTitle="Player view error"><PlayerLayout /></ErrorBoundary>} />

          <Route path="/coach" element={<ErrorBoundary fallbackTitle="Coach view error"><CoachLayout /></ErrorBoundary>}>
            <Route index element={<CoachToday />} />
            <Route path="students" element={<StudentRoster />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="brief/:id" element={<PreSessionBrief />} />
            <Route path="capture" element={<SessionCapture />} />
            <Route path="review" element={<SessionReview />} />
            <Route path="live" element={<CoachingOS />} />
            <Route path="trackman" element={<TrackmanIntegration />} />
          </Route>
        </Routes>
      </Suspense>

      {/* Cross-persona demo walkthrough banner (hidden on sideline demo which has its own nav) */}
      {!location.pathname.startsWith('/coach/live') && <DemoWalkthroughBanner currentPath={location.pathname} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
