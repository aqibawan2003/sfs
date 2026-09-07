import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from 'axios';
import Footer from '../Footer';
import SEO from '../common/SEO';
import API_BASE_URL from '../../utils/api';

// Skeleton component for shimmer effect
const SkeletonCard = () => (
  <div className="h-full w-full max-w-sm justify-self-center rounded-lg overflow-hidden shadow-lg animate-pulse bg-[#1E201E]">
    <div className="bg-gray-300 h-48 w-full"></div>
    <div className="h-40 px-6 py-4 bg-[#3C3D37]">
      <div className="h-6 bg-gray-400 mb-2"></div>
      <div className="h-4 bg-gray-400 mb-2"></div>
      <div className="h-4 bg-gray-400"></div>
    </div>
  </div>
);

const Kitchens = () => {
  const [kitchensData, setKitchensData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/kitchen/getAllKitchens`);
        const kitchens = response.data.data;
        setKitchensData(kitchens);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching kitchens:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchKitchens();
  }, []);

  const truncateDescription = (description, wordLimit) => {
    const safeDescription = description || 'No description available.';
    const words = safeDescription.split(' ');
    if (words.length > wordLimit) {
      return {
        truncated: words.slice(0, wordLimit).join(' ') + '...',
        full: safeDescription
      };
    }
    return {
      truncated: safeDescription,
      full: safeDescription
    };
  };

  return (
    <>
      <SEO
        title="Homemade Food Kitchens"
        description="Browse homemade food kitchens across Lahore and order affordable, home-cooked meals for students."
      />
      <Navbar module={'food'} />
      <div className='bg-[#697565] border-b border-gray-500 pb-8 pt-32 text-white'>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">All Kitchens</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading
              ? Array(6).fill(0).map((_, index) => <SkeletonCard key={index} />) // Display skeletons while loading
              : kitchensData.map(kitchen => {
                  const { truncated, full } = truncateDescription(kitchen.kitchen_description, 8);
                  return (
                    <article key={kitchen._id} className="flex h-full w-full max-w-sm justify-self-center flex-col overflow-hidden rounded-lg bg-[#1E201E] shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                      <Link 
                        to={`/kitchen/${kitchen._id}`}
                        state={{ kitchen }} // Passing kitchen data as state
                        className="block h-48 shrink-0 overflow-hidden"
                      >
                        <img
                          className="h-full w-full cursor-pointer object-cover transition duration-300 hover:scale-105"
                          src={kitchen.kitchen_picture}
                          alt={kitchen.kitchen_name}
                        />
                      </Link>
                      <div className="flex min-h-[168px] flex-1 flex-col px-6 py-4 text-white">
                        <p className="mb-2 line-clamp-1 text-xl font-bold capitalize" title={kitchen.kitchen_name}>{kitchen.kitchen_name}</p>
                        <p className="mb-2 line-clamp-2 min-h-[48px] text-base leading-6 text-gray-200" title={kitchen.address}>{kitchen.address || 'Address not provided'}</p>
                        <p className="mt-auto line-clamp-2 min-h-[48px] text-base leading-6 text-gray-300">
                          {truncated}
                          {truncated !== full && (
                            <button type="button" className="ml-1 text-[#ECDFCC] hover:underline" onClick={() => alert(full)}>Read more</button>
                          )}
                        </p>
                      </div>
                    </article>
                  );
                })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Kitchens;
