import { useState } from 'react';
import { AlertCircle, CheckCircle2, Leaf, Mail } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const redirect = searchParams.get('redirect');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const loggedInUser = await login(email, password);
    setIsLoading(false);

    if (!loggedInUser) {
      setError('Invalid email or password. Try the demo accounts listed below.');
      return;
    }

    if (loggedInUser.role === 'admin' && redirect !== 'checkout' && redirect !== 'orders') {
      navigate('/admin');
      return;
    }

    if (redirect === 'checkout') {
      navigate('/checkout');
      return;
    }

    if (redirect === 'orders') {
      navigate('/orders');
      return;
    }

    if (redirect === 'admin') {
      navigate('/admin');
      return;
    }

    navigate('/');
  };

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setResetError('');
    setResetMessage('');
    setIsSendingOtp(true);

    try {
      const response = await api.auth.forgotPassword(resetEmail);
      setResetMessage(response.message);
    } catch (sendError) {
      setResetError(sendError instanceof Error ? sendError.message : 'Failed to send OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setResetError('');
    setResetMessage('');

    if (newPassword !== confirmPassword) {
      setResetError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters.');
      return;
    }

    setIsResettingPassword(true);

    try {
      const response = await api.auth.resetPassword({
        email: resetEmail,
        otpCode,
        newPassword,
      });
      setResetMessage(response.message);
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (resetPasswordError) {
      setResetError(
        resetPasswordError instanceof Error ? resetPasswordError.message : 'Password reset failed.',
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Leaf className="w-10 h-10 text-emerald-700" />
            <span className="text-3xl font-serif text-emerald-950">Qamarun Beauty</span>
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900">Welcome Back</h1>
          <p className="text-neutral-600 mt-2">Sign in to shop, check out, and manage orders.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 text-sm text-emerald-900">
            <p className="font-semibold mb-2">Demo Credentials</p>
            <p>Admin: admin@qamarun.com / admin123</p>
            <p>User: user@example.com / user123</p>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword((current) => !current);
                  setResetError('');
                  setResetMessage('');
                  setResetEmail(email || resetEmail);
                }}
                className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition disabled:bg-neutral-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {showForgotPassword ? (
            <div className="mt-6 border-t border-neutral-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-semibold text-neutral-900">Reset with OTP</h2>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-3 mb-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email for OTP
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-2.5 border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-50 transition disabled:opacity-60"
                >
                  {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>

              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  placeholder="New password"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="w-full py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition disabled:opacity-60"
                >
                  {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              {resetError ? (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{resetError}</p>
                </div>
              ) : null}

              {resetMessage ? (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-900">{resetMessage}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 text-center text-sm text-neutral-600">
            Need an account?{' '}
            <Link to="/register" className="text-emerald-700 hover:text-emerald-800 font-medium">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
