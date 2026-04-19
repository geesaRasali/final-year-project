import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { normalizeRole, ROLES } from '../../config/rbac';

const Orders = ({ url, adminToken, adminUser }) => {
  const [Orders, setOrders] = useState([]);
  const normalizedRole = normalizeRole(adminUser?.role);
  const isDeliveryStaff = normalizedRole === ROLES.DELIVERY_STAFF;
  const statusOptions = isDeliveryStaff
    ? ['Out for delivery', 'Delivered']
    : ['Food Processing', 'Out for delivery', 'Delivered'];

  const fetchAllOrders = async () => {
    const response = await axios.get(url + '/api/order/list', {
      headers: {
        token: adminToken,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error('Error fetching orders');
    }
  };

  const statusHandler = async (event, orderId)=>{
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
    } else {
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-8'>
      <h3 className='mb-6 text-2xl font-bold tracking-tight text-zinc-900'>Order Page</h3>
      <div className='flex flex-col gap-4'>
        {Orders.map((order, index) => (
          <div
            key={index}
            className='grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm md:grid-cols-[0.6fr_2.2fr_1fr_1fr_1fr] md:items-start md:gap-6'
          >
            <img src={assets.parcel_icon} alt='Order parcel' className='h-12 w-12 object-contain' />
            <div>
              <p className='mb-1 font-semibold text-zinc-900'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + ' x ' + item.quantity;
                  } else {
                    return item.name + ' x ' + item.quantity + ', ';
                  }
                })}
              </p>
              <p className='mb-1 font-semibold text-zinc-800'>
                {order.address.firstName + ' ' + order.address.lastName}
              </p>
              <div className='mb-2 text-zinc-600'>
                <p>{order.address.street + ','}</p>
                <p>
                  {order.address.city +
                    ', ' +
                    order.address.state +
                    ', ' +
                    order.address.country +
                    ', ' +
                    order.address.zipcode}
                </p>
              </div>
              <p className='text-zinc-700'>{order.address.phone}</p>
            </div>
            <p className='font-medium text-zinc-700'>Items: {order.items.length}</p>
            <p className='font-semibold text-zinc-900'>${order.amount}</p>
            <select
              onChange={(event)=>statusHandler(event,order._id)}
              value={order.status}
              className='w-full rounded-lg border border-orange-300 bg-orange-50 px-2.5 py-2 text-xs font-semibold text-orange-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;