import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Target, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page View Component.
 * Styled with a modern glassmorphic theme matching the Startup CRM Lite layout.
 */
const Login = () => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Background blur shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl flex flex-col space-y-6 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl">
            <Target size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-2">Startup CRM Lite</h2>
          <p className="text-slate-400 text-sm">Sign in to manage your sales pipeline</p>
        </div>

        {/* Local Error Alert */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="you@example.com"
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center text-sm text-slate-400 border-t border-slate-700/40 pt-4">
          New to the platform?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-150">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
