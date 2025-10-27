"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { 
  signUpWithEmail, 
  loginWithEmail, 
  signInWithGoogle, 
  resetPassword,
  resendVerificationEmail,
  validatePassword 
} from '@/lib/authService';

export default function AuthPage() {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, errors: [] });
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.emailVerified) {
      router.push('/');
    }
  }, [currentUser, router]);

  // Password strength check
  useEffect(() => {
    if (signupData.password) {
      const validation = validatePassword(signupData.password);
      setPasswordStrength(validation);
    } else {
      setPasswordStrength({ isValid: false, errors: [] });
    }
  }, [signupData.password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await loginWithEmail(loginData.email, loginData.password);

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => router.push('/'), 1500);
    } else {
      setMessage({ type: 'error', text: result.error });
      
      if (result.needsVerification) {
        setShowVerificationPrompt(true);
        setUnverifiedUser(result.user);
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!passwordStrength.isValid) {
      setMessage({ type: 'error', text: 'Please fix password requirements' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await signUpWithEmail(
      signupData.email, 
      signupData.password, 
      signupData.username
    );

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setShowVerificationPrompt(true);
      setUnverifiedUser(result.user);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await signInWithGoogle();

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => router.push('/'), 1500);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await resetPassword(resetEmail);

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        setForgotPasswordMode(false);
        setResetEmail('');
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser) return;

    setLoading(true);
    const result = await resendVerificationEmail(unverifiedUser);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background Elements */}
      <div className="auth-bg-wrapper">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
        <div className="grid-pattern"></div>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`floating-particle particle-${i}`}></div>
        ))}
      </div>

      {/* Email Verification Prompt */}
      {showVerificationPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">📧 Verify Your Email</h3>
            <p className="text-gray-300 mb-6">
              We've sent a verification link to your email. Please check your inbox and verify your account before logging in.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Email'}
              </button>
              <button
                onClick={() => {
                  setShowVerificationPrompt(false);
                  setUnverifiedUser(null);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Forgot Password Modal */}
      {forgotPasswordMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 max-w-md mx-4 w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 mb-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 outline-none"
              />
              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {message.text}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(false);
                    setResetEmail('');
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Main Form Wrapper */}
      <div className={`wrapper ${isActive ? 'active' : ''}`}>
        <span className="rotate-bg"></span>
        <span className="rotate-bg2"></span>

        {/* Login Form */}
        <div className="form-box login">
          <h2 className="title animation" style={{ '--i': 0, '--j': 21 }}>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-box animation" style={{ '--i': 1, '--j': 22 }}>
              <input 
                type="email" 
                required
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              />
              <label>Email</label>
              <i className='bx bxs-envelope'></i>
            </div>

            <div className="input-box animation" style={{ '--i': 2, '--j': 23 }}>
              <input 
                type="password" 
                required
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
              <label>Password</label>
              <i className='bx bxs-lock-alt'></i>
            </div>

            {message.text && !isActive && (
              <div className={`message-box animation ${message.type}`} style={{ '--i': 3, '--j': 24 }}>
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              className="btn animation" 
              style={{ '--i': 4, '--j': 25 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="google-btn-wrapper animation" style={{ '--i': 5, '--j': 26 }}>
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="google-btn"
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="linkTxt animation" style={{ '--i': 6, '--j': 27 }}>
              <p>
                <a href="#" onClick={(e) => { e.preventDefault(); setForgotPasswordMode(true); }} className="forgot-link">
                  Forgot Password?
                </a>
              </p>
              <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsActive(true); }} className="register-link">Sign Up</a></p>
            </div>
          </form>
        </div>

        <div className="info-text login">
          <h2 className="animation" style={{ '--i': 0, '--j': 20 }}>Welcome Back!</h2>
          <p className="animation" style={{ '--i': 1, '--j': 21 }}>
            Log in to Lexi for AI-powered contract analysis.
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="form-box register">
          <h2 className="title animation" style={{ '--i': 17, '--j': 0 }}>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="input-box animation" style={{ '--i': 18, '--j': 1 }}>
              <input 
                type="text" 
                required
                value={signupData.username}
                onChange={(e) => setSignupData({...signupData, username: e.target.value})}
              />
              <label>Username</label>
              <i className='bx bxs-user'></i>
            </div>

            <div className="input-box animation" style={{ '--i': 19, '--j': 2 }}>
              <input 
                type="email" 
                required
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
              />
              <label>Email</label>
              <i className='bx bxs-envelope'></i>
            </div>

            <div className="input-box animation" style={{ '--i': 20, '--j': 3 }}>
              <input 
                type="password" 
                required
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
              />
              <label>Password</label>
              <i className='bx bxs-lock-alt'></i>
            </div>

            {signupData.password && (
              <div className="password-strength animation" style={{ '--i': 21, '--j': 4 }}>
                {passwordStrength.errors.map((error, index) => (
                  <div key={index} className="password-requirement">
                    <span className={passwordStrength.isValid ? 'valid' : 'invalid'}>
                      {passwordStrength.isValid ? '✓' : '✗'}
                    </span>
                    {error}
                  </div>
                ))}
              </div>
            )}

            {message.text && isActive && (
              <div className={`message-box animation ${message.type}`} style={{ '--i': 22, '--j': 5 }}>
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              className="btn animation" 
              style={{ '--i': 23, '--j': 6 }}
              disabled={loading || !passwordStrength.isValid}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="google-btn-wrapper animation" style={{ '--i': 24, '--j': 7 }}>
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="google-btn"
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </div>

            <div className="linkTxt animation" style={{ '--i': 25, '--j': 8 }}>
              <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsActive(false); }} className="login-link">Login</a></p>
            </div>
          </form>
        </div>

        <div className="info-text register">
          <h2 className="animation" style={{ '--i': 17, '--j': 0 }}>Join Lexi!</h2>
          <p className="animation" style={{ '--i': 18, '--j': 1 }}>
            Start protecting your interests with AI-powered contract analysis today.
          </p>
        </div>
      </div>
    </div>
  );
}
