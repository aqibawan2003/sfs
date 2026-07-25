// src/components/HostelNavbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const HostelNavbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Lock background scroll while the mobile drawer is open, otherwise the
  // page underneath the translucent backdrop can still be scrolled/swiped.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="h-screen bg-gray-800">
      {/* Mobile menu toggle - the nav below is hidden by default under md: */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      <nav className={`w-[180px] h-full p-4 flex-col justify-between fixed top-0 left-0 z-40 bg-gray-800 md:flex ${isMenuOpen ? 'flex' : 'hidden'}`}>
        <ul className="mt-20 space-y-4">
        <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/hostelOwnerDashboard" onClick={closeMenu}>Dashboard</Link>
          </li>
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/hostel-owner-profile" onClick={closeMenu}>Profile</Link>
          </li>
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/profile" onClick={closeMenu}>Personal Profile</Link>
          </li>
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/hostel-owner-profile/totalroom" onClick={closeMenu}>Rooms</Link>
          </li>
          <li className="text-white text-2xl font-semibold hover:bg-gray-900 px-3 py-2 rounded">
            <Link to="/booking" onClick={closeMenu}>Booking</Link>
          </li>

        </ul>

        {/* "Visit Website" link at the bottom */}
        <div className="mb-4">
          <Link to="/" target="_blank" rel="noopener noreferrer" className="text-white text-xl font-semibold  hover:bg-gray-900 px-3 py-2 rounded">
            Visit Website
          </Link>
          {isLoggedIn && (
            <div className="ml-4 mt-6">
              <button
                onClick={handleLogoutClick}
                className="bg-[#ECDFCC] hover:bg-[#D6C4B0] px-4 py-2 rounded-lg"
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
                className="bg-[#ECDFCC] hover:bg-[#D6C4B0] text-black px-6 py-2 rounded-lg"
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

export default HostelNavbar;
