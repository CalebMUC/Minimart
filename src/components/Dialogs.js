import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../src/Dialogs.css';
const SuccessDialog = ({ message  }) => {
    return (
        <div className="success-dialog">
            <div className="dialog-box">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faCheckCircle} size="3x" color="green" />
                </div>
                <div className="message-container">
                    {message}
                </div>
            </div>
        </div>
    );
};

export default SuccessDialog;
