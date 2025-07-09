import React, { useState, useEffect } from 'react';
import './RestaurantDetails.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const RestaurantDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [showBookings, setShowBookings] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
  });
  const [userBookings, setUserBookings] = useState([]);
  const { id } = useParams();
  const isBackend = window.location.pathname.startsWith('/restaurant/db/');
  const [backendRestaurant, setBackendRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const restaurants = [
    {
      name: 'Taj View Restaurant',
      image: '/images5.jpeg',
      description: 'North Indian, Mughlai • 7 Reviews',
      menu: [
        { name: 'Paneer Tikka', desc: 'Grilled paneer with spices', price: '₹320' },
        { name: 'Butter Chicken', desc: 'Chicken in creamy tomato gravy', price: '₹450' },
        { name: 'Garlic Naan', desc: 'Indian bread with garlic', price: '₹90' },
        { name: 'Mango Lassi', desc: 'Yogurt drink with mango', price: '₹120' },
      ],
      cuisine: '₹₹₹ • Continental, Indian',
    },
    {
      name: 'Samosa House',
      image: '/images6.jpg',
      description: 'Snacks, Street Food • 15 Reviews',
      menu: [
        { name: 'Samosa', desc: 'Crispy potato-filled pastry', price: '₹40' },
        { name: 'Chai', desc: 'Spiced Indian tea', price: '₹30' },
        { name: 'Jalebi', desc: 'Sweet fried dessert', price: '₹60' },
        { name: 'Aloo Tikki', desc: 'Spiced potato patty', price: '₹50' },
      ],
      cuisine: '₹ • Snacks, Street Food',
    },
    {
      name: 'The Royal Feast',
      image: '/images7.jpg',
      description: 'Luxury Dining • 17 Reviews',
      menu: [
        { name: 'Shahi Paneer', desc: 'Paneer in royal gravy', price: '₹400' },
        { name: 'Dal Makhani', desc: 'Creamy black lentils', price: '₹350' },
        { name: 'Naan Basket', desc: 'Assorted Indian breads', price: '₹200' },
        { name: 'Gulab Jamun', desc: 'Milk-solid-based sweet', price: '₹120' },
      ],
      cuisine: '₹₹₹₹ • Luxury Dining',
    },
    {
      name: 'Mughlai Palace',
      image: '/image1.jpg',
      description: 'Mughlai, Indian • 6 Reviews',
      menu: [
        { name: 'Mutton Korma', desc: 'Mughlai style mutton curry', price: '₹500' },
        { name: 'Roomali Roti', desc: 'Thin soft bread', price: '₹60' },
        { name: 'Chicken Biryani', desc: 'Fragrant rice with chicken', price: '₹350' },
        { name: 'Firni', desc: 'Rice pudding dessert', price: '₹90' },
      ],
      cuisine: '₹₹₹ • Mughlai, Indian',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const toggleBookingForm = () => {
    setShowForm(prev => !prev);
    setTimeout(() => {
      const form = document.getElementById('booking-form');
      if (form) form.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user || !restaurant) return;
    const booking = {
      ...formData,
      restaurant: restaurant.name,
      username: user.username,
      timestamp: new Date().toISOString(),
    };
    try {
      await axios.post(`${apiUrl}/api/bookings`, booking);
      setBookingConfirmed(true);
      setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '' });
      setTimeout(() => setShowForm(false), 1500);
      fetchBookings(user.username);
    } catch {
      // Optionally show error
    }
  };

  const fetchBookings = async (username) => {
    try {
      const res = await axios.get(`${apiUrl}/api/bookings`, { params: { username } });
      setUserBookings(res.data.bookings || []);
    } catch {
      setUserBookings([]);
    }
  };

  useEffect(() => {
    if (isBackend) {
      setLoading(true);
      axios.get(`${apiUrl}/api/restaurants`)
        .then(res => {
          const found = (res.data.restaurants || []).find(r => r._id === id);
          setBackendRestaurant(found || null);
          setLoading(false);
        })
        .catch(() => {
          setBackendRestaurant(null);
          setLoading(false);
        });
    }
  }, [id, isBackend]);

  const restaurant = isBackend ? backendRestaurant : restaurants[id] || restaurants[0];

  if (isBackend && loading) {
    return <div style={{textAlign:'center',marginTop:'2rem'}}>Loading...</div>;
  }
  if (isBackend && !restaurant) {
    return <div style={{textAlign:'center',marginTop:'2rem'}}>Restaurant not found.</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="logo">BookMyTable™</div>
        <div className="auth-links">
          {user ? (
            <>
              <span>Hey! {user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              <button className="bookings-btn" onClick={() => setShowBookings(v => !v)}>
                Your Bookings
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </header>

      {showBookings && user && (
        <div className="bookings-window">
          <h3>Your Bookings</h3>
          {userBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul>
              {userBookings.map((b, idx) => (
                <li key={idx} className="booking-item">
                  <strong>{b.restaurant}</strong> | {b.date} {b.time} | {b.guests} guests<br/>
                  Name: {b.name}, Email: {b.email}, Phone: {b.phone}
                </li>
              ))}
            </ul>
          )}
          <button className="close-bookings-btn" onClick={() => setShowBookings(false)}>Close</button>
        </div>
      )}

      <section className="restaurant-banner">
        {restaurant && (
          <>
            <img src={restaurant.photo || restaurant.image} alt="Restaurant" />
            <div className="restaurant-info">
              <h1>{restaurant.name}</h1>
              <p>{restaurant.cuisine || restaurant.city}</p>
            </div>
          </>
        )}
      </section>

      <section className="menu-section">
        <h2>Menu</h2>
        <div className="menu-grid">
          {restaurant && (restaurant.menu || []).map((item, idx) => (
            <div className="menu-item" key={idx}>
              <h3>{item.name || item.item}</h3>
              <p>{item.desc || ''}</p>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
        <div className="center-button">
          {user ? (
            <button onClick={toggleBookingForm} disabled={!restaurant}>Reserve a Table</button>
          ) : (
            <Link to="/login">
              <button style={{background:'#e03546',color:'#fff',border:'none',borderRadius:4,padding:'10px 24px',fontWeight:600,cursor:'pointer'}}>Login to Reserve</button>
            </Link>
          )}
        </div>
      </section>

      {showForm && user && (
        <section id="booking-form" className="reserve-section">
          <h2>Book Your Table</h2>
          <form className="reserve-form" onSubmit={handleBooking}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleFormChange} required />
            <input type="date" name="date" value={formData.date} onChange={handleFormChange} required />
            <input type="time" name="time" value={formData.time} onChange={handleFormChange} required />
            <input type="number" name="guests" placeholder="Guests" value={formData.guests} onChange={handleFormChange} required min="1" />
            <button type="submit">Confirm Booking</button>
            {bookingConfirmed && <div className="booking-success">Booking Confirmed!</div>}
          </form>
        </section>
      )}
    </div>
  );
};

export default RestaurantDetails;
