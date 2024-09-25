import React, { useState, useEffect } from 'react';
import { getWatchlist, removeFromWatchlist } from '../services/api';
import { getMovieDetails } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import styles from './Watchlist.module.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const watchlistIds = await getWatchlist();
      const watchlistMovies = await Promise.all(
        watchlistIds.map(async (id) => {
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
      setWatchlist(watchlistMovies.filter(movie => movie !== null));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError('Failed to load watchlist. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
      setWatchlist(prevWatchlist => prevWatchlist.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      if (error.response && error.response.status === 404) {
        // If the movie is not found in the watchlist, remove it from the local state
        setWatchlist(prevWatchlist => prevWatchlist.filter(movie => movie.id !== movieId));
      } else {
        setError('Failed to remove from watchlist. Please try again.');
      }
    }
  };

  if (loading) return <div className={styles.container}>Loading watchlist...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className={styles.emptyMessage}>Your watchlist is empty.</p>
      ) : (
        <div className={styles.movieGrid}>
          {watchlist.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              showRating={true}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              isOnWatchlistPage={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;