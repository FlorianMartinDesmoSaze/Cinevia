import React from 'react';
import styles from './RecentlyWatched.module.css';

function RecentlyWatched({ recentlyWatched }) {
  return (
    <div className={styles.recentlyWatched}>
      <h3>Recently Watched</h3>
      {recentlyWatched && recentlyWatched.length > 0 ? (
        <ul className={styles.list}>
          {recentlyWatched.map((movie) => (
            <li key={movie.id} className={styles.item}>
              <img src={movie.poster} alt={movie.title} className={styles.poster} />
              <span className={styles.title}>{movie.title}</span>
              <span className={styles.date}>{new Date(movie.watchedDate).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't watched any movies recently.</p>
      )}
    </div>
  );
}

export default RecentlyWatched;