import React, { useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { getOrdersForKitchen } from '../../store/orderSlice';

const OrderChart = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(getOrdersForKitchen());
  }, [dispatch]);

  // Build real month-by-month completed-order counts from actual orders,
  // instead of the hardcoded placeholder data this used to show.
  const formattedData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const counts = {}; // key: "2026-6" (sortable) -> { name, orderCount }
    orders
      .filter(order => order.status === 'Completed')
      .forEach(order => {
        const date = new Date(order.orderPlacedAt || order.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!counts[key]) {
          const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
          counts[key] = { key, name: monthName, orderCount: 0, sortDate: date };
        }
        counts[key].orderCount += 1;
      });

    return Object.values(counts)
      .sort((a, b) => a.sortDate - b.sortDate)
      .map(({ name, orderCount }) => ({ name, orderCount }));
  }, [orders]);

  if (loading) {
    return <div style={{ width: '100%', height: '400px' }}>Loading chart...</div>;
  }

  if (formattedData.length === 0) {
    return (
      <div style={{ width: '100%', height: '400px' }} className="flex items-center justify-center text-gray-400">
        No completed orders yet - the chart will fill in as orders are marked Completed.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* Display month names on the X-axis */}
          <XAxis dataKey="name" />
          {/* Display order count on the Y-axis */}
          <YAxis allowDecimals={false} label={{ value: 'Orders', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {/* Line for order data */}
          <Line type="monotone" dataKey="orderCount" stroke="#82ca9d" fill="#82ca9d" />
          <Brush />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderChart;
