import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RestaurantSignup.css';

const RestaurantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
    } else {
      setError('');
      try {
        const res = await axios.post('http://localhost:5000/api/restaurants/login', { email, password });
        localStorage.setItem('restaurant', JSON.stringify(res.data.restaurant));
        navigate('/restaurant-dashboard');
      } catch (err) {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="restaurant-signup-container">
      <form className="restaurant-signup-form" onSubmit={handleSubmit}>
        <h2>Restaurant Login</h2>
        {error && <div className="restaurant-signup-success" style={{ color: '#e03546' }}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        <div className="restaurant-login-link">
          Don't have a restaurant account? <Link to="/restaurant-signup">Sign up here</Link>
        </div>
      </form>
    </div>
  );
};

export default RestaurantLogin; 