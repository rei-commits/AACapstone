import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Page Components
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Activity from './pages/Activity';
import Stats from './pages/Stats';

// Feature Components
import InstaSplit from './components/InstaSplit/InstaSplit';

/**
 * Main App component that handles routing and theme provider
 * Wraps all routes with ThemeProvider to enable dark/light mode functionality
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Feature Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/instasplit" element={<InstaSplit />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 