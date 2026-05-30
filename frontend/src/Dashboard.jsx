import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [expenseText, setExpenseText] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [gameAlert, setGameAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Could not reach backend:", err));
  }, []);

  const handleLogExpense = async (e) => {
    e.preventDefault();
    if (!expenseText || !expenseAmount) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: expenseText, amount: parseFloat(expenseAmount) })
      });
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setGameAlert(data.message);
        setExpenseText('');
        setExpenseAmount('');
      } else {
        setGameAlert(data.error || "Transaction error.");
      }
    } catch (err) {
      setGameAlert("Network error linking with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#a0aec0', fontFamily: 'system-ui, sans-serif' }}>
      <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '50%', borderLeftColor: '#7c3aed', margin: '0 auto 15px auto', animation: 'spin 1s linear infinite' }}></div>
      <p style={{ letterSpacing: '1px', fontSize: '14px' }}>WAKING UP FINANCIAL ENGINE...</p>
    </div>
  );

  const xpPercent = Math.min(100, Math.round((user.xp / 200) * 100));

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', padding: '30px', fontFamily: '"Inter", system-ui, sans-serif', backgroundColor: '#111827', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)', color: '#f3f4f6', border: '1px solid #1f2937' }}>
      
      {/* Profile Header Card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2937', padding: '16px 20px', borderRadius: '16px', border: '1px solid #374151', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px' }}>🧙‍♂️ {user.username}</h2>
          <div style={{ marginTop: '6px' }}>
            <span style={{ backgroundColor: '#7c3aed', color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              LVL {user.level} MAGE
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '22px', display: 'block' }}>🔥</span>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{user.streak} Day Streak</span>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div style={{ marginBottom: '28px', backgroundColor: '#1f2937', padding: '16px', borderRadius: '16px', border: '1px solid #374151' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', fontWeight: '600', color: '#9ca3af' }}>
          <span>EXPERIENCE POINTS</span>
          <span style={{ color: '#34d399' }}>{user.xp} / 200 XP ({xpPercent}%)</span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#111827', borderRadius: '9999px', overflow: 'hidden', padding: '2px' }}>
          <div style={{ width: `${xpPercent}%`, height: '100%', borderRadius: '9999px', backgroundColor: '#34d399', backgroundImage: 'linear-gradient(90deg, #34d399, #059669)', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
      </div>

      {/* Gold Wallet Balance Display */}
      <div style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center', marginBottom: '28px', border: '1px solid #374151', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.2)' }}>
        <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Available Vault Balance</span>
        <strong style={{ fontSize: '36px', color: '#fbbf24', letterSpacing: '-1px', fontWeight: '800' }}>₹{user.walletBalance.toFixed(2)}</strong>
      </div>

      {/* Action Input Form */}
      <form onSubmit={handleLogExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase' }}>⚔️ Log Quest Action</h4>
        
        <input 
          type="text" 
          placeholder="Item purchased (e.g., Starbucks Coffee)" 
          value={expenseText}
          onChange={(e) => setExpenseText(e.target.value)}
          required
          style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
        />
        
        <input 
          type="number" 
          placeholder="Gold Amount (₹)" 
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          required
          style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
        />
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ backgroundColor: isSubmitting ? '#4b5563' : '#7c3aed', color: 'white', padding: '14px', border: 'none', borderRadius: '12px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)' }}
        >
          {isSubmitting ? 'PROCESSING QUEST...' : 'EXECUTE TRANSACTION'}
        </button>
      </form>

      {/* Gamified Notification Center */}
      {gameAlert && (
        <div style={{ marginTop: '24px', padding: '16px', borderRadius: '14px', backgroundColor: '#1e1b4b', border: '1px solid #312e81', fontSize: '13px', color: '#c084fc', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '16px' }}>🔔</span>
          <span>{gameAlert}</span>
        </div>
      )}
    </div>
  );
}

export default Dashboard;