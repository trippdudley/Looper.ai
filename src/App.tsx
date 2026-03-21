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
const CoachingOS = lazy(() => import('./pages/CoachingOS'));

const PlayerLayout = lazy(() => import('./personas/player/PlayerLayout'));
const GolferLayout = lazy(() => import('./personas/golfer/GolferLayout'));
const GolferHome = lazy(() => import('./personas/golfer/pages/GolferHome'));
const LessonHistory = lazy(() => import('./personas/golfer/pages/LessonHistory'));
const LessonDetail = lazy(() => import('./personas/golfer/pages/LessonDetail'));
const SwingProfile = lazy(() => import('./personas/golfer/pages/SwingProfile'));
const Practice = lazy(() => import('./personas/golfer/pages/Practice'));

const CoachLayout = lazy(() => import('./personas/coach/CoachLayout'));
const CoachToday = lazy(() => import('./personas/coach/pages/CoachToday'));
const StudentRoster = lazy(() => import('./personas/coach/pages/StudentRoster'));
const StudentDetail = lazy(() => import('./personas/coach/pages/StudentDetail'));
const SessionCapture = lazy(() => import('./personas/coach/pages/SessionCapture'));
const SessionReview = lazy(() => import('./personas/coach/pages/SessionReview'));
const PreSessionBrief = lazy(() => import('./personas/coach/pages/PreSessionBrief'));
const Analytics = lazy(() => import('./personas/coach/pages/Analytics'));
const CoachSession = lazy(() => import('./personas/coach/pages/CoachSession'));

const FitterLayout = lazy(() => import('./personas/fitter/FitterLayout'));
const GolferLookup = lazy(() => import('./personas/fitter/pages/GolferLookup'));
const PreFittingBrief = lazy(() => import('./personas/fitter/pages/PreFittingBrief'));
const FittingSession = lazy(() => import('./personas/fitter/pages/FittingSession'));
const FittingReport = lazy(() => import('./personas/fitter/pages/FittingReport'));
const EquipmentProfile = lazy(() => import('./personas/fitter/pages/EquipmentProfile'));

const SpineLayout = lazy(() => import('./personas/spine/SpineLayout'));
const DataSpine = lazy(() => import('./personas/spine/pages/DataSpine'));
const AudienceEngine = lazy(() => import('./personas/spine/pages/AudienceEngine'));
const IntegrationHub = lazy(() => import('./personas/spine/pages/IntegrationHub'));

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

          <Route path="/player" element={<ErrorBoundary fallbackTitle="Player view error"><PlayerLayout /></ErrorBoundary>} />

          <Route path="/golfer" element={<ErrorBoundary fallbackTitle="Golfer view error"><GolferLayout /></ErrorBoundary>}>
            <Route index element={<GolferHome />} />
            <Route path="lessons" element={<LessonHistory />} />
            <Route path="lessons/:id" element={<LessonDetail />} />
            <Route path="swing" element={<SwingProfile />} />
            <Route path="practice" element={<Practice />} />
          </Route>

          <Route path="/coach" element={<ErrorBoundary fallbackTitle="Coach view error"><CoachLayout /></ErrorBoundary>}>
            <Route index element={<CoachToday />} />
            <Route path="students" element={<StudentRoster />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="brief/:id" element={<PreSessionBrief />} />
            <Route path="capture" element={<SessionCapture />} />
            <Route path="review" element={<SessionReview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="session" element={<CoachSession />} />
            <Route path="live" element={<CoachingOS />} />
          </Route>

          <Route path="/fitter" element={<ErrorBoundary fallbackTitle="Fitter view error"><FitterLayout /></ErrorBoundary>}>
            <Route index element={<GolferLookup />} />
            <Route path="brief" element={<PreFittingBrief />} />
            <Route path="session" element={<FittingSession />} />
            <Route path="report" element={<FittingReport />} />
            <Route path="equipment" element={<EquipmentProfile />} />
          </Route>

          <Route path="/spine" element={<ErrorBoundary fallbackTitle="Platform view error"><SpineLayout /></ErrorBoundary>}>
            <Route index element={<DataSpine />} />
            <Route path="audience" element={<AudienceEngine />} />
            <Route path="integrations" element={<IntegrationHub />} />
          </Route>
        </Routes>
      </Suspense>

      {/* Cross-persona demo walkthrough banner */}
      <DemoWalkthroughBanner currentPath={location.pathname} />
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
