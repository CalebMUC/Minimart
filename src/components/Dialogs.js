import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Dialogs = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isSuccess = type === 'success';
  const isCart = type === 'cart';
  const isError = type === 'error';

  // Animation duration in ms
  const ANIMATION_DURATION = 300;
  // Timeout durations
  const SUCCESS_TIMEOUT = 3000;
  const CART_TIMEOUT = 3000;
  const ERROR_TIMEOUT = 60000; // 1 minute for errors

  useEffect(() => {
    let timer;
    
    if (isSuccess || isCart || isError) {
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), ANIMATION_DURATION); // Wait for animation to complete
      }, isError ? ERROR_TIMEOUT : (isSuccess ? SUCCESS_TIMEOUT : CART_TIMEOUT));
    }

    return () => clearTimeout(timer);
  }, [isSuccess, isCart, isError, onClose]);

  // Fade-out animation when closing
  if (!isVisible) {
    return (
      <div className={`transition-opacity duration-${ANIMATION_DURATION} opacity-0`}></div>
    );
  }

  // Success Modal (blocks interaction)
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 border-2 border-green-500 transform transition-all duration-300 scale-100 hover:scale-105">
          <div className="flex flex-col items-center space-y-4">
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className="text-green-500 text-4xl animate-bounce" 
            />
            <p className="text-gray-800 text-center text-lg font-medium">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Cart notification (non-blocking)
  if (isCart) {
    return (
      <div className="fixed top-4 right-4 z-40 animate-slide-in">
        <div className="flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl mr-3" />
          <span className="font-medium">{message}</span>
        </div>
      </div>
    );
  }

  // Error message (non-blocking)
  return (
    <div className="fixed bottom-4 left-4 z-40 animate-slide-in">
      <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg max-w-md">
        <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-xl mr-3" />
        <span className="font-medium">{message}</span>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), ANIMATION_DURATION);
          }}
          className="ml-auto text-red-500 hover:text-red-700 focus:outline-none"
          aria-label="Close error message"
        >
          <FontAwesomeIcon icon={faTimesCircle} className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(Dialogs);