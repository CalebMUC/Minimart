import React, { useState, useCallback } from "react";

const MpesaForm = ({ paymentMethods, setOrderData,orderData, subTotal, shippingCost,onMethodSelection }) => {
  // State for country code and phone number
  const [selectedCountryCode, setSelectedCountryCode] = useState("+254");
  const [paymentData, setPaymentData] = useState({ phoneNumber: "" });
  const [error, setError] = useState("");

  // List of supported country codes
  const countryCodes = [
    { name: "Kenya", code: "+254" },
    { name: "Uganda", code: "+256" },
    // Add more countries as needed
  ];

  // Validate the phone number format
  const validatePhoneNumber = (phoneNumber) => {
    const kenyanPhoneRegex = /^7\d{8}$/; // Kenyan phone numbers start with 7 and have 9 digits
    return kenyanPhoneRegex.test(phoneNumber);
  };

  // Format the phone number for the Daraja API
  const getFullPhoneNumber = () => {
    const countryCode = selectedCountryCode.replace("+", ""); // Remove the '+' from the country code
    return `${countryCode}${paymentData.phoneNumber}`; // Combine country code and phone number
  };

  // Handle payment input changes
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };  

  const handleUseOption = useCallback(() => {
    // Validate the phone number
    if (!validatePhoneNumber(paymentData.phoneNumber)) {
      setError("Invalid phone number. Please enter a valid Kenyan phone number (e.g., 712345678).");
      return;
    }
  
    // Clear any previous errors
    setError("");
  
    // Calculate the total order amount
    const totalOrderedAmount = subTotal + shippingCost;
  
    // Update order data with payment details
    setOrderData((prevData) => ({
      ...prevData,
      paymentDetails: [
        {
          paymentID: 1, // Assuming Mpesa is payment method ID 1
          paymentReference: getFullPhoneNumber(), // Full phone number for Daraja API
          phoneNumber: getFullPhoneNumber(), // Full phone number for display
          paymentMethod: "Mpesa", // Hardcoded since this is the Mpesa form
          amount: totalOrderedAmount,
        },
      ],
    }));
  
    // Close the payment form
    onMethodSelection(false);
  }, [
    paymentData.phoneNumber,
    subTotal,
    shippingCost,
    setOrderData,
    selectedCountryCode,
    onMethodSelection, // Add onMethodSelection to the dependency array
  ]);

  return (
    <div className="payment-form">
      <h3>Enter Mpesa Details</h3>
      <form className="global-form">
        {/* Mpesa Number Input */}
        <div className="form-group">
          <label>Mpesa Number</label>
          <div className="phone-input">
            {/* Country Code Dropdown */}
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>

            {/* Phone Number Input */}
            <input
              type="text"
              name="phoneNumber"
              value={paymentData.phoneNumber}
              onChange={handlePaymentInputChange}
              placeholder="712345678"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Use Option Button */}
        <button
          onClick={handleUseOption}
          type="button"
          disabled={!paymentData.phoneNumber} // Disable if phone number is empty
        >
          Use this Option
        </button>
      </form>
    </div>
  );
};

export default MpesaForm;