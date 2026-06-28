import React from 'react';
import { FiTruck, FiMap, FiCheckCircle, FiCompass } from 'react-icons/fi';

const DeliveryMonitoring = () => {
  const activeDeliveries = [
    { id: '#1021', customer: 'Amila Perera', address: '45 Galle Rd, Colombo 03', rider: 'Kamal Bandara', status: 'In Transit', time: '12 mins left' },
    { id: '#1022', customer: 'Dinithi Silva', address: '12/A Flower Rd, Colombo 07', rider: 'Nimal Jayasinghe', status: 'Picked Up', time: '20 mins left' },
    { id: '#1023', customer: 'Roshan De Alwis', address: '88 Kandy Rd, Kelaniya', rider: 'Sunil Perera', status: 'Delivered', time: 'Completed 5m ago' }
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 dark:bg-blue-500/20">
            <FiTruck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Delivery Monitoring</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Track active delivery routes, riders, and drop-offs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl font-bold transition-all">
            <FiMap className="w-4 h-4" />
            View Live Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {activeDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{delivery.id}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    delivery.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300'
                      : delivery.status === 'Picked Up'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                  }`}>
                    {delivery.status}
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  {delivery.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{delivery.customer}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{delivery.address}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400 text-xs">
                    {delivery.rider.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Rider Assigned</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{delivery.rider}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Track Delivery
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Delivery Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
              <div className="flex items-center gap-2">
                <FiCompass className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Pending Deliveries</span>
              </div>
              <span className="text-lg font-black text-zinc-950 dark:text-white">4</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
              <div className="flex items-center gap-2">
                <FiTruck className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Active Riders Out</span>
              </div>
              <span className="text-lg font-black text-zinc-950 dark:text-white">2</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Completed Today</span>
              </div>
              <span className="text-lg font-black text-zinc-950 dark:text-white">18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMonitoring;
