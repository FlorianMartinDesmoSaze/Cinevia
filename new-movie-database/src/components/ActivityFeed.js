import React from 'react';
import styles from './ActivityFeed.module.css';

function ActivityFeed({ activities }) {
  return (
    <div className={styles.activityFeed}>
      <h3>Recent Activity</h3>
      {activities && activities.length > 0 ? (
        <ul className={styles.list}>
          {activities.map((activity, index) => (
            <li key={index} className={styles.item}>
              <span className={styles.date}>{new Date(activity.date).toLocaleDateString()}</span>
              <span className={styles.action}>{activity.action}</span>
              <span className={styles.movie}>{activity.movieTitle}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity.</p>
      )}
    </div>
  );
}

export default ActivityFeed;