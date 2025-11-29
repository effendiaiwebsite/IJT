import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Loader } from './components/common';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth';

// Lazy load page components for better performance
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const LevelSelection = lazy(() => import('./pages/LevelSelection'));
const ExamList = lazy(() => import('./pages/ExamList'));
const ExamDetails = lazy(() => import('./pages/ExamDetails'));
const LearningJourney = lazy(() => import('./pages/LearningJourney'));
const ChapterList = lazy(() => import('./pages/ChapterList'));
const TutorialViewer = lazy(() => import('./pages/TutorialViewer'));
const ChapterTest = lazy(() => import('./pages/ChapterTest'));
const TestResults = lazy(() => import('./pages/TestResults'));
const TestSolutions = lazy(() => import('./pages/TestSolutions'));
const ProfileDashboard = lazy(() => import('./pages/ProfileDashboard'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Loader size="lg" />
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Education Level Selection */}
        <Route path="/select-level" element={<LevelSelection />} />

        {/* Exam Routes - Public (browsing) */}
        <Route path="/exams/:level" element={<ExamList />} />
        <Route path="/exam/:examId" element={<ExamDetails />} />

        {/* Protected Routes - Require Authentication */}
        {/* Learning Journey */}
        <Route
          path="/exam/:examId/journey"
          element={
            <ProtectedRoute>
              <LearningJourney />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/:examId/subject/:subjectId"
          element={
            <ProtectedRoute>
              <ChapterList />
            </ProtectedRoute>
          }
        />

        {/* Tutorial and Test Routes */}
        <Route
          path="/exam/:examId/subject/:subjectId/chapter/:chapterId/tutorial"
          element={
            <ProtectedRoute>
              <TutorialViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/:examId/subject/:subjectId/chapter/:chapterId/test"
          element={
            <ProtectedRoute>
              <ChapterTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/:examId/subject/:subjectId/chapter/:chapterId/results"
          element={
            <ProtectedRoute>
              <TestResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/:examId/subject/:subjectId/chapter/:chapterId/solutions"
          element={
            <ProtectedRoute>
              <TestSolutions />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          }
        />

        {/* Progress */}
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
