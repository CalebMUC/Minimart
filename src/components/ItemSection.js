import React from "react";

const ItemsSection = ({ checkOutData, subTotal, isPaymentMethodSelected }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 mb-6 ${!isPaymentMethodSelected ? "opacity-50 pointer-events-none" : ""}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Items and Shipping</h2>
      
      {checkOutData && checkOutData.length > 0 ? (
        <div className="space-y-4">
          <div className="divide-y divide-gray-200">
            {checkOutData.map((item, index) => (
              <div key={index} className="py-4 flex items-start">
                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                  <img 
                    src={`${JSON.parse(item.productImage)[0]}`} 
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{item.productName}</h3>
                    <p className="ml-4 text-sm font-medium text-gray-900">
                      Ksh {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>Ksh {subTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No items in your cart</p>
        </div>
      )}
    </div>
  );
};

export default ItemsSection;