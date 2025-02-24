import React from 'react';
import '../../src/CSS/OrderModal.css';

const OrderModal = ({ show, onClose, order }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4 className="modal-title">Order #{order.orderID} Details</h4>

        {/* General Section */}
        <h4>Order #{order.orderID} Details</h4>
        <table className="general-section">
          <tbody>
            <tr>
              <td><strong>Status:</strong></td>
              <td>{order.status}</td>
            </tr>
            <tr>
              <td><strong>Placed on:</strong></td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              {/* <td>{order.orderDate}</td> */}
            </tr>
          </tbody>
        </table>

        {/* Products and Shipping Address Section */}
        <h4>Products and Shipping Address</h4>
        <div className="products-shipping-container">
          {/* Products Section */}
          <div className="products-section">
            <h5>Products</h5>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.productName.length > 50 ? product.productName.slice(0, 50) + '...' : product.productName}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Address Section */}
          <div className="shipping-section">
            <h5>Shipping Address</h5>
            <table className="shipping-address-table">
              <tbody>
                {order.shippingAddress && Object.entries(order.shippingAddress).map(([key, value], index) => (
                  <tr key={index}>
                    <td><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong></td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment and Order Summary Section */}
        <h4>Payment and Order Summary</h4>
        <table className="payment-summary-section">
          <tbody>
            <tr>
              {/* Payment Details Section */}
              <td>
                <h5>Payment Details</h5>
                <table className="payment-details-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Method</th>
                      <th>Phone Number</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.paymentDetails && order.paymentDetails.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.paymentReference}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>{payment.phonenumber}</td>
                        <td>${payment.amount}</td>
                        <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>

              {/* Order Summary Section */}
              <td>
                <h5>Order Summary</h5>
                <table className="order-summary-table">
                  <tbody>
                    <tr>
                      <td>Total Order Amount:</td>
                      <td>${order.totalOrderAmount}</td>
                    </tr>
                    <tr>
                      <td>Total Payment Amount:</td>
                      <td>${order.totalPaymentAmount}</td>
                    </tr>
                    <tr>
                      <td>Total Delivery Fees:</td>
                      <td>${order.totalDeliveryFees}</td>
                    </tr>
                    <tr>
                      <td>Total Tax:</td>
                      <td>${order.totalTax}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Close Button */}
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default OrderModal;