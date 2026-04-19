import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = ({ url, adminToken }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url + '/api/order/list', {
        headers: {
          token: adminToken,
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        day: WEEK_DAYS[date.getDay()],
        date,
        orders: 0,
        amount: 0,
      };
    });

    const dayMap = new Map(days.map((day) => [day.key, day]));

    orders.forEach((order) => {
      if (!order?.date) return;
      const orderDateObj = new Date(order.date);
      const orderDate = new Date(
        orderDateObj.getFullYear(),
        orderDateObj.getMonth(),
        orderDateObj.getDate(),
      );

      const key = `${orderDate.getFullYear()}-${orderDate.getMonth()}-${orderDate.getDate()}`;
      const dayEntry = dayMap.get(key);

      if (dayEntry) {
        dayEntry.orders += 1;
        dayEntry.amount += Number(order.amount || 0);
      }
    });

    return days;
  }, [orders]);

  const summary = useMemo(() => {
    const weekOrders = weeklyData.reduce((sum, day) => sum + day.orders, 0);
    const weekRevenue = weeklyData.reduce((sum, day) => sum + day.amount, 0);
    const delivered = orders.filter((order) => order.status === 'Delivered').length;

    return {
      weekOrders,
      weekRevenue,
      delivered,
      totalOrders: orders.length,
    };
  }, [weeklyData, orders]);

  const maxAmount = Math.max(...weeklyData.map((day) => day.amount), 1);

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-8'>
      <h2 className='mb-5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>Admin Dashboard</h2>

      <div className='mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>This Week Orders</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{summary.weekOrders}</h3>
        </div>
        <div className='rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>This Week Revenue</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{formatMoney(summary.weekRevenue)}</h3>
        </div>
        <div className='rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>Delivered Orders</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{summary.delivered}</h3>
        </div>
        <div className='rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>Total Orders</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{summary.totalOrders}</h3>
        </div>
      </div>

      <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-5 dark:border-zinc-700 dark:bg-zinc-900'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>Weekly Revenue Chart</h3>
          <button
            type='button'
            onClick={fetchAllOrders}
            className='rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-orange-300 dark:hover:bg-zinc-700'
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>Loading chart...</p>
        ) : (
          <div className='overflow-x-auto'>
            <div className='grid min-w-[700px] grid-cols-7 items-end gap-3'>
            {weeklyData.map((day) => {
              const barHeight = Math.max((day.amount / maxAmount) * 100, day.amount > 0 ? 10 : 2);

              return (
                <div className='flex flex-col items-center gap-2' key={day.key}>
                  <span className='text-xs text-zinc-500 dark:text-zinc-400'>{formatMoney(day.amount)}</span>
                  <div className='flex h-42 w-full max-w-16 items-end overflow-hidden rounded-xl border border-orange-200 bg-orange-50 dark:border-zinc-700 dark:bg-zinc-800'>
                    <div
                      className='w-full rounded-xl bg-gradient-to-b from-orange-400 to-orange-600'
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                  <span className='text-sm font-bold text-zinc-800 dark:text-zinc-200'>{day.day}</span>
                  <span className='text-[11px] text-zinc-500 dark:text-zinc-400'>{day.orders} orders</span>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
