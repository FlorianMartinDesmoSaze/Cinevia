import React from 'react';
import styles from './DisplayProfile.module.css';

function DisplayProfile({ profile, onEdit }) {
  return (
    <div className={styles.profileDisplay}>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Join Date:</strong> {new Date(profile.joinDate).toLocaleDateString()}</p>
      {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
      <button onClick={onEdit} className={styles.editButton}>Edit Profile</button>
    </div>
  );
}

export default DisplayProfile;