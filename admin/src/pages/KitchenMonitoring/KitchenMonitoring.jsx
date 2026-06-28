import React from 'react';
import { FiClock, FiCheck, FiPlay, FiAlertCircle } from 'react-icons/fi';

const KitchenMonitoring = () => {
  const activeKitchenOrders = [
    { id: '#1024', item: 'Spicy Chicken Pizza (Large)', qty: 2, status: 'Preparing', timeLeft: '8 mins', notes: 'Extra cheese on one' },
    { id: '#1025', item: 'Special Mix Fried Rice', qty: 1, status: 'Queued', timeLeft: '15 mins', notes: 'No spring onions' },
    { id: '#1026', item: 'Beef Burger Combo', qty: 3, status: 'Preparing', timeLeft: '5 mins', notes: 'Medium-rare patties' }
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 dark:bg-red-500/20">
            <FiClock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Kitchen Monitoring</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Real-time status of food preparation orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Live Kitchen Feed</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Preparation Queue</h3>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {activeKitchenOrders.map((order) => (
            <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{order.id}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    order.status === 'Preparing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-white">
                  {order.item} <span className="text-indigo-500 font-extrabold">x{order.qty}</span>
                </h4>
                {order.notes && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                    Note: {order.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Est. Time Remaining</p>
                  <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">{order.timeLeft}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'Queued' ? (
                    <button className="flex items-center justify-center p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all">
                      <FiPlay className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="flex items-center justify-center p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all">
                      <FiCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KitchenMonitoring;
