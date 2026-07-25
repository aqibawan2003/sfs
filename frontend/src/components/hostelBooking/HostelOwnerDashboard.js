import React from 'react';
import HostelNavbar from './HostelOwnerNavbar';
import BookingChart from './BookingChart';

const HostelOwnerDashboard = () => {
  return (
    <div className="flex">
      {/* Add full height and set background color for the navbar area */}
      <div className="bg-[#1E201E] w-[250px] min-h-screen hidden md:flex flex-col">
        <HostelNavbar />
      </div>
      
      <div className="mt-4 ml-6 mr-6 flex-1">
        <p className="mb-4 text-4xl font-bold">Booking chart</p>
        <div className="h-[500px] w-full overflow-x-auto">
          <BookingChart />
        </div>
      </div>
    </div>
  );
};

export default HostelOwnerDashboard;
