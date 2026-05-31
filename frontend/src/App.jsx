import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('splash'); // splash, signup, login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Track the logged-in profile name directly in app state memory
  const [activeUser, setActiveUser] = useState('');

  // 1. Initialize Google Identity Services on Mount
  useEffect(() => {
    // Check local storage session flags first
    const activeToken = localStorage.getItem('finquest_session_token');
    const savedName = localStorage.getItem('finquest_username');
    if (activeToken && savedName) {
      setActiveUser(savedName);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setLoading(false);
    }

    // Bind Google script callback to the window object safely
    window.handleGoogleCredentialResponse = (response) => {
      try {
        // Decode the secure JWT credential token returned by Google's servers
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const googleUser = JSON.parse(jsonPayload);
        const realName = googleUser.name || googleUser.given_name;

        // Store tokens securely to preserve sessions across reloads
        localStorage.setItem('finquest_session_token', response.credential);
        localStorage.setItem('finquest_username', realName);

        setActiveUser(realName);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse Google Auth Token:", error);
      }
    };
  }, []);

  // 2. Trigger Google accounts picker dynamically using Google Client ID
  const handleRealGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "510547982696-9ffgl7thp7gq30v91ng9loqp7eqt8ial.apps.googleusercontent.com",
        callback: window.handleGoogleCredentialResponse,
      });
      
      window.google.accounts.id.prompt(); // Throws open the real floating native Google UI account prompt!
    } else {
      alert("Google Auth Script hasn't finished loading yet. Please check your index.html script tag or connection.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const finalName = username || email.split('@')[0];
    
    localStorage.setItem('finquest_session_token', 'local_form_token');
    localStorage.setItem('finquest_username', finalName);
    
    setActiveUser(finalName);
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0b111e', color: 'white', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#38bdf8', fontSize: '18px' }}>Booting FinQuest Environment...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard currentUserName={activeUser} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0b111e', color: 'white', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* LEFT PANEL */}
      <div style={{ width: '44%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', backgroundColor: '#090d16', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#4f46e5', padding: '10px', borderRadius: '12px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f8fafc' }}>FinQuest Portal</span>
        </div>
        
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '12px', letterSpacing: '-1px', lineHeight: '1' }}>Happening now</h1>
        <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '40px', marginTop: '0' }}>Join the FinQuest Portal ecosystem today.</p>
        
        {authView === 'splash' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '360px' }}>
            
            {/* LINKED TO REAL GOOGLE API INITIALIZATION OUTLET */}
            <button onClick={handleRealGoogleLogin} style={{ width: '100%', padding: '14px', backgroundColor: 'white', color: '#0f172a', borderRadius: '9999px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span>🔑</span> Continue with Google
            </button>

            <button style={{ width: '100%', padding: '14px', backgroundColor: '#1877f2', color: 'white', borderRadius: '9999px', fontWeight: '700', fontSize: '15px', border: 'none', opacity: 0.5, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span>🔵</span> Continue with Facebook
            </button>
            
            <div style={{ textTransform: 'uppercase', fontSize: '12px', color: '#475569', textAlign: 'center', margin: '8px 0', fontWeight: 'bold' }}>OR</div>

            <button onClick={() => setAuthView('signup')} style={{ width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '9999px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>
              Create account ➔
            </button>

            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '24px' }}>
              Already have an account? <span onClick={() => setAuthView('login')} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>Sign in</span>
            </p>
          </div>
        )}

        {(authView === 'signup' || authView === 'login') && (
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '360px' }}>
            <h3 style={{ margin: '0 0 4px 0', color: '#38bdf8' }}>{authView === 'signup' ? '🚀 Create Your Profile' : '🔮 Welcome Back'}</h3>
            
            {authView === 'signup' && (
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155', outline: 'none' }} />
            )}
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155', outline: 'none' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155', outline: 'none' }} />
            
            <button type="submit" style={{ padding: '14px', borderRadius: '30px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
              {authView === 'signup' ? 'Complete Initialization' : 'Authorize Session'}
            </button>
            <div onClick={() => setAuthView('splash')} style={{ color: '#94a3b8', textAlign: 'center', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}>➔ Go Back</div>
          </form>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: '56%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#060911', position: 'relative' }}>
        <div style={{ width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(79,70,229,0.1)', position: 'absolute', transform: 'scale(1.5)', filter: 'blur(80px)' }}></div>
        <div style={{ backgroundColor: '#0d1527', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '60px', width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '72px', marginBottom: '20px' }}>🛡️</span>
          <div style={{ width: '64px', height: '6px', backgroundColor: '#2563eb', borderRadius: '999px', marginBottom: '12px' }}></div>
          <div style={{ width: '96px', height: '6px', backgroundColor: '#1e293b', borderRadius: '999px' }}></div>
        </div>
      </div>

    </div>
  );
}