import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import BackgroundSlider from '../components/BackgroundSlider';
import MovieCard from '../components/MovieCard';
import { getTrendingMovies } from '../services/tmdbApi'; // Updated import

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const backgroundImages = [
    'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
    'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    'https://image.tmdb.org/t/p/original/5myQbDzw3l8K9yofUXRJ4UTVgam.jpg',
    'https://image.tmdb.org/t/p/original/oSLd5GYGsiGgzDPKTwQh7wamO8t.jpg',
  ];

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setIsLoading(true);
      try {
        const data = await getTrendingMovies();
        console.log('Trending movies data:', data);
        setTrendingMovies(data.results.slice(0, 8));
        setError(null);
      } catch (error) {
        console.error('Error in fetchTrendingMovies:', error);
        if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError('Network error: Unable to reach the server. Please check your internet connection.');
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  console.log('Trending movies state:', trendingMovies);

  return (
    <div className={styles.home}>
      <div className={styles.heroWrapper}>
        <section className={styles.hero}>
          <BackgroundSlider images={backgroundImages} />
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1>Welcome to Cinevia</h1>
            <p>Your ultimate destination for movie exploration and tracking</p>
            <Link to="/movies" className={styles.ctaButton}>Explore Movies</Link>
          </div>
        </section>
      </div>

      <section className={styles.features}>
        <h2>Why Choose Cinevia?</h2>
        <div className={styles.featureList}>
          <div className={styles.feature}>
            <h3>Extensive Database</h3>
            <p>Access information on thousands of movies</p>
          </div>
          <div className={styles.feature}>
            <h3>Personal Watchlist</h3>
            <p>Keep track of movies you want to watch</p>
          </div>
          <div className={styles.feature}>
            <h3>Rate and Review</h3>
            <p>Share your thoughts on the movies you've watched</p>
          </div>
        </div>
      </section>

      <section className={styles.trending}>
        <h2>Trending Now</h2>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.movieGrid}>
              {trendingMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} showRating={true} />
              ))}
            </div>
            <Link to="/trending" className={styles.seeMoreButton}>See More</Link>
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
