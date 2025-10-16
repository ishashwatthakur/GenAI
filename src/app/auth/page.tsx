"use client";

import { useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

// --- TYPE DEFINITIONS ---
interface ILoginData {
  username: string;
  password: string;
}

interface ISignupData {
  username: string;
  email: string;
  password: string;
}

// Define a type for the inline style properties for animation delays
interface AnimationStyle extends React.CSSProperties {
  '--i': number;
  '--j': number;
}

export default function AuthPage(): JSX.Element {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<ILoginData>({ username: '', password: '' });
  const [signupData, setSignupData] = useState<ISignupData>({ username: '', email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', loginData.username);
      router.push('/');
    }
  };

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signupData.username && signupData.email && signupData.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', signupData.username);
      router.push('/');
    }
  };
  
  const toggleActive = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsActive(prev => !prev);
  }

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

      {/* Main Form Wrapper */}
      <div className={`wrapper ${isActive ? 'active' : ''}`}>
        <span className="rotate-bg"></span>
        <span className="rotate-bg2"></span>

        {/* Login Form */}
        <div className="form-box login">
          <h2 className="title animation" style={{ '--i': 0, '--j': 21 } as AnimationStyle}>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-box animation" style={{ '--i': 1, '--j': 22 } as AnimationStyle}>
              <input 
                type="text" 
                required
                value={loginData.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginData({...loginData, username: e.target.value})}
              />
              <label>Username</label>
              <i className='bx bxs-user'></i>
            </div>

            <div className="input-box animation" style={{ '--i': 2, '--j': 23 } as AnimationStyle}>
              <input 
                type="password" 
                required
                value={loginData.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginData({...loginData, password: e.target.value})}
              />
              <label>Password</label>
              <i className='bx bxs-lock-alt'></i>
            </div>

            <button type="submit" className="btn animation" style={{ '--i': 3, '--j': 24 } as AnimationStyle}>
              Login
            </button>

            <div className="linkTxt animation" style={{ '--i': 5, '--j': 25 } as AnimationStyle}>
              <p>Don't have an account? <a href="#" onClick={toggleActive} className="register-link">Sign Up</a></p>
            </div>
          </form>
        </div>

        <div className="info-text login">
          <h2 className="animation" style={{ '--i': 0, '--j': 20 } as AnimationStyle}>Welcome Back!</h2>
          <p className="animation" style={{ '--i': 1, '--j': 21 } as AnimationStyle}>
            Log in to Lexi for AI-powered contract analysis.
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="form-box register">
          <h2 className="title animation" style={{ '--i': 17, '--j': 0 } as AnimationStyle}>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="input-box animation" style={{ '--i': 18, '--j': 1 } as AnimationStyle}>
              <input 
                type="text" 
                required
                value={signupData.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupData({...signupData, username: e.target.value})}
              />
              <label>Username</label>
              <i className='bx bxs-user'></i>
            </div>

            <div className="input-box animation" style={{ '--i': 19, '--j': 2 } as AnimationStyle}>
              <input 
                type="email" 
                required
                value={signupData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupData({...signupData, email: e.target.value})}
              />
              <label>Email</label>
              <i className='bx bxs-envelope'></i>
            </div>

            <div className="input-box animation" style={{ '--i': 20, '--j': 3 } as AnimationStyle}>
              <input 
                type="password" 
                required
                value={signupData.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupData({...signupData, password: e.target.value})}
              />
              <label>Password</label>
              <i className='bx bxs-lock-alt'></i>
            </div>

            <button type="submit" className="btn animation" style={{ '--i': 21, '--j': 4 } as AnimationStyle}>
              Sign Up
            </button>

            <div className="linkTxt animation" style={{ '--i': 22, '--j': 5 } as AnimationStyle}>
              <p>Already have an account? <a href="#" onClick={toggleActive} className="login-link">Login</a></p>
            </div>
          </form>
        </div>

        <div className="info-text register">
          <h2 className="animation" style={{ '--i': 17, '--j': 0 } as AnimationStyle}>Join Lexi!</h2>
          <p className="animation" style={{ '--i': 18, '--j': 1 } as AnimationStyle}>
            Start protecting your interests with AI-powered contract analysis today.
          </p>
        </div>
      </div>
    </div>
  );
}