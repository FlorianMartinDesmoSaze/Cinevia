import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import './App.css';  // Add this line
import './index.css';  // Add this line if not already in index.js
import Navbar from './components/Navigation'; // Make sure to import your Navbar component
import MovieList from './pages/MovieList';
import TrendingList from './pages/TrendingList';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';  // Add this line

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div className="App">
      <Navbar /> {/* Add the Navbar component here */}
      <Routes>
        <Route path="/" element={<Home />} />  // Change this line
        <Route path="/movies" element={<MovieList />} /> {/* Add this line */}
        <Route path="/trending" element={<TrendingList />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;