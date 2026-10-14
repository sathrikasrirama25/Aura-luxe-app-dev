import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  User,
  Crown,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [emailInput, setEmailInput] = useState('');
  
  // Registration Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupNewsletter, setSignupNewsletter] = useState(true);

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authProvider, setAuthProvider] = useState(null); // 'google', 'github', 'apple'
  const [showOAuthPopup, setShowOAuthPopup] = useState(false);

  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const triggerLoginSuccess = (userProfile) => {
    // Fire festive luxury confetti
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#818cf8', '#fbbf24', '#34d399', '#f43f5e']
      });
    } catch (e) {}

    onLoginSuccess(userProfile);
    onClose();
  };

  const handleStartOAuth = (provider) => {
    setAuthProvider(provider);
    setShowOAuthPopup(true);
  };

  const handleConfirmOAuth = (userType = 'standard') => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setShowOAuthPopup(false);

      let userProfile;
      if (authProvider === 'github') {
        userProfile = {
          id: 'usr_gh_338183459',
          name: 'Sathrika Srirama',
          email: 'sathrikasrirama25@users.noreply.github.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          provider: 'GitHub OAuth 2.0',
          tier: 'VIP Gold Connoisseur',
          points: 3600,
          ordersCount: 4,
          savedAddress: {
            name: 'Sathrika Srirama',
            doorNo: 'Penthouse 12B',
            street: 'Indiranagar 100ft Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pinCode: '560038',
            mobile: '+91 98450 12345'
          }
        };
      } else if (authProvider === 'apple') {
        userProfile = {
          id: 'usr_apple_9921',
          name: 'Sophia Chen',
          email: 'sophia.chen@privaterelay.appleid.com',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
          provider: 'Apple ID OAuth',
          tier: 'Luxe Elite Member',
          points: 6200,
          ordersCount: 7,
          savedAddress: {
            name: 'Sophia Chen',
            doorNo: 'Flat 402, Skyline Towers',
            street: 'Bandra West, Hill Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400050',
            mobile: '+91 98200 54321'
          }
        };
      } else {
        // Google Default
        userProfile = {
          id: 'usr_google_10284',
          name: 'Alex Mercer',
          email: 'alex.mercer.luxe@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          provider: 'Google Identity OAuth',
          tier: 'VIP Gold Member',
          points: 4850,
          ordersCount: 5,
          savedAddress: {
            name: 'Alex Mercer',
            doorNo: 'Villa 7, Palm Meadows',
            street: 'Whitefield Main Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pinCode: '560066',
            mobile: '+91 99001 88776'
          }
        };
      }

      triggerLoginSuccess(userProfile);
    }, 700);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      const namePart = emailInput.split('@')[0];
      const cleanName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const userProfile = {
        id: `usr_em_${Date.now()}`,
        name: cleanName,
        email: emailInput.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
        provider: 'Magic Link / Email',
        tier: 'Member',
        points: 500,
        ordersCount: 0,
        savedAddress: null
      };

      triggerLoginSuccess(userProfile);
    }, 800);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) return;

    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      const userProfile = {
        id: `usr_reg_${Date.now()}`,
        name: signupName.trim(),
        email: signupEmail.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(signupName.trim())}`,
        provider: 'Aura Luxe VIP Member',
        tier: 'VIP Gold Member',
        points: 500, // 500 bonus points for new signup
        ordersCount: 0,
        savedAddress: null
      };

      triggerLoginSuccess(userProfile);
    }, 800);
  };

  return (
    <div className="modal-backdrop" ref={modalRef} onClick={onClose}>
      <div
        className="modal-content auth-modal-box"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '490px' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!showOAuthPopup ? (
          <div className="auth-modal-inner">
            {/* Header Badge & Title */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div className="auth-brand-badge">
                <Crown size={20} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                {mode === 'signin' ? 'Welcome Back to Aura Luxe' : 'Create Your VIP Account'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
                {mode === 'signin'
                  ? 'Sign in to access saved addresses, wishlist, and VIP member perks.'
                  : 'Join today for 20% off your first order + 500 VIP reward points.'}
              </p>
            </div>

            {/* Mode Switcher Tabs: Sign In vs Sign Up */}
            <div className="auth-mode-tabs">
              <button
                type="button"
                className={`auth-mode-tab ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => setMode('signin')}
              >
                <Lock size={14} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className={`auth-mode-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                <Sparkles size={14} color="#fbbf24" />
                <span>Create Account / Sign Up</span>
                <span className="auth-tab-badge">+500 pts</span>
              </button>
            </div>

            {/* OAuth Buttons Stack */}
            <div className="oauth-buttons-stack" style={{ marginTop: '16px' }}>
              {/* Google OAuth Button */}
              <button
                type="button"
                className="oauth-btn oauth-google"
                onClick={() => handleStartOAuth('google')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{mode === 'signin' ? 'Continue with Google' : 'Sign Up with Google OAuth'}</span>
              </button>

              {/* GitHub OAuth Button */}
              <button
                type="button"
                className="oauth-btn oauth-github"
                onClick={() => handleStartOAuth('github')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>{mode === 'signin' ? 'Continue with GitHub' : 'Sign Up with GitHub OAuth'}</span>
              </button>

              {/* Apple OAuth Button */}
              <button
                type="button"
                className="oauth-btn oauth-apple"
                onClick={() => handleStartOAuth('apple')}
              >
                <svg width="19" height="19" viewBox="0 0 170 170" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.83-12.01-14.28-5.77-8.62-10.33-18.43-13.68-29.43-3.35-11-5.02-21.68-5.02-32.04 0-14.4 3.75-26.4 11.24-36.01 7.5-9.61 16.89-14.53 28.18-14.78 4.8 0 10.04 1.25 15.73 3.76 5.68 2.5 9.4 3.82 11.16 3.94 1.55-.13 5.37-1.46 11.46-4 6.09-2.54 11.37-3.71 15.84-3.52 11.75.52 21.09 4.67 28.02 12.44-10.45 6.33-15.54 15.03-15.26 26.11.28 8.68 3.65 15.86 10.11 21.53 6.46 5.66 14.15 8.9 23.08 9.71-2.02 6.04-4.53 12.05-7.53 18.04zM119.22 31.95c0-7.39 2.65-14.18 7.96-20.37 5.3-6.19 11.77-10.05 19.4-11.58.55 7.42-2.12 14.36-8.02 20.81-5.9 6.46-12.35 10.17-19.34 11.14z" />
                </svg>
                <span>{mode === 'signin' ? 'Continue with Apple' : 'Sign Up with Apple ID'}</span>
              </button>
            </div>

            <div className="auth-divider">
              <span>{mode === 'signin' ? 'or sign in with email' : 'or register with email'}</span>
            </div>

            {mode === 'signin' ? (
              /* Sign In with Magic Link Form */
              <form onSubmit={handleEmailSubmit} style={{ marginTop: '14px' }}>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Mail
                    size={18}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    className="auth-input-field"
                    placeholder="name@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  disabled={isAuthorizing}
                  style={{ width: '100%', padding: '13px', fontSize: '0.95rem', justifyContent: 'center' }}
                >
                  {isAuthorizing ? (
                    <span>Generating Secure Link...</span>
                  ) : (
                    <>
                      <span>Sign In with Magic Link</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Full Sign Up / Registration Form */
              <form onSubmit={handleSignupSubmit} style={{ marginTop: '14px' }}>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <User
                    size={17}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    className="auth-input-field"
                    placeholder="Full Name (e.g. Liam Sterling)"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>

                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <Mail
                    size={17}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    className="auth-input-field"
                    placeholder="Email Address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>

                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Lock
                    size={17}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    className="auth-input-field"
                    placeholder="Create a Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>

                {/* VIP Perks checklist */}
                <div className="signup-perks-box">
                  <div className="signup-perk-item">
                    <Check size={14} color="#10b981" />
                    <span>Instant 20% discount coupon</span>
                  </div>
                  <div className="signup-perk-item">
                    <Check size={14} color="#10b981" />
                    <span>500 VIP reward points on signup</span>
                  </div>
                  <div className="signup-perk-item">
                    <Check size={14} color="#10b981" />
                    <span>Live GPS order timeline tracking</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  disabled={isAuthorizing}
                  style={{ width: '100%', padding: '13px', fontSize: '0.95rem', justifyContent: 'center', marginTop: '12px' }}
                >
                  {isAuthorizing ? (
                    <span>Creating VIP Account...</span>
                  ) : (
                    <>
                      <span>Complete VIP Registration ✨</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Fast Demo Testing Switcher */}
            <div className="demo-accounts-box">
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: '800', letterSpacing: '0.05em' }}>
                ⚡ Fast 1-Click Demo Profiles:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="demo-pill-btn"
                  onClick={() => {
                    setAuthProvider('google');
                    handleConfirmOAuth('vip');
                  }}
                >
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Alex" />
                  <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#fff' }}>Alex Mercer</div>
                    <div style={{ fontSize: '0.68rem', color: '#fbbf24' }}>VIP Gold Member</div>
                  </div>
                </button>

                <button
                  type="button"
                  className="demo-pill-btn"
                  onClick={() => {
                    setAuthProvider('github');
                    handleConfirmOAuth('github');
                  }}
                >
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Sathrika" />
                  <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#fff' }}>Sathrika S.</div>
                    <div style={{ fontSize: '0.68rem', color: '#a5b4fc' }}>GitHub Account</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Toggle Link */}
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.84rem', color: '#94a3b8' }}>
              {mode === 'signin' ? (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Create one & get 20% off
                  </button>
                </span>
              ) : (
                <span>
                  Already an Aura Luxe member?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Sign In here
                  </button>
                </span>
              )}
            </div>

            {/* Security Guarantee */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.74rem', color: '#64748b' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>256-Bit SSL Encrypted OAuth 2.0 Authentication</span>
            </div>
          </div>
        ) : (
          /* Realistic Simulated OAuth Consent Dialog */
          <div className="oauth-consent-screen">
            <div className="consent-provider-header">
              {authProvider === 'google' && (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginTop: '10px' }}>
                    {mode === 'signup' ? 'Create Account with Google' : 'Sign In with Google'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Choose an account to continue to <strong>Aura Luxe</strong>
                  </p>
                </>
              )}

              {authProvider === 'github' && (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginTop: '10px' }}>
                    Authorize Aura Luxe via GitHub
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Aura Luxe will receive read access to your public profile & verified email.
                  </p>
                </>
              )}

              {authProvider === 'apple' && (
                <>
                  <svg width="28" height="28" viewBox="0 0 170 170" fill="#fff">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.83-12.01-14.28-5.77-8.62-10.33-18.43-13.68-29.43-3.35-11-5.02-21.68-5.02-32.04 0-14.4 3.75-26.4 11.24-36.01 7.5-9.61 16.89-14.53 28.18-14.78 4.8 0 10.04 1.25 15.73 3.76 5.68 2.5 9.4 3.82 11.16 3.94 1.55-.13 5.37-1.46 11.46-4 6.09-2.54 11.37-3.71 15.84-3.52 11.75.52 21.09 4.67 28.02 12.44-10.45 6.33-15.54 15.03-15.26 26.11.28 8.68 3.65 15.86 10.11 21.53 6.46 5.66 14.15 8.9 23.08 9.71-2.02 6.04-4.53 12.05-7.53 18.04zM119.22 31.95c0-7.39 2.65-14.18 7.96-20.37 5.3-6.19 11.77-10.05 19.4-11.58.55 7.42-2.12 14.36-8.02 20.81-5.9 6.46-12.35 10.17-19.34 11.14z" />
                  </svg>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginTop: '10px' }}>
                    Sign in with Apple ID
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Authenticate securely using Apple Touch ID or Face ID.
                  </p>
                </>
              )}
            </div>

            {/* Account Selection Card */}
            <div className="consent-account-card" onClick={() => handleConfirmOAuth()}>
              <img
                src={
                  authProvider === 'github'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    : authProvider === 'apple'
                    ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
                }
                alt="Profile"
                className="consent-avatar"
              />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
                  {authProvider === 'github'
                    ? 'sathrikasrirama25'
                    : authProvider === 'apple'
                    ? 'Sophia Chen'
                    : 'Alex Mercer'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {authProvider === 'github'
                    ? 'sathrikasrirama25@users.noreply.github.com'
                    : authProvider === 'apple'
                    ? 'sophia.chen@privaterelay.appleid.com'
                    : 'alex.mercer.luxe@gmail.com'}
                </div>
              </div>
              <CheckCircle2 size={18} color="#10b981" />
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowOAuthPopup(false)}
                disabled={isAuthorizing}
                style={{ padding: '12px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-gold"
                onClick={() => handleConfirmOAuth()}
                disabled={isAuthorizing}
                style={{ padding: '12px', justifyContent: 'center' }}
              >
                {isAuthorizing ? 'Authorizing...' : mode === 'signup' ? 'Authorize & Sign Up' : 'Authorize & Sign In'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
