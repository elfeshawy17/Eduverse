import React, { useState } from 'react';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import onlineEducationImg from '../assets/online-education.png';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error } = useAuth();

  const redirectWithToken = (role: string, token: string) => {
    const encodedToken = encodeURIComponent(token);
    
    switch (role) {
      case 'admin':
        window.location.href = `http://localhost:5174/eduverse/admin?token=${encodedToken}`;
        break;
      case 'professor':
        window.location.href = `http://localhost:5175/eduverse/professor/home?token=${encodedToken}`;
        break;
      case 'student':
        window.location.href = `http://localhost:5176/eduverse?token=${encodedToken}`;
        break;
      default:
        window.location.href = `${window.location.origin}/student?token=${encodedToken}`;
    }
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (submitAttempted) {
      const { errors } = validateLoginForm(e.target.value, password);
      setFormErrors({ ...formErrors, email: errors.email });
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (submitAttempted) {
      const { errors } = validateLoginForm(email, e.target.value);
      setFormErrors({ ...formErrors, password: errors.password });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setSubmitAttempted(true);
    setIsSubmitting(true);
    
    try {
      const validation = validateLoginForm(email, password);
      setFormErrors(validation.errors);
      
      if (validation.isValid) {
        const result = await login({ email, password });
        if (result) {
          redirectWithToken(result.role, result.token);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left: Illustration Panel */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-blue-700 relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-0"
             style={{
               background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.28) 0%, rgba(41,98,255,0.10) 60%, rgba(33, 150, 243, 0.01) 100%)',
               filter: 'blur(8px)'
             }} />
        {/* Decorative dots and lines */}
        <span className="absolute left-12 top-10 w-4 h-4 rounded-full bg-yellow-400 opacity-90"></span>
        <span className="absolute left-1/2 top-24 w-3 h-3 rounded-full bg-green-400 opacity-80"></span>
        <span className="absolute right-20 top-32 w-2 h-2 rounded-full bg-pink-400 opacity-80"></span>
        <span className="absolute left-24 bottom-24 w-3 h-3 rounded-full bg-purple-400 opacity-70"></span>
        <span className="absolute right-16 bottom-16 w-4 h-1 rounded bg-white opacity-60 rotate-12"></span>
        <span className="absolute left-32 top-1/2 w-2 h-6 rounded bg-white opacity-40 rotate-45"></span>
        {/* Central photo illustration */}
        <img src={onlineEducationImg} alt="Online Education" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 object-contain z-10" />
        {/* Floating cards: mailbox, clock */}
        <svg className="absolute left-32 top-36 w-28 h-20 z-20" viewBox="0 0 112 80" fill="none">
          <rect x="0" y="0" width="112" height="80" rx="14" fill="#fff"/>
          {/* Mailbox icon */}
          <rect x="24" y="28" width="32" height="20" rx="4" fill="#90caf9"/>
          <rect x="32" y="36" width="16" height="4" rx="2" fill="#fff"/>
          <rect x="40" y="44" width="8" height="4" rx="2" fill="#1976d2"/>
          <rect x="60" y="36" width="20" height="8" rx="2" fill="#ce93d8"/>
        </svg>
        <svg className="absolute right-32 top-44 w-24 h-16 z-20" viewBox="0 0 96 64" fill="none">
          <rect x="0" y="0" width="96" height="64" rx="12" fill="#fff"/>
          {/* Clock icon */}
          <circle cx="72" cy="24" r="12" fill="#a5d6a7"/>
          <rect x="71" y="16" width="2" height="8" rx="1" fill="#fff"/>
          <rect x="72" y="24" width="8" height="2" rx="1" fill="#fff"/>
        </svg>
        {/* Headline at the bottom */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-96 text-center z-30">
          <h2 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">Empowering Academic Excellence</h2>
        </div>
      </div>

      {/* Right: Login Form Panel */}
      <div className="flex w-full md:w-1/2 min-h-screen items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white relative">
        {/* Subtle abstract background shapes */}
        <svg className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none" viewBox="0 0 256 256" fill="none">
          <circle cx="128" cy="128" r="128" fill="#90caf9"/>
        </svg>
        <svg className="absolute bottom-0 left-0 w-48 h-48 opacity-10 pointer-events-none" viewBox="0 0 192 192" fill="none">
          <rect x="0" y="0" width="192" height="192" rx="96" fill="#ce93d8"/>
        </svg>
        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="large" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome to <span className="text-primary">Eduverse</span>
            </h1>
            <p className="text-gray-600 mt-2">Your gateway to educational excellence</p>
          </div>

          {/* Glassmorphism Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/30 bg-white/30 backdrop-blur-lg backdrop-saturate-150 p-8 flex flex-col gap-6"
               style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl z-10" style={{
              background: 'linear-gradient(120deg, rgba(120,144,255,0.18), rgba(186,104,200,0.12), rgba(41,98,255,0.12))',
              filter: 'blur(8px)',
              opacity: 0.7
            }} />

            {error && (
              <Alert 
                type="error" 
                message={error} 
                onClose={() => {}} 
                autoDismiss={true} 
              />
            )}

            <div className="mb-2 pt-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Students
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Professors
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  Administrators
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="transition-all duration-300">
                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={formErrors.email}
                  placeholder="your@email.com"
                  required
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>

              <div className="transition-all duration-300">
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  error={formErrors.password}
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded bg-white/30 backdrop-blur-sm shadow-sm"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                <div>
                  <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  isLoading={isSubmitting}
                  fullWidth
                  disabled={isSubmitting}
                  className="rounded-xl shadow-lg bg-gradient-to-r from-primary/90 to-blue-500/80 hover:from-primary/100 hover:to-blue-600/90 focus:ring-2 focus:ring-blue-300/40"
                >
                  Sign In
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500 pt-2">
                <p>Need access to the platform? <a href="#" className="text-primary hover:underline">Contact your administrator</a></p>
              </div>
            </form>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>© 2025 Eduverse. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};