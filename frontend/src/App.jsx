import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './HomePage';
import Restaurants from './RestaurantPage';
import RestaurantDetails from './RestaurantDetails';
import Login from './Login';
import Signup from './Signup';
import AdminLogin from './AdminLogin';
import RestaurantSignup from './RestaurantSignup';
import RestaurantLogin from './RestaurantLogin';
import RestaurantDashboard from './RestaurantDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/restaurant/db/:id" element={<RestaurantDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/restaurant-signup" element={<RestaurantSignup />} />
          <Route path="/restaurant-login" element={<RestaurantLogin />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
