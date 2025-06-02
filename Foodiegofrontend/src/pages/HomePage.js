import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import heroImg from '../assets/dreamstime_xxl_317478444.jpg';
import logo from '../assets/b20ecb52-31c2-4bcf-a188-3c3d25753b5c.webp';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      dispatch({ type: "LOGOUT_USER" });
      navigate('/login');
    }
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${heroImg})` }}>
      {/* Logout button fixed top-right */}
      <button
        onClick={handleLogout}
        style={{
    position: 'fixed',
    top: '15px',
    right: '15px',
    padding: '8px 14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 1000,
    fontWeight: 'bold',
    display: 'inline-block',   // <- add this
    width: 'auto',             // <- add this
  }}
      >
        Logout
      </button>

      {/* Navigation bar at top center */}
      <nav className="top-nav">
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/menu" className="nav-link">Menu</Link></li>
          <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
          <li><Link to="/my-orders" className="nav-link">My Orders</Link></li>
        </ul>
      </nav>

      <header className="header">
        <img src={logo} alt="FoodieGo Logo" className="logo" />
      </header>

      <main className="content">
        <h1>🍔 Craving Something Delicious?</h1>
        <p>Fresh flavors delivered to your door — hot, fast & tasty!</p>
        <Link to="/menu">
          <button className="order-btn">🚀 Order Now</button>
        </Link>
      </main>

      <footer className="footer">
        <p>© 2025 FoodieGo — Fresh meals delivered with love 💖</p>
      </footer>
    </div>
  );
};

export default Home;
