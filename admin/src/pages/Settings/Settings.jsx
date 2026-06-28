import React from 'react';
import { FiSettings, FiSliders, FiBell, FiShield, FiDatabase } from 'react-icons/fi';

const Settings = () => {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-zinc-500/10 rounded-2xl text-zinc-800 dark:text-zinc-200 dark:bg-zinc-850">
            <FiSettings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Settings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Configure system metrics, operating parameters, and notifications</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm md:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <FiSliders className="w-5 h-5 text-indigo-500" />
            General Parameters
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Shop Name</label>
              <input type="text" defaultValue="Urban Foods" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Contact Email</label>
              <input type="email" defaultValue="admin@urbanfoods.com" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Delivery Charge (LKR)</label>
              <input type="number" defaultValue="250" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Low Stock Alert Threshold</label>
              <input type="number" defaultValue="5" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="pt-4">
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
              Save Settings
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <FiBell className="w-4 h-4 text-amber-500" />
              Notifications
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Email on low stock alerts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Sound on new order ping</span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <FiShield className="w-4 h-4 text-rose-500" />
              Security &amp; Backup
            </h4>
            <div className="space-y-2">
              <button className="w-full text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                <FiDatabase className="w-4 h-4" />
                Backup Database Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
