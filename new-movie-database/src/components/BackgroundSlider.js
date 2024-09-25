import React, { useState, useEffect } from 'react';
import styles from './BackgroundSlider.module.css';

const BackgroundSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <div className={styles.sliderContainer}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.sliderImage} ${index === currentImageIndex ? styles.active : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
};

export default BackgroundSlider;