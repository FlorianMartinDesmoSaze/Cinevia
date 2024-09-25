import React, { useState } from 'react';
import styles from './Forms.module.css';

function ChangePasswordForm({ onSubmit, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    onSubmit(currentPassword, newPassword);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>Change Password</button>
        <button type="button" className={styles.button} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;