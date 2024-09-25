import React, { useState } from 'react';
import styles from './Forms.module.css';

function DeleteAccountConfirmation({ onConfirm, onCancel }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      onConfirm(password);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p>Please enter your password to confirm account deletion:</p>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className={styles.buttonGroup}>
        <button type="submit" className={`${styles.button} ${styles.deleteAccount}`}>Delete Account</button>
        <button type="button" className={styles.button} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default DeleteAccountConfirmation;