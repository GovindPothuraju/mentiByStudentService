import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';

// Lazy loaded page components
const Home = lazy(() => import('./pages/public/Home'));
const Dashboard = lazy(() => import('./pages/student/Dashboard'));
const Courses = lazy(() => import('./pages/student/Courses'));
const CourseDetails = lazy(() => import('./pages/student/CourseDetails'));
const TopicPage = lazy(() => import('./pages/student/TopicPage'));
const Roadmap = lazy(() => import('./pages/student/Roadmap'));
const Practice = lazy(() => import('./pages/student/Practice'));
const Profile = lazy(() => import('./pages/student/Profile'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 border-3 border-brand-yellow border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-brand-textSecondary font-semibold">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Marketing Route */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
            </Route>

            {/* Student Application Routes */}
            <Route path="/app" element={<StudentLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:courseSlug" element={<CourseDetails />} />
              <Route
                path="courses/:courseSlug/:categorySlug/:topicSlug"
                element={<TopicPage />}
              />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="roadmap/:courseSlug" element={<Roadmap />} />
              <Route path="practice" element={<Practice />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Convenience Redirects */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/courses" element={<Navigate to="/app/courses" replace />} />
            <Route path="/courses/:courseSlug" element={<Navigate to="/app/courses/:courseSlug" replace />} />
            <Route path="/roadmap" element={<Navigate to="/app/roadmap" replace />} />
            <Route path="/practice" element={<Navigate to="/app/practice" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
