import React from 'react';
import { Link } from 'react-router-dom';

const OrderDetails = ({ orderProducts, onClose }) => {
  return (
    <div className="relative bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h2>
      <div className="space-y-3 sm:space-y-4">
        {orderProducts.map((product) => (
          <div 
            key={product.productID} 
            className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg bg-white gap-3 sm:gap-4"
          >
            {/* Product Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <img
                src={JSON.parse(product.imageUrl)[0]}
                alt={product.productName}
                className="w-full h-full object-contain rounded-md"
              />
            </div>

            {/* Product Details - Stacked on mobile, row on desktop */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-medium break-words">
                {product.productName}
              </h3>
              <div className="flex flex-wrap gap-x-4 mt-1 sm:mt-2">
                <p className="text-xs sm:text-sm text-gray-600">Qty: {product.quantity}</p>
                <p className="text-xs sm:text-sm text-gray-600">Price: ${product.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Status History Link - Full width on mobile, auto margin on desktop */}
            <div className="w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
              <Link 
                to="/Orders/OrderTracking"
                className="inline-block text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-semibold border-b-2 border-transparent hover:border-blue-600 transition pb-0.5"
              >
                Track Order
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Close Button - Better positioning and styling */}
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
        aria-label="Close order details"
      >
        <span className="text-lg font-semibold">×</span>
      </button>
    </div>
  );
};

export default OrderDetails;