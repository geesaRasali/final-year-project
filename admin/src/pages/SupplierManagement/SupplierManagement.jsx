import React from 'react';
import { FiUsers, FiPlus, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const SupplierManagement = () => {
  const sampleSuppliers = [
    { name: 'Fresh Farms Ltd', contact: 'John Doe', phone: '+94 77 123 4567', email: 'freshfarms@example.com', address: '123 Farm Rd, Colombo', items: 'Vegetables & Fruits' },
    { name: 'Supreme Dairy Corp', contact: 'Sarah Smith', phone: '+94 77 987 6543', email: 'supreme@example.com', address: '45 Dairy Ave, Kandy', items: 'Milk, Cheese & Butter' },
    { name: 'Global Spices & Grains', contact: 'Ali Khan', phone: '+94 77 555 4321', email: 'globalspices@example.com', address: '78 Spice Bazaar, Negombo', items: 'Spices, Flour & Rice' }
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 dark:bg-orange-500/20">
            <FiUsers className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Supplier Management</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage and track ingredient suppliers</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
          <FiPlus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleSuppliers.map((supplier) => (
          <div key={supplier.name} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{supplier.name}</h3>
              <span className="text-xs bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-bold px-2.5 py-1 rounded-full inline-block mt-2">
                {supplier.items}
              </span>
            </div>
            
            <div className="space-y-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-zinc-400" />
                <span>Contact: {supplier.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-zinc-400" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="w-4 h-4 text-zinc-400" />
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-zinc-400" />
                <span className="truncate">{supplier.address}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors">
                Edit Details
              </button>
              <button className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierManagement;
