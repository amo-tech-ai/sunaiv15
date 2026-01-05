import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Wizard from './pages/Wizard';
import Dashboard from './pages/Dashboard';

// Simple Context for App State
export const AppContext = React.createContext<any>(null);

function App() {
  const [appState, setAppState] = React.useState({
    hasCompletedWizard: false,
    businessName: '',
    phases: []
  });

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Wizard />} />
          <Route 
            path="/dashboard" 
            element={appState.hasCompletedWizard ? <Dashboard /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
}

export default App;