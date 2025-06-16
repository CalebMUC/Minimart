import React, { useState } from "react";

const OrderSummary = ({ 
  checkOutData, 
  totalOrderedAmount, 
  totalDeliveryFees, 
  totalPaymentAmount,
  PlaceOrder 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await PlaceOrder();
    } catch (error) {
      console.error("Order placement error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-600">Items ({checkOutData.length || 0}):</span>
        <span className="font-medium">Ksh {totalOrderedAmount.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-600">Shipping & handling:</span>
        <span className="font-medium">Ksh {totalDeliveryFees.toFixed(2)}</span>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">
        <span className="font-semibold text-gray-800">Order total:</span>
        <span className="font-bold text-lg">Ksh {totalPaymentAmount.toFixed(2)}</span>
      </div>
      
      <button 
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className={`w-full mt-6 py-3 px-4 rounded-md font-medium text-white transition-colors
          ${isProcessing 
            ? 'bg-yellow-500 cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-600'}
        `}
      >
        {isProcessing ? 'Processing...' : 'Place your order'}
      </button>
    </div>
  );
};

export default OrderSummary;