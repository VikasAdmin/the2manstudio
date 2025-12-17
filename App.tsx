import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminComponents';
import Home from './pages/Home';
import Services from './pages/Services';
import { About, Destinations, Blog, Contact } from './pages/PublicPages';
import Login from './pages/admin/Login';
import { Dashboard, AdminServices, AdminSettings, AdminBlog, AdminDestinations } from './pages/admin/AdminPages';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/destinations" element={<Layout><Destinations /></Layout>} />
      <Route path="/blog" element={<Layout><Blog /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />

      {/* Admin Auth */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/destinations" element={<ProtectedRoute><AdminDestinations /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;