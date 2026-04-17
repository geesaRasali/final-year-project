import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Orders from './pages/Orders/Orders';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';

const App = () => {
  const url = 'http://localhost:4000';
  const [adminToken, setAdminToken] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.role === 'admin') {
          setAdminToken(savedToken);
          setAdminUser(parsedUser);
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

  const handleAdminLogin = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  if (!adminToken || adminUser?.role !== 'admin') {
    return (
      <div>
        <ToastContainer />
        <Login url={url} onAdminLogin={handleAdminLogin} />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Navbar adminUser={adminUser} onLogout={handleLogout} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;