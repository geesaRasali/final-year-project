import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ url, onAdminLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.error('Please enter username/email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${url}/api/user/login`, {
        username: credentials.username,
        password: credentials.password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || 'Login failed');
        return;
      }

      const user = response.data.user;
      const token = response.data.token;

      if (!user || !token) {
        toast.error('Invalid login response');
        return;
      }

      if (user.role !== 'admin') {
        toast.error('Only admin can access dashboard');
        return;
      }

      toast.success('Welcome admin');
      onAdminLogin(token, user);
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Unable to login. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='admin-login'>
      <form onSubmit={onSubmit} className='admin-login-card'>
        <h2>Admin Login</h2>
        <p>Enter username and password to open dashboard</p>

        <input
          name='username'
          type='text'
          placeholder='Username or email'
          value={credentials.username}
          onChange={onChange}
          autoComplete='username'
          required
        />

        <input
          name='password'
          type='password'
          placeholder='Password'
          value={credentials.password}
          onChange={onChange}
          autoComplete='current-password'
          required
        />

        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login to Dashboard'}
        </button>
      </form>
    </div>
  );
};

export default Login;
