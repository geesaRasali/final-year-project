import React from 'react'
import { FiPackage, FiPlusCircle, FiRepeat, FiList, FiTruck, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const stockSections = [
  { label: 'Add Supplier', icon: FiUserPlus, description: 'Create and manage supplier records.', href: '/stock-control/add-supplier' },
  { label: 'Add Stock', icon: FiPlusCircle, description: 'Record incoming stock quantities.', href: '/stock-control/add-stock' },
  { label: 'Stock List', icon: FiList, description: 'Review current stock levels and statuses.', href: '/stock-control/stock-list' },
  { label: 'Add New Item', icon: FiPackage, description: 'Create new inventory items for the kitchen.', href: '/stock-control/add-new-item' },
  { label: 'Kitchen Transfer List', icon: FiTruck, description: 'Track items moved to kitchen operations.', href: '/stock-control/kitchen-transfer-list' },
  { label: 'Add Item', icon: FiRepeat, description: 'Quickly add items to stock workflows.', href: '/stock-control/add-item' },
]

const StockControl = () => {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Stock Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockSections.map((section, index) => {
          const Icon = section.icon
          return (
            <button
              key={index}
              onClick={() => navigate(section.href)}
              className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-zinc-700 text-left"
            >
              <div className="flex items-start gap-4">
                <Icon className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-2">{section.label}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StockControl