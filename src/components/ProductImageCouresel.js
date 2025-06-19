import React, { useState, useRef } from 'react';

const ProductImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
    const [showZoomPreview, setShowZoomPreview] = useState(false);
  const imageRef = useRef(null);
  const zoomRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current || !zoomRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${images[currentIndex]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: `${width * 2}px ${height * 2}px`,
      left: `${e.clientX - left - 75}px`,
      top: `${e.clientY - top - 75}px`,
    });
  };

  const handleMouseEnter = () => {
    setShowZoomPreview(true);
    setZoomStyle(prev => ({ ...prev, display: 'block' }));
  };

  const handleMouseLeave = () => {
    setShowZoomPreview(false);
    setZoomStyle(prev => ({ ...prev, display: 'none' }));
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {/* Main Carousel with Zoom */}
      <div className="relative w-full max-w-lg mx-auto">
        {/* Image Container with Zoom Effect */}
        <div 
          className="relative overflow-hidden rounded-lg shadow-md"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={imageRef}
          onClick={openModal}
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img 
                  src={image} 
                  alt={`Product ${index}`} 
                  className="w-full h-96 object-contain bg-white cursor-crosshair"
                />
              </div>
            ))}
          </div>
          
          {/* Zoom Lens */}
          <div 
            ref={zoomRef}
            className="absolute hidden w-[150px] h-[150px] bg-white rounded-full pointer-events-none border-2 border-yellow-400 shadow-lg z-10"
            style={zoomStyle}
          />
        </div>

         {/* Fixed Zoom Preview (Amazon-style) - Now conditionally rendered */}
        {showZoomPreview && (
          <div className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 w-64 h-64 border-2 border-gray-200 bg-white overflow-hidden rounded-lg shadow-xl z-10">
            <div 
              className="w-full h-full bg-no-repeat"
              style={{
                backgroundImage: `url(${images[currentIndex]})`,
                backgroundSize: `${imageRef.current?.offsetWidth * 2}px ${imageRef.current?.offsetHeight * 2}px`,
                backgroundPosition: zoomStyle.backgroundPosition
              }}
            />
          </div>
        )}

        {/* Navigation Arrows */}
        <button 
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition z-20"
          aria-label="Previous image"
        >
          &#8249;
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition z-20"
          aria-label="Next image"
        >
          &#8250;
        </button>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-12 h-12 border-2 rounded overflow-hidden ${currentIndex === index ? 'border-yellow-500' : 'border-transparent'}`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="container mx-auto max-w-6xl py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="fixed top-4 right-4 text-white text-3xl hover:text-yellow-400 transition z-50"
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="bg-white p-2 rounded-lg shadow-lg">
                  <img 
                    src={image} 
                    alt={`Product ${index}`} 
                    className="w-full h-64 object-contain cursor-pointer"
                    onClick={() => {
                      setCurrentIndex(index);
                      closeModal();
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageCarousel;