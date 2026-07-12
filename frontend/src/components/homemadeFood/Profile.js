import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const KitchenOwnerProfile = () => {



  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className=' text-white'>
    <div className='flex flex-col justify-center items-center'>
    <p className="text-2xl font-bold text-center text-white mt-4"> {user.kitchen_name} Dashboard </p>
      <img className='w-full h-[500px]' src={user.kitchen_picture} alt={user.kitchen_name} />
      <div className='p-4 justify-center'>

        <h2 className='text-xl font-bold'>{user.kitchen_name}</h2>
        <p className='text-lg font-semibold'>{user.address}</p>
        <p className=''>Description:{user.kitchen_description}</p>
      </div>
    </div>
    </div>
  );
};

export default KitchenOwnerProfile;
