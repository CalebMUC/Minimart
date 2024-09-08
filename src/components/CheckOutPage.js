import React, { useState, useEffect } from "react";
import '../../src/checkoupage.css';
import { useLocation } from 'react-router-dom';

const fetchAddress = async () => {
  return {
    name: "Caleb",
    location: "Kiambu, Kenya, Nairobi, Nairobi, 00900, Kenya",
  };
};

const fetchPaymentMethods = async () => {
  return [
    { id: 1, name: "Pay with Mpesa", logo: "/Images/Mpesa.jpeg" },
    { id: 2, name: "Pay with Credit Card", logo: "/Images/card-logo-compact._CB478583243_.gif" },
  ];
};

const fetchCountryCodes = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const codes = data
      .map((country) => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
      }))
      .filter((country) => country.code);
    return codes;
  } catch (error) {
    console.error("Error fetching country codes:", error);
  }
};

const CheckOutPage = () => {
  const location = useLocation();
  const { checkOutData, subtotal } = location.state || {};

  const [address, setAddress] = useState({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+254");
  const [shippingCost, setShippingCost] = useState(81.03); // Static shipping cost, replace with your logic
  const [tax, setTax] = useState(0.00); // Static tax, replace with your logic

  // Step Completion States
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);

  useEffect(() => {
    const loadAddress = async () => {
      const addressData = await fetchAddress();
      setAddress(addressData);
    };

    const loadPaymentMethods = async () => {
      const methods = await fetchPaymentMethods();
      setPaymentMethods(methods);
    };

    const loadCountryCodes = async () => {
      const codes = await fetchCountryCodes();
      setCountryCodes(codes);
    };

    loadAddress();
    loadPaymentMethods();
    loadCountryCodes();
  }, []);

  const handleChangeAddress = () => {
    setShowAddressForm(!showAddressForm);
    resetPaymentAndItems(); // Reset payment and items when changing address
  };

  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setIsPaymentMethodSelected(true);
  };

  const handleCountryCodeChange = (event) => {
    setSelectedCountryCode(event.target.value);
  };

  const resetPaymentAndItems = () => {
    setSelectedPaymentMethod(null);
    setIsPaymentMethodSelected(false);
  };

  const resetItemsSection = () => {
    // Additional logic can be added here if necessary to reset the items section.
  };

  // Calculate the order total
  const totalBeforeTax = subtotal + shippingCost;
  const orderTotal = totalBeforeTax + tax;

  return (
    <div className="MainContainer">
      <div className="left-section">
        {/* Shipping Address Section */}
        <div className="address-section">
          <h2>1. Choose a shipping address</h2>
          <div>
            <a href="#" onClick={handleChangeAddress}>
              {showAddressForm ? "Cancel" : "Change Address"}
            </a>
          </div>

          {!showAddressForm ? (
            <div className="address-card">
              <input
                type="radio"
                name="address"
                checked={isAddressSelected}
                onChange={() => {
                  setIsAddressSelected(true);
                  resetPaymentAndItems(); // Reset when selecting a new address
                }}
              />
              <label>
                <strong>{address.name}</strong> {address.location}
                <a href="#edit" onClick={handleChangeAddress} className="edit-link">
                  Edit address
                </a>
              </label>
            </div>
          ) : (
            <div className="address-form-section">
              <h2>Enter a new shipping address</h2>
              <form>
                <div className="form-group">
                  <label>Full name (First and Last name)</label>
                  <input type="text" placeholder="Caleb M" />
                </div>
                <div className="form-group">
                  <label>Phone number</label>
                  <input type="text" placeholder="Enter phone number" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" placeholder="Street address or P.O. Box" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Apt, suite, unit, building, floor, etc." />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="Enter city" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <select>
                    <option>Select State</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input type="text" placeholder="Enter ZIP Code" />
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" /> Make this my default address
                  </label>
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    className="save-address-btn"
                    onClick={() => {
                      handleChangeAddress();
                      setIsAddressSelected(true);
                      resetPaymentAndItems(); // Reset when form is submitted
                    }}
                  >
                    Use this address
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <hr />

        {/* Payment Method Section */}
        <div className={`payment-section ${!isAddressSelected ? "disabled" : ""}`}>
          <h2>2. Payment method</h2>
          {isAddressSelected && (
            <div className="payment-method">
              {paymentMethods.map((method) => (
                <div key={method.id} className="payment-option">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => handleSelectPaymentMethod(method.id)}
                  />
                  <div className="payment-method-logo">
                    <img src={method.logo} alt={method.name} />
                  </div>
                  <div className="payment-method-name">
                    <p>{method.name}</p>
                  </div>
                </div>
              ))}

              {selectedPaymentMethod && selectedPaymentMethod === 1 && (
                <div className="payment-form">
                  <h3>Enter Mpesa Details</h3>
                  <form>
                    <div className="form-group">
                      <label>Mpesa Number</label>
                      <div className="phone-input">
                        <select value={selectedCountryCode} onChange={handleCountryCodeChange}>
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                        <input type="text" placeholder="794129556" />
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {selectedPaymentMethod && selectedPaymentMethod === 2 && (
                <div className="payment-form">
                  <h3>Enter Credit Card Details</h3>
                  <form>
                    <div className="form-group">
                      <label>Name on card</label>
                      <input type="text" placeholder="Caleb M" />
                    </div>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" />
                    </div>
                    <div className="form-group">
                      <label>Expiration date</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="123" />
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        <hr />

        {/* Items and Shipping Section */}
        <div className={`items-section ${!isPaymentMethodSelected ? "disabled" : ""}`}>
          <h2>3. Items and shipping</h2>
          {checkOutData && checkOutData.length > 0 ? (
            <div className="items-list">
              {checkOutData.map((item, index) => (
                <div key={index} className="productItem">
                  <div className="productImage">
                    <img src={`/images/${item.productImage}`} alt={item.productName} />
                  </div>
                  <div className="productDetails">
                    <p>{item.productName}</p>
                    <p>{item.quantity} pcs</p>
                  </div>
                </div>
              ))}
              <div className="subtotal-section">
                <p>Subtotal: Ksh {subtotal}</p>
              </div>
            </div>
          ) : (
            <p>No items in the checkout.</p>
          )}
        </div>
      </div>

      <div className="right-section">
        {/* Order Summary Section */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Items ({checkOutData?.length || 0}):</span>
            <span>Ksh {subtotal}</span>
          </div>
          <div className="summary-item">
            <span>Shipping & handling:</span>
            <span>Ksh {shippingCost}</span>
          </div>
          <div className="summary-item">
            <span>Total before tax:</span>
            <span>Ksh {totalBeforeTax}</span>
          </div>
          <div className="summary-item">
            <span>Estimated tax:</span>
            <span>Ksh {tax}</span>
          </div>
          <div className="order-total">
            <span>Order total:</span>
            <span>Ksh {orderTotal}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={!isPaymentMethodSelected || !isAddressSelected}
          >
            Place your order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
