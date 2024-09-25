import React, { useState } from 'react';
import styles from './EditProfileForm.module.css';

function EditProfileForm({ profile, onSave, onCancel }) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, bio });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
        ></textarea>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>Save</button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancel</button>
      </div>
    </form>
  );
}

export default EditProfileForm;