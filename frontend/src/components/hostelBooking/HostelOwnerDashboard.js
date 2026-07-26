import React from 'react';
import HostelNavbar from './HostelOwnerNavbar';
import BookingChart from './BookingChart';
import Navbar from '../Navbar';
import Footer from '../Footer';

const HostelOwnerDashboard = () => {
  return (
    <div className="bg-[#1E201E] min-h-screen flex flex-col">
      <Navbar module="home" />
      <div className="flex flex-1">
        <HostelNavbar />
        <div className="mt-4 ml-6 mr-6 pt-24 flex-1 text-white">
          <p className="mb-4 text-4xl font-bold">Booking chart</p>
          <div className="h-[500px] w-full overflow-x-auto">
            <BookingChart />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HostelOwnerDashboard;
