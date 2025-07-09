import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/signup', {
          username,
          email,
          password,
          isAdmin: false,
        });
        setError('');
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.msg || 'Signup failed');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="signup-error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <div className="signup-login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup; 