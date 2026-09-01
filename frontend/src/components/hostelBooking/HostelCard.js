import React from 'react';
import { Link } from 'react-router-dom';

const HostelCard = ({ hostel }) => {
  return (
    <div className="rounded overflow-hidden shadow-lg bg-[#25292e] border-2 border-[#4a5568] h-full flex flex-col">
      <img className="w-full h-48 object-cover" src={hostel.hostel_picture} alt={hostel.hostel_name} />
      <div className="px-6 py-4 text-white flex-grow overflow-hidden">
        <p className="text-xl mb-2 line-clamp-2 font-semibold">{hostel.hostel_name}</p>
        <p className="text-sm line-clamp-1 text-gray-300">Address: {hostel.hostel_address}</p>
        <p className="text-sm line-clamp-2 text-gray-400 mt-1">Facilities: {(hostel.facilities || []).join(', ')}</p>
        {hostel.calculated_distance != null && (
          <p className="text-sm text-[#a5b68d] font-semibold mt-2">
            {hostel.calculated_distance} km away
          </p>
        )}
      </div>
      <div className="px-6 py-4">
        <Link
          to={`/hostels/${hostel._id}`}
          state={{ hostel }} // Passing hostel data as state
          className="bg-[#697565] hover:bg-[#1E201E] text-white font-bold py-2 px-4 rounded inline-block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HostelCard;
