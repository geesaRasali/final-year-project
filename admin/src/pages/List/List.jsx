import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiPackage, FiSearch, FiTag, FiTrash2 } from 'react-icons/fi'

const List = ({ url, adminToken }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/food/list`)

      if (response.data.success) {
        setList(response.data.data || [])
      } else {
        toast.error(response.data.message || 'Unable to load items')
      }
    } catch (error) {
      toast.error('Failed to fetch food items')
    } finally {
      setLoading(false)
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        { headers: { token: adminToken, Authorization: `Bearer ${adminToken}` } },
      )

      if (response.data.success) {
        toast.success('Item removed successfully')
        await fetchList()
      } else {
        toast.error(response.data.message || 'Error removing food item')
      }
    } catch (error) {
      toast.error('Failed to remove food item')
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const filteredList = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return list

    return list.filter((item) => {
      const name = String(item?.name || '').toLowerCase()
      const category = String(item?.category || '').toLowerCase()
      return name.includes(normalizedQuery) || category.includes(normalizedQuery)
    })
  }, [list, query])

  return (
    <section className='min-h-[calc(100vh-4rem)] bg-zinc-50 px-4 py-5 dark:bg-zinc-900 md:px-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-4 overflow-hidden rounded-2xl border border-orange-100 bg-linear-to-r from-white via-orange-50/65 to-amber-50/65 px-4 py-4 shadow-[0_10px_30px_rgba(249,115,22,0.08)] dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 md:px-5'>
          <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-orange-600'>Inventory</p>
              <h1 className='mt-1.5 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100'>Food Items</h1>
              <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>Compact view for fast admin management.</p>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <div className='rounded-lg border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800'>
                <p className='text-[10px] font-semibold uppercase tracking-wide text-zinc-400'>Total</p>
                <p className='text-sm font-bold text-zinc-800 dark:text-zinc-100'>{list.length} items</p>
              </div>
              <div className='rounded-lg border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800'>
                <p className='text-[10px] font-semibold uppercase tracking-wide text-zinc-400'>Showing</p>
                <p className='text-sm font-bold text-zinc-800 dark:text-zinc-100'>{filteredList.length} items</p>
              </div>
            </div>
          </div>

          <div className='mt-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800'>
            <FiSearch className='text-zinc-400' />
            <input
              type='text'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search by name or category'
              className='w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100'
            />
          </div>
        </div>

        {loading ? (
          <div className='flex h-56 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent' />
          </div>
        ) : filteredList.length === 0 ? (
          <div className='flex h-56 flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'>
            <FiPackage size={40} className='mb-3 text-zinc-300' />
            <p className='text-sm font-medium text-zinc-500 dark:text-zinc-400'>No food items found.</p>
          </div>
        ) : (
          <div className='overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)] dark:border-zinc-700 dark:bg-zinc-900'>
            <div className='hidden grid-cols-[72px_1.8fr_1fr_0.8fr_130px] items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300 md:grid'>
              <span>Image</span>
              <span>Item</span>
              <span>Category</span>
              <span>Price</span>
              <span className='text-center'>Action</span>
            </div>

            <div className='divide-y divide-zinc-100 dark:divide-zinc-800'>
              {filteredList.map((item) => (
                <div key={item._id} className='px-3 py-3 md:px-4'>
                  <div className='grid items-center gap-3 md:grid-cols-[72px_1.8fr_1fr_0.8fr_130px]'>
                    <div className='h-14 w-16 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700'>
                      <img src={`${url}/images/${item.image}`} alt={item.name} className='h-full w-full object-cover' />
                    </div>

                    <div className='min-w-0'>
                      <p className='truncate text-sm font-bold text-zinc-900 dark:text-zinc-100'>{item.name}</p>
                      <p className='text-[10px] uppercase tracking-wide text-zinc-400'>ID: {String(item._id).slice(-8)}</p>
                    </div>

                    <div>
                      <span className='inline-flex items-center gap-1 rounded-full bg-orange-100/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'>
                        <FiTag size={11} />
                        {item.category}
                      </span>
                    </div>

                    <p className='text-sm font-black text-zinc-800 dark:text-zinc-100'>LKR {Number(item.price).toLocaleString()}</p>

                    <div className='md:flex md:justify-center'>
                      <button
                        type='button'
                        onClick={() => removeFood(item._id)}
                        className='mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white md:mt-0 md:w-auto dark:bg-red-500/10 dark:text-red-400'
                      >
                        <FiTrash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default List
