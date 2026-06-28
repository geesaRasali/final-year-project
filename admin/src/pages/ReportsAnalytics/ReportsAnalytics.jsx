import React from 'react';
import { FiTrendingUp, FiDownload, FiDollarSign, FiShoppingBag, FiUsers } from 'react-icons/fi';

const ReportsAnalytics = () => {
  const metrics = [
    { label: 'Total Revenue', value: 'LKR 458,200', change: '+12.5%', isPositive: true, icon: FiDollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Total Orders Placed', value: '1,482', change: '+8.3%', isPositive: true, icon: FiShoppingBag, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Active Customers', value: '389', change: '+15.2%', isPositive: true, icon: FiUsers, color: 'text-purple-500 bg-purple-500/10' }
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-500 dark:bg-violet-500/20">
            <FiTrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Reports &amp; Analytics</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Performance statistics, sales reports, and customer growth</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
          <FiDownload className="w-5 h-5" />
          Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{m.label}</span>
                <div className={`p-2.5 rounded-xl ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-zinc-950 dark:text-white mb-2">{m.value}</h3>
              <p className="text-xs flex items-center gap-1">
                <span className={m.isPositive ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                  {m.change}
                </span>
                <span className="text-zinc-400">vs last month</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Monthly Sales Activity</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Aggregate view of revenue changes during the calendar year</p>
        <div className="h-64 flex items-end justify-between gap-2 pt-6">
          {[40, 55, 45, 60, 75, 80, 65, 85, 90, 100, 95, 110].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-full bg-indigo-500/10 group-hover:bg-indigo-500/20 dark:bg-indigo-500/10 rounded-t-lg transition-all relative" style={{ height: `${val * 1.8}px` }}>
                <div className="absolute inset-x-0 bottom-0 bg-indigo-600 group-hover:bg-indigo-500 rounded-t-lg transition-all" style={{ height: '70%' }} />
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
