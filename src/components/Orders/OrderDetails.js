import React from 'react';
import { Link } from 'react-router-dom';

const OrderDetails = ({ orderProducts, onClose }) => {
  return (
    <div className=" relative bg-gray-100 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      <div className="space-y-4">
        {orderProducts.map((product) => (
          <div key={product.productID} className="flex items-center p-4 border border-gray-200 rounded-lg bg-white">
            {/* Product Image */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-full object-contain rounded-md"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col ml-20  max-w-md">
              <h3 className="text-md font-medium break-words whitespace-normal">
                {product.productName}
              </h3>
              <p className="text-sm text-gray-600 mt-2">Quantity: {product.quantity}</p>
              <p className="text-sm text-gray-600">Price: ${product.price}</p>
            </div>

            {/* Status History Link */}
            <div className="ml-auto">
              {/* <a 
                href="#" 
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold border-b-2 border-transparent hover:border-blue-600 transition"
              >
                See Status History
              </a> */}

              <Link to="/Orders/OrderTracking"
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold border-b-2 border-transparent hover:border-blue-600 transition"
              >
                See Status History

              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Close Button */}
      {/* <button
        onClick={onClose}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors block mx-auto"
      >
        Close
      </button> */}
      <button className="absolute top-10 right-10 bg-transparent cursor-pointer  color-gray-200 hover:color-red-200  " onClick={onClose}>X</button>
    </div>
  );
};

export default OrderDetails;
