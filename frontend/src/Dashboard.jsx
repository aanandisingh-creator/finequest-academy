import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [user, setUser] = useState({
    username: "FinMage_Starter",
    walletBalance: 25000.00,
    level: 1,
    xp: 45,
    streak: 3
  });
  const [expenseText, setExpenseText] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [gameAlert, setGameAlert] = useState('');
  
  const [currentTab, setCurrentTab] = useState('dashboard'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('splash'); 
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  // 1. LISTEN FOR THE BACKEND HANDSHAKE TOKEN TOMORROW
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('userToken', token);
      setIsAuthenticated(true);
      setCurrentTab('dashboard');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Full viewport styling
  useEffect(() => {
    const styleOverride = document.createElement('style');
    styleOverride.innerHTML = `
      html, body, #root {
        margin: 0 !important; padding: 0 !important;
        width: 100vw !important; height: 100vh !important;
        background-color: ${isDarkMode ? '#0f172a' : '#f8fafc'} !important;
        color: ${isDarkMode ? '#f8fafc' : '#0f172a'} !important;
        overflow: hidden !important;
      }
      * { box-sizing: border-box; }
    `;
    document.head.appendChild(styleOverride);
    return () => { document.head.removeChild(styleOverride); };
  }, [isDarkMode]);

  // OAuth Trigger Redirects
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/facebook';
  };

  const handleEmailAuthSubmit = (e) => {
    e.preventDefault();
    if (authUsername) {
      setUser(prev => ({ ...prev, username: authUsername }));
    }
    setIsAuthenticated(true);
  };

  const handleLogExpense = (e) => {
    e.preventDefault();
    if (!expenseText || !expenseAmount) return;
    const numericAmount = parseFloat(expenseAmount);
    setUser(prev => {
      let newXp = prev.xp + 25;
      let newLevel = prev.level;
      if (newXp >= 200) { newLevel += 1; newXp -= 200; }
      return { ...prev, walletBalance: prev.walletBalance - numericAmount, xp: newXp, level: newLevel };
    });
    setGameAlert(`Quest Complete! Spent ₹${numericAmount}. +25 XP awarded!`);
    setExpenseText(''); setExpenseAmount('');
  };

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    sidebarBg: isDarkMode ? '#1e1b4b' : '#0f172a', 
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    textMain: isDarkMode ? '#f8fafc' : '#0f172a',
    textMuted: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#334155' : '#e2e8f0',
    inputBg: isDarkMode ? '#0f172a' : '#f1f5f9'
  };

  // AUTH GATEWAY UI
  if (!isAuthenticated) {
    return (
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999,
        backgroundColor: '#0f172a', display: 'flex', flexDirection: 'row', fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ width: '45%', minWidth: '400px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', borderRight: '1px solid #1e293b' }}>
          <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ fontSize: '54px', marginBottom: '16px' }}>🛡️</div>
              <h1 style={{ margin: 0, color: '#f8fafc', fontSize: '40px', fontWeight: '800', letterSpacing: '-1px' }}>Happening now</h1>
              <p style={{ color: '#94a3b8', fontSize: '16px', marginTop: '8px' }}>Join the FinQuest Portal ecosystem today.</p>
            </div>

            {authView === 'splash' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '14px', borderRadius: '30px', border: '1px solid #475569', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '700', cursor: 'pointer' }}>🔑 Continue with Google</button>
                <button onClick={handleFacebookLogin} style={{ width: '100%', padding: '14px', borderRadius: '30px', border: '1px solid #475569', backgroundColor: '#1877f2', color: 'white', fontWeight: '700', cursor: 'pointer' }}>🔵 Continue with Facebook</button>
                <div style={{ textTransform: 'uppercase', fontSize: '12px', color: '#475569', textAlign: 'center', margin: '10px 0' }}>or</div>
                <button onClick={() => setAuthView('email-signup')} style={{ width: '100%', padding: '14px', borderRadius: '30px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Create account</button>
                <div style={{ marginTop: '20px', color: '#94a3b8' }}>Already have an account? <span onClick={() => setAuthView('email-login')} style={{ color: '#38bdf8', cursor: 'pointer' }}>Sign in</span></div>
              </div>
            )}

            {authView === 'email-signup' && (
              <form onSubmit={handleEmailAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Username" value={authUsername} onChange={e => setAuthUsername(e.target.value)} required style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155' }} />
                <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155' }} />
                <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155' }} />
                <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '30px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Create Account</button>
                <div onClick={() => setAuthView('splash')} style={{ color: '#38bdf8', textAlign: 'center', cursor: 'pointer' }}>Go Back</div>
              </form>
            )}

            {authView === 'email-login' && (
              <form onSubmit={handleEmailAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="email" placeholder="Email Address" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155' }} />
                <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#000', color: 'white', border: '1px solid #334155' }} />
                <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '30px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Sign In</button>
                <div onClick={() => setAuthView('splash')} style={{ color: '#38bdf8', textAlign: 'center', cursor: 'pointer' }}>Go Back</div>
              </form>
            )}
          </div>
        </div>
        <div style={{ flexGrow: 1, backgroundColor: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '240px', filter: 'drop-shadow(0 0 45px rgba(79, 70, 229, 0.15))' }}>🛡️</div>
        </div>
      </div>
    );
  }

  // RESTORED MAIN DASHBOARD UI
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', backgroundColor: theme.bg }}>
      <div style={{ width: '280px', backgroundColor: theme.sidebarBg, color: '#ffffff', padding: '40px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: '26px', fontWeight: '800', marginBottom: '40px' }}>🛡️ FinQuest</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div onClick={() => setCurrentTab('dashboard')} style={{ padding: '14px', cursor: 'pointer', backgroundColor: currentTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '8px', fontWeight: '600' }}>📊 Dashboard Space</div>
            <div onClick={() => setCurrentTab('settings')} style={{ padding: '14px', cursor: 'pointer', backgroundColor: currentTab === 'settings' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '8px', fontWeight: '600' }}>⚙️ System Settings</div>
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>CORE ENGINE v2.5</div>
      </div>

      <div style={{ flexGrow: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 style={{ color: theme.textMain, margin: 0 }}>Welcome back, {user.username}!</h1>
            <p style={{ color: theme.textMuted, margin: '4px 0 0 0' }}>Track your expenses and clear financial milestones.</p>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '10px 16px', borderRadius: '20px', border: `1px solid ${theme.border}`, backgroundColor: theme.cardBg, color: theme.textMain, cursor: 'pointer', fontWeight: '600' }}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {gameAlert && <div style={{ color: '#10b981', padding: '14px', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', fontWeight: '600' }}>✨ {gameAlert}</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '600' }}>Wallet Vault</span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 0 0', color: theme.textMain }}>₹{user.walletBalance.toFixed(2)}</h2>
          </div>
          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '600' }}>Character Level</span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 0 0', color: theme.textMain }}>Lv. {user.level} Mage</h2>
          </div>
          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '600' }}>Experience Bar</span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 0 0', color: theme.textMain }}>{user.xp} / 200 XP</h2>
          </div>
        </div>

        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
          <h3 style={{ margin: '0 0 16px 0', color: theme.textMain, fontSize: '18px' }}>⚔️ Log New Expense Quest</h3>
          <form onSubmit={handleLogExpense} style={{ display: 'flex', gap: '12px' }}>
            <input type="text" placeholder="What did you buy?" value={expenseText} onChange={e => setExpenseText(e.target.value)} required style={{ flexGrow: 2, padding: '14px', backgroundColor: theme.inputBg, color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: '8px', outline: 'none' }} />
            <input type="number" placeholder="Cost" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} required style={{ flexGrow: 1, padding: '14px', backgroundColor: theme.inputBg, color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: '8px', outline: 'none' }} />
            <button type="submit" style={{ padding: '14px 28px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Execute Quest</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;