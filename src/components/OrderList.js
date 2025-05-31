import React, { useState } from 'react';
import Modal from './OrderModal';
import { FaDownload, FaPrint, FaArrowLeft } from 'react-icons/fa';
import OrderDetails from './Orders/OrderDetails';

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
    setSelectedOrderProducts(orderProducts);
    setIsOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrderProducts([]);
    setIsOrderDetails(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {isOrderDetails && (
        <button
          onClick={handleCloseOrderDetails}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
      )}

      {!isOrderDetails ? (
        orders.map((order) => (
          <div
            key={order.orderID}
            className="flex flex-col sm:flex-row justify-between p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all"
          >
            <div className="mb-4 sm:mb-0">
              <h4 className="text-lg font-semibold text-gray-800">Order #{order.orderID}</h4>
              <p className="text-sm text-gray-600 mt-2">
                Status: <span className="font-medium">{order.status}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Placed on: {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Total: <span className="font-medium">${order.totalOrderAmount.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex items-center space-x-4 self-end sm:self-auto">
              <button
                onClick={() => handleOpenOrderDetails(order.products)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                Order Details
              </button>
              <FaDownload
                onClick={() => handleOpenModal(order)}
                className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="mt-6">
          <OrderDetails
            orderProducts={selectedOrderProducts}
            onClose={handleCloseOrderDetails}
          />
        </div>
      )}

      <Modal show={showModal} onClose={handleCloseModal} order={selectedOrder} />
    </div>
  );
};

export default OrdersList;