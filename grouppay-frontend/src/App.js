import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Page Components
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Activity from './pages/Activity';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailsPage from './pages/GroupDetailsPage';

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
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-group" element={<CreateGroupPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
          
          {/* Feature Routes */}
          <Route path="/instasplit" element={<InstaSplit />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 