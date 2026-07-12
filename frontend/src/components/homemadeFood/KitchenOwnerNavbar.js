import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import Cookies from 'js-cookie';

const KitchenOwnerNavbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    const user = sessionStorage.getItem('user');
  
    // Check if the user is logged in based on token and session
    if (token && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true); 
  };

  const handleLogoutConfirm = () => {
    Cookies.remove('token');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate('/'); // Redirect to home or login page after logout
  };

  const handleCancel = () => {
    setShowLogoutModal(false); 
  };

  return (
    <div className="h-screen bg-gray-800">
      <nav className="w-full h-full p-4 flex flex-col justify-between">
     
        <ul className="mt-20 space-y-4">
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/kitchenownerdashboard">Dashboard</Link>
          </li>
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/kitchen-owner-profile">Profile</Link>
          </li>
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/kitchen-owner-profile/dishes">Menu</Link>
          </li>
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/kitchen-owner/orders">Orders</Link>
          </li>
        </ul>

        {/* Display Logout Button if Logged In */}
        

        {/* "Visit Website" link at the bottom */}
        <div className="mb-4">
          <Link to="/" className="text-white text-2xl mb-6 font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            Visit Website
          </Link>
          {isLoggedIn && (
          <div className="ml-16 mt-6">
            <button 
              onClick={handleLogoutClick} 
              className="bg-[#ECDFCC] hover:bg-[#D6C4B0]  px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
        </div>
       
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#25292e] p-6 rounded-lg text-center shadow-lg text-white">
            <p className="text-xl mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-around">
              <button
                onClick={handleLogoutConfirm}
                className="bg-[#ECDFCC] hover:bg-[#D6C4B0] text-black px-6 py-2 rounded-lg "
              >
                Logout
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 px-6 py-2 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenOwnerNavbar;
