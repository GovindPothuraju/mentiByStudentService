import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const PublicNavbar = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-black tracking-tight text-brand-dark">Menti</span>
            <span className="text-2xl font-black tracking-tight text-brand-yellow px-1 py-0.5 rounded bg-brand-dark leading-none">
              BY
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-textSecondary">
            <a href="#how-it-works" className="hover:text-brand-dark transition-colors">How It Works</a>
            <a href="#roadmaps" className="hover:text-brand-dark transition-colors">Personalized Roadmaps</a>
            <a href="#courses" className="hover:text-brand-dark transition-colors">Courses</a>
            <a href="#interview" className="hover:text-brand-dark transition-colors">Interview Prep</a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/app/dashboard">
                <Button variant="primary" size="sm" className="font-bold">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="font-semibold text-brand-textPrimary"
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal('register')}
                  className="font-bold shadow-sm"
                >
                  Start Learning Free →
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
