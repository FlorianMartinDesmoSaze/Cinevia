import api from '../api'; // Adjust the path as necessary
import { getMovieDetails } from './api';

const FAVORITES_KEY = 'movieFavorites';
const RATINGS_KEY = 'movieRatings';

let cachedFavorites = null;

export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    console.log('Favorites retrieved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error.response?.data || error.message);
    throw error;
  }
};

export const addFavorite = async (movieId) => {
  try {
    const response = await api.post('/favorites', { movieId });
    console.log('Favorite added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error.response?.data || error.message);
    throw error;
  }
};

export const removeFavorite = async (movieId) => {
  try {
    const response = await api.delete(`/favorites/${movieId}`);
    console.log('Favorite removed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error.response?.data || error.message);
    throw error;
  }
};

export const isFavorite = async (movieId) => {
  try {
    const response = await api.get(`/favorites/${movieId}`);
    console.log('Favorite status checked:', response.data);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error.response?.data || error.message);
    throw error;
  }
};

export const getRating = (movieId) => {
  const ratings = JSON.parse(localStorage.getItem(RATINGS_KEY)) || {};
  return ratings[movieId] || 0;
};

export const setRating = (movieId, rating) => {
  const ratings = JSON.parse(localStorage.getItem(RATINGS_KEY)) || {};
  ratings[movieId] = rating;
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
};

export const migrateFavorites = async () => {
  const favorites = getFavorites();
  const updatedFavorites = await Promise.all(
    favorites.map(async (movie) => {
      if (!movie.poster_path || movie.poster === 'https://via.placeholder.com/150x225.png?text=No+Image') {
        try {
          const details = await getMovieDetails(movie.id);
          return {
            ...movie,
            poster_path: details.poster_path,
            vote_average: details.vote_average
          };
        } catch (error) {
          console.error(`Failed to fetch details for movie ${movie.id}:`, error);
          return movie;
        }
      }
      return movie;
    })
  );
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  return updatedFavorites;
};

export const clearCache = () => {
  cachedFavorites = null;
};