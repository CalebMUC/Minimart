import React, { useState } from 'react';
import Modal from './OrderModal';
import { FaDownload, FaPrint, FaArrowLeft } from 'react-icons/fa';
import OrderDetails from './Orders/OrderDetails';

const OrdersList = ({ orders, StatusBadge }) => {
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
    <div className="space-y-4 sm:space-y-6">
      {isOrderDetails && (
        <button
          onClick={handleCloseOrderDetails}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-3 text-sm sm:text-base"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
      )}

      {!isOrderDetails ? (
        orders.map((order) => (
          <div
            key={order.orderID}
            className="flex flex-col p-4 sm:p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all"
          >
            <div className="mb-3 sm:mb-0">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">Order #{order.orderID}</h4>
              <div className="mt-1 sm:mt-2">
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                Placed on: {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Total: <span className="font-medium">${order.totalOrderAmount.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex justify-between items-center mt-3 sm:mt-0 sm:self-auto">
              <button
                onClick={() => handleOpenOrderDetails(order.products)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-xs sm:text-sm"
              >
                Order Details
              </button>
              <button 
                onClick={() => handleOpenModal(order)}
                className="ml-2 p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                aria-label="Download order"
              >
                <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-4 sm:mt-6">
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