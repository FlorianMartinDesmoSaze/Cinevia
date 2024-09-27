import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaEye } from 'react-icons/fa';
import { addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, isFavorite, isInWatchlist, isWatched, addToWatched, removeFromWatched } from '../services/api';
import styles from './MovieCard.module.css';
import classNames from 'classnames';

function MovieCard({ movie, onRemoveFavorite, onRemoveFromWatchlist, showRating = false, isOnFavoritesPage = false, isOnWatchlistPage = false }) {
  const [isFav, setIsFav] = useState(isOnFavoritesPage);
  const [isWatchlist, setIsWatchlist] = useState(isOnWatchlistPage);
  const [isWatchedMovie, setIsWatchedMovie] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const checkStatuses = async () => {
      try {
        const [favoriteStatus, watchlistStatus, watchedStatus] = await Promise.all([
          isFavorite(movie.id),
          isInWatchlist(movie.id),
          isWatched(movie.id)
        ]);
        setIsFav(favoriteStatus);
        setIsWatchlist(watchlistStatus);
        setIsWatchedMovie(watchedStatus);
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
        if (result.message === 'Movie removed from favorites successfully') {
          setIsFav(false);
          if (onRemoveFavorite) onRemoveFavorite(movie.id);
        } else {
          throw new Error('Failed to remove favorite');
        }
      } else {
        await addToFavorites(movie.id);
        setIsFav(true);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert(`Failed to update favorite status. Please try again.`);
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
        if (result.message === 'Movie removed from watchlist successfully') {
          setIsWatchlist(false);
          if (onRemoveFromWatchlist) onRemoveFromWatchlist(movie.id);
        } else {
          throw new Error('Failed to remove from watchlist');
        }
      } else {
        await addToWatchlist(movie.id);
        setIsWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist status:', error);
      alert(`Failed to update watchlist status. Please try again.`);
    }
  };

  const handleWatchedClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to manage your watched movies.');
      return;
    }

    try {
      if (isWatchedMovie) {
        await removeFromWatched(movie.id);
        setIsWatchedMovie(false);
      } else {
        await addToWatched(movie.id);
        setIsWatchedMovie(true);
      }
    } catch (error) {
      console.error('Error updating watched status:', error);
      alert('Failed to update watched status. Please try again.');
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
      <button onClick={handleWatchedClick} className={styles.watchedButton}>
        <FaEye className={classNames(styles.iconTransition, styles.watchedIcon, { [styles.active]: isWatchedMovie })} />
      </button>
    </div>
  );
}

export default MovieCard;