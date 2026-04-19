import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isAdminPanelRole, normalizeRole, ROLE_LABELS } from '../../config/rbac';

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

      const normalizedRole = normalizeRole(user.role);

      if (!isAdminPanelRole(normalizedRole)) {
        toast.error('Your account does not have admin panel access');
        return;
      }

      toast.success(`Welcome ${ROLE_LABELS[normalizedRole] || normalizedRole}`);
      onAdminLogin(token, { ...user, role: normalizedRole });
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Unable to login. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='grid min-h-screen place-items-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4'>
      <form onSubmit={onSubmit} className='w-full max-w-md rounded-2xl border border-orange-200 bg-white p-7 shadow-[0_18px_45px_rgba(234,88,12,0.12)]'>
        <h2 className='text-3xl font-bold tracking-tight text-zinc-900'>Admin Panel Login</h2>
        <p className='mb-5 mt-1 text-sm text-zinc-500'>Use your assigned username/email and password</p>

        <input
          name='username'
          type='text'
          placeholder='Username or email'
          value={credentials.username}
          onChange={onChange}
          autoComplete='username'
          required
          className='mb-3 w-full rounded-xl border border-zinc-300 px-3.5 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100'
        />

        <input
          name='password'
          type='password'
          placeholder='Password'
          value={credentials.password}
          onChange={onChange}
          autoComplete='current-password'
          required
          className='w-full rounded-xl border border-zinc-300 px-3.5 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100'
        />

        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70'
        >
          {isSubmitting ? 'Signing in...' : 'Login to Dashboard'}
        </button>
      </form>
    </div>
  );
};

export default Login;
