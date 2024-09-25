import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import { FaChevronDown, FaUser } from 'react-icons/fa';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('favorites');
    localStorage.removeItem('movieFavorites');
    localStorage.removeItem('movieRatings');
    localStorage.removeItem('watchlist');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={`${styles.navGroup} ${styles.mobileOnly}`}>
        <div className={styles.dropdown}>
          <button 
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`} 
            onClick={toggleMobileMenu}
          >
            <span className={styles['hamburger-top']}></span>
            <span className={styles['hamburger-middle']}></span>
            <span className={styles['hamburger-bottom']}></span>
          </button>
          <div className={`${styles.dropdownContent} ${isMobileMenuOpen ? styles.show : ''}`}>
            <Link to="/movies" className={styles.dropdownItem}>Movies</Link>
            <Link to="/trending" className={styles.dropdownItem}>Trending</Link>
          </div>
        </div>
      </div>
      <div className={`${styles.navGroup} ${styles.desktopOnly}`}>
        <Link to="/movies" className={styles.navLink}>Movies</Link>
        <Link to="/trending" className={styles.navLink}>Trending</Link>
      </div>
      <div className={styles.navGroup}>
        <Link to="/" className={`${styles.navLink} ${styles.logo}`}>
          <span className={styles.logoText}>Cinevia</span>
          <span className={styles.logoIcon}>C</span>
        </Link>
      </div>
      <div className={styles.navGroup}>
        {isLoggedIn ? (
          <div className={styles.dropdown}>
            <button className={styles.navLink} onClick={toggleUserMenu}>
              <span className={styles.desktopOnly}>Account </span>
              <FaUser className={styles.mobileOnly} />
              <FaChevronDown className={styles.dropdownIcon} />
            </button>
            <div className={`${styles.dropdownContent} ${isUserMenuOpen ? styles.show : ''}`}>
              <Link to="/favorites" className={styles.dropdownItem}>Favorites</Link>
              <Link to="/watchlist" className={styles.dropdownItem}>Watchlist</Link>
              <Link to="/profile" className={styles.dropdownItem}>Profile</Link>
              <button onClick={handleLogout} className={styles.dropdownItem}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className={`${styles.navLink} ${styles.desktopOnly}`}>Login</Link>
            <Link to="/register" className={`${styles.navLink} ${styles.desktopOnly}`}>Register</Link>
            <Link to="/login" className={`${styles.navLink} ${styles.mobileOnly}`}>
              <FaUser />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;