import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ROLE_LABELS, STAFF_ROLE_OPTIONS } from '../../config/rbac';

const initialForm = {
  id: '',
  name: '',
  email: '',
  username: '',
  password: '',
  role: STAFF_ROLE_OPTIONS[0],
};

const StaffUsers = ({ url, adminToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const authHeaders = useMemo(
    () => ({
      token: adminToken,
      Authorization: `Bearer ${adminToken}`,
    }),
    [adminToken],
  );

  const isEditing = Boolean(form.id);

  const resetForm = () => setForm(initialForm);

  const fetchStaffUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/user/staff`, { headers: authHeaders });
      if (!response.data.success) {
        toast.error(response.data.message || 'Failed to fetch staff users');
        return;
      }
      setUsers(response.data.users || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch staff users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      username: user.username || '',
      password: '',
      role: user.role || STAFF_ROLE_OPTIONS[0],
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this staff account?')) return;

    try {
      const response = await axios.delete(`${url}/api/user/staff/${id}`, { headers: authHeaders });
      if (!response.data.success) {
        toast.error(response.data.message || 'Failed to delete staff user');
        return;
      }
      toast.success('Staff user deleted');
      fetchStaffUsers();
      if (form.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete staff user');
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.username.trim() || !form.role.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!isEditing && !form.password.trim()) {
      toast.error('Password is required for a new staff user');
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      username: form.username,
      role: form.role,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      setSaving(true);

      const response = isEditing
        ? await axios.put(`${url}/api/user/staff/${form.id}`, payload, { headers: authHeaders })
        : await axios.post(`${url}/api/user/staff`, payload, { headers: authHeaders });

      if (!response.data.success) {
        toast.error(response.data.message || 'Unable to save staff user');
        return;
      }

      toast.success(isEditing ? 'Staff user updated' : 'Staff user created');
      resetForm();
      fetchStaffUsers();
    } catch (error) {
      console.error(error);
      toast.error('Unable to save staff user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='grid gap-5 px-4 py-6 md:px-8'>
      <div className='rounded-xl bg-white p-5 shadow-[0_3px_15px_rgba(0,0,0,0.08)]'>
        <h2 className='mb-4 text-2xl font-bold tracking-tight text-zinc-900'>{isEditing ? 'Edit Staff User' : 'Create Staff User'}</h2>
        <form onSubmit={onSubmit} className='grid max-w-2xl gap-3'>
          <input
            name='name'
            value={form.name}
            onChange={onChange}
            placeholder='Full name'
            required
            className='rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
          />
          <input
            name='email'
            type='email'
            value={form.email}
            onChange={onChange}
            placeholder='Email'
            required
            className='rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
          />
          <input
            name='username'
            value={form.username}
            onChange={onChange}
            placeholder='Username'
            required
            className='rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
          />
          <input
            name='password'
            type='password'
            value={form.password}
            onChange={onChange}
            placeholder={isEditing ? 'New password (optional)' : 'Password'}
            required={!isEditing}
            className='rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
          />
          <select
            name='role'
            value={form.role}
            onChange={onChange}
            className='rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
          >
            {STAFF_ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={saving}
              className='rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {saving ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
            </button>
            {isEditing && (
              <button
                type='button'
                onClick={resetForm}
                className='rounded-lg bg-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-300'
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className='rounded-xl bg-white p-5 shadow-[0_3px_15px_rgba(0,0,0,0.08)]'>
        <h3 className='mb-3 text-xl font-bold text-zinc-900'>Staff Accounts</h3>
        {loading ? (
          <p className='text-sm text-zinc-500'>Loading staff users...</p>
        ) : users.length === 0 ? (
          <p className='text-sm text-zinc-500'>No staff users found.</p>
        ) : (
          <div className='grid gap-2'>
            <div className='hidden grid-cols-[1.2fr_1fr_1.4fr_1fr_1fr] gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-900 md:grid'>
              <span>Name</span>
              <span>Username</span>
              <span>Email</span>
              <span>Role</span>
              <span>Actions</span>
            </div>
            {users.map((user) => (
              <div
                key={user.id}
                className='grid gap-2 rounded-lg border border-zinc-200 px-3 py-3 text-sm md:grid-cols-[1.2fr_1fr_1.4fr_1fr_1fr] md:items-center'
              >
                <span className='font-semibold text-zinc-800'>{user.name}</span>
                <span className='text-zinc-700'>{user.username}</span>
                <span className='text-zinc-700'>{user.email}</span>
                <span className='text-zinc-700'>{ROLE_LABELS[user.role] || user.role}</span>
                <span className='flex gap-2'>
                  <button
                    type='button'
                    onClick={() => onEdit(user)}
                    className='rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => onDelete(user.id)}
                    className='rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700'
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffUsers;
