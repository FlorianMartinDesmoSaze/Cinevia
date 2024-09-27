import React, { useState, useEffect } from 'react';
import { getWatchedMoviesStats } from '../services/api';
import styles from './WatchStatistics.module.css';

function WatchStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchStats = async () => {
      try {
        const watchStats = await getWatchedMoviesStats();
        setStats(watchStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watch statistics:', error);
        setError('Failed to load watch statistics');
        setLoading(false);
      }
    };

    fetchWatchStats();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading watch statistics...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!stats) {
    return <div className={styles.noData}>No watch statistics available</div>;
  }

  return (
    <div className={styles.watchStatistics}>
      <h3>Watch Statistics</h3>
      <p>Total Movies Watched: {stats.watchedCount || 0}</p>
      {/* You can add more statistics here as needed */}
    </div>
  );
}

export default WatchStatistics;