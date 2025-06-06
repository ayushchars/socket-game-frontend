import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login';
import RegisterPage from './components/signUp';
import Dashboard from './components/dashboard/dashbord';
import UserCreate from './components/dashboard/userCreate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-user" element={<UserCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
