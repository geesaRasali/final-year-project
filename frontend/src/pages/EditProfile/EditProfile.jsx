import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const EditProfile = () => {
  const navigate = useNavigate();
  const { url, token, user, setUser } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!token || user) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${url}/api/user/profile`, {
          headers: { token },
        });

        if (response.data.success && response.data.user) {
          const normalizedUser = {
            ...response.data.user,
            role: response.data.user.role || 'customer',
          };
          setUser(normalizedUser);
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    fetchProfile();
  }, [token, url, user, setUser]);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (status.success) {
      const timer = setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: '' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status.success]);

  const profileImageSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (user?.profileImage) return `${url}${user.profileImage}`;
    return user?.avatar || assets.profile_icon;
  }, [previewUrl, user, url]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim()) {
      setStatus({ loading: false, error: 'Please fill all required fields.', success: '' });
      return;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        setStatus({ loading: false, error: 'Password must be at least 6 characters.', success: '' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
        return;
      }
    }

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('username', formData.username.trim());
      payload.append('email', formData.email.trim());
      if (formData.password) {
        payload.append('password', formData.password);
      }
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const response = await axios.post(`${url}/api/user/update`, payload, {
        headers: { token },
      });

      if (!response.data.success) {
        setStatus({ loading: false, error: response.data.message || 'Update failed.', success: '' });
        return;
      }

      const normalizedUser = {
        ...response.data.user,
        role: response.data.user?.role || 'customer',
      };

      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
      setStatus({ loading: false, error: '', success: 'Profile updated successfully.' });
    } catch (error) {
      console.error('Update profile error:', error);
      setStatus({ loading: false, error: 'Network error. Please try again.', success: '' });
    }
  };

  const inputClass =
    'w-full rounded-lg border border-zinc-300 bg-white/50 px-4 py-2.5 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white/80 focus:ring-2 focus:ring-orange-200/50';

  return (
    <div className="relative min-h-screen w-full bg-[#fff8f1] p-4 sm:p-6 md:p-8">
      {/* Background shapes */}
      <div
        aria-hidden="true"
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-linear-to-br from-orange-100 via-amber-100 to-transparent opacity-50 blur-3xl"
      ></div>
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -right-48 h-[40rem] w-[40rem] rounded-full bg-linear-to-tr from-amber-100 via-orange-100 to-transparent opacity-40 blur-3xl"
      ></div>

      <div className="relative z-20 mx-auto grid max-w-6xl grid-cols-1 gap-8 rounded-3xl border border-orange-200/50 bg-white/60 shadow-2xl shadow-orange-200/40 backdrop-blur-2xl lg:grid-cols-[320px_1fr]">
        {/* Left Panel */}
        <div className="flex flex-col items-center rounded-3xl border border-white/80 bg-white/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-800">Your Profile</h2>
          <p className="mt-1 text-sm text-zinc-500">Manage your account details</p>

          <div className="relative mt-8 h-32 w-32">
            <img
              src={profileImageSrc}
              alt="Profile"
              className="h-full w-full rounded-full object-cover shadow-lg"
            />
            <label
              htmlFor="image-upload"
              className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-md transition hover:bg-orange-600"
              title="Change profile photo"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold text-zinc-900">{formData.name || 'Customer'}</p>
            <p className="mt-1 text-sm text-zinc-500">{formData.email || 'No email on file'}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-auto w-full rounded-xl border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            Back to previous page
          </button>
        </div>

        {/* Right Panel */}
        <div className="p-4 sm:p-8">
          <h3 className="text-xl font-bold text-zinc-800">Personal Information</h3>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-zinc-600">Full name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-600">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Username"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-600">Email address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                className={inputClass}
                required
              />
            </div>

            <div className="border-t border-orange-200/70 pt-6">
              <h3 className="text-xl font-bold text-zinc-800">Password</h3>
              <p className="mt-1 text-sm text-zinc-500">Leave fields blank to keep your current password.</p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-zinc-600">New password</label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="New password"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-600">Confirm password</label>
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Repeat new password"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {status.error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-700">
                {status.error}
              </div>
            )}
            {status.success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700">
                {status.success}
              </div>
            )}

            <div className="flex items-center gap-4 border-t border-orange-200/70 pt-6">
              <button
                type="submit"
                disabled={status.loading}
                className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold tracking-wide text-white shadow-[0_10px_22px_rgba(234,88,12,0.25)] transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status.loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
