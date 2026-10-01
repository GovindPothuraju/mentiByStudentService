import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Flame,
  Bell,
  User,
  Compass,
  LayoutDashboard,
  Map,
  Code2,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      notificationService.getNotifications()
        .then((res) => {
          setNotifications(res.data?.notifications || []);
          setUnreadCount(res.data?.unreadCount || 0);
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const navLinks = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Courses', path: '/app/courses', icon: Compass },
    { label: 'Roadmap', path: '/app/roadmap', icon: Map },
    { label: 'Practice', path: '/app/practice', icon: Code2 },
  ];

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const streakDays = user?.streak?.currentStreak || user?.currentStreak || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className={location.pathname.startsWith('/app/courses/') && location.pathname.split('/').filter(Boolean).length >= 5 ? "w-full px-4 sm:px-6 lg:px-8" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/app/dashboard" className="flex items-center gap-1 group">
              <span className="text-2xl font-black tracking-tight text-brand-dark">Menti</span>
              <span className="text-2xl font-black tracking-tight text-brand-yellow px-1 py-0.5 rounded bg-brand-dark leading-none">
                BY
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-dark text-white'
                        : 'text-brand-textSecondary hover:text-brand-dark hover:bg-brand-surfaceHover'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-yellow' : 'text-current'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons: Streak, Notification, Profile */}
          <div className="flex items-center gap-3">
            {/* Streak Pill */}
            <div
              title={`${streakDays} Day Learning Streak`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellowSubtle border border-brand-yellowBorder text-brand-dark rounded-full text-xs font-bold shadow-sm"
            >
              <Flame className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
              <span>{streakDays} {streakDays === 1 ? 'Day' : 'Days'}</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-xl text-brand-textSecondary hover:text-brand-dark hover:bg-brand-surfaceHover transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-yellow rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-brand-border rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                    <h4 className="font-bold text-sm text-brand-dark">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-brand-textSecondary hover:text-brand-dark font-medium underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-brand-border/60 max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-brand-muted text-center py-6">No new notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n._id} className={`py-2.5 text-xs ${n.isRead ? 'opacity-70' : 'font-semibold'}`}>
                          <p className="text-brand-dark">{n.title}</p>
                          <p className="text-brand-textSecondary text-[11px] mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-brand-surfaceHover transition-colors border border-transparent hover:border-brand-border"
              >
                <div className="w-8 h-8 rounded-full bg-brand-dark text-brand-yellow font-bold text-xs flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-brand-muted hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-brand-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-brand-border mb-1">
                    <p className="text-xs font-bold text-brand-dark truncate">{user?.name || 'Student'}</p>
                    <p className="text-[11px] text-brand-muted truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/app/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-textPrimary hover:bg-brand-surfaceHover"
                  >
                    <User className="w-4 h-4 text-brand-muted" />
                    <span>My Profile & Progress</span>
                  </Link>
                  <Link
                    to="/app/roadmap"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-textPrimary hover:bg-brand-surfaceHover"
                  >
                    <Map className="w-4 h-4 text-brand-muted" />
                    <span>Active Roadmaps</span>
                  </Link>

                  <div className="border-t border-brand-border my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-brand-textSecondary hover:text-brand-dark"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-border py-3 space-y-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-brand-dark text-white' : 'text-brand-textSecondary hover:bg-brand-surfaceHover'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-yellow' : 'text-current'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default StudentNavbar;
