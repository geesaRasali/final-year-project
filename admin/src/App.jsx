import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Orders from './pages/Orders/Orders';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import AccessDenied from './pages/AccessDenied/AccessDenied';
import StaffUsers from './pages/StaffUsers/StaffUsers';
import Messages from './pages/Messages/Messages';
import { hasPermission, isAdminPanelRole, normalizeRole } from './config/rbac';

const App = () => {
  const url = 'http://localhost:4000';
  const [adminToken, setAdminToken] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const normalizedRole = normalizeRole(parsedUser?.role);
        if (isAdminPanelRole(normalizedRole)) {
          setAdminToken(savedToken);
          setAdminUser({ ...parsedUser, role: normalizedRole });
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleAdminLogin = (token, user) => {
    const normalizedUser = { ...user, role: normalizeRole(user?.role) };
    setAdminToken(token);
    setAdminUser(normalizedUser);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(normalizedUser));
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  if (!adminToken || !isAdminPanelRole(adminUser?.role)) {
    return (
      <div>
        <ToastContainer />
        <Login url={url} onAdminLogin={handleAdminLogin} />
      </div>
    );
  }

  const canViewDashboard = hasPermission(adminUser?.role, 'dashboard');
  const canManageFood = hasPermission(adminUser?.role, 'addFood');
  const canListFood = hasPermission(adminUser?.role, 'listFood');
  const canManageOrders = hasPermission(adminUser?.role, 'orders');
  const canViewMessages = hasPermission(adminUser?.role, 'messages');
  const canManageUsers = hasPermission(adminUser?.role, 'staffUsers');

  const defaultRoute = canViewDashboard
    ? '/'
    : canManageFood
      ? '/add'
      : canListFood
        ? '/list'
        : canManageOrders
          ? '/orders'
          : canViewMessages
            ? '/admin/messages'
            : canManageUsers
            ? '/staff-users'
            : '/access-denied';

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors dark:bg-zinc-900">
      <ToastContainer />
      <Navbar
        adminUser={adminUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
      <hr />
      <div className="flex">
        <Sidebar adminUser={adminUser} />
        <div className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={canViewDashboard ? <Dashboard url={url} adminToken={adminToken} /> : <Navigate to={defaultRoute} replace />} />
            <Route path="/add" element={canManageFood ? <Add url={url} adminToken={adminToken} /> : <Navigate to={defaultRoute} replace />} />
            <Route path="/list" element={canListFood ? <List url={url} adminToken={adminToken} /> : <Navigate to={defaultRoute} replace />} />
            <Route path="/orders" element={canManageOrders ? <Orders url={url} adminToken={adminToken} adminUser={adminUser} /> : <Navigate to={defaultRoute} replace />} />
            <Route path="/admin/messages" element={canViewMessages ? <Messages url={url} adminToken={adminToken} /> : <Navigate to={defaultRoute} replace />} />
            <Route path="/staff-users" element={canManageUsers ? <StaffUsers url={url} adminToken={adminToken} /> : <Navigate to={defaultRoute} replace />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<Navigate to={defaultRoute} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;