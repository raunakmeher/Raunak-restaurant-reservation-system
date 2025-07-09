import React, { useEffect, useState } from 'react';
import './RestaurantPage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const RestaurantPage = () => {
  const [user, setUser] = useState(null);
  const [backendRestaurants, setBackendRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const input = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.restaurant-card');
    if (input) {
      input.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        cards.forEach(card => {
          const name = card.getAttribute('data-name').toLowerCase();
          card.style.display = name.includes(query) ? 'block' : 'none';
        });
      });
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fetch backend restaurants
    axios.get(`${apiUrl}/api/restaurants`).then(res => {
      setBackendRestaurants(res.data.restaurants || []);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const restaurants = [
    {
      name: 'Taj View Restaurant',
      image: '/images5.jpeg',
      description: 'North Indian, Mughlai • 7 Reviews',
    },
    {
      name: 'Samosa House',
      image: '/images6.jpg',
      description: 'Snacks, Street Food • 15 Reviews',
    },
    {
      name: 'The Royal Feast',
      image: '/images7.jpg',
      description: 'Luxury Dining • 17 Reviews',
    },
    {
      name: 'Mughlai Palace',
      image: '/image1.jpg',
      description: 'Mughlai, Indian • 6 Reviews',
    },
  ];

  return (
    <div>
      <header className="header">
        <div className="header-wrapper">
          <div className="logo">Book<span>My</span>Table™</div>

          <nav className="navbar">
            <div className="search-bar">
              <div className="search-input">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Search for restaurant, cuisine or a dish"
                />
              </div>
            </div>
          </nav>

          <div className="auth-links">
            {user ? (
              <>
                <span>Hey! {user.username}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <nav className="tabs">
        <div className="tab active">🍽️ Dining Out</div>
      </nav>

      <section className="restaurant-section">
        <h2>Most Popular Restaurants</h2>
        <p className="desc">
          Explore top-rated restaurants based on customer experiences and food quality.
        </p>

        <div className="restaurant-grid">
          {restaurants.map((r, index) => (
            <Link
              to={`/restaurant/${index}`}
              className="restaurant-card"
              key={index}
              data-name={r.name.toLowerCase()}
            >
              <div className="image-wrapper">
                <img src={r.image} alt={r.name} />
              </div>
              <div className="info">
                <div className="card-content">
                  <div className="card-header">
                    <h3>{r.name}</h3>
                  </div>
                  <p>{r.description}</p>
                </div>
              </div>
            </Link>
          ))}
          {/* Backend restaurants */}
          {backendRestaurants.map((r, index) => (
            <Link
              to={`/restaurant/db/${r._id}`}
              className="restaurant-card"
              key={r._id}
              data-name={r.name.toLowerCase()}
            >
              <div className="image-wrapper">
                {r.photo ? (
                  <img src={r.photo} alt={r.name} />
                ) : (
                  <div style={{height:180,display:'flex',alignItems:'center',justifyContent:'center',background:'#eee'}}>No Image</div>
                )}
              </div>
              <div className="info">
                <div className="card-content">
                  <div className="card-header">
                    <h3>{r.name}</h3>
                  </div>
                  <p>{r.city}</p>
                  <div style={{fontSize:'13px',color:'#888'}}>Menu: {r.menu && r.menu.map((m,i) => `${m.item} (${m.price})`).join(', ')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RestaurantPage;
