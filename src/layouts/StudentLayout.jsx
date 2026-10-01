import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentNavbar from '../components/navigation/StudentNavbar';
import AuthModal from '../components/auth/AuthModal';
import Button from '../components/common/Button';

const StudentLayout = () => {
  const { isAuthenticated, loading, openAuthModal } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-brand-textSecondary tracking-wider uppercase">Loading MentiBY...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-canvas flex flex-col">
        <StudentNavbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-brand-border rounded-2xl p-8 text-center shadow-lg">
            <div className="w-12 h-12 bg-brand-yellowSubtle text-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-yellowBorder">
              🔒
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">Student Session Required</h2>
            <p className="text-sm text-brand-textSecondary mb-6">
              Please sign in to access your personal dashboard, track streaks, and follow your customized roadmaps.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                onClick={() => openAuthModal('login')}
                className="w-full font-bold py-3"
              >
                Sign In to MentiBY →
              </Button>
              <Button
                variant="secondary"
                onClick={() => openAuthModal('register')}
                className="w-full font-medium"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
        <AuthModal />
      </div>
    );
  }

  const isTopicView =
    location.pathname.startsWith('/app/courses/') &&
    location.pathname.split('/').filter(Boolean).length >= 5;

  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col text-brand-textPrimary">
      <StudentNavbar />
      <main
        className={
          isTopicView
            ? 'flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col'
            : 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'
        }
      >
        <Outlet />
      </main>
      <AuthModal />
    </div>
  );
};

export default StudentLayout;
