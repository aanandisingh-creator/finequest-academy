import React, { useState, useEffect } from 'react';

// 1. Add { currentUserName } as an incoming parameter argument to the function
function Dashboard({ currentUserName }) {
  const [user, setUser] = useState(() => {
    // 2. Prioritize the prop name over old local storage traces!
    const savedName = currentUserName || localStorage.getItem('finquest_username') || "Zoe Stanley";
    return {
      username: savedName,
      walletBalance: 0.00, 
      monthlyIncome: 0.00,
      monthlySpending: 0.00,
      goalTarget: 3000.00
    };
  });
  
  // Keep the rest of your dashboard file code exactly the same...

  const [currentTab, setCurrentTab] = useState('Overview');
  const [expenseText, setExpenseText] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [expenseAmount, setExpenseAmount] = useState('');
  
  // Starting ledger tracking array completely empty for a fresh look!
  const [transactions, setTransactions] = useState([]);

  // PhonePe Simulation Engine states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentStep, setPaymentStep] = useState('input'); // input, phonepe_app, success
  const [upiPin, setUpiPin] = useState('');

  // Settings App States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [settingsName, setSettingsName] = useState(user.username);
  const [settingsGoal, setSettingsGoal] = useState(user.goalTarget.toString());
  const [settingsAlert, setSettingsAlert] = useState('');

  // Unified Theme System Token Object
  const theme = {
    appBg: isDarkMode ? '#0f172a' : '#f8fafc',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    sidebarBg: isDarkMode ? '#0b1329' : '#ffffff',
    textMain: isDarkMode ? '#f8fafc' : '#0f172a',
    textMuted: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    inputBg: isDarkMode ? '#0f172a' : '#f1f5f9',
    inputTextColor: isDarkMode ? '#ffffff' : '#0f172a',
    activeNavBg: '#4f46e5'
  };

  useEffect(() => {
    const globalStyles = document.createElement('style');
    globalStyles.innerHTML = `
      html, body, #root {
        margin: 0 !important; padding: 0 !important;
        width: 100vw !important; height: 100vh !important;
        background-color: ${theme.appBg} !important;
        color: ${theme.textMain} !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        overflow: hidden !important;
        transition: background-color 0.2s ease;
      }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #4f46e5; borderRadius: 10px; }
    `;
    document.head.appendChild(globalStyles);
    return () => { document.head.removeChild(globalStyles); };
  }, [isDarkMode, theme.appBg, theme.textMain]);

  // Execute PhonePe Deposit State Simulation Hook
  const handleVerifyMockPin = (e) => {
    e.preventDefault();
    if (upiPin.length < 4) return;

    const cash = parseFloat(depositAmount);
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + cash,
      monthlyIncome: prev.monthlyIncome + cash
    }));

    setTransactions(prev => [
      {
        id: Date.now(),
        action: "Deposit via PhonePe",
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: "Income",
        amount: cash,
        type: "income",
        icon: "🟣"
      },
      ...prev
    ]);

    setPaymentStep('success');
  };

  // Add Expense Log Hook
  const handleLogExpense = (e) => {
    e.preventDefault();
    if (!expenseText || !expenseAmount) return;
    const numericAmount = parseFloat(expenseAmount);

    const categoryIcons = { Food: "🍲", Shopping: "🛍️", Travels: "✈️", Health: "🏥" };

    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - numericAmount,
      monthlySpending: prev.monthlySpending + numericAmount
    }));

    setTransactions(prev => [
      {
        id: Date.now(),
        action: expenseText,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: expenseCategory,
        amount: numericAmount,
        type: "expense",
        icon: categoryIcons[expenseCategory] || "💵"
      },
      ...prev
    ]);

    setExpenseText('');
    setExpenseAmount('');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, username: settingsName, goalTarget: parseFloat(settingsGoal) || prev.goalTarget }));
    setSettingsAlert("✨ Preferences synchronized successfully!");
    setTimeout(() => setSettingsAlert(''), 3000);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: theme.appBg, color: theme.textMain }}>
      
      {/* 1. SIDEBAR ROW CONTROL PANEL */}
      <div style={{ width: '260px', backgroundColor: theme.sidebarBg, borderRight: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 24px', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '44px' }}>
            <div style={{ backgroundColor: '#4f46e5', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>$</div>
            <span style={{ fontSize: '20px', fontWeight: '800' }}>Budglee</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Overview', 'Budget', 'Transactions'].map((tab) => {
              const tabIcons = { Overview: "🏠", Budget: "📊", Transactions: "📜" };
              const isSelected = currentTab === tab;
              return (
                <div 
                  key={tab} onClick={() => setCurrentTab(tab)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s',
                    backgroundColor: isSelected ? theme.activeNavBg : 'transparent', color: isSelected ? '#ffffff' : theme.textMuted
                  }}
                >
                  <span>{tabIcons[tab]}</span> {tab} Space
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SIDEBAR ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div onClick={() => setCurrentTab('Settings')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: currentTab === 'Settings' ? theme.activeNavBg : 'transparent', color: currentTab === 'Settings' ? '#ffffff' : theme.textMuted }}>
            <span>⚙️</span> App Settings
          </div>
          <div onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#ef4444' }}>
            <span>🚪</span> Log out
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT CANVAS CONTAINER */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* UPPER BANNER STRIP */}
        <div style={{ height: '80px', backgroundColor: theme.cardBg, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', flexShrink: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#4f46e5' }}>🔬 SCHOOL PROJECT ENVIRONMENT SANDBOX</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setShowDepositModal(true)} style={{ backgroundColor: '#5f259f', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '24px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🟣</span> Deposit with PhonePe
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: `1px solid ${theme.border}`, paddingLeft: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>🧙‍♂️</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{user.username}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Student Profile Matrix</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW CONTROLLER A: OVERVIEW SPACE                                         */}
        {/* ========================================================================= */}
        {currentTab === 'Overview' && (
          <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>Overview</h1>
              <p style={{ margin: '4px 0 0 0', color: theme.textMuted, fontSize: '14px' }}>Manage your personal finance & budget metrics.</p>
            </div>

            {/* BALANCE BLOCK AND SYSTEM WELCOME */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '600' }}>Your total balance</span>
                <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '12px 0 20px 0', color: '#22c55e' }}>{currencySymbol}{user.walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                <div style={{ display: 'flex', gap: '24px', borderTop: `1px solid ${theme.border}`, paddingTop: '16px', fontSize: '12px', fontWeight: '700' }}>
                  <span style={{ color: '#22c55e' }}>▲ {currencySymbol}{user.monthlyIncome} Income</span>
                  <span style={{ color: '#ef4444' }}>▼ {currencySymbol}{user.monthlySpending} Spending</span>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #4f46e5, #5f259f)', padding: '24px', borderRadius: '20px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 'bold', letterSpacing: '1px' }}>SYSTEM CONNECTION READY</div>
                <div style={{ fontSize: '20px', fontWeight: '800' }}>PhonePe Intent Layer</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Click "Deposit with PhonePe" above to trigger a test deposit session.</div>
              </div>
            </div>

            {/* LOWER CONTENT COLUMN */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* LEDGER WORKBOX */}
              <div style={{ backgroundColor: theme.cardBg, padding: '28px', borderRadius: '24px', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Recent Activities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto' }}>
                  {transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textMuted, border: `2px dashed ${theme.border}`, borderRadius: '16px' }}>
                      <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📭</span>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>No transactions recorded yet</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>Your financial timeline will build dynamically here.</div>
                    </div>
                  ) : (
                    transactions.slice(0, 4).map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: theme.inputBg, borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px' }}>{t.icon}</span>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700' }}>{t.action}</div>
                            <div style={{ fontSize: '11px', color: theme.textMuted }}>{t.date} • {t.category}</div>
                          </div>
                        </div>
                        <span style={{ fontWeight: '800', color: t.type === 'income' ? '#22c55e' : '#ef4444' }}>
                          {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SAVING CAP GOAL PILL */}
              <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>👍 You are on track</div>
                <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '0' }}>{currencySymbol}{user.goalTarget.toLocaleString()}</h2>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', marginBottom: '16px' }}>Left to spend threshold</div>
                <div style={{ width: '100%', backgroundColor: theme.inputBg, height: '8px', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((user.monthlySpending / user.goalTarget) * 100, 100)}%`, backgroundColor: '#10b981', height: '100%' }}></div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW CONTROLLER B: BUDGET SPACE                                           */}
        {/* ========================================================================= */}
        {currentTab === 'Budget' && (
          <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>📊 Budget Optimization Panel</h1>
              <p style={{ margin: '4px 0 0 0', color: theme.textMuted }}>Log custom budget entries to subtract sandbox capital currencies.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* SUBMIT LOG FORM CARD */}
              <div style={{ backgroundColor: theme.cardBg, padding: '28px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                <h3 style={{ margin: '0 0 20px 0' }}>Log Budget Expense</h3>
                <form onSubmit={handleLogExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>Expense Name</label>
                    <input type="text" placeholder="e.g., Target Store Shopping" value={expenseText} onChange={e => setExpenseText(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: theme.inputBg, color: theme.inputTextColor }} />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>Category</label>
                      <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: theme.inputBg, color: theme.inputTextColor }}>
                        <option value="Food">Food 🍲</option>
                        <option value="Shopping">Shopping 🛍️</option>
                        <option value="Travels">Travels ✈️</option>
                        <option value="Health">Health 🏥</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>Cost ({currencySymbol})</label>
                      <input type="number" placeholder="0.00" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: theme.inputBg, color: theme.inputTextColor }} />
                    </div>
                  </div>

                  <button type="submit" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                    Deduct Balance Units
                  </button>
                </form>
              </div>

              {/* CATEGORIES GRAPH SCHEME LIST */}
              <div style={{ backgroundColor: theme.cardBg, padding: '28px', borderRadius: '20px', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ margin: 0 }}>Spending Threshold Allocations</h3>
                {['Food', 'Shopping', 'Travels', 'Health'].map(cat => {
                  const catIcons = { Food: "🍲", Shopping: "🛍️", Travels: "✈️", Health: "🏥" };
                  return (
                    <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>{catIcons[cat]}</span>
                        <span style={{ fontWeight: '700' }}>{cat} Metrics Allocation</span>
                      </div>
                      <span style={{ fontWeight: 'bold', color: theme.textMuted }}>Logged dynamically</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW CONTROLLER C: TRANSACTIONS SPACE                                     */}
        {/* ========================================================================= */}
        {currentTab === 'Transactions' && (
          <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>📜 Complete Activities Ledger</h1>
              <p style={{ margin: '4px 0 0 0', color: theme.textMuted }}>Comprehensive track logs of all system deposit updates and expenses.</p>
            </div>

            {/* DETAILED LEDGER GRID SHEET */}
            <div style={{ backgroundColor: theme.cardBg, borderRadius: '20px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '18px 24px', backgroundColor: theme.inputBg, fontWeight: '700', fontSize: '13px', color: theme.textMuted }}>
                <span>ACTION ENTRY</span>
                <span>DATE</span>
                <span>CATEGORY</span>
                <span style={{ textAlign: 'right' }}>AMOUNT</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '440px', overflowY: 'auto' }}>
                {transactions.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center', color: theme.textMuted }}>
                    <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📑</span>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Ledger Database Empty</div>
                    <p style={{ fontSize: '13px', margin: '4px 0 0 0' }}>Perform actions inside the system to populate ledger entries.</p>
                  </div>
                ) : (
                  transactions.map(t => (
                    <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, fontSize: '14px', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700' }}>{t.icon} {t.action}</span>
                      <span style={{ color: theme.textMuted }}>{t.date}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{t.category}</span>
                      <span style={{ textAlign: 'right', fontWeight: '800', color: t.type === 'income' ? '#22c55e' : '#ef4444' }}>
                        {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW CONTROLLER D: DETAILED APP SETTINGS PANELS                          */}
        {/* ========================================================================= */}
        {currentTab === 'Settings' && (
          <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '800' }}>⚙️ App Core Configuration</h1>
              <p style={{ margin: 0, color: theme.textMuted }}>Toggle UI visual frames, metrics formats, and active metadata parameters.</p>
            </div>

            {settingsAlert && <div style={{ backgroundColor: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', maxWidth: '600px' }}>{settingsAlert}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '900px', alignItems: 'start' }}>
              
              {/* PANEL BLOCK 1: THEME ADJUSTMENT LAYOUT */}
              <div style={{ backgroundColor: theme.cardBg, padding: '28px', borderRadius: '20px', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>🎨 Theme & Visual Preferences</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Dark Core Engine Skin</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Toggle dark/light interface state rules</div>
                  </div>
                  <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#4f46e5', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                    {isDarkMode ? '🌙 Dark Active' : '☀️ Light Active'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Currency Format Symbol</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Change global system currency icons</div>
                  </div>
                  <select value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${theme.border}`, backgroundColor: theme.appBg, color: theme.textMain, fontWeight: 'bold' }}>
                    <option value="$">Dollar ($)</option>
                    <option value="₹">Rupee (₹)</option>
                    <option value="€">Euro (€)</option>
                  </select>
                </div>
              </div>

              {/* PANEL BLOCK 2: OBJECT FIELD COMPONENT */}
              <div style={{ backgroundColor: theme.cardBg, padding: '28px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>🧙‍♂️ User Profile State Properties</h3>
                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>Profile Display Username</label>
                    <input type="text" value={settingsName} onChange={e => setSettingsName(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.appBg, color: theme.textMain }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>Saving Goal Metric (Threshold Target)</label>
                    <input type="number" value={settingsGoal} onChange={e => setSettingsGoal(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.appBg, color: theme.textMain }} />
                  </div>
                  <button type="submit" style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    Synchronize Profile Rules
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* PHONEPE LOOKALIKE EMBEDDED INTENT DIALOG MODAL VIEW                       */}
      {/* ========================================================================= */}
      {showDepositModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          
          {/* POPUP PHASE 1: REQUEST INBOUND AMOUNT UNITS */}
          {paymentStep === 'input' && (
            <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '32px', borderRadius: '24px', width: '360px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>🟣</span>
                <div>
                  <h3 style={{ margin: 0, fontWeight: '800' }}>PhonePe Checkout</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>PROJECT SANDBOX LINK</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="number" placeholder="Enter amount to deposit" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowDepositModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                  <button onClick={() => setPaymentStep('phonepe_app')} style={{ flex: 1, padding: '12px', border: 'none', backgroundColor: '#5f259f', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Trigger Intent</button>
                </div>
              </div>
            </div>
          )}

          {/* POPUP PHASE 2: MOBILE INTERFACE VIEW */}
          {paymentStep === 'phonepe_app' && (
            <div style={{ backgroundColor: '#5f259f', color: '#ffffff', width: '360px', borderRadius: '30px', overflow: 'hidden', border: '4px solid #334155' }}>
              <div style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>PhonePe</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>Secure Academic Banking Tunnel</div>
              </div>
              
              <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '24px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Transferring to Budglee Portal</div>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#5f259f', margin: '4px 0' }}>{currencySymbol}{depositAmount}</div>
                </div>

                <form onSubmit={handleVerifyMockPin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>ENTER 4-DIGIT MOCK UPI PIN</label>
                    <input type="password" maxLength={4} placeholder="••••" value={upiPin} onChange={e => setUpiPin(e.target.value.replace(/\D/g, ''))} required style={{ width: '120px', textAlign: 'center', padding: '12px', fontSize: '20px', letterSpacing: '6px', borderRadius: '8px', border: '2px solid #5f259f', outline: 'none' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>🔬 This is an isolated mock sandbox. No real fiat funds will be processed.</p>
                  <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Confirm Demo Transfer
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* POPUP PHASE 3: METRIC SUCCESS TRANSITION ACTION */}
          {paymentStep === 'success' && (
            <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '40px 32px', borderRadius: '24px', width: '360px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', color: '#10b981', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontSize: '22px', margin: '0 0 8px 0', color: '#10b981' }}>Transfer Simulated</h3>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>{currencySymbol}{depositAmount} has been injected into your project's wallet state framework.</p>
              <button 
                onClick={() => { setPaymentStep('input'); setDepositAmount(''); setUpiPin(''); setShowDepositModal(false); }} 
                style={{ backgroundColor: '#5f259f', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
              >
                Return to Dashboard
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Dashboard;