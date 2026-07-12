import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';

const Confirmation = () => {
  const location = useLocation();
  const { name, phone, address, cartItems } = location.state;

  // Flatten cartItems into a single array of items
  const allItems = Object.values(cartItems).flat();

  return (
  <>
   
 
    <div className="container items-center mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
      <div className="bg-white p-8 rounded shadow-lg">
        <h3 className="text-xl mb-4">Thank you, {name}!</h3>
        <p className="mb-2">Your order has been placed successfully.</p>
        <p className="mb-2">Phone Number: {phone}</p>
        <p className="mb-4">Address: {address}</p>
        <h4 className="text-lg font-bold mb-2">Ordered Items:</h4>
        <ul className="list-disc list-inside">
          {allItems.map((item, index) => (
            <li key={index}>{item.name} - {item.quantity}</li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default Confirmation;
