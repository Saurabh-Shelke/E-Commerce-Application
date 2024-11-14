// src/pages/CheckoutPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api'; // Assuming placeOrder is defined in api.js

const CheckoutPage = ({ cartItems, totalAmount }) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        totalAmount,
        shippingAddress,
      };
      const response = await placeOrder(orderData);
      if (response) {
        alert('Order placed successfully!');
        navigate('/orders'); // Redirect to order history page or similar
      }
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div className="checkout-details">
        <h3>Shipping Address</h3>
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your shipping address"
        />
      </div>
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ${item.price * item.quantity}
            </li>
          ))}
        </ul>
        <p>Total Amount: ${totalAmount}</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default CheckoutPage;
