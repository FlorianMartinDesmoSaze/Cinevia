const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // This will use the same domain in production
  : 'http://localhost:5000/api';  // Local development

export const testBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error testing backend:', error);
    throw error;
  }
};