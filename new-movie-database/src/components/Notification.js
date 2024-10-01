import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';

const Notification = ({ message, type, onClose }) => {
  const [animationState, setAnimationState] = useState('show');

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setAnimationState('hide');
    }, 4700);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]} ${styles[animationState]}`}>
      {message}
    </div>
  );
};

export default Notification;