import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import AuthModal from '../components/auth/AuthModal';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col text-brand-textPrimary">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-brand-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <span className="text-xl font-black tracking-tight text-brand-dark">Menti</span>
            <span className="text-xl font-black tracking-tight text-brand-yellow px-1 py-0.5 rounded bg-brand-dark leading-none">
              BY
            </span>
            <span className="text-xs text-brand-muted ml-2">Personalized Interview-Prep Learning OS</span>
          </div>
          <p className="text-xs text-brand-textSecondary">
            © {new Date().getFullYear()} MentiBY. Learn. Practice. Prepare. Get Interview Ready.
          </p>
        </div>
      </footer>
      <AuthModal />
    </div>
  );
};

export default PublicLayout;
