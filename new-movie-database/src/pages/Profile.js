import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserProfile,
  updateEmail,
  updateUsername,
  changePassword,
  deleteAccount,
  getFavorites,
  removeFromFavorites
} from '../services/api';
import { getMovieDetails } from '../services/tmdbApi';
import styles from './Profile.module.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        console.log('User data:', userData); // Add this line for debugging
        setUser(userData);
        const favoriteIds = await getFavorites();
        console.log('Favorite IDs:', favoriteIds); // Add this line for debugging
        const favoriteMovies = await Promise.all(
          favoriteIds.map(async (id) => {
            try {
              return await getMovieDetails(id);
            } catch (error) {
              console.error(`Error fetching details for movie ${id}:`, error);
              return null;
            }
          })
        );
        setFavorites(favoriteMovies.filter(movie => movie !== null));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateEmail(newEmail);
      console.log('Updated user:', updatedUser); // Add this line for debugging
      setUser(prevUser => ({ ...prevUser, email: newEmail }));
      setMessage('Email updated successfully');
      setNewEmail('');
    } catch (error) {
      console.error('Error updating email:', error);
      setError('Failed to update email. Please try again.');
    }
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      await updateUsername(newUsername);
      setUser(prevUser => ({ ...prevUser, username: newUsername }));
      setMessage('Username updated successfully');
      setNewUsername('');
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount();
        navigate('/login'); // Redirect to login page after account deletion
      } catch (error) {
        console.error('Error deleting account:', error);
        setError('Failed to delete account. Please try again.');
      }
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      await removeFromFavorites(movieId);
      setFavorites(prevFavorites => prevFavorites.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Failed to remove favorite. Please try again.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>User Profile</h1>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}
      
      <div className={styles.userInfo}>
        <h2>Current Information</h2>
        <p>Username: {user?.username || 'Not available'}</p>
        <p>Email: {user?.email || 'Not available'}</p>
      </div>

      <div className={styles.updateForms}>
        <form onSubmit={handleUpdateEmail} className={styles.form}>
          <h3>Update Email</h3>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New Email"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Update Email</button>
        </form>

        <form onSubmit={handleUpdateUsername} className={styles.form}>
          <h3>Update Username</h3>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New Username"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Update Username</button>
        </form>

        <form onSubmit={handleChangePassword} className={styles.form}>
          <h3>Change Password</h3>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            required
            className={styles.input}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Change Password</button>
        </form>
      </div>

      <div className={styles.favorites}>
        <h2>Favorites</h2>
        {favorites.length === 0 ? (
          <p>You haven't added any favorites yet.</p>
        ) : (
          <ul className={styles.favoritesList}>
            {favorites.map(movie => (
              <li key={movie.id} className={styles.favoriteItem}>
                {movie.title}
                <button onClick={() => handleRemoveFavorite(movie.id)} className={styles.removeButton}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleDeleteAccount} className={styles.deleteButton}>Delete Account</button>
    </div>
  );
}

export default Profile;