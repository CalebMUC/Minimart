import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import '../../src/CSS/Dialogs.css';

const Dialogs = ({ message, type, onClose }) => {
  const isSuccess = type === 'success'; // Check if message is success or error
  const isCart = type == 'cart';

  useEffect(() => {
    // Set auto-close behavior for success and cart dialogs
    if (isSuccess || isCart) {
      const timer = setTimeout(() => {
        onClose(); // Close dialog after 10 seconds
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout on unmount
    }
  }, [isSuccess, isCart, onClose]);

  if (isSuccess) {
    // Success Modal dialog (blocks interaction)
    return (
      <div className="dialog-overlay">
        <div className={`dialog-box ${isSuccess ? 'success' : 'error'}`}>
          <div className="icon-container">
            <FontAwesomeIcon icon={faCheckCircle} size="3x" color="green" />
          </div>
          <div className="message-container">
            {message}
          </div>
        </div>
      </div>
    );
  }

  if (isCart){
    return (
        <div className="inline-cart-message">
          <div className="icon-container">
            <FontAwesomeIcon icon={faCheckCircle} size="2x" color="green" />
          </div>
          <span className="message-container">
            {message}
          </span>
        </div>
      );
  }

  // Error message is displayed inline (does not block interaction)
  return (
    <div className="inline-error-message">
      <div className="icon-container">
        <FontAwesomeIcon icon={faTimesCircle} size="1x" color="red" />
      </div>
      <span className="message-container">
        {message}
      </span>
    </div>
  );
};

export default Dialogs;
