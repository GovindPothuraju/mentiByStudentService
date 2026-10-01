import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const variants = {
    yellow: 'bg-brand-yellowSubtle text-brand-dark border-brand-yellowBorder font-semibold',
    neutral: 'bg-black/5 text-brand-textSecondary border-brand-border',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    dark: 'bg-brand-dark text-white border-brand-dark',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export const ProgressBar = ({ progress = 0, size = 'md', showLabel = false, className = '' }) => {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-brand-textSecondary mb-1.5">
          <span>Progress</span>
          <span className="text-brand-dark">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-[#EAE6DF] rounded-full overflow-hidden ${heights[size] || heights.md}`}>
        <div
          className="bg-brand-yellow h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-[#EFECE6] rounded-xl ${className}`} />;
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-brand-border`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
              <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-brand-muted hover:text-brand-dark transition-colors p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
