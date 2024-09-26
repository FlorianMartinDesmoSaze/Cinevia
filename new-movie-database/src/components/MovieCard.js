import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, isFavorite, isInWatchlist } from '../services/api';
import styles from './MovieCard.module.css';
import classNames from 'classnames'; // You might need to install this package: npm install classnames

function MovieCard({ movie, onRemoveFavorite, onRemoveFromWatchlist, showRating = false, isOnFavoritesPage = false, isOnWatchlistPage = false }) {
  const [isFav, setIsFav] = useState(isOnFavoritesPage);
  const [isWatchlist, setIsWatchlist] = useState(isOnWatchlistPage);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const checkStatuses = async () => {
      try {
        const [favoriteStatus, watchlistStatus] = await Promise.all([
          isFavorite(movie.id),
          isInWatchlist(movie.id)
        ]);
        setIsFav(favoriteStatus);
        setIsWatchlist(watchlistStatus);
      } catch (error) {
        console.error('Error checking statuses:', error);
      }
    };

    if (isLoggedIn) {
      checkStatuses();
    }
  }, [movie.id, isLoggedIn]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to manage your favorites.');
      return;
    }

    try {
      if (isFav) {
        const result = await removeFromFavorites(movie.id);
        console.log('Remove favorite result:', result);
        if (result.message === 'Movie removed from favorites successfully') {
          setIsFav(false);
          if (onRemoveFavorite) onRemoveFavorite(movie.id);
        } else {
          throw new Error('Failed to remove favorite');
        }
      } else {
        const result = await addToFavorites(movie.id);
        console.log('Add favorite result:', result);
        setIsFav(true);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      alert(`Failed to update favorite status. ${error.response?.data?.message || error.message || 'Please try again.'}`);
    }
  };

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to manage your watchlist.');
      return;
    }

    try {
      if (isWatchlist) {
        const result = await removeFromWatchlist(movie.id);
        console.log('Remove from watchlist result:', result);
        if (result.message === 'Movie removed from watchlist successfully') {
          setIsWatchlist(false);
          if (onRemoveFromWatchlist) onRemoveFromWatchlist(movie.id);
        } else {
          throw new Error('Failed to remove from watchlist');
        }
      } else {
        const result = await addToWatchlist(movie.id);
        console.log('Add to watchlist result:', result);
        setIsWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist status:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      alert(`Failed to update watchlist status. ${error.response?.data?.message || error.message || 'Please try again.'}`);
    }
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=No+Image';

  return (
    <div className={styles.movieCard}>
      <Link to={`/movie/${movie.id}`}>
        <img src={posterUrl} alt={movie.title} className={styles.poster} />
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{movie.title}</h3>
          {movie.release_date && (
            <p className={styles.releaseDate}>{new Date(movie.release_date).getFullYear()}</p>
          )}
        </div>
        {showRating && movie.vote_average && (
          <div className={styles.rating}>
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </Link>
      <button onClick={handleFavoriteClick} className={styles.favoriteButton}>
        <FaStar className={classNames(styles.iconTransition, styles.favoriteIcon, { [styles.active]: isFav })} />
      </button>
      <button onClick={handleWatchlistClick} className={styles.watchlistButton}>
        <div className={classNames(styles.watchlistIcon, { [styles.active]: isWatchlist })} />
      </button>
    </div>
  );
}

export default MovieCard;