import React, { useState } from "react";
import MpesaForm from "./MpesaForm";
import CreditCardForm from "./CreditCardForm";

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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCloseForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowPaymentForm(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleMethodClick = (methodId) => {
    handleSelectPaymentMethod(methodId);
    setShowPaymentForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Payment Method</h2>

      {selectedPaymentMethod ? (
        <div className="space-y-4">
          {/* Selected Payment Method Display */}
          {paymentMethods
            .filter(method => method.id === selectedPaymentMethod)
            .map(method => (
              <div 
                key={method.id} 
                className="flex items-center justify-between p-4 border border-orange-300 bg-orange-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={method.logo} 
                    alt={method.name} 
                    className="h-10 w-10 object-contain"
                  />
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-500">Selected payment method</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectPaymentMethod(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            ))}

          {/* Custom Modal for Payment Forms */}
          {showPaymentForm && (
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={handleCloseForm}
                aria-hidden="true"
              />
              
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={handleCloseForm}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close payment form"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Form Content */}
                <div className="p-6">
                  {selectedPaymentMethod === 1 && (
                    <MpesaForm
                      paymentMethods={paymentMethods}
                       setOrderData={setOrderData}
                       orderData={orderData}
                      subTotal={subTotal}
                      shippingCost={shippingCost}
                      onMethodSelection={handleCloseForm}
                    />
                  )}
                  {selectedPaymentMethod === 2 && (
                    <CreditCardForm
                       setOrderData={setOrderData}
                       orderData={orderData}
                      subTotal={subTotal}
                      shippingCost={shippingCost}
                      onMethodSelection={handleCloseForm}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => handleMethodClick(method.id)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <img 
                src={method.logo} 
                alt={method.name} 
                className="h-10 w-10 object-contain mr-4"
              />
              <div>
                <p className="font-medium">{method.name}</p>
                {/* <p className="text-sm text-gray-500">Click to select</p> */}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSection;