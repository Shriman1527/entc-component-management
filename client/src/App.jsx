import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

// --- 1. Role-Based Route Protection ---
// This wrapper checks if the user has the SPECIFIC role required for the page
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in? -> Login
  if (!user) return <Navigate to="/login" />;

  // Logged in, but wrong role? -> Redirect to their own dashboard
  if (user.role !== allowedRole) {
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'student') return <Navigate to="/student" />;
  }

  // Correct role? -> Show the page
  return children;
};

// --- 2. Root Redirector ---
// If someone goes to "/", this sends them to the right place
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null; 
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'student') return <Navigate to="/student" />;
  
  return <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Traffic Cop Route */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Specific Admin Route (http://localhost:5173/admin) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Specific Student Route (http://localhost:5173/student) */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;