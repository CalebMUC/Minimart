import React, { useState } from 'react';
import Modal from './OrderModal'; // Import the Modal component
import { FaDownload, FaPrint, FaArrowLeft } from 'react-icons/fa';
import OrderDetails from './Orders/OrderDetails'; // Import the OrderDetails component

const OrdersList = ({ orders }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [isOrderDetails, setIsOrderDetails] = useState(false);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleOpenOrderDetails = (orderProducts) => {
    setSelectedOrderProducts(orderProducts); // Set the selected order products
    setIsOrderDetails(true); // Show the order details page
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrderProducts([]); // Clear the selected order products
    setIsOrderDetails(false); // Return to the orders list
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Back Arrow (Visible only when OrderDetails is shown) */}
      {isOrderDetails && (
        <button
          onClick={handleCloseOrderDetails}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
      )}

      {/* Render Orders List or Order Details */}
      {!isOrderDetails ? (
        // Orders List
        orders.map((order) => (
          <div
            key={order.orderID}
            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="text-lg font-semibold text-gray-800">Order #{order.orderID}</h4>
              <p className="text-sm text-gray-600 pb-4">
                Status: <span className="font-medium">{order.status}</span>
              </p>
              <p className="text-sm text-gray-600 pb-4">
                Placed on: {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 pb-4">
                Total: <span className="font-medium">${order.totalOrderAmount}</span>
              </p>
            </div>

            {/* Trigger Modal and Order Details */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleOpenOrderDetails(order.products)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                See Order Details
              </button>
              <FaDownload
                onClick={() => handleOpenModal(order)}
                className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer"
              />
            </div>
          </div>
        ))
      ) : (
        // Order Details Page
        <div className="mt-6">
          <OrderDetails
            orderProducts={selectedOrderProducts}
            onClose={handleCloseOrderDetails}
          />
        </div>
      )}

      {/* Render the modal when triggered */}
      <Modal show={showModal} onClose={handleCloseModal} order={selectedOrder} />
    </div>
  );
};

export default OrdersList;