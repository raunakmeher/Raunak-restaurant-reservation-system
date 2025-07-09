import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showBookings, setShowBookings] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowBookings(false);
    navigate('/');
  };

  const fetchBookings = async (username) => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings', { params: { username } });
      setUserBookings(res.data.bookings || []);
    } catch {
      setUserBookings([]);
    }
  };

  const handleShowBookings = () => {
    if (user) {
      fetchBookings(user.username);
      setShowBookings(true);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/bookings/${id}`);
    fetchBookings(user.username);
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditForm({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/bookings/${editingId}`, editForm);
    setEditingId(null);
    fetchBookings(user.username);
  };

  return (
    <>
      <div className="hero">
        <div className="navbar">
          {user ? (
            <>
              <span>Hey! {user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              <button className="bookings-btn" onClick={handleShowBookings}>
                Your Bookings
              </button>
            </>
          ) : (
            <>
              <Link to="/restaurant-signup">Add restaurant</Link>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
              <Link to="/admin">Admin</Link>
            </>
          )}
        </div>

        <div className="hero-content">
          <h1><span>BookMyTable</span></h1>
          <p>Find the best restaurants in India</p>
        </div>
      </div>

      {showBookings && user && (
        <div className="bookings-window">
          <h3>Your Bookings</h3>
          {userBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul>
              {userBookings.map((b, idx) => (
                <li key={b._id} className="booking-item">
                  {editingId === b._id ? (
                    <form className="edit-booking-form" onSubmit={handleEditSubmit}>
                      <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required />
                      <input type="email" name="email" value={editForm.email} onChange={handleEditChange} required />
                      <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} required />
                      <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required />
                      <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required />
                      <select name="guests" value={editForm.guests} onChange={handleEditChange} required>
                        <option value="">Guests</option>
                        <option>1</option>
                        <option>2</option>
                        <option>4</option>
                        <option>6+</option>
                      </select>
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <strong>{b.restaurant}</strong> | {b.date} {b.time} | {b.guests} guests<br/>
                      Name: {b.name}, Email: {b.email}, Phone: {b.phone}
                      <div className="booking-actions">
                        <button onClick={() => handleEdit(b)}>Edit</button>
                        <button onClick={() => handleDelete(b._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button className="close-bookings-btn" onClick={() => setShowBookings(false)}>Close</button>
        </div>
      )}

      <section className="location-section">
        <h1>
          Popular locations in <img src="/images4.jpg" alt="India Flag" className="flag" /> India
        </h1>
        <p className="subtitle">
          From swanky upscale restaurants to the cosiest hidden gems serving the most incredible food,<br />
          Tomato covers it all. Explore menus, and millions of restaurant photos and reviews from users<br />
          just like you, to find your next great meal.
        </p>

        <div className="grid">
          {[
            "Agra", "Ahmedabad", "Ajmer", "Alappuzha", "Allahabad", "Amravati",
            "Amritsar", "Aurangabad", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh"
          ].map(city => (
            <Link key={city} to="/restaurants" className="location-card">
              {city} Restaurants
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <h1><i>Tomato</i></h1>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>About BookMyTable</h4>
              <ul>
                <li>Who We Are</li>
                <li>Blog</li>
                <li>Work With Us</li>
                <li>Investor Relations</li>
                <li>Report Fraud</li>
                <li>Press Kit</li>
                <li>Contact Us</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>BookMyTableverse</h4>
              <ul>
                <li>BookMyTable</li>
                <li>District</li>
                <li>Feeding India</li>
                <li>Hyperpure</li>
                <li>Live</li>
                <li>Weather Union</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>For Restaurants</h4>
              <ul>
                <li>Partner With Us</li>
                <li>Apps For You</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Learn More</h4>
              <ul>
                <li>Privacy</li>
                <li>Security</li>
                <li>Terms</li>
              </ul>
            </div>

            <div className="footer-column social">
              <h4>Social Links</h4>
              <div className="social-icons">
                <span>🔗</span>
                <span>📸</span>
                <span>❌</span>
                <span>▶️</span>
                <span>📘</span>
              </div>
              <div className="app-buttons">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                  alt="Google Play"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and
            Content Policies. All trademarks are properties of their respective owners.
            2024–2025 © BookMyTable™ Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
