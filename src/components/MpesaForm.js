import React, { useState, useCallback, useMemo } from "react";

const MpesaForm = ({ paymentMethods,setOrderData,
  orderData, subTotal, shippingCost, onMethodSelection }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+254");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize country codes to prevent unnecessary re-renders
  const countryCodes = useMemo(() => [
    { name: "Kenya", code: "+254" },
    { name: "Uganda", code: "+256" },
  ], []);

  // Validate phone number format with useCallback
  const validatePhoneNumber = useCallback((number) => {
    const kenyanPhoneRegex = /^7\d{8}$/;
    return kenyanPhoneRegex.test(number);
  }, []);

  // Format full phone number with useCallback
  const getFullPhoneNumber = useCallback(() => {
    return `${selectedCountryCode.replace("+", "")}${phoneNumber}`;
  }, [selectedCountryCode, phoneNumber]);

  // Handle phone number input with debouncing
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setPhoneNumber(value);
  };

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number (e.g., 712345678)");
      setIsSubmitting(false);
      return;
    }

    setError("");

    try {
      const totalAmount = subTotal + shippingCost;
      const fullPhoneNumber = getFullPhoneNumber();
    // Update order data with payment details
    setOrderData((prevData) => ({
      ...prevData,
      paymentDetails: [
        {
          paymentID: 1, // Assuming Mpesa is payment method ID 1
          paymentReference: fullPhoneNumber, // Full phone number for Daraja API
          phoneNumber: fullPhoneNumber, // Full phone number for display
          paymentMethod: "Mpesa", // Hardcoded since this is the Mpesa form
          amount: totalAmount,
        },
      ],
    }));


      onMethodSelection(false);
    } catch (err) {
      setError("Failed to process payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [phoneNumber, subTotal, shippingCost, setOrderData,
  orderData, onMethodSelection, validatePhoneNumber, getFullPhoneNumber]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">M-Pesa Payment Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            id="countryCode"
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select country code"
          >
            {countryCodes.map((country) => (
              <option 
                key={country.code} 
                value={country.code}
                aria-label={`${country.name} (${country.code})`}
              >
                {country.name} ({country.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              {selectedCountryCode}
            </span>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="712345678"
              pattern="[0-9]{9}"
              maxLength="9"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby="phone-number-format"
              aria-invalid={error ? "true" : "false"}
              required
            />
          </div>
          <p id="phone-number-format" className="text-xs text-gray-500">
            Enter your M-Pesa number without the country code (e.g., 712345678)
          </p>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!phoneNumber || isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${(!phoneNumber || isSubmitting) ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'}`}
            aria-label="Confirm M-Pesa payment"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Confirm Payment'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800">Payment Summary</h3>
        <div className="mt-2 space-y-1 text-sm text-blue-700">
          <p>Subtotal: KES {subTotal.toLocaleString()}</p>
          <p>Shipping: KES {shippingCost.toLocaleString()}</p>
          <p className="font-semibold">Total: KES {(subTotal + shippingCost).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MpesaForm;