import React from "react";
import Modal from "./Modal";
import MpesaForm from "./MpesaForm";
import CreditCardForm from "./CreditCardForm";
import '../../src/checkoupage.css';

const PaymentMethodSection = ({
  paymentMethods,
  selectedPaymentMethod,
  handleSelectPaymentMethod,
  showPaymentForm,
  setShowPaymentForm,
  setOrderData,
  orderData,
  subTotal,
  shippingCost
}) => {
  // Function to clear the selected payment method
  const clearSelectedPaymentMethod = () => {
    handleSelectPaymentMethod(null); // Reset the selected payment method
    setShowPaymentForm(false); // Close any open payment form
  };

  return (
    <div className={`payment-section ${!selectedPaymentMethod ? 'disabled' : ''}`}>
      <h2>3. Payment method</h2>
      <div className="payment-method">
        {/* Render only the selected payment method */}
        {selectedPaymentMethod ? (
          <>
            {/* Display the selected payment method */}
            {paymentMethods
              .filter((method) => method.id === selectedPaymentMethod)
              .map((method) => (
                <div key={method.id} className="payment-option selected">
                  <div className="payment-method-logo">
                    <img src={method.logo} alt={method.name} />
                  </div>
                  <div className="payment-method-name">
                    <p>{method.name}</p>
                  </div>
                  {/* Clear Button */}
                  <button
                    className="clear-button"
                    onClick={clearSelectedPaymentMethod}
                  >
                    Clear
                  </button>
                </div>
              ))}

            {/* Mpesa Form Modal */}
            {showPaymentForm && selectedPaymentMethod === 1 && (
              <Modal
                isVisible={showPaymentForm}
                onClose={ clearSelectedPaymentMethod}
              >
                <MpesaForm
                  paymentMethods={paymentMethods}
                  setOrderData={setOrderData}
                  orderData={orderData}
                  subTotal={subTotal}
                  shippingCost={shippingCost}
                  onMethodSelection={setShowPaymentForm} // Pass the function
                />
              </Modal>
            )}

            {/* Credit Card Form Modal */}
            {showPaymentForm && selectedPaymentMethod === 2 && (
              <Modal
                isVisible={showPaymentForm}
                onClose={ clearSelectedPaymentMethod}
              >
                <CreditCardForm
                  setOrderData={setOrderData}
                  orderData={orderData}
                  subTotal={subTotal}
                  shippingCost={shippingCost}
                />
              </Modal>
            )}
          </>
        ) : (
          // Display all payment methods if none is selected
          paymentMethods.map((method) => (
            <div
              key={method.id}
              className="payment-option"
              onClick={() => handleSelectPaymentMethod(method.id)} // Select the method on click
            >
              <div className="payment-method-logo">
                <img src={method.logo} alt={method.name} />
              </div>
              <div className="payment-method-name">
                <p>{method.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSection;