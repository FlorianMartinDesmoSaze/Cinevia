import React, { useState, useEffect, useCallback } from 'react';
import { getPopularMovies, searchMovies } from '../services/tmdbApi'; // Updated import
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import styles from './MovieList.module.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await searchMovies(searchQuery, currentPage);
      } else {
        data = await getPopularMovies(currentPage);
      }
      console.log('Fetched movies:', data); // Add this line for debugging
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies');
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Movies</h1>
      <div className={styles.searchBar}>
        <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      </div>
      {movies.length === 0 ? (
        <p>No movies found</p>
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
              className={styles.gradientButton}
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

export default MovieList;