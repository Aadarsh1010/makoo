import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import MakooLogo from '../../components/MakooLogo';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, lockUntil } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle lock countdown
  useEffect(() => {
    if (lockUntil && Date.now() < lockUntil) {
      setIsLocked(true);
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsLocked(false);
          setLockCountdown(0);
          clearInterval(interval);
        } else {
          setLockCountdown(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsLocked(false);
      setLockCountdown(0);
    }
  }, [lockUntil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = login(username, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
      // Shake animation handled via CSS class on error
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="bg-white shadow-2xl p-10">
          <div className="flex justify-center mb-6">
            <MakooLogo size={80} color="#1B2A5E" />
          </div>
          
          <div className="text-center mb-8">
            <div className="font-sans text-[18px] font-semibold tracking-[1.5px] text-navy">MAKOO BAKERY</div>
            <div className="text-[13px] text-muted tracking-[1px] mt-0.5">ADMIN PORTAL</div>
          </div>

          <div className="h-px bg-gold/30 mb-7" />

          <h2 className="font-display text-center text-[32px] text-navy tracking-tight mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-navy tracking-widest mb-1.5">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-navy/20 bg-[#F9F3E8] px-4 py-3 text-sm focus:outline-none focus:border-navy"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-navy tracking-widest mb-1.5">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-navy/20 bg-[#F9F3E8] px-4 py-3 pr-12 text-sm focus:outline-none focus:border-navy"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gold"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="remember" className="accent-navy" />
              <label htmlFor="remember" className="text-xs text-navy/70">Remember this session</label>
            </div>

            <button
              type="submit"
              disabled={isLocked || isSubmitting}
              className="w-full py-3.5 bg-navy text-cream text-sm uppercase tracking-[0.08em] font-medium disabled:opacity-60 hover:bg-navy-dark transition disabled:cursor-not-allowed"
            >
              {isLocked ? `ACCOUNT LOCKED (${lockCountdown}s)` : isSubmitting ? 'VERIFYING...' : 'ENTER ADMIN PANEL'}
            </button>

            {error && (
              <div className="text-red-600 text-xs text-center pt-1 animate-[shake_0.4s_ease-in-out]">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t text-center text-[10px] text-muted tracking-widest">
            DEMO CREDENTIALS: makoo / makoo1988
          </div>
        </div>

        <p className="text-center text-[10px] text-navy/40 mt-6 tracking-wider">SECURE ACCESS FOR AUTHORIZED PERSONNEL ONLY</p>
      </div>

      {/* Add shake animation inline via style if needed */}
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
