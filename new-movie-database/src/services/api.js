import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies
});

// Function to get CSRF token from cookie
const getCSRFToken = () => {
  const name = 'XSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  console.log('CSRF token not found in cookies');
  return null;
};

// Add a request interceptor to include the auth token and CSRF token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Auth token added to request');
  } else {
    console.log('No auth token found in localStorage');
  }
  
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
    console.log('CSRF token added to request');
  } else {
    console.log('No CSRF token found');
  }
  
  console.log('Request config:', config);
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response && error.response.status === 401) {
      console.log('401 error detected, removing token and redirecting to login');
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    console.log('Attempting login...');
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
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

export const updateEmail = async (newEmail, currentPassword) => {
  try {
    const response = await api.put('/auth/update-email', { newEmail, password: currentPassword });
    return response.data;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    if (!Array.isArray(response.data.favorites)) {
      throw new Error('Favorites data is not in the expected format');
    }
    return response.data.favorites; // Return just the favorites array
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

export const updateUsername = async (newUsername, currentPassword) => {
  try {
    const response = await api.put('/auth/update-username', { newUsername, password: currentPassword });
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