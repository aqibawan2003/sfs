import React from 'react';
import HostelNavbar from './HostelOwnerNavbar';
import BookingChart from './BookingChart';
import Footer from '../Footer';

const HostelOwnerDashboard = () => {
  return (
    <div className="bg-[#1E201E] min-h-screen flex">
      <HostelNavbar />
      <main className="mt-4 ml-6 mr-6 flex min-w-0 flex-1 flex-col pt-20 text-white md:pt-4">
        <div className="flex-1">
          <p className="mb-4 text-4xl font-bold">Booking chart</p>
          <div className="h-[500px] w-full overflow-x-auto">
            <BookingChart />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default HostelOwnerDashboard;
