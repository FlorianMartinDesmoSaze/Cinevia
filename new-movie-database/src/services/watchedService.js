import api from './api';

export const getWatched = async () => {
  try {
    const response = await api.get('/watched');
    return response.data;
  } catch (error) {
    console.error('Error fetching watched movies:', error);
    throw error;
  }
};

export const addToWatched = async (movieId) => {
  try {
    const response = await api.post('/watched', { movieId });
    return response.data;
  } catch (error) {
    console.error('Error adding to watched:', error);
    throw error;
  }
};

export const removeFromWatched = async (movieId) => {
  try {
    const response = await api.delete(`/watched/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from watched:', error);
    throw error;
  }
};

export const isWatched = async (movieId) => {
  try {
    const response = await api.get(`/watched/${movieId}`);
    return response.data.isWatched;
  } catch (error) {
    console.error('Error checking watched status:', error);
    return false;
  }
};