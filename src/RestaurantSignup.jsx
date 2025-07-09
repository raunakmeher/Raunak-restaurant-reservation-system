import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RestaurantSignup.css';

const RestaurantSignup = () => {
  const [form, setForm] = useState({
    name: '',
    city: '',
    photo: '',
    email: '',
    password: '',
    menu: [{ item: '', price: '' }],
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMenuChange = (idx, e) => {
    const newMenu = form.menu.map((m, i) =>
      i === idx ? { ...m, [e.target.name]: e.target.value } : m
    );
    setForm({ ...form, menu: newMenu });
  };

  const addMenuItem = () => {
    setForm({ ...form, menu: [...form.menu, { item: '', price: '' }] });
  };

  const removeMenuItem = (idx) => {
    setForm({ ...form, menu: form.menu.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await axios.post('http://localhost:5000/api/restaurants', form);
      setSuccess(true);
      setForm({ name: '', city: '', photo: '', email: '', password: '', menu: [{ item: '', price: '' }] });
    } catch {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="restaurant-signup-container">
      <form className="restaurant-signup-form" onSubmit={handleSubmit}>
        <h2>Restaurant Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="photo"
          placeholder="Photo URL (optional)"
          value={form.photo}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <div className="menu-section">
          <label>Menu Items</label>
          {form.menu.map((m, idx) => (
            <div className="menu-item-row" key={idx}>
              <input
                type="text"
                name="item"
                placeholder="Item Name"
                value={m.item}
                onChange={e => handleMenuChange(idx, e)}
                required
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={m.price}
                onChange={e => handleMenuChange(idx, e)}
                required
              />
              {form.menu.length > 1 && (
                <button type="button" onClick={() => removeMenuItem(idx)} className="remove-menu-btn">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addMenuItem} className="add-menu-btn">Add Menu Item</button>
        </div>
        <button type="submit">Sign Up</button>
        {success && <div className="restaurant-signup-success">Signup successful!</div>}
        {error && <div className="restaurant-signup-success" style={{ color: '#e03546' }}>{error}</div>}
        <div className="restaurant-login-link">
          Already have a restaurant account? <Link to="/restaurant-login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default RestaurantSignup; 