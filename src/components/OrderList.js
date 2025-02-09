import React, { useState } from 'react';
import Modal from './OrderModal'; // Import the Modal component
import '../../src/OrderReturns.css';

const OrdersList = ({ orders }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <div>
          <h4>Order #{order.orderID}</h4>
          <p>Status: {order.status}</p>
          <p>Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Total: ${order.totalOrderAmount}</p>
          </div>

          {/* Trigger Modal */}
          <div className="order-details-link">
            <button onClick={() => handleOpenModal(order)}>See Order Details</button>
          </div>
          {/* <div className="downloadreceipt">
            <button onClick={() => handleDownloadReceipt(order)}>DownloadIcon</button>
          </div> */}
        </div>
      ))}

      {/* Render the modal when triggered */}
      <Modal show={showModal} onClose={handleCloseModal} order={selectedOrder} />
    </div>
  );
};

export default OrdersList;
