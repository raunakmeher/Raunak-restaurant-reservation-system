import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RestaurantSignup.css';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('restaurant');
    if (stored) {
      const rest = JSON.parse(stored);
      setRestaurant(rest);
      fetchBookings(rest.name);
    } else {
      navigate('/restaurant-login');
    }
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async (restaurantName) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/restaurant/${encodeURIComponent(restaurantName)}`);
      setBookings(res.data.bookings || []);
    } catch {
      setBookings([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurant');
    navigate('/restaurant-login');
  };

  return (
    <div className="restaurant-signup-container">
      <div className="restaurant-signup-form" style={{maxWidth: 600}}>
        <h2>Restaurant Dashboard</h2>
        {restaurant && (
          <>
            <div style={{marginBottom: 16}}>
              <strong>{restaurant.name}</strong> ({restaurant.city})<br/>
              Phone: {restaurant.phone}
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <h3 style={{marginTop: 24}}>Bookings</h3>
            {bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <ul>
                {bookings.map((b, idx) => (
                  <li key={b._id} className="booking-item">
                    <strong>{b.name}</strong> | {b.date} {b.time} | {b.guests} guests<br/>
                    Email: {b.email}, Phone: {b.phone}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard; 