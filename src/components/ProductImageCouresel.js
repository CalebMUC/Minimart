import React, { useState } from 'react';
import '../../src/ProductDetailPage.css';

const ProductImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div className="carousel-image-item" key={index}>
            <img src={image} alt={`Product ${index}`} />
          </div>
        ))}
      </div>

      <button className="carousel-arrow left" onClick={goToPrevious}>&#8249;</button>
      <button className="carousel-arrow right" onClick={goToNext}>&#8250;</button>
    </div>
  );
};

export default ProductImageCarousel;
