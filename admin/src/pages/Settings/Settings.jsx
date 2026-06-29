import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiCamera, FiSliders, FiShield } from 'react-icons/fi';
import { ROLE_LABELS, normalizeRole } from '../../config/rbac';

const Settings = ({ url, adminToken, adminUser, setAdminUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state with adminUser details on mount / update
  useEffect(() => {
    if (adminUser) {
      setFormData((prev) => ({
        ...prev,
        name: adminUser.name || '',
        username: adminUser.username || '',
        email: adminUser.email || '',
      }));
    }
  }, [adminUser]);

  // Fetch the latest profile data from server on component mount
  useEffect(() => {
    if (!adminToken) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${url}/api/user/profile`, {
          headers: { token: adminToken },
        });

        if (response.data.success && response.data.user) {
          const normalized = {
            ...response.data.user,
            role: response.data.user.role || adminUser?.role || 'staff',
          };
          setAdminUser(normalized);
          localStorage.setItem('adminUser', JSON.stringify(normalized));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    fetchProfile();
  }, [adminToken, url]);

  // Handle local image file preview
  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // Resolve Profile Image Path
  const resolvedProfileImage = useMemo(() => {
    if (previewUrl) return previewUrl;

    const raw = (adminUser?.profileImage || '').trim();
    if (!raw) {
      // Fallback Google photo based on email or static avatar
      const emailQuery = adminUser?.email
        ? `https://www.google.com/s2/photos/profile/${encodeURIComponent(adminUser.email)}?sz=120`
        : '';
      return emailQuery || adminUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';
    }

    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    if (raw.startsWith('/')) {
      return `${url}${raw}`;
    }
    if (raw.startsWith('images/')) {
      return `${url}/${raw}`;
    }
    return `${url}/images/${raw}`;
  }, [previewUrl, adminUser, url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Basic image check
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const nameTrimmed = formData.name.trim();
    const usernameTrimmed = formData.username.trim().toLowerCase();
    const emailTrimmed = formData.email.trim().toLowerCase();

    // Required fields check
    if (!nameTrimmed || !usernameTrimmed || !emailTrimmed) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Email validation
    if (!validateEmail(emailTrimmed)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // No password update needed here

    try {
      const payload = new FormData();
      payload.append('name', nameTrimmed);
      payload.append('username', usernameTrimmed);
      payload.append('email', emailTrimmed);
      // No password payload
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const response = await axios.post(`${url}/api/user/update`, payload, {
        headers: { token: adminToken },
      });

      if (!response.data.success) {
        toast.error(response.data.message || 'Profile update failed');
        setLoading(false);
        return;
      }

      // Merge and save updated details locally
      const updatedUser = {
        ...response.data.user,
        role: response.data.user?.role || adminUser?.role || 'staff',
      };

      setAdminUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));

      // Reset upload state
      setImageFile(null);

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating admin profile:', error);
      toast.error(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const normalizedRole = normalizeRole(adminUser?.role);
  const displayRole = ROLE_LABELS[normalizedRole] || normalizedRole || 'Staff';

  const labelClass = "block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 tracking-wider";
  const inputClass = "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200";

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn min-h-screen">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 dark:text-orange-400 dark:bg-orange-950/20">
            <FiUser className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Profile Settings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage your personal credentials, contact info, and profile image</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Profile Photo upload & Role info */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-orange-500 to-red-500" />
          
          <span className="mb-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30">
            {displayRole}
          </span>

          <div className="relative mt-2 h-36 w-36 rounded-full group">
            <img
              src={resolvedProfileImage}
              alt="Profile"
              className="h-full w-full rounded-full object-cover shadow-lg border-4 border-zinc-50 dark:border-zinc-800 transition group-hover:opacity-85"
            />
            <label
              htmlFor="image-upload-admin"
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-xs font-semibold"
              title="Change profile photo"
            >
              <FiCamera className="w-6 h-6 mb-1" />
              <span>Upload Photo</span>
              <input
                id="image-upload-admin"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{formData.name || 'Staff User'}</h2>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">{formData.email || 'No email on file'}</p>
          </div>

          <div className="mt-8 w-full border-t border-zinc-100 dark:border-zinc-800 pt-6 text-left space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 uppercase font-bold tracking-wider">Access Tier</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{displayRole}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 uppercase font-bold tracking-wider">System Username</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">@{formData.username || 'username'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Inputs and settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 mb-6">
              <FiSliders className="w-5 h-5 text-orange-500" />
              Personal Credentials
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter full name"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter username"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="email@example.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password section removed */}

              <div className="flex items-center justify-end pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
