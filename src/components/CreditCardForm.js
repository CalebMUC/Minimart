import React, { useState, useCallback } from "react";
import "../../src/checkoupage.css";

const CreditCardForm = ({ paymentMethods, setOrderData, subTotal, shippingCost }) => {
  const [cardDetails, setCardDetails] = useState({
    cardName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Handle input changes for card details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const usethisOption = useCallback(() => {
    if (selectedPaymentMethod === 1 || selectedPaymentMethod === 2) {
      // Calculate total order amount
      const totalOrderedAmount = subTotal + shippingCost;

      // Update order data with payment details
      setOrderData((prevData) => ({
        ...prevData,
        paymentDetails: [
          {
            paymentID: selectedPaymentMethod,
            paymentReference: cardDetails.cardNumber, // Using card number as payment reference
            paymentMethod: paymentMethods.find(
              (method) => method.id === selectedPaymentMethod
            )?.name, // Use the method's name if available
            amount: totalOrderedAmount,
          },
        ],
      }));
    }
  }, [
    selectedPaymentMethod,
    subTotal,
    shippingCost,
    paymentMethods,
    setOrderData,
    cardDetails.cardNumber,
  ]);

  return (
    <div className="payment-form">
      <h3>Enter Credit Card Details</h3>
      <form>
        {/* Name on Card */}
        <div className="form-group">
          <label>Name on Card</label>
          <input
            type="text"
            name="cardName"
            value={cardDetails.cardName}
            onChange={handleInputChange}
            placeholder="Caleb M"
            required
          />
        </div>

        {/* Card Number */}
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            placeholder="xxxx-xxxx-xxxx-xxxx"
            required
          />
        </div>

        {/* Expiration Date */}
        <div className="form-group">
          <label>Expiration Date</label>
          <input
            type="text"
            name="expirationDate"
            value={cardDetails.expirationDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            required
          />
        </div>

        {/* CVV */}
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleInputChange}
            placeholder="123"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => usethisOption()}
          type="button"
          disabled={
            !cardDetails.cardName ||
            !cardDetails.cardNumber ||
            !cardDetails.expirationDate ||
            !cardDetails.cvv ||
            !selectedPaymentMethod
          } // Disable button if required fields are empty
        >
          Use this Option
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;
