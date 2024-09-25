import React, { useState } from 'react';
import styles from './Forms.module.css';

function UpdateUsernameForm({ onSubmit, onCancel }) {
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newUsername, password);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New Username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>Update Username</button>
        <button type="button" className={styles.button} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default UpdateUsernameForm;