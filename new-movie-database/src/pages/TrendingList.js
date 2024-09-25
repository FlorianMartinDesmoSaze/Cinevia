import React, { useState, useEffect, useCallback } from 'react';
import { getTrendingMovies } from '../services/tmdbApi'; // Updated import
import MovieCard from '../components/MovieCard';
import styles from './TrendingList.module.css';

function TrendingList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTrendingMovies(currentPage);
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trending movies:', err);
      setError('Failed to fetch trending movies');
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trending Movies</h1>
      {movies.length === 0 ? (
        <p>No trending movies found</p>
      ) : (
        <>
          <div className={styles.movieGrid}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showRating={true} />
            ))}
          </div>
          <div className={styles.pagination}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TrendingList;