// src/App.jsx
// ============================================================
// INTERVIEW EXPLANATION:
// "How does React Router work?"
//
// React Router intercepts URL changes and renders the matching component
// WITHOUT reloading the page. This is what makes it a Single Page Application.
//
// BrowserRouter uses the HTML5 History API (pushState) to update the URL.
// Routes matches the current URL to a component.
// Navigate redirects the user programmatically.
//
// "What is a Protected Route pattern?"
// It's a wrapper component that checks if the user is authenticated.
// If not, it redirects to /login instead of rendering the page.
// This prevents unauthenticated users from accessing private pages.
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddJobPage    from './pages/AddJobPage';
import EditJobPage   from './pages/EditJobPage';

// Wrapper that guards private pages
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    // Replace: so pressing back from login doesn't loop back to the protected page
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Wrapper for public pages — redirect logged-in users away from login/register
function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Private pages */}
      <Route path="/dashboard"     element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/jobs/new"      element={<PrivateRoute><AddJobPage /></PrivateRoute>} />
      <Route path="/jobs/edit/:id" element={<PrivateRoute><EditJobPage /></PrivateRoute>} />

      {/* Default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
