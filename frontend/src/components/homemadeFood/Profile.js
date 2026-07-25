import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import ImageUploadField from '../common/ImageUploadField';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaVenusMars, FaIdCard } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const KitchenOwnerProfile = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editPicture, setEditPicture] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [personalEditMode, setPersonalEditMode] = useState(false);
  const [personalEditData, setPersonalEditData] = useState({});
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalError, setPersonalError] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (location.hash === '#personal-profile') {
      const el = document.getElementById('personal-profile');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  if (!user) {
    return <div>No user data available</div>;
  }

  const startEdit = () => {
    setEditPicture(user.kitchen_picture || '');
    setError('');
    setEditMode(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = Cookies.get('token');
      const res = await axios.put(
        `${API_BASE_URL}/profile/User`,
        { kitchen_picture: editPicture },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = { ...user, kitchen_picture: res.data.kitchen_picture };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setEditMode(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update picture. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startPersonalEdit = () => {
    setPersonalEditData({
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      phone: user.phone_number || '',
      profilePicture: user.profile_picture || '',
    });
    setPersonalError('');
    setPersonalEditMode(true);
  };

  const handlePersonalSave = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    setPersonalError('');
    try {
      const token = Cookies.get('token');
      const [firstName, ...rest] = (personalEditData.name || '').trim().split(' ');
      const payload = {
        first_name: firstName || '',
        last_name: rest.join(' ') || '',
        phone_number: personalEditData.phone || '',
        profile_picture: personalEditData.profilePicture || '',
      };
      const res = await axios.put(`${API_BASE_URL}/profile/User`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setPersonalEditMode(false);
    } catch (err) {
      setPersonalError(err?.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const inputCls = "w-full bg-[#1E201E] border border-[#59636e] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#697565]";

  const personalFields = [
    { label: 'Full Name', value: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A', icon: <FaUser /> },
    { label: 'Email', value: user.email || 'N/A', icon: <FaEnvelope /> },
    { label: 'Phone', value: user.phone_number || 'N/A', icon: <FaPhone /> },
    { label: 'Gender', value: user.gender || 'N/A', icon: <FaVenusMars /> },
    { label: 'CNIC', value: user.cnic || 'N/A', icon: <FaIdCard /> },
  ];

  return (
    <div className=' text-white'>
    <div className='flex flex-col justify-center items-center'>
    <p className="text-2xl font-bold text-center text-white mt-4"> {user.kitchen_name} Dashboard </p>
      <img className='w-full h-[500px]' src={user.kitchen_picture} alt={user.kitchen_name} />
      {!editMode && (
        <button
          onClick={startEdit}
          className='mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2'
        >
          <FaEdit /> Change Picture
        </button>
      )}
      {editMode && (
        <form onSubmit={handleSave} className='mt-4 w-full max-w-md bg-[#25292e] rounded-xl p-4'>
          <ImageUploadField
            label="Kitchen Picture"
            name="kitchenPicture"
            value={editPicture}
            onChange={setEditPicture}
            uploadType="kitchen"
          />
          {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}
          <div className='flex gap-3'>
            <button type='submit' disabled={saving} className='bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded'>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type='button' onClick={() => setEditMode(false)} className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded'>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className='p-4 justify-center'>

        <h2 className='text-xl font-bold'>{user.kitchen_name}</h2>
        <p className='text-lg font-semibold'>{user.address}</p>
        <p className=''>Description:{user.kitchen_description}</p>
      </div>

      {/* Personal Profile */}
      <div id="personal-profile" className='w-full max-w-3xl px-6 pb-6'>
        <div className='bg-[#25292e] rounded-2xl p-6 shadow-lg'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>Personal Profile</h2>
            {!personalEditMode && (
              <button
                onClick={startPersonalEdit}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2'
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {personalEditMode ? (
            <form onSubmit={handlePersonalSave} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[['Full Name', 'name', 'text'], ['Phone Number', 'phone', 'tel']].map(([label, key, type]) => (
                  <div key={key}>
                    <label className='block text-sm text-gray-400 mb-1'>{label}</label>
                    <input
                      type={type}
                      value={personalEditData[key]}
                      onChange={(e) => setPersonalEditData({ ...personalEditData, [key]: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
              <ImageUploadField
                label="Profile Picture"
                name="ownerProfilePicture"
                value={personalEditData.profilePicture}
                onChange={(url) => setPersonalEditData({ ...personalEditData, profilePicture: url })}
                uploadType="profile"
              />
              {personalError && <div className='text-red-500 text-sm'>{personalError}</div>}
              <div className='flex gap-3'>
                <button type='submit' disabled={savingPersonal} className='bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg font-semibold transition'>
                  {savingPersonal ? 'Saving...' : 'Save Changes'}
                </button>
                <button type='button' onClick={() => setPersonalEditMode(false)} className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition'>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {personalFields.map(({ label, value, icon }) => (
                <div key={label} className='flex items-start gap-3 bg-[#1E201E] rounded-xl p-4'>
                  <span className='text-xl mt-0.5'>{icon}</span>
                  <div>
                    <p className='text-xs text-gray-500 uppercase tracking-wide'>{label}</p>
                    <p className='text-white font-medium mt-0.5'>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default KitchenOwnerProfile;
