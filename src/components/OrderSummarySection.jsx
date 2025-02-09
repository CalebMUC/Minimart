import '../../src/checkoupage.css';
import React from "react";

const OrderSummary = ({ checkOutData, totalOrderedAmount, totalDeliveryFees, totalPaymentAmount,PlaceOrder }) => {
    return (
      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="summary-item">
          <span>Items ({checkOutData.length || 0}):</span>
          <span>Ksh {totalOrderedAmount.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Shipping & handling:</span>
          <span>Ksh {totalDeliveryFees.toFixed(2)}</span>
        </div>
        {/* <div className="summary-item">
          <span>Total before tax:</span>
          <span>Ksh {(totalOrderedAmount + totalDeliveryFees).toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Estimated tax:</span>
          <span>Ksh {totalTax.toFixed(2)}</span>
        </div> */}
        <div className="order-total">
          <span>Order total:</span>
          <span>Ksh {totalPaymentAmount.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={PlaceOrder}>Place your order</button>
      </div>
    );
  };

  export default OrderSummary;