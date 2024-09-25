import React from 'react';
import MovieCard from './MovieCard';
import styles from './FavoriteMoviesList.module.css';

function FavoriteMoviesList({ favorites, onRemoveFavorite }) {
  console.log('Favorites in FavoriteMoviesList:', favorites);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Favorite Movies</h2>
      {favorites.length === 0 ? (
        <p>You haven't added any favorite movies yet.</p>
      ) : (
        <div className={styles.movieGrid}>
          {favorites.map((movie) => {
            console.log('Individual movie in FavoriteMoviesList:', movie);
            return (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onRemoveFavorite={() => onRemoveFavorite(movie.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavoriteMoviesList;