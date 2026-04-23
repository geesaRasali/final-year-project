import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Messages = ({ url, adminToken }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayCount = messages.filter((item) => {
    if (!item?.createdAt) return false;
    const d = new Date(item.createdAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const latestMessage = messages[0];

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

  // ... ඉහත imports සහ functions වෙනස් නොවේ ...

  return (
    <section className='min-h-[calc(100vh-4rem)] bg-orange-50/45 px-4 py-5 dark:bg-zinc-900 md:px-7'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-4 rounded-2xl border border-orange-200 bg-linear-to-r from-white via-orange-50/60 to-amber-50/70 p-4 shadow-[0_14px_34px_rgba(249,115,22,0.08)] dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 md:p-5'>
          
          {/* මෙතන items-end වෙනුවට items-start දැම්මා, එවිට button එක උඩට එනවා */}
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-orange-600'>Communication</p>
              <h2 className='mt-1.5 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100'>Customer Messages</h2>
              <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>Quickly view and respond to customer questions.</p>
            </div>

            {/* Button එක දැන් ප්‍රධාන flex එක ඇතුළේ තියෙන්නේ */}
            <button
              type="button"
              onClick={handleRefresh}
              className="shrink-0 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
            >
              Refresh
            </button>
          </div>

        </div>

        {/* ඉතිරි කොටස වෙනස් නොවේ */}
        <div className='rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900'>
          {isLoading ? (
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>No customer messages yet.</p>
          ) : (
            <div className='space-y-3'>
              {messages.map((item) => (
                <article key={item._id} className='rounded-xl border border-zinc-200 p-3 dark:border-zinc-700'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <h3 className='text-base font-bold text-zinc-900 dark:text-zinc-100'>{item.name}</h3>
                    <p className='text-xs font-medium text-zinc-500 dark:text-zinc-400'>{formatDate(item.createdAt)}</p>
                  </div>
                  <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>Email: {item.email}</p>
                  <p className='mt-0.5 text-sm text-zinc-700 dark:text-zinc-300'>Phone/Subject: {item.phone || '-'}</p>
                  <p className='mt-2 whitespace-pre-wrap rounded-lg bg-zinc-50 p-2.5 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'>
                    {item.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Messages;