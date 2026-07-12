import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  console.log('user',user);
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div className='text-white text-center'>No user data available</div>;
  }

  return (
    <div className='md:flex'>
      <img className='w-[500px] h-[500px] pt-6 pl-6' src={user.hostel_picture} alt={user.hostel_name} />
      <div className='p-4 text-white text-center mt-20'>
        <h2 className='text-2xl font-bold'>{user.hostel_name}</h2>
        <p className='text-lg font-semibold'>{user.hostel_address}</p>
        <p>Description: {user.hostel_description}</p>
        <h2 className='text-2xl font-bold pt-8'>Nearby Universities</h2>
        <ul>
          {user.nearby_institutes.map((institute) => (
            <li key={institute._id} className='text-xl'>{institute.university}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
