import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isAdminPanelRole, normalizeRole, ROLE_LABELS } from '../../config/rbac';
import { assets } from '../../assets/assets';

const Login = ({ url, onAdminLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateUsername = (value) => /^[a-zA-Z0-9._-]{3,30}$/.test(value);

  const validateCredentials = (values) => {
    const errors = { username: '', password: '' };
    const username = values.username.trim();
    const password = values.password.trim();

    if (!username) {
      errors.username = 'Username or email is required';
    } else if (username.length > 100) {
      errors.username = 'Username or email is too long';
    } else if (username.includes('@')) {
      if (!validateEmail(username)) {
        errors.username = 'Please enter a valid email address';
      }
    } else if (!validateUsername(username)) {
      errors.username = 'Username must be 3-30 chars (letters, numbers, ., _, -)';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (password.length > 128) {
      errors.password = 'Password is too long';
    }

    return errors;
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onBlurField = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...credentials, [name]: value };
    const errors = validateCredentials(nextValues);
    setFieldErrors((prev) => ({ ...prev, [name]: errors[name] }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const errors = validateCredentials(credentials);
    setFieldErrors(errors);

    if (errors.username || errors.password) {
      toast.error('Please fix validation errors');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${url}/api/user/login`, {
        username: credentials.username.trim(),
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
    <div
      className='relative min-h-screen overflow-hidden bg-zinc-900 bg-cover bg-center bg-no-repeat p-4'
      style={{ backgroundImage: `url(${assets.admin_login})` }}
    >
      <div className='pointer-events-none absolute inset-0 bg-black/10' />
      <div className='pointer-events-none absolute inset-0 bg-linear-to-br from-black/30 via-transparent to-black/45' />

      <div className='relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center'>
        <div className='w-full max-w-md overflow-hidden rounded-3xl border border-orange-200/70 bg-white shadow-[0_30px_70px_rgba(234,88,12,0.12)]'>
          <section className='p-7 sm:p-10'>
            <p className='mb-3 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-600'>
              Urban Foods
            </p>

            <h2 className='text-3xl font-black tracking-tight text-zinc-900'>Admin Panel Login</h2>
            <p className='mb-6 mt-2 text-sm text-zinc-500'>Use your assigned username/email and password</p>

            <form onSubmit={onSubmit} className='space-y-3'>
              <label className='block'>
                <span className='mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500'>Username or Email</span>
                <input
                  name='username'
                  type='text'
                  placeholder='Enter your username or email'
                  value={credentials.username}
                  onChange={onChange}
                  onBlur={onBlurField}
                  autoComplete='username'
                  maxLength={100}
                  aria-invalid={Boolean(fieldErrors.username)}
                  required
                  className={`w-full rounded-xl px-3.5 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white focus:ring-4 ${
                    fieldErrors.username
                      ? 'border border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100'
                      : 'border border-zinc-300 bg-zinc-50 focus:border-orange-400 focus:ring-orange-100'
                  }`}
                />
                {fieldErrors.username && (
                  <span className='mt-1.5 block text-xs font-semibold text-red-600'>{fieldErrors.username}</span>
                )}
              </label>

              <label className='block'>
                <span className='mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500'>Password</span>
                <input
                  name='password'
                  type='password'
                  placeholder='Enter your password'
                  value={credentials.password}
                  onChange={onChange}
                  onBlur={onBlurField}
                  autoComplete='current-password'
                  minLength={6}
                  maxLength={128}
                  aria-invalid={Boolean(fieldErrors.password)}
                  required
                  className={`w-full rounded-xl px-3.5 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white focus:ring-4 ${
                    fieldErrors.password
                      ? 'border border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100'
                      : 'border border-zinc-300 bg-zinc-50 focus:border-orange-400 focus:ring-orange-100'
                  }`}
                />
                {fieldErrors.password && (
                  <span className='mt-1.5 block text-xs font-semibold text-red-600'>{fieldErrors.password}</span>
                )}
              </label>

              <button
                type='submit'
                disabled={isSubmitting}
                className='mt-2 w-full rounded-xl bg-linear-to-r from-orange-500 via-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(249,115,22,0.28)] transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70'
              >
                {isSubmitting ? 'Signing in...' : 'Login to Dashboard'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
