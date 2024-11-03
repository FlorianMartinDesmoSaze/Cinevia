import React, { useState, useEffect } from 'react';
import { testBackend } from '../config/api';

const TestApi = () => {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    testBackend()
      .then(data => setStatus(JSON.stringify(data, null, 2)))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  return <pre>{status}</pre>;
};

export default TestApi;