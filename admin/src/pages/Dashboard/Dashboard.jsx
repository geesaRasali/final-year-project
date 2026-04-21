import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const normalizeStatus = (status = '') => status.toLowerCase().trim();

const formatMoney = (value) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = ({ url, adminToken }) => {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const lowStockThreshold = 5;

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const [ordersResponse, foodsResponse] = await Promise.all([
        axios.get(url + '/api/order/list', {
          headers: {
            token: adminToken,
            Authorization: `Bearer ${adminToken}`,
          },
        }),
        axios.get(url + '/api/food/list'),
      ]);

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.data || []);
      } else {
        toast.error('Error fetching orders');
      }

      if (foodsResponse.data.success) {
        setFoods(foodsResponse.data.data || []);
      } else {
        setFoods([]);
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
    const newOrders = orders.filter(
      (order) => normalizeStatus(order.status || 'Food Processing') === 'food processing',
    ).length;
    const onDelivery = orders.filter(
      (order) => normalizeStatus(order.status) === 'out for delivery',
    ).length;
    const delivered = orders.filter(
      (order) => normalizeStatus(order.status) === 'delivered',
    ).length;
    const canceled = orders.filter(
      (order) => normalizeStatus(order.status).includes('cancel'),
    ).length;

    return {
      weekOrders,
      weekRevenue,
      newOrders,
      onDelivery,
      delivered,
      canceled,
      totalOrders: orders.length,
    };
  }, [weeklyData, orders]);

  const weeklyChartData = weeklyData.map((day) => ({
    ...day,
    expense: Math.round(day.amount * 0.42),
  }));

  const totalIncome = weeklyChartData.reduce((sum, day) => sum + day.amount, 0);
  const totalExpense = weeklyChartData.reduce((sum, day) => sum + day.expense, 0);
  const maxChartValue = Math.max(
    ...weeklyChartData.flatMap((day) => [day.amount, day.expense]),
    1,
  );

  const peakDay = weeklyChartData.reduce(
    (best, day) => (day.amount > best.amount ? day : best),
    weeklyChartData[0] || { day: '-', amount: 0 },
  );

  const chartWidth = 700;
  const chartHeight = 205;
  const chartPaddingX = 24;
  const chartPaddingY = 26;
  const chartRangeX = chartWidth - chartPaddingX * 2;
  const chartRangeY = chartHeight - chartPaddingY * 2;

  const incomePoints = weeklyChartData.map((day, index) => {
    const x = chartPaddingX + (chartRangeX / Math.max(weeklyData.length - 1, 1)) * index;
    const valueRatio = day.amount / maxChartValue;
    const y = chartPaddingY + chartRangeY - valueRatio * chartRangeY;

    return { ...day, x, y };
  });

  const expensePoints = weeklyChartData.map((day, index) => {
    const x = chartPaddingX + (chartRangeX / Math.max(weeklyData.length - 1, 1)) * index;
    const valueRatio = day.expense / maxChartValue;
    const y = chartPaddingY + chartRangeY - valueRatio * chartRangeY;

    return { ...day, x, y };
  });

  const buildLinePath = (points) =>
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

  const buildAreaPath = (points) => {
    const line = buildLinePath(points);
    const lastX = points[points.length - 1]?.x || chartPaddingX;
    return `${line} L ${lastX} ${chartHeight - chartPaddingY} L ${chartPaddingX} ${chartHeight - chartPaddingY} Z`;
  };

  const incomeLinePath = buildLinePath(incomePoints);
  const expenseLinePath = buildLinePath(expensePoints);
  const incomeAreaPath = buildAreaPath(incomePoints);
  const expenseAreaPath = buildAreaPath(expensePoints);

  const totalStatusCount = summary.onDelivery + summary.delivered + summary.canceled;
  const onDeliveryPercent = totalStatusCount ? (summary.onDelivery / totalStatusCount) * 100 : 0;
  const deliveredPercent = totalStatusCount ? (summary.delivered / totalStatusCount) * 100 : 0;

  const donutTrack = totalStatusCount
    ? `conic-gradient(#f97316 0 ${onDeliveryPercent}%, #22c55e ${onDeliveryPercent}% ${onDeliveryPercent + deliveredPercent}%, #374151 ${onDeliveryPercent + deliveredPercent}% 100%)`
    : 'conic-gradient(#d4d4d8 0 100%)';

  const maxStatusBar = Math.max(summary.onDelivery, summary.delivered, summary.canceled, 1);

  const formatShortMoney = (value) =>
    new Intl.NumberFormat('en-LK', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value || 0);

  const getStockValue = (item) => {
    const stockCandidate = item?.stock ?? item?.quantity ?? item?.availableQty;
    const stock = Number(stockCandidate);
    return Number.isFinite(stock) ? stock : null;
  };

  const hasInventoryData = foods.some((item) => getStockValue(item) !== null);
  const lowStockItems = foods
    .map((item) => ({
      ...item,
      stockValue: getStockValue(item),
    }))
    .filter((item) => item.stockValue !== null && item.stockValue <= lowStockThreshold)
    .sort((a, b) => a.stockValue - b.stockValue)
    .slice(0, 5);

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
        {loading ? (
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>Loading weekly data...</p>
        ) : (
          <>
          <div className='grid gap-5 xl:grid-cols-[1.25fr_0.9fr]'>
            <section className='rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-700 dark:bg-zinc-800/40'>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                  <h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>Orders Summary</h3>
                  <p className='text-xs text-zinc-500 dark:text-zinc-400'>Last 7 days order activity</p>
                </div>
                <div className='flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 text-xs dark:border-zinc-700 dark:bg-zinc-900'>
                  <button type='button' className='rounded-md px-2 py-1 text-zinc-500'>Monthly</button>
                  <button type='button' className='rounded-md px-2 py-1 text-zinc-500'>Weekly</button>
                  <button type='button' className='rounded-md bg-zinc-900 px-2 py-1 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900'>Today</button>
                </div>
              </div>

              <div className='mb-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10'>
                <div className='flex items-center gap-2'>
                  <span className='inline-flex min-w-8 justify-center rounded-md bg-emerald-500 px-2 py-1 text-sm font-bold text-white'>
                    {summary.newOrders}
                  </span>
                  <p className='text-sm font-semibold text-emerald-800 dark:text-emerald-300'>New Orders</p>
                </div>
                <button
                  type='button'
                  onClick={fetchAllOrders}
                  className='text-xs font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200'
                >
                  Refresh
                </button>
              </div>

              <div className='grid grid-cols-3 divide-x divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-900'>
                <div className='p-5'>
                  <p className='text-2xl font-bold text-zinc-900 dark:text-zinc-100'>{summary.newOrders}</p>
                  <p className='text-xs text-zinc-500 dark:text-zinc-400'>Food Processing</p>
                </div>
                <div className='p-5'>
                  <p className='text-2xl font-bold text-zinc-900 dark:text-zinc-100'>{summary.onDelivery}</p>
                  <p className='text-xs text-zinc-500 dark:text-zinc-400'>Out for Delivery</p>
                </div>
                <div className='p-5'>
                  <p className='text-2xl font-bold text-zinc-900 dark:text-zinc-100'>{summary.delivered}</p>
                  <p className='text-xs text-zinc-500 dark:text-zinc-400'>Delivered</p>
                </div>
              </div>

              <div className='mt-5 grid grid-cols-[112px_minmax(0,1fr)] items-center gap-5'>
                <div className='relative flex h-24 w-24 items-center justify-center rounded-full' style={{ background: donutTrack }}>
                  <div className='h-12 w-12 rounded-full bg-white dark:bg-zinc-900' />
                </div>

                <div className='space-y-3'>
                  {[
                    { label: 'Food Processing', value: summary.newOrders, color: 'bg-orange-500' },
                    { label: 'Out for Delivery', value: summary.onDelivery, color: 'bg-emerald-500' },
                    { label: 'Delivered', value: summary.delivered, color: 'bg-zinc-700 dark:bg-zinc-400' },
                  ].map((item) => (
                    <div key={item.label} className='grid grid-cols-[90px_minmax(0,1fr)_28px] items-center gap-2 text-xs'>
                      <span className='font-medium text-zinc-600 dark:text-zinc-300'>{item.label}</span>
                      <div className='h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700'>
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / maxStatusBar) * 100}%` }} />
                      </div>
                      <span className='text-right font-semibold text-zinc-500 dark:text-zinc-400'>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className='rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-800/40'>
              <div className='mb-3 flex items-start justify-between gap-3'>
                <div>
                  <h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>Revenue</h3>
                  <p className='text-xs text-zinc-500 dark:text-zinc-400'>Peak day {peakDay.day} reached {formatMoney(peakDay.amount)}</p>
                </div>
                <div className='rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'>
                  Weekly
                </div>
              </div>

              <div className='mb-4 flex flex-wrap items-center gap-4 text-xs'>
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-sm bg-blue-500' />
                  <span className='text-zinc-500 dark:text-zinc-400'>Income</span>
                </div>
                <p className='font-bold text-zinc-900 dark:text-zinc-100'>{formatMoney(totalIncome)}</p>
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-sm bg-fuchsia-500' />
                  <span className='text-zinc-500 dark:text-zinc-400'>Expense</span>
                </div>
                <p className='font-bold text-zinc-900 dark:text-zinc-100'>{formatMoney(totalExpense)}</p>
              </div>

              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className='h-52 w-full'>
                <defs>
                  <linearGradient id='incomeFill' x1='0' x2='0' y1='0' y2='1'>
                    <stop offset='0%' stopColor='rgb(59 130 246 / 0.22)' />
                    <stop offset='100%' stopColor='rgb(59 130 246 / 0.03)' />
                  </linearGradient>
                  <linearGradient id='expenseFill' x1='0' x2='0' y1='0' y2='1'>
                    <stop offset='0%' stopColor='rgb(217 70 239 / 0.2)' />
                    <stop offset='100%' stopColor='rgb(217 70 239 / 0.02)' />
                  </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75].map((fraction) => (
                  <line
                    key={fraction}
                    x1={chartPaddingX}
                    x2={chartWidth - chartPaddingX}
                    y1={chartPaddingY + chartRangeY * fraction}
                    y2={chartPaddingY + chartRangeY * fraction}
                    stroke='rgb(228 228 231)'
                    strokeWidth='1'
                  />
                ))}

                <path d={incomeAreaPath} fill='url(#incomeFill)' />
                <path d={expenseAreaPath} fill='url(#expenseFill)' />
                <path d={incomeLinePath} fill='none' stroke='rgb(59 130 246)' strokeWidth='3.5' strokeLinejoin='round' strokeLinecap='round' />
                <path d={expenseLinePath} fill='none' stroke='rgb(217 70 239)' strokeWidth='3.5' strokeLinejoin='round' strokeLinecap='round' />
              </svg>

              <div className='mt-1 grid grid-cols-7 gap-1'>
                {weeklyChartData.map((day) => (
                  <div key={day.key} className='text-center'>
                    <p className='text-[11px] font-semibold text-zinc-500 dark:text-zinc-400'>{day.day}</p>
                    <p className='mt-1 text-[10px] text-zinc-400 dark:text-zinc-500'>{formatShortMoney(day.amount)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className='mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900'>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>Low Stock Alerts</h3>
              <span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'>
                Threshold {lowStockThreshold}
              </span>
            </div>

            {!hasInventoryData ? (
              <p className='rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300'>
                Stock fields not found yet. Add a numeric stock field like stock or quantity in your food records to enable alerts.
              </p>
            ) : lowStockItems.length === 0 ? (
              <p className='text-sm text-zinc-500 dark:text-zinc-400'>No low-stock items right now.</p>
            ) : (
              <div className='space-y-2'>
                {lowStockItems.map((item) => {
                  const isCritical = item.stockValue <= 2;

                  return (
                    <div
                      key={item._id || item.name}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                        isCritical
                          ? 'border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10'
                          : 'border-orange-200 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/10'
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isCritical ? 'bg-red-500' : 'bg-orange-500'}`} />
                        <p className='text-sm font-semibold text-zinc-800 dark:text-zinc-100'>{item.name}</p>
                      </div>
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${isCritical ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'}`}>
                        {item.stockValue} left
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
