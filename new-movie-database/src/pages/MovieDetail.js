import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieVideos } from '../services/tmdbApi'; // Updated import
import { addToFavorites, removeFromFavorites } from '../services/api'; // Updated import
import TrailerModal from '../components/TrailerModal';
import StarRating from '../components/StarRating';
import styles from './MovieDetail.module.css';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        console.log('Fetching movie data for id:', id);
        const [details, videoData] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id)
        ]);
        console.log('Movie details:', details);
        console.log('Video data:', videoData);
        setMovie(details);
        setVideos(videoData);
        // TODO: Implement checking if movie is in favorites
        // setFavorite(isFavorite(details.id));
        // TODO: Implement getting user rating
        // setUserRating(getRating(details.id));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError('Failed to fetch movie data');
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  const handleFavoriteClick = async () => {
    try {
      if (favorite) {
        await removeFromFavorites(movie.id);
      } else {
        await addToFavorites(movie.id);
      }
      setFavorite(!favorite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      // TODO: Add user-friendly error handling
    }
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    // TODO: Implement setting rating in backend
    // setRating(movie.id, rating);
  };

  const trailer = videos.find(video => video.type === 'Trailer');

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!movie) return <div className={styles.container}>No movie found</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{movie.title}</h1>
      <div className={styles.content}>
        {movie.poster_path && (
          <img
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={`${movie.title} poster`}
          />
        )}
        <div className={styles.details}>
          <button onClick={handleFavoriteClick} className={styles.favoriteButton}>
            {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          {trailer && (
            <button onClick={() => setShowTrailer(true)} className={styles.trailerButton}>
              Watch Trailer
            </button>
          )}
          <div className={styles.ratingContainer}>
            <p>Your Rating:</p>
            <StarRating initialRating={userRating} onRate={handleRating} />
          </div>
          <p className={styles.overview}>{movie.overview}</p>
          <div className={styles.info}>
            <span className={styles.label}>Release Date:</span>
            <span className={styles.value}>{movie.release_date}</span>
            <span className={styles.label}>Rating:</span>
            <span className={styles.value}>{movie.vote_average}/10</span>
            <span className={styles.label}>Runtime:</span>
            <span className={styles.value}>{movie.runtime} minutes</span>
            <span className={styles.label}>Genres:</span>
            <span className={styles.value}>
              {movie.genres.map(genre => genre.name).join(', ')}
            </span>
          </div>
        </div>
      </div>
      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
}

export default MovieDetail;