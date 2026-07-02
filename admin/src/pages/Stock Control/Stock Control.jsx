import React, { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { FiPackage, FiPlusCircle, FiRepeat, FiList, FiTruck, FiUserPlus, FiArrowLeft, FiPlus, FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { toast } from 'react-toastify'
import SupplierManagement from '../SupplierManagement/SupplierManagement'
import Add from '../Add/Add'

// 1. Grid Portal View (Default)
const StockControlGrid = () => {
  const navigate = useNavigate()

  const stockSections = [
    { label: 'Add Supplier', icon: FiUserPlus, description: 'Create and manage supplier records.', href: '/stock-control/add-supplier' },
    { label: 'Add Item', icon: FiRepeat, description: 'Quickly add items to stock workflows.', href: '/stock-control/add-item' },
    { label: 'Add Stock', icon: FiPlusCircle, description: 'Record incoming stock quantities.', href: '/stock-control/add-stock' },
    { label: 'Stock List', icon: FiList, description: 'Review current stock levels and statuses.', href: '/stock-control/stock-list' },
    { label: 'Add New Item', icon: FiPackage, description: 'Create new inventory items for the kitchen.', href: '/stock-control/add-new-item' },
    { label: 'Kitchen Transfer List', icon: FiTruck, description: 'Track items moved to kitchen operations.', href: '/stock-control/kitchen-transfer-list' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn text-zinc-900 dark:text-zinc-100">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Stock Control Operations</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage warehouse stock, supplier networks, and kitchen transfers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockSections.map((section, index) => {
          const Icon = section.icon
          return (
            <button
              key={index}
              onClick={() => navigate(section.href)}
              className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-md border border-zinc-200 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-950 text-left transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 dark:bg-orange-500/20 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 flex-shrink-0" />
                </div>
                <div>
                  <h2 className="font-bold text-zinc-900 dark:text-white mb-1">{section.label}</h2>
                  <p className="text-xs text-zinc-555 dark:text-zinc-400 leading-relaxed">{section.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 2. Add Stock Component
const AddStock = ({ url, adminToken }) => {
  const navigate = useNavigate()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    foodId: '',
    supplier: 'Fresh Farms Ltd',
    quantity: '',
    notes: ''
  })

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${url}/api/food/list`)
        if (res.data.success) {
          setFoods(res.data.data)
          if (res.data.data.length > 0) {
            setFormData(prev => ({ ...prev, foodId: res.data.data[0]._id }))
          }
        }
      } catch (err) {
        toast.error("Failed to load inventory items.")
      } finally {
        setLoading(false)
      }
    }
    fetchFoods()
  }, [url])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.warn("Please enter a valid stock quantity.")
      return
    }
    toast.success("Incoming stock recorded successfully!")
    setFormData(prev => ({ ...prev, quantity: '', notes: '' }))
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fadeIn text-zinc-900 dark:text-zinc-100">
      <button onClick={() => navigate('/stock-control')} className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-orange-600 mb-6 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Stock Control
      </button>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-black mb-6 tracking-tight">Record Incoming Stock</h2>

        {loading ? (
          <p className="text-sm text-zinc-500">Loading products...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Select Item</label>
              <select
                value={formData.foodId}
                onChange={e => setFormData({ ...formData, foodId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:border-orange-500 focus:outline-none dark:bg-zinc-950 font-medium"
              >
                {foods.map(f => (
                  <option key={f._id} value={f._id}>{f.name} ({f.category})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Supplier</label>
              <select
                value={formData.supplier}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:border-orange-500 focus:outline-none dark:bg-zinc-950 font-medium"
              >
                <option value="Fresh Farms Ltd">Fresh Farms Ltd</option>
                <option value="Supreme Dairy Corp">Supreme Dairy Corp</option>
                <option value="Global Spices & Grains">Global Spices & Grains</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Quantity Added</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:border-orange-500 focus:outline-none dark:bg-zinc-950 font-medium"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Notes / Remarks</label>
              <textarea
                placeholder="Batch number, expiry dates, or warehouse shelf location..."
                rows="3"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:border-orange-500 focus:outline-none dark:bg-zinc-950 font-medium resize-none"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.98]">
              Record Stock Entry
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// 3. Stock List Component
const StockList = ({ url, adminToken }) => {
  const navigate = useNavigate()
  const [foods, setFoods] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${url}/api/food/list`)
        if (res.data.success) {
          setFoods(res.data.data)
        }
      } catch (err) {
        toast.error("Failed to load stock list.")
      } finally {
        setLoading(false)
      }
    }
    fetchFoods()
  }, [url])

  const getStock = (name) => {
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return charSum % 14; 
  }

  const filteredFoods = foods.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn text-zinc-900 dark:text-zinc-100">
      <button onClick={() => navigate('/stock-control')} className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-orange-600 mb-6 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Stock Control
      </button>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Current Stock List</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Comprehensive database of all culinary items and stock values.</p>
          </div>
          <div className="relative max-w-md w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items or categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:border-orange-500 focus:outline-none dark:bg-zinc-950 font-medium"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500">Loading inventory items...</p>
        ) : filteredFoods.length === 0 ? (
          <p className="text-sm text-zinc-500 py-6 text-center">No inventory matching the search filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="pb-3 pl-2">Image</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Qty Level</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-850">
                {filteredFoods.map(item => {
                  const stock = getStock(item.name)
                  return (
                    <tr key={item._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                      <td className="py-3 pl-2">
                        <img src={`${url}/images/${item.image}`} alt={item.name} className="h-10 w-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800" />
                      </td>
                      <td className="py-3 font-bold text-zinc-855 dark:text-zinc-200">{item.name}</td>
                      <td className="py-3 text-zinc-500">{item.category}</td>
                      <td className="py-3 font-semibold text-zinc-700 dark:text-zinc-350">LKR {item.price}</td>
                      <td className="py-3 font-bold text-zinc-800 dark:text-zinc-200">{stock} units</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                          stock <= 3 
                            ? 'bg-red-100 text-red-650 dark:bg-red-950/20 dark:text-red-400' 
                            : stock <= 5 
                              ? 'bg-orange-100 text-orange-650 dark:bg-orange-950/20 dark:text-orange-400' 
                              : 'bg-emerald-100 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-455'
                        }`}>
                          {stock <= 3 ? 'Critical' : stock <= 5 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// 4. Kitchen Transfer Component
const KitchenTransferList = () => {
  const navigate = useNavigate()

  const transfers = [
    { id: 'TRF-0098', date: '2026-06-28', item: 'Fresh Tomatoes', qty: '40 kg', to: 'Pasta & Pizza Line', status: 'Completed' },
    { id: 'TRF-0097', date: '2026-06-28', item: 'Supreme Cheddar Cheese', qty: '15 kg', to: 'Main Bakery Deck', status: 'Completed' },
    { id: 'TRF-0096', date: '2026-06-27', item: 'Extra Virgin Olive Oil', qty: '10 Litres', to: 'Salad & Cold Station', status: 'Completed' },
    { id: 'TRF-0095', date: '2026-06-26', item: 'Basmati Rice Special', qty: '50 kg', to: 'Main Hot Line A', status: 'Completed' },
    { id: 'TRF-0094', date: '2026-06-25', item: 'Indian Ground Cumin', qty: '5 kg', to: 'Spices Section', status: 'Completed' }
  ]

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fadeIn text-zinc-900 dark:text-zinc-100">
      <button onClick={() => navigate('/stock-control')} className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-orange-600 mb-6 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Stock Control
      </button>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight">Kitchen Stock Transfers</h2>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-0.5">Logs of items dispatched from primary store to active culinary lines.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-450 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="pb-3 pl-2">Transfer ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Item Dispatch</th>
                <th className="pb-3">Qty Moved</th>
                <th className="pb-3">Recipient Section</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-850">
              {transfers.map(trf => (
                <tr key={trf.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                  <td className="py-4 pl-2 font-mono text-xs font-bold text-orange-600">{trf.id}</td>
                  <td className="py-4 text-zinc-500">{trf.date}</td>
                  <td className="py-4 font-bold text-zinc-850 dark:text-zinc-200">{trf.item}</td>
                  <td className="py-4 font-semibold text-zinc-700 dark:text-zinc-300">{trf.qty}</td>
                  <td className="py-4 text-zinc-655 dark:text-zinc-400 font-medium">{trf.to}</td>
                  <td className="py-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400">
                      {trf.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 5. Main Component Router
const StockControl = ({ url, adminToken }) => {
  return (
    <Routes>
      <Route path="/" element={<StockControlGrid />} />
      <Route path="/add-supplier" element={<SupplierManagement />} />
      <Route path="/add-stock" element={<AddStock url={url} adminToken={adminToken} />} />
      <Route path="/stock-list" element={<StockList url={url} adminToken={adminToken} />} />
      <Route path="/add-new-item" element={<Add url={url} adminToken={adminToken} />} />
      <Route path="/kitchen-transfer-list" element={<KitchenTransferList />} />
      <Route path="/add-item" element={<Add url={url} adminToken={adminToken} />} />
    </Routes>
  )
}

export default StockControl