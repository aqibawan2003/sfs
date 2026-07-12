import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from 'recharts';

// Data for each month with booking values
const data = [
  { month: 'January', bookings: 30 },
  { month: 'February', bookings: 45 },
  { month: 'March', bookings: 50 },
  { month: 'April', bookings: 60 },
  { month: 'May', bookings: 70 },
  { month: 'June', bookings: 55 },
  { month: 'July', bookings: 65 },
  { month: 'August', bookings: 80 },
  { month: 'September', bookings: 75 },
  { month: 'October', bookings: 85 },
  { month: 'November', bookings: 90 },
  { month: 'December', bookings: 100 },
];

const BookingChart = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* Display month names on the X-axis */}
          <XAxis dataKey="month" />
          {/* Display bookings count on the Y-axis */}
          <YAxis label={{ value: 'Bookings', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {/* Line for booking data */}
          <Line type="monotone" dataKey="bookings" stroke="#82ca9d" fill="#82ca9d" />
          <Brush />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingChart;
