import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import TallyGo from './pages/TallyGo';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-[#0A0C1E] text-gray-900 dark:text-white transition-colors duration-200">
        <Toaster position="top-center" />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tallygo" element={<TallyGo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activity" element={<Activity />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App; 