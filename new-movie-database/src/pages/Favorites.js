import React, { useState, useEffect } from 'react';
import { getFavorites, removeFromFavorites } from '../services/api';
import { getMovieDetails } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import styles from './Favorites.module.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const userData = await getFavorites();
      console.log('User data:', userData);
      if (userData && Array.isArray(userData.favorites)) {
        const favoriteIds = userData.favorites;
        const favoriteMovies = await Promise.all(
          favoriteIds.map(async (id) => {
            try {
              const movieDetails = await getMovieDetails(id);
              return {
                id: id,
                ...movieDetails,
              };
            } catch (error) {
              console.error(`Error fetching details for movie ${id}:`, error);
              return null;
            }
          })
        );
        setFavorites(favoriteMovies.filter(movie => movie !== null));
      } else {
        console.error('Favorites data is not in the expected format:', userData);
        setError('Failed to load favorites. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (movieId) => {
    try {
      await removeFromFavorites(movieId);
      setFavorites(prevFavorites => prevFavorites.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setError(`Failed to remove favorite. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Favorites</h1>
      {favorites.length === 0 ? (
        <p className={styles.emptyMessage}>You haven't added any favorites yet.</p>
      ) : (
        <div className={styles.movieGrid}>
          {favorites.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onRemoveFavorite={handleRemoveFavorite}
              showRating={true}
              isOnFavoritesPage={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;