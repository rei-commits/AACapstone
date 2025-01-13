import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// Create root element for React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app within StrictMode for additional development checks
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
); 