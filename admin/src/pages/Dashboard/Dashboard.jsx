import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url + '/api/order/list');
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        day: WEEK_DAYS[date.getDay()],
        date,
        orders: 0,
        amount: 0,
      };
    });

    const dayMap = new Map(days.map((day) => [day.key, day]));

    orders.forEach((order) => {
      if (!order?.date) return;
      const orderDateObj = new Date(order.date);
      const orderDate = new Date(
        orderDateObj.getFullYear(),
        orderDateObj.getMonth(),
        orderDateObj.getDate(),
      );

      const key = `${orderDate.getFullYear()}-${orderDate.getMonth()}-${orderDate.getDate()}`;
      const dayEntry = dayMap.get(key);

      if (dayEntry) {
        dayEntry.orders += 1;
        dayEntry.amount += Number(order.amount || 0);
      }
    });

    return days;
  }, [orders]);

  const summary = useMemo(() => {
    const weekOrders = weeklyData.reduce((sum, day) => sum + day.orders, 0);
    const weekRevenue = weeklyData.reduce((sum, day) => sum + day.amount, 0);
    const delivered = orders.filter((order) => order.status === 'Delivered').length;

    return {
      weekOrders,
      weekRevenue,
      delivered,
      totalOrders: orders.length,
    };
  }, [weeklyData, orders]);

  const maxAmount = Math.max(...weeklyData.map((day) => day.amount), 1);

  return (
    <div className='dashboard'>
      <h2>Admin Dashboard</h2>

      <div className='dashboard-cards'>
        <div className='dashboard-card'>
          <p>This Week Orders</p>
          <h3>{summary.weekOrders}</h3>
        </div>
        <div className='dashboard-card'>
          <p>This Week Revenue</p>
          <h3>{formatMoney(summary.weekRevenue)}</h3>
        </div>
        <div className='dashboard-card'>
          <p>Delivered Orders</p>
          <h3>{summary.delivered}</h3>
        </div>
        <div className='dashboard-card'>
          <p>Total Orders</p>
          <h3>{summary.totalOrders}</h3>
        </div>
      </div>

      <div className='week-chart'>
        <div className='week-chart-header'>
          <h3>Weekly Revenue Chart</h3>
          <button type='button' onClick={fetchAllOrders} className='refresh-btn'>
            Refresh
          </button>
        </div>

        {loading ? (
          <p className='chart-message'>Loading chart...</p>
        ) : (
          <div className='chart-grid'>
            {weeklyData.map((day) => {
              const barHeight = Math.max((day.amount / maxAmount) * 100, day.amount > 0 ? 10 : 2);

              return (
                <div className='chart-col' key={day.key}>
                  <span className='chart-value'>{formatMoney(day.amount)}</span>
                  <div className='bar-track'>
                    <div className='bar-fill' style={{ height: `${barHeight}%` }} />
                  </div>
                  <span className='chart-day'>{day.day}</span>
                  <span className='chart-orders'>{day.orders} orders</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
