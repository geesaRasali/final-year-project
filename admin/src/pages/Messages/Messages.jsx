import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Messages = ({ url, adminToken }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${url}/api/contact/list`, {
        headers: { token: adminToken },
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || 'Failed to load messages');
        return;
      }

      setMessages(response.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, url]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleRefresh = () => {
    fetchMessages();
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString();
  };

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-8'>
      <div className='mb-5 flex items-center justify-between gap-3'>
        <h2 className='text-3xl font-bold tracking-tight text-orange-300'>Customer Messages</h2>
        <button
          type='button'
          onClick={handleRefresh}
          className='rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100'
        >
          Refresh
        </button>
      </div>

      <div className='rounded-xl border border-zinc-200 bg-white p-5 shadow-sm'>
        {isLoading ? (
          <p className='text-sm text-zinc-500'>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className='text-sm text-zinc-500'>No customer messages yet.</p>
        ) : (
          <div className='space-y-4'>
            {messages.map((item) => (
              <article key={item._id} className='rounded-xl border border-zinc-200 p-4'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <h3 className='text-lg font-semibold text-zinc-900'>{item.name}</h3>
                  <p className='text-xs font-medium text-zinc-500'>{formatDate(item.createdAt)}</p>
                </div>
                <p className='mt-2 text-sm text-zinc-700'>Email: {item.email}</p>
                <p className='mt-1 text-sm text-zinc-700'>Phone/Subject: {item.phone || '-'}</p>
                <p className='mt-3 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-800'>
                  {item.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
