import React, { useState, useEffect } from 'react';
import { getWatched, removeFromWatched } from '../services/api';
import { getMovieDetails } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import styles from './WatchedMovies.module.css';

function WatchedMovies() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchedMovies = async () => {
    try {
      setLoading(true);
      const watchedIds = await getWatched();
      const watchedMoviesDetails = await Promise.all(
        watchedIds.map(async (id) => {
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
      setWatchedMovies(watchedMoviesDetails.filter(movie => movie !== null));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching watched movies:', error);
      setError('Failed to fetch watched movies. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchedMovies();
  }, []);

  const handleRemoveFromWatched = async (movieId) => {
    try {
      await removeFromWatched(movieId);
      setWatchedMovies(prevWatched => prevWatched.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from watched:', error);
      setError('Failed to remove from watched. Please try again.');
    }
  };

  if (loading) return <div className={styles.container}>Loading watched movies...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Watched Movies</h1>
      {watchedMovies.length === 0 ? (
        <p className={styles.emptyMessage}>You haven't watched any movies yet.</p>
      ) : (
        <div className={styles.movieGrid}>
          {watchedMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              showRating={true}
              onRemoveFromWatched={handleRemoveFromWatched}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchedMovies;