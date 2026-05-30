import React from 'react';
import Dashboard from './Dashboard';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fb', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#333' }}>FinQuest Academy</h1>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;