import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const sampleRestaurants = [
  {
    name: 'Taj View Restaurant',
    image: '/images5.jpeg',
    description: 'North Indian, Mughlai • 7 Reviews',
    menu: [
      { item: 'Paneer Tikka', price: '₹320' },
      { item: 'Butter Chicken', price: '₹450' },
      { item: 'Garlic Naan', price: '₹90' },
      { item: 'Mango Lassi', price: '₹120' },
    ],
  },
  {
    name: 'Samosa House',
    image: '/images6.jpg',
    description: 'Snacks, Street Food • 15 Reviews',
    menu: [
      { item: 'Samosa', price: '₹40' },
      { item: 'Chai', price: '₹30' },
      { item: 'Jalebi', price: '₹60' },
      { item: 'Aloo Tikki', price: '₹50' },
    ],
  },
  {
    name: 'The Royal Feast',
    image: '/images7.jpg',
    description: 'Luxury Dining • 17 Reviews',
    menu: [
      { item: 'Shahi Paneer', price: '₹400' },
      { item: 'Dal Makhani', price: '₹350' },
      { item: 'Naan Basket', price: '₹200' },
      { item: 'Gulab Jamun', price: '₹120' },
    ],
  },
  {
    name: 'Mughlai Palace',
    image: '/image1.jpg',
    description: 'Mughlai, Indian • 6 Reviews',
    menu: [
      { item: 'Mutton Korma', price: '₹500' },
      { item: 'Roomali Roti', price: '₹60' },
      { item: 'Chicken Biryani', price: '₹350' },
      { item: 'Firni', price: '₹90' },
    ],
  },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/users').then(res => {
      setUsers(res.data.users || []);
      console.log('Users:', res.data.users);
    });
    axios.get('http://localhost:5000/api/bookings').then(res => {
      setBookings(res.data.bookings || []);
      console.log('Bookings:', res.data.bookings);
    });
    axios.get('http://localhost:5000/api/restaurants').then(res => {
      setRestaurants(res.data.restaurants || []);
      console.log('Restaurants:', res.data.restaurants);
    });
  }, []);

  // Helper: get bookings for a user
  const getUserBookings = (user) => bookings.filter(b => b.username === user.username);
  // Helper: get bookings for a restaurant (by name)
  const getRestaurantBookings = (name) => bookings.filter(b => b.restaurant === name);

  const nonAdminUsers = users.filter(u => !u.isAdmin);

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };
  // Delete restaurant
  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
    setRestaurants(restaurants.filter(r => r._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <button
          style={{position:'absolute',top:24,right:40,background:'#2d3a4a',color:'#fff',border:'none',borderRadius:4,padding:'7px 18px',fontWeight:600,cursor:'pointer'}}
          onClick={handleLogout}
        >
          Logout
        </button>
        <div className="admin-section">
          <h2>Admin Dashboard</h2>
        </div>
        <div className="admin-section">
          <h3>All Customers</h3>
          <ul className="admin-card-list">
            {nonAdminUsers.map(user => (
              <li key={user._id} className="admin-card">
                <strong>{user.username}</strong> ({user.email})
                <button style={{float:'right',background:'#e03546',color:'#fff',border:'none',borderRadius:4,padding:'4px 10px',cursor:'pointer'}} onClick={() => handleDeleteUser(user._id)}>Delete</button>
                <ul className="admin-sublist">
                  {getUserBookings(user).length === 0 ? (
                    <li>No bookings</li>
                  ) : (
                    getUserBookings(user).map(b => (
                      <li key={b._id}>
                        <strong>{b.restaurant}</strong> | {b.date} {b.time} | {b.guests} guests
                      </li>
                    ))
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-section">
          <h3>All Restaurants</h3>
          <ul className="admin-card-list">
            {sampleRestaurants.map((r, idx) => (
              <li key={r.name} className="admin-card">
                <strong>{r.name}</strong>
                <div className="admin-menu">Menu: {(r.menu || []).map(m => `${m.item} (${m.price})`).join(', ')}</div>
                <ul className="admin-sublist">
                  {getRestaurantBookings(r.name).length === 0 ? (
                    <li>No bookings</li>
                  ) : (
                    getRestaurantBookings(r.name).map(b => (
                      <li key={b._id}>
                        {b.username} | {b.date} {b.time} | {b.guests} guests
                      </li>
                    ))
                  )}
                </ul>
              </li>
            ))}
            {restaurants.map(r => (
              <li key={r._id} className="admin-card">
                <strong>{r.name}</strong>
                <button style={{float:'right',background:'#e03546',color:'#fff',border:'none',borderRadius:4,padding:'4px 10px',cursor:'pointer'}} onClick={() => handleDeleteRestaurant(r._id)}>Delete</button>
                <div className="admin-menu">Menu: {(r.menu || []).map(m => `${m.item} (${m.price})`).join(', ')}</div>
                <ul className="admin-sublist">
                  {getRestaurantBookings(r.name).length === 0 ? (
                    <li>No bookings</li>
                  ) : (
                    getRestaurantBookings(r.name).map(b => (
                      <li key={b._id}>
                        {b.username} | {b.date} {b.time} | {b.guests} guests
                      </li>
                    ))
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-section">
          <h3>All Bookings (All Restaurants)</h3>
          <ul className="admin-bookings-list">
            {bookings.length === 0 ? (
              <li>No bookings found.</li>
            ) : (
              bookings.map(b => (
                <li key={b._id}>
                  <strong>{b.restaurant}</strong> | {b.date} {b.time} | {b.guests} guests | User: {b.username}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 