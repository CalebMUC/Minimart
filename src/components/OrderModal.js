import React from 'react';
import { FaPrint } from 'react-icons/fa';

const OrderModal = ({ show, onClose, order }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto relative">
        {/* Print Icon */}
        <div className="absolute top-4 right-16 text-gray-600 hover:text-gray-200 cursor-pointer">
          <FaPrint className="text-lg" /> 
          <span>Print as Pdf</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="p-6">
          {/* General Section */}
          <h4 className="text-md font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
            Order #{order.orderID} Details
          </h4>
          <table className="w-full mb-6">
            <tbody>
              <tr>
                <td className="font-semibold py-2">Status:</td>
                <td className="py-2">{order.status}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Placed on:</td>
                <td className="py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Products and Shipping Address Section */}
          <h4 className="text-md font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
            Products and Shipping Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Products Section */}
            <div>
              <h5 className="text-sm font-semibold text-green-600 mb-3">Products</h5>
              <table className="w-full">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="p-2 text-sm text-left">Product Name</th>
                    <th className="p-2 text-sm text-left">Quantity</th>
                    <th className="p-2 text-sm text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="p-2 border text-sm">
                        {product.productName.length > 50
                          ? product.productName.slice(0, 50) + '...'
                          : product.productName}
                      </td>
                      <td className="p-2 border text-sm">{product.quantity}</td>
                      <td className="p-2 border text-sm">${product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Shipping Address Section */}
            <div>
              <h5 className="text-md font-semibold text-green-600 mb-3">Shipping Address</h5>
              <table className="w-full">
                <tbody>
                  {order.shippingAddress &&
                    Object.entries(order.shippingAddress).map(([key, value], index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="p-2 border font-semibold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </td>
                        <td className="p-2 border">{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment and Order Summary Section */}
          <h4 className="text-md font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Payment and Order Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Details Section */}
            <div>
              <h5 className="text-md font-semibold text-green-600 mb-3">Payment Details</h5>
              <table className="w-full">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="p-2 text-left">Reference</th>
                    <th className="p-2 text-left">Method</th>
                    <th className="p-2 text-left">Phone Number</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {order.paymentDetails &&
                    order.paymentDetails.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="text-sm p-2 border">{payment.paymentReference}</td>
                        <td className=" text-sm p-2 border">{payment.paymentMethod}</td>
                        <td className="text-sm p-2 border">{payment.phonenumber}</td>
                        <td className=" text-sm p-2 border">${payment.amount}</td>
                        <td className="text-sm p-2 border">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary Section */}
            <div>
              <h5 className="text-lg font-semibold text-green-600 mb-3">Order Summary</h5>
              <table className="w-full">
                <tbody>
                  <tr className="hover:bg-gray-100">
                    <td className="p-2 border font-semibold">Total Order Amount:</td>
                    <td className="p-2 border">${order.totalOrderAmount}</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="p-2 border font-semibold">Total Payment Amount:</td>
                    <td className="p-2 border">${order.totalPaymentAmount}</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="p-2 border font-semibold">Total Delivery Fees:</td>
                    <td className="p-2 border">${order.totalDeliveryFees}</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="p-2 border font-semibold">Total Tax:</td>
                    <td className="p-2 border">${order.totalTax}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;