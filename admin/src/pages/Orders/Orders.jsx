import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { normalizeRole, ROLES } from '../../config/rbac';

const Orders = ({ url, adminToken, adminUser }) => {
  const [Orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const normalizedRole = normalizeRole(adminUser?.role);
  const isDeliveryStaff = normalizedRole === ROLES.DELIVERY_STAFF;
  const statusOptions = isDeliveryStaff
    ? ['Out for delivery', 'Delivered']
    : ['Food Processing', 'Out for delivery', 'Delivered'];

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
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
      toast.error('Unable to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + '/api/order/status', {
        orderId,
        status: event.target.value,
      }, {
        headers: {
          token: adminToken,
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Status updated');
      } else {
        toast.error(response.data?.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatItemsText = (items = []) => {
    return items
      .map((item) => `${item.name} x ${item.quantity}`)
      .join(', ');
  };

  const getStatusTone = (status = '') => {
    if (status === 'Delivered') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
    }
    if (status === 'Out for delivery') {
      return 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300';
    }
    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
  };

  const totalRevenue = Orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const deliveredCount = Orders.filter((order) => order.status === 'Delivered').length;

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <section className='min-h-[calc(100vh-4rem)] bg-zinc-50 px-4 py-6 dark:bg-zinc-900 md:px-7'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-5 rounded-2xl border border-orange-200 bg-linear-to-r from-white via-orange-50/60 to-amber-50/70 p-4 shadow-[0_14px_34px_rgba(249,115,22,0.08)] dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 md:p-5'>
          <div className='flex flex-wrap items-end justify-between gap-3'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-orange-600'>Order Management</p>
              <h3 className='mt-1.5 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100'>Orders</h3>
              <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>Monitor incoming orders and update delivery progress.</p>
            </div>

            <div className='grid grid-cols-3 gap-2'>
              <div className='rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800'>
                <p className='text-[10px] uppercase tracking-wide text-zinc-400'>Total</p>
                <p className='text-base font-black text-zinc-900 dark:text-zinc-100'>{Orders.length}</p>
              </div>
              <div className='rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800'>
                <p className='text-[10px] uppercase tracking-wide text-zinc-400'>Delivered</p>
                <p className='text-base font-black text-zinc-900 dark:text-zinc-100'>{deliveredCount}</p>
              </div>
              <div className='rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800'>
                <p className='text-[10px] uppercase tracking-wide text-zinc-400'>Revenue</p>
                <p className='text-base font-black text-zinc-900 dark:text-zinc-100'>LKR {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='flex h-44 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent' />
          </div>
        ) : Orders.length === 0 ? (
          <div className='flex h-44 flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'>
            <img src={assets.parcel_icon} alt='No orders' className='mb-3 h-12 w-12 opacity-35' />
            <p className='text-sm text-zinc-500'>No orders available yet.</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {Orders.map((order, index) => (
              <article
                key={order._id || index}
                className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)] dark:border-zinc-700 dark:bg-zinc-900'
              >
                <div className='grid gap-4 md:grid-cols-[64px_2fr_1fr_1fr_190px] md:items-start'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 dark:bg-zinc-800'>
                    <img src={assets.parcel_icon} alt='Order parcel' className='h-10 w-10 object-contain' />
                  </div>

                  <div>
                    <p className='line-clamp-2 text-sm font-bold text-zinc-900 dark:text-zinc-100'>{formatItemsText(order.items)}</p>
                    <p className='mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200'>
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
                      {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                    </p>
                    <p className='mt-1 text-xs text-zinc-600 dark:text-zinc-300'>Phone: {order.address.phone}</p>
                  </div>

                  <div className='md:pt-1'>
                    <p className='text-[11px] uppercase tracking-wide text-zinc-400'>Items</p>
                    <p className='text-sm font-bold text-zinc-800 dark:text-zinc-100'>{order.items.length}</p>
                    <p className='mt-1 text-[11px] text-zinc-500 dark:text-zinc-400'>#{String(order._id || '').slice(-6)}</p>
                  </div>

                  <div className='md:pt-1'>
                    <p className='text-[11px] uppercase tracking-wide text-zinc-400'>Amount</p>
                    <p className='text-base font-black text-zinc-900 dark:text-zinc-100'>LKR {Number(order.amount || 0).toLocaleString()}</p>
                    <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusTone(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className='md:pt-1'>
                    <p className='mb-1 text-[11px] uppercase tracking-wide text-zinc-400'>Update Status</p>
                    <select
                      onChange={(event) => statusHandler(event, order._id)}
                      value={order.status}
                      className='w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-2 text-xs font-semibold text-zinc-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200'
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status} className='bg-white text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;