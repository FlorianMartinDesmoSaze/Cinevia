import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateEmail = async (newEmail) => {
  try {
    const response = await api.put('/auth/update-email', { newEmail });
    return response.data;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    return response.data; // This should be the user object containing the favorites array
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const getWatchlist = async () => {
  try {
    const response = await api.get('/watchlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

export const addToFavorites = async (movieId) => {
  try {
    const response = await api.post('/favorites', { movieId });
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (movieId) => {
  try {
    const response = await api.delete(`/favorites/${movieId}`);
    console.log('Remove favorite response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const addToWatchlist = async (movieId) => {
  try {
    const response = await api.post('/watchlist', { movieId: movieId.toString() });
    return response.data;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    const response = await api.delete(`/watchlist/${movieId}`);
    console.log('Remove from watchlist response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    if (error.response && error.response.status === 404) {
      console.log('Movie not found in watchlist, considering it removed');
      return { message: 'Movie removed from watchlist successfully', watchlist: [] };
    }
    throw error;
  }
};

export const updateUsername = async (newUsername, password) => {
  try {
    const response = await api.put('/auth/update-username', { newUsername, password });
    return response.data;
  } catch (error) {
    console.error('Error updating username:', error);
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const deleteAccount = async (password) => {
  try {
    const response = await api.delete('/auth/delete-account', { data: { password } });
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

export const isFavorite = async (movieId) => {
  try {
    const response = await api.get(`/favorites/${movieId}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
};

export const isInWatchlist = async (movieId) => {
  try {
    const response = await api.get(`/watchlist/${movieId}`);
    return response.data.isInWatchlist;
  } catch (error) {
    console.error('Error checking watchlist status:', error);
    throw error;
  }
};

// Add these new functions for the watched feature
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

export default api;