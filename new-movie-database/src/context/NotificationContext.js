import React, { createContext, useState, useContext, useCallback } from 'react';
import Notification from '../components/Notification';
import styles from './NotificationContext.module.css';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type) => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, type }, ...prev]);
  }, []);

  const closeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className={styles.notificationContainer}>
        {notifications.map(({ id, message, type }) => (
          <Notification
            key={id}
            message={message}
            type={type}
            onClose={() => closeNotification(id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
