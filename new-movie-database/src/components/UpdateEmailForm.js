import React, { useState } from 'react';
import styles from './Forms.module.css';

function UpdateEmailForm({ onSubmit, onCancel }) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newEmail, password);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="New Email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
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
        <button type="submit" className={styles.button}>Update Email</button>
        <button type="button" className={styles.button} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default UpdateEmailForm;