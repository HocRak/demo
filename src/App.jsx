import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Advanced from './pages/Advanced';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Thanks from './pages/Thanks';
import GoogleCallback from './pages/GoogleCallback';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <Generate />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/generate" element={<Generate />} />
        <Route path="/advanced" element={<Advanced />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
