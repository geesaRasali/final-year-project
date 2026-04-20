import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatMoney = (value) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
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
  const peakDay = weeklyData.reduce(
    (best, day) => (day.amount > best.amount ? day : best),
    weeklyData[0] || { day: '-', amount: 0 },
  );

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-8'>
      <h2 className='mb-5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>Admin Dashboard</h2>

      <div className='mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>This Week Orders</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{summary.weekOrders}</h3>
        </div>
        <div className='rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>This Week Revenue</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{formatMoney(summary.weekRevenue)}</h3>
        </div>
        <div className='rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>Delivered Orders</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{summary.delivered}</h3>
        </div>
        <div className='rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>Total Orders</p>
          <h3 className='text-3xl font-extrabold text-orange-600'>{summary.totalOrders}</h3>
        </div>
      </div>

      <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-5 dark:border-zinc-700 dark:bg-zinc-900'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <div>
            <h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>Weekly Revenue Chart</h3>
            <p className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
              Peak day: <span className='font-semibold text-zinc-700 dark:text-zinc-300'>{peakDay.day}</span> ({formatMoney(peakDay.amount)})
            </p>
          </div>
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
            <div className='grid min-w-190 grid-cols-7 gap-4'>
              {weeklyData.map((day) => {
                const barHeight = Math.max((day.amount / maxAmount) * 100, day.amount > 0 ? 12 : 3);
                const isPeak = day.key === peakDay.key;

                return (
                  <div className='rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700 dark:bg-zinc-800/40' key={day.key}>
                    <p className='mb-2 text-center text-[11px] font-semibold text-zinc-500 dark:text-zinc-400'>
                      {formatMoney(day.amount)}
                    </p>

                    <div className='flex h-44 items-end justify-center rounded-xl border border-zinc-200 bg-white px-2 pb-1 dark:border-zinc-700 dark:bg-zinc-900'>
                      <div
                        className={`w-full max-w-12 rounded-lg bg-linear-to-b ${
                          isPeak
                            ? 'from-orange-400 to-orange-600 shadow-[0_0_0_2px_rgba(249,115,22,0.2)]'
                            : 'from-zinc-300 to-zinc-400 dark:from-zinc-500 dark:to-zinc-600'
                        }`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>

                    <p className='mt-3 text-center text-xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100'>
                      {day.day}
                    </p>
                    <p className='mt-0.5 text-center text-xs text-zinc-500 dark:text-zinc-400'>
                      {day.orders} orders
                    </p>
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
