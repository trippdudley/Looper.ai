import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersonaSelector from './pages/PersonaSelector';
import ThesisPage from './pages/ThesisPage';
import LooperNarrative from './components/looper-narrative';
import GolferLayout from './personas/golfer/GolferLayout';
import GolferHome from './personas/golfer/pages/GolferHome';
import LessonHistory from './personas/golfer/pages/LessonHistory';
import LessonDetail from './personas/golfer/pages/LessonDetail';
import SwingProfile from './personas/golfer/pages/SwingProfile';
import Practice from './personas/golfer/pages/Practice';
import CoachLayout from './personas/coach/CoachLayout';
import CoachToday from './personas/coach/pages/CoachToday';
import StudentRoster from './personas/coach/pages/StudentRoster';
import StudentDetail from './personas/coach/pages/StudentDetail';
import SessionCapture from './personas/coach/pages/SessionCapture';
import SessionReview from './personas/coach/pages/SessionReview';
import Analytics from './personas/coach/pages/Analytics';
import CoachSession from './personas/coach/pages/CoachSession';
import FitterLayout from './personas/fitter/FitterLayout';
import GolferLookup from './personas/fitter/pages/GolferLookup';
import PreFittingBrief from './personas/fitter/pages/PreFittingBrief';
import FittingSession from './personas/fitter/pages/FittingSession';
import FittingReport from './personas/fitter/pages/FittingReport';
import EquipmentProfile from './personas/fitter/pages/EquipmentProfile';
import SpineLayout from './personas/spine/SpineLayout';
import DataSpine from './personas/spine/pages/DataSpine';
import AudienceEngine from './personas/spine/pages/AudienceEngine';
import IntegrationHub from './personas/spine/pages/IntegrationHub';
import CoachingOS from './pages/CoachingOS';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonaSelector />} />
        <Route path="/thesis" element={<ThesisPage />} />
        <Route path="/narrative" element={<LooperNarrative />} />
        <Route path="/coaching-os" element={<CoachingOS />} />

        <Route path="/golfer" element={<GolferLayout />}>
          <Route index element={<GolferHome />} />
          <Route path="lessons" element={<LessonHistory />} />
          <Route path="lessons/:id" element={<LessonDetail />} />
          <Route path="swing" element={<SwingProfile />} />
          <Route path="practice" element={<Practice />} />
        </Route>

        <Route path="/coach" element={<CoachLayout />}>
          <Route index element={<CoachToday />} />
          <Route path="students" element={<StudentRoster />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="capture" element={<SessionCapture />} />
          <Route path="review" element={<SessionReview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="session" element={<CoachSession />} />
        </Route>

        <Route path="/fitter" element={<FitterLayout />}>
          <Route index element={<GolferLookup />} />
          <Route path="brief" element={<PreFittingBrief />} />
          <Route path="session" element={<FittingSession />} />
          <Route path="report" element={<FittingReport />} />
          <Route path="equipment" element={<EquipmentProfile />} />
        </Route>

        <Route path="/spine" element={<SpineLayout />}>
          <Route index element={<DataSpine />} />
          <Route path="audience" element={<AudienceEngine />} />
          <Route path="integrations" element={<IntegrationHub />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
