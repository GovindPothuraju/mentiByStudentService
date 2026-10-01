import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Badge';
import Button from '../common/Button';

const AuthModal = () => {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(authModal.mode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keep state synced with modal mode
  React.useEffect(() => {
    setIsLogin(authModal.mode === 'login');
    setError('');
  }, [authModal.mode]);

  if (!authModal.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={authModal.isOpen}
      onClose={closeAuthModal}
      title={isLogin ? 'Welcome Back to MentiBY' : 'Create Your MentiBY Account'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold text-brand-textSecondary mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Govind Pothuraju"
              className="w-full px-3.5 py-2.5 bg-brand-surfaceHover border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:bg-white transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-brand-textSecondary mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            className="w-full px-3.5 py-2.5 bg-brand-surfaceHover border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-textSecondary mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-brand-surfaceHover border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:bg-white transition-all"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full py-3 font-bold mt-2"
        >
          {isLogin ? 'Sign In to Learning OS →' : 'Start Learning Free →'}
        </Button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs text-brand-textSecondary hover:text-brand-dark font-medium transition-colors"
          >
            {isLogin ? (
              <>Don't have an account? <span className="text-brand-dark font-bold underline">Register now</span></>
            ) : (
              <>Already registered? <span className="text-brand-dark font-bold underline">Log in</span></>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
